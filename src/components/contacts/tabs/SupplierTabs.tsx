import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LabelT } from './CompanyTabs'
import {
  Building,
  User,
  Search,
  Briefcase,
  Plus,
  Trash2,
  DollarSign,
  CheckCircle2,
  ShieldAlert,
  FileSignature,
  MapPin,
  Clock,
  History,
  CalendarIcon,
  Percent,
  AlertTriangle,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// Implementation of SupplierIdentificationTab
export function SupplierIdentificationTab({ data, updateData, validateCompliance }: any) {
  const isPJ = data.dados?.tipoPessoa === 'PJ'

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex gap-6 items-center mb-6 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="relative w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center hover:border-blue-500 overflow-hidden shrink-0 group">
          {data.dados?.logo ? (
            <img src={data.dados.logo} className="w-full h-full object-contain p-1 bg-white" />
          ) : (
            <span className="text-slate-400 font-bold text-xl">
              {data.dados?.nomeRazao?.charAt(0) || 'F'}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-slate-800">Logo do Fornecedor</h4>
          <p className="text-xs text-slate-500 mb-2">Visível em pedidos e cotações.</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs bg-white text-slate-700 shadow-sm"
            >
              Alterar Imagem
            </Button>
          </div>
        </div>
        <div className="hidden md:block w-px h-16 bg-slate-200"></div>
        <div className="hidden md:flex flex-col gap-2 w-64 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Compliance Fiscal</span>
            {data.dados?.complianceStatus === 'valid' ? (
              <Badge className="bg-emerald-100 text-emerald-700 border-none shadow-none text-[10px]">
                Validado
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-700 border-none shadow-none text-[10px]">
                Pendente
              </Badge>
            )}
          </div>
          {data.dados?.complianceStatus !== 'valid' && (
            <Button size="sm" onClick={validateCompliance} className="h-7 text-xs w-full">
              Validar na Receita Federal
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => updateData('dados', 'tipoPessoa', 'PJ')}
            className={cn(
              'px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2',
              isPJ
                ? 'bg-white shadow-sm text-slate-800 border border-slate-200'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            <Building className="w-4 h-4" /> Pessoa Jurídica
          </button>
          <button
            type="button"
            onClick={() => updateData('dados', 'tipoPessoa', 'PF')}
            className={cn(
              'px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2',
              !isPJ
                ? 'bg-white shadow-sm text-slate-800 border border-slate-200'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            <User className="w-4 h-4" /> Pessoa Física
          </button>
        </div>
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <Label className="text-sm font-semibold cursor-pointer">Fornecedor Homologado</Label>
          <Switch
            checked={data.dados?.ativo !== false}
            onCheckedChange={(v) => updateData('dados', 'ativo', v)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
          <LabelT l={isPJ ? 'CNPJ' : 'CPF'} req />
          <div className="flex gap-2">
            <Input
              value={data.dados?.documento || ''}
              onChange={(e) => updateData('dados', 'documento', e.target.value)}
              className="font-mono bg-white"
            />
            {isPJ && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0 text-blue-600 hover:text-blue-700 bg-blue-50 border-blue-200"
              >
                <Search className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <LabelT l={isPJ ? 'Razão Social' : 'Nome Completo'} req />
          <Input
            value={data.dados?.nomeRazao || ''}
            onChange={(e) => updateData('dados', 'nomeRazao', e.target.value)}
            className="bg-white"
          />
        </div>
        {isPJ && (
          <div className="space-y-1.5">
            <LabelT l="Nome Fantasia" />
            <Input
              value={data.dados?.fantasia || ''}
              onChange={(e) => updateData('dados', 'fantasia', e.target.value)}
              className="bg-white"
            />
          </div>
        )}
        {isPJ && (
          <>
            <div className="space-y-1.5">
              <LabelT l="Inscrição Estadual (IE)" />
              <Input
                value={data.dados?.ie || ''}
                onChange={(e) => updateData('dados', 'ie', e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <LabelT l="Inscrição Municipal (IM)" />
              <Input
                value={data.dados?.im || ''}
                onChange={(e) => updateData('dados', 'im', e.target.value)}
                className="bg-white"
              />
            </div>
          </>
        )}
        <div className="space-y-1.5">
          <LabelT l="Categoria Principal" />
          <Input
            value={data.dados?.segmento || ''}
            onChange={(e) => updateData('dados', 'segmento', e.target.value)}
            placeholder="Ex: Materiais de Construção"
            className="bg-white"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-blue-500" /> Endereço de Origem (CD/Fábrica)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5 md:col-span-1">
            <LabelT l="CEP" req />
            <Input
              value={data.endereco?.cep || ''}
              onChange={(e) => updateData('endereco', 'cep', e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <LabelT l="Logradouro" req />
            <Input
              value={data.endereco?.logradouro || ''}
              onChange={(e) => updateData('endereco', 'logradouro', e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Número" req />
            <Input
              value={data.endereco?.numero || ''}
              onChange={(e) => updateData('endereco', 'numero', e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Bairro" req />
            <Input
              value={data.endereco?.bairro || ''}
              onChange={(e) => updateData('endereco', 'bairro', e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <LabelT l="Cidade/UF" req />
            <div className="flex gap-2">
              <Input
                value={data.endereco?.cidade || ''}
                onChange={(e) => updateData('endereco', 'cidade', e.target.value)}
                className="bg-white flex-1"
                placeholder="Cidade"
              />
              <Input
                value={data.endereco?.estado || ''}
                onChange={(e) => updateData('endereco', 'estado', e.target.value)}
                className="bg-white w-20"
                placeholder="UF"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stub implementations to satisfy the imports
export function SupplierContactsTab({ data, updateData }: any) {
  return (
    <div className="text-center p-8 text-slate-500">
      Aba de Contatos de Fornecedor (similar a Clientes)
    </div>
  )
}

export function SupplierFinancialDashTab({ data }: any) {
  return (
    <div className="text-center p-8 text-slate-500">Aba de Dashboard Financeiro do Fornecedor</div>
  )
}

export function SupplierBankingDashTab({ data, updateData }: any) {
  return <div className="text-center p-8 text-slate-500">Aba Bancária do Fornecedor</div>
}

export function SupplierAgreementsTab({ data, updateData }: any) {
  return <div className="text-center p-8 text-slate-500">Aba de SLA de Fornecedor</div>
}

export function SupplierRelationshipTab({ data, updateData }: any) {
  return (
    <div className="text-center p-8 text-slate-500">Aba de Relacionamento (CRM) do Fornecedor</div>
  )
}

export function SupplierHistoryTab() {
  return <div className="text-center p-8 text-slate-500">Histórico de Auditoria do Fornecedor</div>
}
