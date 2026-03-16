import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Check,
  X,
  Briefcase,
  DollarSign,
  Heart,
  Shield,
  CalendarDays,
  Building2,
  History,
  Paperclip,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import PersonalInfoTab from './tabs/PersonalInfoTab'
import HistoryTab from './tabs/HistoryTab'

export default function CollaboratorModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const [activeTab, setActiveTab] = useState('historico')
  const [name, setName] = useState('')
  const [nacionalidade, setNacionalidade] = useState('Brasileira')

  const globalProgress = 45

  const TABS = [
    { id: 'trabalho', label: 'Trabalho', progress: 88, icon: Briefcase, color: 'emerald' },
    { id: 'salario', label: 'Salário', progress: 50, icon: DollarSign, color: 'amber' },
    { id: 'beneficios', label: 'Benefícios', progress: 100, icon: Heart, color: 'emerald' },
    { id: 'encargos', label: 'Encargos', progress: 75, icon: Shield, color: 'amber' },
    { id: 'ferias', label: 'Férias', progress: 50, icon: CalendarDays, color: 'amber' },
    { id: 'esocial', label: 'eSocial', progress: 33, icon: Building2, color: 'blue' },
    { id: 'historico', label: 'Histórico', progress: null, icon: History, color: 'blue' },
    { id: 'anexos', label: 'Anexos', progress: null, icon: Paperclip, color: 'slate' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0 bg-slate-50 border-none rounded-xl shadow-2xl overflow-hidden [&>button]:hidden sm:rounded-xl">
        <div className="p-6 pb-0 bg-white border-b border-slate-200 shrink-0 relative z-10">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pr-12">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-800 tracking-tight">
                Editar Colaborador
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1.5 font-medium">
                Preencha os dados do colaborador. Campos com{' '}
                <span className="text-rose-500">*</span> são obrigatórios.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                Preenchimento:
              </span>
              <Progress
                value={globalProgress}
                className="w-32 h-2.5 bg-slate-200 [&>div]:bg-blue-500 shadow-inner"
              />
              <span className="text-sm font-bold text-slate-700 w-8">{globalProgress}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mt-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border select-none',
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20 transform scale-[1.02]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300',
                )}
              >
                <tab.icon
                  className={cn(
                    'w-4 h-4',
                    activeTab === tab.id ? 'text-white/80' : 'text-slate-400',
                  )}
                />
                {tab.label}
                {tab.progress !== null && tab.progress < 100 && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ml-1',
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : tab.color === 'emerald'
                          ? 'bg-emerald-100 text-emerald-700'
                          : tab.color === 'amber'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700',
                    )}
                  >
                    {tab.progress}%
                  </span>
                )}
                {tab.progress === 100 && (
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center ml-1',
                      activeTab === tab.id ? 'bg-white/20' : 'bg-emerald-100',
                    )}
                  >
                    <Check
                      className={cn(
                        'w-3 h-3',
                        activeTab === tab.id ? 'text-white' : 'text-emerald-600',
                      )}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="bg-white rounded-xl border border-slate-200/60 p-5 sm:p-8 shadow-sm min-h-full">
            {activeTab === 'pessoal' && (
              <PersonalInfoTab
                name={name}
                setName={setName}
                nacionalidade={nacionalidade}
                setNacionalidade={setNacionalidade}
              />
            )}
            {activeTab === 'historico' && <HistoryTab />}
            {activeTab !== 'pessoal' && activeTab !== 'historico' && (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-slate-300">
                    {TABS.find((t) => t.id === activeTab)?.progress || '--'}%
                  </span>
                </div>
                <p className="font-medium text-slate-500">
                  Conteúdo da aba {TABS.find((t) => t.id === activeTab)?.label}
                </p>
                <p className="text-sm mt-2 max-w-sm text-center">
                  Em desenvolvimento para as próximas etapas do projeto.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 z-10">
          <p className="text-xs text-rose-500 font-medium bg-rose-50 px-2 py-1 rounded w-full sm:w-auto text-center sm:text-left">
            * Campos obrigatórios
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-slate-600 border-slate-200 hover:bg-slate-50 flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm shadow-blue-500/20 flex-1 sm:flex-none px-8">
              Atualizar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
