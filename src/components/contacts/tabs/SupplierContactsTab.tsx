import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Users, Search, Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function SupplierContactsTab({ data, updateData }: any) {
  const { toast } = useToast()
  const pessoas = data?.contato?.pessoas || []

  const handleAutoFill = () => {
    toast({ title: 'Sincronizando...', description: 'Buscando contatos na Receita Federal.' })
    setTimeout(() => {
      updateData('contato', 'pessoas', [
        ...pessoas,
        {
          id: Date.now(),
          nome: 'Sócio Administrador',
          cargo: 'Diretoria',
          email: 'diretoria@empresa.com',
          telefone: '(11) 9999-9999',
        },
      ])
      toast({ title: 'Sucesso', description: 'Contatos sincronizados da base pública.' })
    }, 1000)
  }

  const add = () =>
    updateData('contato', 'pessoas', [
      ...pessoas,
      { id: Date.now(), nome: '', cargo: '', email: '', telefone: '' },
    ])
  const remove = (id: number) =>
    updateData(
      'contato',
      'pessoas',
      pessoas.filter((p: any) => p.id !== id),
    )
  const update = (id: number, field: string, val: string) => {
    updateData(
      'contato',
      'pessoas',
      pessoas.map((p: any) => (p.id === id ? { ...p, [field]: val } : p)),
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-50/80 p-5 rounded-xl border border-blue-100 shadow-sm">
        <div>
          <h3 className="font-bold text-blue-900 flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" /> Contatos Estratégicos
          </h3>
          <p className="text-sm text-blue-800/80 mt-1">
            Gerencie os principais pontos de contato deste fornecedor.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleAutoFill}
            className="bg-white flex-1 sm:flex-none border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Search className="w-4 h-4 mr-2" /> CNPJ Auto-Fill
          </Button>
          <Button
            onClick={add}
            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {pessoas.map((p: any) => (
          <div
            key={p.id}
            className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm relative group hover:border-blue-200 transition-colors"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => remove(p.id)}
              className="absolute top-3 right-3 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity bg-rose-50 hover:bg-rose-100"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pr-10">
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold">Nome Completo</Label>
                <Input
                  value={p.nome}
                  onChange={(e) => update(p.id, 'nome', e.target.value)}
                  className="bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold">Cargo / Função</Label>
                <Input
                  value={p.cargo}
                  onChange={(e) => update(p.id, 'cargo', e.target.value)}
                  className="bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold">E-mail Direto</Label>
                <Input
                  value={p.email}
                  onChange={(e) => update(p.id, 'email', e.target.value)}
                  className="bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold">Telefone / WhatsApp</Label>
                <Input
                  value={p.telefone}
                  onChange={(e) => update(p.id, 'telefone', e.target.value)}
                  className="bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
            </div>
          </div>
        ))}
        {pessoas.length === 0 && (
          <div className="text-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Nenhum contato estratégico cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
