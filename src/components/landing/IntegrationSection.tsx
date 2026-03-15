import { Workflow, Database, Cloud, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function IntegrationSection() {
  const features = [
    {
      icon: Database,
      title: 'ERPs Legados',
      desc: 'Sincronização bidirecional com SAP, Totvs, Oracle e outros ERPs de mercado.',
    },
    {
      icon: Workflow,
      title: 'Arquitetura API-First',
      desc: 'APIs RESTful e GraphQL prontas para conectar com suas ferramentas internas.',
    },
    {
      icon: Cloud,
      title: 'Webhooks em Tempo Real',
      desc: 'Automação inteligente reagindo a eventos do seu ecossistema corporativo.',
    },
    {
      icon: Lock,
      title: 'Governança & SSO',
      desc: 'Integração com Active Directory e provedores de identidade corporativa.',
    },
  ]

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-medium mb-4 uppercase tracking-wider text-sm">
            <span className="w-8 h-[1px] bg-primary"></span>
            Ecossistema Aberto
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Conectividade de Mercado
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            O Nexus foi projetado para se integrar ao seu fluxo de trabalho atual. Conecte seu ERP,
            ferramentas de CRM e sistemas legados em uma única camada operacional unificada.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="bg-white border-slate-200 hover:border-primary/30 transition-all shadow-sm group"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform shadow-sm">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-white border border-slate-200 rounded-2xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 shadow-sm">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50" />

          <div className="z-10 bg-slate-50 px-6 py-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center min-w-[120px]">
            <span className="font-semibold text-slate-700 uppercase tracking-wider">
              ERP Externo
            </span>
          </div>

          <div className="z-10 hidden md:block w-16 h-[2px] bg-slate-300 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>

          <div className="z-10 bg-primary text-white px-8 py-5 rounded-xl shadow-lg shadow-primary/20 font-bold text-xl border border-primary-foreground/10">
            NEXUS
          </div>

          <div className="z-10 hidden md:block w-16 h-[2px] bg-slate-300 relative">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-ping"
              style={{ animationDelay: '500ms' }}
            />
          </div>

          <div className="z-10 bg-slate-50 px-6 py-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center min-w-[120px]">
            <span className="font-semibold text-slate-700 uppercase tracking-wider">
              Sistemas CRM
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
