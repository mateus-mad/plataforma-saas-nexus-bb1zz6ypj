import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
import { Skeleton } from '@/components/ui/skeleton'
import {
  Target,
  Pencil,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Clock,
  CircleDollarSign,
  Users,
  ShieldAlert,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardGoal, upsertDashboardGoal } from '@/services/dashboard_goals'
import { useToast } from '@/hooks/use-toast'

export interface DashboardAlertItem {
  id: string
  title: string
  description: string
  severity: 'destructive' | 'warning' | 'info'
  link: string
  linkLabel: string
  count?: number
  category: 'financeiro' | 'compliance' | 'ponto'
}

interface GoalsAndAlertsWidgetProps {
  currentGoal: DashboardGoal | null
  currentMonthLabel: string
  currentYearMonth: string
  currentMonthRevenue: number
  alerts: DashboardAlertItem[]
  loading?: boolean
  onGoalUpdated?: () => void
}

export function GoalsAndAlertsWidget({
  currentGoal,
  currentMonthLabel,
  currentYearMonth,
  currentMonthRevenue,
  alerts,
  loading = false,
  onGoalUpdated,
}: GoalsAndAlertsWidgetProps) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [targetRevenueInput, setTargetRevenueInput] = useState<string>('')
  const [targetHoursInput, setTargetHoursInput] = useState<string>('')
  const [notesInput, setNotesInput] = useState<string>('')
  const [savingGoal, setSavingGoal] = useState(false)

  const handleOpenDialog = () => {
    if (currentGoal) {
      setTargetRevenueInput(String(currentGoal.target_revenue || ''))
      setTargetHoursInput(currentGoal.target_hours ? String(currentGoal.target_hours) : '')
      setNotesInput(currentGoal.notes || '')
    } else {
      setTargetRevenueInput('30000')
      setTargetHoursInput('160')
      setNotesInput('')
    }
    setIsDialogOpen(true)
  }

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    const rev = parseFloat(targetRevenueInput)
    if (isNaN(rev) || rev <= 0) {
      toast({
        title: 'Valor inválido',
        description: 'Por favor, insira um valor válido maior que zero.',
        variant: 'destructive',
      })
      return
    }

    setSavingGoal(true)
    try {
      const hours = targetHoursInput ? parseFloat(targetHoursInput) : undefined
      await upsertDashboardGoal(currentYearMonth, rev, hours, notesInput)
      toast({
        title: 'Meta atualizada com sucesso!',
        description: `Nova meta de receita para ${currentMonthLabel} definida.`,
      })
      setIsDialogOpen(false)
      if (onGoalUpdated) onGoalUpdated()
    } catch (err) {
      console.error(err)
      toast({
        title: 'Erro ao salvar meta',
        description: 'Não foi possível salvar a meta no banco de dados.',
        variant: 'destructive',
      })
    } finally {
      setSavingGoal(false)
    }
  }

  const targetRevenue = currentGoal?.target_revenue || 0
  const progressPercent =
    targetRevenue > 0 ? Math.min(Math.round((currentMonthRevenue / targetRevenue) * 100), 100) : 0

  return (
    <div className="grid gap-6 lg:grid-cols-7 animate-fade-in">
      {/* Bloco 1: Metas Mensais */}
      <Card className="lg:col-span-3 border-slate-200/80 shadow-sm flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Metas do Mês ({currentMonthLabel})
            </CardTitle>
            <CardDescription>
              Acompanhamento de receita realizada vs. meta planejada
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={handleOpenDialog}
              >
                <Pencil className="w-3.5 h-3.5" />
                {currentGoal ? 'Editar' : 'Definir'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleSaveGoal}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Definir Meta — {currentMonthLabel}
                  </DialogTitle>
                  <DialogDescription>
                    Configure as metas operacionais e financeiras para o fechamento deste mês.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-revenue">Meta de Receita (R$)</Label>
                    <Input
                      id="goal-revenue"
                      type="number"
                      step="0.01"
                      min="1"
                      required
                      placeholder="Ex: 35000.00"
                      value={targetRevenueInput}
                      onChange={(e) => setTargetRevenueInput(e.target.value)}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Receita total projetada para o mês ({currentYearMonth}).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal-hours">Meta de Horas Produtivas (Opcional)</Label>
                    <Input
                      id="goal-hours"
                      type="number"
                      step="1"
                      min="0"
                      placeholder="Ex: 160"
                      value={targetHoursInput}
                      onChange={(e) => setTargetHoursInput(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal-notes">Observações / Foco Estratégico</Label>
                    <Input
                      id="goal-notes"
                      placeholder="Ex: Foco em faturamento de contratos pendentes"
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={savingGoal}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={savingGoal}>
                    {savingGoal ? 'Salvando...' : 'Salvar Meta'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="space-y-5 flex-1 flex flex-col justify-center">
          {loading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : !currentGoal || currentGoal.target_revenue <= 0 ? (
            <div className="p-5 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-center space-y-3 my-auto">
              <Target className="w-9 h-9 mx-auto text-primary opacity-80" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Nenhuma meta financeira definida para {currentMonthLabel}
                </p>
                <p className="text-xs text-muted-foreground">
                  Estabeleça uma meta mensal para acompanhar o progresso de receitas em tempo real.
                </p>
              </div>
              <Button size="sm" onClick={handleOpenDialog} className="text-xs">
                Definir Meta Agora
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Progresso de Receitas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                    <CircleDollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    Receita Realizada vs. Meta
                  </span>
                  <span className="font-bold text-foreground">{progressPercent}% atingido</span>
                </div>

                <Progress value={progressPercent} className="h-3 bg-slate-100" />

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <p className="text-[11px] text-muted-foreground">Realizado</p>
                    <p className="font-bold text-emerald-600 text-sm">
                      R${' '}
                      {currentMonthRevenue.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] text-muted-foreground">Meta Mensal</p>
                    <p className="font-bold text-foreground text-sm">
                      R${' '}
                      {targetRevenue.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informação adicional de status da meta */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <TrendingUp
                    className={`w-4 h-4 ${
                      progressPercent >= 100
                        ? 'text-emerald-500'
                        : progressPercent >= 70
                          ? 'text-amber-500'
                          : 'text-blue-500'
                    }`}
                  />
                  <span className="text-slate-700">
                    {progressPercent >= 100 ? (
                      <strong className="text-emerald-700">Meta superada com sucesso! 🎉</strong>
                    ) : (
                      <>
                        Faltam{' '}
                        <strong>
                          R${' '}
                          {Math.max(0, targetRevenue - currentMonthRevenue).toLocaleString(
                            'pt-BR',
                            {
                              minimumFractionDigits: 2,
                            },
                          )}
                        </strong>{' '}
                        para atingir a meta
                      </>
                    )}
                  </span>
                </div>
                {currentGoal.target_hours ? (
                  <Badge variant="outline" className="text-[10px] bg-white">
                    Meta de Horas: {currentGoal.target_hours}h
                  </Badge>
                ) : null}
              </div>

              {currentGoal.notes && (
                <p className="text-[11px] text-muted-foreground italic truncate">
                  Nota: "{currentGoal.notes}"
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bloco 2: Alertas Automáticos */}
      <Card className="lg:col-span-4 border-slate-200/80 shadow-sm flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Alertas & Pendências Operacionais
            </CardTitle>
            <CardDescription>
              Avisos automáticos gerados a partir do financeiro, ponto e equipe
            </CardDescription>
          </div>
          {alerts.length > 0 ? (
            <Badge
              variant={
                alerts.some((a) => a.severity === 'destructive') ? 'destructive' : 'secondary'
              }
              className="text-xs"
            >
              {alerts.length} {alerts.length === 1 ? 'alerta ativo' : 'alertas ativos'}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              Zero pendências
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-2.5 flex-1 flex flex-col justify-center">
          {loading ? (
            <div className="space-y-2 py-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="py-8 text-center space-y-2 my-auto">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
              <p className="text-sm font-semibold text-foreground">Tudo em dia! ✅</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Nenhuma fatura vencida crítica, metas dentro do esperado e colaboradores com
                documentação regular.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    alert.severity === 'destructive'
                      ? 'bg-rose-50/70 border-rose-200 hover:bg-rose-50'
                      : alert.severity === 'warning'
                        ? 'bg-amber-50/70 border-amber-200 hover:bg-amber-50'
                        : 'bg-blue-50/70 border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        alert.severity === 'destructive'
                          ? 'bg-rose-100 text-rose-700'
                          : alert.severity === 'warning'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {alert.category === 'financeiro' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : alert.category === 'compliance' ? (
                        <ShieldAlert className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p
                        className={`text-xs font-bold truncate ${
                          alert.severity === 'destructive'
                            ? 'text-rose-900'
                            : alert.severity === 'warning'
                              ? 'text-amber-900'
                              : 'text-blue-900'
                        }`}
                      >
                        {alert.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="shrink-0 h-7 text-xs bg-white hover:bg-slate-50"
                  >
                    <Link to={alert.link}>
                      {alert.linkLabel} <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
