import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import {
  MoreHorizontal,
  Eye,
  Edit2,
  Building2,
  Clock,
  Lock,
  Trash2,
  AlertTriangle,
  UserMinus,
  UserCheck,
} from 'lucide-react'

type Props = {
  onEdit: () => void
  onProfile: () => void
  sectorFilter: string
  search: string
}

const MOCK_COLABS = [
  {
    id: '# COL0001',
    name: 'Mateus amorim dias',
    role: 'Engenheiro Civil',
    sector: 'Civil',
    contract: 'Mensalista',
    status: 'Ativo',
    completion: 85,
    img: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
  },
  {
    id: '# COL0002',
    name: 'Ana Souza',
    role: 'Técnica Solar',
    sector: 'Solar',
    contract: 'Mensalista',
    status: 'Ativo',
    completion: 100,
    img: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
  },
  {
    id: '# COL0003',
    name: 'Carlos Mendes',
    role: 'Soldador',
    sector: 'Metalúrgica',
    contract: 'Horista',
    status: 'Ativo',
    completion: 60,
    img: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
  },
]

export default function CollaboratorList({ onEdit, onProfile, sectorFilter, search }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1)
  const [password, setPassword] = useState('')
  const [activeItem, setActiveItem] = useState<any>(null)
  const [deletedIds, setDeletedIds] = useState<string[]>([])
  const [statuses, setStatuses] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const filtered = MOCK_COLABS.filter((c) => {
    if (deletedIds.includes(c.id)) return false
    if (sectorFilter !== 'Todos' && c.sector !== sectorFilter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const openDeleteModal = (item: any) => {
    setActiveItem(item)
    setDeleteStep(1)
    setPassword('')
    setDeleteOpen(true)
  }

  const handleDelete = () => {
    if (password === 'admin123') {
      toast({ title: 'Sucesso', description: 'Colaborador excluído com segurança do sistema.' })
      setDeletedIds((p) => [...p, activeItem.id])
      setDeleteOpen(false)
      setPassword('')
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: 'Senha incorreta para esta operação.',
      })
    }
  }

  const handleToggleStatus = (item: any) => {
    const currentStatus = statuses[item.id] || item.status
    const isDismissing = currentStatus === 'Ativo'
    const nextStatus = isDismissing ? 'Desligado' : 'Ativo'

    setStatuses((p) => ({ ...p, [item.id]: nextStatus }))

    toast({
      title: isDismissing ? 'Processo de Demissão' : 'Readmissão Concluída',
      description: isDismissing
        ? 'O colaborador foi marcado como desligado no sistema.'
        : 'Colaborador reintegrado ao quadro de ativos.',
    })
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center p-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
        Nenhum colaborador encontrado para os filtros selecionados.
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      {filtered.map((c) => {
        const status = statuses[c.id] || c.status
        const radius = 26
        const circumference = 2 * Math.PI * radius
        const strokeDashoffset = circumference - (c.completion / 100) * circumference

        return (
          <div
            key={c.id}
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-blue-200 rounded-xl bg-white hover:border-blue-400 transition-all shadow-sm relative group gap-4"
          >
            <div className="absolute top-0 left-0 w-[85%] h-1 bg-blue-500 rounded-tl-xl transition-all duration-500 opacity-20"></div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div
                className="relative w-[60px] h-[60px] flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={onProfile}
              >
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
                  <AvatarImage src={c.img} />
                  <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-medium">
                    {c.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white z-20 shadow-sm">
                  {c.completion}%
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                <div
                  className="flex items-center gap-2 flex-wrap cursor-pointer"
                  onClick={onProfile}
                >
                  <h3 className="font-semibold text-slate-800 text-base leading-none tracking-tight hover:text-blue-600 transition-colors">
                    {c.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 font-mono text-slate-500 bg-slate-50"
                  >
                    #{c.id.replace('# ', '')}
                  </Badge>
                  {status === 'Desligado' && (
                    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none shadow-none text-[10px] h-5">
                      Desligado
                    </Badge>
                  )}
                  <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none shadow-none text-[10px] h-5">
                    {c.sector}
                  </Badge>
                </div>
                <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-[13px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {c.role}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {c.contract}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-100 md:border-none">
              <Badge
                className={`${status === 'Ativo' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'} text-white shadow-sm px-3 mr-2`}
              >
                {status}
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

              <Popover>
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
                  className="w-56 p-1 rounded-xl border-slate-200 shadow-xl overflow-hidden bg-white"
                >
                  <div className="p-2 border-b border-slate-100 mb-1">
                    <h4 className="font-semibold text-slate-700 text-xs px-2 flex items-center gap-1.5">
                      Ações do Colaborador
                    </h4>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleToggleStatus(c)}
                    className={`w-full justify-start text-sm h-9 ${status === 'Ativo' ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'}`}
                  >
                    {status === 'Ativo' ? (
                      <UserMinus className="w-4 h-4 mr-2" />
                    ) : (
                      <UserCheck className="w-4 h-4 mr-2" />
                    )}
                    {status === 'Ativo' ? 'Demitir (Desligar)' : 'Readmitir (Ativar)'}
                  </Button>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <div className="px-3 py-2 bg-rose-50/50 mt-1 rounded-md">
                    <p className="text-[10px] text-rose-600 flex items-start gap-1.5 mb-2 font-medium leading-tight">
                      <AlertTriangle className="w-3 h-3 shrink-0" /> Área restrita (Requer Senha)
                    </p>
                    <Button
                      variant="ghost"
                      onClick={() => openDeleteModal(c)}
                      className="w-full justify-start text-rose-700 hover:text-white hover:bg-rose-600 h-8 text-xs font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir Registro
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )
      })}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="sm:max-w-md">
          {deleteStep === 1 ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-rose-600 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Excluir Colaborador
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Você está prestes a excluir definitivamente os registros de{' '}
                  <b>{activeItem?.name}</b>. Esta ação é irreversível e removerá todos os dados,
                  anexos e histórico associados ao colaborador.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel onClick={() => setDeleteOpen(false)}>Cancelar</AlertDialogCancel>
                <Button
                  onClick={() => setDeleteStep(2)}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Entendi, prosseguir
                </Button>
              </AlertDialogFooter>
            </>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-rose-600 flex items-center gap-2">
                  <Lock className="w-5 h-5" /> Confirmação de Segurança
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Para confirmar a exclusão de <b>{activeItem?.name}</b>, por favor, confirme sua
                  senha de administrador (admin123).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4 space-y-2">
                <Label>Senha de Administrador</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="focus-visible:ring-rose-500"
                  autoFocus
                />
              </div>
              <AlertDialogFooter>
                <Button variant="outline" onClick={() => setDeleteStep(1)}>
                  Voltar
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                  disabled={!password}
                >
                  Confirmar Exclusão
                </Button>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
