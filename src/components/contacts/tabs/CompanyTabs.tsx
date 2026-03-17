import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Info, Search, Building, User, Upload } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export const LabelT = ({ l, t, req }: { l: string; t?: string; req?: boolean }) => (
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

export function CompanyDadosTab({ data, onChange, onAutofill, errors, readOnly }: any) {
  const { toast } = useToast()
  const isPJ = data.tipoPessoa === 'PJ'
  const err = (f: string) => (errors?.[`dados.${f}`] ? 'border-rose-500 bg-rose-50/30' : '')

  const handleSearchDoc = () => {
    if (!isPJ) return
    toast({ title: 'Buscando dados...', description: 'Consultando base da Receita.' })
    setTimeout(() => {
      if (onAutofill) onAutofill()
      toast({ title: 'Encontrado', description: 'Dados preenchidos com sucesso.' })
    }, 1000)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex gap-6 items-center mb-6 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="relative w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center hover:border-blue-500 overflow-hidden shrink-0">
          {data.logo ? (
            <img src={data.logo} className="w-full h-full object-cover" />
          ) : (
            <Upload className="w-6 h-6 text-slate-400" />
          )}
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              if (e.target.files?.[0]) onChange('logo', URL.createObjectURL(e.target.files[0]))
            }}
            disabled={readOnly}
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Logo ou Marca da Empresa</h4>
          <p className="text-xs text-slate-500 mb-2">JPG ou PNG (Max 2MB)</p>
          {!readOnly && (
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={handleSearchDoc}
              className="h-8 text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800 shadow-sm"
            >
              <Search className="w-3.5 h-3.5 mr-1.5" /> Buscar Automático via CNPJ/Site
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => onChange('tipoPessoa', 'PJ')}
          className={cn(
            'px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2',
            isPJ ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700',
          )}
        >
          <Building className="w-4 h-4" /> Pessoa Jurídica
        </button>
        <button
          type="button"
          onClick={() => onChange('tipoPessoa', 'PF')}
          className={cn(
            'px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2',
            !isPJ ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700',
          )}
        >
          <User className="w-4 h-4" /> Pessoa Física
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
          <LabelT l={isPJ ? 'CNPJ' : 'CPF'} req />
          <Input
            value={data.documento || ''}
            onChange={(e) => onChange('documento', e.target.value)}
            disabled={readOnly}
            className={cn('font-mono', err('documento'))}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l={isPJ ? 'Razão Social' : 'Nome Completo'} req />
          <Input
            value={data.nomeRazao || ''}
            onChange={(e) => onChange('nomeRazao', e.target.value)}
            disabled={readOnly}
            className={err('nomeRazao')}
          />
        </div>
        {isPJ && (
          <div className="space-y-1.5">
            <LabelT l="Nome Fantasia" />
            <Input
              value={data.fantasia || ''}
              onChange={(e) => onChange('fantasia', e.target.value)}
              disabled={readOnly}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export function CompanyContatoTab({ data, onChange, readOnly }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-4">
        <h4 className="font-semibold text-blue-900 text-sm mb-1 flex items-center gap-2">
          <User className="w-4 h-4" /> Pessoa de Contato Principal
        </h4>
        <p className="text-xs text-blue-800/80">
          Informações direcionadas à pessoa responsável pelo relacionamento comercial.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <LabelT l="Nome do Contato" req />
          <Input
            value={data.responsavel || ''}
            onChange={(e) => onChange('responsavel', e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Cargo / Função" req />
          <Input
            value={data.cargo || ''}
            onChange={(e) => onChange('cargo', e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="E-mail Pessoal de Contato" />
          <Input
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Telefone Direto / Celular" req />
          <Input
            value={data.telefone || ''}
            onChange={(e) => onChange('telefone', e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="E-mail do Financeiro/Cobrança" t="Para envio de NFs e Faturas" />
          <Input
            type="email"
            value={data.emailCobranca || ''}
            onChange={(e) => onChange('emailCobranca', e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Website da Empresa" />
          <Input
            type="url"
            value={data.website || ''}
            onChange={(e) => onChange('website', e.target.value)}
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  )
}

export function CompanyAddressTab({ data, onChange, readOnly }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5 md:col-span-1">
          <LabelT l="CEP" req />
          <Input
            value={data.cep || ''}
            onChange={(e) => onChange('cep', e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <LabelT l="Logradouro" req />
          <Input
            value={data.logradouro || ''}
            onChange={(e) => onChange('logradouro', e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Número" req />
          <Input
            value={data.numero || ''}
            onChange={(e) => onChange('numero', e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <LabelT l="Complemento" />
          <Input
            value={data.comp || ''}
            onChange={(e) => onChange('comp', e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Bairro" req />
          <Input
            value={data.bairro || ''}
            onChange={(e) => onChange('bairro', e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Cidade" req />
          <Input
            value={data.cidade || ''}
            onChange={(e) => onChange('cidade', e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Estado (UF)" req />
          <Input
            value={data.estado || ''}
            onChange={(e) => onChange('estado', e.target.value)}
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  )
}
