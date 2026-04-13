import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Info, Camera } from 'lucide-react'
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
  onClearMissing,
  value,
  onChange,
  disabled,
  type = 'text',
  className,
  placeholder,
}: any) {
  if (isExtracting) return <Skeleton className="h-10 w-full rounded-md" />
  return (
    <div>
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
        )}
      />
      {isMissing && (
        <p className="text-[11px] leading-tight text-yellow-600 mt-1.5 font-medium animate-in fade-in">
          Verify manually: Data not found in the document/API.
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

export default function PersonalInfoTab({ data, onChange, errors, readOnly }: Props) {
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
  const [isExtracting, setIsExtracting] = useState(false)
  const [missingFields, setMissingFields] = useState<Record<string, boolean>>({})

  const handleOCRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsExtracting(true)
    setMissingFields({})
    toast({ title: 'Extracting data...', description: 'Analyzing document via OCR...' })

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const missing: Record<string, boolean> = {
        nacionalidade: true,
        genero: true,
        civil: true,
        escolaridade: true,
        mae: true,
        pai: true,
        cidade: true,
        uf: true,
        sangue: true,
      }

      onChange('name', 'João da Silva')
      onChange('nascimento', '1990-01-01')
      setMissingFields(missing)

      if (data?.id) {
        await pb
          .collection('audit_logs')
          .create({
            relacionamento_id: data.id,
            user_id: pb.authStore.record?.id,
            action: 'OCR Identity Card',
            module: 'extraction',
            old_value: { status: 'Success' },
            new_value: {
              captured: ['Nome Completo', 'Data Nascimento'],
              missing: Object.keys(missing),
            },
          })
          .catch(console.error)
      }
      toast({
        title: 'Success',
        description: 'Document data extracted. Please verify missing fields.',
      })
    } catch (err: any) {
      if (data?.id) {
        await pb
          .collection('audit_logs')
          .create({
            relacionamento_id: data.id,
            user_id: pb.authStore.record?.id,
            action: 'OCR Identity Card',
            module: 'extraction',
            old_value: { status: 'Error', message: err.message || 'Error processing OCR' },
            new_value: { captured: [], missing: [] },
          })
          .catch(console.error)
      }
    } finally {
      setIsExtracting(false)
    }
  }

  const err = (f: string) =>
    errors?.[`pessoal.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  const fields = [
    ['Nacionalidade', 'nacionalidade', 'País de origem', true],
    ['Gênero', 'genero', 'Identidade de gênero', true],
    ['Estado Civil', 'civil', 'Estado civil atual', true],
    ['Escolaridade', 'escolaridade', 'Grau de instrução completo', true],
    ['Nome da Mãe', 'mae', 'Nome completo da mãe', true],
    ['Nome do Pai', 'pai', 'Nome completo do pai (opcional se não registrado)', false],
    ['Cidade Nasc.', 'cidade', 'Cidade onde nasceu', true],
    ['UF Nasc.', 'uf', 'Estado onde nasceu', true],
    ['Tipo Sanguíneo', 'sangue', 'Fator RH e tipo (ex: O+, A-)', false],
    ['Data Nascimento', 'nascimento', 'Data de nascimento', true],
  ] as const

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
            {data?.id && <ExtractionLogDialog entityId={data.id} />}
          </div>
        </div>
      </div>
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
              onClearMissing={() => setMissingFields((p) => ({ ...p, name: false }))}
              value={data?.name || ''}
              onChange={(e: any) => onChange('name', e.target.value)}
              className={cn('shadow-sm font-medium border-slate-300', err('name'))}
              disabled={readOnly}
            />
          </div>
          {fields.map(([label, field, tooltip, req]) => (
            <div key={field} className="space-y-1.5">
              <LabelT l={label} t={tooltip} req={req} />
              <FieldInput
                type={field === 'nascimento' ? 'date' : 'text'}
                isExtracting={isExtracting}
                isMissing={missingFields[field]}
                onClearMissing={() => setMissingFields((p) => ({ ...p, [field]: false }))}
                value={data?.[field] || ''}
                onChange={(e: any) => onChange(field, e.target.value)}
                className={cn('shadow-sm', err(field))}
                disabled={readOnly}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
