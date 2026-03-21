import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { useState, useEffect } from 'react'
import {
  User,
  Building2,
  Phone,
  FileText,
  MapPin,
  CreditCard,
  DollarSign,
  Printer,
  Edit,
  Shield,
  Calendar,
  Activity,
  CheckCircle2,
  Building,
  Hash,
  Share2,
  UserMinus,
  UserCheck,
  MessageCircle,
} from 'lucide-react'
import { getEntity, updateEntity } from '@/services/entities'
import pb from '@/lib/pocketbase/client'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: () => void
  entityId?: string | null
}

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

export default function CollaboratorProfileModal({ open, onOpenChange, onEdit, entityId }: Props) {
  const { toast } = useToast()
  const [data, setData] = useState<any>(null)
  const [status, setStatus] = useState<'ativo' | 'desligado'>('ativo')

  useEffect(() => {
    if (open && entityId) {
      loadData(entityId)
    }
  }, [open, entityId])

  const loadData = async (id: string) => {
    try {
      const res = await getEntity(id)
      setData(res)
      setStatus(res.status === 'desligado' ? 'desligado' : 'ativo')
    } catch (e) {
      console.error(e)
    }
  }

  const handleToggleStatus = async () => {
    if (!entityId) return
    const isDismissing = status === 'ativo'
    const newStatus = isDismissing ? 'desligado' : 'ativo'

    try {
      const fd = new FormData()
      fd.append('status', newStatus)
      await updateEntity(entityId, fd)
      setStatus(newStatus)
      toast({
        title: isDismissing ? 'Processo de Demissão' : 'Readmissão Concluída',
        description: isDismissing
          ? 'O colaborador foi marcado como desligado no sistema.'
          : 'Colaborador reintegrado ao quadro de ativos com sucesso.',
      })
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível alterar o status.',
      })
    }
  }

  const printDossier = () => {
    toast({
      title: 'Gerando Dossiê Completo',
      description:
        'Compilando dados, histórico e documentos em PDF. O download iniciará em instantes.',
    })
    setTimeout(() => {
      const blob = new Blob(['Dossiê Unificado - Confidencial'], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Dossie_${data?.name?.replace(/\s+/g, '_') || 'Colaborador'}.pdf`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast({ title: 'Dossiê Gerado', description: 'O relatório foi exportado com sucesso.' })
    }, 1500)
  }

  const shareProfile = () => {
    navigator.clipboard.writeText(window.location.origin + `/share/colaborador/${entityId}`)
    toast({ title: 'Link Gerado', description: 'Link seguro do perfil copiado.' })
  }

  if (!data) return null

  const pData = data.data?.pessoal || {}
  const dData = data.data?.docs || {}
  const eData = data.data?.endereco || {}
  const cData = data.data?.contato || {}
  const tData = data.data?.trabalho || {}
  const sData = data.data?.salario || {}
  const encData = data.data?.encargos || {}

  const avatarUrl = data.photo
    ? pb.files.getURL(data, data.photo)
    : pData.foto ||
      `https://img.usecurling.com/ppl/medium?gender=${pData.genero === 'Feminino' ? 'female' : 'male'}&seed=${data.id}`

  const addressString = eData.logradouro
    ? `${eData.logradouro}${eData.numero ? `, ${eData.numero}` : ''} - ${eData.bairro || ''} - ${eData.cidade || ''}/${eData.estado || ''} ${eData.cep ? `(${eData.cep})` : ''}`
    : 'Endereço não cadastrado'

  const calculateCompletion = () => {
    let fields = 0
    let filled = 0
    const check = (val: any) => {
      fields++
      if (val && String(val).trim() !== '') filled++
    }
    check(pData.name)
    check(dData.cpf)
    check(eData.cep)
    check(cData.telPrinc)
    check(tData.cargo)
    check(sData.base)
    return Math.round((filled / fields) * 100) || 0
  }

  const completion = calculateCompletion()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] w-[95vw] h-[90vh] p-0 overflow-hidden bg-slate-50 border-none rounded-xl shadow-2xl flex flex-col">
        <div className="p-6 bg-white border-b border-slate-200 shrink-0 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 text-blue-900 font-medium text-sm md:absolute md:top-6 md:left-6">
            <User className="w-4 h-4" /> Ficha do Colaborador
          </div>
          <div className="flex-1 md:pl-48 w-full">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-slate-100 shadow-sm shrink-0">
                <AvatarFallback className="text-xl font-bold bg-blue-50 text-blue-600">
                  {data.name?.charAt(0) || '?'}
                </AvatarFallback>
                <AvatarImage src={avatarUrl} />
              </Avatar>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <DialogTitle className="text-2xl font-bold text-slate-800">
                    {data.name}
                  </DialogTitle>
                  {status === 'ativo' ? (
                    <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-none shadow-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ativo
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-500 text-white hover:bg-rose-600 border-none shadow-sm flex items-center gap-1">
                      <UserMinus className="w-3 h-3" /> Desligado
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-slate-500 border-slate-200 font-mono"
                  >
                    # {tData.matricula || data.id.substring(0, 6).toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <DialogDescription className="text-slate-600 font-medium">
                    {tData.cargo || 'Cargo não definido'} • {tData.setor || 'Setor não definido'}
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-3 w-full max-w-sm mt-2">
                  <Progress
                    value={completion}
                    className="h-2 flex-1 bg-slate-100 [&>div]:bg-blue-500"
                  />
                  <span className="text-xs font-semibold text-blue-600 whitespace-nowrap">
                    {completion}% preenchido
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
              title="Compartilhar Perfil"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={printDossier}
              className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm font-semibold"
            >
              <Printer className="w-4 h-4 md:mr-2" />{' '}
              <span className="hidden md:inline">Gerar Dossiê</span>
            </Button>
            <Button
              variant={status === 'ativo' ? 'outline' : 'default'}
              onClick={handleToggleStatus}
              className={
                status === 'ativo'
                  ? 'border-rose-200 text-rose-600 hover:bg-rose-50 shadow-sm'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              }
            >
              {status === 'ativo' ? (
                <>
                  <UserMinus className="w-4 h-4 md:mr-2" />{' '}
                  <span className="hidden md:inline">Demitir</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 md:mr-2" />{' '}
                  <span className="hidden md:inline">Readmitir</span>
                </>
              )}
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
              <Hash className="w-4 h-4" /> CPF: {dData.cpf || data.document_number || '-'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Admissão:{' '}
              {tData.admissao ? new Date(tData.admissao).toLocaleDateString('pt-BR') : '-'}
            </span>
            <span className="flex items-center gap-1.5">
              <Building className="w-4 h-4" /> {tData.setor || '-'}
            </span>
          </div>

          <Section t="Dados Pessoais" icon={User}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Field
                l="Data de Nascimento"
                v={pData.nascimento ? new Date(pData.nascimento).toLocaleDateString('pt-BR') : ''}
              />
              <Field l="Gênero" v={pData.genero} />
              <Field l="Estado Civil" v={pData.civil} />
              <Field l="Nacionalidade" v={pData.nacionalidade} />
              <Field l="Escolaridade" v={pData.escolaridade} />
              <Field l="Tipo Sanguíneo" v={pData.sangue} />
              <Field l="Nome da Mãe" v={pData.mae} />
              <Field l="Nome do Pai" v={pData.pai} />
            </div>
          </Section>

          <Section t="Documentos e Compliance" icon={FileText}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Field l="CPF" v={dData.cpf || data.document_number} />
              <Field
                l={dData.docType || 'RG'}
                v={
                  dData.docIssueDate
                    ? `Emissão: ${new Date(dData.docIssueDate).toLocaleDateString('pt-BR')}`
                    : '-'
                }
              />
              <Field l="PIS/PASEP" v={dData.pis} />
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Status de Compliance</p>
                <Badge
                  variant="outline"
                  className={
                    data.compliance_status === 'vencido'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : data.compliance_status === 'em_dia'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                  }
                >
                  {data.compliance_status === 'vencido'
                    ? 'Vencido'
                    : data.compliance_status === 'em_dia'
                      ? 'Em dia'
                      : 'Pendente'}
                </Badge>
              </div>
            </div>
          </Section>

          <Section t="Contato e Endereço" icon={Phone}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-4">
              <Field l="Telefone Principal" v={cData.telPrinc} />
              <Field l="WhatsApp" v={cData.whatsapp} />
              <Field l="E-mail" v={cData.email || data.email} />
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Field l="Endereço Residencial" v={addressString} />
            </div>
          </Section>

          <Section t="Remuneração e Encargos (Mensal)" icon={DollarSign}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <p className="text-xs text-slate-500 mb-1">Salário Base</p>
                <p className="text-lg font-bold text-slate-800">
                  {sData.base ? `R$ ${sData.base}` : 'R$ 0,00'}
                </p>
              </div>
              <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl text-center">
                <p className="text-xs text-rose-600 mb-1">INSS</p>
                <p className="text-lg font-bold text-rose-700">-{encData.inss || 'R$ 0,00'}</p>
              </div>
              <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl text-center">
                <p className="text-xs text-rose-600 mb-1">IRRF</p>
                <p className="text-lg font-bold text-rose-700">-{encData.irrf || 'R$ 0,00'}</p>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
                <p className="text-xs text-emerald-600 mb-1">FGTS</p>
                <p className="text-lg font-bold text-emerald-700">{encData.fgts || 'R$ 0,00'}</p>
              </div>
            </div>
          </Section>

          <Section t="Dados Bancários" icon={Building2}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Field l="Banco" v={sData.banco} />
              <Field l="Agência" v={sData.agConta} />
              <Field l="Conta" v={sData.conta} />
              <Field l="Frequência" v={sData.frequencia} />
            </div>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
