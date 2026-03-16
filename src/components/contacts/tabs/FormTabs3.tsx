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

export function BenefitsTab({ data, onChange }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-2">
        Pacote de Benefícios Concedidos
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <LabelT l="Plano de Saúde" t="Operadora e tipo de plano (ex: SulAmérica Exato)" />
          <Input
            value={data.saude || ''}
            onChange={(e) => onChange('saude', e.target.value)}
            placeholder="Ex: SulAmérica, Bradesco..."
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Plano Odontológico" t="Operadora (ex: Amil Dental)" />
          <Input
            value={data.odonto || ''}
            onChange={(e) => onChange('odonto', e.target.value)}
            placeholder="Ex: Amil Dental..."
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Vale Refeição (VR)" t="Valor ou operadora do VR" />
          <Input
            value={data.vr || ''}
            onChange={(e) => onChange('vr', e.target.value)}
            placeholder="R$ / dia ou Mês"
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Vale Alimentação (VA)" t="Valor do VA mensal" />
          <Input
            value={data.va || ''}
            onChange={(e) => onChange('va', e.target.value)}
            placeholder="R$ / mês"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <LabelT l="Vale Transporte (VT)" t="Rotas ou valor creditado" />
          <Input
            value={data.vt || ''}
            onChange={(e) => onChange('vt', e.target.value)}
            placeholder="Detalhes do trajeto ou valor"
          />
        </div>
      </div>
    </div>
  )
}

export function SalaryTab({ data, onChange }: Props) {
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
                className="pl-9 font-semibold text-blue-700"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <LabelT l="Forma de Pagamento" t="Ex: Mensal, Quinzenal, Semanal" req />
            <Input value={data.forma || ''} onChange={(e) => onChange('forma', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-200/60 pb-2 mb-5">
          Dados Bancários (Conta Salário/Corrente)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <LabelT l="Banco" t="Nome ou código do banco (ex: 341 - Itaú)" req />
            <Input
              value={data.banco || ''}
              onChange={(e) => onChange('banco', e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Agência" t="Número da agência sem dígito" req />
            <Input
              value={data.agConta || ''}
              onChange={(e) => onChange('agConta', e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Conta" t="Número da conta com dígito" req />
            <Input
              value={data.conta || ''}
              onChange={(e) => onChange('conta', e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Chave PIX" t="Opcional, para pagamentos alternativos" />
            <Input
              value={data.pix || ''}
              onChange={(e) => onChange('pix', e.target.value)}
              className="bg-white"
              placeholder="CPF/CNPJ, Email, Telefone..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
