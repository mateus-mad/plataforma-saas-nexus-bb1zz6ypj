import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import {
  Building2,
  Phone,
  MapPin,
  DollarSign,
  Printer,
  Edit,
  Mail,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: () => void
  type?: 'client' | 'supplier'
  companyData?: any
}

const Field = ({ l, v }: { l: string; v: string }) => (
  <div className="space-y-1">
    <p className="text-xs text-slate-500 font-medium">{l}</p>
    <p className="text-sm font-medium text-slate-800 break-words">{v || '-'}</p>
  </div>
)

const Section = ({ t, icon: Icon, children }: any) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
    <h3 className="font-semibold text-blue-900 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm">
      <Icon className="w-4 h-4 text-blue-500" /> {t}
    </h3>
    {children}
  </div>
)

export default function CompanyProfileModal({
  open,
  onOpenChange,
  onEdit,
  type = 'client',
  companyData,
}: Props) {
  const { toast } = useToast()

  const printDossier = () => {
    toast({
      title: 'Gerando Dossiê Completo',
      description: 'O dossiê da empresa está sendo montado em PDF.',
    })
    setTimeout(() => {
      const blob = new Blob(['Dossiê Unificado - Empresa'], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Dossie_${companyData?.name?.replace(/\s+/g, '_') || 'Empresa'}.pdf`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast({ title: 'Dossiê Gerado', description: 'Download concluído.' })
    }, 1500)
  }

  if (!companyData) return null

  const d = companyData.data?.dados || {}
  const e = companyData.data?.endereco || {}
  const c = companyData.data?.contato || {}
  const f = companyData.data?.financeiro || {}
  const b = companyData.data?.bancario || {}
  const p = c.pessoas || []

  const isPJ = d.tipoPessoa === 'PJ'
  const fullAddress = e.logradouro
    ? `${e.logradouro}, ${e.numero || 'S/N'} - ${e.bairro || ''} - ${e.cidade || ''}/${e.estado || ''} ${e.cep || ''}`
    : ''

  // Fake analytics based on ID
  const seed = companyData.id
    ? parseInt(companyData.id.replace(/\D/g, '').substring(0, 3) || '85')
    : 85
  const finScore = Math.min(1000, Math.max(300, seed * 10))
  const punctuality = Math.min(100, Math.max(50, seed + 10))
  const totalBilled = (seed * 1250).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const accountsRec = (seed * 150).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] w-[95vw] h-[90vh] p-0 overflow-hidden bg-slate-50 border-none rounded-xl shadow-2xl flex flex-col">
        <div className="p-6 bg-white border-b border-slate-200 shrink-0 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 text-blue-900 font-medium text-sm md:absolute md:top-6 md:left-6">
            <Building2 className="w-4 h-4" />{' '}
            {type === 'client' ? 'Ficha do Cliente' : 'Ficha do Fornecedor'}
          </div>
          <div className="flex-1 md:pl-48 w-full">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border border-slate-200 shadow-sm shrink-0 bg-slate-50">
                <AvatarImage src={d.logo || companyData.photo} className="object-contain p-1" />
                <AvatarFallback className="text-xl font-bold bg-blue-50 text-blue-600">
                  {companyData.name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <DialogTitle className="text-2xl font-bold text-slate-800">
                    {companyData.name}
                  </DialogTitle>
                  <Badge
                    className={
                      companyData.status !== 'inativo'
                        ? 'bg-emerald-500 hover:bg-emerald-600'
                        : 'bg-slate-400 hover:bg-slate-500'
                    }
                  >
                    {companyData.status !== 'inativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Badge variant="outline" className="bg-slate-50 font-mono text-slate-500">
                    {d.documento || companyData.document_number || 'Sem Documento'}
                  </Badge>
                </div>
                <DialogDescription className="text-slate-600 font-medium flex flex-wrap gap-2 items-center">
                  <span>{d.segmento || 'Segmento não definido'}</span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1',
                      companyData.compliance_status === 'em_dia'
                        ? 'text-emerald-600 bg-emerald-50'
                        : companyData.compliance_status === 'vencido'
                          ? 'text-rose-600 bg-rose-50'
                          : 'text-amber-600 bg-amber-50',
                    )}
                  >
                    {companyData.compliance_status === 'em_dia' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Compliance OK
                      </>
                    ) : companyData.compliance_status === 'vencido' ? (
                      <>
                        <AlertCircle className="w-3 h-3" /> Compliance Vencido
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" /> Compliance Pendente
                      </>
                    )}
                  </span>
                </DialogDescription>
              </div>
              {companyData.validation_metadata?.errors?.length > 0 && (
                <div className="mt-2 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100 space-y-1 inline-block max-w-lg">
                  {companyData.validation_metadata.errors.map((err: string, i: number) => (
                    <div key={i} className="flex items-start gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-4 md:mt-0 justify-end md:absolute md:top-6 md:right-6">
            <Button
              variant="outline"
              onClick={printDossier}
              className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm font-semibold"
            >
              <Printer className="w-4 h-4 md:mr-2" />{' '}
              <span className="hidden md:inline">Gerar Dossiê</span>
            </Button>
            <Button
              onClick={onEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold"
            >
              <Edit className="w-4 h-4 md:mr-2" />{' '}
              <span className="hidden md:inline">Editar Cadastro</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <Section t="Histórico e Performance" icon={TrendingUp}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <p className="text-xs text-slate-500 mb-1">Score Financeiro</p>
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={cn(
                      'text-lg font-bold',
                      finScore > 700
                        ? 'text-emerald-600'
                        : finScore > 500
                          ? 'text-amber-500'
                          : 'text-rose-500',
                    )}
                  >
                    {finScore}/1000
                  </span>
                  <Progress
                    value={(finScore / 1000) * 100}
                    className={cn(
                      'h-1.5 w-16',
                      finScore > 700 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-amber-500',
                    )}
                  />
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <p className="text-xs text-slate-500 mb-1">Pontualidade</p>
                <p className="text-lg font-bold text-slate-800 flex justify-center items-center gap-1">
                  {punctuality}% <Activity className="w-4 h-4 text-emerald-500" />
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <p className="text-xs text-slate-500 mb-1">Total Faturado</p>
                <p className="text-lg font-bold text-slate-800">{totalBilled}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <p className="text-xs text-slate-500 mb-1">Contas a Receber</p>
                <p className="text-lg font-bold text-slate-800 flex justify-center items-center gap-1">
                  {accountsRec} {seed < 30 && <AlertCircle className="w-4 h-4 text-rose-500" />}
                </p>
              </div>
            </div>
          </Section>

          <Section t="Dados Corporativos" icon={Building2}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Field
                l={isPJ ? 'Razão Social' : 'Nome Completo'}
                v={d.nomeRazao || companyData.name}
              />
              {isPJ && <Field l="Nome Fantasia" v={d.fantasia} />}
              <Field l={isPJ ? 'CNPJ' : 'CPF'} v={d.documento || companyData.document_number} />
              {isPJ && <Field l="Inscrição Estadual" v={d.ie} />}
              <Field
                l="Data de Abertura"
                v={d.dataAbertura ? new Date(d.dataAbertura).toLocaleDateString('pt-BR') : ''}
              />
            </div>
          </Section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section t="Endereço e Localização" icon={MapPin}>
              <div className="space-y-4">
                <Field l="Endereço Completo" v={fullAddress || 'Nenhum endereço cadastrado'} />
                {fullAddress && (
                  <div className="w-full h-[200px] rounded-lg border border-slate-200 overflow-hidden bg-slate-50 relative flex items-center justify-center">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=m&z=15&output=embed&iwloc=near`}
                      title="Mapa do Endereço"
                      className="absolute inset-0"
                    />
                  </div>
                )}
              </div>
            </Section>

            <Section t="Contatos Estratégicos" icon={Phone}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                  <Field
                    l="E-mail Financeiro/Faturamento"
                    v={c.emailCobranca || companyData.email}
                  />
                  <Field l="Telefone Principal" v={c.telefone || companyData.phone} />
                </div>
                {p.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Pessoas de Contato
                    </p>
                    {p.map((pessoa: any, i: number) => (
                      <div
                        key={i}
                        className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold text-sm text-slate-800">{pessoa.nome}</p>
                          <p className="text-xs text-slate-500">{pessoa.cargo}</p>
                        </div>
                        <div className="flex gap-2 text-slate-400">
                          {pessoa.email && (
                            <a href={`mailto:${pessoa.email}`} title={pessoa.email}>
                              <Mail className="w-4 h-4 hover:text-blue-500" />
                            </a>
                          )}
                          {pessoa.telefone && (
                            <a href={`tel:${pessoa.telefone}`} title={pessoa.telefone}>
                              <Phone className="w-4 h-4 hover:text-blue-500" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">
                    Nenhum contato pessoal cadastrado.
                  </p>
                )}
              </div>
            </Section>
          </div>

          <Section t="Parâmetros Financeiros e Bancários" icon={DollarSign}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                <p className="text-xs font-semibold text-blue-700 mb-1">Limite de Crédito</p>
                <p className="text-xl font-bold text-blue-900">
                  {f.limiteCredito ? `R$ ${f.limiteCredito}` : 'Não definido'}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 mb-1">Prazo Padrão</p>
                <p className="text-xl font-bold text-slate-800">
                  {f.prazoPagamento ? `${f.prazoPagamento} dias` : 'À vista'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-3 uppercase">
                  Contas Bancárias
                </p>
                {b.contas?.length > 0 ? (
                  <div className="space-y-2">
                    {b.contas.map((conta: any, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-lg text-sm"
                      >
                        <div>
                          <p className="font-semibold text-slate-700">{conta.banco}</p>
                          <p className="text-xs text-slate-500">{conta.tipo}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-slate-800">Ag: {conta.agencia}</p>
                          <p className="font-mono text-slate-800">CC: {conta.conta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Nenhuma conta cadastrada.</p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 mb-3 uppercase">Chaves PIX</p>
                {b.pix?.length > 0 ? (
                  <div className="space-y-2">
                    {b.pix.map((pix: any, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-lg text-sm"
                      >
                        <span className="text-slate-500 text-xs font-medium">{pix.tipo}</span>
                        <span className="font-mono font-medium text-slate-800">{pix.chave}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Nenhuma chave PIX cadastrada.</p>
                )}
              </div>
            </div>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
