import { useState } from 'react'
import { DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCompanyForm } from '@/hooks/useCompanyForm'
import {
  CheckCircle2,
  X,
  Printer,
  Edit,
  MapPin,
  Phone,
  Building2,
  CreditCard,
  DollarSign,
  Users,
  Briefcase,
  Mail,
  FileText,
  Activity,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

import SupplierPerformanceTab from './tabs/SupplierPerformanceTab'
import SupplierHistoryTab from './tabs/SupplierHistoryTab'

const Section = ({ t, icon: Icon, children }: any) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5 h-full">
    <h3 className="font-semibold text-blue-900 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm">
      <Icon className="w-5 h-5 text-blue-500" /> {t}
    </h3>
    {children}
  </div>
)

const Field = ({ l, v }: { l: string; v: string }) => (
  <div className="space-y-1">
    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{l}</p>
    <p className="text-sm font-medium text-slate-800">{v || '-'}</p>
  </div>
)

export default function SupplierProfileView({ onOpenChange, onEdit, companyData }: any) {
  const { toast } = useToast()
  const { data, globalProgress } = useCompanyForm('supplier')
  const [activeTab, setActiveTab] = useState('visao_geral')

  const exportDoc = () => {
    toast({
      title: 'Gerando Relatório Executivo',
      description: 'O Dashboard PDF do fornecedor está sendo preparado.',
    })
    setTimeout(() => {
      const printWindow = window.open('', '_blank')
      if (!printWindow) return

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Inteligência de Fornecedor - ${data.dados?.nomeRazao || 'Desconhecido'}</title>
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
              .kpi-container { display: flex; gap: 20px; margin-bottom: 20px; }
              .kpi-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; text-align: center; }
              .kpi-card strong { display: block; font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 8px; }
              .kpi-card span { font-size: 20px; font-weight: bold; color: #0f172a; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1>Dashboard de Inteligência: Fornecedor</h1>
                <p><strong>${data.dados?.nomeRazao || 'Empresa Não Identificada'}</strong> • ${data.dados?.documento || 'Sem Documento'}</p>
              </div>
              ${data.dados?.logo ? `<img src="${data.dados.logo}" class="logo" />` : ''}
            </div>

            <div class="section">
              <h2>Métricas de Desempenho (KPIs Principais)</h2>
              <div class="kpi-container">
                <div class="kpi-card"><strong>Prazo de Entrega (Lead Time)</strong><span>4.3 Dias</span></div>
                <div class="kpi-card"><strong>Qualidade da Entrega</strong><span>98% SLA</span></div>
                <div class="kpi-card"><strong>Qualidade dos Produtos</strong><span>99.5%</span></div>
              </div>
            </div>

            <div class="section">
              <h2>Pessoas de Contato Estratégico</h2>
              <table>
                <thead>
                  <tr><th>Nome</th><th>Cargo / Função</th><th>Telefone Direto</th><th>E-mail</th></tr>
                </thead>
                <tbody>
                  ${
                    data.contato?.pessoas?.length > 0
                      ? data.contato.pessoas
                          .map(
                            (c: any) =>
                              `<tr><td>${c.nome}</td><td>${c.cargo}</td><td>${c.telefone}</td><td>${c.email}</td></tr>`,
                          )
                          .join('')
                      : '<tr><td colspan="4">Nenhum contato cadastrado</td></tr>'
                  }
                </tbody>
              </table>
            </div>

            <div class="section">
              <h2>Acordos e Negociações Comerciais</h2>
              <div class="grid">
                <div class="field"><strong>Desconto Padrão Combinado:</strong> <span>${data.acordos?.desconto || 'Nenhum desconto registrado'}</span></div>
                <div class="field"><strong>Termos de Negociação / Prazo:</strong> <span>${data.acordos?.negociacao || 'Nenhum termo registrado'}</span></div>
                <div class="field" style="grid-column: span 2;"><strong>Observações do Acordo:</strong> <span>${data.acordos?.observacoes || 'Nenhuma observação'}</span></div>
              </div>
            </div>

            <div class="section">
              <h2>Dados Financeiros e Bancários</h2>
              <div class="grid" style="margin-bottom: 20px;">
                <div class="field"><strong>Limite de Crédito Aprovado:</strong> <span>R$ ${data.financeiro?.limiteCredito || '0,00'}</span></div>
                <div class="field"><strong>Prazo de Pagamento Padrão:</strong> <span>${data.financeiro?.prazoPagamento || '0'} dias</span></div>
              </div>
              <table>
                <thead>
                  <tr><th>Banco</th><th>Tipo de Conta</th><th>Agência</th><th>Número da Conta</th></tr>
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
              
              <h3 style="font-size: 13px; color: #64748b; margin: 20px 0 8px 0; text-transform: uppercase;">Chaves PIX Habilitadas para Pagamento</h3>
              <table>
                <thead>
                  <tr><th>Tipo de Chave</th><th>Chave PIX Cadastrada</th></tr>
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
    { id: 'visao_geral', label: 'Visão Geral & Contatos' },
    { id: 'financeiro', label: 'Financeiro & Bancário' },
    { id: 'desempenho', label: 'Desempenho (KPIs)' },
    { id: 'historico', label: 'Histórico de Relação' },
  ]

  const renderTab = () => {
    switch (activeTab) {
      case 'visao_geral':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section t="Dados Corporativos" icon={Building2}>
                <div className="grid grid-cols-2 gap-6">
                  <Field l="CNPJ" v={data.dados?.documento} />
                  <Field l="Razão Social" v={data.dados?.nomeRazao} />
                  <Field l="Nome Fantasia" v={data.dados?.fantasia} />
                  <Field l="Setor de Atuação" v={data.dados?.setor} />
                  <Field l="Website Corporativo" v={data.contato?.website} />
                  <Field l="E-mail Padrão" v={data.contato?.emailCobranca} />
                </div>
              </Section>
              <Section t="Endereço Sede" icon={MapPin}>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 h-full flex items-center justify-center text-center">
                  <p className="text-slate-700 text-lg leading-relaxed">
                    <span className="font-semibold">{data.endereco?.logradouro}</span>,{' '}
                    {data.endereco?.numero} {data.endereco?.comp ? `(${data.endereco.comp})` : ''}
                    <br />
                    <span className="text-slate-500 text-base">
                      {data.endereco?.bairro}, {data.endereco?.cidade}/{data.endereco?.estado}
                    </span>
                    <br />
                    <span className="text-sm font-mono text-slate-400 mt-2 block">
                      CEP: {data.endereco?.cep}
                    </span>
                  </p>
                </div>
              </Section>
            </div>

            <Section t="Pessoas de Contato Estratégico" icon={Users}>
              {data.contato?.pessoas?.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {data.contato.pessoas.map((p: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-5 border border-slate-100 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all"
                    >
                      <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-lg">
                          {p.nome?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <p className="text-base font-bold text-slate-800 truncate">{p.nome}</p>
                        <p className="text-xs font-semibold text-blue-600 flex items-center gap-1.5 bg-blue-50 w-fit px-2 py-0.5 rounded-md">
                          <Briefcase className="w-3.5 h-3.5" /> {p.cargo || 'Cargo não informado'}
                        </p>
                        <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-slate-200">
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />{' '}
                            {p.telefone || 'Telefone não informado'}
                          </p>
                          <p className="text-sm text-slate-600 flex items-center gap-2 truncate">
                            <Mail className="w-4 h-4 text-slate-400" />{' '}
                            {p.email || 'E-mail não informado'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-500">Nenhum contato estratégico cadastrado.</p>
                </div>
              )}
            </Section>

            <Section t="Acordos Comerciais e Negociações" icon={FileText}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-amber-50/50 p-6 rounded-xl border border-amber-100">
                <Field l="Desconto Padrão Combinado" v={data.acordos?.desconto} />
                <Field l="Termos de Negociação" v={data.acordos?.negociacao} />
                <div className="md:col-span-3 border-t border-amber-200/60 pt-4">
                  <Field l="Observações de Contrato" v={data.acordos?.observacoes} />
                </div>
              </div>
            </Section>
          </div>
        )
      case 'financeiro':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-md text-white">
                <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest mb-1">
                  Limite de Crédito Ativo
                </p>
                <p className="text-3xl font-bold mt-2">R$ {data.financeiro?.limiteCredito}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Prazo de Pagamento Padrão
                </p>
                <p className="text-2xl font-bold text-slate-800 mt-2">
                  {data.financeiro?.prazoPagamento}{' '}
                  <span className="text-base text-slate-500 font-medium">dias úteis</span>
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-center lg:col-span-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" /> E-mail Destino Faturamento
                </p>
                <p className="text-lg font-medium text-slate-800 mt-2 truncate">
                  {data.contato?.emailCobranca || 'Não configurado'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section t="Contas Bancárias de Recebimento" icon={Building2}>
                {data.bancario?.contas?.length > 0 ? (
                  <div className="grid gap-4">
                    {data.bancario.contas.map((c: any, i: number) => (
                      <div
                        key={i}
                        className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600">
                            {c.banco?.charAt(0) || 'B'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-lg">{c.banco}</p>
                            <Badge variant="outline" className="mt-1 bg-slate-50">
                              {c.tipo}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-left sm:text-right bg-slate-50 p-3 rounded-lg border border-slate-100 w-full sm:w-auto">
                          <p className="text-sm font-semibold text-slate-800">
                            <span className="text-slate-500 font-medium">Agência:</span> {c.agencia}
                          </p>
                          <p className="text-sm font-semibold text-slate-800">
                            <span className="text-slate-500 font-medium">Conta:</span> {c.conta}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-500">Nenhuma conta bancária cadastrada.</p>
                  </div>
                )}
              </Section>

              <Section t="Chaves PIX Cadastradas" icon={CreditCard}>
                {data.bancario?.pix?.length > 0 ? (
                  <div className="grid gap-4">
                    {data.bancario.pix.map((p: any, i: number) => (
                      <div
                        key={i}
                        className="p-5 border border-emerald-200 bg-emerald-50/30 rounded-xl flex items-center gap-4 shadow-sm"
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Activity className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">
                            Tipo: {p.tipo}
                          </p>
                          <p className="font-mono text-lg font-bold text-slate-800 truncate">
                            {p.chave}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-500">Nenhuma chave PIX cadastrada.</p>
                  </div>
                )}
              </Section>
            </div>
          </div>
        )
      case 'desempenho':
        return <SupplierPerformanceTab />
      case 'historico':
        return <SupplierHistoryTab />
      default:
        return null
    }
  }

  return (
    <DialogContent className="max-w-[1200px] w-[95vw] h-[95vh] p-0 bg-slate-50 border-none shadow-2xl rounded-2xl flex flex-col overflow-hidden [&>button]:hidden">
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
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-slate-800 leading-none">
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
                {data.dados?.setor || 'Setor: Fornecimento e Serviços Corporativos'}
              </DialogDescription>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end md:absolute md:top-8 md:right-8">
            <Button
              variant="outline"
              onClick={exportDoc}
              className="border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              <Printer className="w-4 h-4 md:mr-2" />{' '}
              <span className="hidden md:inline">Exportar PDF (BI)</span>
            </Button>
            <Button
              onClick={onEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 font-bold"
            >
              <Edit className="w-4 h-4 md:mr-2" />{' '}
              <span className="hidden md:inline">Editar Cadastro</span>
            </Button>
            <button
              onClick={() => onOpenChange(false)}
              className="ml-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-full transition-colors hidden md:block"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto custom-scrollbar gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                'px-5 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all border',
                activeTab === t.id
                  ? 'bg-slate-800 text-white border-transparent shadow-md'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/50 custom-scrollbar">
        <div className="max-w-6xl mx-auto">{renderTab()}</div>
      </div>
    </DialogContent>
  )
}
