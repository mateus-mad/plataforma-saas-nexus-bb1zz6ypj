import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Info, HelpCircle } from 'lucide-react'
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
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 transition-colors" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[250px] text-xs font-normal">
            {t}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </Label>
)

export function BenefitsTab({ data, onChange, errors, readOnly }: Props) {
  const err = (f: string) =>
    errors?.[`beneficios.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex gap-3 text-sm">
        <Info className="w-5 h-5 text-emerald-500 shrink-0" />
        <p className="text-emerald-800 leading-relaxed">
          <span className="font-semibold">Pacote de Benefícios:</span> Preencha as informações dos
          benefícios concedidos. Valores informados aqui não alteram a folha automaticamente, servem
          para composição de ficha.
        </p>
      </div>

      <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-2 mt-4">
        Saúde e Bem-Estar
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-1.5">
          <LabelT l="Plano de Saúde" t="Operadora e tipo de plano (ex: SulAmérica Exato)" />
          <Input
            value={data.saude || ''}
            onChange={(e) => onChange('saude', e.target.value)}
            placeholder="Ex: SulAmérica, Bradesco..."
            className={err('saude')}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Plano Odontológico" t="Operadora (ex: Amil Dental)" />
          <Input
            value={data.odonto || ''}
            onChange={(e) => onChange('odonto', e.target.value)}
            placeholder="Ex: Amil Dental..."
            className={err('odonto')}
            disabled={readOnly}
          />
        </div>
      </div>

      <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-2 mt-6">
        Alimentação e Transporte
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <LabelT l="Vale Refeição (VR)" t="Valor concedido por dia/mês" />
          <Input
            value={data.vr || ''}
            onChange={(e) => onChange('vr', e.target.value)}
            placeholder="R$ / dia ou Mês"
            className={err('vr')}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Vale Alimentação (VA)" t="Valor do VA mensal" />
          <Input
            value={data.va || ''}
            onChange={(e) => onChange('va', e.target.value)}
            placeholder="R$ / mês"
            className={err('va')}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Vale Transporte (VT)" t="Rotas ou valor creditado" />
          <Input
            value={data.vt || ''}
            onChange={(e) => onChange('vt', e.target.value)}
            placeholder="Detalhes do trajeto ou valor"
            className={err('vt')}
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  )
}

export function SalaryTab({ data, onChange, errors, readOnly }: Props) {
  const err = (f: string) =>
    errors?.[`salario.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-5">
          Remuneração Base
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <LabelT l="Salário Base Bruto" t="Valor bruto registrado em carteira" req />
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 font-medium">R$</span>
              <Input
                value={data.base || ''}
                onChange={(e) => onChange('base', e.target.value)}
                className={cn('pl-9 font-semibold text-blue-700 bg-blue-50/30', err('base'))}
                placeholder="0,00"
                disabled={readOnly}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <LabelT l="Forma de Pagamento" t="Ex: Mensal, Quinzenal, Semanal" req />
            <Select
              value={data.forma || 'Mensal'}
              onValueChange={(v) => onChange('forma', v)}
              disabled={readOnly}
            >
              <SelectTrigger className={err('forma')}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mensal">Mensal</SelectItem>
                <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                <SelectItem value="Semanal">Semanal</SelectItem>
                <SelectItem value="Horista">Horista</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-200/80 pb-2 mb-5">
          Dados Bancários (Conta Salário/Corrente)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <LabelT l="Banco" t="Nome ou código do banco (ex: 341 - Itaú)" req />
            <Input
              value={data.banco || ''}
              onChange={(e) => onChange('banco', e.target.value)}
              className={cn('bg-white', err('banco'))}
              placeholder="Ex: Itaú, Bradesco"
              disabled={readOnly}
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Agência" t="Número da agência sem dígito" req />
            <Input
              value={data.agConta || ''}
              onChange={(e) => onChange('agConta', e.target.value)}
              className={cn('bg-white', err('agConta'))}
              placeholder="0000"
              disabled={readOnly}
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Conta" t="Número da conta com dígito" req />
            <Input
              value={data.conta || ''}
              onChange={(e) => onChange('conta', e.target.value)}
              className={cn('bg-white', err('conta'))}
              placeholder="00000-0"
              disabled={readOnly}
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Chave PIX" t="Opcional, para pagamentos alternativos" />
            <Input
              value={data.pix || ''}
              onChange={(e) => onChange('pix', e.target.value)}
              className={cn('bg-white', err('pix'))}
              placeholder="CPF/CNPJ, Email, Tel..."
              disabled={readOnly}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
