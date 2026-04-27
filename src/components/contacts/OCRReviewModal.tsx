import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, CheckCircle2, ScanFace, Image as ImageIcon, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function OCRReviewModal({ open, onOpenChange, ocrDraft, ocrFile, onConfirm }: any) {
  const [draft, setDraft] = useState(ocrDraft)
  const [imageUrl, setImageUrl] = useState('')
  const [activeField, setActiveField] = useState<string | null>(null)
  const [imgDimensions, setImgDimensions] = useState({ w: 1, h: 1 })
  const imgRef = useRef<HTMLImageElement>(null)

  const [isPdf, setIsPdf] = useState(false)

  useEffect(() => {
    setDraft(ocrDraft)
    if (ocrFile) {
      setIsPdf(ocrFile.type === 'application/pdf' || ocrFile.name.toLowerCase().endsWith('.pdf'))
      const url = URL.createObjectURL(ocrFile)
      setImageUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [ocrDraft, ocrFile])

  if (!draft) return null

  const handleChange = (field: string, value: string) => {
    setDraft((prev: any) => ({ ...prev, [field]: value }))
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    if (conf >= 70) return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-rose-600 bg-rose-50 border-rose-200'
  }

  const Field = ({ label, field, placeholder }: any) => {
    const conf = draft.field_confidences?.[field] ?? 100
    const isLowConf = conf < 80
    return (
      <div className="space-y-1.5">
        <Label className="flex items-center justify-between text-xs font-semibold text-slate-600">
          {label}
          {isLowConf && (
            <span className="text-[10px] flex items-center text-amber-600">
              <AlertTriangle className="w-3 h-3 mr-1" /> Revisar
            </span>
          )}
        </Label>
        <Input
          value={draft[field] || ''}
          onChange={(e) => handleChange(field, e.target.value)}
          onFocus={() => setActiveField(field)}
          onBlur={() => setActiveField(null)}
          placeholder={placeholder}
          className={cn(
            'h-9 shadow-sm transition-all',
            isLowConf && 'border-amber-400 focus-visible:ring-amber-400 bg-amber-50/30',
            activeField === field && 'ring-2 ring-blue-500 border-blue-500',
          )}
        />
      </div>
    )
  }

  const renderBoundingBox = () => {
    if (!activeField || !draft.field_coordinates?.[activeField] || !imgRef.current) return null
    const box = draft.field_coordinates[activeField]
    const { naturalWidth, naturalHeight } = imgRef.current
    if (!naturalWidth || !naturalHeight) return null

    const [x, y, w, h] = box
    const left = (x / naturalWidth) * 100
    const top = (y / naturalHeight) * 100
    const width = (w / naturalWidth) * 100
    const height = (h / naturalHeight) * 100

    return (
      <div
        className="absolute border-2 border-blue-500 bg-blue-500/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] transition-all duration-300 pointer-events-none z-10 rounded-sm"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: `${width}%`,
          height: `${height}%`,
        }}
      />
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 bg-slate-50 border-none shadow-2xl overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-6 bg-white border-b border-slate-200 shrink-0">
          <DialogTitle className="text-xl flex items-center gap-2 text-slate-800">
            <ScanFace className="w-6 h-6 text-blue-600" />
            Revisão de Extração Inteligente (OCR)
          </DialogTitle>
          <DialogDescription className="text-slate-500 mt-2">
            Compare os dados extraídos com a imagem do documento original. Edite os campos que
            apresentarem baixa confiança ou erros antes de confirmar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left Side: Image Viewer */}
          <div className="w-full lg:w-1/2 p-6 flex flex-col gap-4 border-r border-slate-200 bg-slate-100/50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" /> Documento Original
              </h3>
              <div
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-bold border',
                  getConfidenceColor(draft.confidence || 90),
                )}
              >
                Confiança Global: {draft.confidence || 90}%
              </div>
            </div>
            <div className="flex-1 bg-slate-200/50 rounded-xl overflow-hidden relative shadow-inner flex items-center justify-center p-2 group">
              {imageUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {isPdf ? (
                    <iframe
                      src={`${imageUrl}#toolbar=0&navpanes=0`}
                      className="w-full h-full rounded-lg z-0"
                      title="Documento PDF"
                    />
                  ) : (
                    <>
                      <img
                        ref={imgRef}
                        src={imageUrl}
                        alt="Document"
                        className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg z-0"
                        onLoad={(e) => {
                          const img = e.currentTarget
                          setImgDimensions({ w: img.naturalWidth, h: img.naturalHeight })
                        }}
                      />
                      <div
                        className="absolute inset-0 m-auto"
                        style={{
                          aspectRatio: `${imgDimensions.w} / ${imgDimensions.h}`,
                          maxWidth: '100%',
                          maxHeight: '100%',
                        }}
                      >
                        {renderBoundingBox()}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-slate-400 text-sm">Sem imagem disponível</div>
              )}
            </div>
            {draft.faceFile && (
              <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-200 shadow-sm shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
                  <img
                    src={URL.createObjectURL(draft.faceFile)}
                    alt="Face"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Foto de Perfil Detectada</p>
                  <p className="text-xs text-slate-500">
                    Rosto extraído automaticamente para o cadastro.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Form */}
          <div className="w-full lg:w-1/2 p-6 overflow-y-auto custom-scrollbar bg-white">
            <h3 className="font-semibold text-slate-800 mb-5">Dados Mapeados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Field label="Nome Completo" field="name" />
              </div>
              <Field label="CPF" field="cpf" placeholder="000.000.000-00" />
              <Field label="RG" field="rg" />
              <Field label="Data de Nascimento" field="nascimento" placeholder="DD/MM/AAAA" />
              <Field label="Data de Emissão (Doc)" field="docIssueDate" placeholder="DD/MM/AAAA" />
              <div className="sm:col-span-2">
                <Field label="Nome da Mãe" field="mae" />
              </div>
              <div className="sm:col-span-2">
                <Field label="Nome do Pai" field="pai" />
              </div>
              <Field label="Naturalidade (Cidade)" field="cidade_nasc" />
              <Field label="UF (Estado)" field="uf_nasc" placeholder="Ex: SP" />
              <Field label="Nacionalidade" field="nacionalidade" />
              <Field label="Gênero" field="genero" />
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 bg-white border-t border-slate-200 shrink-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="font-medium">
            Cancelar
          </Button>
          <Button
            onClick={() => onConfirm(draft)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> Confirmar e Aplicar Dados
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
