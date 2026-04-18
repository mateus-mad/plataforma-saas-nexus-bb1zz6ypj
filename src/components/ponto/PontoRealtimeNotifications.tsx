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
            <div className="flex items-start gap-3 w-full bg-white border border-slate-200 shadow-xl rounded-xl p-4 animate-in slide-in-from-bottom-5">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-slate-900 leading-tight">
                  Novo Ponto: {userName}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {time} - {typeLabel}
                </p>
                <p className="text-xs text-primary font-medium bg-primary/5 w-fit px-2 py-0.5 rounded border border-primary/10 mt-1">
                  {siteName}
                </p>
              </div>
            </div>
          ),
          { duration: 6000 },
        )
      } catch (err) {
        console.error('Error fetching time entry details for notification', err)
      }
    }
  })

  return null
}
