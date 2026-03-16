import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'

type Props = { data: any; onChange: (f: string, v: string) => void }

export function DocsTab({ data, onChange }: Props) {
  const fields = [
    ['CPF', 'cpf', 'text'],
    ['RG', 'rg', 'text'],
    ['PIS/PASEP', 'pis', 'text'],
    ['CTPS', 'ctps', 'text'],
    ['Título de Eleitor', 'titulo', 'text'],
    ['CNH Categoria', 'cnhCat', 'text'],
    ['CNH Validade', 'cnhExp', 'date'],
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="col-span-full mb-2">
        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">
          Documentação Legal
        </h4>
      </div>
      {fields.map(([label, field, type]) => (
        <div key={field} className="space-y-1.5">
          <Label className="text-slate-700 font-semibold">{label}</Label>
          <Input
            type={type}
            value={data[field] || ''}
            onChange={(e) => onChange(field, e.target.value)}
            className="shadow-sm border-slate-200 focus-visible:ring-blue-500 bg-white"
            placeholder={`Inserir ${label}`}
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-1.5 md:col-span-2 relative">
        <Label className="text-slate-700 font-semibold">CEP</Label>
        <div className="relative">
          <Input
            value={data.cep || ''}
            onChange={(e) => onChange('cep', e.target.value)}
            onBlur={onCepBlur}
            placeholder="00000-000"
            className="shadow-sm border-slate-200 focus-visible:ring-blue-500 pl-9"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
        <p className="text-[10px] text-slate-500 absolute -bottom-4">Preenchimento automático</p>
      </div>
      <div className="space-y-1.5 md:col-span-4">
        <Label className="text-slate-700 font-semibold">Logradouro</Label>
        <Input
          value={data.logradouro || ''}
          onChange={(e) => onChange('logradouro', e.target.value)}
          className="shadow-sm border-slate-200 focus-visible:ring-blue-500"
        />
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <Label className="text-slate-700 font-semibold">Número</Label>
        <Input
          value={data.numero || ''}
          onChange={(e) => onChange('numero', e.target.value)}
          className="shadow-sm border-slate-200 focus-visible:ring-blue-500"
        />
      </div>
      <div className="space-y-1.5 md:col-span-4">
        <Label className="text-slate-700 font-semibold">Complemento</Label>
        <Input
          value={data.comp || ''}
          onChange={(e) => onChange('comp', e.target.value)}
          className="shadow-sm border-slate-200 focus-visible:ring-blue-500"
          placeholder="Apto, Bloco, etc."
        />
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <Label className="text-slate-700 font-semibold">Bairro</Label>
        <Input
          value={data.bairro || ''}
          onChange={(e) => onChange('bairro', e.target.value)}
          className="shadow-sm border-slate-200 focus-visible:ring-blue-500"
        />
      </div>
      <div className="space-y-1.5 md:col-span-3">
        <Label className="text-slate-700 font-semibold">Cidade</Label>
        <Input
          value={data.cidade || ''}
          onChange={(e) => onChange('cidade', e.target.value)}
          className="shadow-sm border-slate-200 focus-visible:ring-blue-500"
        />
      </div>
      <div className="space-y-1.5 md:col-span-1">
        <Label className="text-slate-700 font-semibold">UF</Label>
        <Input
          value={data.uf || ''}
          onChange={(e) => onChange('uf', e.target.value)}
          className="shadow-sm border-slate-200 focus-visible:ring-blue-500 uppercase"
          maxLength={2}
        />
      </div>
    </div>
  )
}
