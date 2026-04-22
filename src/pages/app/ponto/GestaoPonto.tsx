import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Users, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { format, startOfDay, isAfter, setHours, setMinutes } from 'date-fns'
import { useRealtime } from '@/hooks/use-realtime'

export default function GestaoPonto() {
  const [entries, setEntries] = useState<any[]>([])
  const [allocations, setAllocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('time_entries', () => {
    loadData()
  })

  const loadData = async () => {
    try {
      const today = startOfDay(new Date())
      const [todayEntries, activeAllocs] = await Promise.all([
        pb.collection('time_entries').getFullList({
          filter: `timestamp >= '${today.toISOString().replace('T', ' ')}'`,
          expand: 'relacionamento_id,work_site_id',
          sort: '-timestamp',
        }),
        pb.collection('allocations').getFullList({
          filter: `status = 'ativo'`,
          expand: 'relacionamento_id,work_site_id',
        }),
      ])

      setEntries(todayEntries)
      setAllocations(activeAllocs)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const uniquePresent = new Set(entries.map((e) => e.relacionamento_id)).size
  const totalAllocated = allocations.length
  const absentCount = Math.max(0, totalAllocated - uniquePresent)

  const defaultStartTime = setMinutes(setHours(new Date(), 8), 0)

  const inDelay = entries.filter((e) => {
    if (e.type !== 'entrada') return false
    const entryTime = new Date(e.timestamp)
    return isAfter(entryTime, setMinutes(defaultStartTime, 10))
  })

  const uniqueDelays = Array.from(
    new Map(inDelay.map((item) => [item.relacionamento_id, item])).values(),
  )

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10 px-4 md:px-0">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
          Painel de Monitoramento
        </h2>
        <p className="text-muted-foreground mt-1">Visão em tempo real das obras e colaboradores.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Alocados</p>
                <h3 className="text-2xl font-bold text-slate-800">{totalAllocated}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Presentes</p>
                <h3 className="text-2xl font-bold text-slate-800">{uniquePresent}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Atrasos</p>
                <h3 className="text-2xl font-bold text-slate-800">{uniqueDelays.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Ausentes</p>
                <h3 className="text-2xl font-bold text-slate-800">{absentCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Eventos Recentes (Hoje)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.slice(0, 50).map((entry) => {
                const rel = entry.expand?.relacionamento_id
                const site = entry.expand?.work_site_id
                const isDelay =
                  entry.type === 'entrada' &&
                  isAfter(new Date(entry.timestamp), setMinutes(defaultStartTime, 10))

                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{rel?.name || 'Desconhecido'}</TableCell>
                    <TableCell>{site?.name || '-'}</TableCell>
                    <TableCell>{format(new Date(entry.timestamp), 'HH:mm')}</TableCell>
                    <TableCell className="capitalize">{entry.type.replace('_', ' ')}</TableCell>
                    <TableCell>
                      {isDelay ? (
                        <Badge
                          variant="destructive"
                          className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100"
                        >
                          Atraso
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200"
                        >
                          No Horário
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {entries.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    Nenhum registro encontrado hoje.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
