import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Info } from 'lucide-react'

export default function ESocialTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="flex items-start gap-3 bg-blue-50/50 text-blue-800 p-4 rounded-xl border border-blue-100 text-sm shadow-sm">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
        <p className="leading-relaxed">
          <span className="font-semibold text-blue-900">Dados do eSocial:</span> Informações
          obrigatórias para o envio de eventos ao eSocial (S-2200, S-2206, etc).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">
            Matrícula eSocial <span className="text-rose-500">*</span>
          </Label>
          <Input placeholder="Ex: 000001" className="focus-visible:ring-blue-500 shadow-sm h-10" />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">
            Categoria do Trabalhador <span className="text-rose-500">*</span>
          </Label>
          <Select>
            <SelectTrigger className="shadow-sm h-10">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="101">101 - Empregado Geral</SelectItem>
              <SelectItem value="102">102 - Trabalhador Rural</SelectItem>
              <SelectItem value="103">103 - Aprendiz</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">
            CBO (Cargo) <span className="text-rose-500">*</span>
          </Label>
          <Input placeholder="Ex: 2142-05" className="focus-visible:ring-blue-500 shadow-sm h-10" />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">Ocorrência SEFIP</Label>
          <Select>
            <SelectTrigger className="shadow-sm h-10">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="01">01 - Sem exposição a risco</SelectItem>
              <SelectItem value="02">02 - Exposição a risco (15 anos)</SelectItem>
              <SelectItem value="03">03 - Exposição a risco (20 anos)</SelectItem>
              <SelectItem value="04">04 - Exposição a risco (25 anos)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">Natureza da Atividade</Label>
          <Select>
            <SelectTrigger className="shadow-sm h-10">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urbana">1 - Urbana</SelectItem>
              <SelectItem value="rural">2 - Rural</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">Tipo de Admissão</Label>
          <Select>
            <SelectTrigger className="shadow-sm h-10">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Admissão originária</SelectItem>
              <SelectItem value="2">2 - Transferência de empresa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
