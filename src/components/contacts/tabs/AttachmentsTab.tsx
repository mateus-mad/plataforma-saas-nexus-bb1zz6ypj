import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'

type Props = {
  data: any[]
  onChange: (v: any[]) => void
  readOnly?: boolean
}

export default function AttachmentsTab({ data = [], onChange, readOnly }: Props) {
  const [previewFile, setPreviewFile] = useState<any>(null)
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (readOnly) return
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      let type = 'archive'
      if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) type = 'image'
      if (ext === 'pdf') type = 'pdf'

      const newFile = {
        id: Date.now(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        date: new Date().toLocaleDateString('pt-BR'),
        type,
        file: file,
      }
      onChange([...data, newFile])
    }
  }

  const handleDelete = (id: number | string) => {
    if (readOnly) return
    onChange(data.filter((f: any) => f.id !== id))
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
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group relative',
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300',
          )}
        >
          <div
            className={cn(
              'w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 transition-transform',
              isDragging ? 'scale-110' : 'group-hover:scale-110',
            )}
          >
            <Upload className={cn('w-6 h-6', isDragging ? 'text-blue-600' : 'text-blue-500')} />
          </div>
          <h3 className="font-semibold text-slate-700 text-base mb-1">
            Arraste e solte arquivos aqui ou clique para selecionar
          </h3>
          <p className="text-sm text-slate-500">PDF, JPG, PNG, DOCX (Max 10MB)</p>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const ev = {
                  preventDefault: () => {},
                  dataTransfer: { files: e.target.files },
                } as any
                onDrop(ev)
              }
            }}
          />
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-semibold text-slate-700 flex items-center gap-2">
          Arquivos Anexados{' '}
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
            {data.length}
          </span>
        </h4>

        {data.length === 0 ? (
          <div className="text-center p-6 text-slate-500 text-sm border border-slate-100 rounded-xl bg-slate-50/50">
            Nenhum arquivo anexado.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((file: any) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="shrink-0">{getIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 truncate" title={file.name}>
                    {file.name}
                  </p>
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
