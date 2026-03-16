import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = { data: any; onChange: (f: string, v: string) => void }

export function DocsTab({ data, onChange }: Props) {
  const fields = [
    ['CPF', 'cpf', 'text'],
    ['RG', 'rg', 'text'],
    ['CNH Categoria', 'cnhCat', 'text'],
    ['CNH Validade', 'cnhExp', 'date'],
    ['PIS/PASEP', 'pis', 'text'],
    ['Título de Eleitor', 'titulo', 'text'],
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-4">
      {fields.map(([label, field, type]) => (
        <div key={field} className="space-y-1.5">
          <Label className="text-slate-700 font-semibold">{label}</Label>
          <Input
            type={type}
            value={data[field]}
            onChange={(e) => onChange(field, e.target.value)}
            className="shadow-sm border-slate-200 focus-visible:ring-blue-500"
          />
        </div>
      ))}
    </div>
  )
}

export function AddressTab({ data, onChange }: Props) {
  const onCepBlur = async (e: any) => {
    const cep = e.target.value.replace(/\D/g, '')
    if (cep.length === 8) {
      try {
        const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const d = await r.json()
        if (!d.erro) {
          onChange('logradouro', d.logradouro)
          onChange('bairro', d.bairro)
          onChange('cidade', d.localidade)
          onChange('uf', d.uf)
        }
      } catch (err) {
        console.error('Failed to fetch CEP')
      }
    }
  }

  const fields = [
    ['Número', 'numero', ''],
    ['Complemento', 'comp', ''],
    ['Bairro', 'bairro', ''],
    ['Cidade', 'cidade', 'md:col-span-2'],
    ['UF', 'uf', ''],
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-1.5">
        <Label className="text-slate-700 font-semibold">CEP (Auto-fill)</Label>
        <Input
          value={data.cep}
          onChange={(e) => onChange('cep', e.target.value)}
          onBlur={onCepBlur}
          placeholder="00000-000"
          className="shadow-sm border-slate-200 focus-visible:ring-blue-500"
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label className="text-slate-700 font-semibold">Logradouro</Label>
        <Input
          value={data.logradouro}
          onChange={(e) => onChange('logradouro', e.target.value)}
          className="shadow-sm border-slate-200 focus-visible:ring-blue-500"
        />
      </div>
      {fields.map(([label, field, cls]) => (
        <div key={field} className={`space-y-1.5 ${cls}`}>
          <Label className="text-slate-700 font-semibold">{label}</Label>
          <Input
            value={data[field]}
            onChange={(e) => onChange(field, e.target.value)}
            className="shadow-sm border-slate-200 focus-visible:ring-blue-500"
          />
        </div>
      ))}
    </div>
  )
}
