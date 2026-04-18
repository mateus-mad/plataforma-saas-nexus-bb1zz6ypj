import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { MapPin, Plus, QrCode, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { getWorkSites, createWorkSite, deleteWorkSite, WorkSite } from '@/services/work_sites'

export default function GestaoObras() {
  const [sites, setSites] = useState<WorkSite[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    radius_meters: '100',
  })

  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
    try {
      const data = await getWorkSites()
      setSites(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const qr_token = crypto.randomUUID()
      await createWorkSite({
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        radius_meters: parseInt(formData.radius_meters, 10),
        qr_token,
      })
      toast({ title: 'Obra cadastrada com sucesso' })
      setOpen(false)
      loadSites()
      setFormData({ name: '', latitude: '', longitude: '', radius_meters: '100' })
    } catch (error) {
      toast({ title: 'Erro ao cadastrar obra', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta obra?')) return
    try {
      await deleteWorkSite(id)
      toast({ title: 'Obra excluída' })
      loadSites()
    } catch (error) {
      toast({ title: 'Erro ao excluir obra', variant: 'destructive' })
    }
  }

  const getQRUrl = (token: string) => {
    const url = `${window.location.origin}/app/ponto/registrar?token=${token}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Obras (Geofencing)</h2>
          <p className="text-muted-foreground">
            Cadastre os locais de trabalho, defina o perímetro e gere os QR Codes de ponto.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Nova Obra
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Obra</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Obra</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Canteiro Central"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input
                    required
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="-23.5505"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input
                    required
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="-46.6333"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Raio de Tolerância (metros)</Label>
                <Input
                  required
                  type="number"
                  value={formData.radius_meters}
                  onChange={(e) => setFormData({ ...formData, radius_meters: e.target.value })}
                  placeholder="100"
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit">Salvar Obra</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Obra</TableHead>
                <TableHead>Coordenadas</TableHead>
                <TableHead>Raio</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-xs text-slate-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {site.latitude}, {site.longitude}
                    </div>
                  </TableCell>
                  <TableCell>{site.radius_meters}m</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <QrCode className="w-4 h-4 mr-2" /> Ver QR Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8">
                        <DialogHeader>
                          <DialogTitle className="text-center">{site.name} - QR Code</DialogTitle>
                        </DialogHeader>
                        <div className="bg-white p-4 rounded-xl shadow-sm border mt-4">
                          <img src={getQRUrl(site.qr_token)} alt="QR Code" className="w-64 h-64" />
                        </div>
                        <p className="text-sm text-center text-slate-500 mt-4">
                          Imprima este QR Code e cole no local da obra.
                          <br />
                          Os colaboradores deverão escaneá-lo para bater o ponto.
                        </p>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(site.id)}>
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && sites.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Nenhuma obra cadastrada.
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
