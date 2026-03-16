import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  UserSquare2,
  Truck,
  TrendingUp,
  AlertTriangle,
  Building2,
  UserPlus,
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const CHART_DATA = [
  { month: 'Nov', contratacoes: 2, desligamentos: 1 },
  { month: 'Dez', contratacoes: 3, desligamentos: 0 },
  { month: 'Jan', contratacoes: 5, desligamentos: 2 },
  { month: 'Fev', contratacoes: 4, desligamentos: 1 },
  { month: 'Mar', contratacoes: 7, desligamentos: 0 },
]

const chartConfig = {
  contratacoes: { label: 'Contratações', color: 'hsl(var(--chart-2))' },
  desligamentos: { label: 'Desligamentos', color: 'hsl(var(--chart-3))' },
}

export default function ContactsDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <h2 className="text-2xl font-bold tracking-tight text-slate-800">Dashboard de Contatos</h2>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Movimentação de RH (Últimos 5 meses)</CardTitle>
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
            <CardTitle className="text-base">Alertas do Sistema (eSocial & Docs)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-800 text-sm">Férias Vencidas</p>
                <p className="text-xs text-rose-600 mt-0.5">
                  O colaborador "Carlos Mendes" possui férias acumuladas além do limite legal.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">CNH a Vencer</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  3 motoristas possuem CNH vencendo nos próximos 30 dias.
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
