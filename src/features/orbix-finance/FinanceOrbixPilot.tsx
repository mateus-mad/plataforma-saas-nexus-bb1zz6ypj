import { useCallback,useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft,RefreshCw } from 'lucide-react'
import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import pb from '@/lib/pocketbase/client'
import type { FinancialTransaction } from '@/services/financial_transactions'
import { brl,date,overdue,financeSummary } from './finance-summary'

export default function FinanceOrbixPilot(){
 const [records,setRecords]=useState<FinancialTransaction[]>([])
 const [loading,setLoading]=useState(false)
 const [error,setError]=useState<string|null>(null)
 const [filter,setFilter]=useState('all')
 const load=useCallback(async()=>{setLoading(true);setError(null);try{
  const result=await pb.collection('financial_transactions').getFullList<FinancialTransaction>({sort:'-due_date'})
  setRecords(result)
 }catch(e){setError(e instanceof Error?e.message:'Erro no banco');setRecords([])}finally{setLoading(false)}},[])
 useEffect(()=>{void load()},[load])
 const n=new Date(),today=[n.getFullYear(),String(n.getMonth()+1).padStart(2,'0'),String(n.getDate()).padStart(2,'0')].join('-')
 const s=financeSummary(records,today)
 const cards=[['A receber',s.receivable],['A pagar',s.payable],['A receber vencido',s.overdueReceivable],['A pagar vencido',s.overduePayable],['Recebido (informado)',s.received],['Pago (informado)',s.paid]] as const
 const filtered=records.filter(t=>filter==='all'||t.type===filter)
 return <div className="space-y-5 p-4">
  <div className="flex flex-wrap items-center justify-between gap-2"><div>
   <Link to="/app/financeiro" className="text-sm text-muted-foreground"><ArrowLeft className="inline h-4 w-4"/> Voltar ao Skip</Link>
   <h1 className="text-2xl font-bold">Financeiro ORBIX no Skip</h1>
   <p className="text-sm text-muted-foreground">Laboratório MAD — consulta PocketBase, sem gravação</p></div>
   <div className="flex gap-2"><Badge variant="outline">PILOTO NÃO HOMOLOGADO</Badge><Button variant="outline" disabled={loading} onClick={()=>void load()}><RefreshCw className="mr-2 h-4 w-4"/>Atualizar</Button></div></div>
  <p className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 text-sm">Os status não comprovam pagamento Pix, baixa bancária ou lançamento no Mais Controle. Não autorizar pagamentos por este painel.</p>
  {error?<p role="alert" className="rounded border border-destructive p-3 text-destructive">Falha na leitura do banco: {error}. Não interpretar como saldo zero.</p>:<>
   <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label,value])=><Card key={label}><CardHeader><CardTitle className="text-sm">{label}</CardTitle></CardHeader><CardContent className="text-xl font-semibold">{brl(value)}</CardContent></Card>)}</div>
   <Card><CardHeader><CardTitle>Lançamentos do PocketBase ({records.length})</CardTitle></CardHeader><CardContent>
    <select value={filter} onChange={e=>setFilter(e.target.value)} className="mb-3 rounded border bg-background p-2"><option value="all">Todos</option><option value="income">Receitas</option><option value="expense">Despesas</option></select>
    {loading?<p>Consultando...</p>:filtered.length===0?<p>Nenhum registro encontrado.</p>:
    <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="p-2">Descrição</th><th className="p-2">Vencimento</th><th className="p-2">Situação</th><th className="p-2 text-right">Valor</th></tr></thead><tbody>{filtered.slice(0,100).map(t=><tr className="border-b" key={t.id}><td className="p-2">{t.description}</td><td className="p-2">{date(t.due_date)}</td><td className="p-2">{overdue(t,today)?'Vencido':t.status}</td><td className="p-2 text-right">{brl(Number(t.amount))}</td></tr>)}</tbody></table></div>}
   </CardContent></Card>
  </>}
 </div>
}
