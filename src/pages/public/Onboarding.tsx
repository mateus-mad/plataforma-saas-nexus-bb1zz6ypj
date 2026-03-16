import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Building, UploadCloud, CheckCircle, ShieldAlert } from 'lucide-react'

export default function Onboarding() {
  const { token } = useParams()
  const { toast } = useToast()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
  })

  // Simulates a checking process to see if the token has already been used
  const [tokenStatus, setTokenStatus] = useState<'valid' | 'expired'>('valid')

  if (tokenStatus === 'expired' || isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-4 animate-in zoom-in-95 duration-500">
          {isSubmitted ? (
            <>
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Tudo Certo!</h1>
              <p className="text-slate-500">
                Seus dados foram enviados com sucesso para o departamento de Recursos Humanos. Este
                link foi expirado por questões de segurança.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Link Expirado ou Inválido</h1>
              <p className="text-slate-500">
                Este link de admissão já foi utilizado ou não é mais válido. Entre em contato com a
                empresa para solicitar um novo acesso.
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome || !formData.cpf) {
      toast({
        variant: 'destructive',
        title: 'Dados Incompletos',
        description: 'Por favor, preencha todos os campos obrigatórios.',
      })
      return
    }

    // Simulate submission
    toast({
      title: 'Enviando dados...',
      description: 'Processando as informações de forma segura.',
    })

    setTimeout(() => {
      setIsSubmitted(true)
    }, 1500)
  }

  const handleOcrSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      toast({ title: 'Lendo Documento', description: 'Extraindo dados via IA...' })
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          nome: 'João Silva Oliveira',
          cpf: '123.456.789-00',
        }))
        toast({ title: 'Sucesso', description: 'Nome e CPF extraídos do documento.' })
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-center shadow-sm">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-xl">
          <Building className="w-6 h-6" /> Portal de Admissão - Nexus
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-blue-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">Bem-vindo(a) à Equipe!</h1>
            <p className="text-blue-100 text-sm max-w-xl mx-auto">
              Para prosseguir com sua contratação, por favor, preencha os dados abaixo com atenção e
              anexe os documentos necessários.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            <div className="bg-blue-50/50 border border-blue-200 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-blue-50 transition-colors">
              <UploadCloud className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="font-semibold text-slate-800 mb-1">Dica: Preenchimento Automático</h4>
              <p className="text-xs text-slate-500 mb-4 max-w-md">
                Faça o upload do seu RG ou CNH (frente e verso) para preencher os dados
                automaticamente usando inteligência artificial.
              </p>
              <Input
                type="file"
                className="hidden"
                id="auto-upload"
                onChange={handleOcrSimulate}
                accept="image/*,.pdf"
              />
              <Button asChild variant="outline" className="bg-white cursor-pointer">
                <label htmlFor="auto-upload">Selecionar Documento</label>
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
                1. Dados Pessoais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>
                    Nome Completo <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    CPF <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="exemplo@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone / WhatsApp</Label>
                  <Input
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-12"
              >
                Enviar Informações
              </Button>
            </div>
          </form>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          Seus dados são transmitidos de forma criptografada e utilizados exclusivamente para fins
          de registro profissional, conforme a LGPD.
        </p>
      </main>
    </div>
  )
}
