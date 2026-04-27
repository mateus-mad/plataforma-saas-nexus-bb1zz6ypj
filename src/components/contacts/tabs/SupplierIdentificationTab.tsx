import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Building2,
  User,
  Plus,
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Wand2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { consultarCNPJ } from '@/services/cnpj'
import { Skeleton } from '@/components/ui/skeleton'
import { ExtractionLogDialog } from '../ExtractionLogDialog'
import pb from '@/lib/pocketbase/client'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
            <TooltipContent>Preenchido automaticamente</TooltipContent>
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
          Verify manually: Data not found in the document/API.
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

export default function SupplierIdentificationTab({ data, updateData, globalData }: any) {
  const d = data.dados || {}
  const isPJ = d.tipoPessoa === 'PJ'
  const [newSeg, setNewSeg] = useState('')
  const [loadingCnpj, setLoadingCnpj] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [missingFields, setMissingFields] = useState<Record<string, boolean>>({})
  const [editedFields, setEditedFields] = useState<Record<string, boolean>>({})
  const [segments, setSegments] = useState([
    'Tecnologia',
    'Logística',
    'Indústria',
    'Serviços',
    'Varejo',
  ])
  const { toast } = useToast()

  const extractionMeta = globalData?.extraction_metadata ||
    data?.extraction_metadata || { auto_filled: [], manually_verified: [] }
  const validationMeta = globalData?.validation_metadata ||
    data?.validation_metadata || { errors: [] }

  const isAutoFilled = (fieldGlobalName: string) =>
    extractionMeta.auto_filled?.includes(fieldGlobalName)
  const isManuallyVerified = (fieldGlobalName: string) =>
    extractionMeta.manually_verified?.includes(fieldGlobalName)

  const handleUpdate = (field: string, value: any) => {
    setEditedFields((prev) => ({ ...prev, [field]: true }))
    updateData('dados', field, value)
  }

  const handleCnpjSearch = async () => {
    if (!d.documento) {
      toast({ variant: 'destructive', title: 'Aviso', description: 'Informe o CNPJ primeiro.' })
      return
    }
    setLoadingCnpj(true)
    setIsExtracting(true)
    setMissingFields({})
    toast({ title: 'Buscando CNPJ', description: 'Consultando base da Receita Federal...' })

    try {
      const res = await consultarCNPJ(d.documento)

      if (res.error || !res.data) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: res.message || 'Não foi possível conectar.',
        })
        return
      }

      const info = res.data || {}
      const missing: Record<string, boolean> = {}
      const captured: string[] = []

      const checkField = (field: string, value: any, label: string) => {
        if (value) {
          if (!editedFields[field]) updateData('dados', field, value)
          captured.push(label)
        } else {
          missing[field] = true
        }
      }

      checkField('nomeRazao', info.razao_social, 'name')
      checkField('fantasia', info.nome_fantasia, 'fantasia')
      checkField('dataNascimento', info.data_inicio_atividade, 'birth_date')

      if (info.cep) updateData('endereco', 'cep', info.cep)
      if (info.logradouro) updateData('endereco', 'logradouro', info.logradouro)
      if (info.numero) updateData('endereco', 'numero', info.numero)
      if (info.bairro) updateData('endereco', 'bairro', info.bairro)
      if (info.municipio) updateData('endereco', 'cidade', info.municipio)
      if (info.uf) updateData('endereco', 'estado', info.uf)

      setMissingFields(missing)

      if (globalData?.id) {
        const currentAutoFilled = extractionMeta.auto_filled || []
        const newAutoFilled = Array.from(new Set([...currentAutoFilled, ...captured]))

        await pb
          .collection('relacionamentos')
          .update(globalData.id, {
            extraction_metadata: { ...extractionMeta, auto_filled: newAutoFilled },
          })
          .catch(() => {})

        await pb
          .collection('audit_logs')
          .create({
            relacionamento_id: globalData.id,
            user_id: pb.authStore.record?.id,
            action: 'CNPJ API',
            module: 'extraction',
            old_value: { status: 'Success' },
            new_value: { captured, missing: Object.keys(missing) },
          })
          .catch(console.error)
      }

      toast({
        title: 'Sucesso',
        description: 'Dados sincronizados. Alterações manuais mantidas com segurança.',
      })
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: e.message || 'Não foi possível encontrar o CNPJ.',
      })
    } finally {
      setLoadingCnpj(false)
      setIsExtracting(false)
    }
  }

  const docError = validationMeta.errors?.find(
    (e: string) => e.includes('Documento') || e.includes('Formato'),
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {validationMeta.errors?.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm mb-4">
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

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex w-full sm:w-auto gap-2">
          <Button
            variant={isPJ ? 'default' : 'outline'}
            onClick={() => handleUpdate('tipoPessoa', 'PJ')}
            className="flex-1 sm:flex-none"
          >
            <Building2 className="w-4 h-4 mr-2" /> Pessoa Jurídica
          </Button>
          <Button
            variant={!isPJ ? 'default' : 'outline'}
            onClick={() => handleUpdate('tipoPessoa', 'PF')}
            className="flex-1 sm:flex-none"
          >
            <User className="w-4 h-4 mr-2" /> Pessoa Física
          </Button>
        </div>
        <div className="sm:ml-auto flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 w-full sm:w-auto justify-between sm:justify-start">
          <Label className="font-bold text-slate-700">Status Ativo</Label>
          <Switch checked={d.ativo} onCheckedChange={(v) => handleUpdate('ativo', v)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-2">
          <Label className="font-semibold text-slate-700">{isPJ ? 'CNPJ' : 'CPF'}</Label>
          <div className="flex gap-2 relative group">
            <div className="flex-1 relative">
              <Input
                value={d.documento || ''}
                onChange={(e) => handleUpdate('documento', e.target.value)}
                className={cn(
                  'font-mono w-full',
                  docError &&
                    'border-rose-500 bg-rose-50/50 text-rose-900 focus-visible:ring-rose-500',
                  isAutoFilled('document_number') && 'border-blue-300 bg-blue-50/30 pr-10',
                  isManuallyVerified('document_number') &&
                    'border-emerald-300 bg-emerald-50/30 pr-10',
                )}
                placeholder={isPJ ? '00.000.000/0001-00' : '000.000.000-00'}
              />
              {isAutoFilled('document_number') && !isManuallyVerified('document_number') && (
                <div className="absolute right-3 top-2.5 text-blue-500">
                  <Wand2 className="w-4 h-4" />
                </div>
              )}
              {isManuallyVerified('document_number') && (
                <div className="absolute right-3 top-2.5 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {docError && (
                <p className="text-[11px] leading-tight text-rose-600 mt-1.5 font-bold animate-in fade-in flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {docError}
                </p>
              )}
            </div>
            {isPJ && (
              <Button
                variant="outline"
                onClick={handleCnpjSearch}
                disabled={loadingCnpj}
                className="shrink-0 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                title="Sincronizar com Receita Federal"
              >
                {loadingCnpj ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-2 lg:col-span-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-slate-700">
              {isPJ ? 'Razão Social' : 'Nome Completo'}
            </Label>
            {isPJ && globalData?.id && <ExtractionLogDialog entityId={globalData.id} />}
          </div>
          <FieldInput
            isExtracting={isExtracting}
            isMissing={missingFields.nomeRazao}
            isAutoFilled={isAutoFilled('name')}
            isManuallyVerified={isManuallyVerified('name')}
            onClearMissing={() => setMissingFields((p) => ({ ...p, nomeRazao: false }))}
            value={d?.nomeRazao || ''}
            onChange={(e: any) => handleUpdate('nomeRazao', e.target.value)}
          />
        </div>

        {isPJ && (
          <div className="space-y-2 lg:col-span-3">
            <Label className="font-semibold text-slate-700">Nome Fantasia</Label>
            <FieldInput
              isExtracting={isExtracting}
              isMissing={missingFields.fantasia}
              isAutoFilled={isAutoFilled('fantasia')}
              isManuallyVerified={isManuallyVerified('fantasia')}
              onClearMissing={() => setMissingFields((p) => ({ ...p, fantasia: false }))}
              value={d?.fantasia || ''}
              onChange={(e: any) => handleUpdate('fantasia', e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="font-semibold text-slate-700">
            Data de {isPJ ? 'Abertura' : 'Nascimento'}
          </Label>
          <FieldInput
            type="date"
            isExtracting={isExtracting}
            isMissing={missingFields.dataNascimento}
            isAutoFilled={isAutoFilled('birth_date')}
            isManuallyVerified={isManuallyVerified('birth_date')}
            onClearMissing={() => setMissingFields((p) => ({ ...p, dataNascimento: false }))}
            value={d?.dataNascimento || ''}
            onChange={(e: any) => handleUpdate('dataNascimento', e.target.value)}
          />
        </div>

        {isPJ && (
          <>
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">Inscrição Estadual (IE)</Label>
              <Input
                value={d.ie || ''}
                onChange={(e) => handleUpdate('ie', e.target.value)}
                placeholder="ISENTO ou Número"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">Inscrição Municipal (IM)</Label>
              <Input value={d.im || ''} onChange={(e) => handleUpdate('im', e.target.value)} />
            </div>
          </>
        )}

        <div className="space-y-2 lg:col-span-3 pt-2">
          <Label className="font-semibold text-slate-700">Segmento de Atuação</Label>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={d.segmento} onValueChange={(v) => handleUpdate('segmento', v)}>
              <SelectTrigger className="w-full sm:max-w-xs bg-slate-50">
                <SelectValue placeholder="Selecione um segmento" />
              </SelectTrigger>
              <SelectContent>
                {segments.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ou digite um novo..."
                value={newSeg}
                onChange={(e) => setNewSeg(e.target.value)}
                className="h-10 text-sm w-full sm:max-w-[200px]"
                onKeyDown={(e) => e.key === 'Enter' && handleAddSeg()}
              />
              <Button onClick={handleAddSeg} className="h-10 shrink-0" variant="secondary">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
