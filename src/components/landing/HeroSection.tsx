import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  AlertCircle,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react'

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-950 flex items-center min-h-screen"
    >
      {/* Engineering Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

      {/* Blueprint lines / accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen" />

      <div className="container mx-auto px-4 text-center max-w-6xl relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium mb-8 animate-fade-in shadow-[0_0_10px_rgba(34,197,94,0.1)]">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Aderente à Portaria 671/MTP</span>
        </div>

        <h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 animate-slide-up leading-tight max-w-5xl mx-auto"
          style={{ animationDelay: '100ms' }}
        >
          Gestão de Ponto e Operações{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-400">
            para Engenharia.
          </span>
        </h1>

        <p
          className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto animate-slide-up leading-relaxed"
          style={{ animationDelay: '200ms' }}
        >
          Controle de ponto inteligente, gestão de obras e conformidade legal em uma única
          plataforma. Elimine riscos trabalhistas com precisão de geolocalização e regras
          automatizadas.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up mb-16"
          style={{ animationDelay: '300ms' }}
        >
          <Button
            size="lg"
            className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all hover:scale-105"
            asChild
          >
            <Link to="/login">
              Começar Agora <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 text-lg border-slate-700 hover:bg-slate-800 text-slate-300 transition-all"
            asChild
          >
            <a href="#visao-geral">Conheça o Sistema</a>
          </Button>
        </div>

        {/* Dashboard UI Mockup */}
        <div
          className="relative mx-auto w-full max-w-5xl rounded-xl border border-slate-800 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-xl animate-slide-up"
          style={{ animationDelay: '400ms' }}
        >
          <div className="rounded-lg bg-slate-950 border border-slate-800/80 overflow-hidden shadow-inner">
            {/* Window Header */}
            <div className="h-12 border-b border-slate-800 flex items-center px-4 justify-between bg-slate-900/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="h-5 w-48 bg-slate-800/50 rounded flex items-center justify-center text-[10px] text-slate-500 font-medium">
                nexus-erp.com/painel
              </div>
              <div className="w-12" /> {/* Spacer for balance */}
            </div>

            {/* Dashboard Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
              {/* Sidebar */}
              <div className="hidden md:flex flex-col gap-3">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 border border-primary/20 text-primary">
                  <Activity className="w-4 h-4" />{' '}
                  <span className="text-sm font-medium">Visão Geral</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/50 text-slate-400 transition-colors">
                  <MapPin className="w-4 h-4" />{' '}
                  <span className="text-sm font-medium">Obras Ativas</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/50 text-slate-400 transition-colors">
                  <Clock className="w-4 h-4" />{' '}
                  <span className="text-sm font-medium">Espelho de Ponto</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800/50 text-slate-400 transition-colors">
                  <ShieldCheck className="w-4 h-4" />{' '}
                  <span className="text-sm font-medium">Conformidade</span>
                </div>
              </div>

              {/* Main Area */}
              <div className="col-span-1 md:col-span-3 space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-sm">
                    <div className="text-slate-400 text-xs font-medium mb-1">
                      Colaboradores em Obra
                    </div>
                    <div className="text-3xl font-bold text-white flex items-end justify-between">
                      248{' '}
                      <span className="text-emerald-400 text-xs font-medium flex items-center mb-1">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Ao vivo
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-sm">
                    <div className="text-slate-400 text-xs font-medium mb-1">Atrasos Hoje</div>
                    <div className="text-3xl font-bold text-white flex items-end justify-between">
                      12{' '}
                      <span className="text-amber-400 text-xs font-medium mb-1">-2% vs ontem</span>
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-bl-full" />
                    <div className="text-slate-400 text-xs font-medium mb-1 relative z-10">
                      Alertas de Geofence
                    </div>
                    <div className="text-3xl font-bold text-white flex items-end justify-between relative z-10">
                      3{' '}
                      <span className="text-rose-400 text-xs font-medium flex items-center mb-1">
                        <AlertCircle className="w-3 h-3 mr-1" /> Requer Atenção
                      </span>
                    </div>
                  </div>
                </div>

                {/* Charts & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Chart Area */}
                  <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-5">
                    <div className="text-sm font-medium text-slate-300 mb-6 flex justify-between items-center">
                      <span>Registros de Ponto por Hora</span>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                      </div>
                    </div>
                    <div className="h-32 flex items-end gap-3 justify-between">
                      {[30, 45, 20, 100, 80, 40, 15, 90, 60].map((h, i) => (
                        <div
                          key={i}
                          className="w-full bg-slate-800 rounded-t-sm relative group h-full flex items-end"
                        >
                          <div
                            className="w-full bg-primary hover:bg-primary/80 rounded-t-sm transition-all duration-500"
                            style={{ height: `${h}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-5">
                    <div className="text-sm font-medium text-slate-300 mb-4">Atividade Recente</div>
                    <div className="space-y-4">
                      {[
                        {
                          name: 'Carlos Silva',
                          act: 'Entrada • Obra Sul',
                          time: '07:58',
                          color: 'text-emerald-400',
                        },
                        {
                          name: 'Ana Oliveira',
                          act: 'Saída • Matriz',
                          time: '17:02',
                          color: 'text-blue-400',
                        },
                        {
                          name: 'Roberto Dias',
                          act: 'Fora do Raio',
                          time: '08:15',
                          color: 'text-rose-400',
                        },
                        {
                          name: 'Julia Santos',
                          act: 'Pausa Almoço',
                          time: '12:00',
                          color: 'text-amber-400',
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-start">
                          <div>
                            <div className="text-slate-200 text-sm font-medium">{item.name}</div>
                            <div className={`${item.color} text-xs mt-0.5`}>{item.act}</div>
                          </div>
                          <div className="text-slate-500 text-xs">{item.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
