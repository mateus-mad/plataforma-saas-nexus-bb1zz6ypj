import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Filter, Plus, MoreHorizontal, Mail, Phone, Lock, Unlock } from 'lucide-react'
import useSecurityStore from '@/stores/useSecurityStore'
import { db } from '@/lib/database'

const MOCK_CONTACTS = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@exemplo.com.br',
    phone: '(11) 98765-4321',
    category: 'Cliente',
    status: 'Ativo',
    avatar: '1',
  },
  {
    id: '2',
    name: 'Maria Souza',
    email: 'maria@techcorp.com',
    phone: '(21) 99887-6655',
    category: 'Fornecedor',
    status: 'Ativo',
    avatar: '2',
  },
  {
    id: '3',
    name: 'Carlos Pereira',
    email: 'carlos.p@industrias.com',
    phone: '(31) 97766-5544',
    category: 'Cliente',
    status: 'Inativo',
    avatar: '3',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana.costa@servicos.com',
    phone: '(41) 96655-4433',
    category: 'Parceiro',
    status: 'Ativo',
    avatar: '4',
  },
]

export default function Contacts() {
  const [contactsDB, setContactsDB] = useState<any[]>([])
  const [displayContacts, setDisplayContacts] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { isSetup, isAdminMode, encrypt, decrypt } = useSecurityStore()

  useEffect(() => {
    const loadDB = async () => {
      let data = (await db.get('contacts_v2')) as any[]
      if (!data) {
        if (isSetup) {
          data = await Promise.all(
            MOCK_CONTACTS.map(async (c) => ({
              ...c,
              name: await encrypt(c.name),
              email: await encrypt(c.email),
              phone: await encrypt(c.phone),
            })),
          )
        } else {
          data = MOCK_CONTACTS
        }
        await db.set('contacts_v2', data)
      }
      setContactsDB(data)
    }
    loadDB()
  }, [isSetup, encrypt])

  useEffect(() => {
    const computeDisplay = async () => {
      if (!isSetup) {
        setDisplayContacts(contactsDB)
      } else if (isAdminMode) {
        setDisplayContacts(
          contactsDB.map((c) => ({
            ...c,
            name: `[Encrypted] ${c.name?.substring(0, 12)}...`,
            email: `[Encrypted] ${c.email?.substring(0, 12)}...`,
            phone: `[Encrypted] ${c.phone?.substring(0, 12)}...`,
          })),
        )
      } else {
        const dec = await Promise.all(
          contactsDB.map(async (c) => ({
            ...c,
            name: await decrypt(c.name),
            email: await decrypt(c.email),
            phone: await decrypt(c.phone),
          })),
        )
        setDisplayContacts(dec)
      }
    }
    if (contactsDB.length > 0) computeDisplay()
  }, [contactsDB, isSetup, isAdminMode, decrypt])

  const handleAddContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    let name = formData.get('name') as string
    let email = formData.get('email') as string
    let phone = formData.get('phone') as string

    if (isSetup) {
      name = await encrypt(name)
      email = await encrypt(email)
      phone = await encrypt(phone)
    }

    const newContact = {
      id: Math.random().toString(),
      name,
      email,
      phone,
      category: (formData.get('category') as string) || 'Cliente',
      status: 'Ativo',
      avatar: Math.floor(Math.random() * 10).toString(),
    }

    const newDB = [newContact, ...contactsDB]
    setContactsDB(newDB)
    await db.set('contacts_v2', newDB)
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Contatos
            {isSetup && (
              <Badge
                variant="outline"
                className={
                  isAdminMode
                    ? 'bg-purple-50 text-purple-600 border-purple-200 ml-2'
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200 ml-2'
                }
              >
                {isAdminMode ? (
                  <Lock className="w-3 h-3 mr-1" />
                ) : (
                  <Unlock className="w-3 h-3 mr-1" />
                )}
                {isAdminMode ? 'Encrypted (Manager)' : 'E2E Decrypted'}
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">Gerencie seus clientes, fornecedores e parceiros.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <Filter className="w-4 h-4 mr-2" /> Filtros
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtros Avançados</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="cliente">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <Plus className="w-4 h-4 mr-2" /> Novo Contato
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddContact}>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Contato</DialogTitle>
                  <DialogDescription>
                    {isSetup
                      ? 'As informações serão criptografadas antes de salvar.'
                      : 'Insira as informações.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <Input name="name" required placeholder="Ex: João da Silva" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input name="email" type="email" required placeholder="joao@exemplo.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input name="phone" required placeholder="(00) 00000-0000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select name="category" defaultValue="Cliente">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cliente">Cliente</SelectItem>
                          <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Contato</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`https://img.usecurling.com/ppl/thumbnail?gender=male&seed=${contact.avatar}`}
                      />
                      <AvatarFallback>{isAdminMode ? '?' : contact.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span
                      className={`font-medium flex items-center gap-1.5 ${isAdminMode ? 'font-mono text-xs text-slate-500' : ''}`}
                    >
                      {isSetup &&
                        (isAdminMode ? (
                          <Lock className="w-3 h-3 text-purple-400" />
                        ) : (
                          <Unlock className="w-3 h-3 text-emerald-400 opacity-50" />
                        ))}
                      {contact.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={`flex flex-col space-y-1 ${isAdminMode ? 'font-mono text-[10px] text-slate-400' : 'text-sm text-muted-foreground'}`}
                  >
                    <span className="flex items-center gap-1">
                      {isAdminMode ? (
                        <Lock className="w-3 h-3 opacity-50" />
                      ) : (
                        <Mail className="w-3 h-3" />
                      )}{' '}
                      {contact.email}
                    </span>
                    <span className="flex items-center gap-1">
                      {isAdminMode ? (
                        <Lock className="w-3 h-3 opacity-50" />
                      ) : (
                        <Phone className="w-3 h-3" />
                      )}{' '}
                      {contact.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{contact.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={contact.status === 'Ativo' ? 'default' : 'secondary'}
                    className={
                      contact.status === 'Ativo'
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                        : ''
                    }
                  >
                    {contact.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
