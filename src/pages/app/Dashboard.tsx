import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CircleDollarSign, CheckSquare, Briefcase, Lock } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import useSecurityStore from '@/stores/useSecurityStore'

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

  useEffect(() => {
    const loadActivities = async () => {
      if (!isSetup) {
        setActivities(INITIAL_ACTIVITIES)
        return
      }

      // Simulate getting encrypted activities and decrypting them for display
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
            text: act.text?.substring(0, 25) + '...',
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Dashboard
            {isSetup && (
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-600 border-emerald-200 ml-2"
              >
                <Lock className="w-3 h-3 mr-1" /> E2E
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">
            Bem-vindo de volta. Aqui está o resumo da sua empresa.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/app/contatos">Adicionar Contato</Link>
          </Button>
          <Button asChild>
            <Link to="/app/financeiro">Nova Transação</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contatos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.248</div>
            <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
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
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px]">
                Módulo em Breve
              </Badge>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px]">
                Módulo em Breve
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        <Card className="md:col-span-4 lg:col-span-5">
          <CardHeader>
            <CardTitle>Fluxo de Caixa (Últimos 30 dias)</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer config={chartConfig} className="h-[300px] w-full pr-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    tickFormatter={(val) => `R$${val / 1000}k`}
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
                      className={`text-sm font-medium leading-none ${isAdminMode ? 'font-mono text-xs text-slate-500' : ''}`}
                    >
                      {activity.text}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-primary">
              Ver todas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
