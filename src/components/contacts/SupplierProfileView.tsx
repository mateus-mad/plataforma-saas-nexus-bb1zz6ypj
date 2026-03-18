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

export default function SupplierProfileView({ open, onOpenChange, companyData }: any) {
  const { toast } = useToast()
  const { data, updateData } = useCompanyForm('supplier')
  const [activeTab, setActiveTab] = useState('identificacao')

  const handleSave = () => {
    toast({
      title: 'Salvando no banco de dados',
      description:
        'As informações do fornecedor foram atualizadas com sucesso e sincronizadas com a base de dados.',
    })
    onOpenChange(false)
  }

  const exportDoc = () => {
    toast({
      title: 'Gerando Relatório Executivo',
      description: 'O PDF BI está sendo preparado para exportação.',
    })
    setTimeout(() => {
      const printWindow = window.open('', '_blank')
      if (!printWindow) return

      const html = `
        <!DOCTYPE html><html><head>
          <title>Ficha Executiva - ${data.dados?.nomeRazao || 'Fornecedor'}</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #1e293b; background: #f8fafc; margin: 0; }
            .page { background: white; padding: 50px; border-radius: 12px; box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1); max-width: 900px; margin: 0 auto; border-top: 8px solid #2563eb; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 32px; }
            .header h1 { font-size: 28px; margin: 0 0 8px 0; color: #0f172a; font-weight: 800; letter-spacing: -0.5px; }
            .header p { margin: 0; color: #64748b; font-size: 15px; font-weight: 500; }
            .badge { background: #dcfce7; color: #059669; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; display: inline-block; margin-top: 12px; border: 1px solid #bbf7d0;}
            h2 { font-size: 16px; color: #1e40af; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #bfdbfe; padding-bottom: 8px; margin-top: 40px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px; }
            .grid-3 { grid-template-columns: repeat(3, 1fr); }
            .field { background: #f8fafc; padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0; }
            .field strong { display: block; font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 6px; font-weight: 700; }
            .field span { font-size: 15px; font-weight: 700; color: #0f172a; }
            .kpi-row { display: flex; gap: 20px; margin-top: 20px; }
            .kpi { flex: 1; background: #eff6ff; padding: 20px; border-radius: 12px; border: 1px solid #bfdbfe; text-align: center; }
            .kpi strong { display: block; font-size: 12px; color: #1e40af; text-transform: uppercase; margin-bottom: 8px; font-weight: 700; }
            .kpi span { font-size: 24px; font-weight: 900; color: #1e3a8a; }
            table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 20px; font-size: 14px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
            th, td { padding: 14px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background: #f8fafc; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 12px; }
            tr:last-child td { border-bottom: none; }
            .footer { margin-top: 60px; text-align: center; color: #94a3b8; font-size: 13px; border-top: 1px solid #e2e8f0; padding-top: 24px; font-weight: 500; }
            @media print { body { background: white; padding: 0; } .page { box-shadow: none; max-width: 100%; border-top: none; } }
          </style>
        </head><body><div class="page">
          <div class="header">
            <div>
              <h1>${data.dados?.nomeRazao || companyData?.name || 'Empresa Fornecedora'}</h1>
              <p>CNPJ: ${data.dados?.documento || '-'} &nbsp;|&nbsp; Segmento: ${data.dados?.segmento || '-'}</p>
              <div class="badge">Status: Ativo - Aprovado</div>
            </div>
          </div>
          
          <h2>🏢 Identificação Estratégica</h2>
          <div class="grid">
            <div class="field"><strong>Razão Social / Nome</strong><span>${data.dados?.nomeRazao || '-'}</span></div>
            <div class="field"><strong>Nome Fantasia</strong><span>${data.dados?.fantasia || '-'}</span></div>
            <div class="field"><strong>Localização (Sede)</strong><span>${data.endereco?.cidade || '-'} - ${data.endereco?.estado || '-'}</span></div>
            <div class="field"><strong>Data de Fundação</strong><span>${data.dados?.dataNascimento || '-'}</span></div>
          </div>

          <h2>👥 Contatos Chave</h2>
          <table><tr><th>Nome</th><th>Cargo</th><th>E-mail</th><th>Telefone</th></tr>
          ${
            data.contato?.pessoas
              ?.map(
                (c: any) =>
                  `<tr><td><strong>${c.nome}</strong></td><td>${c.cargo || '-'}</td><td>${c.email}</td><td>${c.telefone}</td></tr>`,
              )
              .join('') || '<tr><td colspan="4">Nenhum contato cadastrado.</td></tr>'
          }
          </table>

          <h2>💳 Resumo Financeiro & BI</h2>
          <div class="kpi-row">
            <div class="kpi"><strong>Confiabilidade</strong><span>98%</span></div>
            <div class="kpi"><strong>Total Compras</strong><span>R$ 145.000,00</span></div>
            <div class="kpi" style="background:#fef2f2; border-color:#fecdd3;">
              <strong style="color:#e11d48;">Pendente</strong><span style="color:#be123c;">R$ 15.000,00</span>
            </div>
            <div class="kpi" style="background:#f0fdf4; border-color:#bbf7d0;">
              <strong style="color:#059669;">Em Atraso</strong><span style="color:#047857;">R$ 0,00</span>
            </div>
          </div>
          
          <div class="grid grid-3">
            <div class="field"><strong>Limite de Crédito Ativo</strong><span style="color:#059669">R$ ${data.financeiro?.limiteCredito || '0'}</span></div>
            <div class="field"><strong>Prazo Pagamento Padrão</strong><span>${data.financeiro?.prazoPagamento || '0'} dias</span></div>
            <div class="field"><strong>Média Pgto vs Vencimento</strong><span style="color:#059669">-2 Dias (Antecipado)</span></div>
          </div>
          
          <h2>📑 Documentação e Governança</h2>
          <div class="grid">
            <div class="field"><strong>Contratos Ativos e Anexos</strong><span>${data.contratos?.lista?.length || 0} documento(s) listado(s)</span></div>
            <div class="field"><strong>Acordos Comerciais Vigentes</strong><span>${data.acordos?.lista?.length || 0} acordo(s) registrado(s)</span></div>
          </div>

          <div class="footer">Gerado pelo Nexus ERP &bull; Ficha de Gestão Executiva &bull; Uso Restrito &bull; Documento Oficial Confidencial</div>
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
                    Ativo
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-slate-500 border-slate-200 font-mono text-[10px] sm:text-xs"
                  >
                    {data.dados?.documento || companyData?.id}
                  </Badge>
                </div>
                <DialogDescription className="text-sm sm:text-base text-slate-500 font-medium">
                  Segmento: {data.dados?.segmento || 'Não informado'}
                </DialogDescription>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end md:absolute md:top-6 md:right-6">
              <Button
                variant="outline"
                onClick={exportDoc}
                className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold bg-white h-9"
              >
                <Printer className="w-4 h-4 md:mr-2" />{' '}
                <span className="hidden md:inline">Exportar PDF</span>
              </Button>
              <Button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-bold h-9"
              >
                <Save className="w-4 h-4 md:mr-2" />{' '}
                <span className="hidden md:inline">Salvar Ficha</span>
              </Button>
              <button
                onClick={() => onOpenChange(false)}
                className="ml-1 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors hidden md:block"
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
                  'flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg whitespace-nowrap transition-all border',
                  activeTab === t.id
                    ? 'bg-slate-800 text-white border-transparent shadow-sm'
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
