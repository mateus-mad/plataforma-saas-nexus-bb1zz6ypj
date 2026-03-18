import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts'
import { CheckCircle2, Truck, PackageCheck, AlertTriangle, ShieldCheck } from 'lucide-react'

const leadTimeData = [
  { month: 'Jan', days: 5 },
  { month: 'Fev', days: 4 },
  { month: 'Mar', days: 6 },
  { month: 'Abr', days: 3 },
  { month: 'Mai', days: 4 },
  { month: 'Jun', days: 4 },
]

const qualityData = [
  { month: 'Jan', rate: 98 },
  { month: 'Fev', rate: 97 },
  { month: 'Mar', rate: 99 },
  { month: 'Abr', rate: 100 },
  { month: 'Mai', rate: 98 },
  { month: 'Jun', rate: 99 },
]

export default function SupplierPerformanceTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Lead Time Médio</p>
              <h3 className="text-2xl font-bold text-slate-800">
                4.3 <span className="text-sm font-normal text-slate-500">dias</span>
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Qualidade de Entrega</p>
              <h3 className="text-2xl font-bold text-slate-800">98%</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Qualidade Produto</p>
              <h3 className="text-2xl font-bold text-slate-800">99.5%</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Ocorrências / SLA</p>
              <h3 className="text-2xl font-bold text-slate-800">
                2 <span className="text-sm font-normal text-slate-500">/ ano</span>
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-slate-700 flex items-center gap-2">
              Evolução do Lead Time (Dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ days: { label: 'Dias', color: 'hsl(var(--primary))' } }}
              className="h-[200px] w-full"
            >
              <BarChart data={leadTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-slate-200"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs text-slate-500"
                />
                <YAxis tickLine={false} axisLine={false} className="text-xs text-slate-500" />
                <ChartTooltip
                  cursor={{ fill: 'var(--color-slate-50)' }}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="days" fill="var(--color-days)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-slate-700 flex items-center gap-2">
              Índice de Qualidade na Entrega (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ rate: { label: 'Taxa (%)', color: '#10b981' } }}
              className="h-[200px] w-full"
            >
              <LineChart data={qualityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-slate-200"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs text-slate-500"
                />
                <YAxis
                  domain={[90, 100]}
                  tickLine={false}
                  axisLine={false}
                  className="text-xs text-slate-500"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--color-rate)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base text-slate-700 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-blue-500" /> Aderência ao Catálogo do Fornecedor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 font-medium">
                Itens comprados vs Total disponível no catálogo
              </span>
              <span className="font-bold text-slate-800 text-lg">37.5%</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div className="h-full bg-blue-500 w-[37.5%] transition-all duration-1000" />
            </div>
            <div className="flex justify-between items-center mt-4 text-xs text-slate-500">
              <p>
                O fornecedor possui <strong>1.200 itens</strong> catalogados.
              </p>
              <p>
                Atualmente compramos <strong>450 itens</strong> ativamente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
