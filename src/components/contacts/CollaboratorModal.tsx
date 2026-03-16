import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
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
  const { data, updateData, progress, globalProgress } = useCollaboratorForm()

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] h-[90vh] flex flex-col p-0 gap-0 bg-slate-50 border-none rounded-xl shadow-2xl overflow-hidden [&>button]:hidden">
        <div className="p-5 pb-0 bg-white border-b border-slate-200 shrink-0 relative z-10">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex flex-col sm:flex-row justify-between gap-4 pr-12">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-800">
                Editar Colaborador
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1">
                Preencha os dados do colaborador.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Preenchimento:</span>
              <Progress
                value={globalProgress}
                className="w-24 h-2 bg-slate-200 [&>div]:bg-blue-500 shadow-inner"
              />
              <span className="text-sm font-bold text-slate-700">{globalProgress}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mt-5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full custom-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex flex-col min-w-[110px] px-3 py-2 rounded-lg text-xs font-medium transition-all border shrink-0',
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
                )}
              >
                <div className="flex items-center gap-1.5 w-full mb-1.5">
                  <tab.icon
                    className={cn(
                      'w-3.5 h-3.5',
                      activeTab === tab.id ? 'text-white/80' : 'text-slate-400',
                    )}
                  />
                  <span>{tab.label}</span>
                </div>
                {tab.prog !== null && (
                  <div className="w-full">
                    <Progress
                      value={tab.prog}
                      className={cn(
                        'h-1',
                        activeTab === tab.id
                          ? 'bg-white/30 [&>div]:bg-white'
                          : 'bg-slate-100 [&>div]:bg-blue-500',
                      )}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="bg-white rounded-xl border border-slate-200/60 p-5 sm:p-6 shadow-sm min-h-full">
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

        <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0 z-10">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm shadow-blue-500/20 px-8"
          >
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
