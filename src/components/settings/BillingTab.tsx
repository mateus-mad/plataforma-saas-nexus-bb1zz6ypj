import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calculator, CreditCard, Download, AlertCircle } from 'lucide-react'
import useTenantStore, { PLAN_DETAILS } from '@/stores/useTenantStore'
import useModuleStore from '@/stores/useModuleStore'

export default function BillingTab() {
  const { currentTenant } = useTenantStore()
  const { contractedModules } = useModuleStore()

  if (!currentTenant) return null

  const planInfo = PLAN_DETAILS[currentTenant.plan]
  const planDailyCost = planInfo.price / 30
  const planAccCost = planDailyCost * currentTenant.activeDaysThisMonth

  const modulesMonthlyCost = contractedModules.length * 49
  const modulesDailyCost = modulesMonthlyCost / 30
  const modulesAccCost = modulesDailyCost * currentTenant.activeDaysThisMonth

  const totalDaily = planDailyCost + modulesDailyCost
  const totalAcc = planAccCost + modulesAccCost

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="space-y-6 mt-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <CardHeader>
            <CardTitle className="text-lg">Faturamento Prorated (Diário)</CardTitle>
            <CardDescription>
              A cobrança é feita de forma justa, calculando o custo diário de uso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h4 className="font-semibold text-slate-800">
                  Plano {currentTenant.plan} + Módulos
                </h4>
                <p className="text-sm text-slate-500">
                  Dias ativos no ciclo atual:{' '}
                  <span className="font-bold">{currentTenant.activeDaysThisMonth} dias</span>
                </p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3 py-1">
                Ativo
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-slate-500">Custo Diário Total Estimado</span>
              <span className="font-medium text-slate-800">{formatCurrency(totalDaily)}/dia</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-slate-500">Custo Acumulado (Até o momento)</span>
              <span className="font-bold text-primary text-xl">{formatCurrency(totalAcc)}</span>
            </div>
            <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-xs flex gap-2 mt-4 border border-blue-100">
              <Calculator className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
              <p>
                <strong>Entenda o cálculo:</strong> (Mensalidade do Plano ÷ 30 dias) + (Mensalidade
                dos Módulos ÷ 30 dias) × Dias Ativos. Alterações mid-month ajustam a taxa diária
                automaticamente.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-50 bg-slate-50/50 pt-4">
            <Button variant="outline" className="w-full">
              Alterar Plano Base
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Detalhes do Ciclo Atual</CardTitle>
            <CardDescription>Composição do faturamento para a próxima fatura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Mensal</TableHead>
                  <TableHead className="text-right">Acumulado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Plano {currentTenant.plan}</TableCell>
                  <TableCell className="text-right text-slate-500">
                    {formatCurrency(planInfo.price)}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(planAccCost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-slate-600">
                    Módulos Adicionais ({contractedModules.length})
                  </TableCell>
                  <TableCell className="text-right text-slate-500">
                    {formatCurrency(modulesMonthlyCost)}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(modulesAccCost)}</TableCell>
                </TableRow>
                <TableRow className="bg-slate-50">
                  <TableCell className="font-bold">Total Parcial</TableCell>
                  <TableCell className="text-right font-bold text-slate-500">
                    {formatCurrency(planInfo.price + modulesMonthlyCost)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {formatCurrency(totalAcc)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="flex items-center gap-4 p-3 mt-4 rounded-lg border border-slate-200 bg-slate-50/80">
              <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-white shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">Mastercard final 4242</p>
                <p className="text-xs text-slate-500">Próxima cobrança: 01/Próx Mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
