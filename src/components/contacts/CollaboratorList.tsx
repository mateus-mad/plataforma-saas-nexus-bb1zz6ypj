import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
  Lock,
  EyeOff,
  Trash2,
  AlertTriangle,
} from 'lucide-react'

type Props = { onEdit: () => void; onProfile: () => void }

export default function CollaboratorList({ onEdit, onProfile }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const { toast } = useToast()

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

  const handleDelete = () => {
    if (password === 'admin123') {
      toast({ title: 'Sucesso', description: 'Colaborador excluído com segurança do sistema.' })
      setDeleteOpen(false)
      setPassword('')
      setPopoverOpen(false)
      setIsVisible(false) // Simulando a deleção
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: 'Senha incorreta para esta operação.',
      })
    }
  }

  if (!isVisible) return null

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-blue-200 rounded-xl bg-white hover:border-blue-400 transition-all shadow-sm relative group gap-4">
        <div className="absolute top-0 left-0 w-[45%] h-1 bg-blue-500 rounded-tl-xl transition-all duration-500"></div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-[60px] h-[60px] flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90 absolute inset-0">
              <circle
                cx="30"
                cy="30"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="30"
                cy="30"
                r={radius}
                className="stroke-blue-500 transition-all duration-1000 ease-out"
                strokeWidth="4"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <Avatar className="w-[42px] h-[42px] border-2 border-white z-10 shadow-sm">
              <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1" />
              <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-medium">
                MA
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white z-20 shadow-sm">
              {collaborator.completion}%
            </div>
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-800 text-base leading-none tracking-tight">
                {collaborator.name}
              </h3>
              <Badge
                variant="outline"
                className="text-[10px] h-5 font-mono text-slate-500 bg-slate-50"
              >
                #{collaborator.id.replace('# ', '')}
              </Badge>
            </div>
            <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-[13px] text-slate-500">
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

        <div className="flex items-center gap-2 w-full md:w-auto justify-end mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-100 md:border-none">
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm px-3 mr-2">
            {collaborator.status}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onProfile}
            className="h-8 text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100"
          >
            <Eye className="w-3.5 h-3.5 mr-2" /> Ficha
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-8 text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100"
          >
            <Edit2 className="w-3.5 h-3.5 mr-2" /> Editar
          </Button>

          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:bg-slate-100"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 p-0 rounded-xl border-amber-200 shadow-xl overflow-hidden bg-gradient-to-b from-white to-amber-50/20"
            >
              <div className="p-4 border-b border-amber-100">
                <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-2 text-base">
                  <Lock className="w-4 h-4 text-amber-600" /> Ações Sensíveis
                </h4>
                <p className="text-xs text-amber-700/80 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" /> Acesso
                  controlado e auditado. Todos os acessos são registrados.
                </p>
              </div>
              <div className="p-4 bg-white flex justify-between items-center group cursor-pointer hover:bg-slate-50 transition-colors">
                <span className="text-sm font-medium text-slate-700">Dados Pessoais</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-amber-700 hover:text-amber-800 hover:bg-amber-100 text-xs px-2"
                >
                  <EyeOff className="w-3.5 h-3.5 mr-1.5" /> Ocultar
                </Button>
              </div>
              <div className="p-2 border-t border-slate-100 bg-slate-50/80">
                <Button
                  variant="ghost"
                  onClick={() => setDeleteOpen(true)}
                  className="w-full justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-100/50 h-9 text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Exclusão Definitiva
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600 flex items-center gap-2">
              <Lock className="w-5 h-5" /> Confirmação de Segurança
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta é uma ação destrutiva. Para excluir definitivamente os registros de{' '}
              <b>{collaborator.name}</b>, confirme sua senha de administrador.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 space-y-2">
            <Label>Senha de Administrador</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha (admin123)"
              className="focus-visible:ring-rose-500"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPassword('')}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
