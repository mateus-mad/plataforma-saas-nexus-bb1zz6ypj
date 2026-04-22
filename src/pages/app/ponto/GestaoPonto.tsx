import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Link } from 'react-router-dom'
import { MapPin, Edit } from 'lucide-react'
import { getTimeEntries, TimeEntry } from '@/services/time_entries'
import { useRealtime } from '@/hooks/use-realtime'
import { format } from 'date-fns'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'

export default function GestaoPonto() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [searchTerm, setSearchTerm] = useState('')

  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)
  const [editTime, setEditTime] = useState('')
  const [editType, setEditType] = useState('')
  const [saving, setSaving] = useState(false)

  const loadEntries = async () => {
    try {
      const start = new Date(`${month}-01T00:00:00`)
      const end = new Date(start)
      end.setMonth(end.getMonth() + 1)

      const filter = `timestamp >= '${start.toISOString().replace('T', ' ')}' && timestamp < '${end.toISOString().replace('T', ' ')}'`
      const data = await getTimeEntries(filter, 'user_id,relacionamento_id,work_site_id')
      setEntries(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadEntries()
  }, [month])

  useRealtime('time_entries', () => {
    loadEntries()
  })

  const filtered = entries.filter((e) => {
    const name = e.expand?.user_id?.name || e.expand?.user_id?.email || ''
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const openEditDialog = (entry: TimeEntry) => {
    setEditingEntry(entry)
    // Convert to local datetime string for input format YYYY-MM-DDTHH:mm
    const dateObj = new Date(entry.timestamp)
    const localIso = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    setEditTime(localIso)
    setEditType(entry.type)
  }

  const handleUpdateEntry = async () => {
    if (!editingEntry || !user) return
    setSaving(true)
    try {
      const newTimestamp = new Date(editTime).toISOString()

      let relId = editingEntry.relacionamento_id
      if (!relId) {
        const rels = await pb
          .collection('relacionamentos')
          .getFullList({ filter: `login_user_id = '${editingEntry.user_id}'` })
        if (rels.length > 0) relId = rels[0].id
      }

      await pb.collection('time_entries').update(editingEntry.id, {
        timestamp: newTimestamp,
        type: editType,
      })

      if (relId) {
        await pb.collection('audit_logs').create({
          relacionamento_id: relId,
          user_id: user.id,
          action: 'update_time_entry',
          module: 'controle-de-ponto',
          field_name: 'timestamp_type',
          old_value: { timestamp: editingEntry.timestamp, type: editingEntry.type },
          new_value: { timestamp: newTimestamp, type: editType },
        })
      }

      toast({ title: 'Registro atualizado e auditado com sucesso.' })
      setEditingEntry(null)
      loadEntries()
    } catch (e) {
      toast({ title: 'Erro ao atualizar o registro.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-4 sm:px-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Gestão de Ponto</h2>
          <p className="text-muted-foreground">
            Monitore em tempo real as marcações de ponto da equipe.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button asChild variant="outline" className="hidden md:flex">
            <Link to="/app/controle-de-ponto/obras">
              <MapPin className="w-4 h-4 mr-2" /> Obras (Geofencing)
            </Link>
          </Button>
          <Input
            placeholder="Buscar colaborador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-64"
          />
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full sm:w-48"
          />
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filtered.map((e) => (
          <Card key={e.id} className="shadow-sm border-slate-200">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-slate-800">
                    {e.expand?.user_id?.name || e.expand?.user_id?.email || 'Desconhecido'}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {format(new Date(e.timestamp), 'dd/MM/yyyy HH:mm:ss')}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-slate-50 uppercase text-[10px] tracking-wider font-bold shrink-0"
                >
                  {e.type.replace('_', ' ')}
                </Badge>
              </div>
              <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded-md">
                <span className="font-medium text-slate-700">Local: </span>
                {e.expand?.work_site_id ? e.expand.work_site_id.name : 'Ponto Remoto'}
              </div>
              <div className="flex justify-between items-center mt-2 border-t pt-3">
                {e.photo ? (
                  <a
                    href={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/time_entries/${e.id}/${e.photo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 font-medium hover:underline"
                  >
                    Ver Foto
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Sem foto</span>
                )}
                <Button variant="ghost" size="sm" className="h-8" onClick={() => openEditDialog(e)}>
                  <Edit className="w-4 h-4 mr-2" /> Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
            Nenhum registro encontrado neste período.
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Auditoria de Registros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Data e Hora</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Obra</TableHead>
                  <TableHead>Localização / Foto</TableHead>
                  <TableHead className="text-right">Ajuste</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium text-slate-800">
                      {e.expand?.user_id?.name || e.expand?.user_id?.email || 'Desconhecido'}
                    </TableCell>
                    <TableCell>{format(new Date(e.timestamp), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-slate-50 uppercase text-[10px] tracking-wider font-bold"
                      >
                        {e.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {e.expand?.work_site_id ? (
                        <span className="text-sm font-medium text-slate-700">
                          {e.expand.work_site_id.name}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Ponto Remoto</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      <div className="flex flex-col gap-1">
                        {e.latitude && e.longitude ? (
                          <span className="text-primary/70 truncate w-32">
                            Lat: {e.latitude.toFixed(4)}, Lng: {e.longitude.toFixed(4)}
                          </span>
                        ) : e.metadata?.location ? (
                          <span className="text-primary/70 truncate w-32">
                            Lat: {e.metadata.location.lat.toFixed(4)}, Lng:{' '}
                            {e.metadata.location.lng.toFixed(4)}
                          </span>
                        ) : (
                          <span>Local não registrado</span>
                        )}
                        {e.photo && (
                          <a
                            href={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/time_entries/${e.id}/${e.photo}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Ver Foto
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(e)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Nenhum registro encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Registro de Ponto</DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <div className="space-y-4 py-4">
              <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                Qualquer alteração manual será registrada em log de auditoria para fins de
                compliance.
              </div>
              <div className="space-y-2">
                <Label>Data e Hora do Registro</Label>
                <Input
                  type="datetime-local"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Marcação</Label>
                <Select value={editType} onValueChange={(v) => setEditType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="pausa_inicio">Início de Pausa</SelectItem>
                    <SelectItem value="pausa_fim">Fim de Pausa</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateEntry} disabled={saving} className="w-full mt-2">
                {saving ? 'Salvando Alterações...' : 'Salvar e Registrar Auditoria'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
