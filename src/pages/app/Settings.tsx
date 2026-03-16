import { useSearchParams } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useModuleStore from '@/stores/useModuleStore'
import { MENU_CATEGORIES } from '@/config/modules'
import {
  Check,
  ShoppingBag,
  Layers,
  Settings as SettingsIcon,
  CreditCard,
  Download,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function Settings() {
  const { contractedModules, contractModule, removeModule } = useModuleStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') || 'modules'

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value })
  }

  const modules = MENU_CATEGORIES.flatMap((cat) =>
    cat.items ? cat.items.map((item) => ({ ...item, category: cat.name })) : [],
  )

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-8 h-8 text-primary" />
            Configurações
          </h2>
          <p className="text-muted-foreground mt-1">
            Gerencie suas preferências, licenças de módulos e faturamento corporativo.
          </p>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl mb-8">
          <TabsTrigger value="general" disabled>
            Geral
          </TabsTrigger>
          <TabsTrigger value="modules" className="data-[state=active]:text-primary group">
            <ShoppingBag className="w-4 h-4 mr-2 group-data-[state=active]:text-primary" />
            Loja de Módulos
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:text-primary group">
            <CreditCard className="w-4 h-4 mr-2 group-data-[state=active]:text-primary" />
            Faturamento
          </TabsTrigger>
          <TabsTrigger value="security" disabled>
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-0 outline-none">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-800">Módulos e Extensões</h3>
              <p className="text-sm text-slate-500">
                Expanda as capacidades do seu ERP assinando novos recursos sob demanda.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border shadow-sm">
              <Layers className="w-4 h-4 text-primary" />
              <span className="font-medium text-slate-700">{contractedModules.length}</span> ativos
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((mod) => {
              const isContracted = contractedModules.includes(mod.name)
              const Icon = mod.icon
              const mockedPrice = mod.isUpcoming
                ? 'Em breve'
                : `R$ ${mod.name.length * 5 + 49},00/mês`

              return (
                <Card
                  key={mod.name}
                  className={`flex flex-col relative overflow-hidden transition-all duration-300 ${
                    isContracted
                      ? 'border-primary/40 shadow-[0_0_20px_rgba(59,130,246,0.08)] bg-primary/[0.02]'
                      : 'hover:border-slate-300 hover:shadow-md bg-white'
                  }`}
                >
                  {isContracted && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 z-10 uppercase tracking-wider">
                      <Check className="w-3 h-3" /> Contratado
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                          isContracted ? 'bg-primary/10' : 'bg-slate-100'
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${isContracted ? 'text-primary' : 'text-slate-600'}`}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-lg flex items-center gap-2">{mod.name}</CardTitle>
                    <CardDescription className="text-xs font-semibold text-primary mt-1 uppercase tracking-wider flex items-center justify-between gap-2">
                      <span className="truncate">{mod.category}</span>
                      {!isContracted && !mod.isUpcoming && (
                        <span className="text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded normal-case tracking-normal shrink-0">
                          {mockedPrice}
                        </span>
                      )}
                      {mod.isUpcoming && (
                        <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px] border border-amber-200 tracking-wider shrink-0">
                          EM BREVE
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {mod.description ||
                        'Módulo avançado para otimização de processos corporativos e ganho de escala.'}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t bg-slate-50/80">
                    {isContracted ? (
                      <div className="flex gap-2 w-full">
                        <Button variant="outline" className="flex-1 border-slate-300">
                          Configurar
                        </Button>
                        <Button
                          variant="outline"
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 px-3"
                          onClick={() => removeModule(mod.name)}
                          title="Cancelar Assinatura"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full shadow-sm hover:shadow-md transition-all group"
                        onClick={() => contractModule(mod.name)}
                        disabled={mod.isUpcoming}
                      >
                        {mod.isUpcoming ? 'Aguardar Lançamento' : 'Assinar Módulo'}
                        {!mod.isUpcoming && (
                          <span className="ml-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-0 outline-none space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Licença Atual */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Licença Atual</CardTitle>
                <CardDescription>Gerencie o plano base e ciclo de faturamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="font-semibold text-slate-800">Nexus ERP Enterprise</h4>
                    <p className="text-sm text-slate-500">
                      Ciclo Anual • Próxima cobrança em 15/06/2026
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3 py-1">
                    Ativo
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm py-1">
                  <span className="text-slate-500">Módulos Contratados</span>
                  <span className="font-medium text-slate-800">
                    {contractedModules.length} de {modules.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm py-1">
                  <span className="text-slate-500">Valor Total Estimado</span>
                  <span className="font-bold text-slate-800 text-base">
                    R$ {contractedModules.length * 115 + 499},00
                    <span className="text-sm font-normal text-slate-500">/mês</span>
                  </span>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-50 bg-slate-50/50 pt-4">
                <Button variant="outline" className="w-full">
                  Alterar Plano Base
                </Button>
              </CardFooter>
            </Card>

            {/* Formas de Pagamento */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Método de Pagamento</CardTitle>
                <CardDescription>Formas de pagamento vinculadas à sua conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 bg-slate-50/80 hover:border-slate-300 transition-colors">
                  <div className="w-12 h-8 bg-slate-800 rounded-md flex items-center justify-center text-white shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Mastercard final 4242</p>
                    <p className="text-xs text-slate-500 mt-0.5">Vencimento em 12/2028</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] uppercase font-bold tracking-wider"
                  >
                    Padrão
                  </Badge>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                  <div className="w-12 h-8 bg-emerald-100 rounded-md flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0 border border-emerald-200">
                    PIX
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Chave CNPJ</p>
                    <p className="text-xs text-slate-500 mt-0.5">Empresa Acme Corp</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full text-primary border border-dashed border-primary/30 hover:bg-primary/5"
                >
                  + Adicionar novo método
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg">Histórico de Faturamento</CardTitle>
              <CardDescription>
                Acesse suas últimas faturas e notas fiscais de serviço
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/30">
                    <TableHead className="pl-6">Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { date: '15 Mai 2026', id: 'INV-4022', amount: 'R$ 796,00', status: 'Pago' },
                    { date: '15 Abr 2026', id: 'INV-3984', amount: 'R$ 796,00', status: 'Pago' },
                    { date: '15 Mar 2026', id: 'INV-3810', amount: 'R$ 697,00', status: 'Pago' },
                    { date: '15 Fev 2026', id: 'INV-3742', amount: 'R$ 697,00', status: 'Pago' },
                  ].map((invoice, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6 text-slate-600 font-medium">
                        {invoice.date}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-800">
                          Assinatura Mensal - Nexus ERP
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">Fatura {invoice.id}</div>
                      </TableCell>
                      <TableCell className="font-medium">{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200"
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-primary hover:bg-primary/10"
                        >
                          <Download className="w-4 h-4 mr-1.5" /> PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
