import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { DollarSign, AlertCircle, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react'

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
]

const KpiCard = ({ title, val, icon: Icon, color }: any) => (
  <Card className="shadow-sm border-slate-200">
    <CardContent className="p-5 flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{title}</p>
        <h4 className="text-2xl font-black text-slate-800 leading-none">{val}</h4>
      </div>
    </CardContent>
  </Card>
)

export default function SupplierFinancialDashTab({ data }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm border-slate-200 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-800">
              Análise de Pontualidade
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center h-[280px]">
            <ChartContainer config={{}} className="w-full h-full">
              <PieChart>
                <Pie
                  data={punctData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {punctData.map((e, i) => (
                    <Cell key={i} fill={e.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-800">
              Histórico: Pago vs Pendente (R$)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ChartContainer config={{}} className="w-full h-full">
              <BarChart data={histData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
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
      </div>
    </div>
  )
}
