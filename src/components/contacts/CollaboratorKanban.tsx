import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { getEntities, deleteEntity } from '@/services/entities'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'
import { Building2, MoreVertical, Eye, Edit2, Lock, Trash2, AlertTriangle } from 'lucide-react'

type Props = {
  onEdit: (id: string) => void
  onProfile: (id: string) => void
  sectorFilter: string
  statusFilter: string
  search: string
  complianceMode?: boolean
}

export default function CollaboratorKanban({
  onEdit,
  onProfile,
  sectorFilter,
  statusFilter,
  search,
  complianceMode,
}: Props) {
  const [entities, setEntities] = useState<any[]>([])
  const { toast } = useToast()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1)
  const [password, setPassword] = useState('')
  const [activeItem, setActiveItem] = useState<any>(null)

  const loadData = async () => {
    try {
      const res = await getEntities('colaborador')
      setEntities(res)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('relacionamentos', loadData)

  const isMissingDataOrExpired = (c: any) => {
    const isMissing = !c.document_number || !c.photo || !c.name || c.name === 'Sem Nome'
    const isExpired = c.compliance_status === 'vencido' || c.compliance_status === 'pendente'
    return isMissing || isExpired
  }

  const isMissingData = (c: any) =>
    !c.document_number || !c.photo || !c.name || c.name === 'Sem Nome'

  const filtered = entities.filter((c) => {
    if (complianceMode && !isMissingDataOrExpired(c)) return false
    const sector = c.data?.trabalho?.setor || 'N/A'
    if (sectorFilter !== 'Todos' && sector !== sectorFilter) return false
    if (
      statusFilter !== 'Todos' &&
      (c.status || 'ativo').toLowerCase() !== statusFilter.toLowerCase()
    )
      return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const openDeleteModal = (item: any) => {
    setActiveItem(item)
    setDeleteStep(1)
    setPassword('')
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (password === 'admin123') {
      try {
        await deleteEntity(activeItem.id)
        toast({ title: 'Sucesso', description: 'Colaborador excluído com segurança do sistema.' })
        setDeleteOpen(false)
        setPassword('')
      } catch (err) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível excluir.' })
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: 'Senha incorreta para esta operação.',
      })
    }
  }

  const columns = [
    {
      title: 'Rascunhos',
      color: 'border-slate-400',
      bg: 'bg-slate-400',
      items: filtered.filter((c) => c.status === 'rascunho'),
    },
    {
      title: 'Ativos',
      color: 'border-emerald-500',
      bg: 'bg-emerald-500',
      items: filtered.filter((c) => c.status === 'ativo' || !c.status),
    },
    {
      title: 'Pendentes / Férias',
      color: 'border-amber-500',
      bg: 'bg-amber-500',
      items: filtered.filter((c) => c.status === 'pendente' || c.status === 'Férias'),
    },
    {
      title: 'Desligados',
      color: 'border-rose-500',
      bg: 'bg-rose-500',
      items: filtered.filter((c) => c.status === 'desligado'),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500 items-start">
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
            col.items.map((it, idx) => {
              const imgUrl = it.photo
                ? pb.files.getURL(it, it.photo)
                : it.data?.pessoal?.foto ||
                  `https://img.usecurling.com/ppl/thumbnail?gender=male&seed=${it.id}`

              const complianceStatus = it.compliance_status || 'pendente'

              return (
                <div
                  key={it.id}
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
                          onClick={() => onProfile(it.id)}
                          className="w-full justify-start text-sm h-9 text-slate-600"
                        >
                          <Eye className="w-4 h-4 mr-2" /> Ficha Completa
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => onEdit(it.id)}
                          className="w-full justify-start text-sm h-9 text-slate-600"
                        >
                          <Edit2 className="w-4 h-4 mr-2" /> Editar Dados
                        </Button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        <div className="px-2 py-1 mt-1 bg-rose-50/50 rounded-md">
                          <Button
                            variant="ghost"
                            onClick={() => openDeleteModal(it)}
                            className="w-full justify-start text-xs h-8 text-rose-700 hover:text-white hover:bg-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir Registro
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex gap-3 cursor-pointer" onClick={() => onProfile(it.id)}>
                    <Avatar className="w-10 h-10 border border-slate-100 shadow-sm">
                      <AvatarImage src={imgUrl} />
                      <AvatarFallback className="bg-blue-50 text-blue-600 font-medium">
                        {it.name !== 'Sem Nome' ? it.name[0] : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 pr-6">
                      <p className="font-semibold text-sm text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {it.name}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                        <Building2 className="w-3 h-3" /> {it.data?.trabalho?.cargo || 'Sem Cargo'}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        <Badge variant="outline" className="bg-slate-50 text-[9px]">
                          {it.data?.trabalho?.setor || 'Sem Setor'}
                        </Badge>
                        {complianceStatus === 'vencido' && (
                          <Badge className="bg-rose-500 text-white border-none shadow-none text-[9px]">
                            Vencido
                          </Badge>
                        )}
                        {complianceStatus === 'pendente' && (
                          <Badge className="bg-amber-500 text-white border-none shadow-none text-[9px]">
                            Pendente
                          </Badge>
                        )}
                        {complianceStatus === 'em_dia' && (
                          <Badge className="bg-emerald-500 text-white border-none shadow-none text-[9px]">
                            Em dia
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                    <Badge variant="outline" className="text-[10px] font-medium bg-slate-50">
                      {it.data?.trabalho?.contrato || 'Mensalista'}
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${col.bg}`} title={it.status} />
                  </div>
                </div>
              )
            })
          )}
        </div>
      ))}

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
