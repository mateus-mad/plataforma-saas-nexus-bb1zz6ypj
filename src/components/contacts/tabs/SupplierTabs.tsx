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
import { useState } from 'react'
import { Check, Plus, X, ShieldCheck, FileSearch } from 'lucide-react'

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

export function SupplierIdentificationTab({ data, updateData, validateCompliance }: any) {
  const [isAddingSegment, setIsAddingSegment] = useState(false)
  const [newSegment, setNewSegment] = useState('')
  const [segments, setSegments] = useState([
    'Tecnologia e Serviços',
    'Construção Civil',
    'Manufatura',
    'Logística',
  ])

  const handleAddSegment = () => {
    if (newSegment.trim()) {
      setSegments([...segments, newSegment])
      updateData('dados', 'segmento', newSegment)
      setNewSegment('')
      setIsAddingSegment(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Compliance e Regularidade Fiscal
          </h4>
          <p className="text-sm text-slate-500 mt-1">
            Status atual:{' '}
            {data.dados?.complianceStatus === 'valid' ? (
              <span className="text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                Validado (Sintegra/Receita)
              </span>
            ) : (
              <span className="text-amber-600 font-bold bg-amber-100 px-2 py-0.5 rounded">
                Verificação Pendente
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={validateCompliance}
          disabled={data.dados?.complianceStatus === 'valid'}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-semibold"
        >
          Validar em Bases Públicas
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <F
          l="Razão Social"
          v={data.dados?.nomeRazao}
          onChange={(v: string) => updateData('dados', 'nomeRazao', v)}
        />
        <F
          l="Nome Fantasia"
          v={data.dados?.fantasia}
          onChange={(v: string) => updateData('dados', 'fantasia', v)}
        />
        <F
          l="CNPJ"
          v={data.dados?.documento}
          onChange={(v: string) => updateData('dados', 'documento', v)}
        />
        <div className="space-y-1.5">
          <Label className="font-semibold text-slate-700">Segmento de Atuação</Label>
          {isAddingSegment ? (
            <div className="flex items-center gap-2">
              <Input
                value={newSegment}
                onChange={(e) => setNewSegment(e.target.value)}
                placeholder="Novo segmento..."
                autoFocus
                className="shadow-sm"
              />
              <Button
                size="icon"
                onClick={handleAddSegment}
                className="bg-emerald-600 hover:bg-emerald-700 shrink-0 shadow-sm"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsAddingSegment(false)}
                className="shrink-0 bg-white shadow-sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Select
                value={data.dados?.segmento || ''}
                onValueChange={(v) => updateData('dados', 'segmento', v)}
              >
                <SelectTrigger className="shadow-sm bg-white">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {segments.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsAddingSegment(true)}
                className="shrink-0 shadow-sm bg-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function SupplierContactsTab({ data, updateData }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <F
        l="Nome do Responsável"
        v={data.contato?.responsavel}
        onChange={(v: string) => updateData('contato', 'responsavel', v)}
      />
      <F
        l="Email Comercial"
        v={data.contato?.email}
        onChange={(v: string) => updateData('contato', 'email', v)}
      />
      <F
        l="Telefone Principal"
        v={data.contato?.telefone}
        onChange={(v: string) => updateData('contato', 'telefone', v)}
      />
      <F
        l="Email de Cobrança (Faturas)"
        v={data.contato?.emailCobranca}
        onChange={(v: string) => updateData('contato', 'emailCobranca', v)}
      />
    </div>
  )
}

export function SupplierFinancialDashTab({ data }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 shadow-sm font-medium">
        Integração Automática: O resumo financeiro do fornecedor é alimentado pelo módulo Financeiro
        em tempo real.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Limite de Crédito Ativo
          </p>
          <p className="text-2xl font-black text-slate-800">R$ {data.financeiro?.limiteCredito}</p>
        </div>
        <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Prazo de Pagamento Padrão
          </p>
          <p className="text-2xl font-black text-slate-800">
            {data.financeiro?.prazoPagamento} dias
          </p>
        </div>
        <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Total de Compras Realizadas
          </p>
          <p className="text-2xl font-black text-emerald-600">R$ 145.000,00</p>
        </div>
        <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Faturas Pendentes
          </p>
          <p className="text-2xl font-black text-rose-600">R$ 15.000,00</p>
        </div>
      </div>
    </div>
  )
}

export function SupplierBankingDashTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="border border-slate-200 rounded-xl bg-white shadow-sm p-6 text-center text-slate-500">
        Contas associadas para pagamento de faturas e transferências bancárias gerenciadas.
      </div>
    </div>
  )
}

export function SupplierAgreementsTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="border border-slate-200 rounded-xl bg-white shadow-sm p-6 text-center text-slate-500">
        Acordos de Nível de Serviço (SLA) firmados com este fornecedor.
      </div>
    </div>
  )
}

export function SupplierRelationshipTab({ data, updateData }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <h3 className="font-bold text-slate-800">Histórico de Relacionamento e Ocorrências</h3>
      <F
        l="Anotações Gerais"
        v={data.relacionamento?.observacoes}
        onChange={(v: string) => updateData('relacionamento', 'observacoes', v)}
      />
    </div>
  )
}

export function SupplierHistoryTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden overflow-x-auto p-6">
        <div className="font-semibold text-slate-700 text-sm flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
          <FileSearch className="w-5 h-5 text-slate-400" /> Registro de Atividades Recentes
        </div>
        <p className="text-sm text-slate-500">
          O sistema armazena automaticamente todas as atualizações de dados realizadas nesta ficha
          pelo time administrativo.
        </p>
      </div>
    </div>
  )
}
