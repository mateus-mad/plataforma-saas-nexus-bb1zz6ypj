import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = { data: any; onChange: (f: string, v: string) => void }

export function BenefitsTab({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="col-span-full mb-2">
        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">
          Pacote de Benefícios
        </h4>
      </div>
      {[
        ['Plano de Saúde', 'saude'],
        ['Plano Odontológico', 'odonto'],
        ['Vale Refeição (VR)', 'vr'],
        ['Vale Alimentação (VA)', 'va'],
        ['Vale Transporte (VT)', 'vt'],
      ].map(([label, field]) => (
        <div key={field} className="space-y-1.5">
          <Label className="text-slate-700 font-semibold">{label}</Label>
          <Input
            value={data[field] || ''}
            onChange={(e) => onChange(field, e.target.value)}
            className="shadow-sm bg-white"
            placeholder="Ex: SulAmérica, R$ 45,00/dia, etc."
          />
        </div>
      ))}
    </div>
  )
}

export function SalaryTab({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="col-span-full mb-2">
        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">
          Remuneração Base
        </h4>
      </div>
      {[
        ['Salário Base Bruto', 'base'],
        ['Forma de Pagamento', 'forma'],
      ].map(([label, field]) => (
        <div key={field} className="space-y-1.5">
          <Label className="text-slate-700 font-semibold">{label}</Label>
          <Input
            value={data[field] || ''}
            onChange={(e) => onChange(field, e.target.value)}
            className="shadow-sm"
          />
        </div>
      ))}

      <div className="col-span-full pt-4 mt-2">
        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">
          Dados Bancários
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ['Banco', 'banco'],
            ['Agência', 'agConta'],
            ['Conta', 'conta'],
            ['Chave PIX', 'pix'],
          ].map(([label, field]) => (
            <div key={field} className="space-y-1.5">
              <Label className="text-slate-700 font-semibold">{label}</Label>
              <Input
                value={data[field] || ''}
                onChange={(e) => onChange(field, e.target.value)}
                className="shadow-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
