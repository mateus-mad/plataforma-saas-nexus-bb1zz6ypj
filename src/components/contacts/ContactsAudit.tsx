import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { History } from 'lucide-react'

const MOCK_AUDIT = [
  {
    id: 1,
    date: '16/03/2026 14:32',
    user: 'Admin (Você)',
    action: 'Exclusão',
    entity: 'Colaborador (João Silva)',
    detail: 'Exclusão de registro com senha validada',
  },
  {
    id: 2,
    date: '16/03/2026 10:15',
    user: 'Maria RH',
    action: 'Atualização',
    entity: 'Colaborador (Mateus Amorim)',
    detail: 'Alterou Salário Base para R$ 3.500,00',
  },
  {
    id: 3,
    date: '15/03/2026 16:40',
    user: 'Sistema',
    action: 'Criação',
    entity: 'Cliente (SolarTech)',
    detail: 'Cadastro via API de admissão ou OCR',
  },
  {
    id: 4,
    date: '14/03/2026 09:22',
    user: 'Admin (Você)',
    action: 'Atualização',
    entity: 'Fornecedor (MetalForte)',
    detail: 'Atualizou dados bancários',
  },
]

export default function ContactsAudit() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <History className="w-6 h-6 text-slate-400" /> Histórico de Auditoria
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Registro imutável de todas as ações realizadas no módulo de contatos.
          </p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Data / Hora</TableHead>
              <TableHead>Usuário Responsável</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Entidade Afetada</TableHead>
              <TableHead>Detalhes da Modificação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_AUDIT.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">
                  {a.date}
                </TableCell>
                <TableCell className="font-medium text-slate-800 whitespace-nowrap">
                  {a.user}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      a.action === 'Exclusão'
                        ? 'bg-rose-100 text-rose-700'
                        : a.action === 'Atualização'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {a.action}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600 text-sm whitespace-nowrap">
                  {a.entity}
                </TableCell>
                <TableCell className="text-slate-500 text-sm">{a.detail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
