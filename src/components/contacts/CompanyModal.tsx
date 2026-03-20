import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useCompanyForm } from '@/hooks/useCompanyForm'
import { useToast } from '@/hooks/use-toast'
import {
  X,
  Building2,
  MapPin,
  Phone,
  DollarSign,
  Wallet,
  FileSignature,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { CompanyDadosTab, CompanyContatoTab, CompanyAddressTab } from './tabs/CompanyTabs'
import { CompanyFinanceiroTab } from './tabs/CompanyFinancialTabs'
import { CompanyBankingTab } from './tabs/CompanyBankingTab'
import { CompanyAgreementsTab } from './tabs/CompanyAgreementsTab'

export default function CompanyModal({
  open,
  onOpenChange,
  type = 'client',
  entityId = null,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  type?: 'client' | 'supplier'
  entityId?: string | null
}) {
  const [activeTab, setActiveTab] = useState('dados')
  const {
    data,
    updateData,
    progress,
    globalProgress,
    errors,
    validate,
    saveEntity,
    saveStatus,
    autofillCNPJ,
  } = useCompanyForm(type, entityId)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setActiveTab('dados')
    }
  }, [open, entityId])

  const TABS = [
    { id: 'dados', label: 'Dados Corporativos', prog: progress.dados, icon: Building2 },
    { id: 'endereco', label: 'Endereço', prog: progress.endereco, icon: MapPin },
    { id: 'contato', label: 'Contatos', prog: progress.contato, icon: Phone },
    {
      id: 'financeiro',
      label: 'Financeiro / Limites',
      prog: progress.financeiro,
      icon: DollarSign,
    },
    { id: 'bancario', label: 'Bancário / PIX', prog: progress.bancario, icon: Wallet },
    { id: 'acordos', label: 'Acordos (SLA)', prog: progress.acordos, icon: FileSignature },
  ]

  const handleSave = async () => {
    if (!validate()) {
      toast({
        variant: 'destructive',
        title: 'Erros de Validação',
        description: 'Verifique os campos obrigatórios.',
      })
      return
    }
    const success = await saveEntity()
    if (success) {
      toast({ title: 'Dados Salvos', description: 'O registro foi salvo com sucesso na nuvem.' })
      onOpenChange(false)
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro de Sincronização',
        description: 'Ocorreu um erro ao salvar os dados no PocketBase.',
      })
    }
  }

  const getProgressColor = (prog: number | null) => {
    if (prog === null) return 'bg-slate-200'
    if (prog === 100) return 'bg-emerald-500'
    if (prog > 50) return 'bg-amber-400'
    return 'bg-blue-500'
  }

  const hasErrors = Object.keys(errors).length > 0

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
                <Building2 className="w-5 h-5 text-slate-500" />
                {entityId
                  ? type === 'supplier'
                    ? 'Editar Fornecedor'
                    : 'Editar Cliente'
                  : type === 'supplier'
                    ? 'Novo Fornecedor'
                    : 'Novo Cliente'}
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1">
                Preencha os dados corporativos e regras financeiras da empresa.
              </DialogDescription>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-inner">
                {saveStatus === 'saving' ? (
                  <span className="text-xs text-blue-600 font-semibold flex items-center">
                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Salvando...
                  </span>
                ) : saveStatus === 'saved' ? (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1.5" /> Salvo
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">Preenchimento:</span>
                )}
                {saveStatus === 'idle' && (
                  <>
                    <Progress
                      value={globalProgress}
                      className="w-20 h-1.5 bg-slate-200 [&>div]:bg-blue-600"
                    />
                    <span className="text-sm font-bold text-slate-700">{globalProgress}%</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-3 mt-6 px-1 custom-scrollbar">
            {TABS.map((tab) => {
              const tabHasError = Object.keys(errors).some((k) => k.startsWith(tab.id))
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex flex-col min-w-[120px] px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shrink-0 border border-transparent shadow-sm',
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-100'
                      : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 border-slate-200',
                    tabHasError && activeTab !== tab.id && 'border-rose-200 text-rose-600',
                  )}
                >
                  <div className="flex items-center gap-1.5 w-full mb-1">
                    <tab.icon
                      className={cn(
                        'w-4 h-4',
                        activeTab === tab.id ? 'text-blue-600' : 'text-slate-400',
                        tabHasError && 'text-rose-500',
                      )}
                    />
                    <span>{tab.label}</span>
                  </div>
                  {tab.prog !== null && (
                    <div className="w-full flex items-center gap-2 mt-1">
                      <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full', getProgressColor(tab.prog))}
                          style={{ width: `${tab.prog}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold">{tab.prog}%</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50">
          <div className="max-w-4xl mx-auto min-h-full">
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
              <CompanyAddressTab
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
            {activeTab === 'bancario' && (
              <CompanyBankingTab
                data={data}
                onChange={(section: string, v: any) => updateData(section, null, v)}
                readOnly={false}
              />
            )}
            {activeTab === 'acordos' && (
              <CompanyAgreementsTab
                data={data.acordos}
                onChange={(f: string, v: any) => updateData('acordos', f, v)}
                readOnly={false}
              />
            )}
          </div>
        </div>

        <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex justify-between items-center shrink-0 z-10">
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-500">
              <span className="text-rose-500 font-bold">*</span> Obrigatórios
            </p>
            {hasErrors && (
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 ml-4 bg-rose-50 px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-3 h-3" /> Verifique os erros
              </p>
            )}
          </div>
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
              Salvar Cadastro
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
