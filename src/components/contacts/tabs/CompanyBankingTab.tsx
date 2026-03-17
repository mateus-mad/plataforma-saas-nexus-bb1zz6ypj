import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Trash2,
  Wallet,
  TrendingUp,
  Clock,
  AlertTriangle,
  Activity,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  ArrowDownRight,
  CreditCard,
  Eye,
} from 'lucide-react'
import { LabelT } from './CompanyTabs'
import { cn } from '@/lib/utils'

const StatCard = ({ icon: Icon, color, title, val, sub, valClass }: any) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
    <div
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center mb-2',
        color.bg,
        color.text,
      )}
    >
      <Icon className="w-4 h-4" />
    </div>
    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
      {title}
    </span>
    <span className={cn('text-lg font-bold', valClass || 'text-slate-800')}>{val}</span>
    {sub && <span className="text-[10px] text-slate-400 mt-1">{sub}</span>}
  </div>
)

export function CompanyBankingTab({ data, onChange, readOnly }: any) {
  const contas = data?.contas || []
  const pixKeys = data?.pix || []

  const addConta = () =>
    onChange('contas', [...contas, { banco: '', tipo: 'Corrente', agencia: '', conta: '' }])
  const removeConta = (i: number) =>
    onChange(
      'contas',
      contas.filter((_: any, idx: number) => idx !== i),
    )
  const addPix = () => onChange('pix', [...pixKeys, { tipo: 'CNPJ', chave: '' }])
  const removePix = (i: number) =>
    onChange(
      'pix',
      pixKeys.filter((_: any, idx: number) => idx !== i),
    )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" /> Contas Bancárias ({contas.length})
          </h3>
          {!readOnly && (
            <Button variant="outline" size="sm" onClick={addConta}>
              <Plus className="w-4 h-4 mr-2" /> Adicionar Conta
            </Button>
          )}
        </div>
        {contas.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-100">
            Nenhum dado bancário cadastrado
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
                  <Input
                    value={c.banco}
                    onChange={(e) => {
                      const nc = [...contas]
                      nc[i].banco = e.target.value
                      onChange('contas', nc)
                    }}
                    disabled={readOnly}
                  />
                </div>
                <div className="w-[120px]">
                  <LabelT l="Tipo" />
                  <Select
                    value={c.tipo}
                    disabled={readOnly}
                    onValueChange={(v) => {
                      const nc = [...contas]
                      nc[i].tipo = v
                      onChange('contas', nc)
                    }}
                  >
                    <SelectTrigger>
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
                      onChange('contas', nc)
                    }}
                    disabled={readOnly}
                  />
                </div>
                <div className="w-[140px]">
                  <LabelT l="Conta" />
                  <Input
                    value={c.conta}
                    onChange={(e) => {
                      const nc = [...contas]
                      nc[i].conta = e.target.value
                      onChange('contas', nc)
                    }}
                    disabled={readOnly}
                  />
                </div>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeConta(i)}
                    className="text-rose-500"
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
              <Plus className="w-4 h-4 mr-2" /> Adicionar PIX
            </Button>
          )}
        </div>
        {pixKeys.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-100">
            Nenhuma chave PIX cadastrada
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
                      onChange('pix', np)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CNPJ">CNPJ/CPF</SelectItem>
                      <SelectItem value="Email">E-mail</SelectItem>
                      <SelectItem value="Telefone">Telefone</SelectItem>
                      <SelectItem value="Aleatoria">Chave Aleatória</SelectItem>
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
                      onChange('pix', np)
                    }}
                    disabled={readOnly}
                  />
                </div>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePix(i)}
                    className="text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="col-span-2 md:col-span-1 bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
          <Activity className="w-8 h-8 text-emerald-500 mb-2" />
          <span className="text-2xl font-bold text-emerald-600">100%</span>
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-1">
            Confiabilidade
          </span>
        </div>
        <StatCard
          icon={DollarSign}
          color={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
          title="Total Compras"
          val="R$ 20,00"
        />
        <StatCard
          icon={TrendingUp}
          color={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }}
          title="Total Pago"
          val="R$ 20,00"
          valClass="text-emerald-600"
        />
        <StatCard
          icon={Clock}
          color={{ bg: 'bg-amber-50', text: 'text-amber-600' }}
          title="Pendente"
          val="R$ 0,00"
          valClass="text-amber-600"
        />
        <StatCard
          icon={AlertTriangle}
          color={{ bg: 'bg-rose-50', text: 'text-rose-600' }}
          title="Vencido"
          val="R$ 0,00"
          valClass="text-rose-600"
        />

        <div className="col-span-2 md:col-span-1 grid grid-rows-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-lg p-2 text-center shadow-sm">
            <div className="text-sm font-bold text-slate-800">1</div>
            <div className="text-[9px] text-slate-500 uppercase">Transações</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-2 text-center shadow-sm">
            <div className="text-sm font-bold text-emerald-600">-30 dias</div>
            <div className="text-[9px] text-slate-500 uppercase">Média Pgto vs Venc</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-blue-600" /> Análise de Pontualidade nos Pagamentos
        </h3>
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Taxa de pagamento no prazo ou antecipado</span>
            <span className="font-bold text-slate-800">100%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
            <ArrowUpRight className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-emerald-700">1</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Antecipados</p>
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-center">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-blue-700">0</p>
            <p className="text-xs text-blue-600 font-medium mt-1">No Prazo</p>
          </div>
          <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 text-center">
            <ArrowDownRight className="w-5 h-5 text-rose-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-rose-700">0</p>
            <p className="text-xs text-rose-600 font-medium mt-1">Atrasados</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-slate-400" /> Formas de Pagamento Utilizadas
        </h3>
        <Badge variant="outline" className="px-3 py-1.5 text-sm bg-slate-50 border-slate-200">
          PIX: 1x
        </Badge>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-400" /> Histórico de Pagamentos
          </h3>
        </div>
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium text-slate-800">Serviço de consultoria</div>
                <div className="text-[10px] text-slate-500">Doc: CP-MMBJ</div>
              </TableCell>
              <TableCell className="font-bold">R$ 20,00</TableCell>
              <TableCell>04/03/2026</TableCell>
              <TableCell>02/02/2026</TableCell>
              <TableCell>PIX</TableCell>
              <TableCell>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none border-none">
                  Pago
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-blue-600"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
