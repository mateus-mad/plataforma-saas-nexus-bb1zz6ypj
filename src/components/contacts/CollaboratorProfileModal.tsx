import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Building2, MapPin, Phone, Mail, FileText, CheckCircle2, X } from 'lucide-react'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CollaboratorProfileModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-slate-50 border-none rounded-xl shadow-2xl [&>button]:hidden">
        <div className="p-6 sm:p-8 bg-white border-b border-slate-200 relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src="https://img.usecurling.com/ppl/medium?gender=male&seed=1" />
              <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-700">
                MD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <DialogTitle className="text-2xl font-bold text-slate-800 tracking-tight">
                  Mateus Amorim Dias
                </DialogTitle>
                <Badge className="bg-emerald-500 text-white border-none shadow-sm mx-auto sm:mx-0 w-fit">
                  Ativo
                </Badge>
              </div>
              <DialogDescription className="text-slate-500 font-medium text-base flex items-center justify-center sm:justify-start gap-2">
                <Building2 className="w-4 h-4" /> Engenheiro Civil • # COL0001
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-blue-500" /> Informações Pessoais
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nacionalidade:</span>{' '}
                  <span className="font-medium text-slate-700">Brasileira</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nascimento:</span>{' '}
                  <span className="font-medium text-slate-700">15/05/1990</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estado Civil:</span>{' '}
                  <span className="font-medium text-slate-700">Casado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CPF:</span>{' '}
                  <span className="font-medium text-slate-700">123.456.789-00</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-blue-500" /> Dados Contratuais
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Admissão:</span>{' '}
                  <span className="font-medium text-slate-700">07/02/2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contrato:</span>{' '}
                  <span className="font-medium text-slate-700">CLT Mensalista</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CBO:</span>{' '}
                  <span className="font-medium text-slate-700">2142-05</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jornada:</span>{' '}
                  <span className="font-medium text-slate-700">44h Semanais</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Phone className="w-4 h-4 text-blue-500" /> Contato e Endereço
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">E-mail Corporativo</p>
                  <p className="font-medium text-slate-700">mateus.dias@empresa.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Celular (WhatsApp)</p>
                  <p className="font-medium text-slate-700">(11) 98765-4321</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Endereço Residencial</p>
                  <p className="font-medium text-slate-700">
                    Av. Paulista, 1000, Apto 45 - Bela Vista, São Paulo/SP
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-semibold text-blue-900 text-sm">Cadastro 45% Completo</p>
                <p className="text-xs text-blue-700">Ainda há dados pendentes para eSocial</p>
              </div>
            </div>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              Ver Detalhes Completos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
