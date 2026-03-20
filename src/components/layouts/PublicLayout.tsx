import { Link, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Hexagon, Layers } from 'lucide-react'
import { UPCOMING_MODULES } from '@/config/modules'
import { db } from '@/lib/database'
import { useAuth } from '@/hooks/use-auth'

export default function PublicLayout() {
  const [lastRoute, setLastRoute] = useState('/app')
  const { user } = useAuth()

  useEffect(() => {
    db.get('last_route').then((route) => {
      if (route && route.startsWith('/app')) {
        setLastRoute(route)
      }
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight"
          >
            <Hexagon className="w-6 h-6 fill-primary" />
            <span>NexusERP</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <a href="#inicio" className="hover:text-primary transition-colors">
              Início
            </a>
            <a href="#modulos" className="hover:text-primary transition-colors">
              Módulos
            </a>
            <a href="#sobre" className="hover:text-primary transition-colors">
              Sobre Nós
            </a>
          </nav>
          <div className="flex gap-3">
            <Button
              asChild
              className="hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-primary/50 text-white font-medium"
            >
              <Link to={user ? lastRoute : '/login'}>{user ? 'Acessar Plataforma' : 'Entrar'}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16 animate-fade-in">
        <Outlet />
      </main>

      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20"></div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
              <Hexagon className="w-6 h-6 fill-primary text-primary" />
              <span>NexusERP</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              Sistemas de alta performance para engenharia e gestão inteligente de negócios
              escaláveis.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Módulos Base</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to={user ? lastRoute : '/login'}
                  className="hover:text-primary transition-colors"
                >
                  Dashboard Intelligence
                </Link>
              </li>
              <li>
                <Link
                  to={user ? '/app/relacionamento' : '/login'}
                  className="hover:text-primary transition-colors"
                >
                  Gestão de Relacionamento
                </Link>
              </li>
              <li>
                <Link
                  to={user ? '/app/financeiro' : '/login'}
                  className="hover:text-primary transition-colors"
                >
                  Controle Financeiro
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> Roadmap Tecnológico
            </h4>
            <ul className="space-y-2 text-sm grid grid-cols-1 gap-x-2">
              {UPCOMING_MODULES.slice(0, 5).map((m) => (
                <li
                  key={m.name}
                  className="truncate text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {m.name}
                </li>
              ))}
              <li className="text-primary italic mt-2 text-xs">E mais 12 módulos estruturais...</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Termos de Serviço
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacidade de Dados
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Compliance Técnico
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
