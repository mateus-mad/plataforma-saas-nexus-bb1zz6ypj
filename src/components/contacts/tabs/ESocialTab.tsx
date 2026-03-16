import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type Props = {
  data: any
  onChange: (f: string, v: string) => void
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

export default function ESocialTab({ data, onChange, errors, readOnly }: Props) {
  const err = (f: string) =>
    errors?.[`esocial.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  return (
    <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="flex items-start gap-3 bg-blue-50/50 text-blue-800 p-4 rounded-xl border border-blue-100 text-sm shadow-sm">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
        <p className="leading-relaxed">
          <span className="font-semibold text-blue-900">Dados do eSocial:</span> Informações
          obrigatórias para o envio de eventos ao eSocial (S-2200, S-2206, etc). O preenchimento
          incorreto gera recusa nos lotes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <LabelT
            l="Matrícula eSocial"
            t="Código gerado exclusivamente para a plataforma do eSocial"
            req
          />
          <Input
            value={data.matricula || ''}
            onChange={(e) => onChange('matricula', e.target.value)}
            placeholder="Ex: 000001"
            className={cn('focus-visible:ring-blue-500 shadow-sm h-10', err('matricula'))}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-2">
          <LabelT l="Categoria do Trabalhador" t="Classificação tributária" req />
          <Select
            value={data.categoria}
            onValueChange={(v) => onChange('categoria', v)}
            disabled={readOnly}
          >
            <SelectTrigger className={cn('shadow-sm h-10', err('categoria'))}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="101">101 - Empregado Geral</SelectItem>
              <SelectItem value="102">102 - Trabalhador Rural</SelectItem>
              <SelectItem value="103">103 - Aprendiz</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <LabelT l="CBO (Cargo)" t="Classificação Brasileira de Ocupações" req />
          <Input
            value={data.cbo || ''}
            onChange={(e) => onChange('cbo', e.target.value)}
            placeholder="Ex: 2142-05"
            className={cn('focus-visible:ring-blue-500 shadow-sm h-10', err('cbo'))}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-2">
          <LabelT l="Ocorrência SEFIP" t="Código de exposição a agentes nocivos" />
          <Select
            value={data.sefip}
            onValueChange={(v) => onChange('sefip', v)}
            disabled={readOnly}
          >
            <SelectTrigger className={cn('shadow-sm h-10', err('sefip'))}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="01">01 - Sem exposição a risco</SelectItem>
              <SelectItem value="02">02 - Exposição a risco (15 anos)</SelectItem>
              <SelectItem value="03">03 - Exposição a risco (20 anos)</SelectItem>
              <SelectItem value="04">04 - Exposição a risco (25 anos)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <LabelT l="Natureza da Atividade" t="Classificação da atividade desempenhada" />
          <Select
            value={data.natureza}
            onValueChange={(v) => onChange('natureza', v)}
            disabled={readOnly}
          >
            <SelectTrigger className={cn('shadow-sm h-10', err('natureza'))}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urbana">1 - Urbana</SelectItem>
              <SelectItem value="rural">2 - Rural</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <LabelT l="Tipo de Admissão" t="Origem da contratação" />
          <Select
            value={data.admissao}
            onValueChange={(v) => onChange('admissao', v)}
            disabled={readOnly}
          >
            <SelectTrigger className={cn('shadow-sm h-10', err('admissao'))}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Admissão originária</SelectItem>
              <SelectItem value="2">2 - Transferência de empresa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
