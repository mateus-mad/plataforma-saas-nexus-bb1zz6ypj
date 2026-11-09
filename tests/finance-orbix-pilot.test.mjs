import test from 'node:test'
import assert from 'node:assert/strict'
import { financeSummary,overdue,date,brl } from '../src/features/orbix-finance/finance-summary.ts'
const tx=(id,type,status,amount,due_date)=>({id,description:id,type,status,amount,due_date})
const today='2026-11-09'
test('somar contas pendentes',()=>{const s=financeSummary([tx('a','income','pending',80,'2026-11-10'),tx('b','expense','pending',40,'2026-11-10')],today);assert.equal(s.receivable,80);assert.equal(s.payable,40)})
test('vencidos somente antes da data',()=>{const s=financeSummary([tx('a','income','pending',80,'2026-11-08'),tx('b','expense','overdue',40,'2026-11-08'),tx('c','expense','pending',60,'2026-11-09')],today);assert.equal(s.overdueReceivable,80);assert.equal(s.overduePayable,40)})
test('pagos e cancelados não compõem pendentes',()=>{const s=financeSummary([tx('a','expense','paid',80,'2026-11-01'),tx('b','expense','cancelled',40,'2026-11-01')],today);assert.equal(s.payable,0);assert.equal(s.paid,80)})
test('cancelados excluídos de indicadores',()=>{const s=financeSummary([tx('a','income','cancelled',90,'2026-11-01')],today);assert.equal(s.receivable,0);assert.equal(s.overdueReceivable,0)})
test('vencimento no dia não é vencido',()=>assert.equal(overdue(tx('a','income','pending',1,today),today),false))
test('data ISO sem deslocamento UTC',()=>assert.equal(date('2026-11-09T00:00:00.000Z'),'2026-11-09'))
test('valor NaN ignorado',()=>{const s=financeSummary([tx('a','income','pending',NaN,'2026-11-01')],today);assert.equal(s.receivable,0)})
test('BRL é formatado',()=>assert.match(brl(1234.5),/1\.234,50/))
