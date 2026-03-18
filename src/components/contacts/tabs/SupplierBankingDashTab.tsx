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
import { Wallet, CreditCard, Plus, Trash2, DollarSign, Calendar } from 'lucide-react'

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-sm">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 font-bold text-blue-900">
            <DollarSign className="w-4 h-4" /> Limite de Crédito Ativo (R$)
          </Label>
          <Input
            value={f.limiteCredito || ''}
            onChange={(e) => updateData('financeiro', 'limiteCredito', e.target.value)}
            className="bg-white font-bold text-xl h-12 text-blue-900 border-blue-200"
            placeholder="0,00"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 font-bold text-blue-900">
            <Calendar className="w-4 h-4" /> Prazo de Pagamento Padrão (dias)
          </Label>
          <Input
            type="number"
            value={f.prazoPagamento || ''}
            onChange={(e) => updateData('financeiro', 'prazoPagamento', e.target.value)}
            className="bg-white font-bold text-xl h-12 text-blue-900 border-blue-200"
            placeholder="30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <Wallet className="w-5 h-5 text-emerald-600" /> Contas Bancárias
            </h4>
            <Button size="sm" variant="outline" onClick={addC} className="bg-slate-50">
              <Plus className="w-4 h-4 mr-1" /> Nova
            </Button>
          </div>
          <div className="space-y-3">
            {b.contas?.map((c: any) => (
              <div
                key={c.id}
                className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 relative group"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remC(c.id)}
                  className="absolute right-2 top-2 h-8 w-8 text-rose-500 opacity-0 group-hover:opacity-100 bg-rose-50 hover:bg-rose-100"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Nome do Banco (ex: Itaú)"
                  value={c.banco}
                  onChange={(e) => updateC(c.id, 'banco', e.target.value)}
                  className="w-full pr-10 bg-white"
                />
                <div className="flex gap-3">
                  <Input
                    placeholder="Agência"
                    value={c.agencia}
                    onChange={(e) => updateC(c.id, 'agencia', e.target.value)}
                    className="flex-1 bg-white"
                  />
                  <Input
                    placeholder="Conta Corrente"
                    value={c.conta}
                    onChange={(e) => updateC(c.id, 'conta', e.target.value)}
                    className="flex-[2] bg-white"
                  />
                </div>
              </div>
            ))}
            {(!b.contas || b.contas.length === 0) && (
              <p className="text-slate-500 text-center py-6 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                Nenhuma conta informada.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-purple-600" /> Chaves PIX
            </h4>
            <Button size="sm" variant="outline" onClick={addP} className="bg-slate-50">
              <Plus className="w-4 h-4 mr-1" /> Nova
            </Button>
          </div>
          <div className="space-y-3">
            {b.pix?.map((p: any) => (
              <div
                key={p.id}
                className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 relative group"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remP(p.id)}
                  className="absolute right-2 top-2 h-8 w-8 text-rose-500 opacity-0 group-hover:opacity-100 bg-rose-50 hover:bg-rose-100"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Select value={p.tipo} onValueChange={(v) => updateP(p.id, 'tipo', v)}>
                  <SelectTrigger className="w-full pr-10 bg-white">
                    <SelectValue placeholder="Tipo de Chave" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CNPJ">CNPJ/CPF</SelectItem>
                    <SelectItem value="Email">E-mail</SelectItem>
                    <SelectItem value="Celular">Celular</SelectItem>
                    <SelectItem value="Aleatoria">Aleatória</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Valor da Chave"
                  value={p.chave}
                  onChange={(e) => updateP(p.id, 'chave', e.target.value)}
                  className="w-full bg-white font-mono text-sm"
                />
              </div>
            ))}
            {(!b.pix || b.pix.length === 0) && (
              <p className="text-slate-500 text-center py-6 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                Nenhuma chave PIX informada.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
