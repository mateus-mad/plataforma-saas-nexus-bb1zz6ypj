import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { DollarSign, FileSpreadsheet, Building2, User, Clock } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { format, differenceInMinutes, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function RelatorioCustos() {
  const [data, setData] = useState<any[]>([])
  const [workSites, setWorkSites] = useState<any[]>([])
  const [selectedSite, setSelectedSite] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(new Date().getMonth().toString())

  useEffect(() => {
    pb.collection('work_sites')
      .getFullList({ sort: 'name' })
      .then(setWorkSites)
      .catch(console.error)
  }, [])

  useEffect(() => {
    loadReport()
  }, [month])

  const loadReport = async () => {
    setLoading(true)
    try {
      const year = new Date().getFullYear()
      const m = parseInt(month)
      const startOfMonth = new Date(year, m, 1).toISOString()
      const endOfMonth = new Date(year, m + 1, 0, 23, 59, 59).toISOString()

      const entries = await pb.collection('time_entries').getFullList({
        filter: `timestamp >= '${startOfMonth}' && timestamp <= '${endOfMonth}'`,
        expand: 'relacionamento_id,work_site_id',
        sort: 'timestamp',
      })

      const userSiteGroups: Record<string, any> = {}

      entries.forEach((entry) => {
        const relId = entry.relacionamento_id
        if (!relId) return

        const siteId = entry.work_site_id || 'unassigned'
        const dateStr = entry.timestamp.split('T')[0]

        const key = `${relId}_${siteId}`
        if (!userSiteGroups[key]) {
          userSiteGroups[key] = {
            rel: entry.expand?.relacionamento_id,
            site: entry.expand?.work_site_id,
            days: {},
            totalMinutes: 0,
          }
        }

        if (!userSiteGroups[key].days[dateStr]) {
          userSiteGroups[key].days[dateStr] = []
        }
        userSiteGroups[key].days[dateStr].push(entry)
      })

      const reportRows = Object.values(userSiteGroups).map((group) => {
        let totalMinutes = 0

        Object.values(group.days).forEach((dayEntries: any) => {
          const sorted = dayEntries.sort((a: any, b: any) => a.timestamp.localeCompare(b.timestamp))
          const entradas = sorted.filter((e: any) => e.type === 'entrada')
          const saidas = sorted.filter((e: any) => e.type === 'saida')

          if (entradas.length > 0 && saidas.length > 0) {
            const start = parseISO(entradas[0].timestamp)
            const end = parseISO(saidas[saidas.length - 1].timestamp)
            let mins = differenceInMinutes(end, start)

            const pInicio = sorted.filter((e: any) => e.type === 'pausa_inicio')
            const pFim = sorted.filter((e: any) => e.type === 'pausa_fim')

            if (pInicio.length > 0 && pFim.length > 0) {
              const pStart = parseISO(pInicio[0].timestamp)
              const pEnd = parseISO(pFim[0].timestamp)
              mins -= differenceInMinutes(pEnd, pStart)
            }
            totalMinutes += Math.max(0, mins)
          }
        })

        const salaryData = group.rel?.salary_details || {}
        const hourlyRate = parseFloat(salaryData.hourly_rate || '15.00')
        const hours = totalMinutes / 60
        const totalCost = hours * hourlyRate

        return {
          employee: group.rel?.name || 'Desconhecido',
          employeeId: group.rel?.id,
          workSite: group.site?.name || 'Não Assinalado',
          siteId: group.site?.id || 'unassigned',
          costCenter: group.site?.cost_center || '-',
          hours: hours.toFixed(1),
          hourlyRate,
          totalCost,
        }
      })

      setData(reportRows)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  const filteredData = data.filter((row) => selectedSite === 'all' || row.siteId === selectedSite)

  const grandTotal = filteredData.reduce((acc, row) => acc + row.totalCost, 0)
  const totalHours = filteredData.reduce((acc, row) => acc + parseFloat(row.hours), 0)

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10 px-4 md:px-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
              Fechamento e Custos
            </h2>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Acompanhe o custo de mão de obra por colaborador e centro de custo.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Select value={selectedSite} onValueChange={setSelectedSite}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white min-h-[44px]">
              <SelectValue placeholder="Obra / Centro de Custo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Obras</SelectItem>
              {workSites.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name} {site.cost_center ? `(${site.cost_center})` : ''}
                </SelectItem>
              ))}
              <SelectItem value="unassigned">Não Assinalado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white min-h-[44px]">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }).map((_, i) => {
                const d = new Date()
                d.setMonth(i)
                return (
                  <SelectItem key={i} value={i.toString()}>
                    {format(d, 'MMMM', { locale: ptBR }).toUpperCase()}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-white w-full sm:w-auto min-h-[44px]">
            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
            Exportar XLS
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Custo Total Projetado</p>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(grandTotal)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Horas Totais</p>
              <p className="text-2xl font-bold text-slate-800">{totalHours.toFixed(1)}h</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Obras Ativas</p>
              <p className="text-2xl font-bold text-slate-800">
                {new Set(filteredData.map((d) => d.costCenter)).size}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200 w-full min-w-0">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Centro de Custo</TableHead>
                <TableHead className="text-right">Horas Trabalhadas</TableHead>
                <TableHead className="text-right">Custo Hora (Estimado)</TableHead>
                <TableHead className="text-right">Custo Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium text-slate-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    {row.employee}
                  </TableCell>
                  <TableCell className="text-slate-600">{row.workSite}</TableCell>
                  <TableCell>
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-mono">
                      {row.costCenter}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-600">
                    {row.hours}h
                  </TableCell>
                  <TableCell className="text-right text-slate-500">
                    {formatCurrency(row.hourlyRate)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-800">
                    {formatCurrency(row.totalCost)}
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    Nenhum registro de ponto encontrado para o período.
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
