import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Building2, User, Plus } from 'lucide-react'

export default function SupplierIdentificationTab({ data, updateData }: any) {
  const d = data.dados || {}
  const isPJ = d.tipoPessoa === 'PJ'
  const [newSeg, setNewSeg] = useState('')
  const [segments, setSegments] = useState([
    'Tecnologia',
    'Logística',
    'Indústria',
    'Serviços',
    'Varejo',
  ])

  const handleAddSeg = () => {
    if (newSeg && !segments.includes(newSeg)) setSegments([...segments, newSeg])
    updateData('dados', 'segmento', newSeg)
    setNewSeg('')
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <Button
          variant={isPJ ? 'default' : 'outline'}
          onClick={() => updateData('dados', 'tipoPessoa', 'PJ')}
          className="w-full sm:w-auto"
        >
          <Building2 className="w-4 h-4 mr-2" /> Pessoa Jurídica
        </Button>
        <Button
          variant={!isPJ ? 'default' : 'outline'}
          onClick={() => updateData('dados', 'tipoPessoa', 'PF')}
          className="w-full sm:w-auto"
        >
          <User className="w-4 h-4 mr-2" /> Pessoa Física
        </Button>
        <div className="sm:ml-auto flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 w-full sm:w-auto justify-between sm:justify-start">
          <Label className="font-bold text-slate-700">Status Ativo</Label>
          <Switch checked={d.ativo} onCheckedChange={(v) => updateData('dados', 'ativo', v)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-2">
          <Label className="font-semibold text-slate-700">{isPJ ? 'CNPJ' : 'CPF'}</Label>
          <Input
            value={d.documento || ''}
            onChange={(e) => updateData('dados', 'documento', e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label className="font-semibold text-slate-700">
            {isPJ ? 'Razão Social' : 'Nome Completo'}
          </Label>
          <Input
            value={d.nomeRazao || ''}
            onChange={(e) => updateData('dados', 'nomeRazao', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="font-semibold text-slate-700">
            Data de {isPJ ? 'Abertura' : 'Nascimento'}
          </Label>
          <Input
            type="date"
            value={d.dataNascimento || ''}
            onChange={(e) => updateData('dados', 'dataNascimento', e.target.value)}
          />
        </div>

        {isPJ && (
          <>
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">Inscrição Estadual (IE)</Label>
              <Input
                value={d.ie || ''}
                onChange={(e) => updateData('dados', 'ie', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">Inscrição Municipal (IM)</Label>
              <Input
                value={d.im || ''}
                onChange={(e) => updateData('dados', 'im', e.target.value)}
              />
            </div>
          </>
        )}

        <div className="space-y-2 lg:col-span-3 pt-2">
          <Label className="font-semibold text-slate-700">Segmento de Atuação</Label>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={d.segmento} onValueChange={(v) => updateData('dados', 'segmento', v)}>
              <SelectTrigger className="w-full sm:max-w-xs bg-slate-50">
                <SelectValue placeholder="Selecione um segmento" />
              </SelectTrigger>
              <SelectContent>
                {segments.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Adicionar novo..."
                value={newSeg}
                onChange={(e) => setNewSeg(e.target.value)}
                className="h-10 text-sm max-w-[200px]"
              />
              <Button onClick={handleAddSeg} className="h-10 shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
