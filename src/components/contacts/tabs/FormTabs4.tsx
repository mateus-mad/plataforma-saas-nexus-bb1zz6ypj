import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = { data: any; onChange: (f: string, v: string) => void }

export function ChargesTab({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="col-span-full mb-2">
        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">
          Encargos e Descontos
        </h4>
      </div>
      {[
        ['INSS (Calculado)', 'inss'],
        ['IRRF (Calculado)', 'irrf'],
        ['FGTS (Calculado)', 'fgts'],
        ['Dependentes para IR', 'depIr'],
        ['Dependentes Salário Família', 'depSf'],
      ].map(([label, field]) => (
        <div key={field} className="space-y-1.5">
          <Label className="text-slate-700 font-semibold">{label}</Label>
          <div className="relative">
            {['inss', 'irrf', 'fgts'].includes(field) && (
              <span className="absolute left-3 top-2.5 text-slate-500 font-medium">R$</span>
            )}
            <Input
              value={data[field] || ''}
              onChange={(e) => onChange(field, e.target.value)}
              className={`shadow-sm bg-slate-50 ${['inss', 'irrf', 'fgts'].includes(field) ? 'pl-9' : ''}`}
              readOnly={['inss', 'irrf', 'fgts'].includes(field)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function VacationTab({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="col-span-full mb-2">
        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">
          Controle de Férias
        </h4>
      </div>
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
            value={data[field] || ''}
            onChange={(e) => onChange(field, e.target.value)}
            className="shadow-sm"
          />
        </div>
      ))}
    </div>
  )
}
