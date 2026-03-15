import { TrendingUp, Minimize2, Layers, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function GrowthSection() {
  const metrics = [
    {
      icon: TrendingUp,
      title: 'Aceleração de ROI',
      desc: 'Processos estruturados maximizam o retorno sobre investimento de forma sustentável e previsível.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      icon: Minimize2,
      title: 'Redução de Custos',
      desc: 'Identificação e eliminação de gargalos operacionais através de inteligência e análise de dados.',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      icon: Layers,
      title: 'Escalabilidade Linear',
      desc: 'Arquitetura modular que cresce proporcionalmente à expansão natural dos seus negócios e demandas.',
      color: 'text-indigo-600',
      bg: 'bg-indigo-100',
    },
    {
      icon: Zap,
      title: 'Eficiência Energética',
      desc: 'Automação de tarefas rotineiras, reduzindo drasticamente a carga cognitiva e o esforço manual.',
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
  ]

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Engenharia de Crescimento Econômico
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Não é apenas software. É um ecossistema rigorosamente projetado para gerar saúde
            econômica, otimizar recursos operacionais e impulsionar a eficiência em escala.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item, idx) => (
            <Card
              key={idx}
              className="bg-white border-slate-200 hover:border-slate-300 transition-colors shadow-sm group"
            >
              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 rounded-lg ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
