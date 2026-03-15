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
import { Check, ShoppingBag, Layers, Settings as SettingsIcon } from 'lucide-react'

export default function Settings() {
  const { contractedModules, contractModule, removeModule } = useModuleStore()

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
            Gerencie suas preferências, módulos adicionais e faturamento corporativo.
          </p>
        </div>
      </div>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl mb-8">
          <TabsTrigger value="general" disabled>
            Geral
          </TabsTrigger>
          <TabsTrigger value="modules" className="data-[state=active]:text-primary">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Loja de Módulos
          </TabsTrigger>
          <TabsTrigger value="billing" disabled>
            Faturamento
          </TabsTrigger>
          <TabsTrigger value="security" disabled>
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-0 outline-none">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-800">Módulos Disponíveis</h3>
              <p className="text-sm text-slate-500">
                Expanda as capacidades do seu ERP ativando recursos sob demanda.
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
                      <Check className="w-3 h-3" /> Ativo
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
                    <CardDescription className="text-xs font-semibold text-primary mt-1 uppercase tracking-wider flex items-center gap-2">
                      {mod.category}
                      {mod.isUpcoming && (
                        <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px] border border-amber-200 tracking-wider">
                          EM BREVE
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {mod.description ||
                        'Módulo avançado para otimização de processos corporativos.'}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t bg-slate-50/80">
                    {isContracted ? (
                      <Button
                        variant="outline"
                        className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 transition-colors"
                        onClick={() => removeModule(mod.name)}
                      >
                        Desativar
                      </Button>
                    ) : (
                      <Button
                        className="w-full shadow-sm hover:shadow-md transition-all group"
                        onClick={() => contractModule(mod.name)}
                      >
                        Ativar Módulo{' '}
                        <span className="ml-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
