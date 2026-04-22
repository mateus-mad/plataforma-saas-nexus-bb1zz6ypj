import useModuleStore from '@/stores/useModuleStore'
import { MENU_CATEGORIES } from '@/config/modules'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Layers, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ModulesTab() {
  const { contractedModules, contractModule, removeModule } = useModuleStore()

  const modules = MENU_CATEGORIES.flatMap((cat) => {
    if (cat.name === 'Contatos') {
      return [
        {
          name: 'Contatos',
          path: '/app/contatos',
          icon: cat.icon,
          description: 'Gestão centralizada para colaboradores, clientes e fornecedores.',
          category: 'Módulos Base',
          isUpcoming: false,
        },
      ]
    }
    if (cat.name === 'Controle de Ponto') {
      return [
        {
          name: 'Controle de Ponto',
          path: '/app/controle-de-ponto',
          icon: cat.icon,
          description: 'Registro e gestão inteligente de jornada de trabalho.',
          category: 'Recursos Humanos',
          isUpcoming: false,
        },
      ]
    }
    return cat.items ? cat.items.map((item) => ({ ...item, category: cat.name })) : []
  })

  return (
    <div className="space-y-6 mt-6">
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
          const mockedPrice = mod.isUpcoming ? 'Em breve' : `R$ 49,00/mês`

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
                  {mod.description || 'Módulo avançado para otimização de processos.'}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t bg-slate-50/80">
                {isContracted ? (
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1 border-slate-300" asChild>
                      <Link to={mod.path || '#'}>Configurar</Link>
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
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
