import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Map, Users, Activity, Crosshair, Fingerprint, RefreshCcw } from 'lucide-react'

const features = [
  {
    title: 'Cerca Virtual (Geofencing)',
    description:
      'Demarque perímetros exatos no mapa. O ponto só é validado se o colaborador estiver estritamente dentro da área da obra ou escritório.',
    icon: Map,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Gestão Inteligente de Equipes',
    description:
      'Administre turnos complexos, jornadas flexíveis e escalas de revezamento com um motor de regras que evita horas extras desnecessárias.',
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Monitoramento em Tempo Real',
    description:
      'Alertas imediatos sobre atrasos, faltas ou tentativas de marcação fora do local permitido. Aja antes que o problema afete a operação.',
    icon: Activity,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    title: 'Precisão Absoluta',
    description:
      'Algoritmos anti-fraude que detectam simulações de GPS (Mock Locations) e garantem a integridade da posição espacial.',
    icon: Crosshair,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    title: 'Validação de Identidade',
    description:
      'Exigência de registro fotográfico no ato da marcação, criando um rastro auditável e inquestionável de quem registrou o ponto.',
    icon: Fingerprint,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    title: 'Sincronização Resiliente',
    description:
      'Canteiro sem internet? O aplicativo armazena os registros com carimbo de tempo inviolável e sincroniza automaticamente quando houver conexão.',
    icon: RefreshCcw,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
]

export function FeaturesSection() {
  return (
    <section id="recursos" className="py-24 bg-slate-50 relative border-t border-slate-200">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Recursos Projetados para a Prática
          </h2>
          <p className="text-slate-600 text-lg">
            Nenhuma funcionalidade é acidental. Cada ferramenta foi desenvolvida para solucionar
            gargalos reais enfrentados diariamente por gestores e RHs em campo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="bg-white border-slate-200 hover:border-primary/50 transition-all shadow-sm hover:shadow-md relative overflow-hidden group"
            >
              <CardHeader className="p-8">
                <div
                  className={`w-14 h-14 rounded-lg ${feature.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl text-slate-900 mb-3">{feature.title}</CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
