import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDesc,
  DialogFooter,
} from '@/components/ui/dialog'
import { AlertTriangle, Save, Camera, MapPin, Lock, BookOpen, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import {
  getConfigurations,
  createConfiguration,
  updateConfiguration,
} from '@/services/configurations'
import pb from '@/lib/pocketbase/client'

export default function PontoTab() {
  const [activeTab, setActiveTab] = useState('leis')

  return (
    <div className="space-y-6 mt-6 animate-fade-in pb-10">
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-xl font-semibold text-slate-800">Regras de Ponto</h3>
        <p className="text-sm text-slate-500">
          Gerencie políticas legais e regras customizadas para o registro de ponto.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100/50 p-1 max-w-md">
          <TabsTrigger value="leis" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />{' '}
            <span className="hidden sm:inline">Leis Trabalhistas</span>
          </TabsTrigger>
          <TabsTrigger value="regras" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />{' '}
            <span className="hidden sm:inline">Regras Customizadas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leis" className="space-y-4 animate-fade-in-up">
          <LeisTrabalhistas />
        </TabsContent>
        <TabsContent value="regras" className="space-y-4 animate-fade-in-up">
          <RegrasCustomizadas />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LeisTrabalhistas() {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Leis Trabalhistas e Portaria 671</CardTitle>
        <CardDescription>
          Entenda as exigências legais para o controle de ponto eletrônico no Brasil.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-slate-900">Portaria 671/2021 do MTP</h3>
          <p>
            A Portaria 671 regulamenta o registro eletrônico de ponto, unificando regras anteriores
            (como as Portarias 1510 e 373). O sistema REP-P (Registrador Eletrônico de Ponto via
            Programa) permite o registro de jornada por meio de aplicativos e softwares.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-slate-900">Requisitos Técnicos</h3>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-primary">
            <li>
              <strong>Emissão de Comprovante:</strong> O sistema deve emitir o Comprovante de
              Registro de Ponto do Trabalhador.
            </li>
            <li>
              <strong>Armazenamento Seguro:</strong> Os dados devem ser armazenados de forma segura,
              garantindo a integridade (NTP - Núcleo do Tempo).
            </li>
            <li>
              <strong>Relatório AFD:</strong> Capacidade de exportar o Arquivo Fonte de Dados (AFD)
              para auditoria fiscal.
            </li>
            <li>
              <strong>Sem restrições:</strong> É proibido restringir horários de marcação ou exigir
              autorização prévia para horas extras.
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-slate-900">
            CLT - Consolidação das Leis do Trabalho
          </h3>
          <p>A CLT estabelece regras sobre a jornada de trabalho, como:</p>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-primary">
            <li>A jornada padrão é de até 8 horas diárias e 44 horas semanais.</li>
            <li>Intervalo intrajornada de no mínimo 1 hora para jornadas superiores a 6 horas.</li>
            <li>Intervalo interjornada de no mínimo 11 horas consecutivas entre duas jornadas.</li>
            <li>Tolerância de 5 a 10 minutos diários sem desconto ou cômputo como hora extra.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function RegrasCustomizadas() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [configId, setConfigId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [authPassword, setAuthPassword] = useState('')

  const [formData, setFormData] = useState({
    toleranceMinutes: 10,
    minRestMinutes: 60,
    maxOvertime: 2,
    nightShiftStart: '22:00',
    nightShiftEnd: '05:00',
    mandatoryPhoto: true,
    geofenceEnabled: true,
    customRulesText: '',
  })
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const configs = await getConfigurations('jornada')
      if (configs.length > 0) {
        setConfigId(configs[0].id)
        if (configs[0].data) {
          setFormData({
            ...formData,
            ...configs[0].data,
          })
          setAuthorized(!!configs[0].data.authorizedBy)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!authorized) {
      toast({
        title: 'Atenção',
        description: 'Você precisa autorizar as regras customizadas.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const dataToSave = {
        ...formData,
        authorizedBy: user?.id,
        authorizedAt: new Date().toISOString(),
      }

      if (configId) {
        await updateConfiguration(configId, { data: dataToSave })
      } else {
        const newConf = await createConfiguration({
          name: 'Regras de Ponto',
          type: 'jornada',
          data: dataToSave,
        })
        setConfigId(newConf.id)
      }
      toast({ title: 'Sucesso', description: 'Regras customizadas salvas com sucesso.' })
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAuthorizeCustomRules = async () => {
    try {
      if (!pb.authStore.record?.email) throw new Error('No email found')
      await pb.collection('users').authWithPassword(pb.authStore.record.email, authPassword)
      setAuthorized(true)
      setShowAuthDialog(false)
      setAuthPassword('')
      toast({ title: 'Regras customizadas autorizadas com sucesso.' })
    } catch (err) {
      toast({ title: 'Senha incorreta ou erro de autorização', variant: 'destructive' })
    }
  }

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse">
        Carregando configurações...
      </div>
    )

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Regras Customizadas de Ponto</CardTitle>
        <CardDescription>
          Defina as regras operacionais da sua empresa. Regras que divergem da CLT exigem acordo
          coletivo ou convenção.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Tolerância Diária (minutos)</Label>
            <Input
              type="number"
              value={formData.toleranceMinutes}
              onChange={(e) =>
                setFormData({ ...formData, toleranceMinutes: parseInt(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-slate-500">
              CLT padrão: 10 minutos diários (5 por marcação).
            </p>
          </div>
          <div className="space-y-2">
            <Label>Intervalo Mínimo Refeição (minutos)</Label>
            <Input
              type="number"
              value={formData.minRestMinutes}
              onChange={(e) =>
                setFormData({ ...formData, minRestMinutes: parseInt(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-slate-500">CLT padrão: 60 minutos para jornadas {'>'} 6h.</p>
          </div>
          <div className="space-y-2">
            <Label>Máximo de Horas Extras Diárias</Label>
            <Input
              type="number"
              value={formData.maxOvertime}
              onChange={(e) =>
                setFormData({ ...formData, maxOvertime: parseInt(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-slate-500">CLT padrão: 2 horas.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Início Adicional Noturno</Label>
              <Input
                type="time"
                value={formData.nightShiftStart}
                onChange={(e) => setFormData({ ...formData, nightShiftStart: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fim Adicional Noturno</Label>
              <Input
                type="time"
                value={formData.nightShiftEnd}
                onChange={(e) => setFormData({ ...formData, nightShiftEnd: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t">
          <h4 className="font-semibold text-sm text-slate-800">Parâmetros de Aplicativo</h4>

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
              checked={formData.mandatoryPhoto}
              onCheckedChange={(c) => setFormData({ ...formData, mandatoryPhoto: c })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" /> Validação de Geofence
              </Label>
              <p className="text-sm text-muted-foreground">
                Bloquear registros fora do raio da obra.
              </p>
            </div>
            <Switch
              checked={formData.geofenceEnabled}
              onCheckedChange={(c) => setFormData({ ...formData, geofenceEnabled: c })}
            />
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <Label className="text-slate-700">Acordos ou Convenções Coletivas</Label>
          <textarea
            className="w-full min-h-[80px] text-sm p-3 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Descreva aqui os acordos sindicais ou regras específicas da empresa (CCT, tolerâncias específicas, etc)..."
            value={formData.customRulesText}
            onChange={(e) => setFormData({ ...formData, customRulesText: e.target.value })}
          />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex gap-3 mt-8">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-3 w-full">
            <h4 className="font-semibold text-amber-800">Termo de Responsabilidade</h4>
            <p className="text-sm text-amber-700">
              Ao habilitar regras customizadas que divergem das normas padrões da CLT, a empresa
              declara estar amparada por <strong>Acordo Coletivo de Trabalho (ACT)</strong> ou{' '}
              <strong>Convenção Coletiva de Trabalho (CCT)</strong>. A plataforma não se
              responsabiliza por passivos trabalhistas gerados por configurações indevidas.
            </p>

            {!authorized ? (
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-white border-amber-300 text-amber-700 hover:bg-amber-100"
                  onClick={() => setShowAuthDialog(true)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Autorizar Regras Customizadas
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={authorized}
                  onCheckedChange={(c) => {
                    if (!c) setAuthorized(false)
                  }}
                  className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-amber-900 cursor-pointer"
                >
                  Autorizado por {user?.email}.
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={saving} className="min-w-[160px]">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </CardContent>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-500" />
              Autorizar Regras Customizadas
            </DialogTitle>
            <DialogDesc>
              Para habilitar regras customizadas que podem divergir da legislação padrão, é
              necessária a assinatura eletrônica do administrador. Por favor, confirme sua senha.
            </DialogDesc>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Senha do Administrador</Label>
              <Input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Insira sua senha atual"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAuthorizeCustomRules}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Confirmar Autorização
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
