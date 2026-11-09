import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, copyFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawn, execFileSync } from 'node:child_process'
import { randomBytes, createHash } from 'node:crypto'
import { createServer } from 'node:net'
import PocketBase from 'pocketbase'
import { importBundle, validateBundle, uploadArchive, verifyArchive } from '../src/features/orbix-migration/migration-client.ts'

test('batch-scoped migration console with real local PocketBase',async t=>{
  assert.ok(process.env.POCKETBASE_BIN)
  const binary=resolve(process.env.POCKETBASE_BIN),root=await mkdtemp(join(tmpdir(),'orbix-console-'))
  const migrations=join(root,'migrations'),hooks=join(root,'hooks')
  await mkdir(migrations);await mkdir(hooks)
  const args=['--dir',join(root,'data'),'--migrationsDir',migrations,'--hooksDir',hooks,'--automigrate=false','--dev=false']
  let server
  try {
    for(const name of ['0028_orbix_restricted_staging.js','0029_orbix_restricted_staging_link.js','0030_orbix_migration_operators.js','0031_orbix_migration_console_access.js'])await copyFile(new URL('../pocketbase/migrations/'+name,import.meta.url),join(migrations,name))
    await copyFile(new URL('../pocketbase/hooks/orbix_staging_integrity.pb.js',import.meta.url),join(hooks,'orbix_staging_integrity.pb.js'))
    const migrationResult=execFileSync(binary,['migrate','up',...args],{encoding:'utf8'})
    assert.doesNotMatch(migrationResult,/Error:/)
    const password=randomBytes(24).toString('hex')
    execFileSync(binary,['superuser','upsert','local@example.invalid',password,...args],{stdio:'pipe'})
    const listener=createServer();await new Promise(resolve=>listener.listen(0,'127.0.0.1',resolve));const port=listener.address().port;await new Promise(resolve=>listener.close(resolve))
    const url=`http://127.0.0.1:${port}`
    server=spawn(binary,['serve','--http',`127.0.0.1:${port}`,...args],{stdio:['ignore','pipe','pipe']});server.stdout.resume();server.stderr.resume()
    let ready=false
    for(let i=0;i<100;i++){try{if((await fetch(url+'/api/health')).ok){ready=true;break}}catch{}await new Promise(resolve=>setTimeout(resolve,100))}
    assert.ok(ready,'Local fixture server unavailable')
    const admin=new PocketBase(url);await admin.collection('_superusers').authWithPassword('local@example.invalid',password)
    const create=(name,data)=>admin.collection(name).create(data)
    const digest=text=>createHash('sha256').update(text).digest('hex')
    const batch=project=>create('_orbix_import_batches',{source_project:project,source_system:'synthetic',label:'Synthetic local batch',status:'staged',manifest_sha256:digest(project),record_count:1,file_count:0})
    const batchA=await batch('fixture-a'),batchB=await batch('fixture-b')
    const person=async name=>{const record=await create('users',{email:name+'@example.invalid',password,passwordConfirm:password});const client=new PocketBase(url);await client.collection('users').authWithPassword(name+'@example.invalid',password);return {record,client}}
    const a=await person('operator-a'),b=await person('operator-b'),outsider=await person('outsider')
    const operator=(who,target,extra={})=>create('_orbix_migration_operators',{user_id:who.record.id,batch_id:target.id,active:true,can_read:true,can_upload:true,expires_at:new Date(Date.now()+86400000).toISOString(),...extra})
    assert.equal((await admin.collection('_orbix_migration_operators').getFullList()).length,0,'No operator may be seeded')
    const opA=await operator(a,batchA),opB=await operator(b,batchB)
    const readonlyB=await operator(a,batchB,{can_read:false,can_upload:false})
    const payload='{"id":"fixture","amount":9007199254740993.123400,"name":"ação"}'
    const row={source_project:batchA.source_project,source_table:'example',source_id:'fixture',payload_text:payload,sha256:digest(payload)}
    const archive=Buffer.from('504b0506000000000000000000000000000000000000','hex')
    const archiveSpec={sha256:digest(archive),size_bytes:archive.length}
    const bundle={schema_version:1,manifest_sha256:batchA.manifest_sha256,records:[row],files:[],archives:{database_export:archiveSpec,storage_export:archiveSpec}}
    const denied=async fn=>assert.rejects(fn,e=>[400,403,404].includes(e.status))

    await t.test('operators see only their authorized batch; outsiders and guests see none',async()=>{
      assert.deepEqual((await a.client.collection('_orbix_import_batches').getFullList()).map(r=>r.id),[batchA.id])
      assert.deepEqual((await b.client.collection('_orbix_import_batches').getFullList()).map(r=>r.id),[batchB.id])
      for(const client of [outsider.client,new PocketBase(url)])assert.deepEqual(await client.collection('_orbix_import_batches').getFullList(),[])
      await denied(()=>a.client.collection('_orbix_import_batches').getOne(batchB.id))
    })
    await t.test('ordinary users cannot grant or edit operator permissions',async()=>{
      await denied(()=>a.client.collection('_orbix_migration_operators').create({user_id:a.record.id,batch_id:batchB.id,active:true,can_read:true,can_upload:true}))
      await denied(()=>a.client.collection('_orbix_migration_operators').update(opA.id,{can_upload:true}))
      await denied(()=>outsider.client.collection('_orbix_migration_operators').getList())
    })
    await t.test('upload capability cannot be inherited from another authorized batch',async()=>{
      await admin.collection('_orbix_migration_operators').update(readonlyB.id,{can_read:true})
      assert.equal((await a.client.collection('_orbix_import_batches').getFullList()).length,2)
      await denied(()=>a.client.collection('_orbix_source_records').create({...row,batch_id:batchB.id,source_project:batchB.source_project,source_id:'readonly-cross-write'}))
      await admin.collection('_orbix_migration_operators').update(readonlyB.id,{can_read:false})
    })
    await t.test('preflight refuses tampered payloads and duplicate origins before writing',async()=>{
      await assert.rejects(()=>validateBundle({...bundle,records:[{...row,payload_text:payload+' '}]},batchA),/hash/)
      await assert.rejects(()=>validateBundle({...bundle,records:[row,row]}, {...batchA,record_count:2}),/duplicadas/)
      assert.equal((await admin.collection('_orbix_source_records').getFullList()).length,0)
    })
    await t.test('import reconciles and resumes without duplicates, preserving numeric lexemes',async()=>{
      const result=await importBundle(a.client,batchA,bundle,()=>{})
      assert.equal(result.created,1)
      const again=await importBundle(a.client,batchA,bundle,()=>{})
      assert.equal(again.created,0);assert.equal(again.skipped,1)
      const rows=await a.client.collection('_orbix_source_records').getFullList()
      assert.equal(rows.length,1);assert.equal(rows[0].payload_text,payload)
      assert.deepEqual(await b.client.collection('_orbix_source_records').getFullList(),[])
      await denied(()=>b.client.collection('_orbix_source_records').getOne(rows[0].id))
    })
    await t.test('server rejects forged hashes, secret credentials and cross-batch writes',async()=>{
      await denied(()=>a.client.collection('_orbix_source_records').create({...row,batch_id:batchA.id,source_id:'bad-hash',sha256:'0'.repeat(64)}))
      const secretPayload='{"token":"synthetic-must-not-import"}'
      await denied(()=>a.client.collection('_orbix_source_records').create({...row,batch_id:batchA.id,source_table:'user_invitations',source_id:'bad-secret',payload_text:secretPayload,sha256:digest(secretPayload)}))
      await denied(()=>a.client.collection('_orbix_source_records').create({...row,batch_id:batchB.id,source_project:batchB.source_project,source_id:'cross'}))
      await denied(()=>a.client.collection('_orbix_source_records').create({...row,batch_id:batchA.id,source_project:'wrong-project',source_id:'wrong'}))
      const template='{"token_key":"template_variable"}'
      const allowed=await a.client.collection('_orbix_source_records').create({...row,batch_id:batchA.id,source_table:'document_template_variables',source_id:'template',payload_text:template,sha256:digest(template)})
      await denied(()=>a.client.collection('_orbix_source_records').update(allowed.id,{payload_text:'changed'}))
      await denied(()=>a.client.collection('_orbix_source_records').delete(allowed.id))
    })
    await t.test('client halts on unexpected destination contents instead of overwriting',async()=>{
      await assert.rejects(()=>importBundle(a.client,batchA,bundle,()=>{}),/destino contém/)
    })
    await t.test('file index enforces scope, valid paths, size, uniqueness and immutability',async()=>{
      const data={batch_id:batchA.id,source_project:batchA.source_project,bucket:'private',object_path:'folder/example.pdf',source_id:'file-fixture',sha256:digest('x'),size_bytes:1,metadata_text:'{}'}
      const record=await a.client.collection('_orbix_source_files').create(data)
      assert.equal((await a.client.collection('_orbix_source_files').getFullList()).length,1)
      assert.deepEqual(await b.client.collection('_orbix_source_files').getFullList(),[])
      await denied(()=>b.client.collection('_orbix_source_files').getOne(record.id))
      await denied(()=>a.client.collection('_orbix_source_files').create(data))
      await denied(()=>a.client.collection('_orbix_source_files').create({...data,source_id:'invalid-path',object_path:'../outside.pdf'}))
      await denied(()=>a.client.collection('_orbix_source_files').create({...data,source_id:'invalid-size',object_path:'other.pdf',size_bytes:-1}))
      await denied(()=>a.client.collection('_orbix_source_files').create({...data,batch_id:batchB.id,source_project:batchB.source_project}))
      await denied(()=>a.client.collection('_orbix_source_files').update(record.id,{sha256:'0'.repeat(64)}))
      await denied(()=>a.client.collection('_orbix_source_files').delete(record.id))
    })
    await t.test('only ZIP fields can change; archive bytes remain protected and verifiable',async()=>{
      await denied(()=>a.client.collection('_orbix_import_batches').update(batchA.id,{status:'verified'}))
      await denied(()=>a.client.collection('_orbix_import_batches').update(batchA.id,{source_project:'different'}))
      await denied(()=>a.client.collection('_orbix_import_batches').delete(batchA.id))
      const file=new File([archive],'synthetic.zip',{type:'application/zip'})
      const uploaded=await uploadArchive(a.client,batchA,bundle,'database_export',file)
      assert.ok(uploaded.database_export)
      await verifyArchive(a.client,uploaded,bundle,'database_export')
      const anonymousURL=a.client.files.getURL(uploaded,uploaded.database_export)
      assert.ok([400,403,404].includes((await fetch(anonymousURL)).status))
      const wrongToken=await b.client.files.getToken()
      assert.ok([400,403,404].includes((await fetch(b.client.files.getURL(uploaded,uploaded.database_export,{token:wrongToken}))).status))
      const replacement=new FormData();replacement.set('database_export',file)
      await denied(()=>a.client.collection('_orbix_import_batches').update(batchA.id,replacement))
      await denied(()=>a.client.collection('_orbix_import_batches').update(batchA.id,{database_export:''}))
    })
    await t.test('revocation immediately closes existing sessions and file tokens',async()=>{
      const uploaded=await a.client.collection('_orbix_import_batches').getOne(batchA.id)
      const token=await a.client.files.getToken()
      const fileURL=a.client.files.getURL(uploaded,uploaded.database_export,{token})
      await admin.collection('_orbix_migration_operators').update(opA.id,{active:false})
      assert.deepEqual(await a.client.collection('_orbix_import_batches').getFullList(),[])
      assert.deepEqual(await a.client.collection('_orbix_source_records').getFullList(),[])
      assert.ok([400,403,404].includes((await fetch(fileURL)).status))
      await denied(()=>a.client.collection('_orbix_source_records').create({...row,batch_id:batchA.id,source_id:'after-revoke'}))
      await admin.collection('_orbix_migration_operators').update(opB.id,{can_upload:false})
      assert.equal((await b.client.collection('_orbix_import_batches').getFullList()).length,1)
      await denied(()=>b.client.collection('_orbix_source_records').create({...row,batch_id:batchB.id,source_project:batchB.source_project}))
      await admin.collection('_orbix_migration_operators').update(opB.id,{expires_at:new Date(Date.now()-1000).toISOString()})
      assert.deepEqual(await b.client.collection('_orbix_import_batches').getFullList(),[])
    })
  } finally {
    if(server && server.exitCode===null){const closed=new Promise(resolve=>server.once('close',resolve));server.kill('SIGTERM');await closed}
    await rm(root,{recursive:true,force:true})
  }
})
