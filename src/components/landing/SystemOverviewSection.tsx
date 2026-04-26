import { MapPin, Smartphone, FileSignature, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function SystemOverviewSection() {
  return (
    <section id="visao-geral" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Pilares do Sistema Integrado
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Nossos módulos foram desenhados especificamente para o setor de engenharia, conectando a
            operação de campo com a inteligência e conformidade do escritório.
          </p>
        </div>

        <div className="space-y-24">
          {/* Pillar 1: Gestão de Obras & Equipes */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative group">
              <div className="absolute inset-0 bg-blue-500/10 rounded-2xl transform -rotate-3 scale-105 -z-10 transition-transform group-hover:rotate-0"></div>
              <img
                src="https://img.usecurling.com/p/800/600?q=map%20geofence%20dashboard&color=blue"
                alt="Gestão de Obras e Geofencing"
                className="rounded-2xl shadow-xl border border-slate-200 w-full object-cover aspect-video"
              />
              <Card className="absolute -bottom-6 -right-6 p-4 shadow-xl border-slate-100 hidden sm:block bg-white/95 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Dentro do Raio</p>
                    <p className="text-xs text-slate-500">Obra Central - 50m</p>
                  </div>
                </div>
              </Card>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100">
                Operacional
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                Gestão de Obras & Equipes
              </h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Tenha controle absoluto sobre quem está em cada canteiro. Com a tecnologia de{' '}
                <strong>Geofencing</strong>, você delimita o raio de atuação exato no mapa,
                garantindo que alocações e marcações de ponto ocorram apenas em locais autorizados.
              </p>
              <ul className="space-y-4">
                {[
                  'Cerca Virtual (Geofencing) com precisão configurável',
                  'Alocação de profissionais por centro de custo',
                  'Monitoramento de mobilização e desmobilização',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                    <span className="mt-0.5">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pillar 2: Controle de Ponto */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                Tecnologia
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                Controle de Ponto Inteligente
              </h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Facilite a vida do colaborador e blinde o RH. O registro pode ser feito diretamente
                via <strong>Aplicativo Mobile</strong> ou totens com <strong>QR Code</strong>,
                associados a camadas de verificação de identidade como reconhecimento facial.
              </p>
              <ul className="space-y-4">
                {[
                  'Registro rápido via App Mobile (Android/iOS)',
                  'Marcação centralizada por QR Code do encarregado',
                  'Captura de foto para auditoria de identidade',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                    <span className="mt-0.5">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/10 rounded-2xl transform rotate-3 scale-105 -z-10 transition-transform group-hover:rotate-0"></div>
              <img
                src="https://img.usecurling.com/p/800/600?q=smartphone%20app%20qr%20code&color=blue"
                alt="Aplicativo de Ponto Mobile"
                className="rounded-2xl shadow-xl border border-slate-200 w-full object-cover aspect-video"
              />
              <Card className="absolute top-6 -left-6 p-4 shadow-xl border-slate-100 hidden sm:block bg-white/95 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Ponto Registrado</p>
                    <p className="text-xs text-slate-500">08:00 - Sincronizado</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Pillar 3: Conformidade Legal */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative group">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl transform -rotate-3 scale-105 -z-10 transition-transform group-hover:rotate-0"></div>
              <img
                src="https://img.usecurling.com/p/800/600?q=legal%20document%20signature&color=green"
                alt="Assinatura de Documentos"
                className="rounded-2xl shadow-xl border border-slate-200 w-full object-cover aspect-video"
              />
              <Card className="absolute -bottom-6 right-8 p-4 shadow-xl border-slate-100 hidden sm:block bg-white/95 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FileSignature className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Acordo Assinado</p>
                    <p className="text-xs text-slate-500">Validade Jurídica</p>
                  </div>
                </div>
              </Card>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-6 border border-emerald-100">
                Jurídico
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                Conformidade Legal & Regras
              </h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Elimine passivos trabalhistas com um sistema desenhado para a{' '}
                <strong>Portaria 671 do MTP</strong>. Configure regras customizadas de jornada,
                banco de horas e colha o aceite dos colaboradores através de{' '}
                <strong>assinatura digital</strong>.
              </p>
              <ul className="space-y-4">
                {[
                  'Software REP-P 100% alinhado à Portaria 671',
                  'Assinatura digital para termos e regras customizadas',
                  'Geração automática de arquivos fiscais (AFD/AEJ)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <span className="mt-0.5">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
