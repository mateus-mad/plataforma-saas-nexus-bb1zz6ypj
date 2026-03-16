import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type Props = { data: any; onChange: (f: string, v: string) => void }

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

export function ChargesTab({ data, onChange }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-2">
        Encargos e Descontos Legais
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <LabelT l="INSS (Calculado)" t="Desconto retido do colaborador" />
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
          <LabelT l="IRRF (Calculado)" t="Imposto de Renda Retido na Fonte" />
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
          <LabelT l="FGTS (Calculado)" t="Depósito mensal (Não desconta do func.)" />
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
        <div className="space-y-1.5">
          <LabelT l="Dependentes para IR" t="Quantidade de dependentes declarados para IRRF" />
          <Input
            type="number"
            value={data.depIr || ''}
            onChange={(e) => onChange('depIr', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Dep. Salário Família" t="Dependentes habilitados para Salário Família" />
          <Input
            type="number"
            value={data.depSf || ''}
            onChange={(e) => onChange('depSf', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export function VacationTab({ data, onChange }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-2">
        Controle de Férias e Períodos
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <LabelT l="Início Per. Aquisitivo" t="Data base para início do cálculo de 1 ano" req />
          <Input
            type="date"
            value={data.inicio || ''}
            onChange={(e) => onChange('inicio', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Fim Per. Aquisitivo" t="Data de fechamento do período" req />
          <Input
            type="date"
            value={data.fim || ''}
            onChange={(e) => onChange('fim', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Dias de Direito" t="Dias consolidados (padrão 30)" />
          <Input
            type="number"
            value={data.direito || ''}
            onChange={(e) => onChange('direito', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Dias Tirados" t="Dias já gozados neste período" />
          <Input
            type="number"
            value={data.tirados || ''}
            onChange={(e) => onChange('tirados', e.target.value)}
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <LabelT l="Próximas Férias Programadas" t="Data agendada no sistema para o gozo" />
          <Input
            type="date"
            value={data.prox || ''}
            onChange={(e) => onChange('prox', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
