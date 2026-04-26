import { ShieldCheck, FileCheck, Scale, Lock } from 'lucide-react'

export function ComplianceSection() {
  return (
    <section id="compliance" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-green-400 font-medium mb-4 uppercase tracking-wider text-sm">
              <ShieldCheck className="w-5 h-5" /> Risco Trabalhista Zero
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Segurança jurídica e adequação total à Portaria 671.
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Não deixe sua empresa vulnerável a passivos trabalhistas. O NexusERP atua como um
              REP-P (Registrador Eletrônico de Ponto via Programa), gerando os arquivos AFD e AEJ
              exigidos pelos fiscais do Ministério do Trabalho e Emprego.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
                <FileCheck className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-semibold text-lg mb-2">Comprovante Eletrônico</h4>
                <p className="text-sm text-slate-400">
                  Geração de comprovante de registro com hash SHA-256 para total inviolabilidade.
                </p>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
                <Scale className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-semibold text-lg mb-2">Conformidade MTP</h4>
                <p className="text-sm text-slate-400">
                  Aderente a todas as regras de tratamento de jornada, espelho de ponto e exportação
                  fiscal.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-blue-600/30 blur-2xl rounded-full opacity-50"></div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 relative shadow-2xl">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-700">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-600 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Auditoria Contínua</h3>
                  <p className="text-slate-400">Cada ação é rastreada e documentada.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Criptografia de Dados (AES-256)</span>
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Proteção contra Mock Locations</span>
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Hash de Validação por Registro</span>
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Bloqueio de Horas Extras não Autorizadas</span>
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
