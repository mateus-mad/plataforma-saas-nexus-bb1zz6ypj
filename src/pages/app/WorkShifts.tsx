import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Clock, AlertTriangle, ArrowLeft, Plus, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getConfigurations, createConfiguration } from '@/services/configurations'

export default function WorkShifts() {
  const [shifts, setShifts] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('CLT Padrão')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadShifts = async () => {
    try {
      const data = await getConfigurations('jornada')
      setShifts(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShifts()
  }, [])

  const handleSave = async () => {
    if (!name) return
    setSaving(true)
    try {
      await createConfiguration({
        name,
        type: 'jornada',
        data: {
          shiftType: type,
          hours: type === 'Flexível' ? 'Variável' : '8h/dia (44h/sem)',
        },
      })
      await loadShifts()
      setOpen(false)
      setName('')
      setType('CLT Padrão')
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link to="/app/configuracoes?tab=hr">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Jornadas de Trabalho</h2>
          <p className="text-muted-foreground">
            Configure as escalas de horários para alocação de RH.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Jornadas Cadastradas
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Criar Jornada
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Jornada de Trabalho</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nome da Jornada</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Administrativo Flex"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Jornada</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLT Padrão">CLT Padrão (8h/dia, 44h/sem)</SelectItem>
                      <SelectItem value="Flexível">Jornada Flexível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {type === 'Flexível' && (
                  <Alert
                    variant="destructive"
                    className="bg-amber-50 border-amber-200 text-amber-800 animate-in fade-in slide-in-from-top-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <AlertTitle>Aviso Legal</AlertTitle>
                    <AlertDescription className="text-xs leading-relaxed mt-1">
                      Certifique-se de que a jornada flexível respeita os limites legais e não
                      caracteriza condições análogas ao trabalho escravo ou abusivo. O intervalo
                      interjornada de 11h deve ser obrigatoriamente mantido.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={!name || saving}>
                  {saving ? 'Salvando...' : 'Salvar Jornada'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead>Nome da Jornada</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Carga Horária</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <Activity className="w-5 h-5 animate-spin mx-auto text-slate-400" />
                    </TableCell>
                  </TableRow>
                ) : shifts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Nenhuma jornada cadastrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  shifts.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium text-slate-800">{s.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50 font-normal">
                          {s.data?.shiftType || 'Padrão'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {s.data?.hours || 'Não definida'}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-100 text-emerald-700 border-none hover:bg-emerald-200">
                          Ativa
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
