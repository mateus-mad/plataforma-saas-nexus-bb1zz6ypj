import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ShieldCheck, ArrowRight, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import useSecurityStore from '@/stores/useSecurityStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function LockScreen() {
  const [password, setPassword] = useState('')
  const [isRecovering, setIsRecovering] = useState(false)
  const [recoverSecret, setRecoverSecret] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const { unlock, recover, loginAsManager } = useSecurityStore()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await unlock(password)
    if (!success) {
      toast({
        title: 'Senha Incorreta',
        description: 'A senha mestre informada não é válida.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Cofre Desbloqueado',
        description: 'Chave de decriptação carregada em memória.',
      })
    }
  }

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await recover(recoverSecret.trim(), newPassword)
    if (success) {
      toast({
        title: 'Acesso Recuperado',
        description: 'Sua senha mestre foi redefinida com sucesso.',
      })
      setIsRecovering(false)
    } else {
      toast({
        title: 'Falha na Recuperação',
        description: 'A Seed Phrase ou Emergency Key é inválida.',
        variant: 'destructive',
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) setRecoverSecret(ev.target.result.toString())
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 mb-4 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Cofre Bloqueado</h1>
          <p className="text-slate-400 text-sm text-center">
            Seus dados estão protegidos com criptografia Zero-Knowledge. Insira sua Senha Mestre
            para descriptografar localmente.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Senha Mestre</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white h-12"
              placeholder="••••••••••••"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Button type="submit" className="w-full h-12 text-base font-medium">
              Desbloquear Cofre <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                loginAsManager()
                navigate('/app/manager')
              }}
              className="w-full h-12 text-base font-medium border-purple-900/50 bg-purple-950/20 text-purple-400 hover:bg-purple-900/40 hover:text-purple-300 hover:border-purple-800 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 mr-2" /> Entrar como SaaS Manager
            </Button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRecovering(true)}
              className="text-sm text-primary/80 hover:text-primary transition-colors"
            >
              Esqueceu sua senha? Recuperar acesso
            </button>
          </div>
        </form>
      </div>

      <Dialog open={isRecovering} onOpenChange={setIsRecovering}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Recuperação de Acesso
            </DialogTitle>
            <DialogDescription>
              Utilize sua Seed Phrase de 12 palavras ou o arquivo Emergency Key para redefinir sua
              senha.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="seed" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="seed">Seed Phrase</TabsTrigger>
              <TabsTrigger value="key">Emergency Key</TabsTrigger>
            </TabsList>

            <form onSubmit={handleRecover} className="mt-6 space-y-4">
              <TabsContent value="seed" className="space-y-4">
                <div className="space-y-2">
                  <Label>12 Palavras (Seed Phrase)</Label>
                  <Input
                    placeholder="Ex: alpha bravo charlie..."
                    value={recoverSecret}
                    onChange={(e) => setRecoverSecret(e.target.value)}
                    required
                  />
                </div>
              </TabsContent>
              <TabsContent value="key" className="space-y-4">
                <div className="space-y-2">
                  <Label>Arquivo .key</Label>
                  <Input
                    type="file"
                    accept=".key,.txt"
                    onChange={handleFileUpload}
                    className="cursor-pointer file:text-primary file:bg-primary/10 file:border-0 file:rounded file:px-2 file:py-1 file:mr-2"
                  />
                </div>
              </TabsContent>

              <div className="space-y-2 pt-2">
                <Label>Nova Senha Mestre</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nova senha segura"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsRecovering(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Restaurar e Redefinir</Button>
              </div>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
