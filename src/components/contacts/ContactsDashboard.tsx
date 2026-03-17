import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserSquare2, Truck, AlertTriangle, Send, CalendarClock } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts'
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

const SECTOR_DATA = [
  { name: 'Civil', value: 120, fill: 'hsl(var(--chart-1))' },
  { name: 'Solar', value: 85, fill: 'hsl(var(--chart-2))' },
  { name: 'Metalúrgica', value: 40, fill: 'hsl(var(--chart-3))' },
  { name: 'Administrativo', value: 25, fill: 'hsl(var(--chart-4))' },
]

const VOLUME_DATA = [
  { month: 'Jan', Civil: 20, Solar: 15, Metalurgica: 8 },
  { month: 'Fev', Civil: 25, Solar: 18, Metalurgica: 12 },
  { month: 'Mar', Civil: 30, Solar: 25, Metalurgica: 15 },
  { month: 'Abr', Civil: 28, Solar: 30, Metalurgica: 18 },
  { month: 'Mai', Civil: 35, Solar: 35, Metalurgica: 20 },
]

const REVENUE_DATA = [
  { month: 'Jan', revenue: 120000 },
  { month: 'Fev', revenue: 135000 },
  { month: 'Mar', revenue: 150000 },
  { month: 'Abr', revenue: 180000 },
  { month: 'Mai', revenue: 210000 },
]

const sectorConfig = {
  Civil: { label: 'Civil', color: 'hsl(var(--chart-1))' },
  Solar: { label: 'Solar', color: 'hsl(var(--chart-2))' },
  Metalurgica: { label: 'Metalúrgica', color: 'hsl(var(--chart-3))' },
  Administrativo: { label: 'Administrativo', color: 'hsl(var(--chart-4))' },
  revenue: { label: 'Faturamento', color: 'hsl(var(--primary))' },
}

export default function ContactsDashboard() {
  const { toast } = useToast()

  const handleSimulateAlerts = () => {
    toast({
      title: 'Disparo Automático Executado',
      description:
        '3 alertas de vencimento enviados aos gestores internos e contatos principais dos clientes.',
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <h2 className="text-2xl font-bold tracking-tight text-slate-800">
        Dashboard de Relacionamentos & BI
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Clientes</CardTitle>
            <UserSquare2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">145</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">+12 no último mês</p>
          </CardContent>
        </Card>
        <Card className="border-amber-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Fornecedores</CardTitle>
            <Truck className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">83</div>
            <p className="text-xs text-amber-600 mt-1 font-medium">Ativos no sistema</p>
          </CardContent>
        </Card>
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Colaboradores
            </CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">214</div>
            <p className="text-xs text-blue-600 mt-1 font-medium">92% ativos</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-50 border-rose-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-rose-800">Perfis Incompletos</CardTitle>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-700">12</div>
            <p className="text-xs text-rose-600 mt-1 font-medium">Faltam dados essenciais</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Volume de Clientes por Setor</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sectorConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={VOLUME_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="Civil"
                    stackId="a"
                    fill="var(--color-Civil)"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar dataKey="Solar" stackId="a" fill="var(--color-Solar)" />
                  <Bar
                    dataKey="Metalurgica"
                    stackId="a"
                    fill="var(--color-Metalurgica)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Crescimento de Faturamento (Base)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sectorConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `R$${v / 1000}k`}
                    tick={{ fill: '#64748b' }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={(v) => `R$ ${v.toLocaleString()}`} />}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-blue-500" />
              Automação de Contratos e Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
              O sistema verifica diariamente a validade de contratos e documentos, disparando
              e-mails automáticos para clientes e gestores 30 dias antes do vencimento.
            </p>
            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <div>
                  <p className="font-semibold text-amber-900 text-sm">
                    Construtora Horizonte (Renovação)
                  </p>
                  <p className="text-xs text-amber-700">Vence em: 15 dias</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white border-amber-300 text-amber-700">
                Pendente
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <div>
                  <p className="font-semibold text-rose-900 text-sm">
                    SolarTech (CNH Vencida de Motorista)
                  </p>
                  <p className="text-xs text-rose-700">Venceu há: 2 dias</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white border-rose-300 text-rose-700">
                Atrasado
              </Badge>
            </div>
            <Button
              onClick={handleSimulateAlerts}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" /> Simular Disparo de Alertas
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Ações de Data Quality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 hover:border-blue-300 transition-colors rounded-lg shadow-sm">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  Atualizar Documentos de Colaboradores
                </p>
                <p className="text-xs text-slate-600 mt-0.5 mb-2">
                  Existem 5 colaboradores com CNH vencida e 2 aguardando envio de exames periódicos.
                </p>
                <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                  Ver lista de pendências &rarr;
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 hover:border-blue-300 transition-colors rounded-lg shadow-sm">
              <UserSquare2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  Falta de Contato Principal (Clientes)
                </p>
                <p className="text-xs text-slate-600 mt-0.5 mb-2">
                  Há 4 clientes na base sem e-mail ou telefone de faturamento configurado.
                </p>
                <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                  Enviar link de autopreenchimento &rarr;
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
