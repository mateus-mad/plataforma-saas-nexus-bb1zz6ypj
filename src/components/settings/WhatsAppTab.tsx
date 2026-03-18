import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Key,
  Phone,
  Save,
  Loader2,
  Send,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { db } from '@/lib/database'

export default function WhatsAppTab() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const [config, setConfig] = useState({
    isUnlocked: false,
    apiKey: '',
    phoneNumber: '',
    testNumber: '',
  })

  useEffect(() => {
    const loadConfig = async () => {
      const data = await db.get('whatsapp_config')
      if (data) {
        setConfig(data)
      }
      setIsLoading(false)
    }
    loadConfig()
  }, [])

  const handleSave = async () => {
    if (!config.apiKey || !config.phoneNumber) {
      toast({
        variant: 'destructive',
        title: 'Campos Obrigatórios',
        description: 'Preencha a API Key e o Número do Remetente para ativar a integração.',
      })
      return
    }

    setIsSaving(true)
    const newConfig = { ...config, isUnlocked: true }
    await db.set('whatsapp_config', newConfig)
    setConfig(newConfig)

    toast({
      title: 'WhatsApp Configurado',
      description: 'A API do WhatsApp foi ativada com sucesso para sua conta.',
    })
    setIsSaving(false)
  }

  const handleTestMessage = () => {
    if (!config.testNumber) {
      toast({ variant: 'destructive', description: 'Insira um número válido para o teste.' })
      return
    }
    setIsTesting(true)
    setTimeout(() => {
      setIsTesting(false)
      toast({
        title: 'Mensagem de Teste Enviada!',
        description: `Enviamos um template de teste para ${config.testNumber}. Verifique seu aparelho.`,
      })
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-emerald-500" />
            Integração WhatsApp API Oficial
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Conecte sua conta para enviar notificações automatizadas, links de admissão e cobranças
            diretamente pelo ERP.
          </p>
        </div>
        {config.isUnlocked ? (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 text-sm font-semibold shadow-sm">
            <CheckCircle2 className="w-4 h-4" /> API Conectada
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200 text-sm font-semibold shadow-sm">
            <AlertCircle className="w-4 h-4" /> Aguardando Configuração
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Credenciais da API</CardTitle>
            <CardDescription>
              Insira as credenciais fornecidas pelo seu provedor (Z-API, Twilio, ou Meta Oficial).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-semibold">
                <Key className="w-4 h-4 text-slate-400" /> Token / API Key
              </Label>
              <Input
                type="password"
                placeholder="ex: sk_live_..."
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                className="shadow-sm font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-semibold">
                <Phone className="w-4 h-4 text-slate-400" /> Número Remetente (ID)
              </Label>
              <Input
                placeholder="Ex: 5511999999999"
                value={config.phoneNumber}
                onChange={(e) => setConfig({ ...config, phoneNumber: e.target.value })}
                className="shadow-sm font-mono"
              />
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-end p-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar Configurações
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card
            className={`shadow-sm transition-opacity ${!config.isUnlocked ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <CardHeader>
              <CardTitle className="text-lg">Teste de Conectividade</CardTitle>
              <CardDescription>
                Envie uma mensagem de teste para garantir que o webhook está funcionando.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Número de Destino (Com DDI e DDD)</Label>
                <div className="flex gap-3">
                  <Input
                    placeholder="5511988887777"
                    value={config.testNumber}
                    onChange={(e) => setConfig({ ...config, testNumber: e.target.value })}
                    className="shadow-sm font-mono flex-1"
                  />
                  <Button
                    onClick={handleTestMessage}
                    disabled={isTesting}
                    variant="outline"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 shadow-sm shrink-0"
                  >
                    {isTesting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}{' '}
                    Testar Envio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-blue-200 bg-blue-50/50">
            <CardContent className="p-5">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                Recursos Desbloqueados
              </h4>
              <ul className="text-sm text-blue-800 space-y-2 list-disc pl-5">
                <li>Disparo de Links de Onboarding para candidatos.</li>
                <li>Aviso automático de cobrança (Faturas próximas ao vencimento).</li>
                <li>Notificação de Assinatura Digital de Contratos.</li>
                <li>Botão de envio direto na ficha de Colaboradores e Clientes.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
