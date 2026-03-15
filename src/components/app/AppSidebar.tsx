import { Link, useLocation } from 'react-router-dom'
import { Hexagon, Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import { MENU_CATEGORIES } from '@/config/modules'
import useModuleStore from '@/stores/useModuleStore'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const location = useLocation()
  const currentFullPath = decodeURIComponent(location.pathname + location.search)
  const { contractedModules } = useModuleStore()

  const visibleCategories = MENU_CATEGORIES.map((category) => {
    if (category.path) return category

    if (category.items) {
      const visibleItems = category.items.filter((item) => contractedModules.includes(item.name))
      return { ...category, items: visibleItems }
    }
    return category
  }).filter((category) => category.path || (category.items && category.items.length > 0))

  return (
    <Sidebar className="border-r border-slate-800/60 bg-[#0A0F1C]" variant="sidebar">
      <SidebarHeader className="p-4 border-b border-slate-800/60 bg-[#0A0F1C]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 px-2">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
            <Hexagon className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          </div>
          <span className="font-bold text-lg text-slate-100 tracking-wide">
            Nexus<span className="text-primary font-light">ERP</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#0A0F1C] pt-4 custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {visibleCategories.map((category) => {
                const isActive = category.path
                  ? currentFullPath === decodeURIComponent(category.path) ||
                    location.pathname === category.path
                  : category.items?.some((i) => currentFullPath === decodeURIComponent(i.path))

                const isItemHoverable = category.items && category.items.length > 0

                const CategoryButton = (
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'relative overflow-hidden transition-all duration-300 h-10 px-3 mx-2 rounded-lg border border-transparent group/cat w-[calc(100%-1rem)]',
                      isActive
                        ? 'bg-primary/10 border-primary/30 text-primary shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 hover:border-slate-700/50',
                    )}
                  >
                    {category.path ? (
                      <Link to={category.path} className="flex items-center w-full gap-3">
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)] rounded-r-full" />
                        )}
                        <category.icon
                          className={cn(
                            'w-5 h-5 transition-all duration-300 shrink-0',
                            isActive
                              ? 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'
                              : 'group-hover/cat:text-primary/70',
                          )}
                        />
                        <span className="flex-1 font-medium tracking-wide">{category.name}</span>
                      </Link>
                    ) : (
                      <button className="flex items-center w-full gap-3 cursor-default">
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)] rounded-r-full" />
                        )}
                        <category.icon
                          className={cn(
                            'w-5 h-5 transition-all duration-300 shrink-0',
                            isActive
                              ? 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'
                              : 'group-hover/cat:text-primary/70',
                          )}
                        />
                        <span className="flex-1 font-medium tracking-wide text-left">
                          {category.name}
                        </span>
                        <ChevronRight
                          className={cn(
                            'w-4 h-4 transition-transform opacity-50 shrink-0',
                            isActive && 'text-primary opacity-100',
                          )}
                        />
                      </button>
                    )}
                  </SidebarMenuButton>
                )

                if (isItemHoverable) {
                  return (
                    <SidebarMenuItem key={category.name}>
                      <HoverCard openDelay={0} closeDelay={150}>
                        <HoverCardTrigger asChild>{CategoryButton}</HoverCardTrigger>
                        <HoverCardContent
                          side="right"
                          align="start"
                          sideOffset={16}
                          className="w-72 p-0 bg-[#0F1524]/95 backdrop-blur-xl border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.1)] text-slate-200 overflow-hidden rounded-xl z-[100] animate-in slide-in-from-left-2 fade-in duration-200"
                        >
                          <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/30">
                            <div className="flex items-center gap-2">
                              <category.icon className="w-4 h-4 text-primary" />
                              <h4 className="font-semibold text-sm text-slate-100 tracking-wide">
                                {category.name}
                              </h4>
                            </div>
                          </div>
                          <div className="p-2 flex flex-col gap-1">
                            {category.items?.map((item) => {
                              const isSubActive = currentFullPath === decodeURIComponent(item.path)
                              return (
                                <Link
                                  to={item.path}
                                  key={item.name}
                                  className={cn(
                                    'flex items-start gap-3 p-2 rounded-lg transition-all duration-200 group/subitem relative overflow-hidden',
                                    isSubActive
                                      ? 'bg-primary/10 border border-primary/20'
                                      : 'hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50',
                                  )}
                                >
                                  {isSubActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />
                                  )}
                                  <div
                                    className={cn(
                                      'mt-0.5 rounded-md p-1.5 transition-colors',
                                      isSubActive
                                        ? 'bg-primary/20'
                                        : 'bg-slate-800/80 group-hover/subitem:bg-slate-700',
                                    )}
                                  >
                                    <item.icon
                                      className={cn(
                                        'w-3.5 h-3.5 transition-all',
                                        isSubActive
                                          ? 'text-primary drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]'
                                          : 'text-slate-400 group-hover/subitem:text-primary/80',
                                      )}
                                    />
                                  </div>
                                  <div className="flex-1 flex flex-col gap-0.5">
                                    <div className="flex items-center justify-between">
                                      <span
                                        className={cn(
                                          'text-sm font-medium',
                                          isSubActive
                                            ? 'text-slate-100'
                                            : 'text-slate-300 group-hover/subitem:text-slate-100',
                                        )}
                                      >
                                        {item.name}
                                      </span>
                                      {item.isUpcoming && (
                                        <Badge
                                          variant="outline"
                                          className="text-[9px] h-4 px-1.5 py-0 border-primary/30 text-primary bg-primary/5 uppercase font-bold tracking-wider"
                                        >
                                          Breve
                                        </Badge>
                                      )}
                                    </div>
                                    {item.description && (
                                      <span className="text-xs text-slate-500 group-hover/subitem:text-slate-400 transition-colors line-clamp-1">
                                        {item.description}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              )
                            })}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </SidebarMenuItem>
                  )
                }

                return <SidebarMenuItem key={category.name}>{CategoryButton}</SidebarMenuItem>
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-800/60 bg-[#0A0F1C]/80 backdrop-blur-md">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                'transition-colors rounded-lg',
                location.pathname === '/app/configuracoes'
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50',
              )}
            >
              <Link to="/app/configuracoes">
                <Settings className="w-4 h-4" />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors rounded-lg"
            >
              <a href="#">
                <HelpCircle className="w-4 h-4" />
                <span>Suporte e Ajuda</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="mt-2 text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 border border-transparent transition-all rounded-lg"
            >
              <Link to="/">
                <LogOut className="w-4 h-4" />
                <span>Sair da Plataforma</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
