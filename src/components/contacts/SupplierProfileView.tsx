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
  TrendingUp,
  AlertTriangle,
  Star,
  Clock,
  ShieldCheck,
  FileSignature,
} from 'lucide-react'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: () => void
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

export default function SupplierProfileView({ open, onOpenChange, onEdit, companyData }: Props) {
  const { toast } = useToast()

  const printDossier = () => {
    toast({
      title: 'Gerando Dossiê do Fornecedor',
      description: 'Compilando dados, histórico financeiro e performance.',
    })
    setTimeout(() => {
      const blob = new Blob(['Dossiê Unificado - Fornecedor'], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Dossie_${companyData?.name?.replace(/\s+/g, '_') || 'Fornecedor'}.pdf`
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
  const a = companyData.data?.acordos?.lista || []

  // Fake analytics based on ID
  const seed = companyData.id
    ? parseInt(companyData.id.replace(/\D/g, '').substring(0, 3) || '50')
    : 50
  const premiumScore = Math.min(100, Math.max(0, seed))
  const ticketMedio = (seed * 150).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const atrasoMedio = Math.floor(seed / 10)
  const agreementsCount = a.filter((ac: any) => ac.ativo).length

  const isPJ = d.tipoPessoa === 'PJ'
  const fullAddress = e.logradouro
    ? `${e.logradouro}, ${e.numero || 'S/N'} - ${e.bairro || ''} - ${e.cidade || ''}/${e.estado || ''} ${e.cep || ''}`
    : ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] w-[95vw] h-[90vh] p-0 overflow-hidden bg-slate-50 border-none rounded-xl shadow-2xl flex flex-col">
        <div className="p-6 bg-white border-b border-slate-200 shrink-0 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 text-blue-900 font-medium text-sm md:absolute md:top-6 md:left-6">
            <Building2 className="w-4 h-4" /> Ficha do Fornecedor
          </div>
          <div className="flex-1 md:pl-48 w-full">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border border-slate-200 shadow-sm shrink-0 bg-slate-50">
                <AvatarImage src={d.logo || companyData.photo} className="object-contain p-1" />
                <AvatarFallback className="text-xl font-bold bg-amber-100 text-amber-700">
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
                <div className="flex items-center gap-4">
                  <span className="text-slate-600 font-medium text-sm">
                    {d.segmento || 'Segmento não definido'}
                  </span>
                  {d.complianceStatus === 'valid' && (
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3 h-3" /> Fornecedor Homologado
                    </span>
                  )}
                </div>
              </div>
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
              className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm font-semibold"
            >
              <Edit className="w-4 h-4 md:mr-2" />{' '}
              <span className="hidden md:inline">Editar Fornecedor</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-0.5">Premium Score</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-800">{premiumScore}/100</span>
                  <Progress value={premiumScore} className="w-12 h-1.5 [&>div]:bg-amber-500" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-0.5">Ticket Médio</p>
                <p className="text-lg font-bold text-slate-800">{ticketMedio}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-0.5">Atraso Médio</p>
                <p className="text-lg font-bold text-slate-800 flex items-center gap-1">
                  {atrasoMedio} dias{' '}
                  {atrasoMedio > 5 && <AlertTriangle className="w-4 h-4 text-rose-500 ml-1" />}
                </p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <FileSignature className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-0.5">Acordos Ativos</p>
                <p className="text-lg font-bold text-slate-800">{agreementsCount} Contratos</p>
              </div>
            </div>
          </div>

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
            <Section t="Localização Sede/CD" icon={MapPin}>
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
                      title="Mapa do Fornecedor"
                      className="absolute inset-0"
                    />
                  </div>
                )}
              </div>
            </Section>

            <Section t="Contatos Comerciais" icon={Phone}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                  <Field l="E-mail Central" v={c.emailCobranca || companyData.email} />
                  <Field l="Telefone Principal" v={c.telefone || companyData.phone} />
                </div>
                {p.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Representantes
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
                              <Mail className="w-4 h-4 hover:text-amber-600" />
                            </a>
                          )}
                          {pessoa.telefone && (
                            <a href={`tel:${pessoa.telefone}`} title={pessoa.telefone}>
                              <Phone className="w-4 h-4 hover:text-amber-600" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">Nenhum representante cadastrado.</p>
                )}
              </div>
            </Section>
          </div>

          <Section t="Dados para Pagamento" icon={DollarSign}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
                <p className="text-xs font-semibold text-amber-700 mb-1">Prazo Padrão Negociado</p>
                <p className="text-xl font-bold text-amber-900">
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
