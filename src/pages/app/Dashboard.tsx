import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Users,
  CircleDollarSign,
  CheckSquare,
  Briefcase,
  Lock,
  Unlock,
  MapPin,
  Clock,
  AlertTriangle,
  Activity,
  ShieldCheck,
  FileWarning,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useSecurityStore from '@/stores/useSecurityStore'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'

const REVENUE_DATA = [
  { date: '01/05', income: 4000, expense: 2400 },
  { date: '05/05', income: 3000, expense: 1398 },
  { date: '10/05', income: 2000, expense: 9800 },
  { date: '15/05', income: 2780, expense: 3908 },
  { date: '20/05', income: 1890, expense: 4800 },
  { date: '25/05', income: 2390, expense: 3800 },
  { date: '30/05', income: 3490, expense: 4300 },
]

const chartConfig = {
  income: { label: 'Entradas', color: 'hsl(var(--chart-2))' },
  expense: { label: 'Saídas', color: 'hsl(var(--chart-3))' },
}

const INITIAL_ACTIVITIES = [
  { id: 1, text: 'Novo contato "João Silva" adicionado.', time: 'Há 2 horas', type: 'contact' },
  { id: 2, text: 'Pagamento de R$ 5.400,00 recebido.', time: 'Há 4 horas', type: 'finance' },
  { id: 3, text: 'Nota fiscal #459 emitida.', time: 'Ontem', type: 'finance' },
  { id: 4, text: 'Contato "Empresa Alfa" atualizado.', time: 'Ontem', type: 'contact' },
]

export default function Dashboard() {
  const { isSetup, isAdminMode, encrypt, decrypt } = useSecurityStore()
  const [activities, setActivities] = useState<any[]>([])

  const [timeEntries, setTimeEntries] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [collaborators, setColabs] = useState<any[]>([])
  const [complianceStats, setComplianceStats] = useState({ em_dia: 0, pendente: 0, vencido: 0 })

  useEffect(() => {
    const loadActivities = async () => {
      if (!isSetup) {
        setActivities(INITIAL_ACTIVITIES)
        return
      }

      const encryptedMocks = await Promise.all(
        INITIAL_ACTIVITIES.map(async (act) => ({
          ...act,
          text: await encrypt(act.text),
        })),
      )

      if (isAdminMode) {
        setActivities(
          encryptedMocks.map((act) => ({
            ...act,
            text: `[Encrypted] ${act.text?.substring(0, 20)}...`,
          })),
        )
      } else {
        setActivities(
          await Promise.all(
            encryptedMocks.map(async (act) => ({
              ...act,
              text: await decrypt(act.text),
            })),
          ),
        )
      }
    }
    loadActivities()
  }, [isSetup, isAdminMode, encrypt, decrypt])

  useEffect(() => {
    const loadPontoData = async () => {
      try {
        const today = new Date()
        const dateStr = today.toISOString().split('T')[0] + ' 00:00:00.000Z'

        const entries = await pb.collection('time_entries').getFullList({
          filter: `timestamp >= "${dateStr}"`,
          sort: '-timestamp',
          expand: 'user_id,work_site_id',
        })
        setTimeEntries(entries)

        const alertsData = await pb.collection('security_alerts').getFullList({
          sort: '-created',
          limit: 10,
          expand: 'user_id',
        })
        setAlerts(alertsData)

        const rels = await pb.collection('relacionamentos').getFullList({
          filter: `type = 'colaborador' && status != 'inativo'`,
        })
        setColabs(rels)

        const allRels = await pb.collection('relacionamentos').getFullList()
        const comp = { em_dia: 0, pendente: 0, vencido: 0 }
        allRels.forEach((r: any) => {
          if (r.compliance_status === 'em_dia') comp.em_dia++
          else if (r.compliance_status === 'pendente') comp.pendente++
          else if (r.compliance_status === 'vencido') comp.vencido++
        })
        setComplianceStats(comp)
      } catch (e) {
        console.error('Error loading monitoring data', e)
      }
    }
    loadPontoData()
  }, [])

  useRealtime('time_entries', (e) => {
    if (e.action === 'create') {
      pb.collection('time_entries')
        .getOne(e.record.id, { expand: 'user_id,work_site_id' })
        .then((record) => setTimeEntries((prev) => [record, ...prev]))
        .catch(console.error)
    }
  })

  useRealtime('security_alerts', (e) => {
    if (e.action === 'create') {
      pb.collection('security_alerts')
        .getOne(e.record.id, { expand: 'user_id' })
        .then((record) => setAlerts((prev) => [record, ...prev].slice(0, 10)))
        .catch(console.error)
    }
  })

  const activeUserIds = new Set(
    timeEntries.filter((e) => e.type === 'entrada').map((e) => e.user_id),
  )
  const activeCount = activeUserIds.size
  const totalColabs = collaborators.length
  const absentCount = Math.max(0, totalColabs - activeCount)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Dashboard
            {isSetup && (
              <Badge
                variant="outline"
                className={
                  isAdminMode
                    ? 'bg-purple-50 text-purple-600 border-purple-200 ml-2'
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200 ml-2'
                }
              >
                {isAdminMode ? (
                  <Lock className="w-3 h-3 mr-1" />
                ) : (
                  <Unlock className="w-3 h-3 mr-1" />
                )}
                {isAdminMode ? 'Encrypted (Manager)' : 'E2E Decrypted'}
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">
            Visão consolidada das operações e métricas da sua empresa.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none min-h-[44px]" asChild>
            <Link to="/app/relacionamento/clientes">Adicionar Cliente</Link>
          </Button>
          <Button className="flex-1 sm:flex-none min-h-[44px]" asChild>
            <Link to="/app/financeiro">Nova Transação</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="bg-slate-100/50 p-1">
          <TabsTrigger value="geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="ponto" className="flex items-center gap-2">
            <Activity className="w-4 h-4" /> Monitoramento e Ponto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contatos Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.248</div>
                <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance em Dia</CardTitle>
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{complianceStats.em_dia}</div>
                <p className="text-xs text-muted-foreground">
                  {complianceStats.pendente} pendentes, {complianceStats.vencido} vencidos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 45.231,89</div>
                <p className="text-xs text-muted-foreground">+8.1% em relação a abril</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <div className="text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px]">
                    Módulo em Breve
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
            <Card className="md:col-span-4 lg:col-span-5 min-w-0">
              <CardHeader>
                <CardTitle>Fluxo de Caixa (Últimos 30 dias)</CardTitle>
              </CardHeader>
              <CardContent className="pl-0 min-w-0 overflow-hidden">
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px] w-[calc(100vw-3rem)] md:w-full pr-6"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={REVENUE_DATA}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-expense)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--color-expense)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis
                        tickFormatter={(val) => `R${val / 1000}k`}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="var(--color-income)"
                        fillOpacity={1}
                        fill="url(#fillIncome)"
                      />
                      <Area
                        type="monotone"
                        dataKey="expense"
                        stroke="var(--color-expense)"
                        fillOpacity={1}
                        fill="url(#fillExpense)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="md:col-span-3 lg:col-span-2">
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div
                        className={`mt-0.5 rounded-full p-2 ${activity.type === 'contact' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}
                      >
                        {activity.type === 'contact' ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          <CircleDollarSign className="h-4 w-4" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p
                          className={`text-sm font-medium leading-none flex items-center gap-1.5 ${isAdminMode ? 'font-mono text-xs text-slate-500' : ''}`}
                        >
                          {isSetup &&
                            (isAdminMode ? (
                              <Lock className="w-3 h-3 text-purple-400" />
                            ) : (
                              <Unlock className="w-3 h-3 text-emerald-400 opacity-50" />
                            ))}
                          {activity.text}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-6 text-primary min-h-[44px]">
                  Ver todas
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ponto" className="space-y-6 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Equipe em Campo (Hoje)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{activeCount}</div>
                <p className="text-xs text-muted-foreground">
                  De {totalColabs} colaboradores no total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ausentes / Não Registrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-600">{absentCount}</div>
                <p className="text-xs text-muted-foreground">Podem estar de folga ou atrasados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Registros (Hoje)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{timeEntries.length}</div>
                <p className="text-xs text-muted-foreground">Entradas, saídas e pausas</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> Feed de Ponto em Tempo Real
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {timeEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-start gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                          <AvatarImage
                            src={
                              entry.expand?.user_id?.avatar
                                ? pb.files.getUrl(entry.expand.user_id, entry.expand.user_id.avatar)
                                : ''
                            }
                          />
                          <AvatarFallback>
                            {entry.expand?.user_id?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">
                            {entry.expand?.user_id?.name || 'Usuário'}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground gap-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />{' '}
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{' '}
                              {entry.expand?.work_site_id?.name || 'Local não identificado'}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            entry.type === 'entrada'
                              ? 'default'
                              : entry.type === 'saida'
                                ? 'destructive'
                                : 'secondary'
                          }
                          className="capitalize"
                        >
                          {entry.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                    {timeEntries.length === 0 && (
                      <p className="text-sm text-center text-muted-foreground py-10">
                        Nenhum registro hoje.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-5 h-5" /> Alertas de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-900"
                      >
                        <div className="mt-0.5">
                          <FileWarning className="w-4 h-4 text-rose-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {alert.expand?.user_id?.name || 'Desconhecido'}
                          </p>
                          <p className="text-xs mt-1">{alert.message}</p>
                          <p className="text-[10px] text-rose-400 mt-2">
                            {new Date(alert.created).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {alerts.length === 0 && (
                      <p className="text-sm text-center text-muted-foreground py-10">
                        Sem alertas recentes.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
