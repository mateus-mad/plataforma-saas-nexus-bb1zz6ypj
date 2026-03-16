import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Info, HeartPulse } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type Props = {
  data: any
  onChange: (f: string, v: string) => void
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
  const err = (f: string) =>
    errors?.[`trabalho.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-2">
        Dados do Vínculo Empregatício
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <LabelT l="Matrícula (ID Interno)" t="Código de identificação interno da empresa" req />
          <Input
            value={data.matricula || ''}
            onChange={(e) => onChange('matricula', e.target.value)}
            className={cn('bg-slate-50 font-mono', err('matricula'))}
            placeholder="COL0001"
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Departamento" t="Setor de alocação do colaborador" req />
          <Input
            value={data.depto || ''}
            onChange={(e) => onChange('depto', e.target.value)}
            placeholder="Ex: Engenharia"
            className={err('depto')}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Cargo (CBO)" t="Função exercida (deve coincidir com CBO)" req />
          <Input
            value={data.cargo || ''}
            onChange={(e) => onChange('cargo', e.target.value)}
            placeholder="Ex: Engenheiro Civil"
            className={err('cargo')}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Data de Admissão" t="Data de início no sistema/contrato" req />
          <Input
            type="date"
            value={data.admissao || ''}
            onChange={(e) => onChange('admissao', e.target.value)}
            className={err('admissao')}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Tipo de Contrato" t="Ex: CLT Mensalista, PJ, Horista" req />
          <Input
            value={data.tipo || ''}
            onChange={(e) => onChange('tipo', e.target.value)}
            placeholder="Ex: CLT"
            className={err('tipo')}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Jornada (Turno)" t="Carga horária semanal ou turno" req />
          <Input
            value={data.jornada || ''}
            onChange={(e) => onChange('jornada', e.target.value)}
            placeholder="Ex: 44h semanais"
            className={err('jornada')}
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  )
}
