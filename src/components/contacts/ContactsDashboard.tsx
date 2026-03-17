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
  LineChart,
  Line,
} from 'recharts'
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

const VOLUME_DATA = [
  { month: 'Jan', novos: 12 },
  { month: 'Fev', novos: 15 },
  { month: 'Mar', novos: 8 },
  { month: 'Abr', novos: 20 },
  { month: 'Mai', novos: 25 },
  { month: 'Jun', novos: 18 },
]

const REVENUE_DATA = [
  { month: 'Jan', civil: 40000, solar: 50000, metalurgica: 30000 },
  { month: 'Fev', civil: 45000, solar: 55000, metalurgica: 35000 },
  { month: 'Mar', civil: 50000, solar: 60000, metalurgica: 40000 },
  { month: 'Abr', civil: 60000, solar: 70000, metalurgica: 50000 },
  { month: 'Mai', civil: 70000, solar: 80000, metalurgica: 60000 },
]

const chartConfig = {
  novos: { label: 'Novos Clientes', color: 'hsl(var(--primary))' },
  civil: { label: 'Civil', color: 'hsl(var(--chart-1))' },
  solar: { label: 'Solar', color: 'hsl(var(--chart-2))' },
  metalurgica: { label: 'Metalúrgica', color: 'hsl(var(--chart-3))' },
}

export default function ContactsDashboard() {
  const { toast } = useToast()

  const handleSimulateAlerts = () => {
    toast({
      title: 'Disparo Automático Executado',
      description:
        '3 alertas de vencimento enviados com sucesso para os E-mails de Cobrança configurados nos cadastros.',
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Performance & Automação (BI)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Métricas de crescimento do relacionamento comercial e controle de riscos.
          </p>
        </div>
      </div>

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
            <CardTitle className="text-base font-semibold text-slate-800">
              Volume de Aquisição (Novos Clientes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
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
                    dataKey="novos"
                    fill="var(--color-novos)"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">
              Crescimento de Faturamento por Segmento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCivil" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-civil)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-civil)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-solar)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-solar)" stopOpacity={0} />
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
                    dataKey="civil"
                    stackId="1"
                    stroke="var(--color-civil)"
                    fill="url(#colorCivil)"
                  />
                  <Area
                    type="monotone"
                    dataKey="solar"
                    stackId="1"
                    stroke="var(--color-solar)"
                    fill="url(#colorSolar)"
                  />
                  <Area
                    type="monotone"
                    dataKey="metalurgica"
                    stackId="1"
                    stroke="var(--color-metalurgica)"
                    fill="var(--color-metalurgica)"
                    fillOpacity={0.1}
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
              Automação de Comunicação & Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 mb-4 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
              O sistema verifica diariamente a validade de contratos e documentos, disparando
              e-mails automáticos <span className="font-semibold text-blue-700">
                30 dias antes
              </span>{' '}
              do vencimento para o <b>E-mail de Cobrança</b> cadastrado no perfil do
              cliente/fornecedor.
            </p>
            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                <div>
                  <p className="font-semibold text-amber-900 text-sm">
                    Construtora Horizonte (Renovação de Contrato)
                  </p>
                  <p className="text-xs text-amber-700">Aviso a enviar: cobranca@horizonte.com</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-600 whitespace-nowrap ml-2">
                Em 15 dias
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                <div>
                  <p className="font-semibold text-rose-900 text-sm">
                    SolarTech (Documento CNPJ Vencido)
                  </p>
                  <p className="text-xs text-rose-700">Alerta crítico: contato@solartech.com</p>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-600 whitespace-nowrap ml-2">
                Atrasado
              </span>
            </div>
            <Button
              onClick={handleSimulateAlerts}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 h-11 text-sm font-semibold rounded-xl"
            >
              <Send className="w-4 h-4 mr-2" /> Forçar Execução de Automação
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Data Quality & Governança</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-white border border-slate-200 hover:border-blue-300 transition-colors rounded-xl shadow-sm">
              <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  Revisão de Limites de Crédito Pendentes
                </p>
                <p className="text-xs text-slate-600 mt-1 mb-2 leading-relaxed">
                  Operadores solicitaram alteração de limite de crédito para 3 clientes. As mudanças
                  estão bloqueadas aguardando aprovação gerencial.
                </p>
                <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                  Acessar aprovações pendentes &rarr;
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white border border-slate-200 hover:border-blue-300 transition-colors rounded-xl shadow-sm">
              <div className="bg-rose-100 p-2 rounded-lg shrink-0">
                <UserSquare2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  Falta de E-mail de Cobrança Mandatório
                </p>
                <p className="text-xs text-slate-600 mt-1 mb-2 leading-relaxed">
                  Há 4 clientes ativos operando sem a configuração do E-mail de Cobrança obrigatório
                  para automação.
                </p>
                <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                  Verificar cadastros incompletos &rarr;
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
