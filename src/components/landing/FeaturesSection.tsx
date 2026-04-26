import { ShieldAlert, BellRing, Fingerprint, LockKeyhole, ServerCrash, Cpu } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      title: 'Segurança Operacional',
      description:
        'Bloqueio automático de registros fora do horário de expediente não autorizados, evitando acúmulo indevido de horas extras e passivos ocultos. Gestão fina de jornadas com trava anti-fraude.',
      icon: ShieldAlert,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      className: 'md:col-span-2 md:row-span-2', // Large Block
    },
    {
      title: 'Alertas de Geofencing',
      description:
        'Notificações instantâneas no Painel Geral para tentativas de ponto fora do raio da obra.',
      icon: BellRing,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      className: 'md:col-span-1 md:row-span-1',
    },
    {
      title: 'Auditoria de Identidade',
      description:
        'Validação com registro fotográfico obrigatório no ato da marcação (Anti "Ponto Amigo").',
      icon: Fingerprint,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      className: 'md:col-span-1 md:row-span-1',
    },
    {
      title: 'Motor de Regras Flexível',
      description:
        'Gerencie turnos complexos, jornadas intermitentes e escalas de revezamento exclusivas da construção civil em um único motor centralizado e parametrizável.',
      icon: Cpu,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      className: 'md:col-span-1 md:row-span-2', // Tall Block
    },
    {
      title: 'Assinaturas Digitais Integradas',
      description:
        'Colete o aceite formal de políticas de banco de horas e compensações diretamente no app, com validade jurídica, hash SHA-256 e total rastreabilidade.',
      icon: LockKeyhole,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      className: 'md:col-span-2 md:row-span-1', // Wide Block
    },
    {
      title: 'Resiliência Offline Absoluta',
      description:
        'Canteiro de obras sem sinal de internet? O aplicativo armazena os registros criptografados localmente e sincroniza de forma transparente e automática assim que a conexão retornar.',
      icon: ServerCrash,
      color: 'text-slate-400',
      bg: 'bg-slate-800',
      border: 'border-slate-700',
      className: 'md:col-span-3 md:row-span-1', // Full Width Bottom
    },
  ]

  return (
    <section id="recursos" className="py-24 bg-white relative border-t border-slate-200">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold mb-6 border border-slate-200">
            Arquitetura de Alta Performance
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight leading-tight">
            Projetado para os Desafios Extremos do Campo.
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Da prevenção de fraudes à infraestrutura robusta que funciona sem internet. Nossas
            funcionalidades resolvem os problemas reais e complexos da gestão de ponto na engenharia
            civil.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`bg-slate-50 rounded-2xl border ${feature.border} p-6 sm:p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden group ${feature.className}`}
            >
              {/* Decorative gradient blob on hover */}
              <div
                className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${feature.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div
                className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 shrink-0 relative z-10 border ${feature.border}`}
              >
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>

              <div className="relative z-10 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-base leading-relaxed mt-auto">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
