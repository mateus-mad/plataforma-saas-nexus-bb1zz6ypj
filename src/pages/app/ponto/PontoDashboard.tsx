import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Clock,
  History,
  Users,
  Activity,
  ArrowRight,
  Play,
  Pause,
  Square,
  AlertTriangle,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getTimeEntries, TimeEntry } from '@/services/time_entries'
import { format, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import pb from '@/lib/pocketbase/client'

export default function PontoDashboard() {
  const { user } = useAuth()
  const [lastEntry, setLastEntry] = useState<TimeEntry | null>(null)
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)

  const [managerMetrics, setManagerMetrics] = useState<{
    atrasados: number
    ausentes: number
    valorObraDia: number
  } | null>(null)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      const today = startOfDay(new Date())
      const todayStr = today.toISOString().replace('T', ' ')
      const filter = `user_id = '${user.id}' && timestamp >= '${todayStr}'`
      const entries = await getTimeEntries(filter)

      setTodayEntries(entries)
      if (entries.length > 0) {
        setLastEntry(entries[0])
      }

      // Manager Metrics
      const myEmployees = await pb.collection('relacionamentos').getFullList({
        filter: `type = 'colaborador'`,
      })

      if (myEmployees.length > 0) {
        const allocations = await pb.collection('allocations').getFullList({
          filter: `status = 'ativo'`,
        })

        const empIds = myEmployees.map((e) => e.id)
        const allTimeEntries = await pb.collection('time_entries').getFullList({
          filter: `timestamp >= '${todayStr}'`,
        })

        const myEmpEntries = allTimeEntries.filter(
          (te) => te.relacionamento_id && empIds.includes(te.relacionamento_id),
        )

        let atrasados = 0
        let ausentes = 0
        let valorObraDia = 0

        const allocatedEmpIds = [...new Set(allocations.map((a) => a.relacionamento_id))]

        allocatedEmpIds.forEach((empId) => {
          const emp = myEmployees.find((e) => e.id === empId)
          if (!emp) return

          const empEntries = myEmpEntries.filter((te) => te.relacionamento_id === empId)
          const entradas = empEntries
            .filter((te) => te.type === 'entrada')
            .sort((a, b) => a.timestamp.localeCompare(b.timestamp))

          if (entradas.length === 0) {
            ausentes++
          } else {
            const firstEntrada = new Date(entradas[0].timestamp)
            let expectedHour = 8
            let expectedMin = 0
            if (emp.work_details?.start_time) {
              const parts = emp.work_details.start_time.split(':')
              expectedHour = parseInt(parts[0], 10)
              expectedMin = parseInt(parts[1], 10)
            }
            const expectedTime = new Date(firstEntrada)
            expectedTime.setHours(expectedHour, expectedMin, 0, 0)
            expectedTime.setMinutes(expectedTime.getMinutes() + 10) // 10 min tolerance

            if (firstEntrada > expectedTime) {
              atrasados++
            }

            let dailyRate = 0
            if (emp.salary_details?.daily_rate) {
              dailyRate = parseFloat(emp.salary_details.daily_rate)
            } else if (emp.salary_details?.base_salary) {
              dailyRate = parseFloat(emp.salary_details.base_salary) / 30
            }
            valorObraDia += dailyRate
          }
        })

        setManagerMetrics({ atrasados, ausentes, valorObraDia })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = () => {
    if (!lastEntry)
      return {
        text: 'Fora do expediente',
        color: 'text-slate-500',
        bg: 'bg-slate-100',
        icon: Square,
      }
    switch (lastEntry.type) {
      case 'entrada':
        return {
          text: 'Em expediente',
          color: 'text-emerald-600',
          bg: 'bg-emerald-100',
          icon: Play,
        }
      case 'pausa_inicio':
        return { text: 'Em pausa', color: 'text-amber-600', bg: 'bg-amber-100', icon: Pause }
      case 'pausa_fim':
        return {
          text: 'Em expediente',
          color: 'text-emerald-600',
          bg: 'bg-emerald-100',
          icon: Play,
        }
      case 'saida':
        return {
          text: 'Expediente encerrado',
          color: 'text-rose-600',
          bg: 'bg-rose-100',
          icon: Square,
        }
      default:
        return { text: 'Desconhecido', color: 'text-slate-500', bg: 'bg-slate-100', icon: Square }
    }
  }

  const status = getStatusInfo()
  const StatusIcon = status.icon

  const isLateToStart = !loading && todayEntries.length === 0 && new Date().getHours() >= 8

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Controle de Ponto</h2>
          <p className="text-muted-foreground">
            Acompanhe seu status e gerencie sua jornada de trabalho.
          </p>
        </div>
        <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all">
          <Link to="/app/controle-de-ponto/registrar">
            <Clock className="mr-2 w-5 h-5" />
            Bater Ponto Agora
          </Link>
        </Button>
      </div>

      {isLateToStart && (
        <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm font-medium">
            Lembrete Automático: Você ainda não registrou sua entrada hoje. Por favor, registre seu
            ponto.
          </p>
        </div>
      )}

      {managerMetrics && (
        <div className="mb-2 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Visão Geral da Operação (Hoje)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Atrasados</p>
                  <p className="text-2xl font-bold text-amber-600">{managerMetrics.atrasados}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                  <Clock className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Ausentes</p>
                  <p className="text-2xl font-bold text-rose-600">{managerMetrics.ausentes}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Custo Operacional / Dia</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      managerMetrics.valorObraDia,
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Activity className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 overflow-hidden border-slate-200/60 shadow-md">
          <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Status Atual
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="h-24 flex items-center justify-center text-slate-400 animate-pulse">
                Carregando status...
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${status.bg}`}
                  >
                    <StatusIcon className={`w-8 h-8 ${status.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium mb-1">
                      {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
                    </p>
                    <h3 className={`text-2xl font-bold ${status.color}`}>{status.text}</h3>
                  </div>
                </div>

                {lastEntry && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center md:text-right min-w-[200px]">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
                      Último Registro
                    </p>
                    <p className="text-xl font-semibold text-slate-800">
                      {format(new Date(lastEntry.timestamp), 'HH:mm')}
                    </p>
                    <p className="text-sm text-slate-500 capitalize">
                      {lastEntry.type.replace('_', ' ')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-md">
          <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {todayEntries.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">Nenhum registro hoje.</div>
              ) : (
                todayEntries
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            entry.type === 'entrada'
                              ? 'bg-emerald-500'
                              : entry.type === 'saida'
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                          }`}
                        />
                        <span className="font-medium text-slate-700 capitalize">
                          {entry.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-slate-500 font-medium">
                        {format(new Date(entry.timestamp), 'HH:mm')}
                      </span>
                    </div>
                  ))
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <Button variant="ghost" asChild className="w-full text-primary hover:text-primary/80">
                <Link to="/app/controle-de-ponto/espelho">
                  Ver Espelho Completo <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="hover:border-primary/30 transition-colors group cursor-pointer"
          onClick={() => (window.location.href = '/app/controle-de-ponto/espelho')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <History className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-slate-800">Espelho de Ponto</h3>
              <p className="text-sm text-slate-500">Histórico mensal.</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:border-primary/30 transition-colors group cursor-pointer"
          onClick={() => (window.location.href = '/app/controle-de-ponto/gestao')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-slate-800">Monitoramento</h3>
              <p className="text-sm text-slate-500">Eventos em tempo real.</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:border-primary/30 transition-colors group cursor-pointer"
          onClick={() => (window.location.href = '/app/controle-de-ponto/custos')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-slate-800">Custos de Obras</h3>
              <p className="text-sm text-slate-500">Gastos diários com equipe.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
