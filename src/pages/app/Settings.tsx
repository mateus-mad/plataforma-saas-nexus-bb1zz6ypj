import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import {
  Settings as SettingsIcon,
  ShoppingBag,
  CreditCard,
  Building2,
  Users,
  Shield,
  Clock,
  MessageCircle,
  MapPin,
} from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import useModuleStore from '@/stores/useModuleStore'
import { cn } from '@/lib/utils'

import ModulesTab from '@/components/settings/ModulesTab'
import BillingTab from '@/components/settings/BillingTab'
import TenantsTab from '@/components/settings/TenantsTab'
import UsersTab from '@/components/settings/UsersTab'
import SecurityTab from '@/components/settings/SecurityTab'
import HRTab from '@/components/settings/HRTab'
import WhatsAppTab from '@/components/settings/WhatsAppTab'
import PontoTab from '@/components/settings/PontoTab'

export default function Settings() {
  const { contractedModules, isReady } = useModuleStore()
  const hasPonto = contractedModules.includes('Controle de Ponto')
  const location = useLocation()

  if (!isReady) return null

  const tabs = [
    { value: 'loja', label: 'Loja', icon: ShoppingBag, path: '/app/configuracoes/loja' },
    { value: 'fatura', label: 'Fatura', icon: CreditCard, path: '/app/configuracoes/fatura' },
    {
      value: 'whatsapp',
      label: 'WhatsApp API',
      icon: MessageCircle,
      path: '/app/configuracoes/whatsapp',
      iconColor: 'text-emerald-500',
    },
    { value: 'empresas', label: 'Empresas', icon: Building2, path: '/app/configuracoes/empresas' },
    { value: 'usuarios', label: 'Usuários', icon: Users, path: '/app/configuracoes/usuarios' },
    ...(hasPonto
      ? [
          { value: 'jornada', label: 'Jornada', icon: Clock, path: '/app/configuracoes/jornada' },
          { value: 'painel', label: 'Painel', icon: MapPin, path: '/app/configuracoes/painel' },
        ]
      : []),
    { value: 'seguranca', label: 'Segurança', icon: Shield, path: '/app/configuracoes/seguranca' },
  ]

  // Automatically redirect if accessing root route
  if (location.pathname === '/app/configuracoes' || location.pathname === '/app/configuracoes/') {
    return <Navigate to="/app/configuracoes/loja" replace />
  }

  // Redirect to safe fallback if module is inactive and trying to access its sub-routes
  if (
    !hasPonto &&
    (location.pathname.includes('/app/configuracoes/jornada') ||
      location.pathname.includes('/app/configuracoes/painel'))
  ) {
    return <Navigate to="/app/configuracoes/loja" replace />
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

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <aside className="md:w-56 shrink-0 overflow-x-auto md:overflow-visible">
          <nav className="flex md:flex-col gap-2 min-w-max md:min-w-0 pb-2 md:pb-0 custom-scrollbar">
            {tabs.map((tab) => {
              const isActive = location.pathname.startsWith(tab.path)
              return (
                <Link
                  key={tab.value}
                  to={tab.path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm whitespace-nowrap',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] border border-primary/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent',
                  )}
                >
                  <tab.icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-transform',
                      isActive ? 'scale-110' : '',
                      tab.iconColor,
                    )}
                  />
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <Routes>
            <Route path="loja" element={<ModulesTab />} />
            <Route path="fatura" element={<BillingTab />} />
            <Route path="whatsapp" element={<WhatsAppTab />} />
            <Route path="empresas" element={<TenantsTab />} />
            <Route path="usuarios" element={<UsersTab />} />
            {hasPonto && (
              <>
                <Route path="jornada" element={<HRTab />} />
                <Route path="painel" element={<PontoTab />} />
              </>
            )}
            <Route path="seguranca" element={<SecurityTab />} />
            <Route path="*" element={<Navigate to="loja" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
