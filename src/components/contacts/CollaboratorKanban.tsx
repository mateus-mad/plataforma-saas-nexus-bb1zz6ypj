import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Building2,
  MoreVertical,
  Eye,
  Edit2,
  Lock,
  Trash2,
  UserMinus,
  UserCheck,
} from 'lucide-react'

type Props = {
  onEdit: () => void
  onProfile: () => void
}

export default function CollaboratorKanban({ onEdit, onProfile }: Props) {
  const { toast } = useToast()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [activeItem, setActiveItem] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [mockStatus, setMockStatus] = useState('Ativo')

  const handleDelete = () => {
    if (password === 'admin123') {
      toast({ title: 'Sucesso', description: 'Colaborador excluído com segurança do sistema.' })
      setDeleteOpen(false)
      setPassword('')
      setIsVisible(false) // Simulando a deleção visualmente
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: 'Senha incorreta para esta operação.',
      })
    }
  }

  const handleToggleStatus = () => {
    const isDismissing = mockStatus === 'Ativo'
    setMockStatus(isDismissing ? 'Desligado' : 'Ativo')
    toast({
      title: isDismissing ? 'Processo Iniciado' : 'Readmissão Concluída',
      description: isDismissing
        ? 'O processo de demissão foi iniciado com sucesso.'
        : 'Colaborador reintegrado ao quadro de ativos.',
    })
  }

  if (!isVisible) {
    return (
      <div className="text-center p-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
        Nenhum colaborador nesta lista.
      </div>
    )
  }

  const item = {
    name: 'Mateus amorim dias',
    role: 'Engenheiro Civil',
    contract: 'Mensalista',
    status: mockStatus,
    img: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
  }

  const columns = [
    {
      title: 'Ativos',
      color: 'border-emerald-500',
      bg: 'bg-emerald-500',
      items: mockStatus === 'Ativo' ? [item] : [],
    },
    { title: 'Em Férias', color: 'border-amber-500', bg: 'bg-amber-500', items: [] },
    {
      title: 'Desligados',
      color: 'border-rose-500',
      bg: 'bg-rose-500',
      items: mockStatus === 'Desligado' ? [item] : [],
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
              Nenhum colaborador
            </div>
          ) : (
            col.items.map((it, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all group relative"
              >
                <div className="absolute top-3 right-3 z-10">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-slate-800 bg-slate-50/50 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="w-56 p-1 rounded-xl border-slate-200 shadow-lg overflow-hidden bg-white"
                    >
                      <Button
                        variant="ghost"
                        onClick={onProfile}
                        className="w-full justify-start text-sm h-9 text-slate-600"
                      >
                        <Eye className="w-4 h-4 mr-2" /> Ficha Completa
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={onEdit}
                        className="w-full justify-start text-sm h-9 text-slate-600"
                      >
                        <Edit2 className="w-4 h-4 mr-2" /> Editar Dados
                      </Button>
                      <div className="h-px bg-slate-100 my-1"></div>
                      <Button
                        variant="ghost"
                        onClick={handleToggleStatus}
                        className={
                          mockStatus === 'Ativo'
                            ? 'w-full justify-start text-sm h-9 text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                            : 'w-full justify-start text-sm h-9 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                        }
                      >
                        {mockStatus === 'Ativo' ? (
                          <UserMinus className="w-4 h-4 mr-2" />
                        ) : (
                          <UserCheck className="w-4 h-4 mr-2" />
                        )}
                        {mockStatus === 'Ativo' ? 'Demitir' : 'Readmitir'}
                      </Button>
                      <div className="px-2 py-1 mt-1 bg-rose-50/50 rounded-md">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setActiveItem(it)
                            setDeleteOpen(true)
                          }}
                          className="w-full justify-start text-xs h-8 text-rose-700 hover:text-white hover:bg-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir Registro
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-3 cursor-pointer" onClick={onProfile}>
                  <Avatar className="w-10 h-10 border border-slate-100 shadow-sm">
                    <AvatarImage src={it.img} />
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-medium">
                      {it.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 pr-6">
                    <p className="font-semibold text-sm text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {it.name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                      <Building2 className="w-3 h-3" /> {it.role}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <Badge variant="outline" className="text-[10px] font-medium bg-slate-50">
                    {it.contract}
                  </Badge>
                  <div className={`w-2 h-2 rounded-full ${col.bg}`} title={it.status} />
                </div>
              </div>
            ))
          )}
        </div>
      ))}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600 flex items-center gap-2">
              <Lock className="w-5 h-5" /> Exclusão Segura
            </AlertDialogTitle>
            <AlertDialogDescription>
              Para excluir os registros de <b>{activeItem?.name}</b>, confirme sua senha de
              administrador. Esta ação não pode ser desfeita. (Use <b>admin123</b>)
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
