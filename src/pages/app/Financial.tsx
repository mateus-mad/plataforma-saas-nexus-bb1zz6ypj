import { useState, useEffect } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowDownRight, ArrowUpRight, Plus, Wallet, Lock } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import useSecurityStore from '@/stores/useSecurityStore'
import { db } from '@/lib/database'

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
  income: { label: 'Receitas', color: 'hsl(var(--chart-2))' },
  expense: { label: 'Despesas', color: 'hsl(var(--chart-3))' },
}

export default function Financial() {
  const [txDB, setTxDB] = useState<any[]>([])
  const [displayTx, setDisplayTx] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { isSetup, isAdminMode, encrypt, decrypt } = useSecurityStore()

  useEffect(() => {
    const loadDB = async () => {
      let data = (await db.get('financial_v2')) as any[]
      if (!data) {
        if (isSetup) {
          data = await Promise.all(
            MOCK_TRANSACTIONS.map(async (tx) => ({
              ...tx,
              description: await encrypt(tx.description),
            })),
          )
        } else {
          data = MOCK_TRANSACTIONS
        }
        await db.set('financial_v2', data)
      }
      setTxDB(data)
    }
    loadDB()
  }, [isSetup, encrypt])

  useEffect(() => {
    const computeDisplay = async () => {
      if (!isSetup) {
        setDisplayTx(txDB)
      } else if (isAdminMode) {
        setDisplayTx(
          txDB.map((tx) => ({
            ...tx,
            description: tx.description?.substring(0, 15) + '...',
          })),
        )
      } else {
        const dec = await Promise.all(
          txDB.map(async (tx) => ({
            ...tx,
            description: await decrypt(tx.description),
          })),
        )
        setDisplayTx(dec)
      }
    }
    if (txDB.length > 0) computeDisplay()
  }, [txDB, isSetup, isAdminMode, decrypt])

  const handleAddTx = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    let description = formData.get('description') as string
    const amount = parseFloat(formData.get('amount') as string)
    const type = formData.get('type') as string

    if (isSetup) {
      description = await encrypt(description)
    }

    const newTx = {
      id: Math.random().toString(),
      date: 'Hoje',
      description,
      category: 'Diversos',
      amount,
      type,
    }

    const newDB = [newTx, ...txDB]
    setTxDB(newDB)
    await db.set('financial_v2', newDB)
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Financeiro
            {isSetup && (
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-600 border-emerald-200 ml-2"
              >
                <Lock className="w-3 h-3 mr-1" /> E2E
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">Acompanhe receitas, despesas e saldo atual.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddTx}>
              <DialogHeader>
                <DialogTitle>Registrar Transação</DialogTitle>
                <DialogDescription>
                  {isSetup
                    ? 'A descrição será criptografada e salva com segurança.'
                    : 'Insira os dados da transação.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input name="description" required placeholder="Ex: Venda de Licença" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input name="amount" type="number" step="0.01" required placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select name="type" defaultValue="income">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Receita</SelectItem>
                        <SelectItem value="expense">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                {displayTx.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                    <TableCell>
                      <div
                        className={`font-medium ${isAdminMode ? 'font-mono text-xs text-slate-500' : ''}`}
                      >
                        {tx.description}
                      </div>
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
