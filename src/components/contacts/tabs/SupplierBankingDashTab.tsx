import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Wallet, CreditCard, Plus, Trash2, DollarSign, CalendarDays } from 'lucide-react'

export default function SupplierBankingDashTab({ data, updateData }: any) {
  const f = data?.financeiro || {}
  const b = data?.bancario || { contas: [], pix: [] }

  const addC = () =>
    updateData('bancario', 'contas', [
      ...(b.contas || []),
      { id: Date.now(), banco: '', agencia: '', conta: '', tipo: 'Corrente' },
    ])
  const remC = (id: number) =>
    updateData(
      'bancario',
      'contas',
      b.contas.filter((c: any) => c.id !== id),
    )
  const addP = () =>
    updateData('bancario', 'pix', [...(b.pix || []), { id: Date.now(), tipo: 'CNPJ', chave: '' }])
  const remP = (id: number) =>
    updateData(
      'bancario',
      'pix',
      b.pix.filter((p: any) => p.id !== id),
    )

  const updateC = (id: number, field: string, val: string) =>
    updateData(
      'bancario',
      'contas',
      b.contas.map((x: any) => (x.id === id ? { ...x, [field]: val } : x)),
    )
  const updateP = (id: number, field: string, val: string) =>
    updateData(
      'bancario',
      'pix',
      b.pix.map((x: any) => (x.id === id ? { ...x, [field]: val } : x)),
    )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 font-bold text-emerald-900 uppercase tracking-wider text-xs">
            <DollarSign className="w-4 h-4" /> Limite de Crédito Ativo (R$)
          </Label>
          <Input
            value={f.limiteCredito || ''}
            onChange={(e) => updateData('financeiro', 'limiteCredito', e.target.value)}
            className="bg-white font-black text-2xl h-14 text-emerald-900 border-emerald-200 shadow-sm"
            placeholder="0,00"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 font-bold text-slate-700 uppercase tracking-wider text-xs">
            <CalendarDays className="w-4 h-4" /> Prazo de Pagamento Padrão (dias)
          </Label>
          <Input
            type="number"
            value={f.prazoPagamento || ''}
            onChange={(e) => updateData('financeiro', 'prazoPagamento', e.target.value)}
            className="bg-white font-bold text-xl h-14 text-slate-800 border-slate-200 shadow-sm"
            placeholder="Ex: 30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <Wallet className="w-5 h-5 text-blue-600" /> Contas Bancárias
              </h4>
              <p className="text-xs text-slate-500 mt-1">Contas para transferências TED/DOC.</p>
            </div>
            <Button size="sm" variant="outline" onClick={addC} className="bg-slate-50 shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Nova Conta
            </Button>
          </div>
          <div className="space-y-4 flex-1">
            {b.contas?.map((c: any) => (
              <div
                key={c.id}
                className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 relative group hover:border-blue-300 transition-colors"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remC(c.id)}
                  className="absolute right-2 top-2 h-8 w-8 text-rose-500 opacity-0 group-hover:opacity-100 bg-white shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="space-y-1 pr-8">
                  <Label className="text-xs text-slate-500">Banco / Instituição</Label>
                  <Input
                    placeholder="Nome ou Código do Banco (ex: Itaú - 341)"
                    value={c.banco}
                    onChange={(e) => updateC(c.id, 'banco', e.target.value)}
                    className="w-full bg-white font-medium"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs text-slate-500">Agência</Label>
                    <Input
                      placeholder="0000"
                      value={c.agencia}
                      onChange={(e) => updateC(c.id, 'agencia', e.target.value)}
                      className="bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1 flex-[2]">
                    <Label className="text-xs text-slate-500">Conta com Dígito</Label>
                    <Input
                      placeholder="00000-0"
                      value={c.conta}
                      onChange={(e) => updateC(c.id, 'conta', e.target.value)}
                      className="bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
            {(!b.contas || b.contas.length === 0) && (
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm">
                Nenhuma conta bancária cadastrada.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-purple-600" /> Chaves PIX
              </h4>
              <p className="text-xs text-slate-500 mt-1">Chaves diretas para pagamentos rápidos.</p>
            </div>
            <Button size="sm" variant="outline" onClick={addP} className="bg-slate-50 shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Nova Chave
            </Button>
          </div>
          <div className="space-y-4 flex-1">
            {b.pix?.map((p: any) => (
              <div
                key={p.id}
                className="flex flex-col gap-3 p-4 bg-purple-50/30 rounded-xl border border-purple-100 relative group hover:border-purple-300 transition-colors"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remP(p.id)}
                  className="absolute right-2 top-2 h-8 w-8 text-rose-500 opacity-0 group-hover:opacity-100 bg-white shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="space-y-1 pr-8">
                  <Label className="text-xs text-slate-500">Tipo de Chave</Label>
                  <Select value={p.tipo} onValueChange={(v) => updateP(p.id, 'tipo', v)}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Selecione o tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CNPJ">CNPJ / CPF</SelectItem>
                      <SelectItem value="Email">E-mail</SelectItem>
                      <SelectItem value="Celular">Celular</SelectItem>
                      <SelectItem value="Aleatoria">Chave Aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Valor da Chave</Label>
                  <Input
                    placeholder="Chave completa"
                    value={p.chave}
                    onChange={(e) => updateP(p.id, 'chave', e.target.value)}
                    className="w-full bg-white font-mono text-sm"
                  />
                </div>
              </div>
            ))}
            {(!b.pix || b.pix.length === 0) && (
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm">
                Nenhuma chave PIX cadastrada.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
