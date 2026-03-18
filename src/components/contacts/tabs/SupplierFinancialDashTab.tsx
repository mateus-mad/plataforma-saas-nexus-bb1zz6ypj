import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from 'recharts'
import {
  DollarSign,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Receipt,
  FileText,
  CalendarDays,
  CreditCard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const punctData = [
  { name: 'No Prazo', value: 80, fill: '#10b981' },
  { name: 'Atrasado', value: 15, fill: '#f43f5e' },
  { name: 'Antecipado', value: 5, fill: '#3b82f6' },
]

const paymentMethods = [
  { name: 'PIX', value: 65, fill: '#8b5cf6' },
  { name: 'TED', value: 25, fill: '#3b82f6' },
  { name: 'Boleto', value: 10, fill: '#f59e0b' },
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
    <CardContent className="p-4 flex items-center gap-4 h-full">
      <div className={`p-3 rounded-xl ${color} shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 leading-tight">
          {title}
        </p>
        <h4 className="text-lg sm:text-xl font-black text-slate-800 leading-none">{val}</h4>
      </div>
    </CardContent>
  </Card>
)

export default function SupplierFinancialDashTab({ data }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
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
        <KpiCard
          title="Média vs Venc."
          val="-2 Dias"
          icon={CalendarDays}
          color="bg-teal-100 text-teal-600"
        />
        <KpiCard
          title="Dias de Atraso"
          val="0"
          icon={AlertCircle}
          color="bg-rose-100 text-rose-600"
        />
        <KpiCard
          title="Dias Adiant."
          val="12"
          icon={TrendingUp}
          color="bg-blue-100 text-blue-600"
        />
        <KpiCard
          title="Forma Principal"
          val="PIX"
          icon={CreditCard}
          color="bg-indigo-100 text-indigo-600"
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
                  innerRadius={45}
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
            <div className="flex gap-4 mt-2 text-[11px] font-semibold text-slate-600">
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
              Histórico de Faturamento Mensal
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

        <Card className="shadow-sm border-slate-200 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-800">Formas de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[260px] pb-4">
            <ChartContainer config={{}} className="w-full h-44">
              <PieChart>
                <Pie
                  data={paymentMethods}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {paymentMethods.map((e, i) => (
                    <Cell key={i} fill={e.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="flex gap-4 mt-2 text-[11px] font-semibold text-slate-600 flex-wrap justify-center">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-purple-500" /> PIX
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> TED
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500" /> Boleto
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 lg:col-span-4 flex flex-col sm:flex-row bg-gradient-to-r from-blue-50 to-white overflow-hidden">
          <CardContent className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">
                  Análise da Última Compra (Pedido #4928)
                </p>
                <p className="text-2xl font-black text-slate-800">R$ 12.450,00</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                    <CalendarDays className="w-4 h-4 text-slate-400" /> Emitido: 14/03/2026
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Entregue no prazo sem ocorrências
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto text-blue-700 border-blue-200 bg-white hover:bg-blue-50 shadow-sm font-semibold h-11 px-6 shrink-0"
            >
              Abrir Detalhes do Pedido
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
