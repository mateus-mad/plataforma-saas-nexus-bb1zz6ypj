import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileSignature, Plus, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export default function SupplierAgreementsTab({ data, updateData }: any) {
  const [modalOpen, setModalOpen] = useState(false)
  const [newAg, setNewAg] = useState({ descricao: '', desconto: '', prazo: '', dataFim: '' })
  const acordos = data?.acordos?.lista || []

  const saveNew = () => {
    if (!newAg.descricao) return
    updateData('acordos', 'lista', [...acordos, { id: Date.now(), ...newAg }])
    setNewAg({ descricao: '', desconto: '', prazo: '', dataFim: '' })
    setModalOpen(false)
  }

  const rem = (id: number) =>
    updateData(
      'acordos',
      'lista',
      acordos.filter((a: any) => a.id !== id),
    )
  const update = (id: number, field: string, val: string) =>
    updateData(
      'acordos',
      'lista',
      acordos.map((a: any) => (a.id === id ? { ...a, [field]: val } : a)),
    )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
            <FileSignature className="w-5 h-5 text-blue-600" /> Acordos Comerciais (SLA)
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Defina descontos, prazos e condições diferenciadas pactuadas com este fornecedor.
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Acordo
        </Button>
      </div>

      <div className="space-y-4">
        {acordos.map((a: any) => (
          <div
            key={a.id}
            className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm relative group transition-all hover:border-blue-300"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => rem(a.id)}
              className="absolute top-3 right-3 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity bg-rose-50 hover:bg-rose-100"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pr-10">
              <div className="space-y-2 lg:col-span-2">
                <Label className="font-semibold text-slate-600">Descrição do Acordo</Label>
                <Input
                  value={a.descricao}
                  onChange={(e) => update(a.id, 'descricao', e.target.value)}
                  className="bg-slate-50 font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-slate-600">Desconto Concedido</Label>
                <Input
                  value={a.desconto}
                  onChange={(e) => update(a.id, 'desconto', e.target.value)}
                  className="bg-slate-50 font-mono"
                  placeholder="Ex: 5% ou R$ 100"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-slate-600">Prazo Especial</Label>
                <Input
                  value={a.prazo}
                  onChange={(e) => update(a.id, 'prazo', e.target.value)}
                  className="bg-slate-50"
                  placeholder="Ex: 45 dias"
                />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label className="font-semibold text-slate-600">
                  Validade do Acordo (Data Fim)
                </Label>
                <Input
                  type="date"
                  value={a.dataFim}
                  onChange={(e) => update(a.id, 'dataFim', e.target.value)}
                  className="bg-slate-50 w-full sm:max-w-[200px]"
                />
              </div>
            </div>
          </div>
        ))}

        {acordos.length === 0 && (
          <div className="text-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
            <FileSignature className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium text-lg mb-1">Nenhum acordo vigente</p>
            <p className="text-slate-400 text-sm">Contratos padrões da empresa serão aplicados.</p>
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registrar Novo Acordo</DialogTitle>
            <DialogDescription>
              Defina as condições do novo Service Level Agreement (SLA).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Descrição / Nome do Acordo</Label>
              <Input
                placeholder="Ex: Condições Comerciais 2026"
                value={newAg.descricao}
                onChange={(e) => setNewAg({ ...newAg, descricao: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Desconto Padrão</Label>
                <Input
                  placeholder="5%"
                  value={newAg.desconto}
                  onChange={(e) => setNewAg({ ...newAg, desconto: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Prazo Extra (dias)</Label>
                <Input
                  placeholder="30"
                  value={newAg.prazo}
                  onChange={(e) => setNewAg({ ...newAg, prazo: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Validade (Data Fim)</Label>
              <Input
                type="date"
                value={newAg.dataFim}
                onChange={(e) => setNewAg({ ...newAg, dataFim: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveNew} className="bg-blue-600 hover:bg-blue-700">
              Salvar Acordo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
