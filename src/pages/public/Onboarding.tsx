import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
  Building,
  UploadCloud,
  CheckCircle,
  ShieldAlert,
  ScanLine,
  Loader2,
  FileText,
  X,
  KeyRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import pb from '@/lib/pocketbase/client'
import { processDocumentOCR } from '@/services/ocr'

export default function Onboarding() {
  const { token } = useParams()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [tokenStatus, setTokenStatus] = useState<'valid' | 'expired'>('valid')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [files, setFiles] = useState<File[]>([])

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    nomeMae: '',
    nomePai: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    expiryDate: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await pb.send(`/backend/v1/onboarding/${token}`, { method: 'GET' })
        setFormData((prev) => ({
          ...prev,
          nome: res.name || '',
          email: res.email || '',
          telefone: res.phone || '',
          cpf: res.document_number || '',
        }))
        setTokenStatus('valid')
      } catch (err) {
        setTokenStatus('expired')
      } finally {
        setIsLoading(false)
      }
    }
    if (token) checkToken()
  }, [token])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])

      const firstImage = selectedFiles.find(
        (f) => f.type.startsWith('image/') || f.type.includes('pdf'),
      )
      if (firstImage) {
        setIsProcessingOCR(true)
        toast({
          title: 'Lendo Documento',
          description: 'Extraindo dados automaticamente via IA...',
        })

        try {
          const res = await processDocumentOCR(firstImage, 'RG')

          setFormData((prev) => ({
            ...prev,
            nome: prev.nome || res.name || '',
            cpf: prev.cpf || res.document_number || '',
            dataNascimento: res.nascimento
              ? res.nascimento.includes('/')
                ? res.nascimento.split('/').reverse().join('-')
                : res.nascimento
              : prev.dataNascimento,
            nomeMae: res.mae || prev.nomeMae,
            nomePai: res.pai || prev.nomePai,
            cep: res.address?.cep || prev.cep,
            logradouro: res.address?.logradouro || prev.logradouro,
            numero: res.address?.numero || prev.numero,
            bairro: res.address?.bairro || prev.bairro,
            cidade: res.address?.cidade || prev.cidade,
            estado: res.address?.estado || prev.estado,
            expiryDate: res.expiryDate || prev.expiryDate,
          }))
          toast({
            title: 'Sucesso',
            description: 'Dados extraídos com sucesso. Verifique os campos.',
          })
        } catch (err) {
          toast({
            variant: 'destructive',
            title: 'Aviso',
            description:
              'Não foi possível extrair os dados automaticamente. Por favor, preencha manualmente.',
          })
        } finally {
          setIsProcessingOCR(false)
        }
      }
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome || !formData.cpf) {
      toast({
        variant: 'destructive',
        title: 'Dados Incompletos',
        description: 'Por favor, preencha todos os campos obrigatórios.',
      })
      return
    }

    if (formData.password && formData.password.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Senha muito curta',
        description: 'A senha deve ter no mínimo 8 caracteres.',
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Senhas não coincidem',
        description: 'As senhas informadas são diferentes.',
      })
      return
    }

    setIsSubmitting(true)
    toast({
      title: 'Enviando dados...',
      description: 'Processando as informações de forma segura.',
    })

    const payload = new FormData()
    const fullData = {
      pessoal: {
        name: formData.nome,
        mae: formData.nomeMae,
        pai: formData.nomePai,
        nascimento: formData.dataNascimento,
      },
      docs: { cpf: formData.cpf, rg: formData.rg },
      endereco: {
        cep: formData.cep,
        logradouro: formData.logradouro,
        numero: formData.numero,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
      },
      contato: { email: formData.email, telPrinc: formData.telefone },
    }

    const sendData = {
      name: formData.nome,
      document_number: formData.cpf,
      email: formData.email,
      phone: formData.telefone,
      birth_date: formData.dataNascimento ? formData.dataNascimento + ' 12:00:00.000Z' : undefined,
      expiry_date: formData.expiryDate || undefined,
      data: fullData,
      password: formData.password || undefined,
    }

    payload.append('data', JSON.stringify(sendData))

    files.forEach((f) => {
      payload.append('files', f)
    })

    try {
      await pb.send(`/backend/v1/onboarding/${token}`, {
        method: 'POST',
        body: payload,
      })
      setIsSubmitted(true)
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro de Envio',
        description: 'Ocorreu um erro ao salvar os dados. Tente novamente.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

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
                Seu cadastro foi realizado com sucesso. A senha que você criou já pode ser usada
                para acessar o aplicativo.
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-center shadow-sm">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-xl">
          <Building className="w-6 h-6" /> Portal do Colaborador
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-blue-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">Bem-vindo(a) à Equipe!</h1>
            <p className="text-blue-100 text-sm max-w-xl mx-auto">
              Para acessar o aplicativo e registrar seu ponto, preencha os dados abaixo com atenção
              e crie sua senha de acesso.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            <div className="bg-blue-50/50 border border-blue-200 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-blue-50 transition-colors relative overflow-hidden group">
              <ScanLine className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="font-semibold text-slate-800 mb-1">
                Envie seus Documentos (RG, CNH, Comprovantes)
              </h4>
              <p className="text-xs text-slate-500 mb-4 max-w-md">
                Faça o upload de seus documentos. Nossa IA preencherá automaticamente os campos
                abaixo para você!
              </p>
              <Input
                type="file"
                multiple
                className="hidden"
                id="auto-upload"
                onChange={handleFileUpload}
                accept="image/*,.pdf"
                disabled={isProcessingOCR}
              />
              <Button
                type="button"
                asChild
                variant="outline"
                className={cn(
                  'bg-white cursor-pointer hover:bg-slate-50 shadow-sm transition-all',
                  isProcessingOCR && 'pointer-events-none opacity-50',
                )}
              >
                <label htmlFor="auto-upload">
                  {isProcessingOCR ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analisando Documento...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4 mr-2 text-blue-600" /> Selecionar Documentos
                    </>
                  )}
                </label>
              </Button>

              {files.length > 0 && (
                <div className="mt-4 w-full text-left space-y-2 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                  <h5 className="text-xs font-bold text-slate-700">
                    Arquivos Anexados ({files.length})
                  </h5>
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-2 rounded"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(idx)}
                        className="h-6 w-6 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
                1. Acesso ao Aplicativo
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4 flex items-start gap-3">
                <KeyRound className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <div className="text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">Crie sua senha de acesso</p>
                  <p>
                    O seu login no aplicativo será o seu <strong>CPF</strong> (somente números).
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>
                    Senha <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Confirme a Senha <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Repita a senha"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
                2. Dados Pessoais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label>
                    Nome Completo <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    required
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
                    required
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>RG</Label>
                  <Input
                    value={formData.rg}
                    onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                    placeholder="Número do RG"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
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
                <div className="space-y-2 md:col-span-2">
                  <Label>E-mail (Opcional)</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="exemplo@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
                3. Endereço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2 md:col-span-1">
                  <Label>CEP</Label>
                  <Input
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    placeholder="00000-000"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Logradouro</Label>
                  <Input
                    value={formData.logradouro}
                    onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                    placeholder="Rua, Avenida, etc."
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label>Número</Label>
                  <Input
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    placeholder="Nº"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Bairro</Label>
                  <Input
                    value={formData.bairro}
                    onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label>Cidade</Label>
                  <Input
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label>Estado</Label>
                  <Input
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    placeholder="UF"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-12"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando...
                  </>
                ) : (
                  'Concluir Cadastro'
                )}
              </Button>
            </div>
          </form>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          Seus dados são transmitidos de forma criptografada e utilizados exclusivamente para fins
          profissionais e de cadastro.
        </p>
      </main>
    </div>
  )
}
