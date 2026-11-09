import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, copyFile, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawn, execFileSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { createServer } from 'node:net'
import PocketBase from 'pocketbase'
import { readFinanceCompanies, readCompanyFinance } from '../src/features/orbix-finance/finance-reader.ts'

// Always creates a disposable local database. Never accepts a remote URL.
test('PocketBase: isolamento financeiro por empresa e bloqueio de escrita', async t => {
  assert.ok(process.env.POCKETBASE_BIN, 'Defina POCKETBASE_BIN para um executável PocketBase 0.26.6')
  const binary = resolve(process.env.POCKETBASE_BIN)
  const root = await mkdtemp(join(tmpdir(), 'mad-finance-'))
  const migrations = join(root, 'migrations')
  await mkdir(migrations)
  const args = ['--dir', join(root, 'data'), '--migrationsDir', migrations, '--hooksDir', join(root, 'hooks'), '--automigrate=false']
  let server
  try {
    // Minimal legacy schema, without executing historical demo/password seeds.
    await writeFile(join(migrations, '0000_fixture.js'), `migrate(app => {
      for (const name of ['financial_transactions', 'dashboard_goals']) {
        const fields = name === 'financial_transactions' ? [
          {name:'description',type:'text'}, {name:'type',type:'select',values:['income','expense']},
          {name:'amount',type:'number'}, {name:'due_date',type:'date'},
          {name:'status',type:'select',values:['pending','paid','overdue','cancelled']}
        ] : [{name:'month',type:'text'}, {name:'target_revenue',type:'number'}]
        const col = new Collection({name,type:'base',listRule:"@request.auth.id != ''",viewRule:"@request.auth.id != ''",createRule:"@request.auth.id != ''",updateRule:"@request.auth.id != ''",deleteRule:"@request.auth.id != ''",fields,
          indexes: name === 'dashboard_goals' ? ['CREATE UNIQUE INDEX idx_dash_goals_month ON dashboard_goals (month)'] : []})
        app.save(col)
        const legacy = new Record(col)
        if (name === 'financial_transactions') {legacy.set('description','Legacy demo');legacy.set('amount',99999);legacy.set('type','income');legacy.set('status','pending')}
        else {legacy.set('month','2026-11');legacy.set('target_revenue',99999)}
        app.save(legacy)
      }
    })`)
    await copyFile(new URL('../pocketbase/migrations/0026_finance_company_isolation.js', import.meta.url), join(migrations, '0026_finance_company_isolation.js'))
    execFileSync(binary, ['migrate', 'up', ...args], { stdio: 'pipe' })
    const password = randomBytes(24).toString('hex')
    execFileSync(binary, ['superuser', 'upsert', 'local-test@example.invalid', password, ...args], { stdio: 'pipe' })
    const listener = createServer()
    await new Promise(resolve => listener.listen(0, '127.0.0.1', resolve))
    const port = listener.address().port
    await new Promise(resolve => listener.close(resolve))
    const url = `http://127.0.0.1:${port}`
    server = spawn(binary, ['serve', '--http', `127.0.0.1:${port}`, ...args], { stdio: ['ignore', 'pipe', 'pipe'] })
    server.stdout.resume()
    server.stderr.resume()
    let ready = false
    for (let i = 0; i < 100; i++) {
      try { if ((await fetch(`${url}/api/health`)).ok) { ready = true; break } } catch {}
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    assert.ok(ready, 'Local PocketBase failed to start')
    const admin = new PocketBase(url)
    await admin.collection('_superusers').authWithPassword('local-test@example.invalid', password)
    const create = (name, data) => admin.collection(name).create(data)
    const companyA = await create('finance_companies', {name:'Test A',active:true})
    const companyB = await create('finance_companies', {name:'Test B',active:true})
    const companyOff = await create('finance_companies', {name:'Test inactive',active:false})
    const user = async name => {
      const email = `${name}@example.invalid`
      const record = await create('users', { email, password, passwordConfirm:password })
      const client = new PocketBase(url)
      await client.collection('users').authWithPassword(email, password)
      return {record, client}
    }
    const a = await user('a'), b = await user('b'), outsider = await user('outsider')
    const member = (user, company, extra={}) => create('finance_memberships', {user_id:user.record.id,company_id:company.id,active:true,can_read:true,...extra})
    const membershipA = await member(a, companyA)
    await member(b, companyB)
    await member(a, companyB, {can_read:false}) // prevents a cross-row permission join
    await member(a, companyOff)
    const tx = company => create('financial_transactions', {company_id:company.id,description:`Test ${company.name}`,amount:100,type:'income',status:'pending',due_date:'2026-11-15 00:00:00.000Z'})
    const txA = await tx(companyA), txB = await tx(companyB)
    await tx(companyOff)
    const goalA = await create('dashboard_goals', {company_id:companyA.id,month:'2026-11',target_revenue:100})
    const goalB = await create('dashboard_goals', {company_id:companyB.id,month:'2026-11',target_revenue:200})
    const denied = (action, status=403) => assert.rejects(action, e => e.status === status)

    await t.test('regras aplicadas coincidem com o schema versionado', async () => {
      const schema = JSON.parse(await readFile(new URL('../pocketbase/schema-targets/0026_finance_company_isolation.json', import.meta.url),'utf8'))
      for (const name of ['finance_companies','finance_memberships','financial_transactions','dashboard_goals']) {
        const live = await admin.collections.getOne(name)
        const expected = schema.collections.find(c=>c.name===name)
        for (const action of ['list','view','create','update','delete']) assert.equal(live[`${action}Rule`],expected.apiRules[action])
      }
    })
    await t.test('empresa obrigatória e vínculo único, sem atribuição automática do legado', async () => {
      await assert.rejects(()=>create('financial_transactions',{description:'Invalid'}),e=>e.status===400)
      await assert.rejects(()=>member(a,companyA),e=>e.status===400)
      const legacy = (await admin.collection('financial_transactions').getFullList()).find(r=>r.description==='Legacy demo')
      assert.equal(legacy.company_id,'')
    })

    await t.test('A e B veem somente os próprios lançamentos; legados ficam ocultos', async () => {
      assert.deepEqual((await a.client.collection('financial_transactions').getFullList()).map(r=>r.id), [txA.id])
      assert.deepEqual((await b.client.collection('financial_transactions').getFullList()).map(r=>r.id), [txB.id])
      assert.equal((await admin.collection('financial_transactions').getFullList()).length, 4)
    })
    await t.test('HTTP direto: ID, filtro e expand não atravessam empresa', async () => {
      await denied(()=>a.client.collection('financial_transactions').getOne(txB.id),404)
      const response = await fetch(`${url}/api/collections/financial_transactions/records?filter=${encodeURIComponent(`company_id='${companyB.id}'`)}&expand=company_id`, {headers:{Authorization:a.client.authStore.token}})
      assert.equal(response.status,200)
      assert.deepEqual((await response.json()).items,[])
    })
    await t.test('visitante e usuário sem vínculo não obtêm registros', async () => {
      for (const client of [new PocketBase(url), outsider.client]) {
        assert.deepEqual(await client.collection('financial_transactions').getFullList(),[])
        await denied(()=>client.collection('financial_transactions').getOne(txA.id),404)
      }
    })
    await t.test('vínculo sem leitura não herda autorização de outra empresa/usuário', async () => {
      assert.deepEqual((await readFinanceCompanies(a.client)).map(r=>r.id),[companyA.id])
      assert.deepEqual((await a.client.collection('finance_memberships').getFullList()).map(r=>r.id),[membershipA.id])
      await denied(()=>a.client.collection('finance_companies').getOne(companyB.id),404)
    })
    await t.test('metas também isoladas e mês pode existir em duas empresas', async () => {
      assert.deepEqual((await a.client.collection('dashboard_goals').getFullList()).map(r=>r.id),[goalA.id])
      await denied(()=>a.client.collection('dashboard_goals').getOne(goalB.id),404)
      await assert.rejects(()=>create('dashboard_goals',{company_id:companyA.id,month:'2026-11'}),e=>e.status===400)
    })
    await t.test('criar/editar/baixar/excluir e autoatribuir vínculo são bloqueados', async () => {
      for (const [name, id] of [['financial_transactions',txA.id],['dashboard_goals',goalA.id],['finance_companies',companyA.id],['finance_memberships',membershipA.id]]) {
        await denied(()=>a.client.collection(name).create({company_id:companyA.id,user_id:a.record.id,active:true,can_read:true}))
        await denied(()=>a.client.collection(name).update(id,{status:'paid',company_id:companyB.id,can_read:true}))
        await denied(()=>a.client.collection(name).delete(id))
      }
      // A fake field on the self-editable auth record never grants membership.
      await outsider.client.collection('users').update(outsider.record.id, {company_id:companyA.id,can_read:true})
      assert.deepEqual(await outsider.client.collection('financial_transactions').getFullList(),[])
    })
    await t.test('leitor do piloto retorna empresa autorizada e rejeita seleção forjada', async () => {
      assert.deepEqual((await readCompanyFinance(a.client,companyA.id)).map(r=>r.id),[txA.id])
      await assert.rejects(()=>readCompanyFinance(a.client,companyB.id),/sem acesso/)
      await assert.rejects(()=>readFinanceCompanies(new PocketBase(url)),/Sessão inválida/)
    })
    await t.test('revogação e desativação têm efeito com token já emitido', async () => {
      await admin.collection('finance_memberships').update(membershipA.id,{active:false})
      assert.deepEqual(await a.client.collection('financial_transactions').getFullList(),[])
      await denied(()=>a.client.collection('financial_transactions').getOne(txA.id),404)
      await assert.rejects(()=>readCompanyFinance(a.client,companyA.id),/sem acesso/)
      await admin.collection('finance_memberships').update(membershipA.id,{active:true})
      await admin.collection('finance_companies').update(companyA.id,{active:false})
      assert.deepEqual(await a.client.collection('financial_transactions').getFullList(),[])
    })
  } catch (error) {
    // Do not print credentials or auth payloads. Startup logs only if no server.
    if (!server) console.error('Fixture migration failed:', error.stderr?.toString() || error.message)
    throw error
  } finally {
    if (server && server.exitCode === null) {
      const closed = new Promise(resolve=>server.once('close',resolve))
      server.kill('SIGTERM')
      await closed
    }
    await rm(root,{recursive:true,force:true})
  }
})
