import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { History } from 'lucide-react'
import pb from '@/lib/pocketbase/client'

export function AuditHistoryTab({ data }: { data?: any }) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!data?.id) {
      setLoading(false)
      return
    }

    const fetchLogs = async () => {
      try {
        const records = await pb.collection('audit_logs').getFullList({
          filter: `relacionamento_id = "${data.id}"`,
          sort: '-created',
          expand: 'user_id',
        })
        setLogs(records)
      } catch (error) {
        console.error('Failed to fetch audit logs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [data?.id])

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse">Carregando histórico...</div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
          <History className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800">Histórico de Alterações</h4>
          <p className="text-sm text-slate-500">
            Auditoria cronológica de todas as mudanças realizadas neste registro.
          </p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Data / Hora</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Campos Alterados</TableHead>
              <TableHead>De</TableHead>
              <TableHead>Para</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">
                    {new Date(log.created).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-700">
                    {log.expand?.user_id?.name || log.expand?.user_id?.email || 'Sistema'}
                  </TableCell>
                  <TableCell
                    className="text-sm text-slate-700 font-medium max-w-[150px] truncate"
                    title={log.field_name}
                  >
                    {log.field_name}
                  </TableCell>
                  <TableCell
                    className="text-xs text-rose-600 font-mono max-w-[150px] truncate"
                    title={JSON.stringify(log.old_value)}
                  >
                    {JSON.stringify(log.old_value)}
                  </TableCell>
                  <TableCell
                    className="text-xs text-emerald-600 font-mono max-w-[150px] truncate"
                    title={JSON.stringify(log.new_value)}
                  >
                    {JSON.stringify(log.new_value)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Nenhuma alteração registrada ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
