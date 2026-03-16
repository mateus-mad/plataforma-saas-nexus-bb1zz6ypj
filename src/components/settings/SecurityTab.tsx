import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Download, AlertTriangle, ShieldAlert } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import useSecurityStore from '@/stores/useSecurityStore'

export default function SecurityTab() {
  const { isSetup, setupSecurity } = useSecurityStore()
  const { toast } = useToast()

  const [step, setStep] = useState(0)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [generatedSeed, setGeneratedSeed] = useState('')
  const [generatedKey, setGeneratedKey] = useState('')
  const [verifyWord, setVerifyWord] = useState('')

  const handleStartSetup = () => setStep(1)

  const handleGenerate = async () => {
    if (password !== confirmPassword || password.length < 6) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem ou são curtas demais.',
        variant: 'destructive',
      })
      return
    }
    const { seedPhrase, emergencyKey } = await setupSecurity(password)
    setGeneratedSeed(seedPhrase)
    setGeneratedKey(emergencyKey)
    setStep(2)
  }

  const handleDownloadKey = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedKey], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'nexus_emergency_key.key'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleVerify = () => {
    const words = generatedSeed.split(' ')
    if (verifyWord.trim().toLowerCase() === words[3].toLowerCase()) {
      setStep(3)
      toast({ title: 'Sucesso', description: 'Criptografia Zero-Knowledge ativada!' })
    } else {
      toast({
        title: 'Incorreto',
        description: 'A palavra informada não corresponde.',
        variant: 'destructive',
      })
    }
  }

  if (isSetup && step === 0) {
    return (
      <div className="space-y-6 mt-6 animate-fade-in">
        <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm">
          <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-emerald-800">Zero-Knowledge Ativo</h3>
              <p className="text-emerald-600 mt-1">
                Sua conta está protegida. Todos os dados sensíveis são criptografados localmente no
                seu dispositivo. Apenas você possui as chaves de acesso.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">Segurança Avançada</h3>
          <p className="text-sm text-slate-500">
            Ative a criptografia Zero-Knowledge para proteção máxima.
          </p>
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            Criptografia de Ponta-a-Ponta
          </CardTitle>
          <CardDescription>
            Ao ativar o Zero-Knowledge, seus dados financeiros e de contatos serão criptografados no
            navegador antes de irem para o servidor. Nem mesmo os administradores da plataforma
            poderão lê-los.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleStartSetup}>Ativar Proteção Zero-Knowledge</Button>
        </CardContent>
      </Card>

      <Dialog open={step > 0 && step < 3} onOpenChange={(open) => !open && setStep(0)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Assistente de Segurança</DialogTitle>
            <DialogDescription>Siga os passos para blindar seu ambiente.</DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-4 py-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>
                  A senha mestre não pode ser recuperada por nós. Se você a perder, usará os métodos
                  de backup do próximo passo.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label>Crie uma Senha Mestre</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Confirme a Senha</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleGenerate}>Próximo Passo</Button>
              </DialogFooter>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 py-4">
              <div>
                <Label className="text-destructive font-bold flex items-center gap-1 mb-2">
                  <AlertTriangle className="w-4 h-4" /> Copie sua Seed Phrase
                </Label>
                <div className="bg-slate-100 p-4 rounded-md font-mono text-sm grid grid-cols-3 gap-2 border border-slate-200">
                  {generatedSeed.split(' ').map((word, i) => (
                    <div key={i}>
                      <span className="text-slate-400 select-none">{i + 1}.</span> {word}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-blue-100 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Emergency Key:</strong> Arquivo de recuperação alternativo.
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100"
                  onClick={handleDownloadKey}
                >
                  <Download className="w-4 h-4 mr-2" /> Baixar .key
                </Button>
              </div>

              <div className="border-t pt-4 space-y-2">
                <Label>Validação: Digite a 4ª palavra da sua Seed Phrase</Label>
                <Input
                  value={verifyWord}
                  onChange={(e) => setVerifyWord(e.target.value)}
                  placeholder="Palavra 4"
                />
              </div>
              <DialogFooter>
                <Button onClick={handleVerify}>Validar e Concluir</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
