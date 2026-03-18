import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import {
  DollarSign,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Receipt,
  FileText,
  CalendarDays,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const punctData = [
  { name: 'No Prazo', value: 80, fill: '#10b981' },
  { name: 'Atrasado', value: 15, fill: '#f43f5e' },
  { name: 'Antecipado', value: 5, fill: '#3b82f6' },
]

const histData = [
  { month: 'Nov', pago: 12000, pendente: 0 },
  { month: 'Dez', pago: 15000, pendente: 0 },
  { month: 'Jan', pago: 10000, pendente: 8000 },
  { month: 'Fev', pago: 5000, pendente: 15000 },
  { month: 'Mar', pago: 2000, pendente: 5000 },
]

const KpiCard = ({ title, val, icon: Icon, color }: any) => (
  <Card className="shadow-sm border-slate-200">
    <CardContent className="p-4 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color} shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">
          {title}
        </p>
        <h4 className="text-xl font-black text-slate-800 leading-none">{val}</h4>
      </div>
    </CardContent>
  </Card>
)

export default function SupplierFinancialDashTab({ data }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <KpiCard
          title="Confiabilidade"
          val="98%"
          icon={ShieldCheck}
          color="bg-emerald-100 text-emerald-600"
        />
        <KpiCard
          title="Total Compras"
          val="R$ 145k"
          icon={TrendingUp}
          color="bg-blue-100 text-blue-600"
        />
        <KpiCard
          title="Total Pago"
          val="R$ 130k"
          icon={CheckCircle2}
          color="bg-emerald-100 text-emerald-600"
        />
        <KpiCard
          title="Pendente"
          val="R$ 15k"
          icon={DollarSign}
          color="bg-amber-100 text-amber-600"
        />
        <KpiCard
          title="Em Atraso"
          val="R$ 0,00"
          icon={AlertCircle}
          color="bg-rose-100 text-rose-600"
        />
        <KpiCard
          title="Faturas Pagas"
          val="18"
          icon={Receipt}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-slate-200 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-800">
              Análise de Pontualidade
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[260px] pb-4">
            <ChartContainer config={{}} className="w-full h-44">
              <PieChart>
                <Pie
                  data={punctData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {punctData.map((e, i) => (
                    <Cell key={i} fill={e.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="flex gap-4 mt-2 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Prazo
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-rose-500" /> Atraso
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> Antec.
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-800">
              Histórico de Faturamento (Pago vs Pendente)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ChartContainer config={{}} className="w-full h-full">
              <BarChart data={histData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Bar
                  dataKey="pago"
                  name="Valor Pago"
                  stackId="a"
                  fill="#10b981"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="pendente"
                  name="Valor Pendente"
                  stackId="a"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
                <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: '#f1f5f9' }} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 lg:col-span-1 flex flex-col bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-2 border-b border-blue-100">
            <CardTitle className="text-sm font-bold text-blue-900">Última Compra</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-5 flex flex-col justify-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">
                  Pedido #4928
                </p>
                <p className="text-xl font-black text-slate-800">R$ 12.450,00</p>
              </div>
            </div>
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <CalendarDays className="w-4 h-4 text-slate-400" /> Emitido: 14/03/2026
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Entregue sem ocorrências
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-auto text-blue-700 border-blue-200 bg-white hover:bg-blue-50 shadow-sm"
            >
              Detalhes do Pedido
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
