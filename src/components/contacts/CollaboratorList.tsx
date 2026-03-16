import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit2, Building2, Clock, CalendarDays, User } from 'lucide-react'

export default function CollaboratorList() {
  const collaborator = {
    name: 'Mateus amorim dias',
    id: '# COL0001',
    role: 'Engenheiro Civil',
    contract: 'Mensalista',
    since: 'Desde 07/02/2026',
    completion: 45,
    status: 'Ativo',
  }

  const radius = 26
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (collaborator.completion / 100) * circumference

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:border-blue-300 transition-all shadow-sm hover:shadow-md relative overflow-hidden group gap-4">
        <div className="absolute top-0 left-0 w-1/2 h-1 bg-blue-500 transition-all group-hover:w-full duration-500"></div>

        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="relative w-[68px] h-[68px] flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90 absolute inset-0">
              <circle
                cx="34"
                cy="34"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="34"
                cy="34"
                r={radius}
                className="stroke-blue-500 transition-all duration-1000 ease-out"
                strokeWidth="4"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <Avatar className="w-[46px] h-[46px] border-2 border-white z-10 shadow-sm">
              <AvatarFallback className="bg-blue-50 text-blue-600 font-medium">
                <User className="w-5 h-5 opacity-50" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap border-2 border-white z-20 shadow-sm">
              {collaborator.completion}%
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-semibold text-slate-800 text-[17px] leading-none tracking-tight">
                {collaborator.name}
              </h3>
              <Badge
                variant="outline"
                className="text-[10px] h-5 font-mono text-slate-500 bg-slate-50 border-slate-200 tracking-wider"
              >
                {collaborator.id}
              </Badge>
            </div>
            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> {collaborator.role}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {collaborator.contract}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" /> {collaborator.since}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-100 md:border-none">
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none shadow-sm shadow-blue-500/20 px-3 mr-1">
            {collaborator.status}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 mr-2 text-slate-400" /> Ficha
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800 shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5 mr-2 text-slate-400" /> Editar
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
