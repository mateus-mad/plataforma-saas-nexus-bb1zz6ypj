import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Info, Search, Building, User, Upload, Plus, Trash2, Users } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
    toast({ title: 'Buscando dados...', description: 'Consultando base da Receita e Website.' })
    setTimeout(() => {
      if (onAutofill) onAutofill()
      toast({ title: 'Encontrado', description: 'Dados e logotipo preenchidos com sucesso.' })
    }, 1500)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex gap-6 items-center mb-6 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="relative w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center hover:border-blue-500 overflow-hidden shrink-0 group">
          {data.logo ? (
            <img src={data.logo} className="w-full h-full object-contain p-1 bg-white" />
          ) : (
            <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
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
          <p className="text-xs text-slate-500 mb-2">
            Formatos suportados: JPG ou PNG (Tamanho máximo de 2MB)
          </p>
          {!readOnly && (
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={handleSearchDoc}
              className="h-8 text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800 shadow-sm"
            >
              <Search className="w-3.5 h-3.5 mr-1.5" /> Busca Automática via Base de Dados
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
          <div className="flex gap-2">
            <Input
              value={data.documento || ''}
              onChange={(e) => onChange('documento', e.target.value)}
              disabled={readOnly}
              className={cn('font-mono', err('documento'))}
            />
            {!readOnly && isPJ && (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleSearchDoc}
                      className="shrink-0 text-blue-600 hover:text-blue-700 bg-blue-50 border-blue-200"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Autocompletar via CNPJ</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
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
  const pessoas = data?.pessoas || []

  const addPessoa = () => {
    onChange('pessoas', [
      ...pessoas,
      { id: Date.now(), nome: '', cargo: '', email: '', telefone: '' },
    ])
  }

  const removePessoa = (i: number) => {
    onChange(
      'pessoas',
      pessoas.filter((_: any, idx: number) => idx !== i),
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
        <div>
          <h4 className="font-semibold text-blue-900 text-sm mb-1 flex items-center gap-2">
            <Users className="w-4 h-4" /> Pessoas de Contato Estratégico ({pessoas.length})
          </h4>
          <p className="text-xs text-blue-800/80">
            Cadastre os responsáveis pelo relacionamento em diferentes áreas da empresa parceira.
          </p>
        </div>
        {!readOnly && (
          <Button
            size="sm"
            type="button"
            onClick={addPessoa}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Novo Contato
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {pessoas.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 border border-slate-100 rounded-xl">
            <p className="text-sm text-slate-500 font-medium">Nenhum contato cadastrado.</p>
          </div>
        ) : (
          pessoas.map((p: any, i: number) => (
            <div
              key={p.id || i}
              className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm relative group transition-colors hover:border-blue-200"
            >
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePessoa(i)}
                  className="absolute top-2 right-2 h-8 w-8 text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <LabelT l="Nome do Contato" req />
                  <Input
                    value={p.nome || ''}
                    onChange={(e) => {
                      const np = [...pessoas]
                      np[i].nome = e.target.value
                      onChange('pessoas', np)
                    }}
                    disabled={readOnly}
                    placeholder="Ex: Maria Souza"
                  />
                </div>
                <div className="space-y-1.5">
                  <LabelT l="Cargo / Função" />
                  <Input
                    value={p.cargo || ''}
                    onChange={(e) => {
                      const np = [...pessoas]
                      np[i].cargo = e.target.value
                      onChange('pessoas', np)
                    }}
                    disabled={readOnly}
                    placeholder="Ex: Gerente Financeiro"
                  />
                </div>
                <div className="space-y-1.5">
                  <LabelT l="E-mail Direto" />
                  <Input
                    type="email"
                    value={p.email || ''}
                    onChange={(e) => {
                      const np = [...pessoas]
                      np[i].email = e.target.value
                      onChange('pessoas', np)
                    }}
                    disabled={readOnly}
                    placeholder="Ex: maria@empresa.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <LabelT l="Telefone Direto" />
                  <Input
                    value={p.telefone || ''}
                    onChange={(e) => {
                      const np = [...pessoas]
                      np[i].telefone = e.target.value
                      onChange('pessoas', np)
                    }}
                    disabled={readOnly}
                    placeholder="Ex: (11) 99999-9999"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
        <div className="space-y-1.5">
          <LabelT
            l="E-mail Geral / Faturamento"
            t="E-mail principal para envio de notas e boletos"
          />
          <Input
            type="email"
            value={data.emailCobranca || ''}
            onChange={(e) => onChange('emailCobranca', e.target.value)}
            disabled={readOnly}
            placeholder="Ex: financeiro@empresa.com"
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Website da Empresa" />
          <Input
            type="url"
            value={data.website || ''}
            onChange={(e) => onChange('website', e.target.value)}
            disabled={readOnly}
            placeholder="Ex: https://empresa.com"
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
