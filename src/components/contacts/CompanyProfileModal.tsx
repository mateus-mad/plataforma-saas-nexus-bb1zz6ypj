import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Building2,
  MapPin,
  Phone,
  Printer,
  Edit,
  CreditCard,
  Share2,
  CheckCircle2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function CompanyProfileModal({
  open,
  onOpenChange,
  onEdit,
  type,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onEdit: () => void
  type: 'client' | 'supplier'
}) {
  const { toast } = useToast()

  const printDoc = () => {
    toast({ title: 'Gerando PDF', description: 'O arquivo será baixado em instantes.' })
    setTimeout(() => {
      const blob = new Blob(['Ficha de Empresa'], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Ficha_${type}.pdf`
      a.click()
    }, 1500)
  }

  const shareProfile = () => {
    toast({ title: 'Link Gerado', description: 'Link copiado para a área de transferência.' })
    navigator.clipboard.writeText(window.location.origin + `/share/${type}/123`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] w-[95vw] h-[90vh] p-0 overflow-hidden bg-slate-50 border-none rounded-xl shadow-2xl flex flex-col">
        <div className="p-6 bg-white border-b border-slate-200 shrink-0 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 text-blue-900 font-medium text-sm md:absolute md:top-6 md:left-6">
            <Building2 className="w-4 h-4" /> Ficha de{' '}
            {type === 'client' ? 'Cliente' : 'Fornecedor'}
          </div>
          <div className="flex-1 md:pl-48 w-full">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-slate-100 shadow-sm shrink-0">
                <AvatarFallback className="text-xl font-bold bg-blue-50 text-blue-600">
                  {type === 'client' ? 'CL' : 'FO'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-2xl font-bold text-slate-800">
                    Empresa Exemplo LTDA
                  </DialogTitle>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ativo
                  </Badge>
                  <Badge variant="outline" className="bg-slate-50 font-mono text-slate-500">
                    12.345.678/0001-90
                  </Badge>
                </div>
                <DialogDescription className="text-slate-600 font-medium">
                  Setor: Solar
                </DialogDescription>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-4 md:mt-0 justify-end md:absolute md:top-6 md:right-6">
            <Button
              variant="outline"
              size="icon"
              onClick={shareProfile}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={printDoc}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Printer className="w-4 h-4 md:mr-2" />{' '}
              <span className="hidden md:inline">Baixar PDF</span>
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false)
                onEdit()
              }}
              className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              <Edit className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Editar</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm">
              <Building2 className="w-4 h-4 text-blue-500" /> Dados da Empresa
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Razão Social</p>
                <p className="text-sm font-medium">Empresa Exemplo LTDA</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Nome Fantasia</p>
                <p className="text-sm font-medium">Exemplo</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">CNPJ</p>
                <p className="text-sm font-medium">12.345.678/0001-90</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Inscrição Estadual</p>
                <p className="text-sm font-medium">Isento</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm">
              <Phone className="w-4 h-4 text-blue-500" /> Contato
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Responsável</p>
                <p className="text-sm font-medium">João Gestor</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">E-mail</p>
                <p className="text-sm font-medium">contato@exemplo.com</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Telefone</p>
                <p className="text-sm font-medium">(11) 3333-3333</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">WhatsApp</p>
                <p className="text-sm font-medium">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm">
              <MapPin className="w-4 h-4 text-blue-500" /> Endereço
            </h3>
            <div>
              <p className="text-xs text-slate-500 mb-1">Logradouro Completo</p>
              <p className="text-sm font-medium">Praça da Sé, 123, Sé - São Paulo/SP (01001-000)</p>
            </div>
          </div>

          {type === 'supplier' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm">
                <CreditCard className="w-4 h-4 text-blue-500" /> Dados Bancários
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Banco</p>
                  <p className="text-sm font-medium">341 - Itaú</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Agência</p>
                  <p className="text-sm font-medium">0001</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Conta</p>
                  <p className="text-sm font-medium">12345-6</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">PIX</p>
                  <p className="text-sm font-medium">-</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
