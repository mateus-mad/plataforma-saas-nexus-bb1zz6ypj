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
    <section id="modulos" className="py-24 bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-medium mb-4 uppercase tracking-wider text-sm">
            <span className="w-8 h-[1px] bg-primary"></span>
            Catálogo de Expansão
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Roadmap Modular de Engenharia
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Nossa arquitetura foi desenhada para integrar 17 novos módulos especializados. Conheça
            as extensões planejadas que completarão o ecossistema tático.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {categories.map((category, idx) => {
            const catModules = UPCOMING_MODULES.filter((m) => category.modules.includes(m.name))
            return (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-slate-900 border border-slate-800 rounded-lg px-6 data-[state=open]:border-primary/50 overflow-hidden"
              >
                <AccordionTrigger className="text-lg font-semibold text-slate-200 hover:no-underline hover:text-primary py-6">
                  <div className="flex items-center gap-4">
                    <span>{category.name}</span>
                    <Badge
                      variant="outline"
                      className="bg-slate-950 text-slate-400 border-slate-700 font-normal"
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
                        className="flex gap-4 p-4 rounded bg-slate-950 border border-slate-800/50 transition-colors hover:border-slate-700"
                      >
                        <div className="mt-1 bg-slate-900 p-2 rounded text-primary border border-slate-800 h-fit shadow-inner">
                          <module.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-200">{module.name}</h4>
                          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
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
