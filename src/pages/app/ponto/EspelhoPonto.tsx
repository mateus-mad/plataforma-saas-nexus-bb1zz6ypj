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
import { useAuth } from '@/hooks/use-auth'
import { getTimeEntries } from '@/services/time_entries'
import { format, parseISO } from 'date-fns'

export default function EspelhoPonto() {
  const { user } = useAuth()
  const [grouped, setGrouped] = useState<Record<string, any>>({})
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'))

  useEffect(() => {
    if (user) loadEntries()
  }, [user, month])

  const loadEntries = async () => {
    try {
      const start = new Date(`${month}-01T00:00:00`)
      const end = new Date(start)
      end.setMonth(end.getMonth() + 1)

      const filter = `user_id = '${user.id}' && timestamp >= '${start.toISOString().replace('T', ' ')}' && timestamp < '${end.toISOString().replace('T', ' ')}'`
      const data = await getTimeEntries(filter)

      const groups: Record<string, any> = {}
      data.forEach((e) => {
        const date = format(new Date(e.timestamp), 'yyyy-MM-dd')
        if (!groups[date])
          groups[date] = { entrada: '-', pausa_inicio: '-', pausa_fim: '-', saida: '-', raw: {} }
        groups[date][e.type] = format(new Date(e.timestamp), 'HH:mm:ss')
        groups[date].raw[e.type] = new Date(e.timestamp)
      })

      Object.keys(groups).forEach((date) => {
        const g = groups[date]
        let total = 0
        if (g.raw.entrada && g.raw.saida) {
          total = (g.raw.saida.getTime() - g.raw.entrada.getTime()) / 1000 / 60 / 60
          if (g.raw.pausa_inicio && g.raw.pausa_fim) {
            const pausa =
              (g.raw.pausa_fim.getTime() - g.raw.pausa_inicio.getTime()) / 1000 / 60 / 60
            total -= pausa
          }
        }
        g.total_horas = total > 0 ? `${Math.floor(total)}h ${Math.round((total % 1) * 60)}m` : '-'
      })

      setGrouped(groups)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Espelho de Ponto</h2>
          <p className="text-muted-foreground">Histórico de registros da sua jornada.</p>
        </div>
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-48"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Registros ({format(parseISO(`${month}-01`), 'MM/yyyy')})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Início Pausa</TableHead>
                  <TableHead>Fim Pausa</TableHead>
                  <TableHead>Saída</TableHead>
                  <TableHead>Total Horas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(grouped)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([date, entry]) => (
                    <TableRow key={date}>
                      <TableCell className="font-medium">
                        {format(new Date(date + 'T00:00:00'), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>{entry.entrada}</TableCell>
                      <TableCell>{entry.pausa_inicio}</TableCell>
                      <TableCell>{entry.pausa_fim}</TableCell>
                      <TableCell>{entry.saida}</TableCell>
                      <TableCell className="font-bold text-slate-700">
                        {entry.total_horas}
                      </TableCell>
                    </TableRow>
                  ))}
                {Object.keys(grouped).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Nenhum registro encontrado para este período.
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
