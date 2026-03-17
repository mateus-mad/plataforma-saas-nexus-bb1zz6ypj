import { Dialog } from '@/components/ui/dialog'
import ClientProfileView from './ClientProfileView'
import SupplierProfileView from './SupplierProfileView'

export default function CompanyProfileModal({
  open,
  onOpenChange,
  onEdit,
  type,
  companyData,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onEdit: () => void
  type: 'client' | 'supplier'
  companyData?: any
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {type === 'supplier' ? (
        <SupplierProfileView
          onOpenChange={onOpenChange}
          onEdit={onEdit}
          companyData={companyData}
          type={type}
        />
      ) : (
        <ClientProfileView
          onOpenChange={onOpenChange}
          onEdit={onEdit}
          companyData={companyData}
          type={type}
        />
      )}
    </Dialog>
  )
}
