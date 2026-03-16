import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { UserPlus, Shield, Trash2, AlertCircle } from 'lucide-react'
import useTenantStore, { PLAN_DETAILS } from '@/stores/useTenantStore'

export default function UsersTab() {
  const { currentTenant, addUser, removeUser } = useTenantStore()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (!currentTenant) return null

  const planInfo = PLAN_DETAILS[currentTenant.plan]
  const currentCount = currentTenant.users.length
  const maxCount = planInfo.maxUsers
  const usagePercentage = Math.min(100, (currentCount / maxCount) * 100)

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const success = addUser(currentTenant.id, {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
    })

    if (success) {
      toast({ title: 'Usuário adicionado com sucesso!' })
      setIsDialogOpen(false)
    } else {
      toast({
        title: 'Limite de Usuários Atingido',
        description: `O plano ${currentTenant.plan} permite até ${maxCount} usuários. Faça upgrade para adicionar mais.`,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6 mt-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">
            Controle de Acesso: {currentTenant.name}
          </h3>
          <p className="text-sm text-slate-500">
            Gerencie os colaboradores que têm acesso ao ambiente desta empresa.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={currentCount >= maxCount}>
              <UserPlus className="w-4 h-4 mr-2" /> Convidar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddUser}>
              <DialogHeader>
                <DialogTitle>Convidar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Este usuário terá acesso restrito ao ambiente da empresa{' '}
                  <strong>{currentTenant.name}</strong>.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input name="name" required placeholder="Ex: Ana Souza" />
                </div>
                <div className="space-y-2">
                  <Label>Email Institucional</Label>
                  <Input name="email" type="email" required placeholder="ana@empresa.com" />
                </div>
                <div className="space-y-2">
                  <Label>Nível de Acesso (Perfil)</Label>
                  <Select name="role" defaultValue="Analista">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gerente">Gerente Administrativo</SelectItem>
                      <SelectItem value="Analista">Analista Padrão</SelectItem>
                      <SelectItem value="Visualizador">Apenas Leitura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Enviar Convite</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 w-full max-w-lg">
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full ${usagePercentage > 90 ? 'bg-rose-500' : 'bg-primary'}`}
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-slate-700 shrink-0">
            {currentCount} de {maxCount === 9999 ? 'Ilimitado' : maxCount} em uso
          </span>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <Shield className="w-4 h-4" /> Plano {currentTenant.plan}
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="pl-6">Colaborador</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTenant.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="pl-6 font-medium text-slate-800">{user.name}</TableCell>
                  <TableCell className="text-slate-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-white">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-2 py-0">
                      Ativo
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => removeUser(currentTenant.id, user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {currentCount === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    Nenhum usuário cadastrado para esta empresa.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
