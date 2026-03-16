import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Brain, Activity, TrendingUp, Users, AlertTriangle, Briefcase } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AIEngineModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      setLoading(true)
      const timer = setTimeout(() => setLoading(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] border-none shadow-2xl p-0 overflow-hidden bg-slate-50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-2xl font-bold text-white">
              <Brain className="w-7 h-7" /> IA Engenharia de RH
            </DialogTitle>
            <DialogDescription className="text-blue-100 mt-2 text-base">
              Análise preditiva e insights automáticos da sua base de colaboradores.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 sm:p-8">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                <Brain className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-sm text-slate-500 font-medium animate-pulse">
                Processando dados comportamentais e métricas...
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm shadow-emerald-500/5">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2 font-semibold">
                    <Activity className="w-4 h-4" /> Clima Organizacional
                  </div>
                  <div className="text-3xl font-bold text-slate-800">
                    8.4<span className="text-sm text-slate-400 font-medium ml-1">/10</span>
                  </div>
                  <p className="text-xs text-emerald-600 mt-2 font-medium bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
                    +12% vs último mês
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm shadow-blue-500/5">
                  <div className="flex items-center gap-2 text-blue-600 mb-2 font-semibold">
                    <TrendingUp className="w-4 h-4" /> Produtividade Média
                  </div>
                  <div className="text-3xl font-bold text-slate-800">92%</div>
                  <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 w-fit px-2 py-0.5 rounded-full">
                    Acima da meta
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" /> Risco de Turnover Global
                  </h4>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    Risco Baixo
                  </span>
                </div>
                <Progress value={15} className="h-2.5 bg-slate-100 [&>div]:bg-emerald-500" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apenas 15% da base apresenta comportamentos de risco de saída nos próximos 3
                  meses, focado principalmente no setor operacional.
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <h4 className="font-semibold text-amber-800 flex items-center gap-2 text-sm mb-2">
                  <AlertTriangle className="w-4 h-4" /> Insight de Ação
                </h4>
                <p className="text-sm text-amber-700/90 leading-relaxed">
                  Notamos um aumento nas horas extras do time de <b>Engenharia</b>. Considere
                  redistribuir tarefas para evitar burnout da equipe técnica.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
