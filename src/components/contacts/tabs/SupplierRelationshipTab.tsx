import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  HeartHandshake,
  ThumbsUp,
  AlertCircle,
  Plus,
  Trash2,
  CalendarDays,
  FileText,
} from 'lucide-react'

export default function SupplierRelationshipTab({ data, updateData }: any) {
  const r = data?.relacionamento || { clienteDesde: '', observacoes: '' }
  const pbs = data?.relacionamento?.problemas || []
  const prs = data?.relacionamento?.elogios || []

  const addPb = () =>
    updateData('relacionamento', 'problemas', [
      { id: Date.now(), desc: '', data: new Date().toISOString().split('T')[0] },
      ...pbs,
    ])
  const addPr = () =>
    updateData('relacionamento', 'elogios', [
      { id: Date.now(), desc: '', data: new Date().toISOString().split('T')[0] },
      ...prs,
    ])
  const remPb = (id: number) =>
    updateData(
      'relacionamento',
      'problemas',
      pbs.filter((x: any) => x.id !== id),
    )
  const remPr = (id: number) =>
    updateData(
      'relacionamento',
      'elogios',
      prs.filter((x: any) => x.id !== id),
    )
  const updPb = (id: number, f: string, v: string) =>
    updateData(
      'relacionamento',
      'problemas',
      pbs.map((x: any) => (x.id === id ? { ...x, [f]: v } : x)),
    )
  const updPr = (id: number, f: string, v: string) =>
    updateData(
      'relacionamento',
      'elogios',
      prs.map((x: any) => (x.id === id ? { ...x, [f]: v } : x)),
    )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-center bg-gradient-to-r from-blue-50/50 to-white">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20 flex items-center justify-center shrink-0">
          <HeartHandshake className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1 space-y-2 w-full text-center sm:text-left">
          <Label className="text-slate-500 font-bold uppercase tracking-wider text-xs">
            Início da Parceria (Cliente Desde)
          </Label>
          <div className="flex justify-center sm:justify-start items-center gap-3">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <Input
              type="date"
              value={r.clienteDesde}
              onChange={(e) => updateData('relacionamento', 'clienteDesde', e.target.value)}
              className="w-full max-w-[200px] font-bold text-slate-800 bg-white border-blue-100 shadow-sm focus-visible:ring-blue-500 h-11"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-rose-500" /> Ocorrências & Falhas
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Registre quebras de SLA, atrasos ou inconformidades.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={addPb}
              className="h-9 shrink-0 border-rose-200 text-rose-700 hover:bg-rose-50"
            >
              <Plus className="w-4 h-4 sm:mr-1" />{' '}
              <span className="hidden sm:inline">Nova Ocorrência</span>
            </Button>
          </div>
          {pbs.length === 0 && (
            <div className="h-28 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
              <AlertCircle className="w-6 h-6 text-slate-300 mb-2" />
              <p className="text-sm text-slate-500 font-medium">Nenhuma ocorrência registrada.</p>
            </div>
          )}
          <div className="space-y-3">
            {pbs.map((p: any) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row gap-3 relative group p-4 bg-rose-50/50 rounded-xl border border-rose-100 shadow-sm"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remPb(p.id)}
                  className="absolute right-2 top-2 h-7 w-7 text-rose-500 opacity-0 group-hover:opacity-100 bg-white shadow-sm transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
                <div className="space-y-1 shrink-0">
                  <Label className="text-xs text-slate-500 font-semibold">Data</Label>
                  <Input
                    type="date"
                    value={p.data}
                    onChange={(e) => updPb(p.id, 'data', e.target.value)}
                    className="w-full sm:w-[140px] h-9 text-sm bg-white"
                  />
                </div>
                <div className="space-y-1 flex-1 pr-6">
                  <Label className="text-xs text-slate-500 font-semibold">Motivo / Descrição</Label>
                  <Input
                    placeholder="Descreva o problema ocorrido..."
                    value={p.desc}
                    onChange={(e) => updPb(p.id, 'desc', e.target.value)}
                    className="w-full h-9 text-sm bg-white border-rose-200 focus-visible:ring-rose-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <ThumbsUp className="w-5 h-5 text-emerald-500" /> Feedbacks Positivos
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Registre entregas excelentes ou superações de meta.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={addPr}
              className="h-9 shrink-0 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="w-4 h-4 sm:mr-1" />{' '}
              <span className="hidden sm:inline">Novo Elogio</span>
            </Button>
          </div>
          {prs.length === 0 && (
            <div className="h-28 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
              <ThumbsUp className="w-6 h-6 text-slate-300 mb-2" />
              <p className="text-sm text-slate-500 font-medium">
                Nenhum feedback positivo registrado.
              </p>
            </div>
          )}
          <div className="space-y-3">
            {prs.map((p: any) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row gap-3 relative group p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 shadow-sm"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remPr(p.id)}
                  className="absolute right-2 top-2 h-7 w-7 text-rose-500 opacity-0 group-hover:opacity-100 bg-white shadow-sm transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
                <div className="space-y-1 shrink-0">
                  <Label className="text-xs text-slate-500 font-semibold">Data</Label>
                  <Input
                    type="date"
                    value={p.data}
                    onChange={(e) => updPr(p.id, 'data', e.target.value)}
                    className="w-full sm:w-[140px] h-9 text-sm bg-white"
                  />
                </div>
                <div className="space-y-1 flex-1 pr-6">
                  <Label className="text-xs text-slate-500 font-semibold">Elogio / Destaque</Label>
                  <Input
                    placeholder="Descreva o desempenho excepcional..."
                    value={p.desc}
                    onChange={(e) => updPr(p.id, 'desc', e.target.value)}
                    className="w-full h-9 text-sm bg-white border-emerald-200 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <Label className="text-slate-800 font-bold flex items-center gap-2 text-lg border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-amber-500" /> Notas Gerais do Relacionamento
          </Label>
          <Textarea
            placeholder="Adicione observações gerais sobre a parceria, restrições corporativas, horários de entrega preferenciais ou qualquer outro detalhe crítico que a equipe precise saber..."
            value={r.observacoes || ''}
            onChange={(e) => updateData('relacionamento', 'observacoes', e.target.value)}
            className="min-h-[140px] resize-none bg-amber-50/30 focus:bg-white text-base border-slate-200 leading-relaxed p-4"
          />
        </div>
      </div>
    </div>
  )
}
