import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  MapPin,
  Eye,
  Edit2,
  MoreHorizontal,
  Users,
  Plus,
  Link as LinkIcon,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import CompanyModal from './CompanyModal'
import CompanyProfileModal from './CompanyProfileModal'
import { getEntities } from '@/services/entities'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'

export default function ContactsClients() {
  const [search, setSearch] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    type: 'new' | 'edit'
    id: string | null
  }>({
    isOpen: false,
    type: 'new',
    id: null,
  })
  const [profileOpen, setProfileOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const { toast } = useToast()

  const [entities, setEntities] = useState<any[]>([])

  const loadData = async () => {
    try {
      const res = await getEntities('cliente')
      setEntities(res)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('relacionamentos', loadData)

  const filtered = entities.filter((c) => {
    if (!showInactive && c.status === 'inativo') return false
    if (search) {
      const s = search.toLowerCase()
      if (
        !c.name.toLowerCase().includes(s) &&
        !c.data?.endereco?.cidade?.toLowerCase().includes(s) &&
        !c.email.toLowerCase().includes(s)
      )
        return false
    }
    return true
  })

  const sendWhatsApp = () => {
    const token = Math.random().toString(36).substring(2, 10)
    const link = `${window.location.origin}/share/client/${token}`
    const text = encodeURIComponent(
      `Olá! Por favor, preencha o formulário de cadastro da nossa empresa através deste link seguro: ${link}`,
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
    toast({
      title: 'WhatsApp Aberto',
      description: 'Link de autopreenchimento pronto para envio.',
    })
  }

  const openProfile = (client: any) => {
    setSelectedClient(client)
    setProfileOpen(true)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">Clientes</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Gestão completa de clientes • Cadastro, histórico financeiro e documentos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={sendWhatsApp}
            className="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
            title="Enviar link de cadastro via WhatsApp"
          >
            <LinkIcon className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Link Auto-Cadastro</span>
          </Button>
          <Button
            onClick={() => setModalState({ isOpen: true, type: 'new', id: null })}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex-1 sm:flex-none"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Cliente
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome, documento, email ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-slate-200 h-11 rounded-xl"
          />
        </div>
        <Button
          variant={showInactive ? 'default' : 'outline'}
          onClick={() => setShowInactive(!showInactive)}
          className={cn(
            'h-11 rounded-xl whitespace-nowrap px-6',
            showInactive ? 'bg-slate-800 text-white' : 'bg-white text-slate-600',
          )}
        >
          Mostrar Inativos
        </Button>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => {
          const isComplete = true
          const progressColor = isComplete ? 'bg-emerald-500' : 'bg-amber-500'
          const location = c.data?.endereco?.cidade
            ? `${c.data.endereco.cidade} - ${c.data.endereco.estado}`
            : 'Sem endereço'
          const avatar = c.photo
            ? pb.files.getURL(c, c.photo)
            : c.data?.dados?.logo || `https://img.usecurling.com/i?q=company&seed=${c.id}`

          return (
            <div
              key={c.id}
              className="group relative bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 h-1 ${progressColor} transition-all duration-1000 ease-out`}
                style={{ width: `100%` }}
              />

              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <Avatar className="w-14 h-14 border border-slate-100 shadow-sm bg-slate-50">
                    <AvatarImage src={avatar} className="object-contain p-2" />
                    <AvatarFallback className="text-lg font-medium text-blue-600 bg-blue-50">
                      {c.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">
                    {c.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <Badge
                  className={cn(
                    'shadow-none font-semibold px-3 mr-1 sm:mr-3 capitalize',
                    c.status === 'ativo'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
                  )}
                >
                  {c.status}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openProfile(c)}
                  className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 h-9"
                >
                  <Eye className="w-4 h-4 mr-2" /> Ficha
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalState({ isOpen: true, type: 'edit', id: c.id })}
                  className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 h-9"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Editar
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem className="cursor-pointer">Enviar E-mail</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Novo Contrato</DropdownMenuItem>
                    <DropdownMenuItem className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer">
                      Inativar Cliente
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-700 font-semibold mb-1">Nenhum cliente encontrado</h3>
            <p className="text-sm text-slate-500">Tente ajustar os filtros da sua busca.</p>
          </div>
        )}
      </div>

      <CompanyModal
        open={modalState.isOpen}
        onOpenChange={(o) => setModalState((p) => ({ ...p, isOpen: o }))}
        type="client"
        entityId={modalState.id}
      />

      <CompanyProfileModal
        open={profileOpen}
        onOpenChange={setProfileOpen}
        onEdit={() => setModalState({ isOpen: true, type: 'edit', id: selectedClient?.id })}
        type="client"
        companyData={selectedClient}
      />
    </div>
  )
}
