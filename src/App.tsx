import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ModuleProvider } from '@/stores/useModuleStore'
import { TenantProvider } from '@/stores/useTenantStore'
import { SecurityProvider } from '@/stores/useSecurityStore'
import { ManagerProvider } from '@/stores/useManagerStore'

import PublicLayout from '@/components/layouts/PublicLayout'
import AppLayout from '@/components/layouts/AppLayout'

import LandingPage from '@/pages/public/LandingPage'
import Dashboard from '@/pages/app/Dashboard'
import Contacts from '@/pages/app/Contacts'
import Financial from '@/pages/app/Financial'
import Settings from '@/pages/app/Settings'
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

const App = () => (
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

                <Route element={<AppLayout />}>
                  <Route path="/app" element={<Dashboard />} />
                  <Route path="/app/contatos" element={<Contacts />} />
                  <Route path="/app/financeiro" element={<Financial />} />
                  <Route path="/app/configuracoes" element={<Settings />} />
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
)

export default App
