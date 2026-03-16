import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Info, HeartPulse, Plus } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  data: any
  onChange: (f: string, v: any) => void
  errors?: Record<string, string>
  readOnly?: boolean
}

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

export function ContactTab({ data, onChange, errors, readOnly }: Props) {
  const err = (f: string) =>
    errors?.[`contato.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-5">
          Contatos Pessoais
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <LabelT l="Telefone Principal" t="Celular de uso diário do colaborador" req />
            <Input
              value={data.telPrinc || ''}
              onChange={(e) => onChange('telPrinc', e.target.value)}
              placeholder="(00) 00000-0000"
              className={err('telPrinc')}
              disabled={readOnly}
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Telefone Secundário" t="Telefone fixo ou recado" />
            <Input
              value={data.telSec || ''}
              onChange={(e) => onChange('telSec', e.target.value)}
              placeholder="(00) 0000-0000"
              className={err('telSec')}
              disabled={readOnly}
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="WhatsApp" t="Número utilizado para contato via WhatsApp" />
            <Input
              value={data.whatsapp || ''}
              onChange={(e) => onChange('whatsapp', e.target.value)}
              placeholder="(00) 00000-0000"
              className={err('whatsapp')}
              disabled={readOnly}
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="E-mail" t="E-mail pessoal para envio de comunicados" req />
            <Input
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="exemplo@email.com"
              className={err('email')}
              disabled={readOnly}
            />
          </div>
        </div>
      </div>

      <div className="bg-rose-50/30 p-6 rounded-2xl border border-rose-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
        <h4 className="text-sm font-bold text-rose-800 flex items-center gap-2 mb-4">
          <HeartPulse className="w-5 h-5" /> Contato de Emergência
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <LabelT l="Nome do Contato" t="Pessoa a ser avisada em caso de urgência" req />
            <Input
              value={data.emergNome || ''}
              onChange={(e) => onChange('emergNome', e.target.value)}
              className={cn(
                'bg-white border-rose-200 focus-visible:ring-rose-500 shadow-sm',
                err('emergNome'),
              )}
              placeholder="Ex: Maria Silva"
              disabled={readOnly}
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Telefone" t="Número do contato de emergência" req />
            <Input
              value={data.emergTel || ''}
              onChange={(e) => onChange('emergTel', e.target.value)}
              placeholder="(00) 00000-0000"
              className={cn(
                'bg-white border-rose-200 focus-visible:ring-rose-500 shadow-sm',
                err('emergTel'),
              )}
              disabled={readOnly}
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Grau de Parentesco" t="Ex: Mãe, Cônjuge, Irmão" req />
            <Input
              value={data.emergRel || ''}
              onChange={(e) => onChange('emergRel', e.target.value)}
              placeholder="Ex: Mãe"
              className={cn(
                'bg-white border-rose-200 focus-visible:ring-rose-500 shadow-sm',
                err('emergRel'),
              )}
              disabled={readOnly}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function WorkTab({ data, onChange, errors, readOnly }: Props) {
  const [roles, setRoles] = useState([
    'Engenheiro Civil',
    'Técnico Solar',
    'Soldador',
    'Administrativo',
  ])
  const [newRole, setNewRole] = useState('')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleAddRole = () => {
    if (newRole.trim()) {
      setRoles([...roles, newRole.trim()])
      onChange('cargo', newRole.trim())
      setNewRole('')
      setIsPopoverOpen(false)
    }
  }

  const err = (f: string) =>
    errors?.[`trabalho.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-blue-50/50 text-blue-800 p-4 rounded-xl border border-blue-100 flex gap-3 text-sm shadow-sm">
        <Info className="w-5 h-5 text-blue-500 shrink-0" />
        <p className="leading-relaxed">
          <span className="font-semibold">Dados Profissionais:</span> Informações do contrato de
          trabalho, cargo, departamento e exames ocupacionais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <LabelT l="Data de Admissão" req />
          <Input
            type="date"
            value={data.admissao || ''}
            onChange={(e) => onChange('admissao', e.target.value)}
            className={err('admissao')}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Cargo" req />
          <div className="flex gap-2">
            <Select
              value={data.cargo || ''}
              onValueChange={(v) => onChange('cargo', v)}
              disabled={readOnly}
            >
              <SelectTrigger className={cn('flex-1', err('cargo'))}>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!readOnly && (
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 text-slate-600">
                    <Plus className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64 p-3 z-[100]">
                  <Label className="text-xs mb-2 block font-semibold text-slate-700">
                    Adicionar Novo Cargo
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="Nome do cargo"
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <Button onClick={handleAddRole} size="sm" className="h-8">
                      Ok
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <LabelT l="Departamento" />
          <Input
            value={data.depto || ''}
            onChange={(e) => onChange('depto', e.target.value)}
            placeholder="Departamento ou setor"
            className={err('depto')}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Tipo de Contrato" />
          <Select
            value={data.tipo || ''}
            onValueChange={(v) => onChange('tipo', v)}
            disabled={readOnly}
          >
            <SelectTrigger className={err('tipo')}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mensalista">Mensalista</SelectItem>
              <SelectItem value="Horista">Horista</SelectItem>
              <SelectItem value="Estagiário">Estagiário</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <LabelT l="Jornada de Trabalho" />
          <Select
            value={data.jornada || ''}
            onValueChange={(v) => onChange('jornada', v)}
            disabled={readOnly}
          >
            <SelectTrigger className={err('jornada')}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nenhuma">Nenhuma</SelectItem>
              <SelectItem value="Padrão 8h">Padrão 8h</SelectItem>
              <SelectItem value="Flexível">Jornada Flexível</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <LabelT l="Turno de Trabalho" />
          <Select
            value={data.turno || ''}
            onValueChange={(v) => onChange('turno', v)}
            disabled={readOnly}
          >
            <SelectTrigger className={err('turno')}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Diurno">Diurno</SelectItem>
              <SelectItem value="Noturno">Noturno</SelectItem>
              <SelectItem value="Misto">Misto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <LabelT l="Carga Horária Semanal" />
          <Input
            type="number"
            value={data.cargaHoraria || ''}
            onChange={(e) => onChange('cargaHoraria', e.target.value)}
            placeholder="Ex: 44"
            className={err('cargaHoraria')}
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          Período de Experiência
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium border border-slate-200">
            Máximo 90 dias
          </span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <LabelT l="Dias de Experiência" />
            <Input
              type="number"
              value={data.expDias || ''}
              onChange={(e) => onChange('expDias', e.target.value)}
              placeholder="Ex: 45"
              className={err('expDias')}
              disabled={readOnly}
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Término da Experiência" />
            <Input
              type="date"
              value={data.expTermino || ''}
              onChange={(e) => onChange('expTermino', e.target.value)}
              className={cn('bg-slate-50', err('expTermino'))}
              disabled={readOnly}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h4 className="text-sm font-semibold text-slate-800">Exames Ocupacionais</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <LabelT l="Exame Admissional" />
            <Input
              type="date"
              value={data.exameAdmissional || ''}
              onChange={(e) => onChange('exameAdmissional', e.target.value)}
              disabled={readOnly}
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Último Exame Periódico" />
            <Input
              type="date"
              value={data.examePeriodico || ''}
              onChange={(e) => onChange('examePeriodico', e.target.value)}
              disabled={readOnly}
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Exame Demissional" />
            <Input
              type="date"
              value={data.exameDemissional || ''}
              onChange={(e) => onChange('exameDemissional', e.target.value)}
              disabled={readOnly}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h4 className="text-sm font-semibold text-slate-800">Sindicato</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="flex items-center gap-3 mb-2 md:mb-0 pb-2">
            <Switch
              checked={data.sindicatoContribui}
              onCheckedChange={(v) => onChange('sindicatoContribui', v)}
              className="data-[state=checked]:bg-blue-600"
              disabled={readOnly}
            />
            <Label className="text-slate-800 font-semibold cursor-pointer">
              Contribui com Sindicato
            </Label>
          </div>
          <div className="space-y-1.5">
            <LabelT l="Nome do Sindicato" />
            <Input
              value={data.sindicatoNome || ''}
              onChange={(e) => onChange('sindicatoNome', e.target.value)}
              disabled={readOnly || !data.sindicatoContribui}
              placeholder="Nome do sindicato"
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Carteira Sindical" />
            <Input
              value={data.sindicatoCarteira || ''}
              onChange={(e) => onChange('sindicatoCarteira', e.target.value)}
              disabled={readOnly || !data.sindicatoContribui}
              placeholder="Número"
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Valor Contribuição (R$)" />
            <Input
              type="number"
              value={data.sindicatoValor || ''}
              onChange={(e) => onChange('sindicatoValor', e.target.value)}
              disabled={readOnly || !data.sindicatoContribui}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="space-y-1.5">
          <LabelT l="Observações Gerais" />
          <Textarea
            value={data.observacoes || ''}
            onChange={(e) => onChange('observacoes', e.target.value)}
            disabled={readOnly}
            placeholder="Anotações sobre o colaborador"
            className="resize-none"
          />
        </div>
      </div>
    </div>
  )
}
