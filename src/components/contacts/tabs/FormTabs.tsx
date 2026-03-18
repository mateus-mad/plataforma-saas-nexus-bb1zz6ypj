import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, AlertCircle } from 'lucide-react'

const F = ({ l, v, onChange, disabled }: any) => (
  <div className="space-y-1.5">
    <Label className="font-semibold text-slate-700">{l}</Label>
    <Input
      value={v || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="shadow-sm"
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <F l="CEP" v={data.cep} onChange={(v: string) => onChange('cep', v)} disabled={readOnly} />
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <F
        l="Matrícula Interna"
        v={data.matricula}
        onChange={(v: string) => onChange('matricula', v)}
        disabled={readOnly}
      />
      <F
        l="Cargo"
        v={data.cargo}
        onChange={(v: string) => onChange('cargo', v)}
        disabled={readOnly}
      />
      <F
        l="Setor / Departamento"
        v={data.setor}
        onChange={(v: string) => onChange('setor', v)}
        disabled={readOnly}
      />
      <F
        l="Data de Admissão"
        v={data.admissao}
        onChange={(v: string) => onChange('admissao', v)}
        disabled={readOnly}
      />
    </div>
  )
}

export function SalaryTab({ data, onChange, readOnly }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <F
        l="Salário Base"
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <F
        l="Desconto INSS"
        v={data.inss}
        onChange={(v: string) => onChange('inss', v)}
        disabled={readOnly}
      />
      <F
        l="Depósito FGTS"
        v={data.fgts}
        onChange={(v: string) => onChange('fgts', v)}
        disabled={readOnly}
      />
      <F
        l="Retenção IRRF"
        v={data.irrf}
        onChange={(v: string) => onChange('irrf', v)}
        disabled={readOnly}
      />
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
