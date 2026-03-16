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
import { Bug, Plus } from 'lucide-react'
import useSecurityStore from '@/stores/useSecurityStore'
import useManagerStore from '@/stores/useManagerStore'

export default function ManagerBugs() {
  const { isAdminMode } = useSecurityStore()
  const { bugs } = useManagerStore()

  if (!isAdminMode) return <Navigate to="/app" />

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-rose-100 text-rose-700 border-rose-200'
      case 'High':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'Low':
        return 'bg-slate-100 text-slate-700 border-slate-200'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-purple-800 flex items-center gap-2">
            <Bug className="w-6 h-6 text-purple-600" /> Tracking de Bugs
          </h2>
          <p className="text-muted-foreground">Registre e acompanhe falhas no sistema técnico.</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Reportar Bug
        </Button>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Descrição Técnica</TableHead>
              <TableHead>Ticket Vinculado</TableHead>
              <TableHead>Gravidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bugs.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-mono text-xs text-slate-500">{b.id}</TableCell>
                <TableCell className="font-medium text-slate-800">{b.title}</TableCell>
                <TableCell className="font-mono text-xs text-blue-600">
                  {b.ticketId || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getSeverityColor(b.severity)}>
                    {b.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      b.status === 'New'
                        ? 'bg-blue-100 text-blue-700'
                        : b.status === 'In Progress'
                          ? 'bg-indigo-100 text-indigo-700'
                          : ''
                    }
                  >
                    {b.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
