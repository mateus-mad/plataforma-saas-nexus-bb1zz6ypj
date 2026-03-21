import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, AlertCircle, Search, Loader2, Plus } from 'lucide-react'
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
import { cn } from '@/lib/utils'

const F = ({ l, v, onChange, disabled }: any) => (
  <div className="space-y-1.5">
    <Label className="font-semibold text-slate-700">{l}</Label>
    <Input
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <F
        l="Matrícula Interna"
        v={data.matricula}
        onChange={(v: string) => onChange('matricula', v)}
        disabled={readOnly}
      />

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
              className="shrink-0"
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
              className="shrink-0"
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

      <F
        l="Data de Admissão"
        v={data.admissao}
        onChange={(v: string) => onChange('admissao', v)}
        disabled={readOnly}
      />
      <F
        l="Tipo de Contrato"
        v={data.contrato}
        onChange={(v: string) => onChange('contrato', v)}
        disabled={readOnly}
      />
      <F
        l="Horas Semanais"
        v={data.horas}
        onChange={(v: string) => onChange('horas', v)}
        disabled={readOnly}
      />
    </div>
  )
}

export function SalaryTab({ data, onChange, readOnly }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <F
        l="Salário Base (R$)"
        v={data.base}
        onChange={(v: string) => onChange('base', v)}
        disabled={readOnly}
      />
      <F
        l="Banco"
        v={data.banco}
        onChange={(v: string) => onChange('banco', v)}
        disabled={readOnly}
      />
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
      <F
        l="Frequência Pagamento"
        v={data.frequencia}
        onChange={(v: string) => onChange('frequencia', v)}
        disabled={readOnly}
      />
      <F
        l="Comissões (Regras)"
        v={data.comissoes}
        onChange={(v: string) => onChange('comissoes', v)}
        disabled={readOnly}
      />
    </div>
  )
}

export function BenefitsTab({ data, onChange, readOnly }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <F
        l="Plano de Saúde"
        v={data.saude}
        onChange={(v: string) => onChange('saude', v)}
        disabled={readOnly}
      />
      <F
        l="Vale Transporte"
        v={data.vt}
        onChange={(v: string) => onChange('vt', v)}
        disabled={readOnly}
      />
      <F
        l="Vale Refeição / Alimentação"
        v={data.vr}
        onChange={(v: string) => onChange('vr', v)}
        disabled={readOnly}
      />
    </div>
  )
}

export function ChargesTab({ data, onChange, readOnly }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm shadow-sm">
        <p>
          Os encargos são calculados automaticamente com base no Salário Base (Tabela INSS/IRRF
          Vigente). Preencha manualmente apenas para ajustes.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <F
          l="Desconto INSS Estimado"
          v={data.inss}
          onChange={(v: string) => onChange('inss', v)}
          disabled={readOnly}
        />
        <F
          l="Depósito FGTS Estimado"
          v={data.fgts}
          onChange={(v: string) => onChange('fgts', v)}
          disabled={readOnly}
        />
        <F
          l="Retenção IRRF Estimada"
          v={data.irrf}
          onChange={(v: string) => onChange('irrf', v)}
          disabled={readOnly}
        />
      </div>
    </div>
  )
}

export function VacationTab({ data, onChange, readOnly }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <F
        l="Início Período Aquisitivo"
        v={data.inicio}
        onChange={(v: string) => onChange('inicio', v)}
        disabled={readOnly}
      />
      <F
        l="Fim Período Aquisitivo"
        v={data.fim}
        onChange={(v: string) => onChange('fim', v)}
        disabled={readOnly}
      />
      <F
        l="Dias de Direito Restantes"
        v={data.direito}
        onChange={(v: string) => onChange('direito', v)}
        disabled={readOnly}
      />
    </div>
  )
}
