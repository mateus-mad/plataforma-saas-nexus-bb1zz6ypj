import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { AlertTriangle, Save, Clock, Camera, Moon, MapPin, Users, Settings2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import {
  getConfigurations,
  createConfiguration,
  updateConfiguration,
} from '@/services/configurations'

export default function PontoTab() {
  const { toast } = useToast()
  const [configId, setConfigId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [data, setData] = useState({
    toleranceMinutes: 10,
    mandatoryPhoto: true,
    nightShiftStart: '22:00',
    geofenceEnabled: true,
  })

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const records = await getConfigurations('ponto')
      if (records.length > 0) {
        setConfigId(records[0].id)
        if (records[0].data) {
          setData(records[0].data)
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (configId) {
        await updateConfiguration(configId, { data })
      } else {
        const res = await createConfiguration({ name: 'Regras de Ponto', type: 'ponto', data })
        setConfigId(res.id)
      }
      toast({ title: 'Configurações de ponto salvas com sucesso!' })
    } catch (error) {
      toast({ title: 'Erro ao salvar configurações', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-40 flex items-center justify-center">Carregando...</div>

  return (
    <div className="space-y-6 mt-6 animate-fade-in pb-10">
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-xl font-semibold text-slate-800">Controle de Ponto Centralizado</h3>
        <p className="text-sm text-slate-500">
          Gerencie obras, locação de colaboradores e as regras de compliance para o registro de
          ponto.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/app/ponto/obras" className="block h-full">
          <Card className="hover:border-primary transition-all duration-200 cursor-pointer h-full hover:shadow-md">
            <CardContent className="p-4 flex items-center gap-3 h-full">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Gestão de Obras</h4>
                <p className="text-xs text-slate-500 mt-0.5">Perímetros e QR Codes</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/app/ponto/locacao" className="block h-full">
          <Card className="hover:border-blue-500 transition-all duration-200 cursor-pointer h-full hover:shadow-md">
            <CardContent className="p-4 flex items-center gap-3 h-full">
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Gestão de Locação</h4>
                <p className="text-xs text-slate-500 mt-0.5">Alocação de Colaboradores</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <div className="block h-full cursor-default">
          <Card className="border-emerald-500/30 bg-emerald-50/30 h-full">
            <CardContent className="p-4 flex items-center gap-3 h-full">
              <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-600 shrink-0">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Regras de Ponto</h4>
                <p className="text-xs text-slate-500 mt-0.5">Configurações abaixo</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-800 text-sm">
            Aviso Legal (Compliance Trabalhista)
          </h4>
          <p className="text-sm text-amber-700/90 leading-relaxed mt-1">
            O usuário é inteiramente responsável por configurar estas regras de acordo com a
            legislação trabalhista local (ex: CLT) e acordos sindicais aplicáveis. O sistema atua
            apenas como ferramenta de registro e cálculo baseado nos parâmetros aqui definidos.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Regras de Validação</CardTitle>
          <CardDescription>
            Defina como o sistema deve validar as marcações de ponto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Camera className="w-4 h-4 text-slate-500" /> Foto Obrigatória
              </Label>
              <p className="text-sm text-muted-foreground">
                Exigir uma selfie no momento do registro.
              </p>
            </div>
            <Switch
              checked={data.mandatoryPhoto}
              onCheckedChange={(c) => setData({ ...data, mandatoryPhoto: c })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" /> Validação de Geofence
              </Label>
              <p className="text-sm text-muted-foreground">
                Bloquear registros fora do raio da obra.
              </p>
            </div>
            <Switch
              checked={data.geofenceEnabled}
              onCheckedChange={(c) => setData({ ...data, geofenceEnabled: c })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Parâmetros de Cálculo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" /> Tolerância (minutos)
              </Label>
              <Input
                type="number"
                value={data.toleranceMinutes}
                onChange={(e) =>
                  setData({ ...data, toleranceMinutes: parseInt(e.target.value) || 0 })
                }
              />
              <p className="text-xs text-muted-foreground">
                Minutos de tolerância antes de contabilizar atraso ou hora extra.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-slate-500" /> Início do Adicional Noturno
              </Label>
              <Input
                type="time"
                value={data.nightShiftStart}
                onChange={(e) => setData({ ...data, nightShiftStart: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Horário a partir do qual as horas são consideradas noturnas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-primary">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  )
}
