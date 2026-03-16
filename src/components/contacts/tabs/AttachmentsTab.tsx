import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  FileText,
  Upload,
  Trash2,
  Download,
  Image as ImageIcon,
  FileArchive,
  Eye,
} from 'lucide-react'

export default function AttachmentsTab({ readOnly }: { readOnly?: boolean }) {
  const [previewFile, setPreviewFile] = useState<any>(null)
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
    if (readOnly) return
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
      {!readOnly && (
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
      )}

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
                    onClick={() => setPreviewFile(file)}
                    className="h-8 w-8 text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(file.id)}
                      className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!previewFile} onOpenChange={(o) => !o && setPreviewFile(null)}>
        <DialogContent className="max-w-4xl p-1 bg-transparent border-none shadow-none">
          <div className="bg-white rounded-xl overflow-hidden p-6 text-center border border-slate-200 shadow-2xl relative">
            {previewFile?.type === 'image' ? (
              <img
                src="https://img.usecurling.com/p/800/600?q=document"
                alt="Preview do Documento"
                className="max-w-full h-auto rounded-lg mx-auto"
              />
            ) : (
              <div className="py-24 text-slate-500 flex flex-col items-center justify-center">
                <FileText className="w-20 h-20 mx-auto text-rose-500 mb-6" />
                <p className="text-2xl font-bold text-slate-800 mb-2">Visualização de PDF</p>
                <p className="text-sm font-medium mb-6">Arquivo: {previewFile?.name}</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" /> Fazer Download para Abrir
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
