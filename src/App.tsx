import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ModuleProvider } from '@/stores/useModuleStore'
import useModuleStore from '@/stores/useModuleStore'
import { TenantProvider } from '@/stores/useTenantStore'
import { SecurityProvider } from '@/stores/useSecurityStore'
import { ManagerProvider } from '@/stores/useManagerStore'
import { AuthProvider, useAuth } from '@/hooks/use-auth'

import PublicLayout from '@/components/layouts/PublicLayout'
import AppLayout from '@/components/layouts/AppLayout'

import LandingPage from '@/pages/public/LandingPage'
import Login from '@/pages/public/Login'
import Onboarding from '@/pages/public/Onboarding'
import Dashboard from '@/pages/app/Dashboard'
import Contatos from '@/pages/app/Contatos'
import Financial from '@/pages/app/Financial'
import Settings from '@/pages/app/Settings'
import WorkShifts from '@/pages/app/WorkShifts'
import ComingSoon from '@/pages/app/ComingSoon'
import NotFound from '@/pages/NotFound'

import ManagerDashboard from '@/pages/manager/ManagerDashboard'
import ManagerTickets from '@/pages/manager/ManagerTickets'
import ManagerBugs from '@/pages/manager/ManagerBugs'
import ManagerInternalChat from '@/pages/manager/ManagerInternalChat'
import ManagerSupportChat from '@/pages/manager/ManagerSupportChat'
import ManagerFeedback from '@/pages/manager/ManagerFeedback'
import ManagerLicenses from '@/pages/manager/ManagerLicenses'
import ManagerPayments from '@/pages/manager/ManagerPayments'
import ManagerPricing from '@/pages/manager/ManagerPricing'

import RegistrarPonto from '@/pages/app/ponto/RegistrarPonto'
import PontoRealtimeNotifications from '@/components/ponto/PontoRealtimeNotifications'
import EspelhoPonto from '@/pages/app/ponto/EspelhoPonto'
import GestaoPonto from '@/pages/app/ponto/GestaoPonto'
import PontoDashboard from '@/pages/app/ponto/PontoDashboard'
import GestaoObras from '@/pages/app/ponto/GestaoObras'
import GestaoLocacao from '@/pages/app/ponto/GestaoLocacao'
import RelatorioCustos from '@/pages/app/ponto/RelatorioCustos'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isValid, loading } = useAuth()
  if (loading) return null
  if (!isValid) return <Navigate to="/login" replace />
  return <>{children}</>
}

const ModuleProtectedRoute = ({
  moduleName,
  children,
}: {
  moduleName: string
  children: React.ReactNode
}) => {
  const { contractedModules, isReady } = useModuleStore()
  if (!isReady) return null
  if (!contractedModules.includes(moduleName)) return <Navigate to="/app" replace />
  return <>{children}</>
}

const App = () => (
  <AuthProvider>
    <TenantProvider>
      <ModuleProvider>
        <SecurityProvider>
          <ManagerProvider>
            <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <PontoRealtimeNotifications />
                <Routes>
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                  </Route>

                  <Route path="/login" element={<Login />} />
                  <Route path="/onboarding/:token" element={<Onboarding />} />

                  <Route
                    element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/app" element={<Dashboard />} />
                    <Route path="/app/dashboard" element={<Navigate to="/app" replace />} />

                    <Route
                      path="/app/relacionamento"
                      element={<Navigate to="/app/contatos" replace />}
                    />
                    <Route
                      path="/app/relacionamento/:view"
                      element={<Navigate to="/app/contatos" replace />}
                    />

                    <Route path="/app/contatos" element={<Contatos />} />
                    <Route path="/app/contatos/:view" element={<Contatos />} />
                    <Route
                      path="/app/financeiro"
                      element={
                        <ModuleProtectedRoute moduleName="Financeiro">
                          <Financial />
                        </ModuleProtectedRoute>
                      }
                    />
                    <Route path="/app/configuracoes/*" element={<Settings />} />
                    <Route
                      path="/app/configuracoes/rh/jornada"
                      element={
                        <ModuleProtectedRoute moduleName="Controle de Ponto">
                          <WorkShifts />
                        </ModuleProtectedRoute>
                      }
                    />
                    <Route path="/app/em-breve" element={<ComingSoon />} />

                    <Route
                      path="/app/ponto"
                      element={<Navigate to="/app/controle-de-ponto" replace />}
                    />
                    <Route
                      path="/app/ponto/registrar"
                      element={<Navigate to="/app/controle-de-ponto/registrar" replace />}
                    />
                    <Route
                      path="/app/ponto/espelho"
                      element={<Navigate to="/app/controle-de-ponto/espelho" replace />}
                    />
                    <Route
                      path="/app/ponto/gestao"
                      element={<Navigate to="/app/controle-de-ponto/gestao" replace />}
                    />
                    <Route
                      path="/app/ponto/obras"
                      element={<Navigate to="/app/controle-de-ponto/obras" replace />}
                    />
                    <Route
                      path="/app/ponto/locacao"
                      element={<Navigate to="/app/controle-de-ponto/locacao" replace />}
                    />
                    <Route
                      path="/app/ponto/custos"
                      element={<Navigate to="/app/controle-de-ponto/custos" replace />}
                    />

                    <Route
                      path="/app/controle-ponto"
                      element={<Navigate to="/app/controle-de-ponto" replace />}
                    />
                    <Route
                      path="/app/controle-ponto/*"
                      element={<Navigate to="/app/controle-de-ponto" replace />}
                    />

                    <Route
                      path="/app/controle-de-ponto"
                      element={
                        <ModuleProtectedRoute moduleName="Controle de Ponto">
                          <PontoDashboard />
                        </ModuleProtectedRoute>
                      }
                    />
                    <Route
                      path="/app/controle-de-ponto/registrar"
                      element={
                        <ModuleProtectedRoute moduleName="Controle de Ponto">
                          <RegistrarPonto />
                        </ModuleProtectedRoute>
                      }
                    />
                    <Route
                      path="/app/controle-de-ponto/espelho"
                      element={
                        <ModuleProtectedRoute moduleName="Controle de Ponto">
                          <EspelhoPonto />
                        </ModuleProtectedRoute>
                      }
                    />
                    <Route
                      path="/app/controle-de-ponto/gestao"
                      element={
                        <ModuleProtectedRoute moduleName="Controle de Ponto">
                          <GestaoPonto />
                        </ModuleProtectedRoute>
                      }
                    />
                    <Route
                      path="/app/controle-de-ponto/obras"
                      element={
                        <ModuleProtectedRoute moduleName="Controle de Ponto">
                          <GestaoObras />
                        </ModuleProtectedRoute>
                      }
                    />
                    <Route
                      path="/app/controle-de-ponto/locacao"
                      element={
                        <ModuleProtectedRoute moduleName="Controle de Ponto">
                          <GestaoLocacao />
                        </ModuleProtectedRoute>
                      }
                    />
                    <Route
                      path="/app/controle-de-ponto/custos"
                      element={
                        <ModuleProtectedRoute moduleName="Controle de Ponto">
                          <RelatorioCustos />
                        </ModuleProtectedRoute>
                      }
                    />

                    <Route path="/app/manager" element={<ManagerDashboard />} />
                    <Route path="/app/manager/tickets" element={<ManagerTickets />} />
                    <Route path="/app/manager/bugs" element={<ManagerBugs />} />
                    <Route path="/app/manager/internal-chat" element={<ManagerInternalChat />} />
                    <Route path="/app/manager/support-chat" element={<ManagerSupportChat />} />
                    <Route path="/app/manager/feedback" element={<ManagerFeedback />} />
                    <Route path="/app/manager/licenses" element={<ManagerLicenses />} />
                    <Route path="/app/manager/payments" element={<ManagerPayments />} />
                    <Route path="/app/manager/pricing" element={<ManagerPricing />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </BrowserRouter>
          </ManagerProvider>
        </SecurityProvider>
      </ModuleProvider>
    </TenantProvider>
  </AuthProvider>
)

export default App
