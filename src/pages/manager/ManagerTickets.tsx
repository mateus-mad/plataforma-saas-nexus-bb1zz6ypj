import { Navigate } from 'react-router-dom'
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
import { Ticket, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import useSecurityStore from '@/stores/useSecurityStore'
import useManagerStore from '@/stores/useManagerStore'

export default function ManagerTickets() {
  const { isAdminMode } = useSecurityStore()
  const { tickets } = useManagerStore()

  if (!isAdminMode) return <Navigate to="/app" />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-purple-800 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-purple-600" /> Fila de Atendimento (Tickets)
          </h2>
          <p className="text-muted-foreground">
            Gerencie e resolva problemas relatados pelos clientes.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Buscar ticket..." className="pl-9 bg-white" />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white shrink-0">
            Novo Ticket
          </Button>
        </div>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Assunto / Descrição</TableHead>
              <TableHead>Cliente (Tenant)</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs text-slate-500">{t.id}</TableCell>
                <TableCell className="font-medium">{t.title}</TableCell>
                <TableCell className="text-slate-600">{t.client}</TableCell>
                <TableCell className="text-slate-600">{t.assignee}</TableCell>
                <TableCell>
                  <Badge
                    variant={t.status === 'Resolved' ? 'secondary' : 'default'}
                    className={
                      t.status === 'Open'
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200'
                        : t.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200'
                          : ''
                    }
                  >
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    Visualizar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {tickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  Nenhum ticket encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
