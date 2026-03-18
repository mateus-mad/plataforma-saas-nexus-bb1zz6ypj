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
  Edit,
  LayoutDashboard,
  Users,
  DollarSign,
  CreditCard,
  FileSignature,
  FileText,
  HeartHandshake,
  History,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

import SupplierIdentificationTab from './tabs/SupplierIdentificationTab'
import SupplierContactsTab from './tabs/SupplierContactsTab'
import SupplierRelationshipTab from './tabs/SupplierRelationshipTab'
import SupplierFinancialDashTab from './tabs/SupplierFinancialDashTab'
import SupplierBankingDashTab from './tabs/SupplierBankingDashTab'
import SupplierAgreementsTab from './tabs/SupplierAgreementsTab'
import SupplierContractsTab from './tabs/SupplierContractsTab'
import SupplierHistoryTab from './tabs/SupplierHistoryTab'

export default function SupplierProfileView({ open, onOpenChange, onEdit, companyData }: any) {
  const { toast } = useToast()
  const { data, updateData } = useCompanyForm('supplier')
  const [activeTab, setActiveTab] = useState('identificacao')

  const exportDoc = () => {
    toast({ title: 'Gerando Relatório Executivo', description: 'O PDF BI está sendo preparado.' })
    setTimeout(() => {
      const printWindow = window.open('', '_blank')
      if (!printWindow) return

      const html = `
        <!DOCTYPE html><html><head>
          <title>Ficha Executiva - ${data.dados?.nomeRazao || 'Fornecedor'}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1e293b; background: #f8fafc; }
            .page { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
            h1 { font-size: 24px; margin: 0 0 4px 0; }
            h2 { font-size: 14px; color: #2563eb; text-transform: uppercase; border-bottom: 2px solid #eff6ff; padding-bottom: 8px; margin-top: 30px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
            .field { background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #f1f5f9; }
            .field strong { display: block; font-size: 10px; color: #64748b; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background: #f8fafc; color: #475569; }
          </style>
        </head><body><div class="page">
          <h1>${data.dados?.nomeRazao || 'Empresa'}</h1>
          <p>${data.dados?.documento || '-'} • ${data.dados?.segmento || '-'}</p>
          
          <h2>🏢 Identificação</h2>
          <div class="grid">
            <div class="field"><strong>Razão Social</strong><span>${data.dados?.nomeRazao || '-'}</span></div>
            <div class="field"><strong>Status</strong><span>Ativo</span></div>
          </div>

          <h2>👥 Contatos</h2>
          <table><tr><th>Nome</th><th>Cargo</th><th>Contato</th></tr>
          ${data.contato?.pessoas?.map((c: any) => `<tr><td>${c.nome}</td><td>${c.cargo || '-'}</td><td>${c.email} / ${c.telefone}</td></tr>`).join('') || ''}
          </table>

          <h2>💳 Financeiro & Bancário</h2>
          <div class="grid">
            <div class="field"><strong>Limite Crédito</strong><span>R$ ${data.financeiro?.limiteCredito || '0'}</span></div>
            <div class="field"><strong>Prazo Pagamento</strong><span>${data.financeiro?.prazoPagamento || '0'} dias</span></div>
          </div>
          
          <h2>📑 Documentação e Governança</h2>
          <p><strong>Contratos Ativos:</strong> ${data.contratos?.lista?.length || 0} anexados</p>
          <p><strong>Acordos Comerciais:</strong> ${data.acordos?.lista?.length || 0} registrados</p>
          <p><strong>Ocorrências SLA:</strong> ${data.relacionamento?.problemas?.length || 0} registradas</p>

        </div><script>window.onload=function(){setTimeout(()=>{window.print();window.close();},500);}</script></body></html>
      `
      printWindow.document.write(html)
      printWindow.document.close()
    }, 500)
  }

  const tabs = [
    { id: 'identificacao', label: 'Identificação', icon: LayoutDashboard },
    { id: 'contatos', label: 'Contatos', icon: Users },
    { id: 'financeiro', label: 'Financeiro (BI)', icon: DollarSign },
    { id: 'bancario', label: 'Bancário / PIX', icon: CreditCard },
    { id: 'acordos', label: 'Acordos (SLA)', icon: FileSignature },
    { id: 'contratos', label: 'Contratos', icon: FileText },
    { id: 'relacionamento', label: 'Relacionamento', icon: HeartHandshake },
    { id: 'historico', label: 'Histórico', icon: History },
  ]

  const renderTab = () => {
    switch (activeTab) {
      case 'identificacao':
        return <SupplierIdentificationTab data={data} updateData={updateData} />
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
        <div className="bg-white border-b border-slate-200 p-6 sm:p-8 flex flex-col gap-6 shrink-0 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <Avatar className="w-20 h-20 border-4 border-white shadow-md bg-white">
                  <AvatarImage
                    src={data.dados?.logo || companyData?.avatar}
                    className="object-contain p-2"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-blue-50 text-blue-600">
                    {companyData?.name?.charAt(0) || data.dados?.nomeRazao?.charAt(0) || 'F'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <DialogTitle className="text-2xl sm:text-3xl font-black text-slate-800 leading-none tracking-tight">
                    {data.dados?.nomeRazao || companyData?.name || 'Fornecedor Identificado'}
                  </DialogTitle>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none shadow-none text-xs font-bold px-2 py-0.5">
                    Ativo
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-slate-500 border-slate-200 font-mono text-xs"
                  >
                    {data.dados?.documento || companyData?.id}
                  </Badge>
                </div>
                <DialogDescription className="text-base text-slate-500 font-medium">
                  Segmento: {data.dados?.segmento || 'Não informado'}
                </DialogDescription>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end md:absolute md:top-8 md:right-8">
              <Button
                variant="outline"
                onClick={exportDoc}
                className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold bg-white"
              >
                <Printer className="w-4 h-4 md:mr-2" />{' '}
                <span className="hidden md:inline">Relatório BI (PDF)</span>
              </Button>
              <Button
                onClick={() => {
                  onOpenChange(false)
                  if (onEdit) onEdit()
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-bold"
              >
                <Edit className="w-4 h-4 md:mr-2" />{' '}
                <span className="hidden md:inline">Visualizar Cadastro Antigo</span>
              </Button>
              <button
                onClick={() => onOpenChange(false)}
                className="ml-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-full transition-colors hidden md:block"
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
                  'flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all border',
                  activeTab === t.id
                    ? 'bg-slate-800 text-white border-transparent shadow-md'
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

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/50 custom-scrollbar">
          <div className="max-w-6xl mx-auto">{renderTab()}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
