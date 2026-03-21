import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CheckCircle2,
  AlertCircle,
  Search,
  Loader2,
  Plus,
  CalendarIcon,
  Briefcase,
  Calculator,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { consultarCEP } from '@/services/cep'
import { useToast } from '@/hooks/use-toast'
import { getConfigurations, createConfiguration } from '@/services/configurations'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const F = ({ l, v, onChange, disabled, type = 'text' }: any) => (
  <div className="space-y-1.5">
    <Label className="font-semibold text-slate-700">{l}</Label>
    <Input
      type={type}
      value={v || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="shadow-sm bg-white"
    />
  </div>
)

export function DocsTab({ data, onChange, readOnly }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {data.compliance?.status === 'valid' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Compliance Validado</h4>
            <p className="text-sm">Documentos autênticos e regulares nas bases públicas.</p>
          </div>
        </div>
      )}
      {data.compliance?.status === 'invalid' && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Atenção: Discrepância de Compliance</h4>
            <p className="text-sm">{data.compliance.message}</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <F l="CPF" v={data.cpf} onChange={(v: string) => onChange('cpf', v)} disabled={readOnly} />
        <F
          l="Tipo Documento"
          v={data.docType}
          onChange={(v: string) => onChange('docType', v)}
          disabled={readOnly}
        />
        <F
          l="Data de Emissão"
          type="date"
          v={data.docIssueDate}
          onChange={(v: string) => onChange('docIssueDate', v)}
          disabled={readOnly}
        />
        <F
          l="PIS/PASEP"
          v={data.pis}
          onChange={(v: string) => onChange('pis', v)}
          disabled={readOnly}
        />
      </div>
    </div>
  )
}

export function AddressTab({ data, onChange, readOnly }: any) {
  const [loadingCep, setLoadingCep] = useState(false)
  const { toast } = useToast()

  const handleCepSearch = async () => {
    if (!data.cep || data.cep.replace(/\D/g, '').length !== 8) {
      toast({
        variant: 'destructive',
        title: 'CEP inválido',
        description: 'Digite um CEP válido com 8 dígitos.',
      })
      return
    }
    setLoadingCep(true)
    const res = await consultarCEP(data.cep)
    setLoadingCep(false)

    if (res.error) {
      toast({ variant: 'destructive', title: 'Erro', description: res.message })
    } else {
      onChange('logradouro', res.data.logradouro)
      onChange('bairro', res.data.bairro)
      onChange('cidade', res.data.localidade)
      onChange('estado', res.data.uf)
      toast({ title: 'Sucesso', description: 'Endereço preenchido automaticamente.' })
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-1.5">
        <Label className="font-semibold text-slate-700">CEP</Label>
        <div className="flex gap-2">
          <Input
            value={data.cep || ''}
            onChange={(e) => onChange('cep', e.target.value)}
            disabled={readOnly}
            className="bg-white shadow-sm"
          />
          {!readOnly && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleCepSearch}
              disabled={loadingCep}
              className="shrink-0"
            >
              {loadingCep ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-1.5 sm:col-span-2 text-sm">
        <Label className="font-semibold text-slate-700">Visualização do Endereço</Label>
        <div className="w-full h-10 border border-slate-200 rounded-md bg-slate-50 flex items-center px-3 text-slate-500 truncate">
          {data.logradouro
            ? `${data.logradouro}, ${data.numero || 'S/N'} - ${data.bairro || ''} - ${data.cidade || ''}/${data.estado || ''}`
            : 'Endereço incompleto'}
        </div>
      </div>
      <F
        l="Logradouro"
        v={data.logradouro}
        onChange={(v: string) => onChange('logradouro', v)}
        disabled={readOnly}
      />
      <F
        l="Número"
        v={data.numero}
        onChange={(v: string) => onChange('numero', v)}
        disabled={readOnly}
      />
      <F
        l="Complemento"
        v={data.comp}
        onChange={(v: string) => onChange('comp', v)}
        disabled={readOnly}
      />
      <F
        l="Bairro"
        v={data.bairro}
        onChange={(v: string) => onChange('bairro', v)}
        disabled={readOnly}
      />
      <F
        l="Cidade"
        v={data.cidade}
        onChange={(v: string) => onChange('cidade', v)}
        disabled={readOnly}
      />
      <F
        l="Estado (UF)"
        v={data.estado}
        onChange={(v: string) => onChange('estado', v)}
        disabled={readOnly}
      />
    </div>
  )
}

export function ContactTab({ data, onChange, readOnly }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <F
        l="Telefone Principal"
        v={data.telPrinc}
        onChange={(v: string) => onChange('telPrinc', v)}
        disabled={readOnly}
      />
      <F
        l="WhatsApp"
        v={data.whatsapp}
        onChange={(v: string) => onChange('whatsapp', v)}
        disabled={readOnly}
      />
      <F
        l="Email Institucional"
        v={data.email}
        onChange={(v: string) => onChange('email', v)}
        disabled={readOnly}
      />
    </div>
  )
}

export function WorkTab({ data, onChange, readOnly }: any) {
  const [cargos, setCargos] = useState<any[]>([])
  const [setores, setSetores] = useState<any[]>([])
  const [jornadas, setJornadas] = useState<any[]>([])

  const [newCargo, setNewCargo] = useState('')
  const [newSetor, setNewSetor] = useState('')
  const [addingCargo, setAddingCargo] = useState(false)
  const [addingSetor, setAddingSetor] = useState(false)

  useEffect(() => {
    getConfigurations('cargo')
      .then(setCargos)
      .catch(() => {})
    getConfigurations('setor')
      .then(setSetores)
      .catch(() => {})
    getConfigurations('jornada')
      .then(setJornadas)
      .catch(() => {})
  }, [])

  const handleAddCargo = async () => {
    if (newCargo.trim()) {
      const c = await createConfiguration({ name: newCargo.trim(), type: 'cargo' })
      setCargos([...cargos, c])
      onChange('cargo', c.name)
      setNewCargo('')
      setAddingCargo(false)
    }
  }

  const handleAddSetor = async () => {
    if (newSetor.trim()) {
      const c = await createConfiguration({ name: newSetor.trim(), type: 'setor' })
      setSetores([...setores, c])
      onChange('setor', c.name)
      setNewSetor('')
      setAddingSetor(false)
    }
  }

  const generateMatricula = () => {
    onChange('matricula', Math.floor(100000 + Math.random() * 900000).toString())
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-6">
        <h4 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Briefcase className="w-4 h-4 text-blue-500" /> Posicionamento
        </h4>
        <div className="space-y-1.5">
          <Label className="font-semibold text-slate-700">Matrícula Interna</Label>
          <div className="flex gap-2">
            <Input
              value={data.matricula || ''}
              onChange={(e) => onChange('matricula', e.target.value)}
              disabled={readOnly}
              className="bg-white shadow-sm font-mono"
            />
            {!readOnly && (
              <Button variant="outline" onClick={generateMatricula} className="shrink-0 bg-white">
                Gerar
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="font-semibold text-slate-700">Setor / Departamento</Label>
          {addingSetor && !readOnly ? (
            <div className="flex gap-2">
              <Input
                autoFocus
                value={newSetor}
                onChange={(e) => setNewSetor(e.target.value)}
                placeholder="Novo setor..."
                className="bg-white"
              />
              <Button
                onClick={handleAddSetor}
                size="sm"
                className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Salvar
              </Button>
              <Button
                onClick={() => setAddingSetor(false)}
                size="sm"
                variant="outline"
                className="shrink-0 bg-white"
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Select
              value={data.setor}
              onValueChange={(v) => {
                if (v === 'ADD') setAddingSetor(true)
                else onChange('setor', v)
              }}
              disabled={readOnly}
            >
              <SelectTrigger className="bg-white shadow-sm">
                <SelectValue placeholder="Selecione um setor..." />
              </SelectTrigger>
              <SelectContent>
                {setores.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
                {!readOnly && (
                  <SelectItem
                    value="ADD"
                    className="text-blue-600 font-bold bg-blue-50 mt-1 cursor-pointer"
                  >
                    + Adicionar Novo Setor
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="font-semibold text-slate-700">Cargo</Label>
          {addingCargo && !readOnly ? (
            <div className="flex gap-2">
              <Input
                autoFocus
                value={newCargo}
                onChange={(e) => setNewCargo(e.target.value)}
                placeholder="Novo cargo..."
                className="bg-white"
              />
              <Button
                onClick={handleAddCargo}
                size="sm"
                className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Salvar
              </Button>
              <Button
                onClick={() => setAddingCargo(false)}
                size="sm"
                variant="outline"
                className="shrink-0 bg-white"
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Select
              value={data.cargo}
              onValueChange={(v) => {
                if (v === 'ADD') setAddingCargo(true)
                else onChange('cargo', v)
              }}
              disabled={readOnly}
            >
              <SelectTrigger className="bg-white shadow-sm">
                <SelectValue placeholder="Selecione um cargo..." />
              </SelectTrigger>
              <SelectContent>
                {cargos.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
                {!readOnly && (
                  <SelectItem
                    value="ADD"
                    className="text-blue-600 font-bold bg-blue-50 mt-1 cursor-pointer"
                  >
                    + Adicionar Novo Cargo
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
        </div>
        <F
          l="Sindicato Vinculado"
          v={data.sindicato}
          onChange={(v: string) => onChange('sindicato', v)}
          disabled={readOnly}
        />
      </div>

      <div className="space-y-6">
        <h4 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
          <CalendarIcon className="w-4 h-4 text-blue-500" /> Contrato e Jornada
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <F
            l="Data de Admissão"
            type="date"
            v={data.admissao}
            onChange={(v: string) => onChange('admissao', v)}
            disabled={readOnly}
          />
          <F
            l="Exame Admissional"
            type="date"
            v={data.exameAdmissional}
            onChange={(v: string) => onChange('exameAdmissional', v)}
            disabled={readOnly}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-semibold text-slate-700">Tipo de Contrato</Label>
            <Select
              value={data.contrato}
              onValueChange={(v) => onChange('contrato', v)}
              disabled={readOnly}
            >
              <SelectTrigger className="bg-white shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLT">CLT</SelectItem>
                <SelectItem value="PJ">PJ / Terceiro</SelectItem>
                <SelectItem value="Estágio">Estágio</SelectItem>
                <SelectItem value="Jovem Aprendiz">Jovem Aprendiz</SelectItem>
                <SelectItem value="Temporário">Temporário</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="font-semibold text-slate-700">Jornada</Label>
            <Select
              value={data.jornada}
              onValueChange={(v) => onChange('jornada', v)}
              disabled={readOnly}
            >
              <SelectTrigger className="bg-white shadow-sm">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {jornadas.map((j) => (
                  <SelectItem key={j.id} value={j.name}>
                    {j.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-semibold text-slate-700">Turno</Label>
            <Select
              value={data.turno}
              onValueChange={(v) => onChange('turno', v)}
              disabled={readOnly}
            >
              <SelectTrigger className="bg-white shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manhã">Manhã</SelectItem>
                <SelectItem value="Tarde">Tarde</SelectItem>
                <SelectItem value="Noite">Noite</SelectItem>
                <SelectItem value="Revezamento">Revezamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <F
            l="Horas Semanais"
            type="number"
            v={data.horas}
            onChange={(v: string) => onChange('horas', v)}
            disabled={readOnly}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <F
            l="Período Experiência (Dias)"
            type="number"
            v={data.experienciaDias}
            onChange={(v: string) => onChange('experienciaDias', v)}
            disabled={readOnly}
          />
          <F
            l="Fim da Experiência"
            type="date"
            v={data.experienciaFim}
            onChange={() => {}}
            disabled={true}
          />
        </div>
      </div>
    </div>
  )
}

export function SalaryTab({ data, onChange, readOnly }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-6">
        <div className="space-y-4">
          <F
            l="Salário Base (R$)"
            v={data.base}
            onChange={(v: string) => onChange('base', v)}
            disabled={readOnly}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-semibold text-slate-700">Tipo de Salário</Label>
              <Select
                value={data.tipoSalario}
                onValueChange={(v) => onChange('tipoSalario', v)}
                disabled={readOnly}
              >
                <SelectTrigger className="bg-white shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mensalista">Mensalista</SelectItem>
                  <SelectItem value="Quinzenalista">Quinzenalista</SelectItem>
                  <SelectItem value="Horista">Horista</SelectItem>
                  <SelectItem value="Diarista">Diarista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-semibold text-slate-700">Forma Pagamento</Label>
              <Select
                value={data.formaPagamento}
                onValueChange={(v) => onChange('formaPagamento', v)}
                disabled={readOnly}
              >
                <SelectTrigger className="bg-white shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="TED/DOC">TED / DOC</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h4 className="font-semibold text-slate-800 mb-2">Dados Bancários</h4>
          <F
            l="Banco"
            v={data.banco}
            onChange={(v: string) => onChange('banco', v)}
            disabled={readOnly}
          />
          <div className="grid grid-cols-2 gap-4">
            <F
              l="Agência"
              v={data.agConta}
              onChange={(v: string) => onChange('agConta', v)}
              disabled={readOnly}
            />
            <F
              l="Conta Corrente"
              v={data.conta}
              onChange={(v: string) => onChange('conta', v)}
              disabled={readOnly}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-slate-800">Comissões e Metas</h4>
            <p className="text-xs text-slate-500">
              Configure comissões variáveis atreladas ao perfil.
            </p>
          </div>
          <Switch
            checked={data.temComissao}
            onCheckedChange={(v) => onChange('temComissao', v)}
            disabled={readOnly}
          />
        </div>

        {data.temComissao && (
          <div className="space-y-4 animate-in fade-in">
            <F
              l="Percentual Base (%)"
              v={data.comissaoPercent}
              onChange={(v: string) => onChange('comissaoPercent', v)}
              disabled={readOnly}
            />
            <F
              l="Valor Fixo por Meta (R$)"
              v={data.comissaoBase}
              onChange={(v: string) => onChange('comissaoBase', v)}
              disabled={readOnly}
            />
            <F
              l="Meta Mensal Padrão"
              v={data.comissaoMeta}
              onChange={(v: string) => onChange('comissaoMeta', v)}
              disabled={readOnly}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export function BenefitsTab({ data, onChange, readOnly }: any) {
  const benefits = [
    { id: 'vt', label: 'Vale Transporte' },
    { id: 'va', label: 'Vale Alimentação' },
    { id: 'vr', label: 'Vale Refeição' },
    { id: 'saude', label: 'Plano de Saúde' },
    { id: 'odonto', label: 'Plano Odontológico' },
    { id: 'combustivel', label: 'Auxílio Combustível' },
    { id: 'vida', label: 'Seguro de Vida' },
    { id: 'creche', label: 'Auxílio Creche' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm shadow-sm">
        <p>
          Selecione os benefícios garantidos por contrato. Valores específicos são gerenciados no
          módulo de folha.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between p-4 border border-slate-200 rounded-xl shadow-sm bg-white hover:border-blue-300 transition-colors"
          >
            <Label
              className="font-semibold text-slate-700 cursor-pointer w-full"
              onClick={() => !readOnly && onChange(b.id, !data[b.id])}
            >
              {b.label}
            </Label>
            <Switch
              checked={!!data[b.id]}
              onCheckedChange={(v) => onChange(b.id, v)}
              disabled={readOnly}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChargesTab({ data, onChange, readOnly }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm shadow-sm flex items-start gap-3">
        <Calculator className="w-5 h-5 shrink-0 mt-0.5" />
        <p>
          Os encargos são projetados automaticamente com base no Salário Base (Tabela Vigente).
          Preencha manualmente apenas para ajustes pontuais.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 border-t-4 border-t-amber-400">
          <h4 className="font-bold text-slate-800 text-sm">INSS (Estimado)</h4>
          <Input
            value={data.inss}
            onChange={(e) => onChange('inss', e.target.value)}
            disabled={readOnly}
            className="font-mono text-amber-700 font-bold bg-slate-50"
          />
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 border-t-4 border-t-rose-400">
          <h4 className="font-bold text-slate-800 text-sm">IRRF (Estimado)</h4>
          <Input
            value={data.irrf}
            onChange={(e) => onChange('irrf', e.target.value)}
            disabled={readOnly}
            className="font-mono text-rose-700 font-bold bg-slate-50"
          />
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 border-t-4 border-t-emerald-400">
          <h4 className="font-bold text-slate-800 text-sm">FGTS (Depósito 8%)</h4>
          <Input
            value={data.fgts}
            onChange={(e) => onChange('fgts', e.target.value)}
            disabled={readOnly}
            className="font-mono text-emerald-700 font-bold bg-slate-50"
          />
        </div>
      </div>
    </div>
  )
}

export function VacationTab({ data, onChange, readOnly }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm shadow-sm text-slate-600">
        O período aquisitivo é calculado automaticamente com base na Data de Admissão inserida na
        aba de Trabalho.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <F
          l="Início Aquisitivo Atual"
          type="date"
          v={data.inicio}
          onChange={(v: string) => onChange('inicio', v)}
          disabled={readOnly}
        />
        <F
          l="Fim Aquisitivo Atual"
          type="date"
          v={data.fim}
          onChange={(v: string) => onChange('fim', v)}
          disabled={readOnly}
        />
        <F
          l="Próximo Vencimento"
          type="date"
          v={data.proximoVencimento}
          onChange={(v: string) => onChange('proximoVencimento', v)}
          disabled={readOnly}
        />
        <F
          l="Dias de Direito Restantes"
          v={data.direito}
          onChange={(v: string) => onChange('direito', v)}
          disabled={readOnly}
        />
      </div>
    </div>
  )
}
