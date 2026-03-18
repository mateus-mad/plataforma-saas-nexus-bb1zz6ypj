import {
  FileText,
  MessageSquare,
  Truck,
  DollarSign,
  PhoneCall,
  RefreshCcw,
  ShieldAlert,
} from 'lucide-react'

const history = [
  {
    id: 1,
    type: 'order',
    date: '14/03/2026 - 10:30',
    title: 'Pedido #4928 Recebido',
    desc: 'Mercadorias entregues sem avarias e no prazo acordado (Nota Fiscal #88321).',
    icon: Truck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    border: 'border-emerald-200',
  },
  {
    id: 2,
    type: 'payment',
    date: '10/03/2026 - 14:15',
    title: 'Pagamento Realizado',
    desc: 'Fatura FT-992 liquidada via PIX (R$ 4.500,00) de forma antecipada.',
    icon: DollarSign,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
  },
  {
    id: 3,
    type: 'call',
    date: '05/03/2026 - 09:00',
    title: 'Reunião de Alinhamento (Q1)',
    desc: 'Ajuste de escopo e renegociação de prazos com a diretoria comercial. Fornecedor concordou em manter SLA de 4 dias.',
    icon: PhoneCall,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
    border: 'border-indigo-200',
  },
  {
    id: 4,
    type: 'status',
    date: '15/02/2026 - 16:20',
    title: 'Atualização de Status',
    desc: 'O status do fornecedor foi alterado de "Em Análise" para "Ativo - Aprovado" pela auditoria de compliance.',
    icon: ShieldAlert,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
    border: 'border-amber-200',
  },
  {
    id: 5,
    type: 'contract',
    date: '01/02/2026 - 11:20',
    title: 'Renovação de Contrato Comercial',
    desc: 'Termos comerciais atualizados para o exercício de 2026. Desconto padrão fixado em 5%.',
    icon: FileText,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    border: 'border-purple-200',
  },
  {
    id: 6,
    type: 'issue',
    date: '15/12/2025 - 16:40',
    title: 'Registro de Ocorrência (Atraso de Entrega)',
    desc: 'Entrega do pedido #4810 atrasou 2 dias. Justificado por problemas logísticos externos (Greve). Sem impacto crítico na operação.',
    icon: MessageSquare,
    color: 'text-rose-600',
    bg: 'bg-rose-100',
    border: 'border-rose-200',
  },
  {
    id: 7,
    type: 'sync',
    date: '10/11/2025 - 08:15',
    title: 'Sincronização de Cadastro',
    desc: 'Dados societários e endereço atualizados automaticamente via integração com a Receita Federal.',
    icon: RefreshCcw,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'border-slate-200',
  },
]

export default function SupplierHistoryTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full -z-10 opacity-50" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10">
          <div>
            <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Histórico Completo de Interações
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Timeline unificada de eventos, compras, pagamentos, ocorrências e atualizações.
            </p>
          </div>
        </div>

        <div className="relative pl-8 sm:pl-10 border-l-2 border-slate-100 space-y-8 py-2 ml-2 sm:ml-4 z-10">
          {history.map((h) => (
            <div key={h.id} className="relative group">
              <div
                className={`absolute -left-[41px] sm:-left-[49px] top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white ${h.bg} shadow-sm group-hover:scale-110 transition-transform`}
              >
                <h.icon className={`w-4 h-4 ${h.color}`} />
              </div>
              <div
                className={`bg-slate-50 rounded-xl p-4 sm:p-5 border ${h.border} hover:bg-white transition-colors hover:shadow-md`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                  <h4 className="text-base font-bold text-slate-800">{h.title}</h4>
                  <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 whitespace-nowrap shadow-sm">
                    {h.date}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{h.desc}</p>
              </div>
            </div>
          ))}

          <div className="relative group pt-4">
            <div className="absolute -left-[35px] sm:-left-[43px] top-4 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white bg-slate-200 shadow-sm" />
            <p className="text-sm text-slate-400 font-medium italic">
              Início do relacionamento com o fornecedor no sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
