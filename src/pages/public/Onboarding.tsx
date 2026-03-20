import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { createEntity } from '@/services/entities'
import { createAttachment } from '@/services/attachments'
import {
  Building,
  UploadCloud,
  CheckCircle,
  ShieldAlert,
  ScanLine,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Onboarding() {
  const { token } = useParams()
  const { toast } = useToast()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)

  const [ocrFile, setOcrFile] = useState<File | null>(null)
  const [extractedPhoto, setExtractedPhoto] = useState<string | null>(null)
  const [extractedPhotoBlob, setExtractedPhotoBlob] = useState<Blob | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  })

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
                Seus dados foram enviados com sucesso para o departamento de Recursos Humanos. O
                setor fará a validação em breve.
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

  const handleOcrSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0]
      setOcrFile(file)
      setIsProcessingOCR(true)
      toast({ title: 'Lendo Documento', description: 'Extraindo dados e foto via IA...' })

      setTimeout(async () => {
        setFormData((prev) => ({
          ...prev,
          nome: 'João Silva Oliveira',
          cpf: '123.456.789-00',
          rg: '12.345.678-9',
          dataNascimento: '1990-05-15',
          nomeMae: 'Maria Silva Oliveira',
          nomePai: 'Carlos Oliveira',
          cep: '01001-000',
          logradouro: 'Praça da Sé',
          numero: '123',
          bairro: 'Sé',
          cidade: 'São Paulo',
          estado: 'SP',
        }))

        try {
          const res = await fetch('https://img.usecurling.com/ppl/medium?gender=male&seed=15')
          const blob = await res.blob()
          setExtractedPhoto(URL.createObjectURL(blob))
          setExtractedPhotoBlob(blob)
        } catch (err) {
          console.error('Falha ao extrair imagem mockada', err)
        }

        setIsProcessingOCR(false)
        toast({ title: 'Sucesso', description: 'Dados e foto extraídos com sucesso.' })
      }, 2500)
    }
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

    setIsSubmitting(true)
    toast({
      title: 'Enviando dados...',
      description: 'Processando as informações de forma segura.',
    })

    const fd = new FormData()
    fd.append('name', formData.nome)
    fd.append('type', 'collaborator')
    fd.append('document_number', formData.cpf)

    if (formData.dataNascimento) {
      fd.append('birth_date', formData.dataNascimento + ' 12:00:00.000Z')
    }

    fd.append(
      'address',
      `${formData.logradouro}, ${formData.numero} - ${formData.cidade}/${formData.estado}`,
    )
    fd.append('status', 'Pending Validation')

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
    fd.append('data', JSON.stringify(fullData))

    if (extractedPhotoBlob) {
      fd.append('profile_image', extractedPhotoBlob, 'profile.jpg')
    }

    try {
      const entity = await createEntity(fd)
      if (ocrFile) {
        const attFd = new FormData()
        attFd.append('entity_id', entity.id)
        attFd.append('file', ocrFile)
        attFd.append('file_type', 'rg')
        await createAttachment(attFd)
      }
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
            <div className="bg-blue-50/50 border border-blue-200 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-blue-50 transition-colors relative overflow-hidden group">
              <ScanLine className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="font-semibold text-slate-800 mb-1">
                Acelere com Envio Inteligente (OCR)
              </h4>
              <p className="text-xs text-slate-500 mb-4 max-w-md">
                Faça o upload de uma foto do seu RG ou CNH para extrairmos sua foto e dados
                automaticamente, facilitando o preenchimento.
              </p>
              <Input
                type="file"
                className="hidden"
                id="auto-upload"
                onChange={handleOcrSimulate}
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
                      <UploadCloud className="w-4 h-4 mr-2 text-blue-600" /> Selecionar Documento
                    </>
                  )}
                </label>
              </Button>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
                1. Dados Pessoais
              </h3>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="shrink-0 flex flex-col items-center gap-3">
                  <div className="w-32 h-32 rounded-full border-4 border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm">
                    {extractedPhoto ? (
                      <img
                        src={extractedPhoto}
                        alt="Perfil Extraído"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  {extractedPhoto && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                      Foto Extraída
                    </span>
                  )}
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
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
                    <Label>Nome da Mãe</Label>
                    <Input
                      value={formData.nomeMae}
                      onChange={(e) => setFormData({ ...formData, nomeMae: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Nome do Pai</Label>
                    <Input
                      value={formData.nomePai}
                      onChange={(e) => setFormData({ ...formData, nomePai: e.target.value })}
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
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
                2. Endereço
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
                  'Enviar Informações'
                )}
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
