import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
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
  AlertTriangle,
  Receipt,
  FileSignature,
  Paperclip,
  Download,
  Eye,
  Phone,
  Activity,
  CreditCard,
  History,
  TrendingUp,
  Calendar,
  Clock,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

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
  const [activeTab, setActiveTab] = useState('relacionamento')

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
  const defaultName = companyData?.name || 'Empresa Exemplo'
  const defaultAvatar = companyData?.avatar || ''
  const defaultInitial = defaultName.charAt(0).toUpperCase()
  const isComplete = companyData?.progress === 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1100px] w-[95vw] h-[90vh] p-0 bg-slate-50 border-none shadow-2xl rounded-2xl flex flex-col overflow-hidden [&>button]:hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 bg-white border-b border-slate-200 shrink-0 relative z-10 gap-4">
          <div className="flex items-center gap-2">
            {titleIcon}
            <div>
              <DialogTitle className="font-bold text-slate-800 text-lg leading-none">
                {titleText}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-1">
                Visualização detalhada e histórico completo.
              </DialogDescription>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              onClick={printDoc}
              className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 h-9"
            >
              <Printer className="w-4 h-4 sm:mr-2" />{' '}
              <span className="hidden sm:inline">Exportar Ficha</span>
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false)
                onEdit()
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-9"
            >
              <Edit className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Editar</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-9 px-3 text-slate-500 hover:bg-slate-100"
            >
              Fechar
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-slate-50/50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm">
            <Avatar className="w-20 h-20 border border-slate-100 shadow-sm bg-slate-50 shrink-0">
              <AvatarImage src={defaultAvatar} className="object-contain p-2" />
              <AvatarFallback className="text-2xl font-light text-slate-400">
                {defaultInitial}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight truncate">
                  {defaultName}
                </h1>
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none shadow-sm px-2.5 h-6">
                  Ativo
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-slate-50 text-slate-600 border-slate-200 font-medium h-6"
                >
                  Pessoa Jurídica
                </Badge>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> CNPJ: 12.345.678/0001-90
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> São Paulo, SP
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" /> (11) 3333-3333
                </span>
              </div>
            </div>
            <div className="md:border-l md:border-slate-100 md:pl-6 md:h-16 flex flex-col justify-center shrink-0">
              <p className="text-xs text-slate-500 font-medium mb-1 text-right">
                Integridade do Cadastro
              </p>
              <div
                className={`flex items-center gap-1.5 ${isComplete ? 'text-emerald-600' : 'text-amber-600'} font-bold text-sm`}
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start h-12 bg-transparent border-b border-slate-200 rounded-none p-0 overflow-x-auto overflow-y-hidden gap-6">
              <TabsTrigger
                value="relacionamento"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-12 px-0 font-medium text-slate-500 data-[state=active]:text-blue-700"
              >
                <Activity className="w-4 h-4 mr-2" /> Análise de Relacionamento
              </TabsTrigger>
              <TabsTrigger
                value="financeiro"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-12 px-0 font-medium text-slate-500 data-[state=active]:text-blue-700"
              >
                <CreditCard className="w-4 h-4 mr-2" /> Financeiro & Faturamento
              </TabsTrigger>
              <TabsTrigger
                value="contratos"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-12 px-0 font-medium text-slate-500 data-[state=active]:text-blue-700"
              >
                <FileSignature className="w-4 h-4 mr-2" /> Contratos
              </TabsTrigger>
              <TabsTrigger
                value="historico"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-12 px-0 font-medium text-slate-500 data-[state=active]:text-blue-700"
              >
                <History className="w-4 h-4 mr-2" /> Histórico
              </TabsTrigger>
            </TabsList>

            <div className="pt-6">
              <TabsContent value="relacionamento" className="space-y-6 mt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <Card className="bg-white border-slate-200 shadow-sm col-span-2 md:col-span-2 lg:col-span-1 border-t-4 border-t-blue-500">
                    <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2">
                        Score Nexus
                      </div>
                      <div className="text-3xl font-bold text-blue-700">92</div>
                      <p className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-2">
                        Relacionamento Alto
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-5">
                      <p className="text-xs text-slate-500 font-medium mb-1">Total Negociado</p>
                      <div className="text-xl font-bold text-slate-800">R$ 450k</div>
                      <TrendingUp className="w-4 h-4 text-slate-300 mt-2" />
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-5">
                      <p className="text-xs text-slate-500 font-medium mb-1">Total Recebido</p>
                      <div className="text-xl font-bold text-emerald-600">R$ 410k</div>
                      <DollarSign className="w-4 h-4 text-emerald-200 mt-2" />
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-5">
                      <p className="text-xs text-slate-500 font-medium mb-1">A Receber</p>
                      <div className="text-xl font-bold text-amber-600">R$ 40k</div>
                      <Calendar className="w-4 h-4 text-amber-200 mt-2" />
                    </CardContent>
                  </Card>
                  <Card className="bg-rose-50 border-rose-100 shadow-sm">
                    <CardContent className="p-5">
                      <p className="text-xs text-rose-600 font-medium mb-1">Em Atraso</p>
                      <div className="text-xl font-bold text-rose-700">R$ 0,00</div>
                      <AlertTriangle className="w-4 h-4 text-rose-300 mt-2" />
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Indicadores de
                      Pontualidade
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">Pagamentos no Prazo</span>
                          <span className="font-bold text-emerald-600">98%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[98%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">Pagamentos em Atraso</span>
                          <span className="font-bold text-rose-600">2%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 w-[2%]" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-sm text-slate-600">Total de Transações:</span>
                        <span className="font-bold text-slate-800">45 faturas pagas</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
                      <User className="w-4 h-4 text-blue-500" /> Contatos Chave
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">João Gestor</p>
                          <p className="text-xs text-slate-500">Diretor Comercial</p>
                          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5" /> (11) 99999-9999
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Financeiro</p>
                          <p className="text-xs text-slate-500">Departamento Faturamento</p>
                          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                            <Receipt className="w-3.5 h-3.5" /> cobranca@exemplo.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financeiro" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white border-slate-200 shadow-sm">
                    <div className="px-5 py-3.5 border-b border-slate-100 text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-500" /> Condições Comerciais
                    </div>
                    <CardContent className="p-5 grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-slate-500 mb-1 font-medium">
                          Prazo de Pagamento Padrão
                        </p>
                        <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          30 dias <Clock className="w-4 h-4 text-slate-400" />
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1 font-medium">
                          Limite de Crédito Aprovado
                        </p>
                        <p className="text-lg font-bold text-blue-700">R$ 50.000,00</p>
                      </div>
                      <div className="col-span-2 bg-amber-50 p-3 rounded-lg border border-amber-100 flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-amber-800">
                            Atenção: Risco de Limite
                          </p>
                          <p className="text-[10px] text-amber-700 mt-0.5">
                            Cliente já utilizou 80% do limite de crédito aprovado nas transações
                            recentes.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200 shadow-sm">
                    <div className="px-5 py-3.5 border-b border-slate-100 text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-rose-500" /> Diagnóstico de Atrasos
                    </div>
                    <CardContent className="p-5 space-y-4">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Análise de comportamento de pagamento baseada no histórico financeiro:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between items-center bg-slate-50 p-2 rounded-md border border-slate-100">
                          <span className="text-slate-600">Atraso Médio Histórico</span>
                          <span className="font-bold text-emerald-600">0 dias</span>
                        </li>
                        <li className="flex justify-between items-center bg-slate-50 p-2 rounded-md border border-slate-100">
                          <span className="text-slate-600">Maior Atraso Registrado</span>
                          <span className="font-bold text-amber-600">3 dias (Ago/2025)</span>
                        </li>
                        <li className="flex justify-between items-center bg-slate-50 p-2 rounded-md border border-slate-100">
                          <span className="text-slate-600">Frequência de Atrasos (&gt;5d)</span>
                          <span className="font-bold text-emerald-600">0 ocorrências</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="contratos" className="space-y-6 mt-0">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col md:flex-row items-center gap-5">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                    <FileSignature className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-semibold text-blue-900 text-base">Gerador de Documentos</h3>
                    <p className="text-sm text-blue-800/80 mt-1 max-w-xl">
                      Gere contratos, propostas e aditivos automaticamente usando os dados
                      cadastrais do cliente. A integração completa com assinaturas digitais estará
                      disponível em breve.
                    </p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
                    Gerar Novo Contrato
                  </Button>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-800 text-sm flex justify-between items-center">
                    <span>Contratos e Anexos Manuais</span>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Paperclip className="w-3.5 h-3.5 mr-2" /> Upload Manual
                    </Button>
                  </div>
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Arquivo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Validade</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4 text-rose-500" /> Contrato_Assinado_2025.pdf
                        </TableCell>
                        <TableCell className="text-slate-500">Contrato Principal</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-none border-none">
                            Válido até 12/2026
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                            <Download className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4 text-rose-500" /> Cartao_CNPJ.pdf
                        </TableCell>
                        <TableCell className="text-slate-500">Documento Empresa</TableCell>
                        <TableCell>
                          <span className="text-slate-500 text-sm">-</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                            <Download className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="historico" className="space-y-6 mt-0">
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-800 text-sm flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-400" /> Timeline de Interações
                  </div>
                  <div className="p-6 relative">
                    <div className="absolute left-[39px] top-6 bottom-6 w-px bg-slate-200"></div>
                    <div className="space-y-8 relative">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center shrink-0 z-10">
                          <Edit className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm font-semibold text-slate-800">
                            Limite de Crédito Alterado
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Alterado de R$ 40.000 para R$ 50.000. Autorizado por: Admin.
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono mt-2 block">
                            15/03/2026 14:30
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 border-4 border-white flex items-center justify-center shrink-0 z-10">
                          <FileSignature className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm font-semibold text-slate-800">
                            Novo Contrato Assinado
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Contrato Principal de Fornecimento anexado ao perfil.
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono mt-2 block">
                            10/01/2025 09:15
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center shrink-0 z-10">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm font-semibold text-slate-800">Cadastro Inicial</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Cliente importado na base de dados inicial via CNPJ.
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono mt-2 block">
                            01/12/2024 10:00
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
