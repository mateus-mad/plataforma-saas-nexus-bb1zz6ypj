import { Link, useLocation } from 'react-router-dom'
import { Bell, Search, Hexagon, Zap } from 'lucide-react'
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

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] sticky top-0 z-50 transition-all">
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <div className="flex items-center gap-3 sm:gap-4 h-8">
          {/* Nexus ERP Logo */}
          <Link to="/app" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors group-hover:shadow-[0_0_12px_rgba(59,130,246,0.3)]">
              <Hexagon className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-slate-800 hidden lg:inline-block tracking-tight">
              Nexus<span className="text-primary font-normal">ERP</span>
            </span>
          </Link>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          {/* User Company Logo */}
          <Link to="/app" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 overflow-hidden group-hover:border-primary/30 transition-colors">
              <img
                src="https://img.usecurling.com/i?q=acme&color=blue&shape=outline"
                alt="Company Logo"
                className="w-5 h-5 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="flex-col hidden sm:flex">
              <span className="text-[10px] text-slate-400 font-medium leading-none mb-0.5 uppercase tracking-wide">
                Workspace
              </span>
              <span className="font-semibold text-slate-700 text-sm leading-none group-hover:text-primary transition-colors">
                Acme Corp
              </span>
            </div>
          </Link>
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

        {/* Quick Action Button (Store) */}
        <Link
          to="/app/configuracoes?tab=modules"
          className="relative p-2 flex items-center justify-center text-primary bg-primary/5 hover:bg-primary/10 rounded-full transition-all border border-primary/20 hover:border-primary/40 shadow-[0_0_10px_rgba(59,130,246,0.1)] group"
          title="Loja de Módulos"
        >
          <Zap className="w-4 h-4 text-primary drop-shadow-[0_0_5px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform" />
        </Link>

        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-primary rounded-full transition-colors border border-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-white shadow-sm"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 rounded-xl border-slate-200 shadow-lg p-2 z-[60]"
            sideOffset={8}
          >
            <div className="px-2 py-1.5 pb-2 border-b border-slate-100 mb-1">
              <h4 className="font-semibold text-sm text-slate-800">Notificações</h4>
            </div>
            <div className="flex flex-col gap-1 max-h-[300px] overflow-auto">
              <div className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-800 group-hover:text-primary transition-colors">
                    Fatura disponível
                  </p>
                  <p className="text-xs text-slate-500 leading-snug">
                    Sua fatura referente a Maio/2026 já está disponível para pagamento no painel.
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-300 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-800 group-hover:text-primary transition-colors">
                    Novo módulo liberado
                  </p>
                  <p className="text-xs text-slate-500 leading-snug">
                    O módulo de Gestão de Frotas acaba de ser liberado na loja. Aproveite as
                    novidades!
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">Há 1 dia</p>
                </div>
              </div>
            </div>
            <div className="pt-2 mt-1 border-t border-slate-100">
              <button className="w-full text-center text-xs text-primary font-medium hover:underline p-1 rounded hover:bg-primary/5 transition-colors">
                Marcar todas como lidas
              </button>
            </div>
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
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl border-slate-200 shadow-elevation z-[60]"
          >
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-slate-800">Admin Silva</p>
                <p className="text-xs leading-none text-slate-500 mt-1">admin@nexuserp.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem className="cursor-pointer">Meu Perfil</DropdownMenuItem>
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
