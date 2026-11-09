import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, copyFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawn, execFileSync } from 'node:child_process'
import { randomBytes, createHash } from 'node:crypto'
import { createServer } from 'node:net'
import PocketBase from 'pocketbase'

// Disposable local database and synthetic records only. No remote URL accepted.
test('ORBIX staging: restricted access, exact payload and duplicate protection', async t => {
  assert.ok(process.env.POCKETBASE_BIN, 'POCKETBASE_BIN is required')
  const binary = resolve(process.env.POCKETBASE_BIN)
  const root = await mkdtemp(join(tmpdir(), 'orbix-staging-'))
  const migrations = join(root, 'migrations')
  await mkdir(migrations)
  const args = ['--dir',join(root,'data'),'--migrationsDir',migrations,'--hooksDir',join(root,'hooks'),'--automigrate=false','--dev=false']
  let server
  try {
    const names = await readdir(new URL('../pocketbase/migrations/', import.meta.url))
    const stagingMigrations = names.filter(n => /^\d+_orbix_restricted_staging(?:_link)?\.js$/.test(n)).sort()
    assert.ok(stagingMigrations.length, 'Restricted staging migration is missing')
    for (const name of stagingMigrations) await copyFile(new URL('../pocketbase/migrations/'+name,import.meta.url),join(migrations,name))
    execFileSync(binary,['migrate','up',...args],{stdio:'pipe'})
    const password = randomBytes(24).toString('hex')
    execFileSync(binary,['superuser','upsert','local-test@example.invalid',password,...args],{stdio:'pipe'})
    const listener = createServer()
    await new Promise(resolve => listener.listen(0,'127.0.0.1',resolve))
    const port = listener.address().port
    await new Promise(resolve => listener.close(resolve))
    const url = `http://127.0.0.1:${port}`
    server = spawn(binary,['serve','--http',`127.0.0.1:${port}`,...args],{stdio:['ignore','pipe','pipe']})
    let startupError = ''
    server.stdout.on('data',chunk=>{startupError += chunk.toString()})
    server.stderr.on('data',chunk=>{startupError += chunk.toString()})
    let ready = false, healthStatus = 'not checked'
    for (let i=0;i<100;i++) {
      try { const response = await fetch(url+'/api/health'); healthStatus = String(response.status); if(response.ok){ready=true;break} } catch (error) {healthStatus = error.cause?.code || error.message}
      await new Promise(resolve => setTimeout(resolve,100))
    }
    assert.ok(ready,'Local server health: '+healthStatus+' exit '+server.exitCode+' '+startupError.replace(/[A-Za-z0-9_-]{40,}/g,'[redacted]').slice(-1500))
    const admin = new PocketBase(url)
    await admin.collection('_superusers').authWithPassword('local-test@example.invalid',password)
    const create = (name,data) => admin.collection(name).create(data)
    const batch = await create('_orbix_import_batches',{source_project:'fixture',source_system:'synthetic',label:'Local only',status:'staged'})
    const payload = '{"id":"synthetic-source","amount":9007199254740993.123400,"name":"ação","nested":{"line":"a\\nb"}}'
    const hash = createHash('sha256').update(payload).digest('hex')
    const input = {batch_id:batch.id,source_project:'fixture',source_table:'example',source_id:'synthetic-source',payload_text:payload,sha256:hash}
    const record = await create('_orbix_source_records',input)
    const fileInput = {batch_id:batch.id,source_project:'fixture',bucket:'private',object_path:'nested/example.pdf',source_id:'synthetic-object',sha256:hash,size_bytes:3,metadata_text:'{"mimetype":"application/pdf"}'}
    const file = await create('_orbix_source_files',fileInput)

    await t.test('all collection rules are null and files are protected',async () => {
      for(const name of ['_orbix_import_batches','_orbix_source_records','_orbix_source_files']) {
        const col = await admin.collections.getOne(name)
        for(const op of ['list','view','create','update','delete']) assert.equal(col[op+'Rule'],null)
        if(name==='_orbix_import_batches') for(const field of ['database_export','storage_export']) {
          const f = col.fields.find(f=>f.name===field)
          assert.equal(f.type,'file'); assert.equal(f.protected,true); assert.equal(f.maxSelect,1)
          assert.deepEqual(f.mimeTypes,['application/zip'])
        }
      }
    })
    await t.test('decimal lexemes, Unicode, nested JSON and payload hash survive',async () => {
      const result = await admin.collection('_orbix_source_records').getOne(record.id)
      assert.equal(result.payload_text,payload)
      assert.equal(createHash('sha256').update(result.payload_text).digest('hex'),hash)
      const large = 'x'.repeat(15000)
      const second = await create('_orbix_source_records',{...input,source_id:'large',payload_text:large})
      assert.equal((await admin.collection('_orbix_source_records').getOne(second.id)).payload_text,large)
    })
    await t.test('same batch cannot duplicate source records or object paths',async () => {
      await assert.rejects(()=>create('_orbix_source_records',input),e=>e.status===400)
      await assert.rejects(()=>create('_orbix_source_files',fileInput),e=>e.status===400)
      await assert.rejects(()=>create('_orbix_source_records',{...input,source_id:'bad',batch_id:'missingbatch123'}),e=>e.status===400)
    })
    await t.test('anonymous and ordinary users cannot read or write staging',async () => {
      await create('users',{email:'ordinary@example.invalid',password,passwordConfirm:password})
      const ordinary = new PocketBase(url)
      await ordinary.collection('users').authWithPassword('ordinary@example.invalid',password)
      for(const client of [new PocketBase(url),ordinary]) for(const [name,id] of [['_orbix_import_batches',batch.id],['_orbix_source_records',record.id],['_orbix_source_files',file.id]]) {
        for(const action of [()=>client.collection(name).getList(),()=>client.collection(name).getOne(id),()=>client.collection(name).create({}),()=>client.collection(name).update(id,{label:'changed'}),()=>client.collection(name).delete(id)]) {
          await assert.rejects(action,e=>e.status===403 || e.status===404)
        }
      }
    })
    await t.test('batch removal cannot silently remove dependent records',async () => {
      await assert.rejects(()=>admin.collection('_orbix_import_batches').delete(batch.id),e=>e.status===400)
      assert.equal((await admin.collection('_orbix_source_records').getOne(record.id)).payload_text,payload)
    })
    await t.test('migration rollback preserves populated provenance and uniqueness',async () => {
      const output = execFileSync(binary,['migrate','down','1',...args],{input:'y\n',encoding:'utf8'})
      assert.match(output,/rollback blocked/)
      const col = await admin.collections.getOne('_orbix_source_records')
      assert.ok(col.fields.some(f=>f.name==='batch_id' && f.required))
      assert.ok(col.indexes.some(i=>/UNIQUE/.test(i)))
      assert.equal((await admin.collection('_orbix_source_records').getOne(record.id)).payload_text,payload)
    })
  } finally {
    if(server && server.exitCode===null) {const closed=new Promise(resolve=>server.once('close',resolve));server.kill('SIGTERM');await closed}
    await rm(root,{recursive:true,force:true})
  }
})
