import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Hexagon, Check, ChevronDown, ShieldAlert, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import useTenantStore from '@/stores/useTenantStore'
import useSecurityStore from '@/stores/useSecurityStore'

export function AppHeader() {
  const navigate = useNavigate()
  const { currentTenant, tenants, switchTenant } = useTenantStore()
  const { isAdminMode, loginAsManager, switchToClientMode, isSetup, lock } = useSecurityStore()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] sticky top-0 z-50 transition-all">
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <div className="flex items-center gap-3 sm:gap-4 h-8">
          <Link
            to={isAdminMode ? '/app/manager' : '/app'}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${isAdminMode ? 'bg-purple-100 border-purple-200 text-purple-600 group-hover:bg-purple-200 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]' : 'bg-blue-50 border-blue-200 text-blue-600 group-hover:bg-blue-100 group-hover:shadow-[0_0_12px_rgba(37,99,235,0.3)]'}`}
            >
              <Hexagon className="w-4 h-4 fill-current opacity-20" />
            </div>
            <span className="font-bold text-slate-800 hidden lg:inline-block tracking-tight">
              Nexus
              <span
                className={
                  isAdminMode ? 'text-purple-600 font-normal' : 'text-blue-600 font-normal'
                }
              >
                {isAdminMode ? 'Manager' : 'ERP'}
              </span>
            </span>
          </Link>

          {isAdminMode ? (
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 shadow-none h-6 px-2 text-[10px] uppercase tracking-wider hidden sm:flex">
              SaaS Admin
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-slate-100 text-slate-600 border-slate-200 h-6 px-2 text-[10px] uppercase tracking-wider hidden sm:flex"
            >
              SaaS Client
            </Badge>
          )}

          <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>

          <h1 className="text-[17px] font-bold text-blue-600 tracking-tight hidden md:block ml-2">
            Bem-vindo, mateus!
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-end">
        {isSetup && (
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={lock}
                  className="p-2 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:bg-rose-100 hover:text-rose-600 hover:border-rose-200 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Bloquear Cofre</TooltipContent>
            </Tooltip>
          </div>
        )}

        <div className="hidden lg:flex items-center gap-3 mr-2">
          <button className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200 outline-none text-slate-600">
            <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600">
              <span className="font-bold text-xs">M</span>
            </div>
            <span className="text-sm font-medium">mateus</span>
          </button>

          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-600 border-slate-200 font-medium"
          >
            <Hexagon className="w-3 h-3 mr-1.5 text-slate-400" /> ENG Consultor
          </Badge>

          <button className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              2
            </span>
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-blue-500/30 hover:ring-offset-2 transition-all border-2 border-blue-100">
              <AvatarImage
                src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=42"
                alt="@user"
              />
              <AvatarFallback className="bg-blue-600 text-white font-semibold">MA</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 rounded-xl z-[60] mt-2 shadow-lg border-slate-200"
          >
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1 p-1">
                <p className="text-sm font-semibold leading-none text-slate-800">
                  {isAdminMode ? 'Platform Owner' : 'Mateus Amorim Dias'}
                </p>
                <p className="text-xs leading-none text-slate-500 mt-1">
                  {isAdminMode ? 'sysadmin@nexuserp.com' : 'mateus@engconsultor.com'}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-slate-100" />
            <div className="px-2 py-1.5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Empresa Atual
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-between w-full p-2 rounded-md hover:bg-slate-50 border border-slate-100 transition-colors text-left">
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {currentTenant?.name || 'Selecione...'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 rounded-xl border-slate-200 z-[70]"
                >
                  {tenants.map((t) => (
                    <DropdownMenuItem
                      key={t.id}
                      onClick={() => switchTenant(t.id)}
                      className="flex items-center justify-between cursor-pointer py-2"
                    >
                      <span className="font-medium text-slate-800">{t.name}</span>
                      {t.id === currentTenant?.id && <Check className="w-4 h-4 text-blue-600" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem
              onClick={() => {
                if (isAdminMode) {
                  switchToClientMode()
                  navigate('/app')
                } else {
                  loginAsManager()
                  navigate('/app/manager')
                }
              }}
              className={`cursor-pointer font-medium py-2.5 ${isAdminMode ? 'text-slate-700 focus:bg-slate-100' : 'text-blue-600 focus:text-blue-700 focus:bg-blue-50'}`}
            >
              <ShieldAlert className="w-4 h-4 mr-2" />
              {isAdminMode ? 'Alternar para nexusErp' : 'Alternar para SaaS Manager'}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem
              className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer py-2.5"
              onClick={() => navigate('/')}
            >
              Sair da Plataforma
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
