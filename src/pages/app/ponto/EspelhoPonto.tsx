import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { useAuth } from '@/hooks/use-auth'
import { getTimeEntries } from '@/services/time_entries'
import pb from '@/lib/pocketbase/client'
import { format, parseISO } from 'date-fns'

export default function EspelhoPonto() {
  const { user } = useAuth()
  const [grouped, setGrouped] = useState<Record<string, any>>({})
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [selectedColab, setSelectedColab] = useState<string>('me')

  useEffect(() => {
    loadCollaborators()
  }, [])

  const loadCollaborators = async () => {
    try {
      const rels = await pb.collection('relacionamentos').getFullList({
        filter: "type = 'colaborador'",
        sort: 'name',
      })
      setCollaborators(rels)
    } catch (e) {
      console.error('Error loading collaborators', e)
    }
  }

  useEffect(() => {
    if (user) loadEntries()
  }, [user, month, selectedColab])

  const loadEntries = async () => {
    try {
      const start = new Date(`${month}-01T00:00:00`)
      const end = new Date(start)
      end.setMonth(end.getMonth() + 1)

      let filter = `timestamp >= '${start.toISOString().replace('T', ' ')}' && timestamp < '${end.toISOString().replace('T', ' ')}'`

      if (selectedColab === 'me') {
        filter += ` && user_id = '${user.id}'`
      } else {
        filter += ` && relacionamento_id = '${selectedColab}'`
      }

      const data = await getTimeEntries(filter, 'work_site_id,relacionamento_id')

      const groups: Record<string, any> = {}
      data.forEach((e) => {
        const date = format(new Date(e.timestamp), 'yyyy-MM-dd')
        if (!groups[date]) {
          groups[date] = {
            entrada: '-',
            pausa_inicio: '-',
            pausa_fim: '-',
            saida: '-',
            raw: {},
            workSite: e.expand?.work_site_id?.name || '-',
            compliance: e.expand?.relacionamento_id?.compliance_status || 'pendente',
            hourlyRate: parseFloat(e.expand?.relacionamento_id?.salary_details?.hourly_rate || '0'),
          }
        }
        groups[date][e.type] = format(new Date(e.timestamp), 'HH:mm:ss')
        groups[date].raw[e.type] = new Date(e.timestamp)
        if (e.expand?.work_site_id) {
          groups[date].workSite = e.expand.work_site_id.name
        }
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
        g.total_hours_num = Math.max(0, total)
        g.total_horas = total > 0 ? `${Math.floor(total)}h ${Math.round((total % 1) * 60)}m` : '-'
        g.cost = g.total_hours_num * g.hourlyRate
      })

      setGrouped(groups)
    } catch (e) {
      console.error('Error loading entries', e)
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Espelho de Ponto</h2>
          <p className="text-muted-foreground">Visão detalhada de horas, custos e compliance.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={selectedColab} onValueChange={setSelectedColab}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Colaborador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="me">Meu Ponto</SelectItem>
              {collaborators.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-40 bg-white"
          />
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
          <CardTitle>Registros de {format(parseISO(`${month}-01`), 'MM/yyyy')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Obra</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Pausas</TableHead>
                  <TableHead>Saída</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead className="text-right">Total Horas</TableHead>
                  <TableHead className="text-right">Custo Diário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(grouped)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([date, entry]) => (
                    <TableRow key={date} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(new Date(date + 'T00:00:00'), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="text-slate-600 truncate max-w-[150px]">
                        {entry.workSite}
                      </TableCell>
                      <TableCell>{entry.entrada}</TableCell>
                      <TableCell className="text-slate-500 text-xs">
                        {entry.pausa_inicio !== '-' || entry.pausa_fim !== '-'
                          ? `${entry.pausa_inicio} - ${entry.pausa_fim}`
                          : '-'}
                      </TableCell>
                      <TableCell>{entry.saida}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            entry.compliance === 'em_dia'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              : entry.compliance === 'vencido'
                                ? 'bg-rose-50 text-rose-600 border-rose-200'
                                : 'bg-amber-50 text-amber-600 border-amber-200'
                          }
                        >
                          {entry.compliance.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-700 whitespace-nowrap">
                        {entry.total_horas}
                      </TableCell>
                      <TableCell className="text-right text-slate-600 whitespace-nowrap">
                        {entry.cost > 0 ? formatCurrency(entry.cost) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                {Object.keys(grouped).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
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
