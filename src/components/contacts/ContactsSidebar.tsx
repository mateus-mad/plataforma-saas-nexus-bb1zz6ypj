import { LayoutDashboard, Users, UserSquare2, Truck, History } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  active: string
  onChange: (v: any) => void
}

export default function ContactsSidebar({ active, onChange }: Props) {
  const items = [
    { id: 'dashboard', label: 'Dashboard RH', icon: LayoutDashboard },
    { id: 'colaboradores', label: 'Colaboradores', icon: Users, badge: '12' },
    { id: 'clientes', label: 'Clientes', icon: UserSquare2, badge: '45' },
    { id: 'fornecedores', label: 'Fornecedores', icon: Truck, badge: '8' },
    { id: 'auditoria', label: 'Histórico de Auditoria', icon: History },
  ]

  return (
    <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 p-4 bg-white border border-slate-200 rounded-xl shadow-sm h-auto md:h-full">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
        Módulo Contatos
      </h3>
      <div className="flex md:flex-col overflow-x-auto custom-scrollbar pb-2 md:pb-0 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              'flex items-center justify-between w-full p-2.5 rounded-lg text-sm font-medium transition-all shrink-0 md:shrink',
              active === item.id
                ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                : 'text-slate-600 hover:bg-slate-50 border border-transparent',
            )}
          >
            <div className="flex items-center gap-2.5">
              <item.icon
                className={cn('w-4 h-4', active === item.id ? 'text-blue-600' : 'text-slate-400')}
              />
              {item.label}
            </div>
            {item.badge && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] hidden md:block',
                  active === item.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500',
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
