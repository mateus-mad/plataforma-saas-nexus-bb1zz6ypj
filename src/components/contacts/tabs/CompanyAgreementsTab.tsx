import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  FileSignature,
  Plus,
  Calendar as CalendarIcon,
  Tag,
  Percent,
  DollarSign,
  X,
} from 'lucide-react'
import { Label } from '@/components/ui/label'

export function CompanyAgreementsTab({ data, onChange, readOnly }: any) {
  const [open, setOpen] = useState(false)
  const agreements = data?.lista || []

  const [form, setForm] = useState({
    tipo: 'Desconto',
    descricao: '',
    descontoPercent: '',
    descontoFixo: '',
    valorMinimo: '',
    qtdMinima: '',
    prazoPagamento: '',
    dataInicio: '2026-03-17',
    dataFim: '',
    condicoes: '',
    observacoes: '',
    ativo: true,
  })
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const handleAddTag = (e: any) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault()
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
        setTagInput('')
      }
    }
  }

  const handleSave = () => {
    const newAcordo = { ...form, id: Date.now(), categorias: tags }
    onChange('lista', [...agreements, newAcordo])
    setOpen(false)
    setForm({
      tipo: 'Desconto',
      descricao: '',
      descontoPercent: '',
      descontoFixo: '',
      valorMinimo: '',
      qtdMinima: '',
      prazoPagamento: '',
      dataInicio: '2026-03-17',
      dataFim: '',
      condicoes: '',
      observacoes: '',
      ativo: true,
    })
    setTags([])
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
        <div>
          <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-blue-600" /> Acordos Comerciais (SLA)
          </h3>
          <p className="text-sm text-blue-800/80 mt-1">
            Gerencie descontos, prazos especiais e bonificações negociadas.
          </p>
        </div>
        {!readOnly && (
          <Button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Acordo Comercial
          </Button>
        )}
      </div>

      {agreements.length === 0 ? (
        <div className="text-center p-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500">Nenhum acordo comercial ativo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agreements.map((a: any) => (
            <div
              key={a.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
            >
              <div
                className={`p-4 border-b ${a.ativo ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-100'} flex justify-between items-start`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={
                        a.tipo === 'Desconto'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }
                    >
                      {a.tipo}
                    </Badge>
                    {a.ativo ? (
                      <Badge className="bg-blue-600 hover:bg-blue-600">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">{a.descricao}</h4>
                </div>
              </div>
              <div className="p-5 flex-1 space-y-4">
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {a.descontoPercent && a.descontoPercent !== '0' && (
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Percent className="w-4 h-4 text-emerald-500" />{' '}
                      <span className="font-bold">{a.descontoPercent}%</span> Desc.
                    </div>
                  )}
                  {a.descontoFixo && a.descontoFixo !== '0,00' && (
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <DollarSign className="w-4 h-4 text-emerald-500" />{' '}
                      <span className="font-bold">R$ {a.descontoFixo}</span> Fixo
                    </div>
                  )}
                  {a.prazoPagamento && (
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <CalendarIcon className="w-4 h-4 text-blue-500" /> Prazo:{' '}
                      <span className="font-bold">{a.prazoPagamento} dias</span>
                    </div>
                  )}
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                  <p className="text-slate-600 mb-2">
                    <span className="font-semibold text-slate-800">Condições:</span>{' '}
                    {a.condicoes || 'Nenhuma'}
                  </p>
                  <p className="text-slate-500 text-xs flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" /> Vigência: {a.dataInicio}{' '}
                    {a.dataFim ? `até ${a.dataFim}` : '(Indeterminado)'}
                  </p>
                </div>
                {a.categorias?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {a.categorias.map((c: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-slate-50">
                        <Tag className="w-3 h-3 mr-1" />
                        {c}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-slate-50">
          <DialogHeader className="p-6 bg-white border-b border-slate-200">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileSignature className="w-5 h-5 text-blue-600" /> Novo Acordo Comercial
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <Label>
                  Tipo de Acordo <span className="text-rose-500">*</span>
                </Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Desconto">Desconto</SelectItem>
                    <SelectItem value="Bonificação">Bonificação</SelectItem>
                    <SelectItem value="Prazo Especial">Prazo Especial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label>
                  Descrição <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  placeholder="Ex: Desconto especial para compras acima de R$ 5.000"
                  className="bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Desconto (%)</Label>
                <Input
                  value={form.descontoPercent}
                  onChange={(e) => setForm({ ...form, descontoPercent: e.target.value })}
                  placeholder="0,00"
                  className="bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Desconto Fixo (R$)</Label>
                <Input
                  value={form.descontoFixo}
                  onChange={(e) => setForm({ ...form, descontoFixo: e.target.value })}
                  placeholder="0,00"
                  className="bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Valor Mínimo Pedido (R$)</Label>
                <Input
                  value={form.valorMinimo}
                  onChange={(e) => setForm({ ...form, valorMinimo: e.target.value })}
                  placeholder="0,00"
                  className="bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Qtd. Mínima Pedido</Label>
                <Input
                  type="number"
                  value={form.qtdMinima}
                  onChange={(e) => setForm({ ...form, qtdMinima: e.target.value })}
                  placeholder="0"
                  className="bg-white"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label>Prazo de Pagamento Especial (dias)</Label>
                <Input
                  value={form.prazoPagamento}
                  onChange={(e) => setForm({ ...form, prazoPagamento: e.target.value })}
                  placeholder="Ex: 45"
                  className="bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label>
                  Data de Início <span className="text-rose-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={form.dataInicio}
                  onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                  className="bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Data de Fim (opcional)</Label>
                <Input
                  type="date"
                  value={form.dataFim}
                  onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
                  className="bg-white"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label>Condições para Aplicação</Label>
                <Textarea
                  value={form.condicoes}
                  onChange={(e) => setForm({ ...form, condicoes: e.target.value })}
                  placeholder="Ex: Válido apenas para compras à vista, não acumulativo com outras promoções"
                  className="bg-white min-h-[80px]"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label>Categorias/Produtos Aplicáveis</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Digite e pressione Enter"
                    className="bg-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    className="shrink-0 bg-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((t) => (
                      <Badge
                        key={t}
                        variant="secondary"
                        className="pl-3 pr-1 py-1 flex items-center gap-1"
                      >
                        {t}{' '}
                        <X
                          onClick={() => setTags(tags.filter((x) => x !== t))}
                          className="w-3 h-3 ml-1 cursor-pointer hover:text-rose-500"
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label>Observações</Label>
                <Textarea
                  value={form.observacoes}
                  onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                  placeholder="Observações adicionais"
                  className="bg-white min-h-[80px]"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-3 pt-2">
                <Switch
                  checked={form.ativo}
                  onCheckedChange={(v) => setForm({ ...form, ativo: v })}
                />
                <Label className="font-bold text-slate-700">Acordo Ativo</Label>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Cadastrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
