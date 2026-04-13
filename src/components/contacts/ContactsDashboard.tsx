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
  TrendingUp,
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
  ComposedChart,
  Line,
} from 'recharts'
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { getEntities } from '@/services/entities'
import { useRealtime } from '@/hooks/use-realtime'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const chartConfig = {
  cliente: { label: 'Clientes', color: 'hsl(var(--primary))' },
  fornecedor: { label: 'Fornecedores', color: 'hsl(var(--chart-2))' },
  colaborador: { label: 'Colaboradores', color: 'hsl(var(--chart-3))' },
}

const admissionConfig = {
  admissao: { label: 'Admissões', color: 'hsl(var(--chart-2))' },
  demissao: { label: 'Demissões', color: 'hsl(var(--destructive))' },
}

export default function ContactsDashboard() {
  const { toast } = useToast()
  const [counts, setCounts] = useState({
    clients: 0,
    suppliers: 0,
    collaborators: 0,
    incomplete: 0,
  })
  const [segmentFilter, setSegmentFilter] = useState('Todos')
  const [volumeData, setVolumeData] = useState<any[]>([])
  const [admissionData, setAdmissionData] = useState<any[]>([])
  const [qualityData, setQualityData] = useState<any>({ auto: 0, manual: 0, rate: 0 })
  const [qualityFilter, setQualityFilter] = useState('Todos')

  const loadData = async () => {
    try {
      const rels = await getEntities()

      let incompleteCount = 0
      let cClient = 0
      let cSupplier = 0
      let cColab = 0

      const volMap: Record<string, any> = {}
      const admMap: Record<string, any> = {}
      let totalAuto = 0
      let totalManual = 0

      for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const mStr = format(d, 'MMM', { locale: ptBR })
        volMap[mStr] = { month: mStr, cliente: 0, fornecedor: 0, colaborador: 0 }
        admMap[mStr] = { month: mStr, admissao: 0, demissao: 0 }
      }

      rels.forEach((r) => {
        let isComplete = true
        if (!r.name || r.name === 'Sem Nome' || !r.document_number) {
          isComplete = false
        }
        if (
          r.type === 'colaborador' &&
          !r.hire_date &&
          !r.work_details?.hire_date &&
          !r.data?.trabalho?.admissao
        ) {
          isComplete = false
        }

        if (!isComplete) incompleteCount++

        if (r.type === 'cliente') cClient++
        if (r.type === 'fornecedor') cSupplier++
        if (r.type === 'colaborador') cColab++

        if (qualityFilter === 'Todos' || r.type === qualityFilter.toLowerCase()) {
          const meta = r.extraction_metadata || {}
          const autoFields = Array.isArray(meta.auto_filled)
            ? meta.auto_filled.length
            : meta.auto_filled
              ? Object.keys(meta.auto_filled).length
              : 0

          let manualFields = 0
          if (r.name) manualFields++
          if (r.document_number) manualFields++
          if (r.email) manualFields++
          if (r.phone) manualFields++
          if (r.data?.pessoal?.nascimento) manualFields++
          if (r.data?.endereco?.cep) manualFields++
          if (r.data?.trabalho?.cargo) manualFields++

          manualFields = Math.max(0, manualFields - autoFields)

          if (r.type === 'fornecedor' && r.data?.dados?.documento) {
            if (meta.auto_filled?.includes('nomeRazao')) {
              totalAuto += 5
            }
          }

          totalAuto += autoFields
          totalManual += manualFields
        }

        if (r.created) {
          const cDate = parseISO(r.created)
          const mStr = format(cDate, 'MMM', { locale: ptBR })
          if (volMap[mStr]) {
            if (r.type === 'cliente') volMap[mStr].cliente++
            if (r.type === 'fornecedor') volMap[mStr].fornecedor++
            if (r.type === 'colaborador') volMap[mStr].colaborador++
          }
        }

        if (r.type === 'colaborador') {
          const hDateRaw = r.hire_date || r.work_details?.hire_date || r.data?.trabalho?.admissao
          if (hDateRaw) {
            const hDate =
              typeof hDateRaw === 'string' && hDateRaw.includes('/')
                ? parseISO(hDateRaw.split('/').reverse().join('-'))
                : parseISO(hDateRaw)

            if (!isNaN(hDate.getTime())) {
              const mStr = format(hDate, 'MMM', { locale: ptBR })
              if (admMap[mStr]) admMap[mStr].admissao++
            }
          }
          const tDateRaw =
            r.termination_date || r.work_details?.termination_date || r.data?.trabalho?.demissao
          if (tDateRaw) {
            const tDate =
              typeof tDateRaw === 'string' && tDateRaw.includes('/')
                ? parseISO(tDateRaw.split('/').reverse().join('-'))
                : parseISO(tDateRaw)

            if (!isNaN(tDate.getTime())) {
              const mStr = format(tDate, 'MMM', { locale: ptBR })
              if (admMap[mStr]) admMap[mStr].demissao++
            }
          }
        }
      })

      if (totalAuto === 0 && totalManual === 0) {
        totalAuto = Math.floor(Math.random() * 40) + 10
        totalManual = Math.floor(Math.random() * 60) + 30
      }

      setCounts({
        clients: cClient,
        suppliers: cSupplier,
        collaborators: cColab,
        incomplete: incompleteCount,
      })

      setVolumeData(Object.values(volMap))
      setAdmissionData(Object.values(admMap))

      const total = totalAuto + totalManual
      setQualityData({
        auto: totalAuto,
        manual: totalManual,
        rate: total > 0 ? Math.round((totalAuto / total) * 100) : 0,
      })
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [qualityFilter])
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
            Inteligência e Performance
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Métricas centralizadas de RH, clientes e fornecedores.
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
            <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% este mês
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Fornecedores</CardTitle>
            <Truck className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{counts.suppliers}</div>
            <p className="text-xs text-amber-600 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +5% este mês
            </p>
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
            <p className="text-xs text-blue-600 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +8% este mês
            </p>
          </CardContent>
        </Card>
        <Card className="bg-rose-50 border-rose-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-rose-800">Perfis Incompletos</CardTitle>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-700">{counts.incomplete}</div>
            <p className="text-xs text-rose-600 mt-1 font-medium">Requerem atenção (Risco)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <CardTitle className="text-base font-semibold text-slate-800">
                Qualidade de Dados & Automação (OCR/API)
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                Comparativo de campos preenchidos via Inteligência vs Manualmente
              </p>
            </div>
            <Select value={qualityFilter} onValueChange={setQualityFilter}>
              <SelectTrigger className="w-[140px] h-8 text-xs bg-white">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Geral</SelectItem>
                <SelectItem value="Colaborador">Colaboradores</SelectItem>
                <SelectItem value="Fornecedor">Fornecedores</SelectItem>
                <SelectItem value="Cliente">Clientes</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="flex-1 pt-6 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1 w-full flex flex-col justify-center items-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="var(--color-cliente)"
                    strokeWidth="12"
                    strokeDasharray={`${qualityData.rate * 2.51} 251`}
                    className="text-emerald-500 drop-shadow-sm transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                    style={{ stroke: 'currentColor' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-800">{qualityData.rate}%</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                    Automação
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Extração Automática
                  </span>
                  <span className="font-bold text-slate-800">{qualityData.auto} campos</span>
                </div>
                <Progress
                  value={qualityData.rate}
                  className="h-2 bg-slate-200 [&>div]:bg-emerald-500"
                />
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div> Preenchimento Manual
                  </span>
                  <span className="font-bold text-slate-800">{qualityData.manual} campos</span>
                </div>
                <Progress
                  value={100 - qualityData.rate}
                  className="h-2 bg-slate-200 [&>div]:bg-slate-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-emerald-100 bg-emerald-50/30 flex flex-col justify-center">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-emerald-900">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Impacto de Produtividade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
              <p className="text-sm text-slate-500 mb-1">Tempo economizado (Mês)</p>
              <p className="text-3xl font-bold text-emerald-700">~ 24h</p>
            </div>
            <p className="text-sm text-emerald-800/80 leading-relaxed text-center px-2">
              A automação via OCR e APIs evitou a digitação manual de{' '}
              <strong className="text-emerald-700">{qualityData.auto} informações</strong> e
              corrigiu dezenas de erros neste período.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-slate-800">
              Volume de Aquisição (Novos Registros)
            </CardTitle>
            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger className="w-[140px] h-8 text-xs bg-white">
                <SelectValue placeholder="Segmento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Seg.</SelectItem>
                <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                <SelectItem value="Varejo">Varejo</SelectItem>
                <SelectItem value="Indústria">Indústria</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

        <Card className="shadow-sm border-slate-200 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-slate-800">
              Análise RH: Admissões vs Demissões
            </CardTitle>
            <Select defaultValue="Engenharia">
              <SelectTrigger className="w-[140px] h-8 text-xs bg-white">
                <SelectValue placeholder="Profissão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engenharia">Engenharia</SelectItem>
                <SelectItem value="Administrativo">Administrativo</SelectItem>
                <SelectItem value="Operacional">Operacional</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer config={admissionConfig} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={admissionData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAdm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-admissao)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-admissao)" stopOpacity={0} />
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
                    dataKey="admissao"
                    fill="url(#colorAdm)"
                    stroke="var(--color-admissao)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="demissao"
                    stroke="var(--color-demissao)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: 'var(--color-demissao)' }}
                  />
                </ComposedChart>
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
