import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  MessageCircle,
  AlertTriangle,
  ScanLine,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

import CollaboratorList from '@/components/contacts/CollaboratorList'
import CollaboratorKanban from '@/components/contacts/CollaboratorKanban'
import CollaboratorModal from '@/components/contacts/CollaboratorModal'
import CollaboratorProfileModal from '@/components/contacts/CollaboratorProfileModal'
import ContactsDashboard from '@/components/contacts/ContactsDashboard'
import ContactsClients from '@/components/contacts/ContactsClients'
import ContactsSuppliers from '@/components/contacts/ContactsSuppliers'
import ContactsAudit from '@/components/contacts/ContactsAudit'
import BatchOCRModal from '@/components/contacts/BatchOCRModal'
import NotificationCenter from '@/components/contacts/NotificationCenter'
import { ErrorBoundary } from '@/components/contacts/ErrorBoundary'

import { useToast } from '@/hooks/use-toast'
import { useRealtime } from '@/hooks/use-realtime'

export default function Contatos() {
  const { view } = useParams()
  const navigate = useNavigate()
  const currentView = view || 'dashboard'

  const { setOpen } = useSidebar()

  useEffect(() => {
    const isPinned = localStorage.getItem('sidebarPinned') === 'true'
    if (!isPinned) {
      setOpen(false)
    }
  }, [setOpen, currentView])

  const [colabView, setColabView] = useState<'lista' | 'kanban'>('lista')
  const [sectorFilter, setSectorFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [search, setSearch] = useState('')
  const [complianceMode, setComplianceMode] = useState(false)

  const [modalState, setModalState] = useState<{
    isOpen: boolean
    type: 'edit' | 'new' | 'profile'
    id: string | null
  }>({ isOpen: false, type: 'new', id: null })

  const [batchOcrOpen, setBatchOcrOpen] = useState(false)
  const { toast } = useToast()

  useRealtime('relacionamentos', (e: any) => {
    if (
      e.action === 'update' &&
      e.record.status === 'Pendente' &&
      e.record.onboarding_token === ''
    ) {
      toast({
        title: 'Onboarding Externo Recebido',
        description: `Novos documentos de ${e.record.name || 'um contato'} estão aguardando validação.`,
      })
    }
  })

  const handleOpenModal = (type: 'edit' | 'new' | 'profile', id: string | null = null) =>
    setModalState({ isOpen: true, type, id })
  const handleCloseModal = () => setModalState((prev) => ({ ...prev, isOpen: false }))

  const [isSendingLink, setIsSendingLink] = useState(false)

  const sendWhatsApp = async () => {
    setIsSendingLink(true)
    try {
      const formData = new FormData()
      formData.append('name', 'Novo Contato (Onboarding Externo)')
      formData.append('type', 'colaborador')
      formData.append('status', 'rascunho')
      formData.append('compliance_status', 'pendente')

      const { createEntity } = await import('@/services/entities')
      const entity = await createEntity(formData)

      const { sendOnboardingLink } = await import('@/services/whatsapp')
      const res = await sendOnboardingLink(entity.id)

      const text = encodeURIComponent(
        `Olá! Por favor, acesse o link para enviar seus documentos remotamente: ${res.link}`,
      )
      window.open(`https://wa.me/?text=${text}`, '_blank')

      toast({
        title: 'Onboarding Iniciado',
        description: 'Link seguro de uso único gerado e pronto no WhatsApp.',
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível gerar o link de onboarding.',
      })
    } finally {
      setIsSendingLink(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-4 h-[calc(100vh-6rem)] animate-fade-in">
        <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            {currentView === 'dashboard' && <ContactsDashboard />}

            {currentView === 'colaboradores' && (
              <div className="space-y-6 pb-10">
                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                    Colaboradores
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                    <NotificationCenter />
                    <Button
                      variant="outline"
                      onClick={sendWhatsApp}
                      disabled={isSendingLink}
                      className="border-green-200 text-green-700 hover:bg-green-50 shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />{' '}
                      {isSendingLink ? 'Gerando...' : 'Enviar Link'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setBatchOcrOpen(true)}
                      className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 shadow-sm font-semibold"
                    >
                      <ScanLine className="w-4 h-4 mr-2" /> Processamento em Lote
                    </Button>
                    <Button
                      onClick={() => handleOpenModal('new')}
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Novo Colaborador
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-56">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Buscar colaborador..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-white h-9"
                      />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-36 bg-white h-9">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos">Todos (Status)</SelectItem>
                        <SelectItem value="ativo">Ativos</SelectItem>
                        <SelectItem value="rascunho">Rascunhos</SelectItem>
                        <SelectItem value="desligado">Desligados</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sectorFilter} onValueChange={setSectorFilter}>
                      <SelectTrigger className="w-full sm:w-40 bg-white h-9">
                        <SelectValue placeholder="Setor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todos">Todos (Setores)</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                        <SelectItem value="Solar">Solar</SelectItem>
                        <SelectItem value="Metalúrgica">Metalúrgica</SelectItem>
                        <SelectItem value="Administrativo">Administrativo</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant={complianceMode ? 'default' : 'outline'}
                      onClick={() => setComplianceMode(!complianceMode)}
                      className={cn(
                        'h-9 w-full sm:w-auto',
                        complianceMode
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                          : 'text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100',
                      )}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" /> Compliance
                    </Button>
                  </div>

                  <div className="flex bg-white p-1 rounded-lg border border-slate-200 w-full sm:w-auto justify-center">
                    <Button
                      variant={colabView === 'lista' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setColabView('lista')}
                      className={`h-8 px-4 text-xs font-medium transition-all ${colabView === 'lista' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <ListIcon className="w-3.5 h-3.5 mr-2" /> Lista
                    </Button>
                    <Button
                      variant={colabView === 'kanban' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setColabView('kanban')}
                      className={`h-8 px-4 text-xs font-medium transition-all ${colabView === 'kanban' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5 mr-2" /> Kanban
                    </Button>
                  </div>
                </div>

                <div className="transition-all duration-300">
                  {colabView === 'lista' ? (
                    <CollaboratorList
                      sectorFilter={sectorFilter}
                      statusFilter={statusFilter}
                      search={search}
                      complianceMode={complianceMode}
                      onEdit={(id) => handleOpenModal('edit', id)}
                      onProfile={(id) => handleOpenModal('profile', id)}
                    />
                  ) : (
                    <CollaboratorKanban
                      sectorFilter={sectorFilter}
                      statusFilter={statusFilter}
                      search={search}
                      complianceMode={complianceMode}
                      onEdit={(id) => handleOpenModal('edit', id)}
                      onProfile={(id) => handleOpenModal('profile', id)}
                    />
                  )}
                </div>
              </div>
            )}

            {currentView === 'clientes' && <ContactsClients />}
            {currentView === 'fornecedores' && <ContactsSuppliers />}
            {currentView === 'auditoria' && <ContactsAudit />}
          </div>
        </div>

        <CollaboratorModal
          open={modalState.isOpen && (modalState.type === 'edit' || modalState.type === 'new')}
          onOpenChange={(open) => !open && handleCloseModal()}
          entityId={modalState.id}
        />
        <CollaboratorProfileModal
          open={modalState.isOpen && modalState.type === 'profile'}
          onOpenChange={(open) => !open && handleCloseModal()}
          onEdit={() => handleOpenModal('edit', modalState.id)}
          entityId={modalState.id}
        />
        <BatchOCRModal open={batchOcrOpen} onOpenChange={setBatchOcrOpen} />
      </div>
    </ErrorBoundary>
  )
}
