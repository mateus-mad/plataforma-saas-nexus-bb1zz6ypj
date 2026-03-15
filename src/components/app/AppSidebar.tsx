import { Link, useLocation } from 'react-router-dom'
import { Hexagon, Settings, HelpCircle, LogOut } from 'lucide-react'
import { ACTIVE_MODULES, UPCOMING_MODULES } from '@/config/modules'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r-slate-800">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 text-primary-foreground font-bold text-xl px-2">
          <Hexagon className="w-6 h-6 fill-primary text-primary" />
          <span>NexusERP</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Ativos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ACTIVE_MODULES.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.name}
                  >
                    <Link to={item.path}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Em Breve</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {UPCOMING_MODULES.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    tooltip={`${item.name} (Em Breve)`}
                    className="group/item opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <Link to={`/app/em-breve?module=${encodeURIComponent(item.name)}`}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          <span className="truncate">{item.name}</span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-[9px] h-4 px-1 py-0 bg-slate-800 text-slate-300 border-none group-hover/item:bg-primary group-hover/item:text-white transition-colors"
                        >
                          BREVE
                        </Badge>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-slate-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Settings className="w-4 h-4" />
                <span>Configurações</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <HelpCircle className="w-4 h-4" />
                <span>Ajuda</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
            >
              <Link to="/">
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
