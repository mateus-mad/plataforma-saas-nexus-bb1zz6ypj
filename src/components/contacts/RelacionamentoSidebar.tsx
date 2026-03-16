import { Link } from 'react-router-dom'
import { LayoutDashboard, Users, UserSquare2, Truck, History } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  active: string
}

export default function RelacionamentoSidebar({ active }: Props) {
  const items = [
    {
      id: 'dashboard',
      label: 'BI & Insights',
      icon: LayoutDashboard,
      path: '/app/relacionamento',
    },
    {
      id: 'colaboradores',
      label: 'Colaboradores',
      icon: Users,
      badge: '12',
      path: '/app/relacionamento/colaboradores',
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: UserSquare2,
      badge: '45',
      path: '/app/relacionamento/clientes',
    },
    {
      id: 'fornecedores',
      label: 'Fornecedores',
      icon: Truck,
      badge: '8',
      path: '/app/relacionamento/fornecedores',
    },
    {
      id: 'auditoria',
      label: 'Histórico de Ações',
      icon: History,
      path: '/app/relacionamento/auditoria',
    },
  ]

  return (
    <div className="w-full shrink-0 p-2 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
        {items.map((item) => {
          const isActive = active === item.id || (active === undefined && item.id === 'dashboard')
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                'flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 min-w-fit',
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100 ring-1 ring-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent',
              )}
            >
              <div className="flex items-center gap-2">
                <item.icon
                  className={cn('w-4 h-4', isActive ? 'text-blue-600' : 'text-slate-400')}
                />
                {item.label}
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] ml-3',
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500',
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
