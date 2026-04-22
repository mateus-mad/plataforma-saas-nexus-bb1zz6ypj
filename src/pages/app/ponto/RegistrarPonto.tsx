import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { createTimeEntry, getTimeEntries, TimeEntry } from '@/services/time_entries'
import { getWorkSiteByToken, WorkSite } from '@/services/work_sites'
import pb from '@/lib/pocketbase/client'
import { createSecurityAlert } from '@/services/security_alerts'
import { useToast } from '@/hooks/use-toast'
import { Clock, MapPin, Camera, AlertTriangle, CheckCircle2, Search } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function RegistrarPonto() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const urlToken = searchParams.get('token')

  const [tokenInput, setTokenInput] = useState('')
  const [workSite, setWorkSite] = useState<WorkSite | null>(null)
  const [relacionamentoId, setRelacionamentoId] = useState<string>('')

  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastEntry, setLastEntry] = useState<TimeEntry | null>(null)

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [locError, setLocError] = useState('')

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (user) {
      loadLastEntry()
      fetchRelacionamento()
    }
  }, [user])

  useEffect(() => {
    if (urlToken) {
      validateToken(urlToken)
    } else if (user) {
      requestInitialLocationForAutoDetect()
    }
  }, [urlToken, user])

  const fetchRelacionamento = async () => {
    if (!user) return
    try {
      const rels = await pb
        .collection('relacionamentos')
        .getFullList({ filter: `login_user_id = '${user.id}'` })
      if (rels.length > 0) setRelacionamentoId(rels[0].id)
    } catch (err) {
      console.error('No relacionamento found for user', err)
    }
  }

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
    }
  }

  const requestInitialLocationForAutoDetect = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocalização não suportada.')
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setLocation({ lat, lng })
        await autoDetectWorkSite(lat, lng)
        setLoading(false)
      },
      (err) => {
        setLocError('Acesso à localização negado.')
        setLoading(false)
      },
      { enableHighAccuracy: true },
    )
  }

  const autoDetectWorkSite = async (lat: number, lng: number) => {
    try {
      const rels = await pb
        .collection('relacionamentos')
        .getFullList({ filter: `login_user_id = '${user?.id}'` })
      if (rels.length === 0) return

      const relId = rels[0].id
      setRelacionamentoId(relId)

      const allocations = await pb.collection('allocations').getFullList({
        filter: `relacionamento_id = '${relId}' && status = 'ativo'`,
        expand: 'work_site_id',
      })

      for (const alloc of allocations) {
        const site = alloc.expand?.work_site_id as WorkSite
        if (site) {
          const dist = getDistance(lat, lng, site.latitude, site.longitude)
          if (dist <= site.radius_meters) {
            setWorkSite(site)
            setDistance(dist)
            startCamera()
            toast({ title: `Obra ${site.name} detectada automaticamente.` })
            return
          }
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const validateToken = async (token: string) => {
    setLoading(true)
    try {
      const site = await getWorkSiteByToken(token)
      if (!site) {
        toast({ title: 'Obra não encontrada ou QR Code inválido', variant: 'destructive' })
        return
      }
      setWorkSite(site)
      setSearchParams({ token })
      requestLocation(site)
      startCamera()
    } catch (error) {
      toast({ title: 'Erro ao validar QR Code', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const requestLocation = (site: WorkSite) => {
    if (!navigator.geolocation) {
      setLocError('Geolocalização não suportada pelo navegador.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setLocation({ lat, lng })
        const dist = getDistance(lat, lng, site.latitude, site.longitude)
        setDistance(dist)

        if (dist > site.radius_meters) {
          handleOutofBounds()
        }
      },
      (err) => {
        setLocError('Acesso à localização negado ou falhou. É obrigatório para registrar o ponto.')
      },
      { enableHighAccuracy: true },
    )
  }

  const handleOutofBounds = () => {
    const attemptsStr = localStorage.getItem('geofence_attempts') || '0'
    const attempts = parseInt(attemptsStr, 10) + 1
    localStorage.setItem('geofence_attempts', attempts.toString())

    if (attempts >= 3 && user) {
      createSecurityAlert({
        user_id: user.id,
        type: 'geofence_violation',
        message: `Colaborador tentou bater ponto fora do perímetro 3 ou mais vezes.`,
      }).catch(console.error)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      toast({
        title: 'Acesso à câmera negado. É obrigatório para registrar o ponto.',
        variant: 'destructive',
      })
    }
  }

  const capturePhoto = (): Promise<File | null> => {
    return new Promise((resolve) => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || !cameraActive) {
        return resolve(null)
      }
      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve(null)

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(null)
          const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' })
          resolve(file)
        },
        'image/jpeg',
        0.8,
      )
    })
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
          label: 'Nova Entrada (Hora Extra)',
          color: 'bg-emerald-600 hover:bg-emerald-700',
        }
      default:
        return { type: 'entrada', label: 'Registrar Ponto', color: 'bg-primary' }
    }
  }

  const handleRegister = async () => {
    if (!workSite || !location) return

    if (distance !== null && distance > workSite.radius_meters) {
      toast({
        title: 'Você está fora do perímetro permitido para esta obra.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const photoFile = await capturePhoto()
      if (!photoFile) {
        toast({ title: 'Falha ao capturar foto. Verifique a câmera.', variant: 'destructive' })
        setSaving(false)
        return
      }

      const action = getNextAction()

      const formData = new FormData()
      formData.append('user_id', user.id)
      if (relacionamentoId) formData.append('relacionamento_id', relacionamentoId)
      formData.append('work_site_id', workSite.id)
      formData.append('timestamp', new Date().toISOString())
      formData.append('type', action.type)
      formData.append('latitude', location.lat.toString())
      formData.append('longitude', location.lng.toString())
      formData.append('photo', photoFile)

      await createTimeEntry(formData)

      toast({
        title: 'Ponto registrado com sucesso!',
        description: `Ponto registrado na obra ${workSite.name} às ${format(currentTime, 'HH:mm')}.`,
      })

      localStorage.removeItem('geofence_attempts')
      await loadLastEntry()
    } catch (error) {
      toast({ title: 'Erro ao registrar ponto', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const isOutOfBounds = distance !== null && workSite && distance > workSite.radius_meters
  const canRegister = distance !== null && !isOutOfBounds && !locError && cameraActive && !saving

  const action = getNextAction()

  if (loading && !workSite) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 animate-fade-in">
        <div className="flex flex-col items-center text-slate-500 space-y-4">
          <Search className="w-10 h-10 animate-bounce text-primary" />
          <p>Detectando obra mais próxima através das suas alocações...</p>
        </div>
      </div>
    )
  }

  if (!workSite) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 animate-fade-in">
        <Card className="w-full max-w-md shadow-lg border-slate-200">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-800">Scanner de Obra</h2>
              <p className="text-sm text-slate-500">
                Nenhuma obra alocada próxima detectada automaticamente. Acesse o link gerado pelo QR
                Code da obra ou insira o token manualmente.
              </p>
            </div>
            <div className="w-full space-y-3">
              <Input
                placeholder="Token da Obra"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={() => validateToken(tokenInput)}
                disabled={loading || !tokenInput}
              >
                {loading ? 'Validando...' : 'Validar Token'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 animate-in fade-in slide-in-from-bottom-4">
      <Card className="w-full max-w-md shadow-2xl border-slate-200/60 bg-white/80 backdrop-blur-xl overflow-hidden">
        <div className="bg-slate-900 text-white p-4 text-center">
          <h2 className="font-semibold text-lg truncate">{workSite.name}</h2>
          <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {distance !== null
              ? `A ${Math.round(distance)}m de distância`
              : 'Calculando distância...'}
          </div>
        </div>

        <CardContent className="p-6 flex flex-col items-center text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-slate-500 capitalize">
              {format(currentTime, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </h2>
            <div className="text-5xl font-bold tracking-tighter text-slate-800 tabular-nums">
              {format(currentTime, 'HH:mm:ss')}
            </div>
          </div>

          <div className="relative w-full aspect-square bg-slate-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            {!cameraActive && (
              <div className="text-slate-400 flex flex-col items-center">
                <Camera className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-sm">Iniciando câmera...</span>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="w-full space-y-2">
            {locError ? (
              <div className="text-sm text-rose-500 bg-rose-50 p-2 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="text-left">{locError}</span>
              </div>
            ) : isOutOfBounds ? (
              <div className="text-sm text-rose-500 bg-rose-50 p-2 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="text-left">
                  Você está fora do perímetro permitido para esta obra.
                </span>
              </div>
            ) : (
              distance !== null && (
                <div className="text-sm text-emerald-600 bg-emerald-50 p-2 rounded-lg flex items-center gap-2 justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dentro do perímetro autorizado</span>
                </div>
              )
            )}
          </div>

          <Button
            size="lg"
            className={`w-full h-14 text-lg shadow-lg transition-all active:scale-95 ${
              canRegister
                ? action.color
                : 'bg-slate-300 text-slate-500 hover:bg-slate-300 cursor-not-allowed'
            }`}
            onClick={handleRegister}
            disabled={!canRegister}
          >
            <Clock className="w-5 h-5 mr-2" />
            {saving ? 'Registrando...' : action.label}
          </Button>

          {lastEntry && (
            <p className="text-sm text-slate-500 font-medium">
              Último registro: {format(new Date(lastEntry.timestamp), 'HH:mm')} (
              {lastEntry.type.replace('_', ' ').toUpperCase()})
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
