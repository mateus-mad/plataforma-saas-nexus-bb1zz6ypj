import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Info, Camera } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useState, useRef } from 'react'

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

export default function PersonalInfoTab({ data, onChange }: Props) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotoPreview(url)
      onChange('foto', url)
    }
  }

  const defaultPhoto =
    data.name.toLowerCase() === 'mateus amorim dias'
      ? 'https://img.usecurling.com/ppl/medium?gender=male&seed=1'
      : null

  const fields = [
    ['Nacionalidade', 'nacionalidade', 'País de origem', true],
    ['Gênero', 'genero', 'Identidade de gênero', true],
    ['Estado Civil', 'civil', 'Estado civil atual', true],
    ['Escolaridade', 'escolaridade', 'Grau de instrução completo', true],
    ['Nome da Mãe', 'mae', 'Nome completo da mãe', true],
    ['Nome do Pai', 'pai', 'Nome completo do pai (opcional se não registrado)', false],
    ['Cidade Nasc.', 'cidade', 'Cidade onde nasceu', true],
    ['UF Nasc.', 'uf', 'Estado onde nasceu', true],
    ['Tipo Sanguíneo', 'sangue', 'Fator RH e tipo (ex: O+, A-)', false],
  ] as const

  return (
    <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="flex items-start gap-3 bg-blue-50/80 p-4 rounded-xl border border-blue-100 text-sm shadow-sm">
        <Info className="w-5 h-5 text-blue-500 shrink-0" />
        <p className="text-blue-900 leading-relaxed">
          <span className="font-semibold">Dados Pessoais:</span> Informações básicas de
          identificação do colaborador, essenciais para confecção de documentos e envio ao eSocial.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-32 h-32 rounded-full border-4 border-slate-100 flex items-center justify-center bg-slate-50 text-slate-400 overflow-hidden shadow-sm transition-all group-hover:border-blue-300 relative">
              {photoPreview || defaultPhoto ? (
                <img
                  src={photoPreview || defaultPhoto!}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 opacity-50" />
              )}
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white gap-1">
                <Camera className="w-6 h-6" />
                <span className="text-[10px] font-medium">Trocar Foto</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
            Tamanho ideal: 400x400
          </span>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
            <LabelT l="Nome Completo" t="Nome oficial conforme documento civil" req />
            <Input
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="shadow-sm font-medium border-slate-300"
            />
          </div>
          {fields.map(([label, field, tooltip, req]) => (
            <div key={field} className="space-y-1.5">
              <LabelT l={label} t={tooltip} req={req} />
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
