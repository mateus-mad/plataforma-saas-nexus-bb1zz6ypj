import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Plus,
  Upload,
  Trash2,
  Download,
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  PenTool,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

export default function SupplierContractsTab({ data, updateData }: any) {
  const [isDragging, setIsDragging] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const contratos = data?.contratos?.lista || []
  const { toast } = useToast()

  const complianceValid = data.dados?.complianceStatus === 'valid'

  const addFile = (file: File, nameAlias?: string) => {
    updateData('contratos', 'lista', [
      ...contratos,
      {
        id: Date.now(),
        nome: nameAlias || file.name,
        data: new Date().toLocaleDateString('pt-BR'),
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        status: 'Anexado',
      },
    ])
    toast({
      title: 'Documento Salvo',
      description: 'O arquivo foi sincronizado com a base de dados.',
    })
  }

  const rem = (id: number) =>
    updateData(
      'contratos',
      'lista',
      contratos.filter((c: any) => c.id !== id),
    )

  const handleSendSignature = (id: number) => {
    const updated = contratos.map((c: any) =>
      c.id === id ? { ...c, signatureStatus: 'Enviado para Assinatura' } : c,
    )
    updateData('contratos', 'lista', updated)
    toast({
      title: 'Assinatura Digital Iniciada',
      description: 'O documento foi encaminhado via API de assinatura digital.',
    })
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.[0]) addFile(e.dataTransfer.files[0])
  }

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      addFile(e.target.files[0])
      setModalOpen(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
            <FileCheck className="w-5 h-5 text-blue-600" /> Contratos & Assinaturas Digitais
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Gerencie contratos, aditivos e envie minutas para assinatura digital automatizada.
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto shadow-sm px-6 h-10 font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Documento
        </Button>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer relative overflow-hidden group ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.01] shadow-inner'
            : 'border-slate-300 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-400'
        }`}
      >
        <div
          className={`w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform ${isDragging ? 'ring-4 ring-blue-100' : ''}`}
        >
          <Upload
            className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`}
          />
        </div>
        <h4 className="font-bold text-slate-700 text-lg mb-1">
          Arraste e solte o contrato em PDF aqui
        </h4>
        <p className="text-sm text-slate-500 font-medium">
          Ou clique em qualquer lugar para selecionar os arquivos (Max 20MB). Salva automaticamente
          na nuvem.
        </p>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => {
            if (e.target.files?.[0]) addFile(e.target.files[0])
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {contratos.map((c: any) => (
          <div
            key={c.id}
            className="flex flex-col p-4 sm:p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-rose-500" />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <p className="font-bold text-slate-800 truncate" title={c.nome}>
                  {c.nome}
                </p>
                <p className="text-xs text-slate-500 font-medium truncate mt-1">
                  {c.data} • {c.size || '0.0 MB'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full justify-between mt-auto pt-3 border-t border-slate-100">
              {c.signatureStatus ? (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 shadow-none hover:bg-blue-100 px-2 py-1">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Status: {c.signatureStatus}
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendSignature(c.id)}
                  disabled={!complianceValid}
                  title={
                    !complianceValid
                      ? 'Valide o Compliance na aba Identificação primeiro'
                      : 'Iniciar Fluxo de Assinatura'
                  }
                  className="h-8 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                >
                  <PenTool className="w-3 h-3 mr-1.5" /> Assinatura Digital
                </Button>
              )}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => rem(c.id)}
                  className="h-8 w-8 text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {contratos.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium text-sm">
              Nenhum documento anexado. Utilize o upload acima.
            </p>
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[450px] border-none shadow-2xl rounded-xl">
          <DialogHeader className="bg-slate-50 -mx-6 -mt-6 p-6 border-b border-slate-100 rounded-t-xl">
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" /> Adicionar Documento
            </DialogTitle>
            <DialogDescription className="mt-1">
              Faça o upload do documento assinado ou crie um link para assinatura digital.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="font-semibold">Nome / Apelido do Documento</Label>
              <Input placeholder="Ex: Contrato Fornecimento 2026.pdf" className="h-11 shadow-sm" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Arquivo (PDF ou DOCX)</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleManualUpload}
                className="h-11 cursor-pointer file:cursor-pointer shadow-sm"
              />
            </div>

            <div className="relative flex items-center py-4">
              <span className="flex-grow border-t border-slate-200"></span>
              <span className="mx-4 text-xs text-slate-400 font-bold uppercase tracking-wider">
                Automação de Minutas
              </span>
              <span className="flex-grow border-t border-slate-200"></span>
            </div>

            <Button
              variant="outline"
              className="w-full text-blue-700 border-blue-200 bg-blue-50/50 hover:bg-blue-100 h-11 font-semibold"
              disabled
            >
              <ShieldCheck className="w-4 h-4 mr-2" /> Gerar via Módulo de Documentos (Em Breve)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
