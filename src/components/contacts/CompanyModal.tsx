import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  X,
  Building2,
  Phone,
  MapPin,
  Paperclip,
  Eye,
  Edit2,
  AlertTriangle,
  CreditCard,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { CompanyDadosTab, CompanyContatoTab, CompanyBancarioTab } from './tabs/CompanyTabs'
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
  const [isEditing, setIsEditing] = useState(true)
  const { data, updateData, progress, globalProgress, errors, validate, autofillCNPJ } =
    useCompanyForm(type)
  const { toast } = useToast()

  const TABS = [
    { id: 'dados', label: 'Identificação', prog: progress.dados, icon: Building2 },
    { id: 'contato', label: 'Contato', prog: progress.contato, icon: Phone },
    { id: 'endereco', label: 'Endereço', prog: progress.endereco, icon: MapPin },
    ...(type === 'supplier'
      ? [{ id: 'bancario', label: 'Bancário', prog: progress.bancario, icon: CreditCard }]
      : []),
    { id: 'anexos', label: 'Anexos', prog: null, icon: Paperclip },
  ]

  const handleSave = () => {
    if (!validate()) {
      toast({
        variant: 'destructive',
        title: 'Erros',
        description: 'Verifique os campos obrigatórios em vermelho.',
      })
      return
    }
    toast({ title: 'Sucesso', description: 'Registro salvo com segurança.' })
    setIsEditing(false)
  }

  const getProgressColor = (p: number | null) => {
    if (p === null) return 'bg-slate-200'
    if (p === 100) return 'bg-emerald-500'
    if (p > 50) return 'bg-amber-400'
    return 'bg-blue-500'
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[950px] h-[90vh] flex flex-col p-0 gap-0 bg-slate-50 border-none rounded-2xl shadow-2xl overflow-hidden [&>button]:hidden">
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
                {isEditing
                  ? `Editar Ficha de ${type === 'client' ? 'Cliente' : 'Fornecedor'}`
                  : `Visualizar Ficha de ${type === 'client' ? 'Cliente' : 'Fornecedor'}`}
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-1">
                Gerencie todos os dados da empresa e contatos.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={isEditing ? 'outline' : 'default'}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="h-9 transition-all font-semibold"
              >
                {isEditing ? <Eye className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                {isEditing ? 'Modo Leitura' : 'Ativar Edição'}
              </Button>
              <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Preenchimento:</span>
                <Progress
                  value={globalProgress}
                  className="w-24 h-1.5 bg-slate-200 [&>div]:bg-blue-600"
                />
                <span className="text-sm font-bold text-slate-700">{globalProgress}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-3 mt-6 px-1 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full">
            {TABS.map((tab) => {
              const tabHasError = Object.keys(errors).some((k) => k.startsWith(tab.id))
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex flex-col min-w-[100px] px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shrink-0 border shadow-sm',
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-100'
                      : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200 hover:text-slate-700',
                    tabHasError && activeTab !== tab.id && 'border-rose-200 text-rose-600',
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1">
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

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-full">
            {activeTab === 'dados' && (
              <CompanyDadosTab
                data={data.dados}
                onChange={(f: string, v: any) => updateData('dados', f, v)}
                onAutofill={autofillCNPJ}
                errors={errors}
                readOnly={!isEditing}
              />
            )}
            {activeTab === 'contato' && (
              <CompanyContatoTab
                data={data.contato}
                onChange={(f: string, v: any) => updateData('contato', f, v)}
                errors={errors}
                readOnly={!isEditing}
              />
            )}
            {activeTab === 'endereco' && (
              <AddressTab
                data={data.endereco}
                onChange={(f: string, v: any) => updateData('endereco', f, v)}
                errors={errors}
                readOnly={!isEditing}
              />
            )}
            {activeTab === 'bancario' && (
              <CompanyBancarioTab
                data={data.bancario}
                onChange={(f: string, v: any) => updateData('bancario', f, v)}
                errors={errors}
                readOnly={!isEditing}
              />
            )}
            {activeTab === 'anexos' && <AttachmentsTab readOnly={!isEditing} />}
          </div>
        </div>

        <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex justify-between items-center shrink-0 z-10">
          <div className="flex items-center gap-2 hidden sm:flex">
            <p className="text-xs text-slate-500">
              <span className="text-rose-500 font-bold">*</span> Obrigatórios
            </p>
            {hasErrors && (
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 ml-4 bg-rose-50 px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-3 h-3" /> Erros na validação
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
            {isEditing && (
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-8 font-semibold"
              >
                Salvar Dados
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
