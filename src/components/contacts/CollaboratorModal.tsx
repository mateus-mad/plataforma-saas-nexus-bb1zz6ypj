import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  X,
  Briefcase,
  DollarSign,
  Heart,
  Shield,
  CalendarDays,
  Building2,
  History,
  Paperclip,
  User,
  FileText,
  MapPin,
  Phone,
  UserMinus,
  UserCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCollaboratorForm } from '@/hooks/useCollaboratorForm'
import PersonalInfoTab from './tabs/PersonalInfoTab'
import HistoryTab from './tabs/HistoryTab'
import ESocialTab from './tabs/ESocialTab'
import AttachmentsTab from './tabs/AttachmentsTab'
import { DocsTab, AddressTab } from './tabs/FormTabs1'
import { ContactTab, WorkTab } from './tabs/FormTabs2'
import { BenefitsTab, SalaryTab } from './tabs/FormTabs3'
import { ChargesTab, VacationTab } from './tabs/FormTabs4'

export default function CollaboratorModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const [activeTab, setActiveTab] = useState('pessoal')
  const [isActiveEmpl, setIsActiveEmpl] = useState(true)
  const { data, updateData, progress, globalProgress } = useCollaboratorForm()
  const { toast } = useToast()

  const TABS = [
    { id: 'pessoal', label: 'Pessoal', prog: progress.pessoal, icon: User },
    { id: 'docs', label: 'Docs', prog: progress.docs, icon: FileText },
    { id: 'endereco', label: 'Endereço', prog: progress.endereco, icon: MapPin },
    { id: 'contato', label: 'Contato', prog: progress.contato, icon: Phone },
    { id: 'trabalho', label: 'Trabalho', prog: progress.trabalho, icon: Briefcase },
    { id: 'salario', label: 'Salário', prog: progress.salario, icon: DollarSign },
    { id: 'beneficios', label: 'Benefícios', prog: progress.beneficios, icon: Heart },
    { id: 'encargos', label: 'Encargos', prog: progress.encargos, icon: Shield },
    { id: 'ferias', label: 'Férias', prog: progress.ferias, icon: CalendarDays },
    { id: 'esocial', label: 'eSocial', prog: null, icon: Building2 },
    { id: 'historico', label: 'Histórico', prog: null, icon: History },
    { id: 'anexos', label: 'Anexos', prog: null, icon: Paperclip },
  ]

  const handleToggleStatus = () => {
    setIsActiveEmpl(!isActiveEmpl)
    toast({
      title: isActiveEmpl ? 'Processo de Demissão' : 'Readmissão Concluída',
      description: isActiveEmpl
        ? 'O processo de demissão foi iniciado com sucesso.'
        : 'Colaborador reintegrado ao quadro de ativos.',
    })
  }

  const handleSave = () => {
    toast({ title: 'Atualizado', description: 'Dados do colaborador foram atualizados.' })
    onOpenChange(false)
  }

  const getProgressColor = (prog: number | null) => {
    if (prog === null) return 'bg-slate-200'
    if (prog === 100) return 'bg-emerald-500'
    if (prog > 50) return 'bg-amber-400'
    return 'bg-blue-500'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1100px] h-[95vh] flex flex-col p-0 gap-0 bg-slate-50 border-none rounded-2xl shadow-2xl overflow-hidden [&>button]:hidden">
        <div className="p-5 pb-0 bg-white border-b border-slate-200 shrink-0 relative z-10">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pr-12">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-slate-500" /> Editar Colaborador
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1">
                Preencha os dados do colaborador. Campos com * são obrigatórios.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant={isActiveEmpl ? 'outline' : 'default'}
                size="sm"
                onClick={handleToggleStatus}
                className={cn(
                  'h-9 hidden sm:flex transition-all',
                  isActiveEmpl
                    ? 'border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white',
                )}
              >
                {isActiveEmpl ? (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" /> Demitir
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" /> Readmitir
                  </>
                )}
              </Button>
              <div className="flex items-center gap-3 px-4 py-1.5 rounded-full">
                <span className="text-xs text-slate-500 font-medium">Preenchimento:</span>
                <Progress
                  value={globalProgress}
                  className="w-24 h-1.5 bg-slate-100 [&>div]:bg-blue-600"
                />
                <span className="text-sm font-bold text-slate-700">{globalProgress}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-4 mt-6 custom-scrollbar px-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center justify-between min-w-[120px] px-3 py-2 rounded-xl text-sm font-semibold transition-all relative overflow-hidden shrink-0 border border-transparent',
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20 ring-4 ring-blue-50'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200',
                )}
              >
                <div className="flex items-center gap-2 z-10 relative">
                  <tab.icon
                    className={cn(
                      'w-4 h-4',
                      activeTab === tab.id ? 'text-white' : 'text-slate-400',
                    )}
                  />
                  <span>{tab.label}</span>
                </div>
                {tab.prog !== null && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-md ml-2 z-10 relative',
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    {tab.prog}%
                  </span>
                )}
                {tab.prog !== null && (
                  <div
                    className={cn(
                      'absolute bottom-0 left-0 h-[3px] transition-all duration-500',
                      activeTab === tab.id ? 'bg-white/40' : getProgressColor(tab.prog),
                    )}
                    style={{ width: `${tab.prog}%` }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50">
          <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm min-h-full">
            {activeTab === 'pessoal' && (
              <PersonalInfoTab
                data={data.pessoal}
                onChange={(f, v) => updateData('pessoal', f, v)}
              />
            )}
            {activeTab === 'docs' && (
              <DocsTab data={data.docs} onChange={(f, v) => updateData('docs', f, v)} />
            )}
            {activeTab === 'endereco' && (
              <AddressTab data={data.endereco} onChange={(f, v) => updateData('endereco', f, v)} />
            )}
            {activeTab === 'contato' && (
              <ContactTab data={data.contato} onChange={(f, v) => updateData('contato', f, v)} />
            )}
            {activeTab === 'trabalho' && (
              <WorkTab data={data.trabalho} onChange={(f, v) => updateData('trabalho', f, v)} />
            )}
            {activeTab === 'salario' && (
              <SalaryTab data={data.salario} onChange={(f, v) => updateData('salario', f, v)} />
            )}
            {activeTab === 'beneficios' && (
              <BenefitsTab
                data={data.beneficios}
                onChange={(f, v) => updateData('beneficios', f, v)}
              />
            )}
            {activeTab === 'encargos' && (
              <ChargesTab data={data.encargos} onChange={(f, v) => updateData('encargos', f, v)} />
            )}
            {activeTab === 'ferias' && (
              <VacationTab data={data.ferias} onChange={(f, v) => updateData('ferias', f, v)} />
            )}
            {activeTab === 'esocial' && <ESocialTab />}
            {activeTab === 'historico' && <HistoryTab />}
            {activeTab === 'anexos' && <AttachmentsTab />}
          </div>
        </div>

        <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex justify-between items-center shrink-0 z-10">
          <p className="text-xs text-slate-500">
            <span className="text-rose-500 font-bold">*</span> Campos obrigatórios
          </p>
          <div className="flex justify-end gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-semibold text-slate-600"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-8 font-semibold"
            >
              Atualizar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
