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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

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

export function CompanyDadosTab({ data, onChange, errors, readOnly }: any) {
  const err = (f: string) =>
    errors?.[`dados.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <LabelT l="Razão Social" req />
          <Input
            value={data.razao}
            onChange={(e) => onChange('razao', e.target.value)}
            disabled={readOnly}
            className={err('razao')}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Nome Fantasia" req />
          <Input
            value={data.fantasia}
            onChange={(e) => onChange('fantasia', e.target.value)}
            disabled={readOnly}
            className={err('fantasia')}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="CNPJ" req t="Apenas números" />
          <Input
            value={data.cnpj}
            onChange={(e) => onChange('cnpj', e.target.value)}
            disabled={readOnly}
            className={cn('font-mono', err('cnpj'))}
            placeholder="00.000.000/0000-00"
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Inscrição Estadual" />
          <Input
            value={data.ie}
            onChange={(e) => onChange('ie', e.target.value)}
            disabled={readOnly}
            className={err('ie')}
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <LabelT l="Setor de Atuação" req />
          <Select
            value={data.setor}
            onValueChange={(v) => onChange('setor', v)}
            disabled={readOnly}
          >
            <SelectTrigger className={err('setor')}>
              <SelectValue placeholder="Selecione o setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Civil">Civil</SelectItem>
              <SelectItem value="Solar">Solar</SelectItem>
              <SelectItem value="Metalúrgica">Metalúrgica</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export function CompanyContatoTab({ data, onChange, errors, readOnly }: any) {
  const err = (f: string) =>
    errors?.[`contato.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <LabelT l="Nome do Responsável" req />
          <Input
            value={data.responsavel}
            onChange={(e) => onChange('responsavel', e.target.value)}
            disabled={readOnly}
            className={err('responsavel')}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="E-mail de Contato" req />
          <Input
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            disabled={readOnly}
            className={err('email')}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Telefone Comercial" req />
          <Input
            value={data.telefone}
            onChange={(e) => onChange('telefone', e.target.value)}
            disabled={readOnly}
            className={err('telefone')}
            placeholder="(00) 0000-0000"
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="WhatsApp" />
          <Input
            value={data.whatsapp}
            onChange={(e) => onChange('whatsapp', e.target.value)}
            disabled={readOnly}
            className={err('whatsapp')}
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>
    </div>
  )
}

export function CompanyBancarioTab({ data, onChange, errors, readOnly }: any) {
  const err = (f: string) =>
    errors?.[`bancario.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <LabelT l="Banco" req />
          <Input
            value={data.banco}
            onChange={(e) => onChange('banco', e.target.value)}
            disabled={readOnly}
            className={err('banco')}
            placeholder="Ex: Itaú (341)"
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Agência" req />
          <Input
            value={data.agConta}
            onChange={(e) => onChange('agConta', e.target.value)}
            disabled={readOnly}
            className={err('agConta')}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Conta" req />
          <Input
            value={data.conta}
            onChange={(e) => onChange('conta', e.target.value)}
            disabled={readOnly}
            className={err('conta')}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Chave PIX" />
          <Input
            value={data.pix}
            onChange={(e) => onChange('pix', e.target.value)}
            disabled={readOnly}
            className={err('pix')}
          />
        </div>
      </div>
    </div>
  )
}
