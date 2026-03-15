import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ACTIVE_MODULES } from '@/config/modules'

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white relative border-t border-slate-200">
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-medium mb-4 uppercase tracking-wider text-sm">
            <span className="w-8 h-[1px] bg-primary"></span>
            Módulos Core Ativos
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            A base operacional perfeita.
          </h2>
          <p className="text-slate-600 max-w-2xl text-lg">
            Sistemas fundamentais já disponíveis para inicializar a transformação digital
            estruturada da sua gestão diária.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {ACTIVE_MODULES.map((module) => (
            <Card
              key={module.name}
              className="bg-slate-50 border-slate-200 hover:border-primary/50 transition-all shadow-sm hover:shadow-md relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-12 h-12 rounded bg-white border border-slate-200 flex items-center justify-center mb-6 text-primary group-hover:text-blue-600 transition-colors shadow-sm">
                  <module.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl text-slate-900 mb-2">{module.name}</CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
