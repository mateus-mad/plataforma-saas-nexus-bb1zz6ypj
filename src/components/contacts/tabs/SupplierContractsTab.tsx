import { Button } from '@/components/ui/button'
import {
  FileText,
  Plus,
  FileSignature,
  CheckCircle2,
  AlertTriangle,
  Download,
  Trash2,
} from 'lucide-react'

export default function SupplierContractsTab({ data, updateData }: any) {
  const list = data.contratos?.lista || []

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Gestão de Contratos
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Repositório central de minutas, contratos assinados e distratos.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Anexar Contrato
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="text-center p-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <FileSignature className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">
            Nenhum contrato formalizado com este fornecedor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {list.map((c: any, i: number) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-800 text-sm truncate">{c.titulo}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>Assinado em: {c.dataAssinatura}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>Vigência: {c.vigencia}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {c.status === 'Ativo' ? (
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Vigente
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Expirado
                  </span>
                )}
                <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-rose-500 hover:bg-rose-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
