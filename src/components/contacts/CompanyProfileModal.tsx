import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Users,
  Truck,
  FileText,
  Printer,
  Edit,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Timer,
  DollarSign,
  User,
  MapPin,
  MessageCircle,
  Building2,
  TrendingUp,
  History,
  AlertTriangle,
  Receipt,
  FileSignature,
  Paperclip,
  Download,
  Eye,
  Phone,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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
  type,
  companyData,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onEdit: () => void
  type: 'client' | 'supplier'
  companyData?: any
}) {
  const { toast } = useToast()

  const printDoc = () => {
    toast({ title: 'Gerando PDF', description: 'O documento será baixado em instantes.' })
    setTimeout(() => {
      const blob = new Blob(['Ficha Completa'], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Ficha_${type}.pdf`
      a.click()
    }, 1500)
  }

  const isClient = type === 'client'
  const titleIcon = isClient ? (
    <Users className="w-5 h-5 text-blue-500" />
  ) : (
    <Truck className="w-5 h-5 text-amber-500" />
  )
  const titleText = isClient ? 'Ficha do Cliente' : 'Ficha do Fornecedor'
  const defaultName = companyData?.name || 'teste'
  const defaultAvatar = companyData?.avatar || ''
  const defaultInitial = defaultName.charAt(0).toUpperCase()
  const isComplete = companyData?.progress === 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] w-[95vw] p-0 bg-slate-50 border-none shadow-2xl rounded-2xl flex flex-col max-h-[95vh] overflow-hidden [&>button]:hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-slate-200 shrink-0 relative z-10">
          <div className="flex items-center gap-2 font-semibold text-slate-800 text-lg">
            {titleIcon} {titleText}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={printDoc}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 hidden sm:flex"
            >
              <FileText className="w-4 h-4 mr-2" /> Gerar Documento
            </Button>
            <Button
              variant="outline"
              onClick={printDoc}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700"
            >
              <Printer className="w-4 h-4 sm:mr-2" />{' '}
              <span className="hidden sm:inline">Imprimir</span>
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false)
                onEdit()
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Edit className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Editar</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm">
            <Avatar className="w-24 h-24 border border-blue-100 shadow-sm bg-blue-50 shrink-0">
              <AvatarImage src={defaultAvatar} className="object-contain p-2" />
              <AvatarFallback className="text-3xl font-light text-blue-600">
                {defaultInitial}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{defaultName}</h1>
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none shadow-sm px-2.5">
                  Ativo
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-slate-50 text-slate-600 border-slate-200 font-medium"
                >
                  {isClient ? 'Pessoa Física' : 'Pessoa Jurídica'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 ${isComplete ? 'text-emerald-600' : 'text-amber-600'} font-semibold text-sm bg-slate-50 px-2 py-0.5 rounded-md w-fit`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  {companyData?.progress || '100'}% {isComplete ? 'Excelente' : 'Incompleto'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="shadow-sm border-slate-200 bg-white">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-600 font-bold text-lg mb-2">
                  100
                </div>
                <p className="text-xs text-slate-500 font-medium mb-0.5">Confiabilidade</p>
                <p className="text-sm font-bold text-emerald-600">Excelente</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200 bg-white">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <FileText className="w-8 h-8 text-blue-500 mb-2" />
                <div className="text-2xl font-bold text-blue-700 leading-none mb-1">2</div>
                <p className="text-xs text-slate-500 font-medium">Contratos Ativos</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200 bg-white">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <ThumbsUp className="w-8 h-8 text-emerald-500 mb-2" />
                <div className="text-2xl font-bold text-emerald-600 leading-none mb-1">98%</div>
                <p className="text-xs text-slate-500 font-medium">Pagos no Prazo</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200 bg-white">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <ThumbsDown className="w-8 h-8 text-rose-500 mb-2" />
                <div className="text-2xl font-bold text-rose-600 leading-none mb-1">2%</div>
                <p className="text-xs text-slate-500 font-medium">Pagos c/ Atraso</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200 bg-white">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <Timer className="w-8 h-8 text-emerald-500 mb-2" />
                <p className="text-sm font-bold text-slate-800 mb-0.5">Em dia</p>
                <p className="text-xs text-slate-500 font-medium">Prazo Médio</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200 bg-white">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <DollarSign className="w-8 h-8 text-blue-500 mb-2" />
                <div className="text-lg font-bold text-blue-700 leading-none mb-1 whitespace-nowrap">
                  R$ 25k
                </div>
                <p className="text-xs text-slate-500 font-medium leading-tight">Valor Contratos</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm border-slate-200 bg-white">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-blue-900 font-semibold text-sm">
                <User className="w-4 h-4 text-blue-500" /> Identificação
              </div>
              <CardContent className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Tipo:</p>
                  <p className="text-sm font-semibold text-slate-800">Pessoa Jurídica</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">CNPJ:</p>
                  <p className="text-sm font-semibold text-slate-800">12.345.678/0001-90</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Inscrição Estadual:</p>
                  <p className="text-sm font-semibold text-slate-800">111.222.333.444</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Inscrição Municipal:</p>
                  <p className="text-sm font-semibold text-slate-800">98765432</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-white">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-blue-900 font-semibold text-sm">
                <MapPin className="w-4 h-4 text-blue-500" /> Endereço
              </div>
              <CardContent className="p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-800">Praça da Sé, 123</p>
                  <p className="text-sm text-slate-600">Sé, São Paulo - SP</p>
                  <p className="text-xs text-slate-500 mt-2">CEP: 01001-000</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-white">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-blue-900 font-semibold text-sm">
                <MessageCircle className="w-4 h-4 text-blue-500" /> Contato Comercial
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">João Gestor</p>
                    <p className="text-xs text-slate-500">Diretor Comercial</p>
                  </div>
                </div>
                <div className="pt-2 space-y-2">
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" /> (11) 3333-3333
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-500" /> (11) 99999-9999
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-white">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-blue-900 font-semibold text-sm">
                <DollarSign className="w-4 h-4 text-blue-500" /> Resumo Financeiro
              </div>
              <CardContent className="p-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Prazo Pagamento:</p>
                  <p className="text-sm font-bold text-slate-800">30 dias</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Limite de Crédito:</p>
                  <p className="text-sm font-bold text-slate-800">R$ 50.000,00</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Total Faturado:</p>
                  <p className="text-sm font-bold text-slate-800">R$ 125.000,00</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <p className="text-xs text-emerald-700 mb-1">Total Recebido:</p>
                  <p className="text-sm font-bold text-emerald-700">R$ 112.500,00</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {isClient && (
            <>
              <Section t="Histórico Completo (Contas a Receber)" icon={Receipt}>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Fatura / Ref.</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium text-slate-800">15/04/2026</TableCell>
                        <TableCell className="text-slate-600">FAT-2026-042</TableCell>
                        <TableCell className="font-semibold text-slate-800">R$ 12.500,00</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none shadow-none">
                            Pago
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-slate-800">15/05/2026</TableCell>
                        <TableCell className="text-slate-600">FAT-2026-055</TableCell>
                        <TableCell className="font-semibold text-slate-800">R$ 12.500,00</TableCell>
                        <TableCell>
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none shadow-none">
                            Pendente
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </Section>

              <Section t="Contratos Firmados" icon={FileSignature}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <FileSignature className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          Contrato de Manutenção
                        </p>
                        <p className="text-xs text-slate-500">
                          Assinado em: 10/01/2025 • Validade: 12 meses
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none shadow-none">
                      Ativo
                    </Badge>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-lg flex items-center justify-center shrink-0">
                        <FileSignature className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Serviço Pontual</p>
                        <p className="text-xs text-slate-500">
                          Finalizado em: 05/12/2024 • Instalação
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none shadow-none">
                      Encerrado
                    </Badge>
                  </div>
                </div>
              </Section>

              <Section t="Documentos Anexados" icon={Paperclip}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="shrink-0">
                      <FileText className="w-8 h-8 text-rose-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800 truncate">
                        Cartão_CNPJ.pdf
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">245 KB • Anexado há 2 dias</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="shrink-0">
                      <FileText className="w-8 h-8 text-rose-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800 truncate">
                        Contrato_Assinado_2025.pdf
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">1.2 MB • Anexado há 1 mês</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Section>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
