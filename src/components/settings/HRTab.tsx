import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Users, Zap, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HRTab() {
  return (
    <div className="space-y-6 mt-6 animate-fade-in pb-10">
      <div>
        <h3 className="text-xl font-semibold text-slate-800">Jornadas e Regras de Ponto</h3>
        <p className="text-sm text-slate-500">
          Configure e gerencie todas as jornadas de trabalho, horários e regras de ponto da empresa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2 text-amber-600 font-medium text-sm">
              <Clock className="w-4 h-4" /> Jornadas Diaristas
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Ativa
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-end mb-4">
              <div className="text-4xl font-bold text-slate-800">0</div>
              <div className="text-sm text-slate-500 mb-1">colaboradores</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-700">Jornada Diarista Padrão</span>
                <span className="text-slate-500">0 pessoas</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Horas/dia:</span>
                <span className="font-medium text-slate-700">8h</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Extra:</span>
                <span className="font-medium text-slate-700">1x</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
              <Users className="w-4 h-4" /> Jornadas Mensalistas
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Ativa
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-end mb-4">
              <div className="text-4xl font-bold text-slate-800">1</div>
              <div className="text-sm text-slate-500 mb-1">colaboradores</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-700">Jornada Mensalista Padrão</span>
                <span className="text-slate-500">1 pessoas</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Horas/dia:</span>
                <span className="font-medium text-slate-700">8h</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Extra:</span>
                <span className="font-medium text-slate-700">1x</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Resumo das Jornadas de Trabalho
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-xs text-slate-500">Jornadas Ativas</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-slate-700">2</div>
              <div className="text-xs text-slate-500">Total de Jornadas</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-emerald-600">1</div>
              <div className="text-xs text-slate-500">Total Colaboradores</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-amber-600">8h</div>
              <div className="text-xs text-slate-500">Média Horas/Dia</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-blue-200 bg-blue-50/30">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5" /> Gerenciar Jornadas de Trabalho
            </h4>
            <p className="text-sm text-blue-800/80">
              Configure e gerencie todas as jornadas de trabalho, horários, tolerâncias,
              multiplicadores de hora extra e regras CLT/Flexíveis.
            </p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 shrink-0">
            <Link to="/app/configuracoes/rh/jornada">
              <Clock className="w-4 h-4 mr-2" /> Gerenciar Jornadas
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mt-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-800 text-sm">Atenção: Jornadas Flexíveis</h4>
          <p className="text-sm text-amber-700/90 leading-relaxed mt-1">
            Ao configurar Jornadas Flexíveis, certifique-se de respeitar o limite legal de horas
            semanais (44h) e os intervalos interjornadas (mínimo de 11h) para evitar passivos
            trabalhistas.
          </p>
        </div>
      </div>
    </div>
  )
}
