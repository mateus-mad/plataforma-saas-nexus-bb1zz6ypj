import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
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
} from 'lucide-react'

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

const STATS = [
  { val: 'R$ 3.500,00', lbl: 'Salário Base', icon: DollarSign, c: 'text-blue-600' },
  { val: 'Mensalista', lbl: 'Tipo de Contrato', icon: FileText, c: 'text-blue-600' },
  { val: 'R$ 318,82', lbl: 'INSS (9.11%)', icon: Shield, c: 'text-amber-600' },
  { val: 'R$ 280,00', lbl: 'FGTS (8%)', icon: CreditCard, c: 'text-emerald-600' },
  { val: '0d', lbl: 'Não adquiridas', icon: Calendar, c: 'text-purple-600' },
]

const Field = ({ l, v }: { l: string; v: string }) => (
  <div className="space-y-1">
    <p className="text-xs text-slate-500 font-medium">{l}</p>
    <p className="text-sm font-medium text-slate-800">{v}</p>
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

export default function CollaboratorProfileModal({ open, onOpenChange }: Props) {
  const { toast } = useToast()
  const printDoc = () => {
    toast({ title: 'Gerando PDF', description: 'O documento está sendo preparado para impressão.' })
    setTimeout(() => window.print(), 500)
  }

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
                  MA
                </AvatarFallback>
                <AvatarImage src="https://img.usecurling.com/ppl/medium?gender=male&seed=1" />
              </Avatar>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <DialogTitle className="text-2xl font-bold text-slate-800">
                    Mateus amorim dias
                  </DialogTitle>
                  <Badge className="bg-blue-500 text-white hover:bg-blue-600 border-none shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ativo
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-slate-500 border-slate-200 font-mono"
                  >
                    # COL0001
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <DialogDescription className="text-slate-600 font-medium">
                    Engenheiro Civil
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-3 w-full max-w-sm mt-2">
                  <Progress value={45} className="h-2 flex-1 bg-slate-100 [&>div]:bg-blue-500" />
                  <span className="text-xs font-semibold text-blue-600 whitespace-nowrap">
                    45% preenchido
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 justify-end md:absolute md:top-6 md:right-6">
            <Button
              variant="outline"
              onClick={printDoc}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Printer className="w-4 h-4 mr-2" /> Imprimir
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20">
              <Edit className="w-4 h-4 mr-2" /> Editar
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium px-2">
            <span className="flex items-center gap-1.5">
              <Hash className="w-4 h-4" /> CPF: 044.763.243-47
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Admissão: 07/02/2026 (1 mês)
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> 32 anos
            </span>
            <span className="flex items-center gap-1.5">
              <Building className="w-4 h-4" /> engenharia
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {STATS.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all"
              >
                <s.icon className={`w-6 h-6 mb-2 ${s.c}`} />
                <div className="text-lg font-bold text-slate-800 leading-none mb-1">{s.val}</div>
                <div className="text-xs text-slate-500 font-medium">{s.lbl}</div>
              </div>
            ))}
          </div>

          <Section t="Dados Pessoais" icon={User}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Field l="Data de Nascimento" v="20/09/1993" /> <Field l="Gênero" v="Masculino" />
              <Field l="Estado Civil" v="Casado(a)" /> <Field l="Nacionalidade" v="Brasileira" />
              <Field l="Escolaridade" v="Superior Completo" /> <Field l="Tipo Sanguíneo" v="A+" />
              <Field l="Nome da Mãe" v="-" /> <Field l="Nome do Pai" v="-" />
            </div>
          </Section>

          <Section t="Documentos" icon={FileText}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Field l="CPF" v="044.763.243-47" /> <Field l="RG" v="-" />{' '}
              <Field l="PIS/PASEP" v="-" /> <Field l="CTPS" v="-" />
            </div>
          </Section>

          <Section t="Contato" icon={Phone}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Field l="Telefone Principal" v="-" /> <Field l="Telefone Secundário" v="-" />
              <Field l="WhatsApp" v="-" /> <Field l="E-mail" v="-" />
            </div>
          </Section>

          <Section t="Endereço" icon={MapPin}>
            <Field l="Logradouro" v="-" />
          </Section>

          <Section t="Dados Bancários" icon={Building2}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Field l="Banco" v="-" /> <Field l="Agência" v="-" /> <Field l="Conta" v="-" />{' '}
              <Field l="PIX" v="-" />
            </div>
          </Section>

          <Section t="Remuneração e Encargos" icon={DollarSign}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <p className="text-xs text-slate-500 mb-1">Salário Bruto</p>
                <p className="text-lg font-bold text-slate-800">R$ 3.500,00</p>
              </div>
              <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl text-center">
                <p className="text-xs text-rose-600 mb-1">INSS (9.11%)</p>
                <p className="text-lg font-bold text-rose-700">-R$ 318,82</p>
              </div>
              <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl text-center">
                <p className="text-xs text-rose-600 mb-1">IRRF (2.74%)</p>
                <p className="text-lg font-bold text-rose-700">-R$ 95,74</p>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
                <p className="text-xs text-emerald-600 mb-1">FGTS (8%)</p>
                <p className="text-lg font-bold text-emerald-700">R$ 280,00</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center shadow-sm shadow-blue-500/10">
                <p className="text-xs text-blue-700 mb-1">Líquido Estimado</p>
                <p className="text-xl font-bold text-blue-700">R$ 3.085,44</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              * Valores calculados com base nas tabelas INSS/IRRF 2024/2025 (vigência: Janeiro/2024)
            </p>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
