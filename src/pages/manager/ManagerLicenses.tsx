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
import { Switch } from '@/components/ui/switch'
import { Key, Plus } from 'lucide-react'
import useSecurityStore from '@/stores/useSecurityStore'
import useManagerStore from '@/stores/useManagerStore'

export default function ManagerLicenses() {
  const { isAdminMode } = useSecurityStore()
  const { licenses } = useManagerStore()

  if (!isAdminMode) return <Navigate to="/app" />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-purple-800 flex items-center gap-2">
            <Key className="w-6 h-6 text-purple-600" /> Gestão de Licenças
          </h2>
          <p className="text-muted-foreground">
            Emita chaves e controle acesso de todos os clientes.
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Gerar Nova Licença
        </Button>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>Chave de Acesso</TableHead>
              <TableHead>Tenant Associado</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Acesso Habilitado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licenses.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-mono text-xs font-bold text-slate-700">
                  {l.key}
                </TableCell>
                <TableCell className="text-slate-600">{l.tenantId}</TableCell>
                <TableCell className="text-slate-600">{l.expiresAt}</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">
                    {l.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Switch checked={l.status === 'Active'} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
