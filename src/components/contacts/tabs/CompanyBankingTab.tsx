import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Wallet, CreditCard, ShieldAlert, Clock } from 'lucide-react'
import { LabelT } from './CompanyTabs'
import useSecurityStore from '@/stores/useSecurityStore'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function CompanyBankingTab({ data, onChange, readOnly }: any) {
  const { isAdminMode } = useSecurityStore()
  const { toast } = useToast()

  const limitData = data?.financeiro || {}
  const contas = data?.bancario?.contas || []
  const pixKeys = data?.bancario?.pix || []

  const updateFin = (field: string, value: any) => {
    if (isAdminMode) {
      onChange('financeiro', {
        ...limitData,
        [field]: value,
        [`pending${field.charAt(0).toUpperCase() + field.slice(1)}`]: null,
      })
    } else {
      onChange('financeiro', {
        ...limitData,
        [`pending${field.charAt(0).toUpperCase() + field.slice(1)}`]: value,
      })
      toast({
        title: 'Aprovação Necessária',
        description: 'Sua permissão é Operacional. Alteração enviada para aprovação.',
      })
    }
  }

  const approveChange = (field: string) => {
    const pendingVal = limitData[`pending${field.charAt(0).toUpperCase() + field.slice(1)}`]
    if (pendingVal !== null && pendingVal !== undefined) {
      onChange('financeiro', {
        ...limitData,
        [field]: pendingVal,
        [`pending${field.charAt(0).toUpperCase() + field.slice(1)}`]: null,
      })
      toast({ title: 'Aprovado', description: 'Valor atualizado.' })
    }
  }

  const addConta = () =>
    onChange('bancario', {
      ...data.bancario,
      contas: [...contas, { banco: '', tipo: 'Corrente', agencia: '', conta: '' }],
    })
  const removeConta = (i: number) =>
    onChange('bancario', {
      ...data.bancario,
      contas: contas.filter((_: any, idx: number) => idx !== i),
    })
  const addPix = () =>
    onChange('bancario', { ...data.bancario, pix: [...pixKeys, { tipo: 'CNPJ', chave: '' }] })
  const removePix = (i: number) =>
    onChange('bancario', {
      ...data.bancario,
      pix: pixKeys.filter((_: any, idx: number) => idx !== i),
    })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-blue-50/80 border border-blue-200 text-blue-800 p-4 rounded-xl flex gap-3 items-start text-sm shadow-sm">
        <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900">Governança Financeira (RBAC)</p>
          <p className="leading-relaxed text-blue-800 mt-1">
            Você está operando como{' '}
            <span className="font-bold">{isAdminMode ? 'Administrador' : 'Operacional'}</span>.
            {isAdminMode
              ? ' Mudanças de Limite e Prazo aplicam-se imediatamente.'
              : ' Mudanças de Limite e Prazo requerem aprovação.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={cn(
            'space-y-1.5 p-4 rounded-xl shadow-sm transition-all',
            limitData.pendingLimite
              ? 'bg-amber-50/50 border-2 border-amber-200'
              : 'bg-white border border-slate-200',
          )}
        >
          <div className="flex justify-between items-center mb-1.5">
            <LabelT l="Limite de Crédito Ativo (R$)" />
            {limitData.pendingLimite && !isAdminMode && (
              <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Aguardando
              </span>
            )}
          </div>
          <Input
            value={
              limitData.pendingLimite !== null && limitData.pendingLimite !== undefined
                ? limitData.pendingLimite
                : limitData.limiteCredito || ''
            }
            onChange={(e) => updateFin('limiteCredito', e.target.value)}
            disabled={readOnly}
            className={cn(
              limitData.pendingLimite
                ? 'border-amber-300 font-bold text-amber-700'
                : 'font-semibold',
            )}
            placeholder="0,00"
          />
          {limitData.pendingLimite && isAdminMode && (
            <div className="mt-3 flex items-center justify-between bg-amber-100/50 p-2 rounded-lg border border-amber-200">
              <span className="text-xs text-amber-800 font-bold">
                Novo: R$ {limitData.pendingLimite}
              </span>
              <Button
                size="sm"
                onClick={() => approveChange('limiteCredito')}
                className="h-7 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                Aprovar
              </Button>
            </div>
          )}
        </div>
        <div
          className={cn(
            'space-y-1.5 p-4 rounded-xl shadow-sm transition-all',
            limitData.pendingPrazo
              ? 'bg-amber-50/50 border-2 border-amber-200'
              : 'bg-white border border-slate-200',
          )}
        >
          <div className="flex justify-between items-center mb-1.5">
            <LabelT l="Prazo de Pagamento Padrão (dias)" />
            {limitData.pendingPrazo && !isAdminMode && (
              <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Aguardando
              </span>
            )}
          </div>
          <Input
            type="number"
            value={
              limitData.pendingPrazo !== null && limitData.pendingPrazo !== undefined
                ? limitData.pendingPrazo
                : limitData.prazoPagamento || ''
            }
            onChange={(e) => updateFin('prazoPagamento', e.target.value)}
            disabled={readOnly}
            className={cn(
              limitData.pendingPrazo
                ? 'border-amber-300 font-bold text-amber-700'
                : 'font-semibold',
            )}
            placeholder="30"
          />
          {limitData.pendingPrazo && isAdminMode && (
            <div className="mt-3 flex items-center justify-between bg-amber-100/50 p-2 rounded-lg border border-amber-200">
              <span className="text-xs text-amber-800 font-bold">
                Novo: {limitData.pendingPrazo} dias
              </span>
              <Button
                size="sm"
                onClick={() => approveChange('prazoPagamento')}
                className="h-7 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                Aprovar
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" /> Contas Bancárias ({contas.length})
          </h3>
          {!readOnly && (
            <Button variant="outline" size="sm" onClick={addConta}>
              <Plus className="w-4 h-4 mr-2" /> Nova Conta
            </Button>
          )}
        </div>
        {contas.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-100">
            Nenhum dado bancário.
          </div>
        ) : (
          <div className="space-y-3">
            {contas.map((c: any, i: number) => (
              <div
                key={i}
                className="flex flex-wrap items-end gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100"
              >
                <div className="flex-1 min-w-[150px]">
                  <LabelT l="Banco" />
                  <Select
                    value={c.banco}
                    disabled={readOnly}
                    onValueChange={(v) => {
                      const nc = [...contas]
                      nc[i].banco = v
                      onChange('bancario', { ...data.bancario, contas: nc })
                    }}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Itaú (341)">Itaú (341)</SelectItem>
                      <SelectItem value="Bradesco (237)">Bradesco (237)</SelectItem>
                      <SelectItem value="Banco do Brasil (001)">Banco do Brasil (001)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[120px]">
                  <LabelT l="Tipo" />
                  <Select
                    value={c.tipo}
                    disabled={readOnly}
                    onValueChange={(v) => {
                      const nc = [...contas]
                      nc[i].tipo = v
                      onChange('bancario', { ...data.bancario, contas: nc })
                    }}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Corrente">Corrente</SelectItem>
                      <SelectItem value="Poupança">Poupança</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[100px]">
                  <LabelT l="Agência" />
                  <Input
                    value={c.agencia}
                    onChange={(e) => {
                      const nc = [...contas]
                      nc[i].agencia = e.target.value
                      onChange('bancario', { ...data.bancario, contas: nc })
                    }}
                    disabled={readOnly}
                    className="bg-white"
                  />
                </div>
                <div className="w-[140px]">
                  <LabelT l="Conta" />
                  <Input
                    value={c.conta}
                    onChange={(e) => {
                      const nc = [...contas]
                      nc[i].conta = e.target.value
                      onChange('bancario', { ...data.bancario, contas: nc })
                    }}
                    disabled={readOnly}
                    className="bg-white"
                  />
                </div>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeConta(i)}
                    className="text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" /> Chaves PIX ({pixKeys.length})
          </h3>
          {!readOnly && (
            <Button variant="outline" size="sm" onClick={addPix}>
              <Plus className="w-4 h-4 mr-2" /> Novo PIX
            </Button>
          )}
        </div>
        {pixKeys.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-100">
            Nenhuma chave PIX.
          </div>
        ) : (
          <div className="space-y-3">
            {pixKeys.map((p: any, i: number) => (
              <div
                key={i}
                className="flex flex-wrap items-end gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100"
              >
                <div className="w-[150px]">
                  <LabelT l="Tipo de Chave" />
                  <Select
                    value={p.tipo}
                    disabled={readOnly}
                    onValueChange={(v) => {
                      const np = [...pixKeys]
                      np[i].tipo = v
                      onChange('bancario', { ...data.bancario, pix: np })
                    }}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CNPJ">CNPJ/CPF</SelectItem>
                      <SelectItem value="Email">E-mail</SelectItem>
                      <SelectItem value="Telefone">Telefone</SelectItem>
                      <SelectItem value="Aleatoria">Aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <LabelT l="Chave" />
                  <Input
                    value={p.chave}
                    onChange={(e) => {
                      const np = [...pixKeys]
                      np[i].chave = e.target.value
                      onChange('bancario', { ...data.bancario, pix: np })
                    }}
                    disabled={readOnly}
                    className="bg-white font-mono"
                  />
                </div>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePix(i)}
                    className="text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
