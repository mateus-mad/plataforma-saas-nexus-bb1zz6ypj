import { UPCOMING_MODULES } from '@/config/modules'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

export function RoadmapSection() {
  const categories = [
    {
      name: 'Engenharia & Obras',
      modules: ['Gestão de Obras', 'Orçamento de Obra', 'Locação de Equipamentos'],
    },
    {
      name: 'Energia Solar',
      modules: ['Gerador de Proposta Solar', 'Sistema de Monitoramento Solar'],
    },
    {
      name: 'Gestão de Ativos',
      modules: ['Gestão de Frotas', 'Gestão de Equipamentos'],
    },
    {
      name: 'Capital Humano & Rotina',
      modules: [
        'Recurso Humanos',
        'Controle de Ponto',
        'Sistema de Automação de Tarefas',
        'Escritório Virtual',
      ],
    },
    {
      name: 'Comercial & Documentos',
      modules: ['CRM', 'Gerador de Proposta e Documentos'],
    },
    {
      name: 'Dados & Analytics',
      modules: [
        'Dashboards Modulares',
        'Relatórios Avançados',
        'Dashboard Builder',
        'BI Gerencial',
      ],
    },
  ]

  return (
    <section id="modulos" className="py-24 bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-medium mb-4 uppercase tracking-wider text-sm">
            <span className="w-8 h-[1px] bg-primary"></span>
            Catálogo de Expansão
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Roadmap Modular Autônomo
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Nossa arquitetura foi desenhada para integrar 17 novos módulos especializados.
            <strong className="font-semibold text-slate-900">
              {' '}
              Cada módulo possui autonomia total:{' '}
            </strong>
            você pode assinar e utilizar apenas o sistema que precisa de forma unitária, garantindo
            flexibilidade e economia real.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {categories.map((category, idx) => {
            const catModules = UPCOMING_MODULES.filter((m) => category.modules.includes(m.name))
            return (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-slate-50 border border-slate-200 rounded-lg px-6 data-[state=open]:border-primary/50 overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline hover:text-primary py-6">
                  <div className="flex items-center gap-4">
                    <span>{category.name}</span>
                    <Badge
                      variant="outline"
                      className="bg-white text-slate-600 border-slate-200 font-normal"
                    >
                      {catModules.length} módulos
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {catModules.map((module) => (
                      <div
                        key={module.name}
                        className="flex gap-4 p-4 rounded-lg bg-white border border-slate-200 transition-colors hover:border-slate-300"
                      >
                        <div className="mt-1 bg-slate-50 p-2 rounded-md text-primary border border-slate-200 h-fit shadow-sm">
                          <module.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{module.name}</h4>
                          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            {module.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}
