import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = { data: any; onChange: (f: string, v: string) => void }

export function ChargesTab({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-4">
      {[
        ['INSS (Calculado)', 'inss'],
        ['IRRF (Calculado)', 'irrf'],
        ['Dependentes IR', 'depIr'],
        ['Dependentes Salário Família', 'depSf'],
      ].map(([label, field]) => (
        <div key={field} className="space-y-1.5">
          <Label className="text-slate-700 font-semibold">{label}</Label>
          <Input
            value={data[field]}
            onChange={(e) => onChange(field, e.target.value)}
            className="shadow-sm"
            readOnly={field === 'inss' || field === 'irrf'}
          />
        </div>
      ))}
    </div>
  )
}

export function VacationTab({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-4">
      {[
        ['Início Período Aquisitivo', 'inicio', 'date', ''],
        ['Fim Período Aquisitivo', 'fim', 'date', ''],
        ['Dias de Direito', 'direito', 'number', ''],
        ['Dias Tirados', 'tirados', 'number', ''],
        ['Próximas Férias Programadas', 'prox', 'date', 'md:col-span-2'],
      ].map(([label, field, type, cls]) => (
        <div key={field} className={`space-y-1.5 ${cls}`}>
          <Label className="text-slate-700 font-semibold">{label}</Label>
          <Input
            type={type}
            value={data[field]}
            onChange={(e) => onChange(field, e.target.value)}
            className="shadow-sm"
          />
        </div>
      ))}
    </div>
  )
}
