import { ShieldCheck, FileCheck, Scale, FileSignature, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function ComplianceSection() {
  return (
    <section
      id="compliance"
      className="py-32 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900"
    >
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/30 via-slate-950 to-slate-950"></div>
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 via-blue-600/10 to-transparent blur-3xl rounded-full opacity-60"></div>
            <Card className="bg-slate-900/80 border-slate-800/80 relative shadow-2xl backdrop-blur-xl">
              <CardContent className="p-8 sm:p-10">
                <div className="flex items-center gap-5 mb-10 pb-10 border-b border-slate-800">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      Auditoria Contínua
                    </h3>
                    <p className="text-slate-400 text-sm sm:text-base mt-1">
                      Cada ação no sistema é rastreada e selada.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    'Geração automática de arquivos fiscais (AFD/AEJ) nativa',
                    'Proteção anti-fraude rigorosa contra Mock Locations (GPS Falso)',
                    'Hash de validação matemática (SHA-256) por registro efetuado',
                    'Criptografia de ponta-a-ponta (Padrão AES-256)',
                    'Aceite digital de espelho de ponto direto no App Mobile',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 border border-transparent transition-colors">
                        <Check className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <span className="text-slate-300 font-medium text-base group-hover:text-white transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold mb-6 border border-emerald-500/20 text-sm backdrop-blur-sm">
              <Scale className="w-4 h-4" /> Risco Trabalhista Zero
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-[1.1] tracking-tight">
              Segurança jurídica absoluta com a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                Portaria 671
              </span>
              .
            </h2>
            <p className="text-slate-400 text-lg sm:text-xl mb-12 leading-relaxed">
              O NexusERP atua como um{' '}
              <strong>REP-P (Registrador Eletrônico de Ponto via Programa)</strong> plenamente
              certificado. Garantimos a emissão de comprovantes invioláveis e relatórios fiscais
              padronizados, blindando sua operação contra autuações e processos milionários.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-sm hover:bg-slate-800/60 transition-colors">
                <CardContent className="p-6">
                  <FileCheck className="w-10 h-10 text-emerald-400 mb-5" />
                  <h4 className="font-semibold text-lg mb-2 text-white">Comprovante Eletrônico</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Geração de recibo PDF com hash SHA-256 no momento exato e indelével do registro
                    do colaborador.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-sm hover:bg-slate-800/60 transition-colors">
                <CardContent className="p-6">
                  <FileSignature className="w-10 h-10 text-emerald-400 mb-5" />
                  <h4 className="font-semibold text-lg mb-2 text-white">Assinatura de Acordos</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Plataforma totalmente integrada para firmar e armazenar acordos de ponto,
                    compensação e turno.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
