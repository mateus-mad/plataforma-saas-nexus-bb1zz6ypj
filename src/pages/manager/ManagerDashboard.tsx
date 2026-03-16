import { Navigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Ticket, AlertTriangle, DollarSign, Activity } from 'lucide-react'
import useSecurityStore from '@/stores/useSecurityStore'
import useManagerStore from '@/stores/useManagerStore'
import useTenantStore from '@/stores/useTenantStore'

export default function ManagerDashboard() {
  const { isAdminMode } = useSecurityStore()
  const { tickets, bugs, payments } = useManagerStore()
  const { tenants } = useTenantStore()

  if (!isAdminMode) return <Navigate to="/app" />

  const openTickets = tickets.filter((t) => t.status === 'Open').length
  const criticalBugs = bugs.filter((b) => b.severity === 'High' || b.severity === 'Critical').length
  const overduePayments = payments.filter((p) => p.status === 'Overdue').length

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight text-purple-800 flex items-center gap-2">
          <Activity className="w-8 h-8 text-purple-600" /> SaaS Management Central
        </h2>
        <p className="text-muted-foreground">
          Visão geral do ecossistema, saúde dos clientes e suporte técnico.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-purple-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
            <p className="text-xs text-muted-foreground">+2 novos este mês</p>
          </CardContent>
        </Card>
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Tickets Abertos</CardTitle>
            <Ticket className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets}</div>
            <p className="text-xs text-muted-foreground">SLA médio de 4 horas</p>
          </CardContent>
        </Card>
        <Card
          className={criticalBugs > 0 ? 'border-rose-200 bg-rose-50/30 shadow-sm' : 'shadow-sm'}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-800">Bugs Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{criticalBugs}</div>
            <p className="text-xs text-rose-500/80">Necessita atenção imediata</p>
          </CardContent>
        </Card>
        <Card
          className={
            overduePayments > 0 ? 'border-amber-200 bg-amber-50/30 shadow-sm' : 'shadow-sm'
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Inadimplência</CardTitle>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{overduePayments} faturas</div>
            <p className="text-xs text-amber-500/80">R$ 1.450 em aberto</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Monitoramento de Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenants.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">
                      Plano {t.plan} • {t.users.length} usuários
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">
                    Online e Saudável
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
