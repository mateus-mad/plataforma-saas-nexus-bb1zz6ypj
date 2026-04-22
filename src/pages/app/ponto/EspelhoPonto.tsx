import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function EspelhoPonto() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    const start = startOfMonth(new Date())
    const end = endOfMonth(new Date())

    const records = await pb.collection('time_entries').getFullList({
      filter: `user_id = '${user?.id}' && timestamp >= '${start.toISOString().replace('T', ' ')}' && timestamp <= '${end.toISOString().replace('T', ' ')}'`,
      sort: '-timestamp',
      expand: 'work_site_id',
    })
    setEntries(records)
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10 px-4 md:px-0">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Espelho de Ponto</h2>
        <p className="text-muted-foreground mt-1">Seu histórico de marcações deste mês.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Data e Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Obra</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium text-slate-700">
                    {format(new Date(entry.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="capitalize">{entry.type.replace('_', ' ')}</TableCell>
                  <TableCell>{entry.expand?.work_site_id?.name || '-'}</TableCell>
                </TableRow>
              ))}
              {entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                    Nenhum registro encontrado este mês.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
