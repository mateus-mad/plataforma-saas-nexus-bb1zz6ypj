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
import { cn } from '@/lib/utils'

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
        description:
          'Sua permissão é Operacional. A alteração foi enviada para aprovação do Administrador.',
      })
    }
  }

  const approveChange = (field: string) => {
    const pendingVal = data[`pending${field.charAt(0).toUpperCase() + field.slice(1)}`]
    if (pendingVal !== null) {
      onChange(field, pendingVal)
      onChange(`pending${field.charAt(0).toUpperCase() + field.slice(1)}`, null)
      toast({
        title: 'Alteração Aprovada',
        description: 'O valor financeiro foi atualizado com sucesso.',
      })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-blue-50/80 border border-blue-200 text-blue-800 p-4 rounded-xl flex gap-3 items-start text-sm shadow-sm mb-6">
        <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900">Governança Financeira (RBAC)</p>
          <p className="leading-relaxed text-blue-800 mt-1">
            Você está operando como{' '}
            <span className="font-bold">{isAdminMode ? 'Administrador' : 'Operacional'}</span>.
            {isAdminMode
              ? ' Mudanças aplicam-se imediatamente.'
              : ' Mudanças em Limite e Prazo requerem aprovação gerencial prévia.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={cn(
            'space-y-1.5 p-4 rounded-xl shadow-sm transition-all',
            data.pendingLimite
              ? 'bg-amber-50/50 border-2 border-amber-200'
              : 'bg-white border border-slate-100',
          )}
        >
          <div className="flex justify-between items-center mb-1.5">
            <LabelT l="Limite de Crédito (R$)" />
            {data.pendingLimite && !isAdminMode && (
              <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
                <Clock className="w-3 h-3" /> Aguardando Review
              </span>
            )}
          </div>
          <Input
            value={data.pendingLimite !== null ? data.pendingLimite : data.limiteCredito || ''}
            onChange={(e) => handleSensitiveChange('limiteCredito', e.target.value)}
            disabled={readOnly}
            className={cn(
              err('limiteCredito'),
              data.pendingLimite
                ? 'border-amber-300 font-semibold text-amber-700'
                : 'font-semibold',
            )}
            placeholder="0,00"
          />
          {data.pendingLimite && isAdminMode && (
            <div className="mt-3 flex items-center justify-between bg-amber-100/50 p-3 rounded-lg border border-amber-200 animate-in fade-in">
              <span className="text-xs text-amber-800 flex items-center gap-1.5 font-semibold">
                <ShieldAlert className="w-4 h-4" /> Novo valor proposto: R$ {data.pendingLimite}
              </span>
              <Button
                size="sm"
                onClick={() => approveChange('limiteCredito')}
                className="h-8 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-sm"
              >
                Aprovar
              </Button>
            </div>
          )}
        </div>

        <div
          className={cn(
            'space-y-1.5 p-4 rounded-xl shadow-sm transition-all',
            data.pendingPrazo
              ? 'bg-amber-50/50 border-2 border-amber-200'
              : 'bg-white border border-slate-100',
          )}
        >
          <div className="flex justify-between items-center mb-1.5">
            <LabelT l="Prazo de Pagamento (dias)" />
            {data.pendingPrazo && !isAdminMode && (
              <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
                <Clock className="w-3 h-3" /> Aguardando Review
              </span>
            )}
          </div>
          <Input
            type="number"
            value={data.pendingPrazo !== null ? data.pendingPrazo : data.prazoPagamento || ''}
            onChange={(e) => handleSensitiveChange('prazoPagamento', e.target.value)}
            disabled={readOnly}
            className={cn(
              err('prazoPagamento'),
              data.pendingPrazo ? 'border-amber-300 font-semibold text-amber-700' : 'font-semibold',
            )}
            placeholder="30"
          />
          {data.pendingPrazo && isAdminMode && (
            <div className="mt-3 flex items-center justify-between bg-amber-100/50 p-3 rounded-lg border border-amber-200 animate-in fade-in">
              <span className="text-xs text-amber-800 flex items-center gap-1.5 font-semibold">
                <ShieldAlert className="w-4 h-4" /> Novo prazo: {data.pendingPrazo} dias
              </span>
              <Button
                size="sm"
                onClick={() => approveChange('prazoPagamento')}
                className="h-8 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-sm"
              >
                Aprovar
              </Button>
            </div>
          )}
        </div>
      </div>

      {type === 'supplier' && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-400" /> Dados Bancários (Pagamento)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
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
  return null // Deprecated - Used inside Profile Modal now
}

export function CompanyContratosTab() {
  return null // Deprecated - Used inside Profile Modal now
}
