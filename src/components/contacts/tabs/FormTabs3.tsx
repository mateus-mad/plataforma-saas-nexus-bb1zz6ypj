import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = { data: any; onChange: (f: string, v: string) => void }

export function BenefitsTab({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-4">
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
            value={data[field]}
            onChange={(e) => onChange(field, e.target.value)}
            className="shadow-sm"
          />
        </div>
      ))}
    </div>
  )
}

export function SalaryTab({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-4">
      {[
        ['Salário Base', 'base'],
        ['Forma de Pagamento', 'forma'],
        ['Banco', 'banco'],
        ['Agência / Conta', 'agConta'],
        ['Chave PIX', 'pix'],
      ].map(([label, field]) => (
        <div key={field} className="space-y-1.5">
          <Label className="text-slate-700 font-semibold">{label}</Label>
          <Input
            value={data[field]}
            onChange={(e) => onChange(field, e.target.value)}
            className="shadow-sm"
          />
        </div>
      ))}
    </div>
  )
}
