import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Info, Camera, AlertTriangle, CheckCircle2, Wand2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ScanText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { ExtractionLogDialog } from '../ExtractionLogDialog'

export function FieldInput({
  isExtracting,
  isMissing,
  isAutoFilled,
  isManuallyVerified,
  onClearMissing,
  value,
  onChange,
  disabled,
  type = 'text',
  className,
  placeholder,
  validationError,
}: any) {
  if (isExtracting) return <Skeleton className="h-10 w-full rounded-md" />
  return (
    <div className="relative group">
      <Input
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e)
          if (isMissing) onClearMissing()
        }}
        onFocus={() => {
          if (isMissing) onClearMissing()
        }}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          className,
          isMissing &&
            'border-yellow-400 bg-yellow-50/50 focus-visible:ring-yellow-400 transition-colors',
          validationError &&
            'border-rose-500 bg-rose-50/50 focus-visible:ring-rose-500 text-rose-900 transition-colors',
          isAutoFilled && 'border-blue-300 bg-blue-50/30 pr-10',
          isManuallyVerified && 'border-emerald-300 bg-emerald-50/30 pr-10',
        )}
      />
      {isAutoFilled && !isManuallyVerified && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute right-3 top-2.5 text-blue-500">
                <Wand2 className="w-4 h-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>Preenchido automaticamente via OCR</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {isManuallyVerified && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute right-3 top-2.5 text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>Verificado manualmente</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {isMissing && !validationError && (
        <p className="text-[11px] leading-tight text-yellow-600 mt-1.5 font-medium animate-in fade-in">
          Verifique manualmente: Dado não encontrado.
        </p>
      )}
      {validationError && (
        <p className="text-[11px] leading-tight text-rose-600 mt-1.5 font-bold animate-in fade-in flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> {validationError}
        </p>
      )}
    </div>
  )
}

type Props = {
  data: any
  onChange: (f: string, v: string, file?: File) => void
  errors?: Record<string, string>
  readOnly?: boolean
  globalData?: any
}

const LabelT = ({ l, t, req }: { l: string; t?: string; req?: boolean }) => (
  <Label className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1.5 text-sm">
    {l} {req && <span className="text-rose-500">*</span>}
    {t && (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger type="button" tabIndex={-1}>
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 transition-colors" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[250px] text-xs font-normal">
            {t}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </Label>
)

const cropFaceFromImage = async (file: File): Promise<File | null> => {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = async () => {
      try {
        let rect = {
          x: img.width * 0.1,
          y: img.height * 0.2,
          w: img.width * 0.3,
          h: img.height * 0.5,
        }
        if ('FaceDetector' in window) {
          const detector = new (window as any).FaceDetector()
          const faces = await detector.detect(img)
          if (faces && faces.length > 0) {
            const box = faces[0].boundingBox
            rect = {
              x: Math.max(0, box.x - box.width * 0.2),
              y: Math.max(0, box.y - box.height * 0.2),
              w: Math.min(img.width - box.x, box.width * 1.4),
              h: Math.min(img.height - box.y, box.height * 1.4),
            }
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = rect.w
        canvas.height = rect.h
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve(null)
        ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h)
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(new File([blob], 'extracted_face.jpg', { type: 'image/jpeg' }))
            else resolve(null)
          },
          'image/jpeg',
          0.9,
        )
      } catch (e) {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

type ExtendedProps = Props & {
  onProcessOCR?: (file: File) => Promise<void>
  isProcessingOCR?: boolean
}

export default function PersonalInfoTab({
  data,
  onChange,
  errors,
  readOnly,
  globalData,
  onProcessOCR,
  isProcessingOCR,
}: ExtendedProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(data.foto || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPhotoPreview(data.foto || null)
  }, [data.foto])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotoPreview(url)
      onChange('foto', url, file)
    }
  }

  const { toast } = useToast()
  const [isExtractingLocal, setIsExtracting] = useState(false)
  const [missingFields, setMissingFields] = useState<Record<string, boolean>>({})

  const isExtracting = isExtractingLocal || isProcessingOCR

  const extractionMeta = globalData?.extraction_metadata ||
    data?.extraction_metadata || { auto_filled: [], manually_verified: [] }
  const validationMeta = globalData?.validation_metadata ||
    data?.validation_metadata || { errors: [] }

  const isAutoFilled = (fieldGlobalName: string) =>
    extractionMeta.auto_filled?.includes(fieldGlobalName)
  const isManuallyVerified = (fieldGlobalName: string) =>
    extractionMeta.manually_verified?.includes(fieldGlobalName)

  const handleOCRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (onProcessOCR) {
      setMissingFields({})
      await onProcessOCR(file)
      e.target.value = ''
    } else {
      setIsExtracting(true)
      setMissingFields({})
      toast({
        title: 'Extraindo dados...',
        description: 'Analisando documento via Inteligência...',
      })

      try {
        if (globalData?.id) {
          try {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('relacionamento_id', globalData.id)
            fd.append('category', 'Documento de Identificação (OCR)')
            if (pb.authStore.record?.id) {
              fd.append('user_id', pb.authStore.record.id)
            }
            await pb.collection('attachments').create(fd)
          } catch (e) {
            console.error('Erro ao salvar anexo', e)
          }
        }

        const reader = new FileReader()
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        const res = await pb.send('/backend/v1/ocr', {
          method: 'POST',
          body: JSON.stringify({ image: base64, docType: 'RG' }),
          headers: { 'Content-Type': 'application/json' },
        })

        const missing: Record<string, boolean> = {
          nacionalidade: !res.nacionalidade,
          genero: !res.genero,
          civil: true,
          escolaridade: true,
          mae: !res.mae && !res.pai,
          pai: !res.pai && !res.mae,
          cidade: !res.cidade_nasc,
          uf: !res.uf_nasc,
          sangue: true,
          nascimento: !res.nascimento,
          name: !res.name,
        }

        const capturedLocal = []
        if (res.name) {
          onChange('name', res.name)
          capturedLocal.push('name')
        }
        if (res.nascimento) {
          onChange(
            'nascimento',
            res.nascimento.includes('/')
              ? res.nascimento.split('/').reverse().join('-')
              : res.nascimento,
          )
          capturedLocal.push('birth_date')
        }
        if (res.nacionalidade) {
          onChange('nacionalidade', res.nacionalidade)
          capturedLocal.push('nationality')
        }
        if (res.genero) {
          onChange('genero', res.genero)
          capturedLocal.push('gender')
        }
        if (res.mae) {
          onChange('mae', res.mae)
          capturedLocal.push('parents_names')
        }
        if (res.pai) {
          onChange('pai', res.pai)
          capturedLocal.push('parents_names')
        }
        if (res.cidade_nasc) {
          onChange('cidade', res.cidade_nasc)
          capturedLocal.push('birth_city')
        }
        if (res.uf_nasc) {
          onChange('uf', res.uf_nasc)
          capturedLocal.push('birth_uf')
        }

        try {
          const faceFile = await cropFaceFromImage(file)
          if (faceFile) {
            onChange('foto', URL.createObjectURL(faceFile), faceFile)
            capturedLocal.push('photo')
          }
        } catch (err) {
          console.error(err)
        }

        setMissingFields(missing)

        const validationErrors: string[] = []
        if (!res.cpf && !res.rg) validationErrors.push('CPF ou RG não encontrado no documento.')
        if (!res.mae && !res.pai) validationErrors.push('Filiação não encontrada no documento.')
        if (!res.nascimento) validationErrors.push('Data de nascimento não encontrada.')

        if (globalData?.id) {
          const currentAutoFilled = extractionMeta.auto_filled || []
          const newAutoFilled = Array.from(new Set([...currentAutoFilled, ...capturedLocal]))
          const compStatus = validationErrors.length === 0 ? 'em_dia' : 'pendente'

          await pb
            .collection('relacionamentos')
            .update(globalData.id, {
              extraction_metadata: {
                ...extractionMeta,
                auto_filled: newAutoFilled,
                raw_text: res.raw_text,
                confidence: res.confidence,
                rg_extracted: res.rg,
              },
              validation_metadata: { errors: validationErrors },
              compliance_status: compStatus,
            })
            .catch(() => {})

          await pb
            .collection('audit_logs')
            .create({
              relacionamento_id: globalData.id,
              user_id: pb.authStore.record?.id,
              action: 'OCR Extraction',
              module: 'extraction',
              old_value: { status: 'Success' },
              new_value: {
                captured: capturedLocal,
                missing: Object.keys(missing).filter((k) => missing[k]),
              },
            })
            .catch(console.error)
        }
        toast({
          title: 'Extração Concluída',
          description: 'Dados populados com sucesso. Verifique os campos destacados em amarelo.',
        })
      } catch (err: any) {
        toast({
          variant: 'destructive',
          title: 'Falha na Extração (OCR)',
          description:
            'O documento fornecido está ilegível ou o formato não é suportado no momento.',
        })
      } finally {
        setIsExtracting(false)
      }
    }
  }

  const err = (f: string) =>
    errors?.[`pessoal.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  const fields = [
    ['Nacionalidade', 'nacionalidade', 'País de origem', true, 'nationality'],
    ['Gênero', 'genero', 'Identidade de gênero', true, 'gender'],
    ['Estado Civil', 'civil', 'Estado civil atual', true, 'civil'],
    ['Escolaridade', 'escolaridade', 'Grau de instrução completo', true, 'escolaridade'],
    ['Nome da Mãe', 'mae', 'Nome completo da mãe', true, 'parents_names'],
    ['Nome do Pai', 'pai', 'Nome completo do pai (opcional)', false, 'parents_names'],
    ['Cidade Nasc.', 'cidade', 'Cidade onde nasceu', true, 'birth_city'],
    ['UF Nasc.', 'uf', 'Estado onde nasceu', true, 'birth_uf'],
    ['Tipo Sanguíneo', 'sangue', 'Fator RH e tipo (ex: O+, A-)', false, 'sangue'],
    ['Data Nascimento', 'nascimento', 'Data de nascimento', true, 'birth_date'],
  ] as const

  const getValidationError = (globalFieldName: string) => {
    if (!validationMeta.errors || !validationMeta.errors.length) return null
    const msgs = validationMeta.errors
    if (globalFieldName === 'birth_date' && msgs.find((m: string) => m.includes('nascimento')))
      return 'Data de nascimento não preenchida'
    if (globalFieldName === 'nationality' && msgs.find((m: string) => m.includes('Nacionalidade')))
      return 'Nacionalidade não preenchida'
    if (globalFieldName === 'parents_names' && msgs.find((m: string) => m.includes('pais')))
      return 'Nome dos pais não preenchido'
    return null
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="flex items-start gap-3 bg-blue-50/80 p-4 rounded-xl border border-blue-100 text-sm shadow-sm">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-blue-900 leading-relaxed">
            <span className="font-semibold">Dados Pessoais:</span> Informações básicas de
            identificação do colaborador, essenciais para confecção de documentos e envio ao
            eSocial.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <input
                type="file"
                accept="image/*,.pdf"
                capture="environment"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleOCRUpload}
                disabled={isExtracting || readOnly}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isExtracting || readOnly}
                className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 h-8 shadow-sm"
              >
                {isExtracting ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <ScanText className="w-3.5 h-3.5 mr-1.5" />
                )}
                Extração OCR
              </Button>
            </div>
            {globalData?.id && <ExtractionLogDialog entityId={globalData.id} />}
          </div>
        </div>
      </div>
      {validationMeta.errors?.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm">
          <div className="flex items-center gap-2 text-rose-800 font-semibold mb-2">
            <AlertTriangle className="w-4 h-4" />
            Avisos de Compliance
          </div>
          <ul className="list-disc list-inside space-y-1 text-rose-700 ml-4">
            {validationMeta.errors.map((msg: string, i: number) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div
            className={cn(
              'relative group w-32 h-32 rounded-full border-4 border-slate-100 flex items-center justify-center bg-slate-50 text-slate-400 overflow-hidden shadow-sm transition-all',
              !readOnly && 'cursor-pointer hover:border-blue-300',
            )}
            onClick={() => !readOnly && fileInputRef.current?.click()}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 opacity-50" />
            )}
            {!readOnly && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white gap-1">
                <Camera className="w-6 h-6" />
                <span className="text-[10px] font-medium text-center px-2">Alterar Foto</span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
            disabled={readOnly}
          />
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
            Tamanho ideal: 400x400
          </span>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
            <LabelT l="Nome Completo" t="Nome oficial conforme documento civil" req />
            <FieldInput
              isExtracting={isExtracting}
              isMissing={missingFields.name}
              isAutoFilled={isAutoFilled('name')}
              isManuallyVerified={isManuallyVerified('name')}
              onClearMissing={() => setMissingFields((p) => ({ ...p, name: false }))}
              value={data?.name || ''}
              onChange={(e: any) => onChange('name', e.target.value)}
              className={cn('shadow-sm font-medium border-slate-300', err('name'))}
              disabled={readOnly}
            />
          </div>
          {fields.map(([label, field, tooltip, req, globalField]) => (
            <div key={field} className="space-y-1.5">
              <LabelT l={label} t={tooltip} req={req} />
              <FieldInput
                type={field === 'nascimento' ? 'date' : 'text'}
                isExtracting={isExtracting}
                isMissing={missingFields[field]}
                isAutoFilled={isAutoFilled(globalField)}
                isManuallyVerified={isManuallyVerified(globalField)}
                onClearMissing={() => setMissingFields((p) => ({ ...p, [field]: false }))}
                value={data?.[field] || ''}
                onChange={(e: any) => onChange(field, e.target.value)}
                className={cn('shadow-sm', err(field))}
                disabled={readOnly}
                validationError={getValidationError(globalField)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
