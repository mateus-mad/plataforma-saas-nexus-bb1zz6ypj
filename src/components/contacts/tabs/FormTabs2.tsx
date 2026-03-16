import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = { data: any; onChange: (f: string, v: string) => void }

export function ContactTab({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-4">
      {[
        ['Celular (WhatsApp)', 'cel', 'text'],
        ['Telefone Fixo', 'fixo', 'text'],
        ['E-mail Pessoal', 'email', 'email'],
        ['E-mail Corporativo', 'corp', 'email'],
      ].map(([label, field, type]) => (
        <div key={field} className="space-y-1.5">
          <Label className="text-slate-700 font-semibold">{label}</Label>
          <Input
            type={type}
            value={data[field]}
            onChange={(e) => onChange(field, e.target.value)}
            className="shadow-sm"
          />
        </div>
      ))}
      <div className="md:col-span-2 pt-6 mt-2 border-t border-slate-100">
        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          Contato de Emergência
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            ['Nome', 'emergNome'],
            ['Telefone', 'emergTel'],
            ['Parentesco', 'emergRel'],
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
      </div>
    </div>
  )
}

export function WorkTab({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-4">
      {[
        ['Matrícula (ID)', 'matricula', 'text'],
        ['Cargo', 'cargo', 'text'],
        ['Departamento', 'depto', 'text'],
        ['Data de Admissão', 'admissao', 'date'],
        ['Tipo de Contrato', 'tipo', 'text'],
        ['Jornada (Turno)', 'jornada', 'text'],
      ].map(([label, field, type]) => (
        <div key={field} className="space-y-1.5">
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
