import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LabelT } from './CompanyTabs'
import { FileSignature } from 'lucide-react'

export function CompanyAgreementsTab({ data, onChange, readOnly }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6 flex gap-3 items-start">
        <div className="bg-blue-100 p-2 rounded-lg shrink-0">
          <FileSignature className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 text-sm mb-1">
            Condições e Acordos Negociados (SLA)
          </h4>
          <p className="text-xs text-blue-800/80 leading-relaxed">
            Registre aqui condições exclusivas e termos comerciais preestabelecidos com este
            fornecedor para uso em todo o ciclo de compras e inteligência.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <LabelT l="Descontos Combinados" t="Desconto padrão fixado para este fornecedor" />
            <Input
              value={data?.desconto || ''}
              onChange={(e) => onChange('desconto', e.target.value)}
              disabled={readOnly}
              placeholder="Ex: 5% de desconto padrão em toda linha"
            />
          </div>
          <div className="space-y-1.5">
            <LabelT
              l="Prazos de Pagamento Negociados"
              t="Acordos de faturamento além do prazo padrão"
            />
            <Input
              value={data?.negociacao || ''}
              onChange={(e) => onChange('negociacao', e.target.value)}
              disabled={readOnly}
              placeholder="Ex: Faturamento 30/60/90 dias líquidos"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <LabelT l="Observações de Negociação (Contrato)" />
            <Textarea
              value={data?.observacoes || ''}
              onChange={(e) => onChange('observacoes', e.target.value)}
              disabled={readOnly}
              placeholder="Detalhes adicionais sobre os acordos vigentes, exigências de frete, regras de devolução..."
              className="min-h-[120px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
