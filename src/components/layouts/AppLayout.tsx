import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app/AppSidebar'
import { AppHeader } from '@/components/app/AppHeader'
import useModuleStore from '@/stores/useModuleStore'
import useSecurityStore from '@/stores/useSecurityStore'
import LockScreen from '@/components/security/LockScreen'
import { Hexagon } from 'lucide-react'

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isReady, lastRoute, setLastRoute } = useModuleStore()
  const { isSetup, isUnlocked } = useSecurityStore()
  const hasRestored = useRef(false)

  useEffect(() => {
    if (!isReady) return

    if (!hasRestored.current && location.pathname === '/app' && lastRoute && lastRoute !== '/app') {
      hasRestored.current = true
      navigate(lastRoute, { replace: true })
      return
    }

    hasRestored.current = true

    if (location.pathname.startsWith('/app')) {
      setLastRoute(location.pathname + location.search)
    }
  }, [location, isReady, lastRoute, navigate, setLastRoute])

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] animate-pulse">
          <Hexagon className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        </div>
        <p className="text-slate-500 font-medium tracking-wide animate-pulse">
          Sincronizando ambiente...
        </p>
      </div>
    )
  }

  if (isSetup && !isUnlocked) {
    return <LockScreen />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50 min-h-screen relative overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100/50 -z-10 pointer-events-none" />
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-[1600px] mx-auto z-0 relative">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
