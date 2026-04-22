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
import { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useModuleStore from '@/stores/useModuleStore'

import ModulesTab from '@/components/settings/ModulesTab'
import BillingTab from '@/components/settings/BillingTab'
import TenantsTab from '@/components/settings/TenantsTab'
import UsersTab from '@/components/settings/UsersTab'
import SecurityTab from '@/components/settings/SecurityTab'
import HRTab from '@/components/settings/HRTab'
import WhatsAppTab from '@/components/settings/WhatsAppTab'
import PontoTab from '@/components/settings/PontoTab'
import { MapPin } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') || 'modules'
  const { contractedModules } = useModuleStore()
  const hasPonto = contractedModules.includes('Controle de Ponto')

  useEffect(() => {
    if (!hasPonto && (currentTab === 'ponto' || currentTab === 'hr')) {
      setSearchParams({ tab: 'modules' }, { replace: true })
    }
  }, [hasPonto, currentTab, setSearchParams])

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-4 md:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              Configurações e Gestão
            </h2>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Painel administrativo para controle multi-tenant, faturamento, integrações e RH.
            </p>
          </div>
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
          {hasPonto && (
            <>
              <TabsTrigger
                value="hr"
                className="data-[state=active]:text-primary group py-2 shrink-0"
              >
                <Clock className="w-4 h-4 mr-2 group-data-[state=active]:text-primary shrink-0" />
                Jornada
              </TabsTrigger>
              <TabsTrigger
                value="ponto"
                className="data-[state=active]:text-primary group py-2 shrink-0"
              >
                <MapPin className="w-4 h-4 mr-2 group-data-[state=active]:text-primary shrink-0" />
                Painel
              </TabsTrigger>
            </>
          )}
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
        {hasPonto && (
          <>
            <TabsContent value="hr" className="mt-0 outline-none">
              <HRTab />
            </TabsContent>
            <TabsContent value="ponto" className="mt-0 outline-none">
              <PontoTab />
            </TabsContent>
          </>
        )}
        <TabsContent value="security" className="mt-0 outline-none">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
