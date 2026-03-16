import { Link, useLocation } from 'react-router-dom'
import { Bell, Search, Hexagon, Zap, Check, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useTenantStore from '@/stores/useTenantStore'

const PATH_MAP: Record<string, string> = {
  '/app': 'Dashboard',
  '/app/contatos': 'Contatos',
  '/app/financeiro': 'Financeiro',
  '/app/configuracoes': 'Configurações',
  '/app/em-breve': 'Módulo em Desenvolvimento',
}

export function AppHeader() {
  const location = useLocation()
  const pathName = PATH_MAP[location.pathname] || 'Visão Geral'
  const { currentTenant, tenants, switchTenant } = useTenantStore()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] sticky top-0 z-50 transition-all">
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <div className="flex items-center gap-3 sm:gap-4 h-8">
          <Link to="/app" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors group-hover:shadow-[0_0_12px_rgba(59,130,246,0.3)]">
              <Hexagon className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-slate-800 hidden lg:inline-block tracking-tight">
              Nexus<span className="text-primary font-normal">ERP</span>
            </span>
          </Link>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 group cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200 outline-none">
                <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center border border-indigo-100 overflow-hidden">
                  <span className="font-bold text-indigo-600 text-sm">
                    {currentTenant?.name.charAt(0) || 'E'}
                  </span>
                </div>
                <div className="flex-col hidden sm:flex text-left">
                  <span className="text-[10px] text-slate-400 font-medium leading-none mb-0.5 uppercase tracking-wide">
                    Workspace
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-700 text-sm leading-none group-hover:text-primary transition-colors">
                      {currentTenant?.name || 'Selecione...'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 rounded-xl border-slate-200 z-[60]">
              <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider">
                Mudar de Empresa
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tenants.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => switchTenant(t.id)}
                  className="flex items-center justify-between cursor-pointer py-2"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800">{t.name}</span>
                    <span className="text-xs text-slate-500">CNPJ: {t.cnpj}</span>
                  </div>
                  {t.id === currentTenant?.id && <Check className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer text-primary py-2">
                <Link to="/app/configuracoes?tab=tenants">Gerenciar Empresas (Multi-CNPJ)</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden xl:flex h-6 w-px bg-slate-200 mx-2"></div>

        <Breadcrumb className="hidden xl:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-muted-foreground">App</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-primary">{pathName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-end">
        <div className="relative w-full max-w-[280px] hidden md:flex group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Buscar na plataforma..."
            className="w-full bg-slate-100/50 border-slate-200 pl-9 rounded-full focus-visible:ring-primary/30 focus-visible:border-primary/50 focus-visible:bg-white transition-all shadow-none h-9"
          />
        </div>

        <Link
          to="/app/configuracoes?tab=modules"
          className="relative p-2 flex items-center justify-center text-primary bg-primary/5 hover:bg-primary/10 rounded-full transition-all border border-primary/20 hover:border-primary/40 shadow-[0_0_10px_rgba(59,130,246,0.1)] group"
          title="Loja de Módulos"
        >
          <Zap className="w-4 h-4 text-primary drop-shadow-[0_0_5px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform" />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-primary rounded-full transition-colors border border-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-white shadow-sm"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-xl z-[60]" sideOffset={8}>
            <div className="px-2 py-1.5 pb-2 border-b border-slate-100 mb-1">
              <h4 className="font-semibold text-sm text-slate-800">Notificações</h4>
            </div>
            <div className="p-4 text-center text-sm text-slate-500">Nenhuma nova notificação</div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary/30 hover:ring-offset-2 transition-all border border-slate-200">
              <AvatarImage
                src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=42"
                alt="@user"
              />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl z-[60]">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-slate-800">Admin Silva</p>
                <p className="text-xs leading-none text-slate-500 mt-1">admin@nexuserp.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/app/configuracoes?tab=billing">Faturamento e Licenças</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/app/configuracoes">Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer">
              Sair da Plataforma
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
