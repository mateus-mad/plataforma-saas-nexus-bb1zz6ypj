import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Info, Calculator } from 'lucide-react'
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

export function ChargesTab({ data, onChange, errors, readOnly }: Props) {
  const err = (f: string) =>
    errors?.[`encargos.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-start gap-3 bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-sm shadow-sm mb-6">
        <Calculator className="w-5 h-5 text-amber-500 shrink-0" />
        <p className="text-amber-900 leading-relaxed">
          <span className="font-semibold">Cálculos Prévios:</span> Os valores de INSS, IRRF e FGTS
          são simulações com base no salário bruto informado. Descontos definitivos dependem da
          folha de pagamento.
        </p>
      </div>

      <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-2">
        Encargos e Descontos Legais (Simulação)
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <LabelT l="INSS (Estimado)" t="Desconto retido do colaborador" />
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-rose-500 font-medium">R$</span>
            <Input
              value={data.inss || ''}
              onChange={(e) => onChange('inss', e.target.value)}
              className="pl-9 bg-rose-50/50 border-rose-100 text-rose-700 font-semibold cursor-not-allowed"
              readOnly
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <LabelT l="IRRF (Estimado)" t="Imposto de Renda Retido na Fonte" />
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-rose-500 font-medium">R$</span>
            <Input
              value={data.irrf || ''}
              onChange={(e) => onChange('irrf', e.target.value)}
              className="pl-9 bg-rose-50/50 border-rose-100 text-rose-700 font-semibold cursor-not-allowed"
              readOnly
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <LabelT l="FGTS (Estimado)" t="Depósito mensal (Não desconta do func.)" />
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-emerald-600 font-medium">R$</span>
            <Input
              value={data.fgts || ''}
              onChange={(e) => onChange('fgts', e.target.value)}
              className="pl-9 bg-emerald-50/50 border-emerald-100 text-emerald-700 font-semibold cursor-not-allowed"
              readOnly
            />
          </div>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-2 mt-6">
        Dependentes Legais
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <LabelT
            l="Dependentes para IR"
            t="Quantidade de dependentes declarados para dedução do IRRF"
          />
          <Input
            type="number"
            min="0"
            value={data.depIr || '0'}
            onChange={(e) => onChange('depIr', e.target.value)}
            disabled={readOnly}
            className={err('depIr')}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT
            l="Dep. Salário Família"
            t="Dependentes habilitados para recebimento de Salário Família"
          />
          <Input
            type="number"
            min="0"
            value={data.depSf || '0'}
            onChange={(e) => onChange('depSf', e.target.value)}
            disabled={readOnly}
            className={err('depSf')}
          />
        </div>
      </div>
    </div>
  )
}

export function VacationTab({ data, onChange, errors, readOnly }: Props) {
  const err = (f: string) =>
    errors?.[`ferias.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-2">
        Controle de Férias (Período Aquisitivo)
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-1.5">
          <LabelT l="Início Per. Aquisitivo" t="Data base para início do cálculo de 1 ano" req />
          <Input
            type="date"
            value={data.inicio || ''}
            onChange={(e) => onChange('inicio', e.target.value)}
            disabled={readOnly}
            className={err('inicio')}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Fim Per. Aquisitivo" t="Data de fechamento do período" req />
          <Input
            type="date"
            value={data.fim || ''}
            onChange={(e) => onChange('fim', e.target.value)}
            disabled={readOnly}
            className={err('fim')}
          />
        </div>
      </div>

      <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-2 mt-6">
        Gozo e Programação
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <LabelT l="Dias de Direito" t="Dias consolidados (padrão 30)" />
          <Input
            type="number"
            value={data.direito || '30'}
            onChange={(e) => onChange('direito', e.target.value)}
            disabled={readOnly}
            className={err('direito')}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Dias Tirados" t="Dias já gozados neste período" />
          <Input
            type="number"
            value={data.tirados || '0'}
            onChange={(e) => onChange('tirados', e.target.value)}
            disabled={readOnly}
            className={err('tirados')}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Próximas Férias" t="Data agendada no sistema para o gozo" />
          <Input
            type="date"
            value={data.prox || ''}
            onChange={(e) => onChange('prox', e.target.value)}
            disabled={readOnly}
            className={err('prox')}
          />
        </div>
      </div>
    </div>
  )
}
