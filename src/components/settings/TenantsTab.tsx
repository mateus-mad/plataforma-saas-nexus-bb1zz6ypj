import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, Plus, ArrowRight } from 'lucide-react'
import useTenantStore from '@/stores/useTenantStore'

export default function TenantsTab() {
  const { tenants, currentTenant, switchTenant } = useTenantStore()

  return (
    <div className="space-y-6 mt-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">Painel Multi-Empresas (CNPJs)</h3>
          <p className="text-sm text-slate-500">
            Gerencie múltiplas operações e filiais a partir de uma única conta gestora.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Adicionar CNPJ
        </Button>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="pl-6">Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Plano Contratado</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((t) => (
                <TableRow
                  key={t.id}
                  className={currentTenant?.id === t.id ? 'bg-primary/[0.02]' : ''}
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center border border-slate-200">
                        <Building2 className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="font-semibold text-slate-800">{t.name}</span>
                      {currentTenant?.id === t.id && (
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20 text-[10px]"
                        >
                          Ativo Agora
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{t.cnpj}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{t.plan}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">{t.users.length} ativos</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">
                      Regular
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    {currentTenant?.id !== t.id ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => switchTenant(t.id)}
                        className="text-primary hover:bg-primary/10"
                      >
                        Acessar <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 px-3 py-2">Em uso</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
