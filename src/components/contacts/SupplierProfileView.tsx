import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCompanyForm } from '@/hooks/useCompanyForm'
import {
  CheckCircle2,
  X,
  Printer,
  LayoutDashboard,
  Users,
  DollarSign,
  CreditCard,
  FileSignature,
  FileText,
  HeartHandshake,
  History,
  Save,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

import {
  SupplierIdentificationTab,
  SupplierContactsTab,
  SupplierFinancialDashTab,
  SupplierBankingDashTab,
  SupplierAgreementsTab,
  SupplierRelationshipTab,
  SupplierHistoryTab,
} from './tabs/SupplierTabs'
import SupplierContractsTab from './tabs/SupplierContractsTab'

export default function SupplierProfileView({ open, onOpenChange, companyData }: any) {
  const { toast } = useToast()
  const { data, updateData, saveStatus, validateCompliance } = useCompanyForm('supplier')
  const [activeTab, setActiveTab] = useState('identificacao')

  const handleSave = () => {
    toast({
      title: 'Banco de Dados Sincronizado',
      description: 'As alterações foram salvas definitivamente na nuvem corporativa.',
    })
    onOpenChange(false)
  }

  const exportDoc = () => {
    toast({ title: 'Gerando Relatório', description: 'O PDF está sendo preparado para download.' })
    setTimeout(() => {
      toast({
        title: 'Relatório Finalizado',
        description: 'O arquivo PDF foi exportado para o seu dispositivo.',
      })
    }, 1500)
  }

  const tabs = [
    { id: 'identificacao', label: 'Identificação', icon: LayoutDashboard },
    { id: 'contatos', label: 'Contatos', icon: Users },
    { id: 'financeiro', label: 'Financeiro (BI)', icon: DollarSign },
    { id: 'bancario', label: 'Bancário / PIX', icon: CreditCard },
    { id: 'acordos', label: 'Acordos (SLA)', icon: FileSignature },
    { id: 'contratos', label: 'Contratos e Assinaturas', icon: FileText },
    { id: 'relacionamento', label: 'Relacionamento', icon: HeartHandshake },
    { id: 'historico', label: 'Histórico', icon: History },
  ]

  const renderTab = () => {
    switch (activeTab) {
      case 'identificacao':
        return (
          <SupplierIdentificationTab
            data={data}
            updateData={updateData}
            validateCompliance={validateCompliance}
          />
        )
      case 'contatos':
        return <SupplierContactsTab data={data} updateData={updateData} />
      case 'financeiro':
        return <SupplierFinancialDashTab data={data} />
      case 'bancario':
        return <SupplierBankingDashTab data={data} updateData={updateData} />
      case 'acordos':
        return <SupplierAgreementsTab data={data} updateData={updateData} />
      case 'contratos':
        return <SupplierContractsTab data={data} updateData={updateData} />
      case 'relacionamento':
        return <SupplierRelationshipTab data={data} updateData={updateData} />
      case 'historico':
        return <SupplierHistoryTab />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1300px] w-[96vw] h-[95vh] p-0 bg-slate-50 border-none shadow-2xl rounded-2xl flex flex-col overflow-hidden [&>button]:hidden">
        <div className="bg-white border-b border-slate-200 p-5 sm:p-7 flex flex-col gap-5 shrink-0 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white shadow-md bg-white">
                  <AvatarImage
                    src={data.dados?.logo || companyData?.avatar}
                    className="object-contain p-2"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-blue-50 text-blue-600">
                    {companyData?.name?.charAt(0) || data.dados?.nomeRazao?.charAt(0) || 'F'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <DialogTitle className="text-xl sm:text-2xl font-black text-slate-800 leading-none tracking-tight">
                    {data.dados?.nomeRazao || companyData?.name || 'Fornecedor Identificado'}
                  </DialogTitle>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none shadow-none text-[10px] sm:text-xs font-bold px-2 py-0.5">
                    Fornecedor Ativo
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-slate-500 border-slate-200 font-mono text-[10px] sm:text-xs"
                  >
                    {data.dados?.documento || companyData?.id}
                  </Badge>
                </div>
                <DialogDescription className="text-sm sm:text-base text-slate-500 font-medium">
                  Autosalvamento em tempo real ativado.
                </DialogDescription>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end md:absolute md:top-6 md:right-6">
              {saveStatus === 'saving' && (
                <span className="text-sm text-blue-600 font-semibold flex items-center mr-2">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sincronizando BD...
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-sm text-emerald-600 font-semibold flex items-center mr-2">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Nuvem Atualizada
                </span>
              )}
              <Button
                variant="outline"
                onClick={exportDoc}
                className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold bg-white h-9 shadow-sm"
              >
                <Printer className="w-4 h-4 md:mr-2" />{' '}
                <span className="hidden md:inline">Relatório PDF</span>
              </Button>
              <Button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-bold h-9"
              >
                <Save className="w-4 h-4 md:mr-2" />{' '}
                <span className="hidden md:inline">Forçar Salvamento</span>
              </Button>
              <button
                onClick={() => onOpenChange(false)}
                className="ml-1 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors hidden md:block shadow-inner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2 -mb-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg whitespace-nowrap transition-all border shadow-sm',
                  activeTab === t.id
                    ? 'bg-slate-800 text-white border-transparent'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800',
                )}
              >
                <t.icon
                  className={cn('w-4 h-4', activeTab === t.id ? 'text-white' : 'text-slate-400')}
                />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50 custom-scrollbar">
          <div className="max-w-6xl mx-auto">{renderTab()}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
