import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { spawn } from 'node:child_process'
const { chromium }=createRequire(import.meta.url)('playwright')

// UI-only synthetic responses. Authorization and hooks are tested with real PB separately.
test('migration console UI: access, reconciliation, ZIP verification and mobile layout',async t=>{
  const app='http://127.0.0.1:18111',api='http://127.0.0.1:18110'
  const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','18111','--strictPort'],{env:{...process.env,VITE_POCKETBASE_URL:api},stdio:'ignore'})
  let browser
  try {
    let ready=false
    for(let i=0;i<100;i++){try{if((await fetch(app)).ok){ready=true;break}}catch{}await new Promise(resolve=>setTimeout(resolve,100))}
    assert.ok(ready,'Local app unavailable')
    browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:process.env.PLAYWRIGHT_CHROMIUM_SINGLE_PROCESS==='1'?['--single-process','--no-zygote','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']:[]})
    const page=await browser.newPage({viewport:{width:1440,height:1050}})
    const errors=[];page.on('pageerror',e=>errors.push(e.message))
    const digest=value=>createHash('sha256').update(value).digest('hex')
    const archive=Buffer.from('504b0506000000000000000000000000000000000000','hex')
    const batch={id:'fixturebatch001',collectionName:'_orbix_import_batches',source_project:'synthetic',label:'Lote de demonstração',manifest_sha256:digest('manifest'),record_count:1,file_count:0,database_export:'',storage_export:''}
    const payload='{"id":"fixture","amount":9007199254740993.123400}'
    const row={source_project:'synthetic',source_table:'example',source_id:'fixture',payload_text:payload,sha256:digest(payload)}
    const spec={sha256:digest(archive),size_bytes:archive.length}
    const bundle={schema_version:1,manifest_sha256:batch.manifest_sha256,records:[row],files:[],archives:{database_export:spec,storage_export:spec}}
    const jsonInput=value=>({name:'synthetic.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(value))})
    let mode='no-access',corrupt=false,creates=0,updates=0
    const records=[]
    await page.route(api+'/**',async route=>{
      const req=route.request(),path=new URL(req.url()).pathname
      if(path==='/api/files/token')return route.fulfill({json:{token:'synthetic-file-token'}})
      if(path.startsWith('/api/files/'))return route.fulfill({contentType:'application/zip',body:corrupt?Buffer.from('corrupt'):archive})
      if(path.includes('/_orbix_import_batches/')) {
        if(req.method()==='PATCH'){updates++;batch.database_export='synthetic_archive.zip';return route.fulfill({json:{...batch}})}
        if(path.endsWith('/'+batch.id))return route.fulfill({json:{...batch}})
        const items=mode==='no-access'?[]:[{...batch}]
        return route.fulfill({json:{page:1,perPage:500,totalPages:1,totalItems:items.length,items}})
      }
      if(path.includes('/_orbix_source_records/')) {
        if(req.method()==='POST'){creates++;const data={...req.postDataJSON(),id:'syntheticrecord'};records.push(data);return route.fulfill({json:data})}
        return route.fulfill({json:{page:1,perPage:500,totalPages:1,totalItems:records.length,items:records}})
      }
      if(path.includes('/_orbix_source_files/'))return route.fulfill({json:{page:1,perPage:500,totalPages:1,totalItems:0,items:[]}})
      let items=[]
      if(path.includes('/configurations/'))items=[{id:'configfixture01',name:'contracted_modules',data:{modules:['Financeiro']}}]
      return route.fulfill({json:{page:1,perPage:500,totalPages:1,totalItems:items.length,items}})
    })
    await t.test('anonymous route redirects to credential-empty login',async()=>{
      await page.goto(app+'/app/migracao-orbix');await page.waitForURL('**/login')
      assert.equal(await page.getByLabel('Senha',{exact:true}).inputValue(),'')
    })
    const token=`test.${Buffer.from(JSON.stringify({exp:Math.floor(Date.now()/1000)+3600})).toString('base64url')}.test`
    await page.evaluate(token=>localStorage.setItem('pocketbase_auth',JSON.stringify({token,record:{id:'fixtureoperator',collectionName:'users',collectionId:'_pb_users_auth_',email:'operator@example.invalid'}})),token)
    await t.test('missing authorization is explicit and exposes no upload actions',async()=>{
      await page.goto(app+'/app/migracao-orbix');await page.getByText('Acesso ao lote pendente',{exact:true}).waitFor()
      assert.equal(await page.getByRole('button',{name:'Conferir e importar pacote',exact:true}).count(),0)
      assert.equal(creates,0)
    })
    await t.test('tampered bundle is rejected before any write',async()=>{
      mode='authorized';await page.reload();await page.getByLabel('Pacote de migração (JSON)',{exact:true}).waitFor()
      await page.getByLabel('Pacote de migração (JSON)',{exact:true}).setInputFiles(jsonInput({...bundle,records:[{...row,sha256:'0'.repeat(64)}]}))
      await page.getByRole('alert').filter({hasText:'hash esperado'}).waitFor();assert.equal(creates,0)
    })
    await t.test('bundle import resumes without duplicating previously matching origins',async()=>{
      await page.getByLabel('Pacote de migração (JSON)',{exact:true}).setInputFiles(jsonInput(bundle))
      await page.getByText(/Pacote e hashes locais conferidos/).waitFor()
      await page.getByRole('button',{name:'Conferir e importar pacote',exact:true}).click()
      await page.getByText(/Novos: 1 · Iguais no destino: 0/).waitFor()
      assert.equal(creates,1);assert.equal(records[0].payload_text,payload)
      await page.getByRole('button',{name:'Conferir e importar pacote',exact:true}).click()
      await page.getByText(/Novos: 0 · Iguais no destino: 1/).waitFor();assert.equal(creates,1)
    })
    await t.test('ZIP mismatch is rejected; stored bytes are explicitly verified',async()=>{
      await page.getByLabel('Arquivo do banco (ZIP)',{exact:true}).setInputFiles({name:'wrong.zip',mimeType:'application/zip',buffer:Buffer.from('wrong')})
      await page.getByRole('button',{name:'Enviar banco',exact:true}).click()
      await page.getByRole('alert').filter({hasText:'ZIP selecionado difere'}).waitFor();assert.equal(updates,0)
      await page.getByLabel('Arquivo do banco (ZIP)',{exact:true}).setInputFiles({name:'synthetic.zip',mimeType:'application/zip',buffer:archive})
      await page.getByRole('button',{name:'Enviar banco',exact:true}).click()
      await page.getByRole('button',{name:'Conferir banco',exact:true}).waitFor();assert.equal(updates,1)
      await page.getByRole('button',{name:'Conferir banco',exact:true}).click()
      await page.getByText('Arquivo gravado e conferido',{exact:true}).waitFor()
      corrupt=true
      await page.getByRole('button',{name:'Conferir banco',exact:true}).click()
      await page.getByRole('alert').filter({hasText:'arquivo gravado difere'}).waitFor()
      assert.equal(await page.getByText('Arquivo gravado e conferido',{exact:true}).count(),0)
    })
    await t.test('mobile layout preserves selection and upload controls',async()=>{
      await page.setViewportSize({width:390,height:844})
      const select=await page.getByLabel('Lote autorizado',{exact:true}).boundingBox()
      assert.ok(select.x>=0&&select.x+select.width<=390)
      assert.deepEqual(errors,[])
    })
    if(process.env.ORBIX_UI_SCREENSHOT){
      corrupt=false;await page.setViewportSize({width:1440,height:1200})
      await page.getByRole('button',{name:'Conferir banco',exact:true}).click()
      await page.getByText('Arquivo gravado e conferido',{exact:true}).waitFor()
      await page.screenshot({path:process.env.ORBIX_UI_SCREENSHOT,fullPage:false})
    }
  } finally {
    await browser?.close()
    const closed=new Promise(resolve=>server.once('close',resolve));server.kill('SIGTERM');await closed
  }
})
