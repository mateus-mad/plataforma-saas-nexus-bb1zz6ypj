import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Info, User, Upload } from 'lucide-react'

type Props = {
  name: string
  setName: (v: string) => void
  nacionalidade: string
  setNacionalidade: (v: string) => void
}

export default function PersonalInfoTab({ name, setName, nacionalidade, setNacionalidade }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="flex items-start gap-3 bg-blue-50/50 text-blue-800 p-4 rounded-xl border border-blue-100 text-sm shadow-sm">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
        <p className="leading-relaxed">
          <span className="font-semibold text-blue-900">Dados Pessoais:</span> Informações básicas
          de identificação do colaborador como nome, data de nascimento, gênero e filiação.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400 overflow-hidden relative group cursor-pointer hover:bg-slate-100 hover:border-blue-400 hover:text-blue-500 transition-all shadow-sm">
            <User className="w-12 h-12 sm:w-16 sm:h-16 opacity-50 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
              <Upload className="w-6 h-6 mb-1.5" />
              <span className="text-xs font-medium tracking-wide">Atualizar Foto</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs font-medium border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 mr-2" /> Adicionar Foto
          </Button>
        </div>

        <div className="flex-1 space-y-7">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-slate-700 font-semibold">
              Nome Completo <span className="text-rose-500">*</span>{' '}
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome completo do colaborador"
              className="focus-visible:ring-blue-500 border-slate-200 h-11 text-base shadow-sm"
            />
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1.5 font-medium">
              <Info className="w-3.5 h-3.5 text-slate-400" /> Utilizado em contratos e documentos
              oficiais
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-slate-700 font-semibold">
                Data de Nascimento{' '}
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
              </Label>
              <Input
                type="date"
                className="text-slate-600 focus-visible:ring-blue-500 border-slate-200 h-10 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-slate-700 font-semibold">
                Gênero{' '}
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
              </Label>
              <Select>
                <SelectTrigger className="border-slate-200 focus:ring-blue-500 h-10 shadow-sm bg-white">
                  <SelectValue placeholder="Clique para selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Label className="flex items-center gap-1.5 text-slate-700 font-semibold">
                Estado Civil{' '}
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
              </Label>
              <Select>
                <SelectTrigger className="border-slate-200 focus:ring-blue-500 h-10 shadow-sm bg-white">
                  <SelectValue placeholder="Clique para selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="casado">Casado(a)</SelectItem>
                  <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-slate-700 font-semibold">
                Nacionalidade{' '}
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
              </Label>
              <Input
                value={nacionalidade}
                onChange={(e) => setNacionalidade(e.target.value)}
                className="focus-visible:ring-blue-500 border-slate-200 h-10 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-slate-700 font-semibold">
                Escolaridade{' '}
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
              </Label>
              <Select>
                <SelectTrigger className="border-slate-200 focus:ring-blue-500 h-10 shadow-sm bg-white">
                  <SelectValue placeholder="Clique para selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medio">Ensino Médio</SelectItem>
                  <SelectItem value="superior">Ensino Superior</SelectItem>
                  <SelectItem value="pos">Pós-graduação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Label className="flex items-center gap-1.5 text-slate-700 font-semibold">
                Tipo Sanguíneo{' '}
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
              </Label>
              <Select>
                <SelectTrigger className="border-slate-200 focus:ring-blue-500 h-10 shadow-sm bg-white">
                  <SelectValue placeholder="Clique para selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a+">A+</SelectItem>
                  <SelectItem value="o+">O+</SelectItem>
                  <SelectItem value="b+">B+</SelectItem>
                  <SelectItem value="ab+">AB+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-slate-700 font-semibold">
                Nome da Mãe{' '}
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
              </Label>
              <Input
                placeholder="Nome completo da mãe"
                className="focus-visible:ring-blue-500 border-slate-200 h-10 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-slate-700 font-semibold">
                Nome do Pai{' '}
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
              </Label>
              <Input
                placeholder="Nome completo do pai"
                className="focus-visible:ring-blue-500 border-slate-200 h-10 shadow-sm"
              />
            </div>
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Label className="flex items-center gap-1.5 text-slate-700 font-semibold">
                Cidade de Nascimento{' '}
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
              </Label>
              <Input
                placeholder="Cidade onde nasceu"
                className="focus-visible:ring-blue-500 border-slate-200 h-10 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-slate-700 font-semibold">
                UF Nascimento{' '}
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
              </Label>
              <Select>
                <SelectTrigger className="border-slate-200 focus:ring-blue-500 h-10 shadow-sm bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sp">SP</SelectItem>
                  <SelectItem value="rj">RJ</SelectItem>
                  <SelectItem value="mg">MG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 flex items-end pb-0.5">
              <div className="flex items-center gap-3 bg-emerald-50/50 text-emerald-800 px-5 py-2.5 rounded-lg border border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer group w-full sm:w-auto shadow-sm">
                <Switch
                  defaultChecked
                  id="ativo-switch"
                  className="data-[state=checked]:bg-emerald-500"
                />
                <Label
                  htmlFor="ativo-switch"
                  className="font-bold text-emerald-700 cursor-pointer flex items-center group-hover:text-emerald-800 transition-colors text-sm"
                >
                  Colaborador Ativo{' '}
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none shadow-sm ml-2">
                    Ativo
                  </Badge>
                </Label>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3 group w-fit cursor-pointer">
              <Checkbox
                id="pcd"
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 shadow-sm w-4 h-4 rounded"
              />
              <Label
                htmlFor="pcd"
                className="flex items-center gap-1.5 font-semibold text-slate-600 cursor-pointer group-hover:text-slate-800 transition-colors"
              >
                Pessoa com Deficiência (PCD){' '}
                <Info className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
