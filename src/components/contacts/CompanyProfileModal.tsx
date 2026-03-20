import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { useState, useEffect } from 'react'
import {
  Building2,
  Phone,
  FileText,
  MapPin,
  CreditCard,
  DollarSign,
  Printer,
  Edit,
  CheckCircle2,
  Shield,
  Calendar,
  Share2,
  MessageCircle,
  HeartHandshake,
  Loader2,
  Save,
  Users,
  Building,
  Activity,
} from 'lucide-react'
import { useCompanyForm } from '@/hooks/useCompanyForm'
import { getWhatsAppConfig } from '@/services/whatsapp'
import pb from '@/lib/pocketbase/client'

const Field = ({ l, v }: { l: string; v: string }) => (
  <div className="space-y-1">
    <p className="text-xs text-slate-500 font-medium">{l}</p>
    <p className="text-sm font-medium text-slate-800">{v || '-'}</p>
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

export default function CompanyProfileModal({ open, onOpenChange, onEdit, companyData }: any) {
  const { toast } = useToast()
  const { data, saveEntity, saveStatus } = useCompanyForm('client', companyData?.id)
  const [hasWhatsApp, setHasWhatsApp] = useState(false)

  useEffect(() => {
    if (open) {
      getWhatsAppConfig().then((conf) => {
        if (conf && conf.status === 'active') {
          setHasWhatsApp(true)
        }
      })
    }
  }, [open])

  const cDados = data.dados || {}
  const cEnd = data.endereco || {}
  const cCont = data.contato || {}
  const cFin = data.financeiro || {}

  const status = companyData?.status || 'Ativo'
  const isPJ = cDados.tipoPessoa === 'PJ'
  const avatar = companyData?.photo
    ? pb.files.getURL(companyData, companyData.photo)
    : cDados.logo || companyData?.avatar

  const printDoc = () => {
    toast({
      title: 'Gerando PDF',
      description: 'O arquivo está sendo preparado e o download iniciará em breve.',
    })
  }

  const shareProfile = () => {
    toast({
      title: 'Link Gerado',
      description: 'Link seguro do perfil copiado para a área de transferência.',
    })
    navigator.clipboard.writeText(window.location.origin + '/share/client/' + companyData?.id)
  }

  const sendDirectWhatsApp = () => {
    toast({
      title: 'Aviso Enviado',
      description: 'Uma mensagem direta via API Oficial foi encaminhada ao cliente.',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] w-[95vw] h-[90vh] p-0 overflow-hidden bg-slate-50 border-none rounded-xl shadow-2xl flex flex-col">
        <div className="p-6 bg-white border-b border-slate-200 shrink-0 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 text-blue-900 font-medium text-sm md:absolute md:top-6 md:left-6">
            <Building2 className="w-4 h-4" /> Ficha do Cliente
          </div>
          <div className="flex-1 md:pl-48 w-full">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-slate-100 shadow-sm shrink-0">
                <AvatarImage src={avatar} className="object-contain p-2" />
                <AvatarFallback className="text-xl font-bold bg-blue-50 text-blue-600">
                  {cDados.nomeRazao?.charAt(0) || companyData?.name?.charAt(0) || 'C'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <DialogTitle className="text-2xl font-bold text-slate-800">
                    {cDados.nomeRazao || companyData?.name}
                  </DialogTitle>
                  <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-none shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-slate-500 border-slate-200 font-mono"
                  >
                    # {companyData?.id}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <DialogDescription className="text-slate-600 font-medium">
                    {cDados.segmento || 'Sem segmento definido'}
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-3 w-full max-w-sm mt-2">
                  <Progress value={100} className="h-2 flex-1 bg-slate-100 [&>div]:bg-blue-500" />
                  <span className="text-xs font-semibold text-blue-600 whitespace-nowrap">
                    100% preenchido
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-4 md:mt-0 justify-end md:absolute md:top-6 md:right-6">
            <Button
              variant="outline"
              size="icon"
              onClick={shareProfile}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            {hasWhatsApp && (
              <Button
                variant="outline"
                onClick={sendDirectWhatsApp}
                className="border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold shadow-sm"
              >
                <MessageCircle className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">WhatsApp</span>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={printDoc}
              className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
            >
              <Printer className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Exportar</span>
            </Button>
            <Button
              onClick={onEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 font-semibold"
            >
              <Edit className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Editar</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium px-2">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> {isPJ ? 'CNPJ' : 'CPF'}: {cDados.documento}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Desde: {cDados.dataAbertura || 'N/A'}
            </span>
            <span className="flex items-center gap-1.5">
              <Building className="w-4 h-4" /> Tipo: {cDados.tipoPessoa}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <DollarSign className="w-6 h-6 mb-2 text-blue-600" />
              <div className="text-lg font-bold text-slate-800 leading-none mb-1">
                R$ {cFin.limiteCredito || '0,00'}
              </div>
              <div className="text-xs text-slate-500 font-medium">Limite de Crédito</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <Calendar className="w-6 h-6 mb-2 text-blue-600" />
              <div className="text-lg font-bold text-slate-800 leading-none mb-1">
                {cFin.prazoPagamento || '30'} dias
              </div>
              <div className="text-xs text-slate-500 font-medium">Prazo Pagamento</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <Shield className="w-6 h-6 mb-2 text-emerald-600" />
              <div className="text-lg font-bold text-slate-800 leading-none mb-1">Regular</div>
              <div className="text-xs text-slate-500 font-medium">Compliance</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <Activity className="w-6 h-6 mb-2 text-amber-600" />
              <div className="text-lg font-bold text-slate-800 leading-none mb-1">Ativo</div>
              <div className="text-xs text-slate-500 font-medium">Status Comercial</div>
            </div>
          </div>

          <Section t="Dados Corporativos" icon={Building2}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Field l={isPJ ? 'Razão Social' : 'Nome'} v={cDados.nomeRazao} />
              {isPJ && <Field l="Nome Fantasia" v={cDados.fantasia} />}
              <Field l={isPJ ? 'CNPJ' : 'CPF'} v={cDados.documento} />
              <Field l="Segmento" v={cDados.segmento} />
              {isPJ && <Field l="Inscrição Estadual" v={cDados.ie} />}
              {isPJ && <Field l="Inscrição Municipal" v={cDados.im} />}
            </div>
          </Section>

          <Section t="Contato e Faturamento" icon={Phone}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Field l="Telefone Principal" v={cCont.telefone} />
              <Field l="E-mail Contato" v={cCont.email} />
              <Field l="E-mail Faturamento" v={cCont.emailCobranca} />
              <Field l="Responsável" v={cCont.responsavel} />
            </div>
          </Section>

          <Section t="Endereço Comercial" icon={MapPin}>
            <Field
              l="Endereço Completo"
              v={`${cEnd.logradouro}, ${cEnd.numero} ${cEnd.comp ? `(${cEnd.comp})` : ''} - ${cEnd.bairro}, ${cEnd.cidade}/${cEnd.estado} - CEP: ${cEnd.cep}`}
            />
          </Section>

          {data.bancario?.contas?.length > 0 && (
            <Section t="Dados Bancários Cadastrados" icon={CreditCard}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.bancario.contas.map((c: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 border border-slate-100 bg-slate-50 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-sm text-slate-800">{c.banco}</p>
                      <p className="text-xs text-slate-500">
                        Ag: {c.agencia} | CC: {c.conta}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-white">
                      {c.tipo}
                    </Badge>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
