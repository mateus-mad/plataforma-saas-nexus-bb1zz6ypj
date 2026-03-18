import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Users, Search, Plus, Trash2, Mail, Phone, Briefcase } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function SupplierContactsTab({ data, updateData }: any) {
  const { toast } = useToast()
  const pessoas = data?.contato?.pessoas || []

  const handleAutoFill = () => {
    toast({
      title: 'Sincronizando com Receita Federal',
      description: 'Buscando Quadro Societário...',
    })
    setTimeout(() => {
      const novosContatos = [
        {
          id: Date.now(),
          nome: 'Sócio Administrador (RFB)',
          cargo: 'Sócio / Diretoria',
          email: 'diretoria@empresa.com.br',
          telefone: '(11) 99999-9999',
        },
      ]

      // Preserve existing manual contacts, only append new synced ones to avoid overwriting
      updateData('contato', 'pessoas', [...pessoas, ...novosContatos])
      toast({
        title: 'Sucesso',
        description:
          'Contatos societários sincronizados e adicionados sem sobrescrever dados manuais.',
      })
    }, 1200)
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-blue-600" /> Contatos Estratégicos
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie os principais pontos de contato, gestores e diretoria deste fornecedor.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleAutoFill}
            className="bg-blue-50 flex-1 sm:flex-none border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <Search className="w-4 h-4 mr-2" /> Sincronizar RFB
          </Button>
          <Button
            onClick={add}
            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Contato
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {pessoas.map((p: any) => (
          <div
            key={p.id}
            className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm relative group hover:border-blue-300 transition-colors"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => remove(p.id)}
              className="absolute top-3 right-3 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity bg-rose-50 hover:bg-rose-100"
              title="Remover Contato"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pr-10">
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Nome Completo
                </Label>
                <Input
                  value={p.nome}
                  onChange={(e) => update(p.id, 'nome', e.target.value)}
                  className="bg-slate-50 focus:bg-white"
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Cargo / Função
                </Label>
                <Input
                  value={p.cargo}
                  onChange={(e) => update(p.id, 'cargo', e.target.value)}
                  className="bg-slate-50 focus:bg-white"
                  placeholder="Ex: Gerente de Contas"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> E-mail Direto
                </Label>
                <Input
                  type="email"
                  value={p.email}
                  onChange={(e) => update(p.id, 'email', e.target.value)}
                  className="bg-slate-50 focus:bg-white"
                  placeholder="joao@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Telefone / WhatsApp
                </Label>
                <Input
                  value={p.telefone}
                  onChange={(e) => update(p.id, 'telefone', e.target.value)}
                  className="bg-slate-50 focus:bg-white"
                  placeholder="(11) 90000-0000"
                />
              </div>
            </div>
          </div>
        ))}
        {pessoas.length === 0 && (
          <div className="text-center p-12 bg-white border-2 border-dashed border-slate-300 rounded-xl">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-semibold mb-1">
              Nenhum contato estratégico cadastrado.
            </p>
            <p className="text-sm text-slate-500">
              Clique em "Sincronizar RFB" ou adicione manualmente.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
