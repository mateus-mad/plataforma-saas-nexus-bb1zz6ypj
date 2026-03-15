import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { ACTIVE_MODULES, UPCOMING_MODULES } from '@/config/modules'

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 overflow-hidden relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      <div className="container mx-auto px-4 text-center max-w-5xl">
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 animate-slide-up"
          style={{ animationDelay: '0ms' }}
        >
          A plataforma definitiva para <span className="text-primary">gerir sua empresa</span>
        </h1>
        <p
          className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          De contatos e finanças a dezenas de módulos especializados. O NexusERP cresce com o seu
          negócio em uma única interface moderna e escalável.
        </p>
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          <Button
            size="lg"
            className="text-lg h-14 px-8 shadow-elevation hover:scale-[1.02] transition-transform"
            asChild
          >
            <Link to="/app">
              Começar Teste Grátis <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-white" asChild>
            <a href="#roadmap">Ver Roadmap</a>
          </Button>
        </div>

        <div
          className="mt-20 relative mx-auto w-full max-w-5xl animate-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          <div className="rounded-2xl border bg-white shadow-elevation p-2">
            <img
              src="https://img.usecurling.com/p/1200/600?q=dashboard&color=white&dpr=2"
              alt="Dashboard Preview"
              className="w-full rounded-xl border border-slate-100"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Módulos Iniciais Ativos</h2>
          <p className="text-slate-600">
            A base perfeita para começar a transformar sua gestão hoje mesmo.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {ACTIVE_MODULES.map((module) => (
            <Card
              key={module.name}
              className="border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <module.icon className="w-6 h-6" />
                </div>
                <CardTitle>{module.name}</CardTitle>
                <CardDescription>
                  {module.name === 'Dashboard' && 'Visão consolidada em tempo real.'}
                  {module.name === 'Contatos' && 'Gestão centralizada de clientes e fornecedores.'}
                  {module.name === 'Financeiro' &&
                    'Controle total de entradas, saídas e fluxo de caixa.'}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export function RoadmapSection() {
  return (
    <section id="roadmap" className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Prontos para o Futuro</h2>
        <p className="text-slate-400 mb-16 max-w-2xl mx-auto">
          Nossa arquitetura foi desenhada para escalar. Conheça os próximos módulos que
          transformarão o Nexus no único software que você precisará.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {UPCOMING_MODULES.map((module, i) => (
            <div
              key={module.name}
              className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col items-center gap-3 hover:bg-slate-800 transition-colors opacity-80 hover:opacity-100 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <module.icon className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium text-slate-300">{module.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos Simples</h2>
          <p className="text-slate-600">Pague pelo que usa. Escale sem limites.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-2 border-transparent">
            <CardHeader>
              <CardTitle className="text-2xl">Starter</CardTitle>
              <CardDescription>Para pequenas empresas</CardDescription>
              <div className="text-4xl font-bold mt-4">
                R$ 97<span className="text-lg font-normal text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {[
                  'Módulos Ativos (Dashboard, Contatos, Finanças)',
                  'Até 3 Usuários',
                  'Suporte por Email',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/app">Assinar Starter</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-2 border-primary shadow-elevation relative">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 text-sm font-medium rounded-full">
              Recomendado
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription>Para operações complexas</CardDescription>
              <div className="text-4xl font-bold mt-4">Personalizado</div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {[
                  'Acesso a todos +17 módulos futuros',
                  'Usuários Ilimitados',
                  'Implantação Assistida',
                  'Gerente de Sucesso',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" asChild>
                <Link to="/app">Falar com Consultor</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
