import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app/AppSidebar'
import { AppHeader } from '@/components/app/AppHeader'

export default function AppLayout() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith('/app')) {
      localStorage.setItem('nexus_last_route', location.pathname + location.search)
    }
  }, [location])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50 min-h-screen relative overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100/50 -z-10 pointer-events-none" />
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in w-full max-w-[1600px] mx-auto z-0 relative">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
