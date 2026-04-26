import { Building2, Compass, Target, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function AboutSection() {
  return (
    <section
      id="sobre"
      className="py-24 bg-white border-t border-slate-200 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-50"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <Badge
              variant="outline"
              className="mb-6 text-primary border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1 text-sm font-semibold rounded-full"
            >
              <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Sobre a Nexus
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 leading-tight tracking-tight">
              Excelência em Engenharia de Software para Operações.
            </h2>
            <p className="text-slate-600 text-lg mb-10 leading-relaxed">
              Nascemos da necessidade de organizar o caos operacional das frentes de trabalho. Nossa
              missão é desenvolver ferramentas de alta performance que traduzem fluxos complexos em
              interfaces eficientes e auditáveis.
            </p>

            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-slate-50/50">
                <CardContent className="p-5 flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Missão Estratégica</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Capacitar empresas a atingir o máximo de eficiência econômica e excelência
                      operacional, erradicando passivos trabalhistas através da tecnologia.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-slate-50/50">
                <CardContent className="p-5 flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Compass className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Visão de Futuro</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Tornar-se o padrão ouro nacional em sistemas de gestão unificados para
                      controle de ponto e mobilização de canteiros.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative lg:pl-10 mt-10 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-blue-500/5 to-transparent rounded-3xl blur-3xl -z-10" />

            <Card className="bg-white border-slate-200 rounded-2xl relative shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-blue-500 to-indigo-500"></div>
              <CardContent className="p-10">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 shadow-inner">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">Arquitetura Escalável</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Construído sobre uma infraestrutura robusta, pronto para processar milhares de
                  registros diários de ponto com tolerância a falhas e alta disponibilidade.
                </p>

                <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-8">
                  <div className="group">
                    <div className="text-4xl font-extrabold text-slate-900 mb-2 flex items-center gap-1">
                      100%{' '}
                      <ArrowUpRight className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
                      Aderência Legal
                    </div>
                  </div>
                  <div className="group">
                    <div className="text-4xl font-extrabold text-slate-900 mb-2 flex items-center gap-1">
                      +17{' '}
                      <ArrowUpRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
