import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, LayoutGrid, List as ListIcon, Link as LinkIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import CollaboratorList from '@/components/contacts/CollaboratorList'
import CollaboratorKanban from '@/components/contacts/CollaboratorKanban'
import CollaboratorModal from '@/components/contacts/CollaboratorModal'
import CollaboratorProfileModal from '@/components/contacts/CollaboratorProfileModal'
import AIEngineModal from '@/components/contacts/AIEngineModal'
import ContactsSidebar from '@/components/contacts/ContactsSidebar'
import ContactsDashboard from '@/components/contacts/ContactsDashboard'
import ContactsClients from '@/components/contacts/ContactsClients'
import ContactsSuppliers from '@/components/contacts/ContactsSuppliers'
import ContactsAudit from '@/components/contacts/ContactsAudit'

import { useToast } from '@/hooks/use-toast'

export default function Contacts() {
  const [view, setView] = useState<
    'dashboard' | 'colaboradores' | 'clientes' | 'fornecedores' | 'auditoria'
  >('colaboradores')
  const [colabView, setColabView] = useState<'lista' | 'kanban'>('lista')
  const [sectorFilter, setSectorFilter] = useState('Todos')
  const [search, setSearch] = useState('')

  const [modalState, setModalState] = useState<{
    isOpen: boolean
    type: 'edit' | 'new' | 'profile'
  }>({ isOpen: false, type: 'new' })
  const [aiOpen, setAiOpen] = useState(false)
  const { toast } = useToast()

  const handleOpenModal = (type: 'edit' | 'new' | 'profile') =>
    setModalState({ isOpen: true, type })
  const handleCloseModal = () => setModalState((prev) => ({ ...prev, isOpen: false }))

  const generateOnboardingLink = () => {
    const token = Math.random().toString(36).substring(2, 10)
    const link = `${window.location.origin}/onboarding/${token}`
    navigator.clipboard.writeText(link)
    toast({
      title: 'Link Gerado e Copiado',
      description: 'Link seguro de uso único copiado para a área de transferência.',
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-6rem)] animate-fade-in">
      <ContactsSidebar active={view} onChange={setView} />

      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {view === 'dashboard' && <ContactsDashboard />}

          {view === 'colaboradores' && (
            <div className="space-y-6 pb-10">
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">Colaboradores</h2>
                <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                  <Button
                    variant="outline"
                    onClick={generateOnboardingLink}
                    className="border-slate-200 text-slate-600 bg-white hover:bg-slate-50 shadow-sm"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" /> Link de Admissão
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAiOpen(true)}
                    className="text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 font-semibold shadow-sm transition-all"
                  >
                    <span className="mr-2 text-lg">🧠</span> ENG RH
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
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Buscar colaborador..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 bg-white"
                    />
                  </div>
                  <Select value={sectorFilter} onValueChange={setSectorFilter}>
                    <SelectTrigger className="w-full sm:w-48 bg-white">
                      <SelectValue placeholder="Setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos os Setores</SelectItem>
                      <SelectItem value="Civil">Civil</SelectItem>
                      <SelectItem value="Solar">Solar</SelectItem>
                      <SelectItem value="Metalúrgica">Metalúrgica</SelectItem>
                      <SelectItem value="Administrativo">Administrativo</SelectItem>
                    </SelectContent>
                  </Select>
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
                    search={search}
                    onEdit={() => handleOpenModal('edit')}
                    onProfile={() => handleOpenModal('profile')}
                  />
                ) : (
                  <CollaboratorKanban
                    sectorFilter={sectorFilter}
                    search={search}
                    onEdit={() => handleOpenModal('edit')}
                    onProfile={() => handleOpenModal('profile')}
                  />
                )}
              </div>
            </div>
          )}

          {view === 'clientes' && <ContactsClients />}
          {view === 'fornecedores' && <ContactsSuppliers />}
          {view === 'auditoria' && <ContactsAudit />}
        </div>
      </div>

      <CollaboratorModal
        open={modalState.isOpen && (modalState.type === 'edit' || modalState.type === 'new')}
        onOpenChange={(open) => !open && handleCloseModal()}
      />
      <CollaboratorProfileModal
        open={modalState.isOpen && modalState.type === 'profile'}
        onOpenChange={(open) => !open && handleCloseModal()}
        onEdit={() => handleOpenModal('edit')}
      />
      <AIEngineModal open={aiOpen} onOpenChange={setAiOpen} />
    </div>
  )
}
