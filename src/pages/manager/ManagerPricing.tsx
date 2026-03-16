import { Navigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, Save } from 'lucide-react'
import { ACTIVE_MODULES, UPCOMING_MODULES } from '@/config/modules'
import useSecurityStore from '@/stores/useSecurityStore'

export default function ManagerPricing() {
  const { isAdminMode } = useSecurityStore()
  if (!isAdminMode) return <Navigate to="/app" />

  const allModules = [...ACTIVE_MODULES, ...UPCOMING_MODULES]

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-purple-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-600" /> Tabela de Preços e Módulos
          </h2>
          <p className="text-muted-foreground">
            Defina a precificação padrão para todos os módulos oferecidos no ERP.
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Save className="w-4 h-4 mr-2" /> Salvar Alterações Globais
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allModules.map((mod) => {
          const Icon = mod.icon
          return (
            <Card key={mod.name} className="shadow-sm border-slate-200 flex flex-col">
              <CardHeader className="pb-3 bg-slate-50/50 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-white border flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-sm">{mod.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-1">
                <p className="text-xs text-slate-500 mb-4 line-clamp-2 h-8">{mod.description}</p>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-600">Preço Mensal (BRL)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 text-sm">R$</span>
                    <Input defaultValue="49,00" className="pl-9 font-medium" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
