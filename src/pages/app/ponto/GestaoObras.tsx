import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  DialogDescription as DialogDesc,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MapPin, Plus, QrCode, Trash2, Crosshair, Navigation, Edit, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getWorkSites,
  createWorkSite,
  updateWorkSite,
  deleteWorkSite,
  WorkSite,
} from '@/services/work_sites'

function InteractiveMap({ lat, lng, radius, onChange, onAddressFound, onLocationError }: any) {
  const [pinPos, setPinPos] = useState({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (lat && lng && !isDragging) {
      setPinPos({ x: 50, y: 50 })
    }
  }, [lat, lng, isDragging])

  const updatePosition = (clientX: number, clientY: number) => {
    if (!mapRef.current) return
    const rect = mapRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))
    setPinPos({ x, y })

    const refLat = -23.5505
    const refLng = -46.6333
    const newLat = refLat + (50 - y) * 0.0005
    const newLng = refLng + (x - 50) * 0.0005

    onChange(newLat.toFixed(6), newLng.toFixed(6))
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    updatePosition(e.clientX, e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    updatePosition(e.clientX, e.clientY)
  }

  const handlePointerUp = async (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)

    if (lat && lng && onAddressFound) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        )
        const data = await res.json()
        if (data && data.display_name) {
          onAddressFound(data.display_name)
        }
      } catch (err) {
        console.error('Geocoding error', err)
      }
    }
  }

  const handleSearchAddress = async () => {
    if (!searchQuery) return
    setIsSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      )
      const data = await res.json()
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat).toFixed(6)
        const newLng = parseFloat(data[0].lon).toFixed(6)
        onChange(newLat, newLng)
        if (onAddressFound) onAddressFound(data[0].display_name)
      } else {
        onLocationError?.('Endereço não encontrado.')
      }
    } catch (err) {
      onLocationError?.('Erro ao buscar endereço. Verifique sua conexão.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleCurrentLocation = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const newLat = pos.coords.latitude.toFixed(6)
          const newLng = pos.coords.longitude.toFixed(6)
          onChange(newLat, newLng)
          setPinPos({ x: 50, y: 50 })

          if (onAddressFound) {
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}`,
              )
              const data = await res.json()
              if (data && data.display_name) {
                onAddressFound(data.display_name)
              }
            } catch {
              /* intentionally ignored */
            }
          }
        },
        (error) => {
          console.error(error)
          onLocationError?.(
            'Não foi possível obter sua localização. Verifique as permissões do navegador.',
          )
        },
        { enableHighAccuracy: true },
      )
    } else {
      onLocationError?.('Geolocalização não suportada pelo navegador.')
    }
  }

  const visualRadius = Math.min(Math.max((radius / 1000) * 200, 20), 400)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Localização no Mapa</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCurrentLocation}
          className="h-7 text-xs"
        >
          <Navigation className="w-3 h-3 mr-1" /> Usar Minha Localização
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar endereço (ex: Av. Paulista, São Paulo)"
          className="h-9 text-sm flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearchAddress()
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-9"
          onClick={handleSearchAddress}
          disabled={isSearching}
        >
          <Search className="w-4 h-4 mr-2" /> Buscar
        </Button>
      </div>

      <div
        ref={mapRef}
        className="relative w-full h-[250px] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 cursor-crosshair group touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/800/400?q=street%20map&color=gray')] bg-cover bg-center opacity-50 mix-blend-multiply transition-transform duration-1000 pointer-events-none" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 pointer-events-none">
          <span className="bg-white/90 text-slate-800 text-xs px-2 py-1 rounded shadow-sm flex items-center absolute top-2">
            <Crosshair className="w-3 h-3 mr-1" /> Clique ou arraste para definir
          </span>
        </div>

        {lat && lng && (
          <div
            className="absolute pointer-events-none transition-all duration-75"
            style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
          >
            <div
              className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-primary/20 animate-pulse"
              style={{ width: `${visualRadius * 2}px`, height: `${visualRadius * 2}px` }}
            />
            <MapPin className="w-8 h-8 text-primary absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-0 drop-shadow-md" />
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        A área circulada representa o perímetro (geofence) para registro de ponto.
      </p>
    </div>
  )
}

export default function GestaoObras({ hideHeader }: { hideHeader?: boolean }) {
  const [sites, setSites] = useState<WorkSite[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    radius_meters: '100',
    cost_center: '',
  })

  useEffect(() => {
    loadSites()
  }, [])

  useRealtime('work_sites', () => {
    loadSites()
  })

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

  const handleEdit = (site: WorkSite) => {
    setEditingId(site.id)
    setFormData({
      name: site.name,
      latitude: site.latitude.toString(),
      longitude: site.longitude.toString(),
      radius_meters: site.radius_meters.toString(),
      cost_center: site.cost_center || '',
    })
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateWorkSite(editingId, {
          name: formData.name,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          radius_meters: parseInt(formData.radius_meters, 10),
          cost_center: formData.cost_center,
        })
        toast({ title: 'Obra atualizada com sucesso' })
      } else {
        const qr_token = crypto.randomUUID()
        await createWorkSite({
          name: formData.name,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          radius_meters: parseInt(formData.radius_meters, 10),
          qr_token,
          cost_center: formData.cost_center,
        })
        toast({ title: 'Obra cadastrada com sucesso' })
      }
      setOpen(false)
      loadSites()
      setEditingId(null)
      setFormData({ name: '', latitude: '', longitude: '', radius_meters: '100', cost_center: '' })
    } catch (error) {
      toast({
        title: editingId ? 'Erro ao atualizar' : 'Erro ao cadastrar',
        variant: 'destructive',
      })
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
    <div
      className={
        hideHeader
          ? 'space-y-4 animate-fade-in'
          : 'space-y-6 animate-fade-in max-w-7xl mx-auto pb-10 px-4 md:px-0'
      }
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        {!hideHeader ? (
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
                Gestão de Obras
              </h2>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Cadastre os locais de trabalho, defina o perímetro (Geofencing) e gere os QR Codes.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) {
              setEditingId(null)
              setFormData({
                name: '',
                latitude: '',
                longitude: '',
                radius_meters: '100',
                cost_center: '',
              })
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 min-h-[44px] w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Nova Obra
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Obra' : 'Cadastrar Nova Obra'}</DialogTitle>
              <DialogDesc>
                {editingId
                  ? 'Altere as informações da obra.'
                  : 'Defina o nome, a localização e o raio de tolerância.'}
              </DialogDesc>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Nome da Obra <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Canteiro Central"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Centro de Custo</Label>
                  <Input
                    value={formData.cost_center}
                    onChange={(e) => setFormData({ ...formData, cost_center: e.target.value })}
                    placeholder="Ex: CC-2024-01"
                  />
                </div>
              </div>

              <InteractiveMap
                lat={formData.latitude}
                lng={formData.longitude}
                radius={parseInt(formData.radius_meters) || 100}
                onChange={(lat: string, lng: string) =>
                  setFormData({ ...formData, latitude: lat, longitude: lng })
                }
                onAddressFound={(address: string) => {
                  if (!formData.name)
                    setFormData((prev) => ({ ...prev, name: address.split(',')[0] }))
                }}
                onLocationError={(msg: string) => {
                  toast({ title: 'Atenção', description: msg, variant: 'destructive' })
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Latitude <span className="text-rose-500">*</span>
                  </Label>
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
                  <Label>
                    Longitude <span className="text-rose-500">*</span>
                  </Label>
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
                <Label>
                  Raio de Tolerância (metros) <span className="text-rose-500">*</span>
                </Label>
                <Input
                  required
                  type="number"
                  min="10"
                  value={formData.radius_meters}
                  onChange={(e) => setFormData({ ...formData, radius_meters: e.target.value })}
                  placeholder="100"
                />
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
                <Button type="submit">{editingId ? 'Atualizar Obra' : 'Salvar Obra'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-slate-200 overflow-hidden w-full min-w-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Nome da Obra</TableHead>
                <TableHead>Centro de Custo</TableHead>
                <TableHead>Coordenadas (Lat, Lng)</TableHead>
                <TableHead>Raio Permitido</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-800">{site.name}</TableCell>
                  <TableCell className="text-slate-600">{site.cost_center || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                      {site.latitude.toFixed(5)}, {site.longitude.toFixed(5)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/60 rounded-full"
                          style={{ width: `${Math.min((site.radius_meters / 500) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-600">
                        {site.radius_meters}m
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="bg-white">
                          <QrCode className="w-4 h-4 mr-2" /> QR Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8">
                        <DialogHeader>
                          <DialogTitle className="text-center text-xl">{site.name}</DialogTitle>
                          <DialogDesc className="text-center">
                            Escaneie para registrar o ponto nesta obra.
                          </DialogDesc>
                        </DialogHeader>
                        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 mt-4 relative group">
                          <img src={getQRUrl(site.qr_token)} alt="QR Code" className="w-64 h-64" />
                          <div
                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer"
                            onClick={() => window.open(getQRUrl(site.qr_token), '_blank')}
                          >
                            <span className="text-white font-medium px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm">
                              Ampliar / Imprimir
                            </span>
                          </div>
                        </div>
                        <div className="mt-6 flex flex-col items-center space-y-2 text-sm text-slate-500">
                          <p className="text-center max-w-xs">
                            Imprima e fixe este código em local visível no canteiro de obras.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(site)}
                      className="hover:bg-primary/10 hover:text-primary min-h-[44px] min-w-[44px]"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(site.id)}
                      className="hover:bg-rose-50 hover:text-rose-500 min-h-[44px] min-w-[44px]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && sites.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <MapPin className="w-8 h-8 text-slate-300 mb-2" />
                      <p>Nenhuma obra cadastrada.</p>
                      <p className="text-xs">Adicione uma obra para começar a gerar QR Codes.</p>
                    </div>
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
