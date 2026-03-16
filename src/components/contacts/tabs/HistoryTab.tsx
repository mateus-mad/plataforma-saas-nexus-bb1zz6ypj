import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Clock,
  AlertCircle,
  AlertTriangle,
  Timer,
  Calendar,
  Activity,
  DollarSign,
  Shield,
  Heart,
  Briefcase,
} from 'lucide-react'

export default function HistoryTab() {
  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
      <Tabs defaultValue="trabalho" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6 h-12 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger
            value="trabalho"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
          >
            <Briefcase className="w-4 h-4 mr-2" /> Histórico de Trabalho
          </TabsTrigger>
          <TabsTrigger
            value="financeiro"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
          >
            <DollarSign className="w-4 h-4 mr-2" /> Histórico Financeiro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trabalho" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border-l-[3px] border-l-blue-500 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center text-slate-500 text-xs mb-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Total Horas
              </div>
              <div className="text-xl font-bold text-slate-800">0h 0m</div>
            </div>
            <div className="border-l-[3px] border-l-rose-500 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center text-slate-500 text-xs mb-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-rose-500" /> Faltas
              </div>
              <div className="text-xl font-bold text-slate-800">0</div>
            </div>
            <div className="border-l-[3px] border-l-amber-500 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center text-slate-500 text-xs mb-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Advertências
              </div>
              <div className="text-xl font-bold text-slate-800">0</div>
            </div>
            <div className="border-l-[3px] border-l-orange-500 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center text-slate-500 text-xs mb-1.5 font-medium">
                <Timer className="w-3.5 h-3.5 mr-1.5 text-orange-500" /> Atrasos
              </div>
              <div className="text-xl font-bold text-slate-800">0</div>
            </div>
          </div>

          {[
            {
              title: 'Faltas e Atestados (0)',
              icon: Calendar,
              color: 'text-rose-500',
              empty: 'Nenhuma falta registrada',
            },
            {
              title: 'Advertências (0)',
              icon: AlertTriangle,
              color: 'text-amber-500',
              empty: 'Nenhuma advertência registrada',
            },
            {
              title: 'Acidentes de Trabalho (0)',
              icon: Activity,
              color: 'text-rose-500',
              empty: 'Nenhum acidente registrado',
            },
          ].map((section, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm"
            >
              <div className="px-5 py-3.5 border-b border-slate-100 font-semibold text-slate-700 text-sm flex items-center gap-2">
                <section.icon className={`w-4 h-4 ${section.color}`} /> {section.title}
              </div>
              <div className="p-8 text-center text-sm text-slate-500 bg-slate-50/30">
                {section.empty}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3 font-semibold text-slate-700 text-sm">
              <DollarSign className="w-4 h-4 text-blue-500" /> Remuneração Base
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                <div className="text-xs text-slate-500 mb-1 font-medium">Salário Base</div>
                <div className="text-lg font-bold text-blue-600">R$ 3.500,00</div>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                <div className="text-xs text-slate-500 mb-1 font-medium">Tipo</div>
                <div className="text-lg font-bold text-slate-800">Mensal</div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 font-semibold text-slate-700 text-sm">
              <Shield className="w-4 h-4 text-amber-500" /> Encargos Trabalhistas
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border border-amber-100/60 rounded-xl p-4 bg-amber-50/30 shadow-sm">
                <div className="text-xs text-slate-500 mb-1 font-medium">INSS</div>
                <div className="text-base font-bold text-amber-600">R$ 318,82</div>
              </div>
              <div className="border border-amber-100/60 rounded-xl p-4 bg-amber-50/30 shadow-sm">
                <div className="text-xs text-slate-500 mb-1 font-medium">IRRF</div>
                <div className="text-base font-bold text-amber-600">R$ 95,74</div>
              </div>
              <div className="border border-emerald-100/60 rounded-xl p-4 bg-emerald-50/30 shadow-sm">
                <div className="text-xs text-slate-500 mb-1 font-medium">FGTS (Depósito)</div>
                <div className="text-base font-bold text-emerald-600">R$ 280,00</div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 font-semibold text-slate-700 text-sm">
              <Heart className="w-4 h-4 text-emerald-500" /> Benefícios
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {['Vale Alimentação', 'Vale Transporte', 'Vale Refeição', 'Plano Saúde'].map(
                (ben, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm"
                  >
                    <div className="text-xs text-slate-500 mb-1 font-medium">{ben}</div>
                    <div className="text-sm font-bold text-slate-400">Não recebe</div>
                  </div>
                ),
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
