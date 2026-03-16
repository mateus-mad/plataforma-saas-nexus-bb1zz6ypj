import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Plus, Search, Users } from 'lucide-react'
import CollaboratorList from '@/components/contacts/CollaboratorList'
import CollaboratorModal from '@/components/contacts/CollaboratorModal'
import { Link } from 'react-router-dom'

export default function Contacts() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [view, setView] = useState<'lista' | 'kanban'>('lista')

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
            className="text-slate-600 border-slate-200 bg-white hover:bg-slate-50 hidden sm:flex"
          >
            <span className="mr-2">🧠</span> ENG RH
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm shadow-blue-500/20 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Colaborador
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            placeholder="Buscar colaboradores..."
            className="pl-9 bg-white border-slate-200 focus-visible:ring-blue-500 shadow-sm"
          />
        </div>
        <div className="flex bg-slate-100/80 p-1 rounded-lg border border-slate-200/60 w-full sm:w-auto justify-center">
          <Button
            variant={view === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('kanban')}
            className={`h-8 px-4 text-xs font-medium transition-all ${view === 'kanban' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Kanban
          </Button>
          <Button
            variant={view === 'lista' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('lista')}
            className={`h-8 px-4 text-xs font-medium transition-all ${view === 'lista' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Lista
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CollaboratorList />
      </div>

      <CollaboratorModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
