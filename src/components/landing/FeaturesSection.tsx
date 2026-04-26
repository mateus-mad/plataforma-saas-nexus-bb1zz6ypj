import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ShieldAlert, BellRing, Fingerprint, LockKeyhole, ServerCrash, Cpu } from 'lucide-react'

const valueProps = [
  {
    title: 'Segurança Operacional',
    description:
      'Bloqueio automático de registros fora do horário de expediente não autorizados, evitando acúmulo indevido de horas extras.',
    icon: ShieldAlert,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'hover:border-rose-200',
  },
  {
    title: 'Alertas de Geofencing em Tempo Real',
    description:
      'Receba notificações instantâneas no Painel Geral sempre que um colaborador tentar bater o ponto fora do raio de atuação permitido da obra.',
    icon: BellRing,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'hover:border-amber-200',
  },
  {
    title: 'Auditoria de Identidade',
    description:
      'Validação dupla com registro fotográfico no ato da marcação, criando um rastro incontestável e prevenindo a fraude do "ponto amigo".',
    icon: Fingerprint,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'hover:border-indigo-200',
  },
  {
    title: 'Motor de Regras Flexível',
    description:
      'Gerencie turnos complexos, jornadas intermitentes e escalas de revezamento exclusivas da construção civil em um único motor central.',
    icon: Cpu,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'hover:border-blue-200',
  },
  {
    title: 'Assinaturas Digitais Integradas',
    description:
      'Colete o aceite formal de políticas de banco de horas e compensações diretamente no app, com validade jurídica e rastreabilidade.',
    icon: LockKeyhole,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'hover:border-emerald-200',
  },
  {
    title: 'Resiliência Offline',
    description:
      'Canteiro de obras sem sinal de internet? O app armazena os registros criptografados e sincroniza automaticamente assim que a conexão retornar.',
    icon: ServerCrash,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'hover:border-slate-300',
  },
]

export function FeaturesSection() {
  return (
    <section id="recursos" className="py-24 bg-slate-50 relative border-t border-slate-200">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 tracking-tight">
            Projetado para os Desafios do Campo
          </h2>
          <p className="text-slate-600 text-lg">
            Da prevenção de fraudes à infraestrutura robusta. Nossas funcionalidades resolvem os
            problemas reais da gestão de ponto na engenharia civil e operações externas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueProps.map((feature, i) => (
            <Card
              key={i}
              className={`bg-white border-slate-200 ${feature.border} transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group`}
            >
              <CardHeader className="pb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl text-slate-900 leading-tight">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
