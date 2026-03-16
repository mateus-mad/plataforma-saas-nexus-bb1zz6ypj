import { Navigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, Settings, Phone, CheckCircle2 } from 'lucide-react'
import useSecurityStore from '@/stores/useSecurityStore'

export default function ManagerSupportChat() {
  const { isAdminMode } = useSecurityStore()
  if (!isAdminMode) return <Navigate to="/app" />

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-purple-800 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-purple-600" /> Chat de Suporte ao Cliente
        </h2>
        <p className="text-muted-foreground">
          Fale diretamente com clientes via Web ou WhatsApp integrado.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <Card className="lg:col-span-2 flex flex-col overflow-hidden border-slate-200 shadow-sm">
          <div className="flex border-b border-slate-100">
            <div className="w-1/3 border-r border-slate-100 bg-slate-50/50 overflow-y-auto">
              <div className="p-3 border-b border-slate-200 bg-white">
                <Input placeholder="Buscar cliente..." className="h-8 text-sm" />
              </div>
              <div className="p-3 bg-purple-50 border-l-2 border-purple-600 cursor-pointer">
                <p className="font-semibold text-sm text-slate-800">Acme Corp</p>
                <p className="text-xs text-slate-500 truncate">Dúvida sobre mensalidade</p>
              </div>
              <div className="p-3 hover:bg-slate-100 cursor-pointer">
                <p className="font-semibold text-sm text-slate-800">Global Tech</p>
                <p className="text-xs text-slate-500 truncate">Como gerar relatório?</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col bg-white">
              <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800">Acme Corp</h3>
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Online no App
                  </p>
                </div>
              </div>
              <div className="flex-1 p-4 bg-slate-50/30 overflow-y-auto">
                <div className="bg-emerald-50 text-emerald-800 text-xs text-center py-1 rounded mb-4 border border-emerald-100">
                  Chamado iniciado às 14:00
                </div>
              </div>
              <div className="p-3 border-t bg-white flex gap-2">
                <Input placeholder="Digite sua resposta..." className="flex-1" />
                <Button className="bg-purple-600 hover:bg-purple-700">Enviar</Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5 text-slate-500" /> Integrações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border rounded-lg bg-green-50 border-green-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <Phone className="w-8 h-8 text-green-500 opacity-20" />
              </div>
              <h4 className="font-semibold text-green-800 mb-1">WhatsApp Business API</h4>
              <p className="text-xs text-green-700 mb-4">
                Receba as mensagens de suporte do WhatsApp diretamente nesta tela.
              </p>
              <Button
                variant="outline"
                className="w-full bg-white border-green-300 text-green-700 hover:bg-green-100 hover:text-green-800"
              >
                Configurar Webhook
              </Button>
            </div>
            <div className="p-4 border rounded-lg bg-slate-50">
              <h4 className="font-semibold text-slate-700 mb-1">Email Ticketing</h4>
              <p className="text-xs text-slate-500 mb-4">
                Emails enviados para suporte@nexuserp.com abrem chats automaticamente.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Ativo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
