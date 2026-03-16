import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserSquare2, Truck, AlertTriangle } from 'lucide-react'
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart'

const SECTOR_DATA = [
  { name: 'Civil', value: 120, fill: 'hsl(var(--chart-1))' },
  { name: 'Solar', value: 85, fill: 'hsl(var(--chart-2))' },
  { name: 'Metalúrgica', value: 40, fill: 'hsl(var(--chart-3))' },
  { name: 'Administrativo', value: 25, fill: 'hsl(var(--chart-4))' },
]

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
        Visão Geral de Relacionamentos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Clientes</CardTitle>
            <UserSquare2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">145</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">+12 no último mês</p>
          </CardContent>
        </Card>
        <Card className="border-amber-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Fornecedores</CardTitle>
            <Truck className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">83</div>
            <p className="text-xs text-amber-600 mt-1 font-medium">Ativos no sistema</p>
          </CardContent>
        </Card>
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Colaboradores
            </CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">214</div>
            <p className="text-xs text-blue-600 mt-1 font-medium">92% ativos</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-50 border-rose-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-rose-800">Perfis Incompletos</CardTitle>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-700">12</div>
            <p className="text-xs text-rose-600 mt-1 font-medium">Faltam dados essenciais</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Distribuição de Contatos por Setor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sectorConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SECTOR_DATA}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {SECTOR_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Ações de Data Quality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 hover:border-blue-300 transition-colors rounded-lg shadow-sm">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  Atualizar Documentos de Colaboradores
                </p>
                <p className="text-xs text-slate-600 mt-0.5 mb-2">
                  Existem 5 colaboradores com CNH vencida e 2 aguardando envio de exames periódicos.
                </p>
                <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                  Ver lista de pendências &rarr;
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 hover:border-blue-300 transition-colors rounded-lg shadow-sm">
              <UserSquare2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  Falta de Contato Principal (Clientes)
                </p>
                <p className="text-xs text-slate-600 mt-0.5 mb-2">
                  Há 4 clientes na base sem e-mail ou telefone de faturamento configurado.
                </p>
                <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                  Enviar link de autopreenchimento &rarr;
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
