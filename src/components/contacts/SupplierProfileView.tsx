import { useState } from 'react'
import { DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCompanyForm } from '@/hooks/useCompanyForm'
import { Truck, CheckCircle2, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

import { CompanyDadosTab, CompanyContatoTab, CompanyAddressTab } from './tabs/CompanyTabs'
import { CompanyFinanceiroTab } from './tabs/CompanyFinancialTabs'
import { CompanyBankingTab } from './tabs/CompanyBankingTab'
import { CompanyAgreementsTab } from './tabs/CompanyAgreementsTab'
import { CompanyRelacionamentoTab } from './tabs/CompanyRelationshipTabs'
import AttachmentsTab from './tabs/AttachmentsTab'
import HistoryTab from './tabs/HistoryTab'

const generateValidPDF = () => {
  const pdfContent =
    '%PDF-1.4\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type/Pages/Count 1/Kids[3 0 R]>>\nendobj\n3 0 obj\n<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000015 00000 n\n0000000060 00000 n\n0000000117 00000 n\ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n187\n%%EOF'
  return new Blob([pdfContent], { type: 'application/pdf' })
}

export default function SupplierProfileView({ onOpenChange }: any) {
  const { toast } = useToast()
  const { data, updateData, globalProgress, progress, autofillCNPJ } = useCompanyForm('supplier')
  const [activeTab, setActiveTab] = useState('identificacao')

  const handleUpdate = () => {
    toast({
      title: 'Fornecedor Atualizado',
      description: 'As alterações foram salvas com sucesso.',
    })
    onOpenChange(false)
  }

  const exportDoc = () => {
    toast({ title: 'Gerando PDF', description: 'O relatório será baixado em instantes.' })
    setTimeout(() => {
      const url = URL.createObjectURL(generateValidPDF())
      const a = document.createElement('a')
      a.href = url
      a.download = `Ficha_Fornecedor.pdf`
      a.click()
    }, 1500)
  }

  const tabs = [
    { id: 'identificacao', label: 'Identificação', prog: progress.dados },
    { id: 'endereco', label: 'Endereço', prog: progress.endereco },
    { id: 'contato', label: 'Contato', prog: progress.contato },
    { id: 'financeiro', label: 'Financeiro', prog: progress.financeiro },
    { id: 'bancario', label: 'Bancário' },
    { id: 'acordos', label: 'Acordos' },
    { id: 'contratos', label: 'Contratos' },
    { id: 'relacionamento', label: 'Relacionamento' },
    { id: 'documentos', label: 'Documentos' },
    { id: 'historico', label: 'Histórico' },
  ]

  const renderTab = () => {
    switch (activeTab) {
      case 'identificacao':
        return (
          <CompanyDadosTab
            data={data.dados}
            onChange={(f: any, v: any) => updateData('dados', f, v)}
            onAutofill={autofillCNPJ}
          />
        )
      case 'endereco':
        return (
          <CompanyAddressTab
            data={data.endereco}
            onChange={(f: any, v: any) => updateData('endereco', f, v)}
          />
        )
      case 'contato':
        return (
          <CompanyContatoTab
            data={data.contato}
            onChange={(f: any, v: any) => updateData('contato', f, v)}
          />
        )
      case 'financeiro':
        return (
          <CompanyFinanceiroTab
            type="supplier"
            data={data.financeiro}
            onChange={(f: any, v: any) => updateData('financeiro', f, v)}
          />
        )
      case 'bancario':
        return (
          <CompanyBankingTab
            data={data.bancario}
            onChange={(f: any, v: any) => updateData('bancario', f, v)}
          />
        )
      case 'acordos':
        return (
          <CompanyAgreementsTab
            data={data.acordos}
            onChange={(f: any, v: any) => updateData('acordos', f, v)}
          />
        )
      case 'contratos':
        return <AttachmentsTab />
      case 'relacionamento':
        return (
          <CompanyRelacionamentoTab
            data={data.relacionamento}
            onChange={(f: any, v: any) => updateData('relacionamento', f, v)}
          />
        )
      case 'documentos':
        return <AttachmentsTab />
      case 'historico':
        return <HistoryTab />
      default:
        return null
    }
  }

  return (
    <DialogContent className="max-w-[1200px] w-[95vw] h-[95vh] p-0 bg-slate-50 border-none shadow-2xl rounded-2xl flex flex-col overflow-hidden [&>button]:hidden">
      <div className="bg-white border-b border-slate-200 pt-6 px-6 pb-0 flex flex-col gap-5 shrink-0 z-10">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-800">
                Editar Fornecedor
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-0.5">
                Preencha os dados do fornecedor. Campos com * são obrigatórios.
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-sm bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
              <span className="text-emerald-600 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Preenchimento:
              </span>
              <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${globalProgress}%` }}
                />
              </div>
              <span className="font-bold text-slate-700">{globalProgress}%</span>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-3 pt-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all flex items-center gap-2',
                activeTab === t.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              {t.label}
              {t.prog !== undefined && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                    activeTab === t.id
                      ? 'bg-blue-500/50 text-white'
                      : 'bg-amber-100 text-amber-700',
                  )}
                >
                  {t.prog}%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/50 custom-scrollbar">
        <div className="max-w-5xl mx-auto">{renderTab()}</div>
      </div>

      <div className="bg-white border-t border-slate-200 p-4 px-6 flex justify-between items-center shrink-0 z-10">
        <Button variant="outline" onClick={exportDoc} className="hidden sm:flex text-slate-600">
          Exportar Ficha (PDF)
        </Button>
        <div className="flex gap-3 w-full sm:w-auto justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">
            Cancelar
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 shadow-sm"
            onClick={handleUpdate}
          >
            Atualizar
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
