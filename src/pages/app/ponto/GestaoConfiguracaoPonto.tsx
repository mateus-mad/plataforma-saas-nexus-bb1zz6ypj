import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { BookOpen, Settings, MapPin, Users, AlertTriangle } from 'lucide-react'
import GestaoObras from './GestaoObras'
import GestaoEquipe from './GestaoEquipe'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  getConfigurations,
  createConfiguration,
  updateConfiguration,
} from '@/services/configurations'
import { useAuth } from '@/hooks/use-auth'

export default function GestaoConfiguracaoPonto() {
  const [activeTab, setActiveTab] = useState('leis')

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10 px-4 md:px-0">
      <div className="flex items-center gap-3 mb-6">
        <SidebarTrigger className="md:hidden" />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
            Configuração do Ponto
          </h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Gerencie leis, regras, obras e a equipe em um único lugar.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-100/50 p-1">
          <TabsTrigger value="leis" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />{' '}
            <span className="hidden sm:inline">Leis Trabalhistas</span>
          </TabsTrigger>
          <TabsTrigger value="regras" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />{' '}
            <span className="hidden sm:inline">Regras Customizadas</span>
          </TabsTrigger>
          <TabsTrigger value="obras" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> <span className="hidden sm:inline">Gestão de Obras</span>
          </TabsTrigger>
          <TabsTrigger value="equipe" className="flex items-center gap-2">
            <Users className="w-4 h-4" /> <span className="hidden sm:inline">Gestão de Equipe</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leis" className="space-y-4 animate-fade-in-up">
          <LeisTrabalhistas />
        </TabsContent>
        <TabsContent value="regras" className="space-y-4 animate-fade-in-up">
          <RegrasCustomizadas />
        </TabsContent>
        <TabsContent value="obras" className="space-y-4 animate-fade-in-up">
          <GestaoObras hideHeader />
        </TabsContent>
        <TabsContent value="equipe" className="space-y-4 animate-fade-in-up">
          <GestaoEquipe hideHeader />
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
            <li>
              Tolerância de 5 a 10 minutos diários (Art. 58, § 1º) sem desconto ou cômputo como hora
              extra.
            </li>
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
  const [formData, setFormData] = useState({
    toleranceMinutes: 10,
    minRestMinutes: 60,
    maxOvertime: 2,
    nightShiftStart: '22:00',
    nightShiftEnd: '05:00',
  })
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const configs = await getConfigurations('ponto_config')
      if (configs.length > 0) {
        setConfigId(configs[0].id)
        if (configs[0].data) {
          setFormData({
            toleranceMinutes: configs[0].data.toleranceMinutes || 10,
            minRestMinutes: configs[0].data.minRestMinutes || 60,
            maxOvertime: configs[0].data.maxOvertime || 2,
            nightShiftStart: configs[0].data.nightShiftStart || '22:00',
            nightShiftEnd: configs[0].data.nightShiftEnd || '05:00',
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
        description: 'Você precisa aceitar o termo de responsabilidade.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const dataToSave = {
        type: 'ponto_config',
        name: 'Configurações de Ponto',
        data: {
          ...formData,
          authorizedBy: user?.id,
          authorizedAt: new Date().toISOString(),
        },
      }

      if (configId) {
        await updateConfiguration(configId, dataToSave)
      } else {
        const newConf = await createConfiguration(dataToSave)
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

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex gap-3 mt-8">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-3">
            <h4 className="font-semibold text-amber-800">Termo de Responsabilidade</h4>
            <p className="text-sm text-amber-700">
              Ao habilitar regras customizadas que divergem das normas padrões da CLT, a empresa
              declara estar amparada por <strong>Acordo Coletivo de Trabalho (ACT)</strong> ou{' '}
              <strong>Convenção Coletiva de Trabalho (CCT)</strong>. A plataforma não se
              responsabiliza por passivos trabalhistas gerados por configurações indevidas.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={authorized}
                onCheckedChange={(c) => setAuthorized(c === true)}
                className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-amber-900 cursor-pointer"
              >
                Declaro ter ciência e autorizo a aplicação destas regras ({user?.email}).
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={saving} className="min-w-[160px]">
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
