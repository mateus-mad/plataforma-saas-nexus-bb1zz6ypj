import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Upload, Trash2, Download } from 'lucide-react'

export default function SupplierContractsTab({ data, updateData }: any) {
  const [isDragging, setIsDragging] = useState(false)
  const contratos = data?.contratos?.lista || []

  const add = (file: File) => {
    updateData('contratos', 'lista', [
      ...contratos,
      {
        id: Date.now(),
        nome: file.name,
        data: new Date().toLocaleDateString('pt-BR'),
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      },
    ])
  }
  const rem = (id: number) =>
    updateData(
      'contratos',
      'lista',
      contratos.filter((c: any) => c.id !== id),
    )

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.[0]) add(e.dataTransfer.files[0])
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-blue-600" /> Contratos & Documentação
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Anexe vias assinadas de contratos e propostas aprovadas.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Gerar Novo Contrato
        </Button>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer relative overflow-hidden ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-slate-300 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400'}`}
      >
        <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-slate-400'}`} />
        </div>
        <h4 className="font-bold text-slate-700 text-lg mb-1">
          Arraste e solte o contrato em PDF aqui
        </h4>
        <p className="text-sm text-slate-500">Ou clique para selecionar arquivos (Max 20MB)</p>
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => {
            if (e.target.files?.[0]) add(e.target.files[0])
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contratos.map((c: any) => (
          <div
            key={c.id}
            className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-rose-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 truncate" title={c.nome}>
                {c.nome}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Enviado em {c.data} • {c.size || 'Desconhecido'}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 text-blue-600 border-blue-100 hover:bg-blue-50"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => rem(c.id)}
                className="h-9 w-9 text-rose-500 border-rose-100 hover:bg-rose-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
