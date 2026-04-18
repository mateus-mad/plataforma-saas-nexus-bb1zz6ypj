import { useRealtime } from '@/hooks/use-realtime'
import { toast } from 'sonner'
import { MapPin, Clock } from 'lucide-react'
import pb from '@/lib/pocketbase/client'

export default function PontoRealtimeNotifications() {
  useRealtime('time_entries', async (e) => {
    if (e.action === 'create') {
      try {
        const entry = await pb.collection('time_entries').getOne(e.record.id, {
          expand: 'user_id,work_site_id',
        })

        const userName =
          entry.expand?.user_id?.name || entry.expand?.user_id?.email || 'Colaborador'
        const siteName = entry.expand?.work_site_id?.name || 'Local Desconhecido'
        const time = new Date(entry.timestamp).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
        const typeLabel = entry.type.replace('_', ' ').toUpperCase()

        toast.custom(
          (t) => (
            <div className="flex items-start gap-3 w-full bg-slate-900 text-white border border-slate-800 shadow-2xl rounded-xl p-4 animate-in slide-in-from-bottom-5">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-500 relative">
                  <MapPin className="w-6 h-6 z-10" />
                  <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-30" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-bold leading-tight flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                  Alerta de Ponto: {userName}
                </p>
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {time} - {typeLabel}
                </p>
                <p className="text-xs text-slate-100 font-medium bg-white/10 w-fit px-2 py-1 rounded border border-white/5 mt-1">
                  📍 {siteName}
                </p>
              </div>
            </div>
          ),
          { duration: 8000, position: 'bottom-right' },
        )
      } catch (err) {
        console.error('Error fetching time entry details for notification', err)
      }
    }
  })

  return null
}
