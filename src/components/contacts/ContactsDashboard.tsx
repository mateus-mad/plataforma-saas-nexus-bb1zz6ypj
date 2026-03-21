import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  UserSquare2,
  Truck,
  AlertTriangle,
  Send,
  CalendarClock,
  MessageCircle,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { getEntities } from '@/services/entities'
import { useRealtime } from '@/hooks/use-realtime'

const VOLUME_DATA = [
  { month: 'Jan', cliente: 12, fornecedor: 5, colaborador: 8 },
  { month: 'Fev', cliente: 15, fornecedor: 7, colaborador: 10 },
  { month: 'Mar', cliente: 8, fornecedor: 12, colaborador: 4 },
  { month: 'Abr', cliente: 20, fornecedor: 9, colaborador: 15 },
  { month: 'Mai', cliente: 25, fornecedor: 15, colaborador: 20 },
  { month: 'Jun', cliente: 18, fornecedor: 8, colaborador: 5 },
]

const ADMISSION_DATA = [
  { month: 'Jan', engenheiro: 4, administrativo: 2, operario: 5 },
  { month: 'Fev', engenheiro: 3, administrativo: 1, operario: 8 },
  { month: 'Mar', engenheiro: 6, administrativo: 3, operario: 12 },
  { month: 'Abr', engenheiro: 2, administrativo: 4, operario: 6 },
  { month: 'Mai', engenheiro: 7, administrativo: 2, operario: 15 },
]

const chartConfig = {
  cliente: { label: 'Clientes', color: 'hsl(var(--primary))' },
  fornecedor: { label: 'Fornecedores', color: 'hsl(var(--chart-2))' },
  colaborador: { label: 'Colaboradores', color: 'hsl(var(--chart-3))' },
}

const admissionConfig = {
  engenheiro: { label: 'Engenheiros', color: 'hsl(var(--chart-1))' },
  administrativo: { label: 'Administrativo', color: 'hsl(var(--chart-2))' },
  operario: { label: 'Operacional', color: 'hsl(var(--chart-3))' },
}

export default function ContactsDashboard() {
  const { toast } = useToast()
  const [counts, setCounts] = useState({
    clients: 0,
    suppliers: 0,
    collaborators: 0,
    incomplete: 0,
  })

  const loadData = async () => {
    try {
      const rels = await getEntities()

      let incompleteCount = 0
      rels.forEach((r) => {
        if (!r.document_number || !r.name || r.name === 'Sem Nome') {
          incompleteCount++
        }
      })

      setCounts({
        clients: rels.filter((r) => r.type === 'cliente').length,
        suppliers: rels.filter((r) => r.type === 'fornecedor').length,
        collaborators: rels.filter((r) => r.type === 'colaborador').length,
        incomplete: incompleteCount,
      })
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('relacionamentos', loadData)

  const handleSimulateAlerts = () => {
    toast({
      title: 'Disparo Automático Executado',
      description:
        'Alertas de vencimento e auditoria enviados com sucesso para os contatos configurados.',
    })
  }

  const notifyCandidate = (nome: string) => {
    toast({
      title: 'WhatsApp Enviado',
      description: `Mensagem de cobrança enviada automaticamente para ${nome}.`,
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Performance & Automação (HR/Comercial)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Métricas de crescimento de relacionamentos e controle unificado de compliance e
            admissões.
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
            <div className="text-2xl font-bold text-slate-800">{counts.clients}</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Cadastrados na base</p>
          </CardContent>
        </Card>
        <Card className="border-amber-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Fornecedores</CardTitle>
            <Truck className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{counts.suppliers}</div>
            <p className="text-xs text-amber-600 mt-1 font-medium">Cadastrados na base</p>
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
            <div className="text-2xl font-bold text-slate-800">{counts.collaborators}</div>
            <p className="text-xs text-blue-600 mt-1 font-medium">Cadastrados na base</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-50 border-rose-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-rose-800">
              Perfis Incompletos / Risco
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-700">{counts.incomplete}</div>
            <p className="text-xs text-rose-600 mt-1 font-medium">Faltam dados essenciais</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">
              Volume de Aquisição (Novos Relacionamentos)
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
                    dataKey="cliente"
                    stackId="a"
                    fill="var(--color-cliente)"
                    radius={[0, 0, 0, 0]}
                    barSize={40}
                  />
                  <Bar
                    dataKey="fornecedor"
                    stackId="a"
                    fill="var(--color-fornecedor)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="colaborador"
                    stackId="a"
                    fill="var(--color-colaborador)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">
              Admissões por Profissão / Setor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={admissionConfig} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={ADMISSION_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-engenheiro)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-engenheiro)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAdm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-administrativo)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-administrativo)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="engenheiro"
                    stackId="1"
                    stroke="var(--color-engenheiro)"
                    fill="url(#colorEng)"
                  />
                  <Area
                    type="monotone"
                    dataKey="administrativo"
                    stackId="1"
                    stroke="var(--color-administrativo)"
                    fill="url(#colorAdm)"
                  />
                  <Area
                    type="monotone"
                    dataKey="operario"
                    stackId="1"
                    stroke="var(--color-operario)"
                    fill="var(--color-operario)"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-purple-200 bg-purple-50/30">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-purple-900">
              <Users className="w-5 h-5 text-purple-600" />
              Notificações de Onboarding (RH)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-purple-800/80 mb-4 bg-white p-3 rounded-xl border border-purple-100 shadow-sm">
              Candidatos que iniciaram o preenchimento via link de auto-cadastro mas abandonaram a
              sessão ou possuem documentos faltantes.
            </p>
            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-purple-300 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9 border border-slate-100">
                  <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                    JS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    João Silva (Engenheiro Civil)
                  </p>
                  <p className="text-xs text-rose-500 font-medium">
                    Documento Faltante: Comprovante de Residência
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => notifyCandidate('João Silva')}
                className="h-8 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Cobrar
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-purple-300 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9 border border-slate-100">
                  <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                    AM
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    Ana Maria (Analista Financeiro)
                  </p>
                  <p className="text-xs text-rose-500 font-medium">
                    Processo abandonado (Passo 1: Pessoal)
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => notifyCandidate('Ana Maria')}
                className="h-8 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Cobrar
              </Button>
            </div>
          </CardContent>
        </Card>

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
              do vencimento.
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
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 h-11 text-sm font-semibold rounded-xl shadow-sm"
            >
              <Send className="w-4 h-4 mr-2" /> Forçar Execução de Automação
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
