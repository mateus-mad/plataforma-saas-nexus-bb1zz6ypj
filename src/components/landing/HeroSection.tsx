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
  Users,
  LayoutDashboard,
  Settings2,
  BarChart3,
} from 'lucide-react'

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-950 flex flex-col items-center min-h-screen"
    >
      {/* Premium Dark Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      {/* Hero Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-4 text-center max-w-6xl relative z-10 flex flex-col items-center">
        {/* Compliance Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-8 shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-fade-in backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Sistema 100% Aderente à Portaria 671/MTP</span>
        </div>

        {/* Hero Title */}
        <h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 animate-slide-up leading-[1.1] max-w-5xl mx-auto"
          style={{ animationDelay: '100ms' }}
        >
          Gestão de Ponto e Operações{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-300">
            para Engenharia.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p
          className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto animate-slide-up leading-relaxed font-medium"
          style={{ animationDelay: '200ms' }}
        >
          Controle de ponto inteligente, gestão de obras e conformidade legal em uma única
          plataforma de alta performance. Elimine riscos trabalhistas com precisão de geolocalização
          e regras automatizadas.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up mb-20 w-full sm:w-auto"
          style={{ animationDelay: '300ms' }}
        >
          <Button
            size="lg"
            className="h-14 px-8 text-base rounded-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all hover:-translate-y-1 group"
            asChild
          >
            <Link to="/login">
              Acessar Plataforma{' '}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 text-base rounded-full border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200 transition-all backdrop-blur-sm hover:-translate-y-1"
            asChild
          >
            <a href="#visao-geral">Conhecer Funcionalidades</a>
          </Button>
        </div>

        {/* High-End Dashboard Mockup (Painel Geral Preview) */}
        <div
          className="relative mx-auto w-full max-w-6xl animate-slide-up perspective-[2000px]"
          style={{ animationDelay: '400ms' }}
        >
          {/* Mockup Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-b from-primary/30 via-blue-500/10 to-transparent rounded-3xl blur-2xl opacity-50"></div>

          <div className="relative rounded-2xl bg-slate-950 border border-slate-800/80 shadow-2xl overflow-hidden ring-1 ring-white/10">
            {/* Mac-style Window Header */}
            <div className="h-12 border-b border-slate-800/80 flex items-center px-4 justify-between bg-slate-900/80 backdrop-blur-md">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-6 w-64 bg-slate-950/50 border border-slate-800/50 rounded-md flex items-center justify-center text-[11px] text-slate-400 font-medium tracking-wide">
                  <ShieldCheck className="w-3 h-3 mr-1.5 text-emerald-500" />
                  nexus-erp.com/app/dashboard
                </div>
              </div>
              <div className="w-12" /> {/* Spacer */}
            </div>

            {/* Dashboard Layout */}
            <div className="flex h-[500px] bg-slate-950/50">
              {/* Sidebar */}
              <div className="w-56 border-r border-slate-800/60 p-4 hidden md:flex flex-col gap-2 bg-slate-900/20">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
                  Principal
                </div>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary transition-all">
                  <LayoutDashboard className="w-4 h-4" />{' '}
                  <span className="text-sm font-medium">Painel Geral</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-400 transition-all cursor-pointer">
                  <MapPin className="w-4 h-4" />{' '}
                  <span className="text-sm font-medium">Gestão de Obras</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-400 transition-all cursor-pointer">
                  <Users className="w-4 h-4" />{' '}
                  <span className="text-sm font-medium">Colaboradores</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-400 transition-all cursor-pointer">
                  <Clock className="w-4 h-4" />{' '}
                  <span className="text-sm font-medium">Espelho de Ponto</span>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-400 transition-all cursor-pointer">
                    <Settings2 className="w-4 h-4" />{' '}
                    <span className="text-sm font-medium">Configurações</span>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6 overflow-hidden flex flex-col gap-6">
                {/* Header Area */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Painel Operacional
                    </h2>
                    <p className="text-sm text-slate-400">
                      Visão consolidada de todas as frentes de trabalho
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg p-1">
                    <div className="px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md">
                      Hoje
                    </div>
                    <div className="px-3 py-1.5 text-slate-400 text-xs font-medium">
                      Esta Semana
                    </div>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-slate-400 text-sm font-medium">Força de Trabalho</div>
                      <Users className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">248</div>
                    <div className="text-emerald-400 text-xs font-medium flex items-center bg-emerald-500/10 w-fit px-2 py-1 rounded-md">
                      <CheckCircle2 className="w-3 h-3 mr-1.5" /> 215 Ao vivo nas obras
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-slate-400 text-sm font-medium">Atrasos & Faltas</div>
                      <Clock className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">12</div>
                    <div className="text-amber-400 text-xs font-medium flex items-center bg-amber-500/10 w-fit px-2 py-1 rounded-md">
                      -2% vs ontem
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 border-2 border-rose-500/20 rounded-xl animate-pulse" />
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-slate-400 text-sm font-medium">Alertas de Geofence</div>
                      <MapPin className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">3</div>
                    <div className="text-rose-400 text-xs font-medium flex items-center bg-rose-500/10 w-fit px-2 py-1 rounded-md">
                      <AlertCircle className="w-3 h-3 mr-1.5" /> Requer Atenção Imediata
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Chart & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                  {/* Fake Chart */}
                  <div className="col-span-2 bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-sm font-semibold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" /> Fluxo de Registros (Hoje)
                      </div>
                    </div>
                    <div className="flex-1 flex items-end gap-3 justify-between">
                      {[30, 45, 20, 100, 85, 40, 15, 90, 60, 30, 10, 5].map((h, i) => (
                        <div
                          key={i}
                          className="w-full bg-slate-800/50 rounded-t-sm relative group h-full flex items-end"
                        >
                          <div
                            className="w-full bg-gradient-to-t from-primary/80 to-blue-400 rounded-t-sm transition-all duration-500 opacity-80 group-hover:opacity-100"
                            style={{ height: `${h}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-medium">
                      <span>06:00</span>
                      <span>08:00</span>
                      <span>12:00</span>
                      <span>18:00</span>
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div className="col-span-1 bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 flex flex-col">
                    <div className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-slate-400" /> Tempo Real
                    </div>
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                      {[
                        {
                          name: 'Carlos Silva',
                          act: 'Entrada • Obra Sul',
                          time: '07:58',
                          dot: 'bg-emerald-500',
                        },
                        {
                          name: 'Ana Oliveira',
                          act: 'Saída • Matriz',
                          time: '17:02',
                          dot: 'bg-blue-500',
                        },
                        {
                          name: 'Roberto Dias',
                          act: 'Fora do Raio Permitido',
                          time: '08:15',
                          dot: 'bg-rose-500',
                        },
                        {
                          name: 'Julia Santos',
                          act: 'Pausa Almoço',
                          time: '12:00',
                          dot: 'bg-amber-500',
                        },
                        {
                          name: 'Marcos Paulo',
                          act: 'Entrada • Obra Norte',
                          time: '07:45',
                          dot: 'bg-emerald-500',
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-start border-b border-slate-800/50 pb-3 last:border-0 last:pb-0"
                        >
                          <div className="flex gap-3 items-start">
                            <div
                              className={`mt-1.5 w-2 h-2 rounded-full ${item.dot} shrink-0 shadow-[0_0_8px_currentColor]`}
                            />
                            <div>
                              <div className="text-slate-200 text-sm font-medium">{item.name}</div>
                              <div className="text-slate-500 text-[11px] mt-0.5">{item.act}</div>
                            </div>
                          </div>
                          <div className="text-slate-600 text-[10px] font-medium bg-slate-950 px-1.5 py-0.5 rounded">
                            {item.time}
                          </div>
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
