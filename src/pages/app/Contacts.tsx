import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Plus,
  Search,
  Users,
  LayoutGrid,
  List as ListIcon,
  Link as LinkIcon,
} from 'lucide-react'
import CollaboratorList from '@/components/contacts/CollaboratorList'
import CollaboratorKanban from '@/components/contacts/CollaboratorKanban'
import CollaboratorModal from '@/components/contacts/CollaboratorModal'
import CollaboratorProfileModal from '@/components/contacts/CollaboratorProfileModal'
import AIEngineModal from '@/components/contacts/AIEngineModal'
import { Link } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

export default function Contacts() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    type: 'edit' | 'new' | 'profile'
  }>({ isOpen: false, type: 'new' })
  const [view, setView] = useState<'lista' | 'kanban'>('lista')
  const [aiOpen, setAiOpen] = useState(false)
  const { toast } = useToast()

  const handleOpenModal = (type: 'edit' | 'new' | 'profile') =>
    setModalState({ isOpen: true, type })
  const handleCloseModal = () => setModalState((prev) => ({ ...prev, isOpen: false }))

  const generateOnboardingLink = () => {
    toast({
      title: 'Link Gerado',
      description: 'Link seguro copiado para a área de transferência. Ele expirará após 1 uso.',
    })
    navigator.clipboard.writeText(window.location.origin + '/onboarding/tmp_xyz987')
  }

  return (
    <div className="space-y-6 animate-fade-in flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-9 w-9 text-slate-500 hover:text-slate-800"
          >
            <Link to="/app">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-slate-400" /> Colaboradores
          </h2>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={generateOnboardingLink}
            className="hidden lg:flex border-slate-200 text-slate-600 bg-white hover:bg-slate-50 shadow-sm"
          >
            <LinkIcon className="w-4 h-4 mr-2" /> Gerar Link de Admissão
          </Button>
          <Button
            variant="outline"
            onClick={() => setAiOpen(true)}
            className="text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 hidden sm:flex font-semibold shadow-sm transition-all hover:shadow-blue-500/20"
          >
            <span className="mr-2 text-lg">🧠</span> ENG RH
          </Button>
          <Button
            onClick={() => handleOpenModal('new')}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Colaborador
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            placeholder="Buscar por nome, cargo ou CPF..."
            className="pl-9 bg-white border-slate-200 focus-visible:ring-blue-500 shadow-sm h-10"
          />
        </div>
        <div className="flex bg-slate-100/80 p-1 rounded-lg border border-slate-200/60 w-full sm:w-auto justify-center">
          <Button
            variant={view === 'lista' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('lista')}
            className={`h-8 px-4 text-xs font-medium transition-all ${view === 'lista' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ListIcon className="w-3.5 h-3.5 mr-2" /> Lista
          </Button>
          <Button
            variant={view === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('kanban')}
            className={`h-8 px-4 text-xs font-medium transition-all ${view === 'kanban' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutGrid className="w-3.5 h-3.5 mr-2" /> Kanban
          </Button>
        </div>
      </div>

      <div className="flex-1 transition-all duration-300">
        {view === 'lista' ? (
          <CollaboratorList
            onEdit={() => handleOpenModal('edit')}
            onProfile={() => handleOpenModal('profile')}
          />
        ) : (
          <CollaboratorKanban
            onEdit={() => handleOpenModal('edit')}
            onProfile={() => handleOpenModal('profile')}
          />
        )}
      </div>

      <CollaboratorModal
        open={modalState.isOpen && (modalState.type === 'edit' || modalState.type === 'new')}
        onOpenChange={(open) => !open && handleCloseModal()}
      />
      <CollaboratorProfileModal
        open={modalState.isOpen && modalState.type === 'profile'}
        onOpenChange={(open) => !open && handleCloseModal()}
      />
      <AIEngineModal open={aiOpen} onOpenChange={setAiOpen} />
    </div>
  )
}
