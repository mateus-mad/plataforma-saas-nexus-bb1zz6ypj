import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { History, AlertCircle, CheckCircle2 } from 'lucide-react'
import pb from '@/lib/pocketbase/client'

export function ExtractionLogDialog({ entityId }: { entityId?: string }) {
  const [logs, setLogs] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && entityId) {
      setLoading(true)
      pb.collection('audit_logs')
        .getList(1, 20, {
          filter: `relacionamento_id = "${entityId}" && module = "extraction"`,
          sort: '-created',
        })
        .then((res) => {
          setLogs(res.items)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [open, entityId])

  if (!entityId) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="h-8 text-xs bg-white text-slate-600 shadow-sm border-slate-200 hover:bg-slate-50"
        >
          <History className="w-3.5 h-3.5 mr-1.5" />
          View Extraction History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Extraction Diagnostics Log</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : logs.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              No extraction history found for this record.
            </p>
          ) : (
            logs.map((log) => {
              const isError = log.old_value?.status === 'Error'
              return (
                <div
                  key={log.id}
                  className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex gap-3 shadow-sm"
                >
                  <div className="pt-0.5">
                    {isError ? (
                      <AlertCircle className="w-5 h-5 text-rose-500" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-sm text-slate-800">{log.action}</p>
                      <span className="text-xs font-medium text-slate-500">
                        {new Date(log.created).toLocaleString()}
                      </span>
                    </div>
                    {isError ? (
                      <p className="text-sm text-rose-600 mt-1.5 bg-rose-50 p-2 rounded border border-rose-100">
                        {log.old_value?.message || 'Unknown error occurred during extraction.'}
                      </p>
                    ) : (
                      <div className="mt-2.5 space-y-1.5 text-sm">
                        <p className="text-slate-600">
                          <span className="font-semibold text-slate-700">Captured:</span>{' '}
                          {log.new_value?.captured?.join(', ') || 'None'}
                        </p>
                        {log.new_value?.missing?.length > 0 && (
                          <p className="text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-100">
                            <span className="font-semibold">Missing:</span>{' '}
                            {log.new_value?.missing?.join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
