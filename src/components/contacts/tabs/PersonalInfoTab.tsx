import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Info, Camera } from 'lucide-react'

type Props = { data: any; onChange: (f: string, v: string) => void }

export default function PersonalInfoTab({ data, onChange }: Props) {
  const fields = [
    ['Nacionalidade', 'nacionalidade'],
    ['Gênero', 'genero'],
    ['Estado Civil', 'civil'],
    ['Escolaridade', 'escolaridade'],
    ['Nome da Mãe', 'mae'],
    ['Nome do Pai', 'pai'],
    ['Cidade Nasc.', 'cidade'],
    ['UF Nasc.', 'uf'],
    ['Tipo Sanguíneo', 'sangue'],
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm shadow-sm">
        <Info className="w-5 h-5 text-blue-500 shrink-0" />
        <p className="text-blue-800">
          <span className="font-semibold">Dados Pessoais:</span> Informações básicas de
          identificação do colaborador, essenciais para documentos e eSocial.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full border-4 border-slate-100 flex items-center justify-center bg-slate-50 text-slate-400 overflow-hidden shadow-sm transition-all group-hover:border-blue-300">
              {data.name === 'Mateus Amorim Dias' || data.name === 'Mateus amorim dias' ? (
                <img
                  src="https://img.usecurling.com/ppl/medium?gender=male&seed=1"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 opacity-50" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
            Alterar Foto
          </span>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
            <Label className="text-slate-700 font-semibold">
              Nome Completo <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="shadow-sm font-medium"
            />
          </div>
          {fields.map(([label, field]) => (
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
