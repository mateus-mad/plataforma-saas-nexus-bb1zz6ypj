import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CircleDollarSign, Building2 } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { startOfDay } from 'date-fns'

export default function RelatorioCustos() {
  const [siteCosts, setSiteCosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const today = startOfDay(new Date())
      const [todayEntries] = await Promise.all([
        pb.collection('time_entries').getFullList({
          filter: `timestamp >= '${today.toISOString().replace('T', ' ')}' && type = 'entrada'`,
          expand: 'relacionamento_id,work_site_id',
        }),
      ])

      const costsBySite = new Map<
        string,
        { site: any; count: number; totalCost: number; workers: any[] }
      >()

      todayEntries.forEach((entry) => {
        const siteId = entry.work_site_id
        if (!siteId) return

        if (!costsBySite.has(siteId)) {
          costsBySite.set(siteId, {
            site: entry.expand?.work_site_id,
            count: 0,
            totalCost: 0,
            workers: [],
          })
        }

        const siteData = costsBySite.get(siteId)!
        const rel = entry.expand?.relacionamento_id

        if (rel && !siteData.workers.find((w) => w.id === rel.id)) {
          siteData.workers.push(rel)
          siteData.count += 1

          const salaryStr = rel.salary_details?.base_salary || '0'
          const salary = parseFloat(salaryStr.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
          const dailyRate = salary > 0 ? salary / 30 : 0

          siteData.totalCost += dailyRate
        }
      })

      setSiteCosts(Array.from(costsBySite.values()))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  const totalGlobal = siteCosts.reduce((acc, curr) => acc + curr.totalCost, 0)

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10 px-4 md:px-0">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
          Custos por Obra (Diário)
        </h2>
        <p className="text-muted-foreground mt-1">
          Estimativa de custo de mão de obra baseada nos presentes do dia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <CircleDollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-primary/80 font-medium">Custo Total Hoje</p>
                <h3 className="text-3xl font-bold text-primary">{formatCurrency(totalGlobal)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Obra</TableHead>
                <TableHead>Centro de Custo</TableHead>
                <TableHead className="text-right">Colaboradores Presentes</TableHead>
                <TableHead className="text-right">Custo Estimado (Dia)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {siteCosts.map((item) => (
                <TableRow key={item.site.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {item.site.name}
                    </div>
                  </TableCell>
                  <TableCell>{item.site.cost_center || '-'}</TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                  <TableCell className="text-right font-semibold text-slate-800">
                    {formatCurrency(item.totalCost)}
                  </TableCell>
                </TableRow>
              ))}
              {siteCosts.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    Nenhum custo registrado para as obras hoje.
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
