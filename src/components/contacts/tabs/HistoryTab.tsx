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
  FileSearch,
} from 'lucide-react'

export default function HistoryTab() {
  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
      <Tabs defaultValue="trabalho" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6 h-12 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger
            value="trabalho"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
          >
            <Briefcase className="w-4 h-4 mr-2 hidden sm:block" /> Trabalho
          </TabsTrigger>
          <TabsTrigger
            value="financeiro"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
          >
            <DollarSign className="w-4 h-4 mr-2 hidden sm:block" /> Financeiro
          </TabsTrigger>
          <TabsTrigger
            value="auditoria"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
          >
            <FileSearch className="w-4 h-4 mr-2 hidden sm:block" /> Auditoria
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

        <TabsContent value="auditoria" className="space-y-4">
          <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden overflow-x-auto">
            <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-700 text-sm flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-slate-400" /> Registro de Alterações de Ficha
            </div>
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-5 whitespace-nowrap">Data/Hora</th>
                  <th className="py-3 px-5 whitespace-nowrap">Usuário Responsável</th>
                  <th className="py-3 px-5 whitespace-nowrap">Ação</th>
                  <th className="py-3 px-5">Detalhes da Modificação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-5 font-mono text-xs">15/03/2026 14:32</td>
                  <td className="py-3 px-5">João (Gerente RH)</td>
                  <td className="py-3 px-5">
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-semibold">
                      Atualização
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    Alterou <b>Salário Base</b> de R$ 3.000,00 para <b>R$ 3.500,00</b>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-5 font-mono text-xs">10/02/2026 09:15</td>
                  <td className="py-3 px-5">Sistema (Auto)</td>
                  <td className="py-3 px-5">
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs font-semibold">
                      Cadastro
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    Criação inicial da ficha via <b>Admissão Digital</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
