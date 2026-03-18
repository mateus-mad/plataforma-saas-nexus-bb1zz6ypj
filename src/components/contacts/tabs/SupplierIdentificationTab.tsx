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
import { Building2, User, Plus, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function SupplierIdentificationTab({ data, updateData }: any) {
  const d = data.dados || {}
  const isPJ = d.tipoPessoa === 'PJ'
  const [newSeg, setNewSeg] = useState('')
  const [loadingCnpj, setLoadingCnpj] = useState(false)
  const [editedFields, setEditedFields] = useState<Record<string, boolean>>({})
  const [segments, setSegments] = useState([
    'Tecnologia',
    'Logística',
    'Indústria',
    'Serviços',
    'Varejo',
  ])
  const { toast } = useToast()

  const handleUpdate = (field: string, value: any) => {
    setEditedFields((prev) => ({ ...prev, [field]: true }))
    updateData('dados', field, value)
  }

  const handleAddSeg = () => {
    if (newSeg && !segments.includes(newSeg)) setSegments([...segments, newSeg])
    handleUpdate('segmento', newSeg)
    setNewSeg('')
  }

  const handleCnpjSearch = async () => {
    if (!d.documento) {
      toast({ variant: 'destructive', title: 'Aviso', description: 'Informe o CNPJ primeiro.' })
      return
    }
    setLoadingCnpj(true)
    toast({ title: 'Buscando CNPJ', description: 'Consultando base da Receita Federal...' })

    setTimeout(() => {
      // Data simulada retornada da API CNPJ
      const fetchedData = {
        nomeRazao: 'NEXUS LOGÍSTICA S.A.',
        fantasia: 'NexusLog Transporte',
        ie: 'ISENTO',
        im: '987654321',
        dataNascimento: '2015-08-20',
        segmento: 'Logística',
      }

      // Atualiza apenas os campos que não foram editados manualmente pelo usuário
      Object.keys(fetchedData).forEach((key) => {
        if (!editedFields[key]) {
          updateData('dados', key, fetchedData[key as keyof typeof fetchedData])
        }
      })

      toast({
        title: 'Sucesso',
        description: 'Dados sincronizados. Alterações manuais mantidas com segurança.',
      })
      setLoadingCnpj(false)
    }, 1200)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex w-full sm:w-auto gap-2">
          <Button
            variant={isPJ ? 'default' : 'outline'}
            onClick={() => handleUpdate('tipoPessoa', 'PJ')}
            className="flex-1 sm:flex-none"
          >
            <Building2 className="w-4 h-4 mr-2" /> Pessoa Jurídica
          </Button>
          <Button
            variant={!isPJ ? 'default' : 'outline'}
            onClick={() => handleUpdate('tipoPessoa', 'PF')}
            className="flex-1 sm:flex-none"
          >
            <User className="w-4 h-4 mr-2" /> Pessoa Física
          </Button>
        </div>
        <div className="sm:ml-auto flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 w-full sm:w-auto justify-between sm:justify-start">
          <Label className="font-bold text-slate-700">Status Ativo</Label>
          <Switch checked={d.ativo} onCheckedChange={(v) => handleUpdate('ativo', v)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-2">
          <Label className="font-semibold text-slate-700">{isPJ ? 'CNPJ' : 'CPF'}</Label>
          <div className="flex gap-2">
            <Input
              value={d.documento || ''}
              onChange={(e) => handleUpdate('documento', e.target.value)}
              className="font-mono flex-1"
              placeholder={isPJ ? '00.000.000/0001-00' : '000.000.000-00'}
            />
            {isPJ && (
              <Button
                variant="outline"
                onClick={handleCnpjSearch}
                disabled={loadingCnpj}
                className="shrink-0 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                title="Sincronizar com Receita Federal"
              >
                <Search className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label className="font-semibold text-slate-700">
            {isPJ ? 'Razão Social' : 'Nome Completo'}
          </Label>
          <Input
            value={d.nomeRazao || ''}
            onChange={(e) => handleUpdate('nomeRazao', e.target.value)}
          />
        </div>

        {isPJ && (
          <div className="space-y-2 lg:col-span-3">
            <Label className="font-semibold text-slate-700">Nome Fantasia</Label>
            <Input
              value={d.fantasia || ''}
              onChange={(e) => handleUpdate('fantasia', e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="font-semibold text-slate-700">
            Data de {isPJ ? 'Abertura' : 'Nascimento'}
          </Label>
          <Input
            type="date"
            value={d.dataNascimento || ''}
            onChange={(e) => handleUpdate('dataNascimento', e.target.value)}
          />
        </div>

        {isPJ && (
          <>
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">Inscrição Estadual (IE)</Label>
              <Input
                value={d.ie || ''}
                onChange={(e) => handleUpdate('ie', e.target.value)}
                placeholder="ISENTO ou Número"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-slate-700">Inscrição Municipal (IM)</Label>
              <Input value={d.im || ''} onChange={(e) => handleUpdate('im', e.target.value)} />
            </div>
          </>
        )}

        <div className="space-y-2 lg:col-span-3 pt-2">
          <Label className="font-semibold text-slate-700">Segmento de Atuação</Label>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={d.segmento} onValueChange={(v) => handleUpdate('segmento', v)}>
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
                placeholder="Ou digite um novo..."
                value={newSeg}
                onChange={(e) => setNewSeg(e.target.value)}
                className="h-10 text-sm w-full sm:max-w-[200px]"
                onKeyDown={(e) => e.key === 'Enter' && handleAddSeg()}
              />
              <Button onClick={handleAddSeg} className="h-10 shrink-0" variant="secondary">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
