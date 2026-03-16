import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Truck } from 'lucide-react'
import { useState } from 'react'

import CompanyModal from './CompanyModal'
import CompanyProfileModal from './CompanyProfileModal'

const MOCK_SUPPLIERS = [
  {
    id: 'FOR-001',
    name: 'Cimento Nacional',
    sector: 'Civil',
    contact: 'vendas@cimento.com',
    phone: '(11) 95555-1111',
    status: 'Ativo',
  },
  {
    id: 'FOR-002',
    name: 'Placas Solares Pro',
    sector: 'Solar',
    contact: 'importacao@placaspro.com',
    phone: '(11) 94444-2222',
    status: 'Ativo',
  },
  {
    id: 'FOR-003',
    name: 'Aços Forte',
    sector: 'Metalúrgica',
    contact: 'distribuicao@acosforte.com',
    phone: '(11) 93333-3333',
    status: 'Inativo',
  },
]

export default function ContactsSuppliers() {
  const [filter, setFilter] = useState('Todos')
  const [search, setSearch] = useState('')
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'new' | 'edit' }>({
    isOpen: false,
    type: 'new',
  })
  const [profileOpen, setProfileOpen] = useState(false)

  const filtered = MOCK_SUPPLIERS.filter((c) => {
    if (filter !== 'Todos' && c.sector !== filter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
          <Truck className="w-6 h-6 text-slate-400" /> Fornecedores
        </h2>
        <Button
          onClick={() => setModalState({ isOpen: true, type: 'new' })}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Fornecedor
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar fornecedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue placeholder="Setor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os Setores</SelectItem>
            <SelectItem value="Civil">Civil</SelectItem>
            <SelectItem value="Solar">Solar</SelectItem>
            <SelectItem value="Metalúrgica">Metalúrgica</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Razão Social</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs text-slate-500">{c.id}</TableCell>
                <TableCell className="font-medium text-slate-800">{c.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-50">
                    {c.sector}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600 text-sm">
                  <div>{c.contact}</div>
                  <div className="text-xs text-slate-400">{c.phone}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      c.status === 'Ativo'
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none'
                        : 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-none'
                    }
                  >
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProfileOpen(true)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Ver Ficha
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  Nenhum fornecedor encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CompanyModal
        open={modalState.isOpen}
        onOpenChange={(o) => setModalState((p) => ({ ...p, isOpen: o }))}
        type="supplier"
      />
      <CompanyProfileModal
        open={profileOpen}
        onOpenChange={setProfileOpen}
        onEdit={() => setModalState({ isOpen: true, type: 'edit' })}
        type="supplier"
      />
    </div>
  )
}
