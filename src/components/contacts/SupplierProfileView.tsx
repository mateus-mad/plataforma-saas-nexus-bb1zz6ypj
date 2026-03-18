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
import AttachmentsTab from './tabs/AttachmentsTab'
import SupplierHistoryTab from './tabs/SupplierHistoryTab'
import SupplierPerformanceTab from './tabs/SupplierPerformanceTab'

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
    toast({
      title: 'Gerando Relatório',
      description: 'Abrindo visualização para exportação em PDF.',
    })
    setTimeout(() => {
      const printWindow = window.open('', '_blank')
      if (!printWindow) return

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Ficha do Fornecedor - ${data.dados?.nomeRazao || 'Desconhecido'}</title>
            <style>
              body { font-family: ui-sans-serif, system-ui, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
              .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
              h1 { font-size: 24px; color: #0f172a; margin: 0 0 4px 0; }
              p { margin: 0; color: #64748b; font-size: 14px; }
              .logo { max-width: 120px; max-height: 60px; object-fit: contain; border-radius: 8px; }
              .section { margin-bottom: 32px; page-break-inside: avoid; }
              h2 { font-size: 16px; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; }
              .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
              .field strong { display: block; font-size: 11px; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
              .field span { font-size: 14px; font-weight: 500; color: #334155; }
              table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
              th, td { padding: 10px 12px; border: 1px solid #e2e8f0; text-align: left; }
              th { background-color: #f8fafc; font-weight: 600; color: #475569; }
              td { color: #334155; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1>Ficha de Fornecedor</h1>
                <p><strong>${data.dados?.nomeRazao || 'Empresa Não Identificada'}</strong> • ${data.dados?.documento || 'Sem Documento'}</p>
              </div>
              ${data.dados?.logo ? `<img src="${data.dados.logo}" class="logo" />` : ''}
            </div>

            <div class="section">
              <h2>Dados de Contato Principais</h2>
              <div class="grid">
                <div class="field"><strong>Pessoa de Contato:</strong> <span>${data.contato?.responsavel || 'Não informado'}</span></div>
                <div class="field"><strong>Cargo / Função:</strong> <span>${data.contato?.cargo || 'Não informado'}</span></div>
                <div class="field"><strong>E-mail:</strong> <span>${data.contato?.email || 'Não informado'}</span></div>
                <div class="field"><strong>Telefone:</strong> <span>${data.contato?.telefone || 'Não informado'}</span></div>
              </div>
            </div>

            <div class="section">
              <h2>Dados Bancários</h2>
              <table>
                <thead>
                  <tr><th>Banco</th><th>Tipo</th><th>Agência</th><th>Conta</th></tr>
                </thead>
                <tbody>
                  ${
                    data.bancario?.contas?.length > 0
                      ? data.bancario.contas
                          .map(
                            (c: any) =>
                              `<tr><td>${c.banco}</td><td>${c.tipo}</td><td>${c.agencia}</td><td>${c.conta}</td></tr>`,
                          )
                          .join('')
                      : '<tr><td colspan="4">Nenhuma conta cadastrada</td></tr>'
                  }
                </tbody>
              </table>
              
              <h3 style="font-size: 13px; color: #64748b; margin: 20px 0 8px 0; text-transform: uppercase;">Chaves PIX Cadastradas</h3>
              <table>
                <thead>
                  <tr><th>Tipo de Chave</th><th>Chave PIX</th></tr>
                </thead>
                <tbody>
                  ${
                    data.bancario?.pix?.length > 0
                      ? data.bancario.pix
                          .map((p: any) => `<tr><td>${p.tipo}</td><td>${p.chave}</td></tr>`)
                          .join('')
                      : '<tr><td colspan="2">Nenhuma chave PIX cadastrada</td></tr>'
                  }
                </tbody>
              </table>
            </div>

            <div class="section">
              <h2>Acordos e Negociações Comerciais</h2>
              <div class="grid">
                <div class="field"><strong>Desconto Padrão Combinado:</strong> <span>${data.acordos?.desconto || 'Nenhum desconto registrado'}</span></div>
                <div class="field"><strong>Termos / Negociação:</strong> <span>${data.acordos?.negociacao || 'Nenhum termo registrado'}</span></div>
                <div class="field" style="grid-column: span 2;"><strong>Observações do Acordo:</strong> <span>${data.acordos?.observacoes || 'Nenhuma observação'}</span></div>
              </div>
            </div>

            <div class="section">
              <h2>Métricas de Desempenho e Qualidade</h2>
              <div class="grid">
                <div class="field"><strong>Lead Time de Entrega (Média):</strong> <span>4.3 Dias (Excelente)</span></div>
                <div class="field"><strong>Qualidade de Entrega (SLA):</strong> <span>98% no Prazo</span></div>
                <div class="field"><strong>Conformidade do Produto:</strong> <span>99.5% de Aprovação</span></div>
                <div class="field"><strong>Sincronização de Catálogo:</strong> <span>Atualizado (Automático)</span></div>
              </div>
            </div>
            
            <script>
              window.onload = function() { setTimeout(() => { window.print(); window.close(); }, 500); }
            </script>
          </body>
        </html>
      `
      printWindow.document.write(html)
      printWindow.document.close()
    }, 500)
  }

  const tabs = [
    { id: 'identificacao', label: 'Identificação', prog: progress.dados },
    { id: 'endereco', label: 'Endereço', prog: progress.endereco },
    { id: 'contato', label: 'Contato', prog: progress.contato },
    { id: 'desempenho', label: 'Desempenho' },
    { id: 'financeiro', label: 'Financeiro', prog: progress.financeiro },
    { id: 'bancario', label: 'Bancário' },
    { id: 'acordos', label: 'Acordos', prog: progress.acordos },
    { id: 'documentos', label: 'Documentos' },
    { id: 'historico', label: 'Histórico Completo' },
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
      case 'desempenho':
        return <SupplierPerformanceTab />
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
      case 'documentos':
        return <AttachmentsTab />
      case 'historico':
        return <SupplierHistoryTab />
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
                Ficha do Fornecedor
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-0.5">
                Visão executiva e gestão do perfil do fornecedor.
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
          Exportar Relatório (PDF)
        </Button>
        <div className="flex gap-3 w-full sm:w-auto justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">
            Fechar
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 shadow-sm"
            onClick={handleUpdate}
          >
            Salvar Alterações
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
