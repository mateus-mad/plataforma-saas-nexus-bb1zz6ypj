import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
import { getEntities, deleteEntity } from '@/services/entities'
import { useRealtime } from '@/hooks/use-realtime'
import { getExpiryStatus } from '@/components/contacts/NotificationCenter'
import pb from '@/lib/pocketbase/client'
import {
  MoreHorizontal,
  Eye,
  Edit2,
  Building2,
  Clock,
  Lock,
  Trash2,
  AlertTriangle,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  onEdit: (id: string) => void
  onProfile: (id: string) => void
  sectorFilter: string
  statusFilter: string
  search: string
  complianceMode?: boolean
}

export default function CollaboratorList({
  onEdit,
  onProfile,
  sectorFilter,
  statusFilter,
  search,
  complianceMode,
}: Props) {
  const [entities, setEntities] = useState<any[]>([])
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1)
  const [password, setPassword] = useState('')
  const [activeItem, setActiveItem] = useState<any>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const { toast } = useToast()

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

  const isMissingData = (c: any) =>
    !c.document_number || !c.photo || !c.name || c.name === 'Sem Nome'

  const filtered = entities.filter((c) => {
    if (complianceMode && !isMissingData(c)) return false
    const sector = c.data?.trabalho?.setor || 'N/A'
    if (sectorFilter !== 'Todos' && sector !== sectorFilter) return false
    if (statusFilter !== 'Todos' && (c.status || 'Ativo') !== statusFilter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  const selectAll = (checked: boolean) => setSelectedIds(checked ? filtered.map((x) => x.id) : [])

  const handleExportCSV = () => {
    const selectedData = filtered
      .filter((c) => selectedIds.includes(c.id))
      .map((c) => ({
        Nome: c.name,
        Documento: c.document_number || 'N/A',
        Tipo: c.type,
        Status: c.status || 'Ativo',
        Setor: c.data?.trabalho?.setor || 'N/A',
        Validade_Doc: c.data?.docs?.expiryDate || 'N/A',
      }))

    if (selectedData.length === 0) return

    const headers = Object.keys(selectedData[0]).join(',')
    const rows = selectedData.map((obj) =>
      Object.values(obj)
        .map((v) => `"${v}"`)
        .join(','),
    )
    const csv = [headers, ...rows].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'exportacao_colaboradores.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível excluir o colaborador.',
        })
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: 'Senha incorreta para esta operação.',
      })
    }
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center p-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
        {complianceMode
          ? 'Todos os colaboradores selecionados estão em compliance com os dados exigidos.'
          : 'Nenhum colaborador encontrado para os filtros selecionados.'}
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedIds.length === filtered.length && filtered.length > 0}
            onCheckedChange={selectAll}
            className="w-5 h-5 rounded"
          />
          <span className="text-sm font-medium text-slate-600">
            Selecionar Todos ({selectedIds.length} de {filtered.length})
          </span>
        </div>
        {selectedIds.length > 0 && (
          <Button
            size="sm"
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 h-8"
          >
            <Download className="w-3.5 h-3.5 mr-2" /> Exportar CSV
          </Button>
        )}
      </div>

      {filtered.map((c) => {
        const status = c.status || 'Ativo'
        const radius = 26
        const circumference = 2 * Math.PI * radius
        const completion = isMissingData(c) ? 40 : 100
        const strokeDashoffset = circumference - (completion / 100) * circumference
        const imgUrl = c.photo
          ? pb.files.getURL(c, c.photo)
          : c.data?.pessoal?.foto ||
            `https://img.usecurling.com/ppl/thumbnail?gender=male&seed=${c.id}`

        const expiry = getExpiryStatus(c.data?.docs?.expiryDate)

        return (
          <div
            key={c.id}
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-blue-200 rounded-xl bg-white hover:border-blue-400 transition-all shadow-sm relative group gap-4 pl-12"
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Checkbox
                checked={selectedIds.includes(c.id)}
                onCheckedChange={() => toggleSelect(c.id)}
                className="w-5 h-5 rounded"
              />
            </div>

            <div className="absolute top-0 left-0 w-[85%] h-1 bg-blue-500 rounded-tl-xl transition-all duration-500 opacity-20"></div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div
                className="relative w-[60px] h-[60px] flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onProfile(c.id)}
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
                    className={
                      isMissingData(c)
                        ? 'stroke-amber-500 transition-all duration-1000 ease-out'
                        : 'stroke-blue-500 transition-all duration-1000 ease-out'
                    }
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <Avatar className="w-[42px] h-[42px] border-2 border-white z-10 shadow-sm">
                  <AvatarImage src={imgUrl} />
                  <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-medium">
                    {c.name !== 'Sem Nome' ? c.name[0] : '?'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'absolute -bottom-1 left-1/2 -translate-x-1/2 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white z-20 shadow-sm',
                    isMissingData(c) ? 'bg-amber-500' : 'bg-blue-600',
                  )}
                >
                  {completion}%
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                <div
                  className="flex items-center gap-2 flex-wrap cursor-pointer"
                  onClick={() => onProfile(c.id)}
                >
                  <h3 className="font-semibold text-slate-800 text-base leading-none tracking-tight hover:text-blue-600 transition-colors">
                    {c.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 font-mono text-slate-500 bg-slate-50"
                  >
                    #{c.id.substring(0, 6)}
                  </Badge>
                  {status === 'Desligado' && (
                    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none shadow-none text-[10px] h-5">
                      Desligado
                    </Badge>
                  )}
                  {status === 'Rascunho' && (
                    <Badge className="bg-slate-200 text-slate-700 border-none shadow-none text-[10px] h-5 font-bold">
                      Rascunho
                    </Badge>
                  )}
                  {status === 'Pending Validation' && (
                    <Badge className="bg-amber-100 text-amber-700 border-none shadow-none text-[10px] h-5">
                      Pendente Validação
                    </Badge>
                  )}
                  {isMissingData(c) && status !== 'Rascunho' && (
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none shadow-none text-[10px] h-5">
                      Dados Incompletos
                    </Badge>
                  )}

                  {expiry === 'expired' && (
                    <Badge className="bg-rose-500 text-white border-none shadow-none text-[10px] h-5">
                      Doc Expirado
                    </Badge>
                  )}
                  {expiry === 'expiring' && (
                    <Badge className="bg-amber-500 text-white border-none shadow-none text-[10px] h-5">
                      Vence em Breve
                    </Badge>
                  )}

                  <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none shadow-none text-[10px] h-5">
                    {c.data?.trabalho?.setor || 'Sem setor'}
                  </Badge>
                </div>
                <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-[13px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />{' '}
                    {c.data?.trabalho?.cargo || 'Sem cargo'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />{' '}
                    {c.data?.trabalho?.contrato || 'Mensalista'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-100 md:border-none">
              <Badge
                className={`${status === 'Ativo' ? 'bg-emerald-500 hover:bg-emerald-600' : status === 'Rascunho' ? 'bg-slate-400' : status === 'Pending Validation' ? 'bg-amber-500' : 'bg-rose-500'} text-white shadow-sm px-3 mr-2`}
              >
                {status}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onProfile(c.id)}
                className="h-8 text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100"
              >
                <Eye className="w-3.5 h-3.5 mr-2" /> Ficha
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(c.id)}
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
