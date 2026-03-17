import { DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  FileText,
  Printer,
  Edit,
  X,
  Activity,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Handshake,
  DollarSign,
  History,
  TrendingUp,
  Clock,
  AlertTriangle,
  ShoppingCart,
  Timer,
  Calendar,
  User,
  Phone,
  MapPin,
  CreditCard,
  FileSignature,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const KPICard = ({ icon: Icon, title, value, sub, iconClass, textClass }: any) => (
  <Card className="shadow-sm border-slate-200 rounded-xl">
    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
      <div className="w-8 h-8 flex items-center justify-center mb-2">
        {value ? (
          <span className={cn('font-bold text-lg', textClass)}>{value}</span>
        ) : (
          <Icon className={cn('w-6 h-6', iconClass)} />
        )}
      </div>
      <p className="text-[11px] text-slate-500 font-medium leading-tight">{title}</p>
      <p className={cn('text-xs font-semibold mt-0.5', textClass)}>{sub}</p>
    </CardContent>
  </Card>
)

const RelCard = ({ icon: Icon, title, value, iconClass, bgClass, valClass }: any) => (
  <Card className="shadow-sm border-slate-200 rounded-xl">
    <CardContent className="p-4 flex items-center gap-3">
      <div
        className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', bgClass)}
      >
        <Icon className={cn('w-4 h-4', iconClass)} />
      </div>
      <div>
        <p className="text-[10px] text-slate-500 font-medium">{title}</p>
        <p className={cn('text-sm font-bold', valClass || 'text-slate-800')}>{value}</p>
      </div>
    </CardContent>
  </Card>
)

export default function SupplierProfileView({ onOpenChange, onEdit, companyData }: any) {
  const { toast } = useToast()

  const printDoc = () => {
    toast({ title: 'Gerando PDF', description: 'O documento será baixado em instantes.' })
    setTimeout(() => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob(['Ficha'], { type: 'application/pdf' }))
      a.download = `Ficha_Fornecedor.pdf`
      a.click()
    }, 1500)
  }

  const defaultName = companyData?.name || 'DIRECAO GERAL'
  const defaultInitial = defaultName.substring(0, 2).toUpperCase()
  const plusPattern =
    "url(\"data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 8V16M8 12H16' stroke='white' stroke-opacity='0.2' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")"

  return (
    <DialogContent className="max-w-[1200px] w-[95vw] h-[90vh] p-0 bg-slate-50 border-none shadow-2xl rounded-2xl flex flex-col overflow-hidden [&>button]:hidden">
      <div
        className="relative bg-blue-500 overflow-hidden shrink-0 h-[140px]"
        style={{ backgroundImage: plusPattern }}
      >
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button
            variant="secondary"
            className="bg-white/20 text-white hover:bg-white/30 border-none h-8 text-xs font-semibold shadow-none"
          >
            <FileText className="w-3.5 h-3.5 mr-2" /> Gerar Documento
          </Button>
          <Button
            variant="secondary"
            className="bg-white/20 text-white hover:bg-white/30 border-none h-8 text-xs font-semibold shadow-none"
            onClick={printDoc}
          >
            <Printer className="w-3.5 h-3.5 mr-2" /> Imprimir
          </Button>
          <Button
            variant="secondary"
            className="bg-white/20 text-white hover:bg-white/30 border-none h-8 text-xs font-semibold shadow-none"
            onClick={() => {
              onOpenChange(false)
              onEdit()
            }}
          >
            <Edit className="w-3.5 h-3.5 mr-2" /> Editar
          </Button>
          <button
            onClick={() => onOpenChange(false)}
            className="text-white/70 hover:text-white p-1 ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-6 md:px-8 relative flex-1 overflow-y-auto pb-10 custom-scrollbar">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-[4.5rem] mb-6">
          <div className="relative">
            <div className="w-[120px] h-[120px] rounded-full bg-slate-50 border-[6px] border-white shadow-sm flex items-center justify-center text-4xl font-medium text-blue-600">
              {defaultInitial}
            </div>
            <div className="absolute bottom-3 right-3 w-4 h-4 bg-emerald-500 border-[2px] border-white rounded-full shadow-sm"></div>
          </div>
          <div className="flex-1 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
                  {defaultName}
                </h1>
                <Badge className="bg-emerald-50/50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 shadow-none font-medium h-6">
                  <Activity className="w-3 h-3 mr-1.5" /> 100% Excelente
                </Badge>
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white shadow-none font-medium h-6">
                  Ativo
                </Badge>
              </div>
              <p className="text-slate-500 text-sm mt-1 uppercase font-medium">
                {companyData?.documento || 'BANCO DO BRASIL SA'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <KPICard
              title="Confiabilidade"
              value="100"
              sub="Excelente"
              textClass="text-emerald-600"
            />
            <KPICard
              title="Contratos Ativos"
              icon={FileSignature}
              sub="0 total"
              iconClass="text-blue-600"
              textClass="text-slate-400"
            />
            <KPICard
              title="Entregas no Prazo"
              icon={ThumbsUp}
              sub="1 antecipado"
              iconClass="text-emerald-600"
              textClass="text-emerald-600"
            />
            <KPICard
              title="Entregas c/ Atraso"
              icon={ThumbsDown}
              sub="0%"
              iconClass="text-rose-500"
              textClass="text-slate-400"
            />
            <KPICard
              title="Acordos Ativos"
              icon={Handshake}
              sub="0 total"
              iconClass="text-purple-600"
              textClass="text-slate-400"
            />
            <KPICard
              title="Valor Contratos"
              icon={DollarSign}
              sub="R$ 0,00"
              iconClass="text-blue-600"
              textClass="text-blue-600"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-blue-600" /> Análise de Relacionamento
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
              <RelCard
                title="Total Compras"
                value="R$ 20,00"
                icon={DollarSign}
                iconClass="text-blue-600"
                bgClass="bg-blue-50"
              />
              <RelCard
                title="Total Pago"
                value="R$ 20,00"
                icon={TrendingUp}
                iconClass="text-emerald-600"
                bgClass="bg-emerald-50"
                valClass="text-emerald-600"
              />
              <RelCard
                title="Pendente"
                value="R$ 0,00"
                icon={Clock}
                iconClass="text-amber-600"
                bgClass="bg-amber-50"
                valClass="text-amber-600"
              />
              <RelCard
                title="Vencido"
                value="R$ 0,00"
                icon={AlertTriangle}
                iconClass="text-rose-600"
                bgClass="bg-rose-50"
                valClass="text-rose-600"
              />
              <RelCard
                title="Transações"
                value="1"
                icon={ShoppingCart}
                iconClass="text-purple-600"
                bgClass="bg-purple-50"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="shadow-sm border-slate-200 rounded-xl">
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-bold text-slate-800">R$ 20,00</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Ticket Médio</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200 rounded-xl">
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-bold text-slate-800">- dias</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Frequência Média</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200 rounded-xl">
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-bold text-emerald-600">-30 dias</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    Média Pagamento vs Venc.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200 rounded-xl">
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-bold text-emerald-600">+0%</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Crescimento Anual</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="shadow-sm border-slate-200 rounded-xl">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Timer className="w-4 h-4 text-slate-600" /> Desempenho Logístico e Qualidade
              </h3>
              <div className="mb-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Taxa de entrega no prazo ou antecipada</span>
                  <span className="font-bold text-slate-800">100%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[100%]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-xl font-bold text-emerald-700">1</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">
                    Prazo de Entrega (Antecipado)
                  </p>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="text-xl font-bold text-blue-700">100%</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">
                    Qualidade da Entrega (Intacta)
                  </p>
                </div>
                <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <Activity className="w-5 h-5 text-purple-600 mb-2" />
                  <p className="text-xl font-bold text-purple-700">9.8</p>
                  <p className="text-xs text-purple-600 font-medium mt-1">
                    Qualidade dos Produtos (Nota)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 rounded-xl">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-slate-600" /> Comparativo Anual
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Compras 2026</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">R$ 20,00</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Compras 2025</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">R$ 0,00</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Variação</p>
                  <p className="text-xl font-bold text-emerald-600 mt-1">+0%</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 mt-5 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Primeira compra:</span> 03/03/2026
                </p>
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Última compra:</span> 03/03/2026
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm border-slate-200 rounded-xl">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <FileText className="w-4 h-4 text-blue-600" /> Termos Comerciais
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Desconto Combinado</span>
                    <span className="text-sm font-bold text-emerald-600">5% em toda linha</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Negociação Combinada</span>
                    <span className="text-sm font-medium text-slate-700">Frete FOB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 rounded-xl">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <ShoppingCart className="w-4 h-4 text-purple-600" /> Detalhes de Compra & Catálogo
                </h3>
                <div className="space-y-3">
                  <div className="bg-purple-50/50 border border-purple-100 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <ShoppingCart className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Produtos Comprados</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-purple-700">12</span>
                  </div>
                  <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Catálogo Disponível</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-blue-700">150</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Cadastro Detalhado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-sm border-slate-200 rounded-xl">
                <CardContent className="p-5">
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-2">
                    <Phone className="w-3.5 h-3.5" /> Contato
                  </p>
                  <p className="text-sm font-medium text-slate-800 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> 6134939002
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200 rounded-xl">
                <CardContent className="p-5">
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-2">
                    <MapPin className="w-3.5 h-3.5" /> Endereço
                  </p>
                  <p className="text-sm font-medium text-slate-400 italic">
                    Endereço não cadastrado
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200 rounded-xl">
                <CardContent className="p-5">
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-3">
                    <CreditCard className="w-3.5 h-3.5" /> Condições Financeiras
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-50 p-2 rounded border border-slate-100 text-center">
                      <p className="text-sm font-bold text-blue-700">30</p>
                      <p className="text-[10px] text-slate-500">Prazo (dias)</p>
                    </div>
                    <div className="flex-1 bg-slate-50 p-2 rounded border border-slate-100 text-center">
                      <p className="text-sm font-bold text-slate-800">1</p>
                      <p className="text-[10px] text-slate-500">Dia Fixo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
