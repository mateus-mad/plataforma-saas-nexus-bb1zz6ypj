import { Building2, Compass, Target, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function AboutSection() {
  return (
    <section
      id="sobre"
      className="py-32 bg-white border-t border-slate-200 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-70"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <Badge
              variant="outline"
              className="mb-8 text-primary border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-semibold rounded-full uppercase tracking-wider"
            >
              <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse inline-block"></span>
              A Origem da Nexus
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight tracking-tight">
              Excelência em Engenharia de Software para Operações.
            </h2>
            <p className="text-slate-600 text-lg mb-12 leading-relaxed">
              Nascemos da necessidade urgente de organizar o caos operacional das grandes frentes de
              trabalho. Nossa missão é desenvolver ferramentas de software de altíssima performance
              que traduzem fluxos complexos em interfaces eficientes, escaláveis e completamente
              auditáveis.
            </p>

            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white group">
                <CardContent className="p-6 flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm group-hover:border-primary/30 transition-colors">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Missão Estratégica</h4>
                    <p className="text-slate-600 text-base leading-relaxed">
                      Capacitar empresas a atingir o máximo absoluto de eficiência econômica e
                      excelência operacional, erradicando passivos trabalhistas através da
                      tecnologia.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white group">
                <CardContent className="p-6 flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm group-hover:border-blue-500/30 transition-colors">
                    <Compass className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Visão de Futuro</h4>
                    <p className="text-slate-600 text-base leading-relaxed">
                      Tornar-se o padrão ouro incontestável em sistemas de gestão unificados para
                      controle de ponto corporativo e mobilização inteligente de canteiros.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative lg:pl-10 mt-10 md:mt-0 perspective-[1000px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-blue-500/10 to-transparent rounded-[3rem] blur-3xl -z-10" />

            <Card className="bg-slate-900 border-slate-800 rounded-3xl relative shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-blue-500 to-indigo-500"></div>
              <CardContent className="p-10 sm:p-12">
                <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-10 shadow-inner">
                  <Building2 className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">Arquitetura Escalável</h3>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                  Construído nativamente sobre uma infraestrutura robusta de nuvem, totalmente
                  pronto para processar milhões de registros diários com tolerância a falhas e SLA
                  de alta disponibilidade (99.9%).
                </p>

                <div className="pt-10 border-t border-slate-800 grid grid-cols-2 gap-8">
                  <div className="group/stat cursor-default">
                    <div className="text-5xl font-extrabold text-white mb-2 flex items-center gap-1">
                      100%{' '}
                      <ArrowUpRight className="w-6 h-6 text-emerald-400 opacity-50 group-hover/stat:opacity-100 group-hover/stat:translate-x-1 group-hover/stat:-translate-y-1 transition-all" />
                    </div>
                    <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
                      Aderência Legal
                    </div>
                  </div>
                  <div className="group/stat cursor-default">
                    <div className="text-5xl font-extrabold text-white mb-2 flex items-center gap-1">
                      +17{' '}
                      <ArrowUpRight className="w-6 h-6 text-blue-400 opacity-50 group-hover/stat:opacity-100 group-hover/stat:translate-x-1 group-hover/stat:-translate-y-1 transition-all" />
                    </div>
                    <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
                      Módulos Futuros
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
