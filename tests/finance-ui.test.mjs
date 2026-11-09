import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
const { chromium } = createRequire(import.meta.url)('playwright')

// Browser contract tests with synthetic responses. Real API rules are tested
// separately in finance-isolation.test.mjs against a disposable PocketBase.
test('interface do piloto: sessão, seleção, leitura e falha explícita', async t => {
  const app = 'http://127.0.0.1:18101'
  const api = 'http://127.0.0.1:18100'
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','18101','--strictPort'], {
    env: {...process.env,VITE_POCKETBASE_URL:api},stdio:'ignore',
  })
  let browser
  try {
    let ready=false
    for(let i=0;i<100;i++){
      try{if((await fetch(app)).ok){ready=true;break}}catch{}
      await new Promise(resolve=>setTimeout(resolve,100))
    }
    assert.ok(ready,'Vite failed to start')
    browser = await chromium.launch({headless:true})
    const page = await browser.newPage()
    let mode='normal'
    let delayed=false
    const writes=[]
    const errors=[]
    page.on('pageerror',e=>errors.push(e.message))
    await page.route(`${api}/**`,async route=>{
      const request=route.request()
      const path=new URL(request.url()).pathname
      if (request.method()!=='GET' && /financial_transactions|finance_companies|finance_memberships/.test(path)) writes.push(path)
      let items=[]
      if(path.includes('/configurations/'))items=[{id:'configtest00001',name:'contracted_modules',data:{modules:['Financeiro']}}]
      if(path.includes('/finance_companies/')){
        if(mode==='failure')return route.fulfill({status:503,json:{message:'Test database unavailable'}})
        items=mode==='no-access'?[]:[{id:'companya0000001',name:'Empresa teste A',active:true},{id:'companyb0000001',name:'Empresa teste B',active:true}]
      }
      if(path.includes('/financial_transactions/')){
        const isB=new URL(request.url()).searchParams.get('filter')?.includes('companyb0000001')
        if(mode==='delayed' && !isB){delayed=true;await new Promise(resolve=>setTimeout(resolve,600))}
        items=[{id:isB?'b':'a',company_id:isB?'companyb0000001':'companya0000001',description:isB?'Conta teste B':'Conta teste A',amount:isB?200:100,type:'income',status:'pending',due_date:'2026-11-15 00:00:00.000Z'}]
      }
      await route.fulfill({json:{page:1,perPage:500,totalItems:items.length,totalPages:1,items}})
    })
    await t.test('rota sem sessão redireciona para login',async()=>{
      await page.goto(`${app}/app/financeiro/orbix-piloto`)
      await page.waitForURL('**/login')
    })
    const token=`test.${Buffer.from(JSON.stringify({exp:Math.floor(Date.now()/1000)+3600})).toString('base64url')}.test`
    await page.evaluate(({token})=>localStorage.setItem('pocketbase_auth',JSON.stringify({token,record:{id:'testuser0000001',collectionName:'users',collectionId:'_pb_users_auth_',email:'ui@example.invalid'}})),{token})
    await t.test('empresa autorizada apresenta registros e troca sem misturar valores',async()=>{
      await page.goto(`${app}/app/financeiro/orbix-piloto`)
      await page.getByText('Conta teste A',{exact:true}).waitFor()
      await page.getByLabel('Empresa',{exact:true}).selectOption('companyb0000001')
      await page.getByText('Conta teste B',{exact:true}).waitFor()
      assert.equal(await page.getByText('Conta teste A',{exact:true}).count(),0)
    })
    await t.test('resposta atrasada da empresa anterior é descartada',async()=>{
      mode='delayed'
      await page.getByLabel('Empresa',{exact:true}).selectOption('companya0000001')
      await page.waitForFunction(()=>document.body.textContent.includes('Consultando empresa'))
      for(let i=0;i<50&&!delayed;i++)await new Promise(resolve=>setTimeout(resolve,20))
      assert.ok(delayed)
      await page.getByLabel('Empresa',{exact:true}).selectOption('companyb0000001')
      await page.getByText('Conta teste B',{exact:true}).waitFor()
      await new Promise(resolve=>setTimeout(resolve,700))
      assert.equal(await page.getByText('Conta teste A',{exact:true}).count(),0)
    })
    await t.test('falha do banco não exibe saldo zero nem registros antigos',async()=>{
      mode='failure'
      await page.getByRole('button',{name:'Atualizar'}).click()
      await page.getByRole('alert').filter({hasText:'Não interpretar como saldo zero'}).waitFor()
      assert.equal(await page.getByText('A receber',{exact:true}).count(),0)
      assert.equal(await page.getByText('Conta teste B',{exact:true}).count(),0)
    })
    await t.test('sem vínculo apresenta pendência e não saldo financeiro',async()=>{
      mode='no-access'
      await page.getByRole('button',{name:'Atualizar'}).click()
      await page.getByRole('alert').filter({hasText:'Nenhuma empresa'}).waitFor()
      assert.equal(await page.getByText('A receber',{exact:true}).count(),0)
      assert.deepEqual(writes,[])
      assert.deepEqual(errors,[])
    })
    await t.test('layout em celular mantém seleção e mensagem legíveis',async()=>{
      mode='normal'
      await page.setViewportSize({width:390,height:844})
      await page.getByRole('button',{name:'Atualizar'}).click()
      await page.getByText('Conta teste B',{exact:true}).waitFor()
      const select=await page.getByLabel('Empresa',{exact:true}).boundingBox()
      assert.ok(select.x>=0&&select.x+select.width<=390)
    })
  } finally {
    await browser?.close()
    const closed=new Promise(resolve=>server.once('close',resolve))
    server.kill('SIGTERM')
    await closed
  }
})
