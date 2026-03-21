import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { History, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function ContactsAudit() {
  const [search, setSearch] = useState('')
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      date: new Date(Date.now() - 1000 * 60 * 30).toLocaleString('pt-BR'),
      user: 'Admin (Você)',
      action: 'Exclusão',
      entity: 'Colaborador (João Silva)',
      detail: 'Exclusão de registro com senha validada',
      module: 'RH',
    },
    {
      id: 2,
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString('pt-BR'),
      user: 'Maria RH',
      action: 'Atualização',
      entity: 'Colaborador (Mateus Amorim)',
      detail: 'Alterou Salário Base para R$ 3.500,00',
      module: 'RH',
    },
    {
      id: 3,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleString('pt-BR'),
      user: 'Sistema',
      action: 'Criação',
      entity: 'Cliente (SolarTech)',
      detail: 'Cadastro via link de autopreenchimento WhatsApp',
      module: 'Comercial',
    },
    {
      id: 4,
      date: new Date(Date.now() - 1000 * 60 * 60 * 48).toLocaleString('pt-BR'),
      user: 'Admin (Você)',
      action: 'Atualização',
      entity: 'Fornecedor (MetalForte)',
      detail: 'Atualizou dados bancários e Limite de Crédito',
      module: 'Suprimentos',
    },
    {
      id: 5,
      date: new Date(Date.now() - 1000 * 60 * 60 * 72).toLocaleString('pt-BR'),
      user: 'Sistema',
      action: 'Criação',
      entity: 'Colaborador (Rascunho)',
      detail: 'Rascunho criado via OCR em Lote',
      module: 'RH',
    },
  ])

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.entity.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.detail.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center shrink-0">
            <History className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              Histórico de Auditoria
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Registro imutável de todas as ações realizadas no módulo de contatos.
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Pesquisar registros de auditoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Data / Hora</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Entidade Afetada</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((a) => (
                <TableRow key={a.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">
                    {a.date}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      {a.module}
                    </span>
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
                  <TableCell className="text-slate-700 text-sm whitespace-nowrap font-medium">
                    {a.entity}
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">{a.detail}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  Nenhum registro encontrado para a sua busca.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
