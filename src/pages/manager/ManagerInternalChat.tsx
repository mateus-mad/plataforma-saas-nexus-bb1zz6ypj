import { Navigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Hash, Send } from 'lucide-react'
import useSecurityStore from '@/stores/useSecurityStore'

export default function ManagerInternalChat() {
  const { isAdminMode } = useSecurityStore()
  if (!isAdminMode) return <Navigate to="/app" />

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-purple-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-600" /> Chat Interno
        </h2>
        <p className="text-muted-foreground">
          Comunicação em tempo real para equipe de Dev e Suporte.
        </p>
      </div>

      <Card className="flex-1 flex overflow-hidden border-slate-200 shadow-sm">
        <div className="w-64 border-r border-slate-200 bg-slate-50 p-4 flex flex-col gap-2 hidden md:flex">
          <h3 className="font-semibold text-slate-700 mb-2 uppercase text-xs tracking-wider">
            Canais
          </h3>
          <button className="flex items-center gap-2 p-2 rounded-md bg-purple-100 text-purple-800 font-medium text-sm">
            <Hash className="w-4 h-4 opacity-70" /> geral
          </button>
          <button className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-200 text-slate-600 font-medium text-sm">
            <Hash className="w-4 h-4 opacity-70" /> dev-team
          </button>
          <button className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-200 text-slate-600 font-medium text-sm">
            <Hash className="w-4 h-4 opacity-70" /> level-2-suporte
          </button>
        </div>

        <div className="flex-1 flex flex-col bg-white">
          <div className="p-4 border-b border-slate-100 bg-white">
            <h3 className="font-bold flex items-center gap-2 text-slate-800">
              <Hash className="w-5 h-5 text-slate-400" /> geral
            </h3>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                JS
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">
                  João Suporte <span className="font-normal opacity-70 ml-2">10:42 AM</span>
                </p>
                <div className="bg-slate-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-800">
                  Alguém pode verificar o ticket T-101? Parece ser um problema de backend na emissão
                  de NF.
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                D1
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">
                  Dev 1 (Backend) <span className="font-normal opacity-70 ml-2">10:45 AM</span>
                </p>
                <div className="bg-purple-50 border border-purple-100 p-3 rounded-lg rounded-tl-none text-sm text-purple-900">
                  Estou olhando agora. Já identifiquei que a API da Sefaz retornou timeout, vou
                  tratar o erro no front.
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="relative flex items-center">
              <Input placeholder="Escreva uma mensagem no #geral..." className="pr-12" />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
