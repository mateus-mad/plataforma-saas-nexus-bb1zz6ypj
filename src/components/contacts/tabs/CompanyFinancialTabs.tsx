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
  Upload,
  Download,
  Trash2,
  Eye,
  ShieldAlert,
} from 'lucide-react'
import { LabelT } from './CompanyTabs'
import useSecurityStore from '@/stores/useSecurityStore'
import { useState, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'

export function CompanyFinanceiroTab({ data, type, onChange, errors, readOnly }: any) {
  const { isAdminMode } = useSecurityStore()
  const { toast } = useToast()

  const err = (f: string) =>
    errors?.[`financeiro.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  const handleSensitiveChange = (field: string, value: string) => {
    if (isAdminMode) {
      onChange(field, value)
      onChange(`pending${field.charAt(0).toUpperCase() + field.slice(1)}`, null)
    } else {
      onChange(`pending${field.charAt(0).toUpperCase() + field.slice(1)}`, value)
      toast({
        title: 'Aprovação Necessária',
        description: 'A alteração deste campo financeiro foi enviada para aprovação do gestor.',
      })
    }
  }

  const approveChange = (field: string) => {
    const pendingVal = data[`pending${field.charAt(0).toUpperCase() + field.slice(1)}`]
    if (pendingVal !== null) {
      onChange(field, pendingVal)
      onChange(`pending${field.charAt(0).toUpperCase() + field.slice(1)}`, null)
      toast({ title: 'Alteração Aprovada', description: 'O valor foi atualizado com sucesso.' })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5 relative p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-1.5">
            <LabelT l="Limite de Crédito (R$)" />
            {data.pendingLimite && !isAdminMode && (
              <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Aguardando Aprovação
              </span>
            )}
          </div>
          <Input
            value={data.pendingLimite !== null ? data.pendingLimite : data.limiteCredito || ''}
            onChange={(e) => handleSensitiveChange('limiteCredito', e.target.value)}
            disabled={readOnly}
            className={cn(err('limiteCredito'), data.pendingLimite ? 'border-amber-300' : '')}
            placeholder="0,00"
          />
          {data.pendingLimite && isAdminMode && (
            <div className="mt-2 flex items-center justify-between bg-amber-50 p-2 rounded-md">
              <span className="text-xs text-amber-800 flex items-center gap-1 font-medium">
                <ShieldAlert className="w-3.5 h-3.5" /> Novo limite proposto: R${' '}
                {data.pendingLimite}
              </span>
              <Button size="sm" onClick={() => approveChange('limiteCredito')} className="h-6 px-2">
                Aprovar
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-1.5 relative p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-1.5">
            <LabelT l="Prazo de Pagamento (dias)" />
            {data.pendingPrazo && !isAdminMode && (
              <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Aguardando Aprovação
              </span>
            )}
          </div>
          <Input
            type="number"
            value={data.pendingPrazo !== null ? data.pendingPrazo : data.prazoPagamento || ''}
            onChange={(e) => handleSensitiveChange('prazoPagamento', e.target.value)}
            disabled={readOnly}
            className={cn(err('prazoPagamento'), data.pendingPrazo ? 'border-amber-300' : '')}
            placeholder="30"
          />
          {data.pendingPrazo && isAdminMode && (
            <div className="mt-2 flex items-center justify-between bg-amber-50 p-2 rounded-md">
              <span className="text-xs text-amber-800 flex items-center gap-1 font-medium">
                <ShieldAlert className="w-3.5 h-3.5" /> Novo prazo proposto: {data.pendingPrazo}{' '}
                dias
              </span>
              <Button
                size="sm"
                onClick={() => approveChange('prazoPagamento')}
                className="h-6 px-2"
              >
                Aprovar
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
        <span className="font-semibold text-slate-700">Dica de Governança:</span> Alterações de
        limite e prazo entram em fluxo de aprovação caso o usuário não tenha perfil de gerência.
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
          <div className="text-xl font-bold text-slate-800">12</div>
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
          <div className="text-xl font-bold text-emerald-600">100%</div>
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
          <div className="text-xl font-bold text-slate-800">12</div>
          <div className="text-xs text-slate-500 font-medium text-center leading-tight">
            Transações
            <br />
            12 pagas
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">Total Faturado</div>
            <div className="text-lg font-bold text-slate-800">R$ 150.000,00</div>
          </div>
          <DollarSign className="w-8 h-8 text-slate-300" />
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">Total Recebido</div>
            <div className="text-lg font-bold text-emerald-600">R$ 150.000,00</div>
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
        <div className="p-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 text-sm">
            <div>
              <p className="font-semibold text-slate-700">Fatura Mensal - REF: F001</p>
              <p className="text-xs text-slate-500">Vencimento: 10/03/2026</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800">R$ 15.000,00</p>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">
                Pago
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CompanyContratosTab() {
  const [contracts, setContracts] = useState([
    { id: 1, name: 'Contrato_Base_Fornecimento.pdf', date: '01/01/2025', size: '1.2 MB' },
    { id: 2, name: 'Aditivo_Precos_2026.pdf', date: '15/02/2026', size: '450 KB' },
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const newContract = {
        id: Date.now(),
        name: file.name,
        date: new Date().toLocaleDateString('pt-BR'),
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      }
      setContracts([newContract, ...contracts])
    }
  }

  const removeContract = (id: number) => {
    setContracts(contracts.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 bg-white flex flex-col items-center justify-center text-center hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group relative">
        <div className="w-12 h-12 bg-slate-50 rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:bg-white group-hover:scale-110 transition-transform">
          <Upload className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="font-semibold text-slate-700 text-base mb-1">Anexar Novo Contrato</h3>
        <p className="text-sm text-slate-500 mb-4">Envie o arquivo assinado em PDF (Max 10MB)</p>
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf"
        />
        <Button onClick={() => fileInputRef.current?.click()} variant="outline">
          Selecionar Arquivo
        </Button>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSignature className="w-4 h-4 text-slate-400" /> Contratos e Aditivos Ativos
          </div>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
            {contracts.length}
          </span>
        </div>

        {contracts.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <FileSignature className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-sm font-medium">Nenhum contrato anexado</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {contracts.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-rose-500" />
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-500">
                      Enviado em {c.date} • {c.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-rose-600 hover:bg-rose-50"
                    onClick={() => removeContract(c.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <FileSignature className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Módulo Gerador de Documentos</p>
          <p className="text-xs text-blue-800 mt-1">
            Esta área será integrada ao futuro Gerador de Propostas e Documentos para criação
            automática de contratos baseada nos dados do formulário.
          </p>
        </div>
      </div>
    </div>
  )
}
