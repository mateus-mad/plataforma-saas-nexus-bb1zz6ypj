import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, Cpu } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative py-24 md:py-40 overflow-hidden bg-slate-950 flex items-center min-h-[90vh]"
    >
      {/* Engineering Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

      {/* Blueprint lines / accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen" />

      <div className="container mx-auto px-4 text-center max-w-5xl relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
          <Cpu className="w-4 h-4" />
          <span>SaaS Architecture v2.0</span>
        </div>

        <h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          Engenharia de software para <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            excelência em gestão
          </span>
        </h1>

        <p
          className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          Uma plataforma estruturada para escalar operações complexas. Convergindo dados, processos
          e tecnologia de ponta para otimizar os recursos da sua empresa e garantir eficiência
          máxima.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          <Button
            size="lg"
            className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white border border-primary-foreground/10 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            asChild
          >
            <Link to="/app">
              Inicializar Sistema <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 text-lg border-slate-700 hover:bg-slate-800 text-slate-300"
            asChild
          >
            <a href="#modulos">Explorar Arquitetura</a>
          </Button>
        </div>

        {/* Dashboard Preview inside a technical frame */}
        <div
          className="mt-24 relative mx-auto w-full max-w-5xl animate-slide-up border border-slate-800 rounded-lg p-2 bg-slate-900/50 backdrop-blur-sm"
          style={{ animationDelay: '400ms' }}
        >
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-primary" />
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-primary" />
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-primary" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-primary" />

          <img
            src="https://img.usecurling.com/p/1200/600?q=dashboard%20dark%20mode&color=blue&dpr=2"
            alt="NexusERP Dashboard"
            className="w-full rounded border border-slate-800 opacity-90 grayscale-[20%] contrast-125"
          />
        </div>
      </div>
    </section>
  )
}
