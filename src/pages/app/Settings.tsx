import { useSearchParams } from 'react-router-dom'
import { Settings as SettingsIcon, ShoppingBag, CreditCard, Building2, Users } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import ModulesTab from '@/components/settings/ModulesTab'
import BillingTab from '@/components/settings/BillingTab'
import TenantsTab from '@/components/settings/TenantsTab'
import UsersTab from '@/components/settings/UsersTab'

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') || 'modules'

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-8 h-8 text-primary" />
            Configurações e Gestão
          </h2>
          <p className="text-muted-foreground mt-1">
            Painel administrativo para controle multi-tenant, faturamento e acesso.
          </p>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-3xl mb-8">
          <TabsTrigger value="modules" className="data-[state=active]:text-primary group">
            <ShoppingBag className="w-4 h-4 mr-2 group-data-[state=active]:text-primary" />
            Loja de Módulos
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:text-primary group">
            <CreditCard className="w-4 h-4 mr-2 group-data-[state=active]:text-primary" />
            Faturamento
          </TabsTrigger>
          <TabsTrigger value="tenants" className="data-[state=active]:text-primary group">
            <Building2 className="w-4 h-4 mr-2 group-data-[state=active]:text-primary" />
            Empresas (CNPJ)
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:text-primary group">
            <Users className="w-4 h-4 mr-2 group-data-[state=active]:text-primary" />
            Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-0 outline-none">
          <ModulesTab />
        </TabsContent>

        <TabsContent value="billing" className="mt-0 outline-none">
          <BillingTab />
        </TabsContent>

        <TabsContent value="tenants" className="mt-0 outline-none">
          <TenantsTab />
        </TabsContent>

        <TabsContent value="users" className="mt-0 outline-none">
          <UsersTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
