import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Building2, Clock, CalendarDays } from 'lucide-react'

type Props = {
  onEdit: () => void
  onProfile: () => void
}

export default function CollaboratorKanban({ onEdit, onProfile }: Props) {
  const columns = [
    {
      title: 'Ativos',
      color: 'border-emerald-500',
      bg: 'bg-emerald-500',
      items: [
        {
          name: 'Mateus Amorim Dias',
          role: 'Engenheiro Civil',
          contract: 'Mensalista',
          status: 'Ativo',
          img: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
        },
        {
          name: 'Ana Beatriz Souza',
          role: 'Arquiteta',
          contract: 'Mensalista',
          status: 'Ativo',
          img: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
        },
      ],
    },
    {
      title: 'Em Férias',
      color: 'border-amber-500',
      bg: 'bg-amber-500',
      items: [
        {
          name: 'Carlos Santos',
          role: 'Mestre de Obras',
          contract: 'Horista',
          status: 'Férias',
          img: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
        },
      ],
    },
    {
      title: 'Afastados',
      color: 'border-rose-500',
      bg: 'bg-rose-500',
      items: [],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500 items-start">
      {columns.map((col) => (
        <div
          key={col.title}
          className={`bg-slate-50/70 rounded-xl border-t-4 ${col.color} p-4 space-y-4 shadow-sm h-full min-h-[500px]`}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
              {col.title}
            </h3>
            <span className="bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {col.items.length}
            </span>
          </div>

          {col.items.length === 0 ? (
            <div className="text-center p-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
              Nenhum colaborador nesta lista.
            </div>
          ) : (
            col.items.map((item, idx) => (
              <div
                key={idx}
                onClick={onProfile}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10 border border-slate-100">
                    <AvatarImage src={item.img} />
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-medium">
                      {item.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                      <Building2 className="w-3 h-3" /> {item.role}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <Badge variant="outline" className="text-[10px] font-medium bg-slate-50">
                    {item.contract}
                  </Badge>
                  <div className={`w-2 h-2 rounded-full ${col.bg}`} title={item.status} />
                </div>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  )
}
