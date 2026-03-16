import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = { data: any; onChange: (f: string, v: string) => void }

export function ContactTab({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="col-span-full mb-2">
        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">
          Contatos Pessoais
        </h4>
      </div>
      {[
        ['Telefone Principal', 'telPrinc', 'text'],
        ['Telefone Secundário', 'telSec', 'text'],
        ['WhatsApp', 'whatsapp', 'text'],
        ['E-mail', 'email', 'email'],
      ].map(([label, field, type]) => (
        <div key={field} className="space-y-1.5">
          <Label className="text-slate-700 font-semibold">{label}</Label>
          <Input
            type={type}
            value={data[field] || ''}
            onChange={(e) => onChange(field, e.target.value)}
            className="shadow-sm border-slate-200 focus-visible:ring-blue-500"
            placeholder={type === 'email' ? 'exemplo@email.com' : '(00) 00000-0000'}
          />
        </div>
      ))}
      <div className="col-span-full pt-4 mt-2">
        <h4 className="text-sm font-semibold text-rose-800 border-b border-rose-100 pb-2 mb-4">
          Contato de Emergência
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ['Nome do Contato', 'emergNome'],
            ['Telefone', 'emergTel'],
            ['Grau de Parentesco', 'emergRel'],
          ].map(([label, field]) => (
            <div key={field} className="space-y-1.5">
              <Label className="text-slate-700 font-semibold">{label}</Label>
              <Input
                value={data[field] || ''}
                onChange={(e) => onChange(field, e.target.value)}
                className="shadow-sm border-slate-200 focus-visible:ring-rose-500"
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="col-span-full mb-2">
        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">
          Dados do Vínculo
        </h4>
      </div>
      {[
        ['Matrícula (ID)', 'matricula', 'text'],
        ['Departamento', 'depto', 'text'],
        ['Cargo', 'cargo', 'text'],
        ['Data de Admissão', 'admissao', 'date'],
        ['Tipo de Contrato', 'tipo', 'text'],
        ['Jornada (Turno)', 'jornada', 'text'],
      ].map(([label, field, type]) => (
        <div key={field} className="space-y-1.5">
          <Label className="text-slate-700 font-semibold">{label}</Label>
          <Input
            type={type}
            value={data[field] || ''}
            onChange={(e) => onChange(field, e.target.value)}
            className="shadow-sm border-slate-200 focus-visible:ring-blue-500"
          />
        </div>
      ))}
    </div>
  )
}
