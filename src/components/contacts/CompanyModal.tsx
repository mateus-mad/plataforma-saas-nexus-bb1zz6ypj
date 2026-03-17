import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  X,
  Users,
  Phone,
  MapPin,
  AlertTriangle,
  CreditCard,
  UsersRound,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { CompanyDadosTab, CompanyContatoTab } from './tabs/CompanyTabs'
import { CompanyFinanceiroTab } from './tabs/CompanyFinancialTabs'
import { CompanyRelacionamentoTab } from './tabs/CompanyRelationshipTabs'
import { AddressTab } from './tabs/FormTabs1'
import AttachmentsTab from './tabs/AttachmentsTab'
import { useCompanyForm } from '@/hooks/useCompanyForm'

export default function CompanyModal({
  open,
  onOpenChange,
  type,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  type: 'client' | 'supplier'
}) {
  const [activeTab, setActiveTab] = useState('dados')
  const { data, updateData, progress, globalProgress, errors, validate, autofillCNPJ } =
    useCompanyForm(type)
  const { toast } = useToast()

  const TABS = [
    { id: 'dados', label: 'Identificação', prog: progress.dados, icon: Users },
    { id: 'endereco', label: 'Endereço', prog: progress.endereco, icon: MapPin },
    { id: 'contato', label: 'Contato', prog: progress.contato, icon: Phone },
    { id: 'financeiro', label: 'Financeiro', prog: progress.financeiro, icon: CreditCard },
    {
      id: 'relacionamento',
      label: 'Relacionamento',
      prog: progress.relacionamento,
      icon: UsersRound,
    },
    { id: 'anexos', label: 'Documentos', prog: null, icon: FileText },
  ]

  const handleSave = () => {
    if (!validate()) {
      toast({
        variant: 'destructive',
        title: 'Erros Encontrados',
        description: 'Verifique os campos obrigatórios marcados em vermelho.',
      })
      return
    }
    toast({ title: 'Sucesso', description: 'Registro atualizado com sucesso.' })
    onOpenChange(false)
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] w-[95vw] h-[90vh] flex flex-col p-0 gap-0 bg-slate-50 border-none rounded-2xl shadow-2xl overflow-hidden [&>button]:hidden">
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
                <Users className="w-5 h-5 text-slate-700" />
                {`Editar Cadastro de ${type === 'client' ? 'Cliente' : 'Fornecedor'}`}
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1">
                Preencha os dados abaixo. Campos com * são obrigatórios.
              </DialogDescription>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full border border-emerald-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  </div>
                  Integridade Cadastral:
                </span>
                <Progress
                  value={globalProgress}
                  className="w-24 h-2 bg-slate-200 [&>div]:bg-blue-600"
                />
                <span className="text-sm font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-100">
                  {globalProgress}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pb-4 mt-6">
            {TABS.map((tab) => {
              const tabHasError = Object.keys(errors).some((k) => k.startsWith(tab.id))
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex flex-col min-w-[120px] px-3 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 relative overflow-hidden',
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md border-transparent'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800',
                    tabHasError &&
                      activeTab !== tab.id &&
                      'border-rose-200 text-rose-600 bg-rose-50',
                  )}
                >
                  <div className="flex items-center gap-2 relative z-10 w-full justify-between">
                    <div className="flex items-center gap-2">
                      <tab.icon
                        className={cn(
                          'w-4 h-4',
                          activeTab === tab.id ? 'text-blue-100' : 'text-slate-400',
                          tabHasError && activeTab !== tab.id && 'text-rose-500',
                        )}
                      />
                      <span>{tab.label}</span>
                    </div>
                    {tab.prog !== null && activeTab !== tab.id && (
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded font-bold ml-2',
                          tabHasError ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600',
                        )}
                      >
                        {tab.prog}%
                      </span>
                    )}
                    {tab.prog !== null && activeTab === tab.id && (
                      <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-bold ml-2">
                        {tab.prog}%
                      </span>
                    )}
                  </div>
                  {tab.prog !== null && activeTab !== tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
                      <div
                        className={cn(
                          'h-full',
                          tab.prog === 100 ? 'bg-emerald-500' : 'bg-blue-400',
                        )}
                        style={{ width: `${tab.prog}%` }}
                      />
                    </div>
                  )}
                  {tab.prog !== null && activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                      <div className="h-full bg-white" style={{ width: `${tab.prog}%` }} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="bg-transparent min-h-full">
            {activeTab === 'dados' && (
              <CompanyDadosTab
                data={data.dados}
                onChange={(f: string, v: any) => updateData('dados', f, v)}
                onAutofill={autofillCNPJ}
                errors={errors}
                readOnly={false}
              />
            )}
            {activeTab === 'endereco' && (
              <AddressTab
                data={data.endereco}
                onChange={(f: string, v: any) => updateData('endereco', f, v)}
                errors={errors}
                readOnly={false}
              />
            )}
            {activeTab === 'contato' && (
              <CompanyContatoTab
                data={data.contato}
                onChange={(f: string, v: any) => updateData('contato', f, v)}
                errors={errors}
                readOnly={false}
              />
            )}
            {activeTab === 'financeiro' && (
              <CompanyFinanceiroTab
                data={data.financeiro}
                type={type}
                onChange={(f: string, v: any) => updateData('financeiro', f, v)}
                errors={errors}
                readOnly={false}
              />
            )}
            {activeTab === 'relacionamento' && (
              <CompanyRelacionamentoTab
                data={data.relacionamento}
                onChange={(f: string, v: any) => updateData('relacionamento', f, v)}
                readOnly={false}
              />
            )}
            {activeTab === 'anexos' && <AttachmentsTab readOnly={false} />}
          </div>
        </div>

        <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex justify-between items-center shrink-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 hidden sm:flex">
            {hasErrors && (
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5" /> Atenção: Há campos obrigatórios pendentes
                ou inválidos.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-semibold text-slate-600 bg-white border-slate-200 hover:bg-slate-50 px-6 h-10 rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-8 h-10 font-bold rounded-xl"
            >
              Salvar Cadastro
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
