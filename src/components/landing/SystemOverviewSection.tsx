import { MapPin, Smartphone, FileSignature, CheckCircle2 } from 'lucide-react'

export function SystemOverviewSection() {
  return (
    <section
      id="visao-geral"
      className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6 border border-blue-200">
            Ecossistema Unificado
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
            Os Pilares da Operação Integrada
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Desenvolvido especificamente para a realidade da construção civil e engenharias,
            conectando perfeitamente a execução no campo com a inteligência do escritório.
          </p>
        </div>

        <div className="space-y-32">
          {/* Pillar 1: Gestão de Obras & Equipes */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 md:order-1 relative group perspective-[1000px]">
              <div className="absolute inset-0 bg-blue-500/20 rounded-3xl transform rotate-2 scale-105 -z-10 transition-transform group-hover:rotate-0 blur-xl"></div>
              <div className="relative rounded-2xl border border-slate-200/50 bg-white p-2 shadow-2xl transition-transform group-hover:scale-[1.02] duration-500">
                <img
                  src="https://img.usecurling.com/p/800/600?q=map%20geofence%20dashboard&color=blue"
                  alt="Gestão de Obras e Geofencing"
                  className="rounded-xl w-full object-cover aspect-[4/3]"
                />
                {/* Floating Info Card */}
                <div className="absolute -bottom-6 -right-6 p-4 rounded-xl shadow-2xl border border-slate-100 hidden sm:block bg-white/95 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Dentro do Raio (50m)</p>
                      <p className="text-xs text-slate-500 font-medium">Obra Central SP</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Gestão Espacial de Obras & Equipes
              </h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Tenha controle absoluto sobre a localização da sua força de trabalho. Com nossa
                tecnologia proprietária de <strong>Geofencing</strong>, você delimita o raio de
                atuação exato no mapa, garantindo que alocações e marcações de ponto ocorram{' '}
                <em>exclusivamente</em> em locais previamente autorizados.
              </p>
              <ul className="space-y-5">
                {[
                  'Cerca Virtual (Geofencing) com precisão via satélite',
                  'Alocação dinâmica de profissionais por centro de custo',
                  'Dashboard de monitoramento de mobilização ao vivo',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-700 font-medium text-lg">
                    <div className="mt-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pillar 2: Controle de Ponto */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Controle de Ponto Mobile Inteligente
              </h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Facilite a rotina do peão de obra e blinde o departamento de RH. O registro é
                executado em segundos via <strong>Aplicativo Mobile</strong> nativo ou através de
                totens com <strong>QR Code do Encarregado</strong>, sempre associados a camadas
                severas de verificação antifraude.
              </p>
              <ul className="space-y-5">
                {[
                  'App Mobile intuitivo e veloz (Android e iOS)',
                  'Marcação centralizada pelo QR Code do líder da frente',
                  'Captura biométrica facial para auditoria visual',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-700 font-medium text-lg">
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative group perspective-[1000px]">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl transform -rotate-2 scale-105 -z-10 transition-transform group-hover:rotate-0 blur-xl"></div>
              <div className="relative rounded-2xl border border-slate-200/50 bg-white p-2 shadow-2xl transition-transform group-hover:scale-[1.02] duration-500">
                <img
                  src="https://img.usecurling.com/p/800/600?q=smartphone%20app%20dashboard&color=blue"
                  alt="Aplicativo de Ponto Mobile"
                  className="rounded-xl w-full object-cover aspect-[4/3]"
                />
                {/* Floating Info Card */}
                <div className="absolute top-8 -left-8 p-4 rounded-xl shadow-2xl border border-slate-100 hidden sm:block bg-white/95 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Ponto Sincronizado</p>
                      <p className="text-xs text-slate-500 font-medium">08:00 - Criptografado</p>
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
