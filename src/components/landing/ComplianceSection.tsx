import { ShieldCheck, FileCheck, Scale, FileSignature, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function ComplianceSection() {
  return (
    <section
      id="compliance"
      className="py-24 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold mb-6 border border-emerald-500/20 text-sm">
              <Scale className="w-4 h-4" /> Risco Trabalhista Zero
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Segurança jurídica absoluta com a Portaria 671.
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              O NexusERP atua como um{' '}
              <strong>REP-P (Registrador Eletrônico de Ponto via Programa)</strong> plenamente
              certificado. Garantimos a emissão de comprovantes invioláveis e relatórios fiscais
              padronizados, blindando sua operação contra autuações e processos.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardContent className="p-6">
                  <FileCheck className="w-8 h-8 text-emerald-400 mb-4" />
                  <h4 className="font-semibold text-lg mb-2 text-white">Comprovante Eletrônico</h4>
                  <p className="text-sm text-slate-400">
                    Geração de PDF com hash SHA-256 no momento exato do registro do colaborador.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardContent className="p-6">
                  <FileSignature className="w-8 h-8 text-emerald-400 mb-4" />
                  <h4 className="font-semibold text-lg mb-2 text-white">Assinatura de Regras</h4>
                  <p className="text-sm text-slate-400">
                    Plataforma integrada para firmar acordos de ponto, compensação e turno.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-blue-600/20 blur-3xl rounded-full opacity-50"></div>
            <Card className="bg-slate-900 border-slate-800 relative shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-800">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Auditoria Contínua</h3>
                    <p className="text-slate-400 text-sm">
                      Cada ação no sistema é rastreada e selada.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    'Geração automática de arquivos fiscais (AFD/AEJ)',
                    'Proteção anti-fraude contra Mock Locations (GPS Falso)',
                    'Hash de validação matemática por registro efetuado',
                    'Criptografia de ponta-a-ponta (Padrão AES-256)',
                    'Aceite digital de espelho de ponto via App Mobile',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-slate-300 font-medium text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
