import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Hexagon,
  Settings,
  LogOut,
  ChevronRight,
  Pin,
  PinOff,
  LayoutDashboard,
  Users,
  Truck,
  History,
  Clock,
} from 'lucide-react'
import { MENU_CATEGORIES, MANAGER_MENU_CATEGORIES } from '@/config/modules'
import useModuleStore from '@/stores/useModuleStore'
import useSecurityStore from '@/stores/useSecurityStore'
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
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const location = useLocation()
  const currentFullPath = decodeURIComponent(location.pathname + location.search)
  const { contractedModules } = useModuleStore()
  const { isAdminMode } = useSecurityStore()
  const { state, setOpen, isMobile, setOpenMobile } = useSidebar()

  const [isPinned, setIsPinned] = useState(() => localStorage.getItem('sidebarPinned') === 'true')

  useEffect(() => {
    localStorage.setItem('sidebarPinned', String(isPinned))
    if (isPinned && !isMobile) {
      setOpen(true)
    }
  }, [isPinned, isMobile, setOpen])

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    } else if (!isPinned) {
      setOpen(false)
    }
  }

  const handleMouseEnter = () => {
    if (!isPinned && !isMobile) setOpen(true)
  }

  const handleMouseLeave = () => {
    if (!isPinned && !isMobile) setOpen(false)
  }

  const togglePin = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newPinned = !isPinned
    setIsPinned(newPinned)
    if (!newPinned && !isMobile) {
      setOpen(false)
    }
  }

  const categoriesToRender = isAdminMode ? MANAGER_MENU_CATEGORIES : MENU_CATEGORIES

  const visibleCategories = categoriesToRender
    .map((category) => {
      if (isAdminMode) return category

      if (category.path) {
        const alwaysVisible = ['Dashboard', 'Início', 'Contatos', 'Visão Geral']
        if (alwaysVisible.includes(category.name) || contractedModules.includes(category.name)) {
          return category
        }
        return null
      }

      if (category.items) {
        const visibleItems = category.items.filter((item: any) => {
          if (item.requireAdmin && !isAdminMode) return false
          return (
            category.name === 'Contatos' ||
            contractedModules.includes(item.name) ||
            contractedModules.includes(category.name)
          )
        })
        return { ...category, items: visibleItems }
      }
      return category
    })
    .filter(
      (category) => category && (category.path || (category.items && category.items.length > 0)),
    )

  return (
    <Sidebar
      className={cn('border-r border-slate-800/60', isAdminMode ? 'bg-[#1E1033]' : 'bg-[#0A0F1C]')}
      variant="sidebar"
      collapsible="icon"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarHeader
        className={cn(
          'p-4 border-b transition-colors group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center',
          isAdminMode
            ? 'border-purple-900/40 bg-[#1E1033]/80'
            : 'border-slate-800/60 bg-[#0A0F1C]/80',
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1 overflow-hidden w-full">
            <div
              className={cn(
                'relative flex items-center justify-center w-8 h-8 rounded-lg border shrink-0 transition-transform group-hover:scale-105',
                isAdminMode
                  ? 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : 'bg-primary/10 border-primary/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
              )}
            >
              <Hexagon
                className={cn(
                  'w-5 h-5',
                  isAdminMode
                    ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                    : 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]',
                )}
              />
            </div>
            <span className="font-bold text-lg text-slate-100 tracking-wide truncate group-data-[collapsible=icon]:hidden transition-opacity">
              Nexus
              <span className={cn('font-light', isAdminMode ? 'text-purple-400' : 'text-primary')}>
                {isAdminMode ? 'Manager' : 'ERP'}
              </span>
            </span>
          </div>
          <button
            onClick={togglePin}
            className={cn(
              'p-1.5 rounded-md transition-colors group-data-[collapsible=icon]:hidden shrink-0',
              isPinned
                ? 'bg-primary/20 text-primary'
                : 'text-slate-500 hover:text-slate-100 hover:bg-slate-800/50',
            )}
            title={isPinned ? 'Desafixar Sidebar' : 'Fixar Sidebar expandida'}
          >
            {isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent
        className={cn('pt-4 custom-scrollbar', isAdminMode ? 'bg-[#1E1033]' : 'bg-[#0A0F1C]')}
      >
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {visibleCategories.map((category) => {
                const isActive = category.path
                  ? currentFullPath === decodeURIComponent(category.path) ||
                    location.pathname === category.path ||
                    (category.name === 'Controle de Ponto' &&
                      location.pathname.startsWith('/app/controle-de-ponto'))
                  : category.items?.some((i) => currentFullPath === decodeURIComponent(i.path)) ||
                    (category.name === 'Controle de Ponto' &&
                      location.pathname.startsWith('/app/controle-de-ponto'))

                const isItemHoverable = category.items && category.items.length > 0

                const CategoryButton = (
                  <SidebarMenuButton
                    asChild
                    tooltip={!isItemHoverable ? category.name : undefined}
                    className={cn(
                      'relative overflow-hidden transition-all duration-300 h-11 px-3 mx-2 rounded-lg border border-transparent group/cat w-auto group-data-[collapsible=icon]:mx-1',
                      isActive
                        ? isAdminMode
                          ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[inset_0_0_20px_rgba(168,85,247,0.15)]'
                          : 'bg-primary/10 border-primary/30 text-primary shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]'
                        : isAdminMode
                          ? 'text-purple-200/60 hover:bg-purple-900/40 hover:text-purple-100 hover:border-purple-800/50'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 hover:border-slate-700/50',
                    )}
                  >
                    {category.path ? (
                      <Link
                        to={category.path}
                        onClick={handleLinkClick}
                        className="flex items-center w-full gap-3"
                      >
                        {isActive && (
                          <div
                            className={cn(
                              'absolute left-0 top-0 bottom-0 w-1 rounded-r-full',
                              isAdminMode
                                ? 'bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                                : 'bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]',
                            )}
                          />
                        )}
                        <category.icon
                          className={cn(
                            'w-5 h-5 transition-all duration-300 shrink-0',
                            isActive
                              ? isAdminMode
                                ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                                : 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'
                              : isAdminMode
                                ? 'group-hover/cat:text-purple-300/80'
                                : 'group-hover/cat:text-primary/70',
                          )}
                        />
                        <span className="flex-1 font-medium tracking-wide truncate group-data-[collapsible=icon]:hidden">
                          {category.name}
                        </span>
                      </Link>
                    ) : (
                      <button className="flex items-center w-full gap-3 cursor-default">
                        {isActive && (
                          <div
                            className={cn(
                              'absolute left-0 top-0 bottom-0 w-1 rounded-r-full',
                              isAdminMode
                                ? 'bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                                : 'bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]',
                            )}
                          />
                        )}
                        <category.icon
                          className={cn(
                            'w-5 h-5 transition-all duration-300 shrink-0',
                            isActive
                              ? isAdminMode
                                ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                                : 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'
                              : isAdminMode
                                ? 'group-hover/cat:text-purple-300/80'
                                : 'group-hover/cat:text-primary/70',
                          )}
                        />
                        <span className="flex-1 font-medium tracking-wide text-left truncate group-data-[collapsible=icon]:hidden">
                          {category.name}
                        </span>
                        <ChevronRight
                          className={cn(
                            'w-4 h-4 transition-transform opacity-50 shrink-0 group-data-[collapsible=icon]:hidden',
                            isActive &&
                              (isAdminMode
                                ? 'text-purple-400 opacity-100'
                                : 'text-primary opacity-100'),
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
                          className={cn(
                            'w-72 p-0 backdrop-blur-xl border shadow-xl overflow-hidden rounded-xl z-[100] animate-in slide-in-from-left-2 fade-in duration-200',
                            isAdminMode
                              ? 'bg-[#2A1647]/95 border-purple-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(168,85,247,0.15)] text-purple-100'
                              : 'bg-[#0F1524]/95 border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.1)] text-slate-200',
                          )}
                        >
                          <div
                            className={cn(
                              'px-4 py-3 border-b',
                              isAdminMode
                                ? 'border-purple-800/50 bg-purple-950/40'
                                : 'border-slate-700/50 bg-slate-800/30',
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <category.icon
                                className={cn(
                                  'w-4 h-4',
                                  isAdminMode ? 'text-purple-400' : 'text-primary',
                                )}
                              />
                              <h4 className="font-semibold text-sm tracking-wide">
                                {category.name}
                              </h4>
                            </div>
                          </div>
                          <div className="p-2 flex flex-col gap-1">
                            {category.items?.map((item) => {
                              const isSubActive = currentFullPath === decodeURIComponent(item.path)
                              return (
                                <Link
                                  key={item.name}
                                  to={item.path}
                                  onClick={handleLinkClick}
                                  className={cn(
                                    'flex items-start gap-3 p-2 min-h-[44px] rounded-lg transition-all duration-200 group/subitem relative overflow-hidden',
                                    isSubActive
                                      ? isAdminMode
                                        ? 'bg-purple-500/20 border border-purple-500/30'
                                        : 'bg-primary/10 border border-primary/20'
                                      : isAdminMode
                                        ? 'hover:bg-purple-900/50 border border-transparent hover:border-purple-800/50'
                                        : 'hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50',
                                  )}
                                >
                                  {isSubActive && (
                                    <div
                                      className={cn(
                                        'absolute left-0 top-0 bottom-0 w-[2px]',
                                        isAdminMode ? 'bg-purple-400' : 'bg-primary',
                                      )}
                                    />
                                  )}
                                  <div
                                    className={cn(
                                      'mt-0.5 rounded-md p-1.5 transition-colors',
                                      isSubActive
                                        ? isAdminMode
                                          ? 'bg-purple-500/30'
                                          : 'bg-primary/20'
                                        : isAdminMode
                                          ? 'bg-purple-950/80 group-hover/subitem:bg-purple-900'
                                          : 'bg-slate-800/80 group-hover/subitem:bg-slate-700',
                                    )}
                                  >
                                    <item.icon
                                      className={cn(
                                        'w-3.5 h-3.5 transition-all',
                                        isSubActive
                                          ? isAdminMode
                                            ? 'text-purple-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]'
                                            : 'text-primary drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]'
                                          : isAdminMode
                                            ? 'text-purple-400/60 group-hover/subitem:text-purple-300'
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
                                            ? isAdminMode
                                              ? 'text-purple-100'
                                              : 'text-slate-100'
                                            : isAdminMode
                                              ? 'text-purple-200 group-hover/subitem:text-purple-100'
                                              : 'text-slate-300 group-hover/subitem:text-slate-100',
                                        )}
                                      >
                                        {item.name}
                                      </span>
                                      {item.isUpcoming && (
                                        <Badge
                                          variant="outline"
                                          className={cn(
                                            'text-[9px] h-4 px-1.5 py-0 uppercase font-bold tracking-wider',
                                            isAdminMode
                                              ? 'border-purple-400/30 text-purple-300 bg-purple-500/10'
                                              : 'border-primary/30 text-primary bg-primary/5',
                                          )}
                                        >
                                          Breve
                                        </Badge>
                                      )}
                                    </div>
                                    {item.description && (
                                      <span
                                        className={cn(
                                          'text-xs transition-colors line-clamp-1',
                                          isAdminMode
                                            ? 'text-purple-300/60 group-hover/subitem:text-purple-300/80'
                                            : 'text-slate-500 group-hover/subitem:text-slate-400',
                                        )}
                                      >
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

      <SidebarFooter
        className={cn(
          'p-4 border-t group-data-[collapsible=icon]:p-2',
          isAdminMode
            ? 'border-purple-900/40 bg-[#1E1033]/80'
            : 'border-slate-800/60 bg-[#0A0F1C]/80',
        )}
      >
        <SidebarMenu>
          {!isAdminMode && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Configurações"
                className={cn(
                  'transition-colors rounded-lg group-data-[collapsible=icon]:mx-1',
                  location.pathname.startsWith('/app/configuracoes')
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50',
                )}
              >
                <Link to="/app/configuracoes" onClick={handleLinkClick}>
                  <Settings className="w-4 h-4 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">Configurações</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Sair"
              className={cn(
                'mt-2 border border-transparent transition-all rounded-lg group-data-[collapsible=icon]:mx-1',
                isAdminMode
                  ? 'text-rose-300 hover:text-rose-200 hover:bg-rose-500/20'
                  : 'text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10',
              )}
            >
              <Link to="/" onClick={handleLinkClick}>
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">Sair da Plataforma</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
