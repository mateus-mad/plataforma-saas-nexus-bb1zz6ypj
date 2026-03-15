import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowDownRight, ArrowUpRight, Plus, Wallet } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const MOCK_TRANSACTIONS = [
  {
    id: '1',
    date: 'Hoje',
    description: 'Pagamento Fatura #402',
    category: 'Vendas',
    amount: 3500.0,
    type: 'income',
  },
  {
    id: '2',
    date: 'Hoje',
    description: 'Conta de Luz',
    category: 'Infraestrutura',
    amount: 450.0,
    type: 'expense',
  },
  {
    id: '3',
    date: 'Ontem',
    description: 'Serviços Consultoria',
    category: 'Serviços',
    amount: 1200.0,
    type: 'income',
  },
  {
    id: '4',
    date: '12 Mai',
    description: 'Compra de Equipamentos',
    category: 'Ativos',
    amount: 4200.0,
    type: 'expense',
  },
  {
    id: '5',
    date: '10 Mai',
    description: 'Licenças Software',
    category: 'Sistemas',
    amount: 890.0,
    type: 'expense',
  },
]

const MONTHLY_DATA = [
  { month: 'Jan', income: 4000, expense: 2400 },
  { month: 'Fev', income: 3000, expense: 1398 },
  { month: 'Mar', income: 5000, expense: 3800 },
  { month: 'Abr', income: 4780, expense: 3908 },
  { month: 'Mai', income: 5890, expense: 4800 },
]

const chartConfig = {
  income: { label: 'Receitas', color: 'hsl(var(--chart-2))' }, // Emerald
  expense: { label: 'Despesas', color: 'hsl(var(--chart-3))' }, // Rose
}

export default function Financial() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
          <p className="text-muted-foreground">Acompanhe receitas, despesas e saldo atual.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Nova Transação
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo em Conta</CardTitle>
            <Wallet className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ 124.500,00</div>
            <p className="text-xs opacity-80 mt-1">Atualizado agora</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Receber (Este Mês)</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">R$ 32.400,00</div>
            <p className="text-xs text-muted-foreground mt-1">14 faturas pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Pagar (Este Mês)</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">R$ 18.250,00</div>
            <p className="text-xs text-muted-foreground mt-1">8 boletos a vencer</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Desempenho Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis
                    tickFormatter={(val) => `R$${val / 1000}k`}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="income"
                    fill="var(--color-income)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="expense"
                    fill="var(--color-expense)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Últimas Transações</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              Ver Extrato
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_TRANSACTIONS.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                    <TableCell>
                      <div className="font-medium">{tx.description}</div>
                      <div className="text-xs text-muted-foreground">{tx.category}</div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}>
                        {tx.type === 'income' ? '+' : '-'} R${' '}
                        {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
