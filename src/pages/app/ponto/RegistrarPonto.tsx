import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { createTimeEntry, getTimeEntries, TimeEntry } from '@/services/time_entries'
import { useToast } from '@/hooks/use-toast'
import { Clock, MapPin, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function RegistrarPonto() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastEntry, setLastEntry] = useState<TimeEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (user) loadLastEntry()
  }, [user])

  const loadLastEntry = async () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const filter = `user_id = '${user.id}' && timestamp >= '${today.toISOString().replace('T', ' ')}'`
      const entries = await getTimeEntries(filter)
      if (entries.length > 0) {
        setLastEntry(entries[0])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getNextAction = () => {
    if (!lastEntry)
      return {
        type: 'entrada',
        label: 'Registrar Entrada',
        color: 'bg-emerald-600 hover:bg-emerald-700',
      }
    switch (lastEntry.type) {
      case 'entrada':
        return {
          type: 'pausa_inicio',
          label: 'Iniciar Pausa',
          color: 'bg-amber-600 hover:bg-amber-700',
        }
      case 'pausa_inicio':
        return {
          type: 'pausa_fim',
          label: 'Finalizar Pausa',
          color: 'bg-blue-600 hover:bg-blue-700',
        }
      case 'pausa_fim':
        return { type: 'saida', label: 'Registrar Saída', color: 'bg-rose-600 hover:bg-rose-700' }
      case 'saida':
        return {
          type: 'entrada',
          label: 'Registrar Nova Entrada (Hora Extra)',
          color: 'bg-emerald-600 hover:bg-emerald-700',
        }
      default:
        return { type: 'entrada', label: 'Registrar Ponto', color: 'bg-primary' }
    }
  }

  const handleRegister = async () => {
    setSaving(true)
    try {
      let geo = null
      if (navigator.geolocation) {
        geo = await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(null),
            { timeout: 5000 },
          )
        })
      }

      let ip = ''
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json')
        const ipData = await ipRes.json()
        ip = ipData.ip
      } catch (e) {}

      const action = getNextAction()

      await createTimeEntry({
        user_id: user.id,
        timestamp: new Date().toISOString(),
        type: action.type as any,
        metadata: { location: geo, ip },
      })

      toast({ title: 'Ponto registrado com sucesso!', description: `Ação: ${action.label}` })
      await loadLastEntry()
    } catch (error) {
      toast({ title: 'Erro ao registrar ponto', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const action = getNextAction()

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 animate-in fade-in slide-in-from-bottom-4">
      <Card className="w-full max-w-md shadow-2xl border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <CardContent className="p-8 flex flex-col items-center text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-slate-500 capitalize">
              {format(currentTime, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </h2>
            <div className="text-6xl font-bold tracking-tighter text-slate-800 tabular-nums">
              {format(currentTime, 'HH:mm:ss')}
            </div>
          </div>

          <div className="w-full h-px bg-slate-100" />

          {loading ? (
            <div className="h-16 flex items-center justify-center text-slate-400">
              <Activity className="w-5 h-5 animate-pulse mr-2" /> Carregando...
            </div>
          ) : (
            <div className="w-full space-y-4">
              <Button
                size="lg"
                className={`w-full h-16 text-lg shadow-lg transition-all active:scale-95 ${action.color}`}
                onClick={handleRegister}
                disabled={saving}
              >
                <Clock className="w-6 h-6 mr-2" />
                {saving ? 'Registrando...' : action.label}
              </Button>

              {lastEntry && (
                <p className="text-sm text-slate-500 font-medium">
                  Último registro: {format(new Date(lastEntry.timestamp), 'HH:mm')} (
                  {lastEntry.type.replace('_', ' ').toUpperCase()})
                </p>
              )}
            </div>
          )}

          <div className="flex items-center text-xs text-slate-400 gap-1.5 mt-4 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            Sua localização será registrada por segurança
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
