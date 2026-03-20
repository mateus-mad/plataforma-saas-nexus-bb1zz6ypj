import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useState, useRef } from 'react'
import { UploadCloud, FileText, CheckCircle2, Loader2, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { processDocumentOCR } from '@/services/ocr'
import { createEntity, updateEntity } from '@/services/entities'
import { createAttachment } from '@/services/attachments'
import { useToast } from '@/hooks/use-toast'

export default function BatchOCRModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { toast } = useToast()
  const [files, setFiles] = useState<
    { id: string; file: File; status: 'pending' | 'processing' | 'done' | 'error' }[]
  >([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length && !isProcessing) {
      addFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length && !isProcessing) {
      addFiles(Array.from(e.target.files))
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const addFiles = (newFiles: File[]) => {
    const valid = newFiles.filter((f) => f.type.includes('image') || f.type.includes('pdf'))
    setFiles((prev) => [
      ...prev,
      ...valid.map((f) => ({ id: Math.random().toString(), file: f, status: 'pending' as const })),
    ])
  }

  const updateFileStatus = (id: string, status: 'processing' | 'done' | 'error') => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)))
  }

  const removeFile = (id: string) => {
    if (isProcessing) return
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const processBatch = async () => {
    setIsProcessing(true)
    let count = 0
    const totalPending = files.filter((f) => f.status === 'pending' || f.status === 'error').length

    if (totalPending === 0) {
      setIsProcessing(false)
      return
    }

    for (const fileObj of files) {
      if (fileObj.status === 'done') continue

      updateFileStatus(fileObj.id, 'processing')
      try {
        let ocrResult: any = null
        try {
          ocrResult = await processDocumentOCR(fileObj.file, 'RG')
        } catch (e) {
          console.warn('OCR Failure on batch', e)
        }

        const fd = new FormData()
        fd.append('type', 'colaborador')
        fd.append('status', 'Rascunho')
        fd.append('name', ocrResult?.name || fileObj.file.name.replace(/\.[^/.]+$/, ''))

        if (ocrResult?.document_number) fd.append('document_number', ocrResult.document_number)

        const data = {
          docs: { docType: 'RG', cpf: ocrResult?.document_number || '' },
          pessoal: { name: ocrResult?.name || '' },
        }
        fd.append('data', JSON.stringify(data))

        const created = await createEntity(fd)

        const attFd = new FormData()
        attFd.append('file', fileObj.file)
        attFd.append('relacionamento_id', created.id)
        attFd.append('category', 'Documento de Identificação')
        await createAttachment(attFd)

        updateFileStatus(fileObj.id, 'done')
      } catch (e) {
        updateFileStatus(fileObj.id, 'error')
      }
      count++
      setProgress(Math.round((count / totalPending) * 100))
    }

    setIsProcessing(false)
    toast({
      title: 'Processamento Concluído',
      description: 'Os rascunhos de colaboradores foram gerados.',
    })
  }

  const pendingCount = files.filter((f) => f.status === 'pending').length

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!isProcessing) onOpenChange(o)
      }}
    >
      <DialogContent className="sm:max-w-[600px] border-none shadow-2xl p-0 overflow-hidden bg-slate-50 rounded-2xl">
        <div className="bg-white p-6 border-b border-slate-200 relative z-10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-600" />
              OCR em Lote (Rascunhos)
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Arraste múltiplos documentos (RG, CNH, CPF). O sistema irá processá-los e criar
              cadastros com status <b>Rascunho</b> para sua revisão.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:bg-slate-50'}`}
          >
            <UploadCloud
              className={`w-10 h-10 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`}
            />
            <p className="text-sm text-slate-600 font-medium mb-1">
              Arraste e solte seus arquivos aqui
            </p>
            <p className="text-xs text-slate-400 mb-4">PNG, JPG ou PDF (Máx 5MB por arquivo)</p>
            <Button
              variant="outline"
              onClick={() => fileRef.current?.click()}
              disabled={isProcessing}
            >
              Procurar Arquivos
            </Button>
            <input
              type="file"
              multiple
              ref={fileRef}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleSelect}
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-slate-700">
                  Fila de Processamento ({files.length})
                </h4>
                {isProcessing && (
                  <span className="text-xs font-bold text-blue-600">{progress}%</span>
                )}
              </div>

              {isProcessing && <Progress value={progress} className="h-2" />}

              <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm font-medium text-slate-700 truncate">
                        {f.file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {f.status === 'pending' && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Pendente
                        </span>
                      )}
                      {f.status === 'processing' && (
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                      )}
                      {f.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {f.status === 'error' && (
                        <AlertTriangle
                          className="w-4 h-4 text-rose-500"
                          title="Falha ao extrair dados"
                        />
                      )}

                      {!isProcessing && (
                        <button
                          onClick={() => removeFile(f.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button
              onClick={processBatch}
              disabled={isProcessing || pendingCount === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isProcessing ? 'Processando...' : `Iniciar OCR (${pendingCount})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
