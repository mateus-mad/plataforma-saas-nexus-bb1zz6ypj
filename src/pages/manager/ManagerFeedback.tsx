import { Navigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Lightbulb, ChevronUp } from 'lucide-react'
import useSecurityStore from '@/stores/useSecurityStore'
import useManagerStore from '@/stores/useManagerStore'

export default function ManagerFeedback() {
  const { isAdminMode } = useSecurityStore()
  const { feedbacks } = useManagerStore()

  if (!isAdminMode) return <Navigate to="/app" />

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-purple-800 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-purple-600" /> Sugestões da Comunidade
          </h2>
          <p className="text-muted-foreground">
            Avalie feedbacks e atualize o roadmap da plataforma.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {feedbacks.map((f) => (
          <Card key={f.id} className="shadow-sm border-slate-200">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-100 min-w-[60px]">
                <ChevronUp className="w-5 h-5 text-slate-400" />
                <span className="font-bold text-slate-700">{f.upvotes}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 text-lg">{f.title}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Sugerido por cliente anonimizado • ID: {f.id}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                <Badge
                  variant="outline"
                  className={
                    f.status === 'Planned'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : f.status === 'New'
                        ? 'bg-slate-100 text-slate-700'
                        : ''
                  }
                >
                  {f.status}
                </Badge>
                <div className="w-40">
                  <Select defaultValue={f.status}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">Nova Sugestão</SelectItem>
                      <SelectItem value="Planned">No Roadmap</SelectItem>
                      <SelectItem value="In Development">Em Desenvolvimento</SelectItem>
                      <SelectItem value="Completed">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
