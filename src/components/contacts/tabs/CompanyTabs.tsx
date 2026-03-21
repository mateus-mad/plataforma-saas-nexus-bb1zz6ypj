import { useState } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { Info, Search, Building, User, Upload, Plus, Trash2, Users, Loader2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { consultarCNPJ } from '@/services/cnpj'

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

export function CompanyDadosTab({ data, onChange, onUpdateSection, errors, readOnly }: any) {
  const { toast } = useToast()
  const isPJ = data.tipoPessoa === 'PJ'
  const err = (f: string) => (errors?.[`dados.${f}`] ? 'border-rose-500 bg-rose-50/30' : '')

  const [segments, setSegments] = useState([
    'Tecnologia e Serviços',
    'Varejo',
    'Indústria',
    'Logística',
  ])
  const [showNewSeg, setShowNewSeg] = useState(false)
  const [newSeg, setNewSeg] = useState('')
  const [loadingCnpj, setLoadingCnpj] = useState(false)

  const handleSearchDoc = async () => {
    if (!isPJ || !data.documento) {
      toast({
        variant: 'destructive',
        title: 'Aviso',
        description: 'Digite um CNPJ válido primeiro.',
      })
      return
    }

    setLoadingCnpj(true)
    toast({ title: 'Buscando dados...', description: 'Consultando base da Receita Federal.' })

    try {
      const res = await consultarCNPJ(data.documento)

      onChange('nomeRazao', res.razao_social || '')
      onChange('fantasia', res.nome_fantasia || '')

      const cleanCnpj = res.cnpj || data.documento.replace(/\D/g, '')
      onChange(
        'documento',
        cleanCnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5'),
      )

      if (res.data_inicio_atividade) {
        onChange('dataAbertura', res.data_inicio_atividade)
      }

      if (onUpdateSection) {
        if (res.cep) onUpdateSection('endereco', 'cep', res.cep)

        const logradouro = res.descricao_tipo_de_logradouro
          ? `${res.descricao_tipo_de_logradouro} ${res.logradouro}`
          : res.logradouro

        if (logradouro) onUpdateSection('endereco', 'logradouro', logradouro)
        if (res.numero) onUpdateSection('endereco', 'numero', res.numero)
        if (res.bairro) onUpdateSection('endereco', 'bairro', res.bairro)
        if (res.municipio) onUpdateSection('endereco', 'cidade', res.municipio)
        if (res.uf) onUpdateSection('endereco', 'estado', res.uf)
        if (res.complemento) onUpdateSection('endereco', 'comp', res.complemento)
      }

      toast({
        title: 'Sucesso',
        description: 'Dados e endereço preenchidos com sucesso.',
      })
    } catch (e: any) {
      console.error('CNPJ Lookup Error:', e)
      toast({
        variant: 'destructive',
        title: 'Erro na Consulta',
        description:
          e.message ||
          'Não foi possível recuperar os dados automaticamente. Por favor, preencha manualmente.',
      })
    } finally {
      setLoadingCnpj(false)
    }
  }

  const handleAddSegment = () => {
    if (newSeg.trim() && !segments.includes(newSeg.trim())) {
      setSegments([...segments, newSeg.trim()])
      onChange('segmento', newSeg.trim())
      setShowNewSeg(false)
      setNewSeg('')
    }
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
          <p className="text-xs text-slate-500 mb-2">Formatos suportados: JPG ou PNG (Max 2MB)</p>
          {!readOnly && (
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={handleSearchDoc}
              disabled={loadingCnpj || !isPJ}
              className="h-8 text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800 shadow-sm"
            >
              {loadingCnpj ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5 mr-1.5" />
              )}
              Busca Automática via Receita Federal
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange('tipoPessoa', 'PJ')}
            className={cn(
              'px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2',
              isPJ
                ? 'bg-white shadow-sm text-slate-800 border border-slate-200'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            <Building className="w-4 h-4" /> Pessoa Jurídica
          </button>
          <button
            type="button"
            onClick={() => onChange('tipoPessoa', 'PF')}
            className={cn(
              'px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2',
              !isPJ
                ? 'bg-white shadow-sm text-slate-800 border border-slate-200'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            <User className="w-4 h-4" /> Pessoa Física
          </button>
        </div>
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          <Label className="text-sm font-semibold cursor-pointer">Ativo</Label>
          <Switch
            checked={data.ativo !== false}
            onCheckedChange={(v) => onChange('ativo', v)}
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <LabelT l={isPJ ? 'CNPJ' : 'CPF'} req />
          <div className="flex gap-2">
            <Input
              value={data.documento || ''}
              onChange={(e) => onChange('documento', e.target.value)}
              disabled={readOnly}
              className={cn('font-mono bg-white', err('documento'))}
            />
            {!readOnly && isPJ && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSearchDoc}
                disabled={loadingCnpj}
                className="shrink-0 text-blue-600 hover:text-blue-700 bg-blue-50 border-blue-200"
              >
                {loadingCnpj ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <LabelT l={isPJ ? 'Razão Social' : 'Nome Completo'} req />
          <Input
            value={data.nomeRazao || ''}
            onChange={(e) => onChange('nomeRazao', e.target.value)}
            disabled={readOnly}
            className={cn('bg-white', err('nomeRazao'))}
          />
        </div>
        {isPJ ? (
          <div className="space-y-1.5">
            <LabelT l="Nome Fantasia" />
            <Input
              value={data.fantasia || ''}
              onChange={(e) => onChange('fantasia', e.target.value)}
              disabled={readOnly}
              className="bg-white"
            />
          </div>
        ) : (
          <div className="hidden md:block"></div>
        )}

        {isPJ && (
          <>
            <div className="space-y-1.5">
              <LabelT l="Inscrição Estadual (IE)" />
              <Input
                value={data.ie || ''}
                onChange={(e) => onChange('ie', e.target.value)}
                disabled={readOnly}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <LabelT l="Inscrição Municipal (IM)" />
              <Input
                value={data.im || ''}
                onChange={(e) => onChange('im', e.target.value)}
                disabled={readOnly}
                className="bg-white"
              />
            </div>
          </>
        )}
        <div className="space-y-1.5">
          <LabelT l={isPJ ? 'Data de Abertura' : 'Data de Nascimento'} />
          <Input
            type="date"
            value={isPJ ? data.dataAbertura || '' : data.dataNascimento || ''}
            onChange={(e) => onChange(isPJ ? 'dataAbertura' : 'dataNascimento', e.target.value)}
            disabled={readOnly}
            className="bg-white"
          />
        </div>
        <div className="space-y-1.5 md:col-span-3 lg:col-span-1">
          <LabelT l="Segmento de Atuação" />
          {showNewSeg && !readOnly ? (
            <div className="flex gap-2 animate-in fade-in">
              <Input
                autoFocus
                value={newSeg}
                onChange={(e) => setNewSeg(e.target.value)}
                placeholder="Novo segmento"
                className="bg-white"
              />
              <Button
                type="button"
                onClick={handleAddSegment}
                className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
              >
                Salvar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewSeg(false)}
                className="shrink-0"
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Select
              value={data.segmento}
              onValueChange={(v) => {
                if (v === 'ADD_NEW') setShowNewSeg(true)
                else onChange('segmento', v)
              }}
              disabled={readOnly}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {segments.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
                {!readOnly && (
                  <SelectItem
                    value="ADD_NEW"
                    className="text-blue-600 font-bold bg-blue-50/50 mt-1 cursor-pointer"
                  >
                    + Adicionar Novo Segmento
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  )
}

export function CompanyContatoTab({ data, onChange, readOnly }: any) {
  const pessoas = data?.pessoas || []

  const addPessoa = () =>
    onChange('pessoas', [
      ...pessoas,
      { id: Date.now(), nome: '', cargo: '', email: '', telefone: '' },
    ])
  const removePessoa = (i: number) =>
    onChange(
      'pessoas',
      pessoas.filter((_: any, idx: number) => idx !== i),
    )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
        <div>
          <h4 className="font-semibold text-blue-900 text-sm mb-1 flex items-center gap-2">
            <Users className="w-4 h-4" /> Pessoas de Contato Estratégico ({pessoas.length})
          </h4>
          <p className="text-xs text-blue-800/80">
            Cadastre os responsáveis pelo relacionamento em diferentes áreas.
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
