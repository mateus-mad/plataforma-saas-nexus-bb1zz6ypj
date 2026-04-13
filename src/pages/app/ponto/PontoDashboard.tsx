import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, History, Users, Activity, ArrowRight, Play, Pause, Square } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getTimeEntries, TimeEntry } from '@/services/time_entries'
import { format, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function PontoDashboard() {
  const { user } = useAuth()
  const [lastEntry, setLastEntry] = useState<TimeEntry | null>(null)
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      const today = startOfDay(new Date())
      const filter = `user_id = '${user.id}' && timestamp >= '${today.toISOString().replace('T', ' ')}'`
      const entries = await getTimeEntries(filter)

      setTodayEntries(entries)
      if (entries.length > 0) {
        setLastEntry(entries[0])
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
          <Link to="/app/ponto/registrar">
            <Clock className="mr-2 w-5 h-5" />
            Bater Ponto Agora
          </Link>
        </Button>
      </div>

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
                <Link to="/app/ponto/espelho">
                  Ver Espelho Completo <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="hover:border-primary/30 transition-colors group cursor-pointer"
          onClick={() => (window.location.href = '/app/ponto/espelho')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <History className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-slate-800">Espelho de Ponto</h3>
              <p className="text-sm text-slate-500">
                Visualize seu histórico mensal completo e horas trabalhadas.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
          </CardContent>
        </Card>

        <Card
          className="hover:border-primary/30 transition-colors group cursor-pointer"
          onClick={() => (window.location.href = '/app/ponto/gestao')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-slate-800">Gestão da Equipe</h3>
              <p className="text-sm text-slate-500">
                Acompanhe as marcações e auditória de ponto dos colaboradores.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
