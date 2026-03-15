import { Building2, Compass, Target } from 'lucide-react'

export function AboutSection() {
  return (
    <section
      id="sobre"
      className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-primary font-medium mb-4 uppercase tracking-wider text-sm">
              <span className="w-8 h-[1px] bg-primary"></span>A Empresa
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
              Compromisso com a Excelência em Engenharia de Software.
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Nascemos da necessidade de organizar o caos operacional. Nossa missão é desenvolver
              ferramentas de alta performance que traduzem processos de negócios complexos em
              interfaces eficientes, escaláveis e precisas.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-slate-200">Nossa Missão Estratégica</h4>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                    Capacitar empresas a atingir o máximo de eficiência econômica e excelência
                    operacional através de tecnologia perfeitamente estruturada.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-blue-400/50 transition-colors">
                  <Compass className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-slate-200">Visão de Futuro</h4>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                    Tornar-se o padrão ouro incontestável em sistemas de gestão unificados para
                    operações táticas, estratégicas e logísticas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:pl-10 mt-10 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl blur-3xl -z-10" />
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 relative shadow-2xl">
              <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-8">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-4 mb-8">
                <div className="h-2 w-1/3 bg-slate-800 rounded" />
                <div className="h-2 w-full bg-slate-800 rounded" />
                <div className="h-2 w-5/6 bg-slate-800 rounded" />
                <div className="h-2 w-4/6 bg-slate-800 rounded" />
              </div>
              <div className="pt-8 border-t border-slate-800 grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-extrabold text-white mb-1">100%</div>
                  <div className="text-sm text-slate-400 font-medium">Foco em Performance</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white mb-1">+17</div>
                  <div className="text-sm text-slate-400 font-medium">Módulos Planejados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
