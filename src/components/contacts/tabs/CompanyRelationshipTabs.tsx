import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Settings } from 'lucide-react'
import { LabelT } from './CompanyTabs'

export function CompanyRelacionamentoTab({ data, onChange, readOnly }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <LabelT l="Cliente Desde" />
          <Input
            type="date"
            value={data.clienteDesde || ''}
            onChange={(e) => onChange('clienteDesde', e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <LabelT l="Segmento" />
          <div className="flex gap-2">
            <Select
              value={data.segmento || ''}
              onValueChange={(v) => onChange('segmento', v)}
              disabled={readOnly}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione o segmento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Varejo">Varejo</SelectItem>
                <SelectItem value="Atacado">Atacado</SelectItem>
                <SelectItem value="Serviços">Serviços</SelectItem>
                <SelectItem value="Indústria">Indústria</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="shrink-0" disabled={readOnly}>
              <Settings className="w-4 h-4 text-slate-500" />
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <LabelT l="Observações" />
        <Textarea
          value={data.observacoes || ''}
          onChange={(e) => onChange('observacoes', e.target.value)}
          disabled={readOnly}
          placeholder="Informações adicionais sobre o cliente..."
          className="min-h-[120px] resize-none"
        />
      </div>
    </div>
  )
}
