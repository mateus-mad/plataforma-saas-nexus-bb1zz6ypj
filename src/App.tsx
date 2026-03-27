import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ModuleProvider } from '@/stores/useModuleStore'
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
import Relacionamento from '@/pages/app/Relacionamento'
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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isValid, loading } = useAuth()
  if (loading) return null
  if (!isValid) return <Navigate to="/login" replace />
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

                    <Route
                      path="/app/contatos"
                      element={<Navigate to="/app/relacionamento" replace />}
                    />
                    <Route
                      path="/app/contatos/:view"
                      element={<Navigate to="/app/relacionamento" replace />}
                    />

                    <Route path="/app/relacionamento" element={<Relacionamento />} />
                    <Route path="/app/relacionamento/:view" element={<Relacionamento />} />
                    <Route path="/app/financeiro" element={<Financial />} />
                    <Route path="/app/configuracoes" element={<Settings />} />
                    <Route path="/app/configuracoes/rh/jornada" element={<WorkShifts />} />
                    <Route path="/app/em-breve" element={<ComingSoon />} />

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
