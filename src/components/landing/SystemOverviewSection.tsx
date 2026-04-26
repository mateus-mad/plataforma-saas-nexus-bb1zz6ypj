import { BarChart3, MapPin, HardHat, CheckCircle2 } from 'lucide-react'

export function SystemOverviewSection() {
  return (
    <section id="visao-geral" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Visão do Sistema Integrado
          </h2>
          <p className="text-lg text-slate-600">
            Módulos projetados para trabalhar em harmonia, entregando desde o monitoramento macro
            até o detalhe preciso da localização do colaborador na obra.
          </p>
        </div>

        <div className="space-y-24">
          {/* Feature 1: Painel Geral */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl transform -rotate-3 scale-105 -z-10"></div>
              <img
                src="https://img.usecurling.com/p/800/600?q=data%20analytics%20graphs&color=blue"
                alt="Painel Geral"
                className="rounded-2xl shadow-xl border border-slate-200 w-full"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Painel de Controle Central</h3>
              <p className="text-slate-600 text-lg mb-6">
                Monitoramento em tempo real de toda a operação. Tenha uma visão centralizada das
                presenças, ausências, horas extras e custos, permitindo tomada de decisão baseada em
                dados precisos e atualizados instantaneamente.
              </p>
              <ul className="space-y-3">
                {[
                  'Métricas de assiduidade ao vivo',
                  'Integração de dados de múltiplas frentes',
                  'Relatórios automatizados de conformidade',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 2: Controle de Ponto */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Controle de Ponto Georreferenciado
              </h3>
              <p className="text-slate-600 text-lg mb-6">
                Evite fraudes e garanta que sua equipe está onde deveria estar. O sistema utiliza o
                GPS do dispositivo para confirmar a localização exata no momento do registro, com
                opção de "Usar minha localização" e validação por cerca virtual.
              </p>
              <ul className="space-y-3">
                {[
                  'Geofencing para restrição de área',
                  'Captura de foto obrigatória (opcional)',
                  'Registro offline com sincronização posterior',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/5 rounded-2xl transform rotate-3 scale-105 -z-10"></div>
              <img
                src="https://img.usecurling.com/p/800/600?q=smartphone%20app%20map&color=green"
                alt="Aplicativo de Ponto"
                className="rounded-2xl shadow-xl border border-slate-200 w-full"
              />
            </div>
          </div>

          {/* Feature 3: Gestão de Obras */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-orange-500/5 rounded-2xl transform -rotate-3 scale-105 -z-10"></div>
              <img
                src="https://img.usecurling.com/p/800/600?q=construction%20site%20engineering&color=orange"
                alt="Gestão de Obras"
                className="rounded-2xl shadow-xl border border-slate-200 w-full"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                <HardHat className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Gestão de Frente de Trabalho
              </h3>
              <p className="text-slate-600 text-lg mb-6">
                Controle rigoroso sobre as equipes alocadas em diferentes obras ou sites. Gerencie
                permissões, crie áreas de abrangência exclusivas por contrato e acompanhe a
                mobilização de colaboradores com total transparência.
              </p>
              <ul className="space-y-3">
                {[
                  'Mapeamento poligonal de canteiros',
                  'Controle de custos por centro de resultado',
                  'Alocação dinâmica de profissionais',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    {item}
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
