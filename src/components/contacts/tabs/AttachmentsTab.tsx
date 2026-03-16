import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Upload, Trash2, Download, Image as ImageIcon, FileArchive } from 'lucide-react'

export default function AttachmentsTab() {
  const [files, setFiles] = useState([
    { id: 1, name: 'RG_Frente_Verso.pdf', size: '2.4 MB', date: '12/10/2025', type: 'pdf' },
    {
      id: 2,
      name: 'Comprovante_Residencia.jpg',
      size: '1.1 MB',
      date: '12/10/2025',
      type: 'image',
    },
    {
      id: 3,
      name: 'Contrato_Trabalho_Assinado.pdf',
      size: '3.5 MB',
      date: '15/10/2025',
      type: 'pdf',
    },
  ])

  const handleDelete = (id: number) => {
    setFiles(files.filter((f) => f.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-rose-500" />
      case 'image':
        return <ImageIcon className="w-8 h-8 text-blue-500" />
      default:
        return <FileArchive className="w-8 h-8 text-slate-500" />
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 bg-slate-50 flex flex-col items-center justify-center text-center hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group relative">
        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Upload className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="font-semibold text-slate-700 text-base mb-1">
          Clique para fazer upload ou arraste arquivos
        </h3>
        <p className="text-sm text-slate-500">PDF, JPG, PNG, DOCX (Max 10MB)</p>
        <Input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-slate-700 flex items-center gap-2">
          Arquivos Anexados{' '}
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
            {files.length}
          </span>
        </h4>

        {files.length === 0 ? (
          <div className="text-center p-6 text-slate-500 text-sm border border-slate-100 rounded-xl bg-slate-50/50">
            Nenhum arquivo anexado.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="shrink-0">{getIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {file.size} • Anexado em {file.date}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(file.id)}
                    className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
