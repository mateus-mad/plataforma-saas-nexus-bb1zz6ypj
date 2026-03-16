import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  UserSquare2,
  Truck,
  TrendingUp,
  AlertTriangle,
  Building2,
  UserPlus,
  ShieldAlert,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const CHART_DATA = [
  { month: 'Nov', contratacoes: 2, desligamentos: 1 },
  { month: 'Dez', contratacoes: 3, desligamentos: 0 },
  { month: 'Jan', contratacoes: 5, desligamentos: 2 },
  { month: 'Fev', contratacoes: 4, desligamentos: 1 },
  { month: 'Mar', contratacoes: 7, desligamentos: 0 },
]

const SECTOR_DATA = [
  { name: 'Civil', value: 45, color: 'hsl(var(--chart-1))' },
  { name: 'Solar', value: 30, color: 'hsl(var(--chart-2))' },
  { name: 'Metalúrgica', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Administrativo', value: 15, color: 'hsl(var(--chart-4))' },
]

const chartConfig = {
  contratacoes: { label: 'Contratações', color: 'hsl(var(--chart-2))' },
  desligamentos: { label: 'Desligamentos', color: 'hsl(var(--chart-3))' },
}

const sectorConfig = {
  Civil: { label: 'Civil', color: 'hsl(var(--chart-1))' },
  Solar: { label: 'Solar', color: 'hsl(var(--chart-2))' },
  Metalurgica: { label: 'Metalúrgica', color: 'hsl(var(--chart-3))' },
  Administrativo: { label: 'Administrativo', color: 'hsl(var(--chart-4))' },
}

export default function ContactsDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <h2 className="text-2xl font-bold tracking-tight text-slate-800">
        BI & Insights de Relacionamento
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Colaboradores
            </CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">124</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +12% este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Clientes Ativos</CardTitle>
            <UserSquare2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">45</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +3 novos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Fornecedores</CardTitle>
            <Truck className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">28</div>
            <p className="text-xs text-slate-500 mt-1">1 pendente de revisão</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-600 text-white border-none shadow-md shadow-blue-600/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">
              Admissões em Andamento
            </CardTitle>
            <UserPlus className="w-4 h-4 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-blue-200 mt-1">Aguardando envio de docs</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Movimentação de RH (Crescimento)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="contratacoes"
                    fill="var(--color-contratacoes)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="desligamentos"
                    fill="var(--color-desligamentos)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição por Setor</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sectorConfig} className="h-[250px]">
              <PieChart>
                <Pie
                  data={SECTOR_DATA}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {SECTOR_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alertas do Sistema (eSocial & Docs)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-100 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-800 text-sm">Exame Periódico Vencendo</p>
                <p className="text-xs text-rose-600 mt-0.5">
                  O exame ocupacional periódico de "Ana Souza" vence em 5 dias. Agende a renovação.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">Férias Próximas do Limite</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  O colaborador "Carlos Mendes" possui férias acumuladas chegando ao limite legal
                  (dobro).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-800 text-sm">Lote eSocial Pendente</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Existem 2 admissões prontas para envio ao eSocial. Revise os dados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
