import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDesc,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Users, MapPin, Trash2, CalendarDays, KeyRound } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { format } from 'date-fns'

export default function GestaoLocacao() {
  const [allocations, setAllocations] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [workSites, setWorkSites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    relacionamento_id: '',
    work_site_id: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'ativo',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [allocs, emps, sites] = await Promise.all([
        pb
          .collection('allocations')
          .getFullList({ expand: 'relacionamento_id,work_site_id', sort: '-created' }),
        pb
          .collection('relacionamentos')
          .getFullList({ filter: "type = 'colaborador'", sort: 'name' }),
        pb.collection('work_sites').getFullList({ sort: 'name' }),
      ])
      setAllocations(allocs)
      setEmployees(emps)
      setWorkSites(sites)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await pb.collection('allocations').create({
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      })
      toast({ title: 'Colaborador alocado com sucesso' })
      setOpen(false)
      loadData()
      setFormData({
        relacionamento_id: '',
        work_site_id: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        status: 'ativo',
      })
    } catch (error) {
      toast({ title: 'Erro ao alocar colaborador', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja remover esta alocação?')) return
    try {
      await pb.collection('allocations').delete(id)
      toast({ title: 'Alocação removida' })
      loadData()
    } catch (error) {
      toast({ title: 'Erro ao remover', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Gestão de Locação</h2>
          <p className="text-muted-foreground mt-1">
            Aloque colaboradores às obras e gere automaticamente o login de acesso ao app.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Nova Alocação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Alocar Colaborador</DialogTitle>
              <DialogDesc>
                O colaborador receberá acesso ao app de ponto (Login e Senha: CPF).
              </DialogDesc>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Colaborador</Label>
                <Select
                  value={formData.relacionamento_id}
                  onValueChange={(v) => setFormData({ ...formData, relacionamento_id: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um colaborador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name} ({emp.document_number || 'Sem CPF'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Obra (Centro de Custo)</Label>
                <Select
                  value={formData.work_site_id}
                  onValueChange={(v) => setFormData({ ...formData, work_site_id: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a obra..." />
                  </SelectTrigger>
                  <SelectContent>
                    {workSites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name} {site.cost_center ? `(${site.cost_center})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim (Opcional)</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="mr-2"
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Obra Atual</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Credenciais</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocations.map((alloc) => {
                const emp = alloc.expand?.relacionamento_id
                const site = alloc.expand?.work_site_id
                return (
                  <TableRow key={alloc.id}>
                    <TableCell className="font-medium text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div>{emp?.name || 'Desconhecido'}</div>
                          <div className="text-xs text-slate-500">{emp?.document_number}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-slate-700">
                        <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                        {site?.name || 'Não definida'}
                      </div>
                      {site?.cost_center && (
                        <div className="text-xs text-slate-500 ml-6">CC: {site.cost_center}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex items-center gap-1.5 text-sm">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        <span>{format(new Date(alloc.start_date), 'dd/MM/yyyy')}</span>
                        {alloc.end_date && (
                          <span>até {format(new Date(alloc.end_date), 'dd/MM/yyyy')}</span>
                        )}
                        {!alloc.end_date && (
                          <span className="text-emerald-600 font-medium text-xs bg-emerald-50 px-1.5 py-0.5 rounded">
                            Ativo
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {emp?.login_user_id ? (
                        <div className="flex flex-col text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-emerald-500" /> App Ativo
                          </span>
                          <span>User: {emp.document_number?.replace(/\D/g, '')}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          Pendente Login
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(alloc.id)}
                        className="text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {!loading && allocations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    Nenhuma alocação encontrada.
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
