import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import {
  MoreHorizontal,
  Eye,
  Edit2,
  Building2,
  Clock,
  CalendarDays,
  User,
  AlertTriangle,
  ShieldAlert,
  Trash2,
} from 'lucide-react'

type Props = { onEdit: () => void; onProfile: () => void }

export default function CollaboratorList({ onEdit, onProfile }: Props) {
  const [warningOpen, setWarningOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { toast } = useToast()

  const collaborator = {
    name: 'Mateus Amorim Dias',
    id: '# COL0001',
    role: 'Engenheiro Civil',
    contract: 'Mensalista',
    since: 'Desde 07/02/2026',
    completion: 85,
    status: 'Ativo',
  }

  const radius = 26
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (collaborator.completion / 100) * circumference

  const handleAction = (msg: string) => {
    toast({ title: 'Ação Processada', description: msg })
  }

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
              <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1" />
              <AvatarFallback className="bg-blue-50 text-blue-600 font-medium">MD</AvatarFallback>
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
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-sm px-3 mr-1">
            {collaborator.status}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onProfile}
            className="h-8 text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 mr-2 text-slate-400" /> Ficha
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-8 text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5 mr-2 text-slate-400" /> Editar
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setWarningOpen(true)} className="cursor-pointer">
                <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> Aplicar Advertência
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}} className="cursor-pointer">
                <ShieldAlert className="w-4 h-4 mr-2 text-orange-500" /> Registrar Suspensão
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-rose-600 cursor-pointer focus:text-rose-600 focus:bg-rose-50"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Demitir Colaborador
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={warningOpen} onOpenChange={setWarningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aplicar Advertência</AlertDialogTitle>
            <AlertDialogDescription>
              Confirma a emissão formal de advertência para {collaborator.name}? Esta ação será
              registrada no histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleAction('Advertência registrada com sucesso.')}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Confirmar Advertência
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Processo de Demissão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a iniciar o processo de desligamento de {collaborator.name}. Esta
              ação é irreversível e notificará o setor contábil.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleAction('Processo de desligamento iniciado.')}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Demitir Colaborador
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
