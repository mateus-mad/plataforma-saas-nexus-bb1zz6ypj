import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts'
import { CheckCircle2, Truck, PackageCheck, AlertTriangle, ShieldCheck, Box } from 'lucide-react'

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-sm border-slate-200 hover:border-blue-300 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 shadow-inner">
              <Truck className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Prazo de Entrega
              </p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">
                4.3 <span className="text-base font-medium text-slate-500">Dias</span>
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 hover:border-emerald-300 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Qualidade da Entrega
              </p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">
                98% <span className="text-base font-medium text-emerald-600 ml-1">SLA</span>
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 hover:border-purple-300 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0 shadow-inner">
              <CheckCircle2 className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Qualidade dos Produtos
              </p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">99.5%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2 border-b border-slate-100 mb-4">
            <CardTitle className="text-base font-bold text-slate-700 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-500" /> Evolução do Lead Time (Dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ days: { label: 'Dias de Entrega', color: 'hsl(var(--primary))' } }}
              className="h-[220px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
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
                    className="text-xs font-medium text-slate-500"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="text-xs font-medium text-slate-500"
                  />
                  <ChartTooltip
                    cursor={{ fill: 'var(--color-slate-50)' }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="days" fill="var(--color-days)" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2 border-b border-slate-100 mb-4">
            <CardTitle className="text-base font-bold text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Índice de Qualidade Geral (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ rate: { label: 'Taxa de Qualidade (%)', color: '#10b981' } }}
              className="h-[220px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
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
                    className="text-xs font-medium text-slate-500"
                  />
                  <YAxis
                    domain={[90, 100]}
                    tickLine={false}
                    axisLine={false}
                    className="text-xs font-medium text-slate-500"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--color-rate)"
                    strokeWidth={4}
                    dot={{ r: 5, fill: '#fff', strokeWidth: 3 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 lg:col-span-2 bg-gradient-to-r from-slate-50 to-white">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 w-full space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <PackageCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Aderência ao Catálogo (Share of Wallet)
                    </h3>
                    <p className="text-sm text-slate-500">
                      Visualização de Produtos no Catálogo vs Produtos Comprados
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-slate-700 font-semibold flex items-center gap-2">
                      <Box className="w-4 h-4 text-slate-400" /> Penetração de Portfólio
                    </span>
                    <span className="font-black text-blue-600 text-lg">37.5%</span>
                  </div>
                  <div className="h-5 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                    <div className="h-full bg-blue-600 w-[37.5%] transition-all duration-1000 relative">
                      <div className="absolute inset-0 bg-white/20 w-full animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      Produtos no Catálogo
                    </p>
                    <p className="text-2xl font-black text-slate-800 mt-1">1.200</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm text-center">
                    <p className="text-xs font-bold text-blue-600 uppercase">Produtos Comprados</p>
                    <p className="text-2xl font-black text-blue-700 mt-1">450</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-72 shrink-0 bg-white border border-amber-200 rounded-xl p-5 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -z-10" />
                <AlertTriangle className="w-6 h-6 text-amber-500 mb-3" />
                <h4 className="font-bold text-slate-800 mb-2">Atenção ao Risco</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  O fornecedor concentra <b>37.5%</b> do volume total de compras de suprimentos na
                  categoria "Ferramentas". Recomenda-se diversificação para evitar dependência
                  logística.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
