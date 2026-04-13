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
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getTimeEntries, TimeEntry } from '@/services/time_entries'
import { useRealtime } from '@/hooks/use-realtime'
import { format, parseISO } from 'date-fns'

export default function GestaoPonto() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [searchTerm, setSearchTerm] = useState('')

  const loadEntries = async () => {
    try {
      const start = new Date(`${month}-01T00:00:00`)
      const end = new Date(start)
      end.setMonth(end.getMonth() + 1)

      const filter = `timestamp >= '${start.toISOString().replace('T', ' ')}' && timestamp < '${end.toISOString().replace('T', ' ')}'`
      const data = await getTimeEntries(filter, 'user_id,relacionamento_id')
      setEntries(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadEntries()
  }, [month])

  useRealtime('time_entries', () => {
    loadEntries()
  })

  const filtered = entries.filter((e) => {
    const name = e.expand?.user_id?.name || e.expand?.user_id?.email || ''
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Ponto</h2>
          <p className="text-muted-foreground">
            Monitore em tempo real as marcações de ponto da equipe.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Input
            placeholder="Buscar colaborador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-64"
          />
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-48"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Auditoria de Registros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Data e Hora</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>IP / Localização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium text-slate-800">
                      {e.expand?.user_id?.name || e.expand?.user_id?.email || 'Desconhecido'}
                    </TableCell>
                    <TableCell>{format(new Date(e.timestamp), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-slate-50 uppercase text-[10px] tracking-wider font-bold"
                      >
                        {e.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      <div className="flex flex-col">
                        <span>{e.metadata?.ip || 'IP não registrado'}</span>
                        {e.metadata?.location && (
                          <span className="text-primary/70">
                            Lat: {e.metadata.location.lat.toFixed(4)}, Lng:{' '}
                            {e.metadata.location.lng.toFixed(4)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Nenhum registro encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
