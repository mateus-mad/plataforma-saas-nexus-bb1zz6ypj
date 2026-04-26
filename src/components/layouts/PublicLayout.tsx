import { Link, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Hexagon, Layers, ArrowRight } from 'lucide-react'
import { UPCOMING_MODULES } from '@/config/modules'
import { db } from '@/lib/database'
import { useAuth } from '@/hooks/use-auth'

export default function PublicLayout() {
  const [lastRoute, setLastRoute] = useState('/app')
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    db.get('last_route').then((route) => {
      if (route && route.startsWith('/app')) {
        setLastRoute(route)
      }
    })

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 font-sans selection:bg-primary/30">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled
            ? 'bg-slate-950/80 backdrop-blur-xl border-slate-800/50 shadow-lg shadow-black/20'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-white font-bold text-2xl tracking-tight group"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-colors"></div>
              <Hexagon className="w-8 h-8 fill-primary text-primary relative z-10" />
            </div>
            <span>
              Nexus<span className="text-slate-400 font-medium">ERP</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <a href="#inicio" className="hover:text-white transition-colors">
              Início
            </a>
            <a href="#visao-geral" className="hover:text-white transition-colors">
              Plataforma
            </a>
            <a href="#recursos" className="hover:text-white transition-colors">
              Recursos
            </a>
            <a href="#compliance" className="hover:text-white transition-colors">
              Compliance
            </a>
          </nav>
          <div className="flex gap-4 items-center">
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-slate-800/50 hidden sm:inline-flex rounded-full px-6"
              asChild
            >
              <Link to="/login">Entrar</Link>
            </Button>
            <Button
              asChild
              className="rounded-full px-6 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] bg-primary hover:bg-primary/90 text-white font-semibold group"
            >
              <Link to={user ? lastRoute : '/login'}>
                {user ? 'Acessar Painel' : 'Começar'}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-950 text-slate-400 pt-20 pb-12 border-t border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 text-white font-bold text-2xl tracking-tight">
              <Hexagon className="w-8 h-8 fill-primary text-primary" />
              <span>
                Nexus<span className="text-slate-400 font-medium">ERP</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Sistemas de alta performance para engenharia e gestão inteligente de negócios
              escaláveis. Construído para operações de missão crítica.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
              Módulos Base
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to={user ? lastRoute : '/login'}
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  Dashboard Intelligence
                </Link>
              </li>
              <li>
                <Link
                  to={user ? '/app/relacionamento' : '/login'}
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  Gestão de Relacionamento
                </Link>
              </li>
              <li>
                <Link
                  to={user ? '/app/financeiro' : '/login'}
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  Controle Financeiro
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> Roadmap Tecnológico
            </h4>
            <ul className="space-y-3 text-sm">
              {UPCOMING_MODULES.slice(0, 4).map((m) => (
                <li
                  key={m.name}
                  className="truncate text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {m.name}
                </li>
              ))}
              <li className="text-primary/80 italic mt-4 text-xs font-medium">
                + 13 módulos estruturais em desenvolvimento
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
              Legal & Compliance
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Termos de Serviço
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Privacidade de Dados (LGPD)
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Compliance Técnico (MTP 671)
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-slate-900/50 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Nexus ERP. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span>Status: Operacional</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 self-center animate-pulse"></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
