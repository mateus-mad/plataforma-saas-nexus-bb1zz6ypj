import { useSearchParams } from 'react-router-dom'
import {
  Settings as SettingsIcon,
  ShoppingBag,
  CreditCard,
  Building2,
  Users,
  Shield,
  Clock,
  MessageCircle,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import ModulesTab from '@/components/settings/ModulesTab'
import BillingTab from '@/components/settings/BillingTab'
import TenantsTab from '@/components/settings/TenantsTab'
import UsersTab from '@/components/settings/UsersTab'
import SecurityTab from '@/components/settings/SecurityTab'
import HRTab from '@/components/settings/HRTab'
import WhatsAppTab from '@/components/settings/WhatsAppTab'

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
            Painel administrativo para controle multi-tenant, faturamento, integrações e RH.
          </p>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="flex w-full overflow-x-auto justify-start mb-8 h-auto p-1 custom-scrollbar">
          <TabsTrigger
            value="modules"
            className="data-[state=active]:text-primary group py-2 shrink-0"
          >
            <ShoppingBag className="w-4 h-4 mr-2 group-data-[state=active]:text-primary shrink-0" />
            Loja
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="data-[state=active]:text-primary group py-2 shrink-0"
          >
            <CreditCard className="w-4 h-4 mr-2 group-data-[state=active]:text-primary shrink-0" />
            Fatura
          </TabsTrigger>
          <TabsTrigger
            value="whatsapp"
            className="data-[state=active]:text-emerald-600 group py-2 shrink-0"
          >
            <MessageCircle className="w-4 h-4 mr-2 group-data-[state=active]:text-emerald-600 shrink-0" />
            WhatsApp API
          </TabsTrigger>
          <TabsTrigger
            value="tenants"
            className="data-[state=active]:text-primary group py-2 shrink-0"
          >
            <Building2 className="w-4 h-4 mr-2 group-data-[state=active]:text-primary shrink-0" />
            Empresas
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:text-primary group py-2 shrink-0"
          >
            <Users className="w-4 h-4 mr-2 group-data-[state=active]:text-primary shrink-0" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="hr" className="data-[state=active]:text-primary group py-2 shrink-0">
            <Clock className="w-4 h-4 mr-2 group-data-[state=active]:text-primary shrink-0" />
            Jornada de Trabalho
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:text-primary group py-2 shrink-0"
          >
            <Shield className="w-4 h-4 mr-2 group-data-[state=active]:text-primary shrink-0" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-0 outline-none">
          <ModulesTab />
        </TabsContent>
        <TabsContent value="billing" className="mt-0 outline-none">
          <BillingTab />
        </TabsContent>
        <TabsContent value="whatsapp" className="mt-0 outline-none">
          <WhatsAppTab />
        </TabsContent>
        <TabsContent value="tenants" className="mt-0 outline-none">
          <TenantsTab />
        </TabsContent>
        <TabsContent value="users" className="mt-0 outline-none">
          <UsersTab />
        </TabsContent>
        <TabsContent value="hr" className="mt-0 outline-none">
          <HRTab />
        </TabsContent>
        <TabsContent value="security" className="mt-0 outline-none">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
