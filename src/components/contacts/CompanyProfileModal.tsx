import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
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
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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
        {/* Header Bar */}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Profile Hero Block */}
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

          {isClient && (
            <div className="text-sm text-slate-500 font-medium flex items-center gap-2 px-2">
              <User className="w-4 h-4" /> Nascimento: 20/08/2000
            </div>
          )}

          {/* Stats Row */}
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
                <div className="text-2xl font-bold text-blue-700 leading-none mb-1">0</div>
                <p className="text-xs text-slate-500 font-medium">Contratos Ativos</p>
                <p className="text-[10px] text-slate-400 mt-0.5">0 total</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200 bg-white">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <ThumbsUp className="w-8 h-8 text-emerald-500 mb-2" />
                <div className="text-2xl font-bold text-emerald-600 leading-none mb-1">0</div>
                <p className="text-xs text-slate-500 font-medium">Pagos no Prazo</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200 bg-white">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <ThumbsDown className="w-8 h-8 text-rose-500 mb-2" />
                <div className="text-2xl font-bold text-rose-600 leading-none mb-1">0%</div>
                <p className="text-xs text-slate-500 font-medium">Pagos c/ Atraso</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200 bg-white">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <Timer className="w-8 h-8 text-emerald-500 mb-2" />
                <p className="text-sm font-bold text-slate-800 mb-0.5">Antecipado</p>
                <p className="text-xs text-slate-500 font-medium">Prazo Médio</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200 bg-white">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <DollarSign className="w-8 h-8 text-blue-500 mb-2" />
                <div className="text-lg font-bold text-blue-700 leading-none mb-1 whitespace-nowrap">
                  R$ 0,00
                </div>
                <p className="text-xs text-slate-500 font-medium leading-tight">Valor Contratos</p>
              </CardContent>
            </Card>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm border-slate-200 bg-white">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-blue-900 font-semibold text-sm">
                <User className="w-4 h-4 text-blue-500" /> Identificação
              </div>
              <CardContent className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Tipo:</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {isClient ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">{isClient ? 'CPF:' : 'CNPJ:'}</p>
                  <p className="text-sm font-semibold text-slate-800">-</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Gênero:</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {isClient ? 'Masculino' : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    {isClient ? 'Data de Nascimento:' : 'Fundação:'}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {isClient ? '20/08/2000' : '-'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-white">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-blue-900 font-semibold text-sm">
                <MapPin className="w-4 h-4 text-blue-500" /> Endereço
              </div>
              <CardContent className="p-6 flex items-center justify-center text-slate-400 italic text-sm h-[calc(100%-53px)]">
                {companyData?.location || 'Endereço não cadastrado'}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-white">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-blue-900 font-semibold text-sm">
                <MessageCircle className="w-4 h-4 text-blue-500" /> Contato
              </div>
              <CardContent className="p-6 space-y-4">
                <a
                  href="#"
                  className="flex items-center gap-2 text-emerald-600 font-medium text-sm hover:underline w-fit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                  </svg>
                  (89) 99457-8033 <ExternalLinkIcon />
                </a>
                <p className="text-slate-400 italic text-sm">Contato não cadastrado</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-white">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-blue-900 font-semibold text-sm">
                <Building2 className="w-4 h-4 text-blue-500" /> Pessoa de Contato (Relacionamento)
              </div>
              <CardContent className="p-6 flex items-center justify-center text-slate-400 italic text-sm h-[calc(100%-53px)]">
                Nenhuma pessoa de contato cadastrada
              </CardContent>
            </Card>
          </div>

          {/* Finance Row */}
          <Card className="shadow-sm border-slate-200 bg-white">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-blue-900 font-semibold text-sm">
              <DollarSign className="w-4 h-4 text-blue-500" /> Dados Financeiros
            </div>
            <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Prazo Pagamento:</p>
                <p className="text-sm font-bold text-slate-800">30 dias</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Limite de Crédito:</p>
                <p className="text-sm font-bold text-slate-800">Não definido</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Faturado:</p>
                <p className="text-sm font-bold text-slate-800">R$ 0,00</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Recebido:</p>
                <p className="text-sm font-bold text-emerald-600">R$ 0,00</p>
              </div>
            </CardContent>
          </Card>

          {/* Relations Row */}
          <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4 px-1">
              <History className="w-5 h-5 text-slate-400" /> Análise de Relacionamento
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Card className="shadow-sm border-slate-200 bg-white">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">
                      Total Vendido
                    </p>
                    <p className="text-lg font-bold text-slate-800 leading-none">R$ 0,00</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200 bg-white">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">
                      Recebido
                    </p>
                    <p className="text-lg font-bold text-emerald-600 leading-none">R$ 0,00</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200 bg-white">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Timer className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">
                      A Vencer
                    </p>
                    <p className="text-lg font-bold text-amber-600 leading-none">R$ 0,00</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200 bg-white">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">
                      Vencido
                    </p>
                    <p className="text-lg font-bold text-rose-600 leading-none">R$ 0,00</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200 bg-white">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">
                      Transações
                    </p>
                    <p className="text-lg font-bold text-blue-700 leading-none">0</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="opacity-70"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
)
