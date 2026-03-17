import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  DollarSign,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Filter,
  Search,
  FileSignature,
} from 'lucide-react'
import { LabelT } from './CompanyTabs'

export function CompanyFinanceiroTab({ data, type, onChange, errors, readOnly }: any) {
  const err = (f: string) =>
    errors?.[`financeiro.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <LabelT l="Limite de Crédito (R$)" />
          <Input
            value={data.limiteCredito || ''}
            onChange={(e) => onChange('limiteCredito', e.target.value)}
            disabled={readOnly}
            className={err('limiteCredito')}
            placeholder="0,00"
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Prazo de Pagamento (dias)" />
          <Input
            type="number"
            value={data.prazoPagamento || ''}
            onChange={(e) => onChange('prazoPagamento', e.target.value)}
            disabled={readOnly}
            className={err('prazoPagamento')}
            placeholder="30"
          />
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
        <span className="font-semibold text-slate-700">Dica:</span> O limite de crédito e prazo de
        pagamento definidos aqui serão usados como padrão para novas vendas e contas a receber deste
        cliente.
      </div>
      {type === 'supplier' && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h4 className="font-semibold text-slate-800 mb-4">Dados Bancários</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <LabelT l="Banco" req />
              <Input
                value={data.banco || ''}
                onChange={(e) => onChange('banco', e.target.value)}
                disabled={readOnly}
                className={err('banco')}
                placeholder="Ex: Itaú (341)"
              />
            </div>
            <div className="space-y-1.5">
              <LabelT l="Agência" req />
              <Input
                value={data.agConta || ''}
                onChange={(e) => onChange('agConta', e.target.value)}
                disabled={readOnly}
                className={err('agConta')}
              />
            </div>
            <div className="space-y-1.5">
              <LabelT l="Conta" req />
              <Input
                value={data.conta || ''}
                onChange={(e) => onChange('conta', e.target.value)}
                disabled={readOnly}
                className={err('conta')}
              />
            </div>
            <div className="space-y-1.5">
              <LabelT l="Chave PIX" />
              <Input
                value={data.pix || ''}
                onChange={(e) => onChange('pix', e.target.value)}
                disabled={readOnly}
                className={err('pix')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function CompanyHistoricoTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="col-span-2 md:col-span-1 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-white shadow-sm">
          <DollarSign className="w-8 h-8 text-emerald-500 mb-2" />
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider text-center mb-1">
            Score Financeiro
          </div>
          <div className="text-sm font-bold text-emerald-600 text-center leading-tight">
            Pagador
            <br />
            Excelente
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-white shadow-sm">
          <ThumbsUp className="w-8 h-8 text-emerald-500 mb-2" />
          <div className="text-xl font-bold text-slate-800">0</div>
          <div className="text-xs text-slate-500 font-medium">No Prazo</div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-white shadow-sm">
          <ThumbsDown className="w-8 h-8 text-rose-500 mb-2" />
          <div className="text-xl font-bold text-rose-600">0</div>
          <div className="text-xs text-slate-500 font-medium text-center leading-tight">
            Com Atraso
            <br />
            0%
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-white shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
          <div className="text-xl font-bold text-emerald-600">0%</div>
          <div className="text-xs text-slate-500 font-medium">Pontualidade</div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-white shadow-sm">
          <Clock className="w-8 h-8 text-amber-500 mb-2" />
          <div className="text-xl font-bold text-slate-800">Antec.</div>
          <div className="text-xs text-slate-500 font-medium text-center leading-tight">
            Prazo Médio
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-white shadow-sm">
          <FileText className="w-8 h-8 text-blue-500 mb-2" />
          <div className="text-xl font-bold text-slate-800">0</div>
          <div className="text-xs text-slate-500 font-medium text-center leading-tight">
            Transações
            <br />0 pagas
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">Total Faturado</div>
            <div className="text-lg font-bold text-slate-800">R$ 0,00</div>
          </div>
          <DollarSign className="w-8 h-8 text-slate-300" />
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">Total Recebido</div>
            <div className="text-lg font-bold text-emerald-600">R$ 0,00</div>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-300" />
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">A Vencer</div>
            <div className="text-lg font-bold text-amber-600">R$ 0,00</div>
          </div>
          <Calendar className="w-8 h-8 text-amber-300" />
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">Vencido</div>
            <div className="text-lg font-bold text-rose-600">R$ 0,00</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-rose-300" />
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-700 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" /> Histórico Completo de Contas a Receber
        </div>
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por descrição ou documento..."
              className="pl-9 bg-slate-50 border-slate-200 h-9"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <Select defaultValue="todos">
              <SelectTrigger className="w-full sm:w-[130px] bg-white h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pagos">Pagos</SelectItem>
                <SelectItem value="pendentes">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="py-16 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
          <FileText className="w-12 h-12 mb-3 text-slate-300" />
          <p className="text-sm font-medium">Nenhum registro encontrado</p>
        </div>
      </div>
    </div>
  )
}

export function CompanyContratosTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSignature className="w-4 h-4 text-slate-400" /> Contratos Firmados
          </div>
        </div>
        <div className="py-16 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
          <FileSignature className="w-12 h-12 mb-3 text-slate-300" />
          <p className="text-sm font-medium">Nenhum contrato encontrado</p>
        </div>
      </div>
    </div>
  )
}
