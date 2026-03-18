import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { HeartHandshake, ThumbsUp, AlertCircle, Plus, Trash2, CalendarDays } from 'lucide-react'

export default function SupplierRelationshipTab({ data, updateData }: any) {
  const r = data?.relacionamento || { clienteDesde: '' }
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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-center bg-gradient-to-br from-white to-blue-50/30">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20 flex items-center justify-center shrink-0">
          <HeartHandshake className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1 space-y-1.5 w-full text-center sm:text-left">
          <Label className="text-slate-600 font-bold uppercase tracking-wider text-xs">
            Início da Parceria
          </Label>
          <div className="flex justify-center sm:justify-start items-center gap-3">
            <CalendarDays className="w-5 h-5 text-slate-400" />
            <Input
              type="date"
              value={r.clienteDesde}
              onChange={(e) => updateData('relacionamento', 'clienteDesde', e.target.value)}
              className="w-full max-w-[200px] font-bold text-slate-800 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5 text-rose-500" /> Ocorrências (SLA)
            </h4>
            <Button size="sm" variant="outline" onClick={addPb} className="h-8">
              <Plus className="w-4 h-4 mr-1" /> Registrar
            </Button>
          </div>
          {pbs.length === 0 && (
            <p className="text-sm text-slate-500 italic text-center py-4">
              Nenhuma ocorrência negativa registrada.
            </p>
          )}
          <div className="space-y-3">
            {pbs.map((p: any) => (
              <div
                key={p.id}
                className="flex gap-2 relative group p-3 bg-rose-50/50 rounded-xl border border-rose-100 pr-10"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remPb(p.id)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-rose-500 opacity-0 group-hover:opacity-100 bg-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Data</Label>
                  <Input
                    type="date"
                    value={p.data}
                    onChange={(e) => updPb(p.id, 'data', e.target.value)}
                    className="w-[140px] h-9 text-sm bg-white"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label className="text-xs text-slate-500">Motivo</Label>
                  <Input
                    placeholder="O que houve?"
                    value={p.desc}
                    onChange={(e) => updPb(p.id, 'desc', e.target.value)}
                    className="w-full h-9 text-sm bg-white border-rose-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <ThumbsUp className="w-5 h-5 text-emerald-500" /> Feedbacks Positivos
            </h4>
            <Button size="sm" variant="outline" onClick={addPr} className="h-8">
              <Plus className="w-4 h-4 mr-1" /> Registrar
            </Button>
          </div>
          {prs.length === 0 && (
            <p className="text-sm text-slate-500 italic text-center py-4">
              Nenhum feedback registrado.
            </p>
          )}
          <div className="space-y-3">
            {prs.map((p: any) => (
              <div
                key={p.id}
                className="flex gap-2 relative group p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 pr-10"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remPr(p.id)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-rose-500 opacity-0 group-hover:opacity-100 bg-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Data</Label>
                  <Input
                    type="date"
                    value={p.data}
                    onChange={(e) => updPr(p.id, 'data', e.target.value)}
                    className="w-[140px] h-9 text-sm bg-white"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label className="text-xs text-slate-500">Elogio</Label>
                  <Input
                    placeholder="Desempenho..."
                    value={p.desc}
                    onChange={(e) => updPr(p.id, 'desc', e.target.value)}
                    className="w-full h-9 text-sm bg-white border-emerald-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
