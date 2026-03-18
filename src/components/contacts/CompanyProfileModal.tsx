import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import SupplierProfileView from './SupplierProfileView'

export default function CompanyProfileModal({
  open,
  onOpenChange,
  onEdit,
  type,
  companyData,
}: any) {
  // If the entity is a supplier, use the specialized Supplier Dashboard
  if (type === 'supplier') {
    return (
      <SupplierProfileView
        open={open}
        onOpenChange={onOpenChange}
        onEdit={onEdit}
        companyData={companyData}
      />
    )
  }

  // Fallback simplified view for clients
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] border-none shadow-2xl p-6 bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">
            {companyData?.name || 'Cliente'}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {companyData?.location || 'Localização não informada'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Status</p>
              <p className="font-semibold text-slate-800">
                {companyData?.status || 'Desconhecido'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">E-mail</p>
              <p className="font-semibold text-slate-800">{companyData?.email || '-'}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            A visão detalhada de Dashboard para Clientes está em desenvolvimento e será lançada na
            próxima atualização do módulo de Relacionamento. Para editar os dados deste cliente,
            clique no botão abaixo.
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false)
              if (onEdit) onEdit()
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Editar Dados
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
