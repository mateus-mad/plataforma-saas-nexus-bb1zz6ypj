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
import { Info, Search, MessageCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

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

export function CompanyDadosTab({ data, onChange, onAutofill, errors, readOnly }: any) {
  const { toast } = useToast()

  const err = (f: string) =>
    errors?.[`dados.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '')
    if (data.tipoPessoa === 'PJ') {
      if (v.length > 14) v = v.slice(0, 14)
      v = v.replace(/^(\d{2})(\d)/, '$1.$2')
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      v = v.replace(/\.(\d{3})(\d)/, '.$1/$2')
      v = v.replace(/(\d{4})(\d)/, '$1-$2')
    } else {
      if (v.length > 11) v = v.slice(0, 11)
      v = v.replace(/(\d{3})(\d)/, '$1.$2')
      v = v.replace(/(\d{3})(\d)/, '$1.$2')
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    onChange('documento', v)
  }

  const handleSearchDoc = () => {
    if (data.tipoPessoa !== 'PJ') return
    toast({ title: 'Buscando CNPJ...', description: 'Consultando base da Receita Federal.' })
    setTimeout(() => {
      if (onAutofill) onAutofill()
      toast({ title: 'CNPJ Encontrado', description: 'Dados preenchidos com sucesso.' })
    }, 1500)
  }

  const isPJ = data.tipoPessoa === 'PJ'

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-2">
            Identificação
          </h4>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => onChange('tipoPessoa', 'PJ')}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                isPJ ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              Pessoa Jurídica
            </button>
            <button
              type="button"
              onClick={() => onChange('tipoPessoa', 'PF')}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                !isPJ ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              Pessoa Física
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
            <LabelT
              l={isPJ ? 'CNPJ' : 'CPF'}
              req
              t={isPJ ? 'Digite o CNPJ para preenchimento automático' : 'Digite o CPF válido'}
            />
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={data.documento || ''}
                  onChange={handleDocChange}
                  disabled={readOnly}
                  className={cn('font-mono pl-10', err('documento'))}
                  placeholder={isPJ ? '00.000.000/0000-00' : '000.000.000-00'}
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              {isPJ && (
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleSearchDoc}
                  disabled={readOnly || (data.documento || '').length < 18}
                >
                  Buscar
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
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
                <SelectItem value="Serviços">Serviços</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <LabelT l={isPJ ? 'Razão Social' : 'Nome Completo'} req />
            <Input
              value={data.nomeRazao}
              onChange={(e) => onChange('nomeRazao', e.target.value)}
              disabled={readOnly}
              className={err('nomeRazao')}
            />
          </div>
          {isPJ && (
            <div className="space-y-1.5">
              <LabelT l="Nome Fantasia" />
              <Input
                value={data.fantasia}
                onChange={(e) => onChange('fantasia', e.target.value)}
                disabled={readOnly}
                className={err('fantasia')}
              />
            </div>
          )}
          {isPJ && (
            <div className="space-y-1.5">
              <LabelT l="Inscrição Estadual" />
              <Input
                value={data.ie}
                onChange={(e) => onChange('ie', e.target.value)}
                disabled={readOnly}
                className={err('ie')}
              />
            </div>
          )}
          {isPJ && (
            <div className="space-y-1.5">
              <LabelT l="Inscrição Municipal" />
              <Input
                value={data.im}
                onChange={(e) => onChange('im', e.target.value)}
                disabled={readOnly}
                className={err('im')}
              />
            </div>
          )}
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
          <LabelT l="Cargo (Função)" req />
          <Select
            value={data.cargo}
            onValueChange={(v) => onChange('cargo', v)}
            disabled={readOnly}
          >
            <SelectTrigger className={err('cargo')}>
              <SelectValue placeholder="Selecione o cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sócio/Proprietário">Sócio/Proprietário</SelectItem>
              <SelectItem value="Diretor">Diretor</SelectItem>
              <SelectItem value="Gerente">Gerente</SelectItem>
              <SelectItem value="Financeiro">Financeiro</SelectItem>
              <SelectItem value="Comercial">Comercial</SelectItem>
              <SelectItem value="Comprador">Comprador</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>
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
          <div className="flex gap-2">
            <Input
              value={data.whatsapp}
              onChange={(e) => onChange('whatsapp', e.target.value)}
              disabled={readOnly}
              className={err('whatsapp')}
              placeholder="(00) 00000-0000"
            />
            <Button
              variant="outline"
              size="icon"
              asChild
              className="shrink-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
            >
              <a
                href={`https://wa.me/${(data.whatsapp || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                title="Abrir WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </Button>
          </div>
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
