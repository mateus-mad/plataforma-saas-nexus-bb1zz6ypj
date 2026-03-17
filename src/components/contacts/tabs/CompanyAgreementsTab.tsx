import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LabelT } from './CompanyTabs'
import { FileSignature } from 'lucide-react'

export function CompanyAgreementsTab({ data, onChange, readOnly }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6">
        <h4 className="font-semibold text-blue-900 text-sm mb-1 flex items-center gap-2">
          <FileSignature className="w-4 h-4" /> Condições e Acordos Negociados
        </h4>
        <p className="text-xs text-blue-800/80">
          Registre aqui condições exclusivas e termos comerciais preestabelecidos com este
          fornecedor.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <LabelT l="Desconto Combinado" t="Desconto padrão fixado para este fornecedor" />
            <Input
              value={data?.desconto || ''}
              onChange={(e) => onChange('desconto', e.target.value)}
              disabled={readOnly}
              placeholder="Ex: 5% em toda linha"
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Negociação Combinada (Termos)" t="Acordos de frete, entrega, etc." />
            <Input
              value={data?.negociacao || ''}
              onChange={(e) => onChange('negociacao', e.target.value)}
              disabled={readOnly}
              placeholder="Ex: Frete FOB"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <LabelT l="Observações do Acordo" />
            <Textarea
              value={data?.observacoes || ''}
              onChange={(e) => onChange('observacoes', e.target.value)}
              disabled={readOnly}
              placeholder="Detalhes adicionais sobre os acordos vigentes..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
