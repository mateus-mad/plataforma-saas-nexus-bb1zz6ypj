import { useState, useEffect } from 'react'
import { Bell, AlertTriangle, AlertCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { getEntities } from '@/services/entities'
import { useRealtime } from '@/hooks/use-realtime'

export const getExpiryStatus = (dateStr?: string) => {
  if (!dateStr) return 'none'
  const expiry = new Date(dateStr)
  if (isNaN(expiry.getTime())) return 'none'

  const now = new Date()
  expiry.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)

  const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 3600 * 24)
  if (diffDays < 0) return 'expired'
  if (diffDays <= 30) return 'expiring'
  return 'valid'
}

export default function NotificationCenter() {
  const [entities, setEntities] = useState<any[]>([])

  const loadData = async () => {
    try {
      const res = await getEntities('colaborador')
      setEntities(res)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('relacionamentos', loadData)

  const notifications = entities
    .map((c) => {
      const status = getExpiryStatus(c.data?.docs?.expiryDate)
      return { ...c, expiryStatus: status }
    })
    .filter((c) => c.expiryStatus === 'expired' || c.expiryStatus === 'expiring')

  const expiredCount = notifications.filter((n) => n.expiryStatus === 'expired').length
  const expiringCount = notifications.filter((n) => n.expiryStatus === 'expiring').length
  const totalCount = notifications.length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors mr-2">
          <Bell className="w-5 h-5 text-slate-600" />
          {totalCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0 rounded-xl overflow-hidden shadow-xl border-slate-200"
      >
        <div className="bg-slate-50 border-b border-slate-100 p-3 flex items-center justify-between">
          <h4 className="font-semibold text-slate-800 text-sm">Notificações de Renovação</h4>
          <Badge variant="secondary" className="bg-slate-200 text-slate-700">
            {totalCount}
          </Badge>
        </div>

        {totalCount === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Nenhum documento vencido ou próximo do vencimento.
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="flex flex-col">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors flex items-start gap-3"
                >
                  <div className="mt-0.5">
                    {n.expiryStatus === 'expired' ? (
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-800 leading-tight">{n.name}</p>
                    <p className="text-xs text-slate-500">
                      Vencimento: {new Date(n.data?.docs?.expiryDate).toLocaleDateString('pt-BR')}
                    </p>
                    <Badge
                      className={
                        n.expiryStatus === 'expired'
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-none shadow-none text-[10px] px-1.5 py-0'
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-none shadow-none text-[10px] px-1.5 py-0'
                      }
                    >
                      {n.expiryStatus === 'expired' ? 'Expirado' : 'Vence em < 30 dias'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}
