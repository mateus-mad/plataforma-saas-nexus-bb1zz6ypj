import { Navigate } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditCard, Download } from 'lucide-react'
import useSecurityStore from '@/stores/useSecurityStore'
import useManagerStore from '@/stores/useManagerStore'

export default function ManagerPayments() {
  const { isAdminMode } = useSecurityStore()
  const { payments } = useManagerStore()

  if (!isAdminMode) return <Navigate to="/app" />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-purple-800 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-600" /> Fluxo de Pagamentos
          </h2>
          <p className="text-muted-foreground">
            Acompanhamento financeiro global da plataforma SaaS.
          </p>
        </div>
        <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
          <Download className="w-4 h-4 mr-2" /> Exportar Relatório
        </Button>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>Fatura ID</TableHead>
              <TableHead>Tenant Associado</TableHead>
              <TableHead>Plano Base</TableHead>
              <TableHead>Data Faturamento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs text-slate-500">{p.id}</TableCell>
                <TableCell className="font-medium text-slate-800">{p.tenantId}</TableCell>
                <TableCell className="text-slate-600">{p.plan}</TableCell>
                <TableCell className="text-slate-600">{p.date}</TableCell>
                <TableCell className="text-right font-medium">
                  R$ {p.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={p.status === 'Paid' ? 'secondary' : 'destructive'}
                    className={
                      p.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : ''
                    }
                  >
                    {p.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
