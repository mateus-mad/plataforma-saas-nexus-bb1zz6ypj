import { Link, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Hexagon, Layers } from 'lucide-react'
import { UPCOMING_MODULES } from '@/config/modules'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <Hexagon className="w-6 h-6 fill-primary" />
            <span>NexusERP</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-primary transition-colors">
              Recursos
            </a>
            <a href="#roadmap" className="hover:text-primary transition-colors">
              Módulos
            </a>
            <a href="#pricing" className="hover:text-primary transition-colors">
              Planos
            </a>
          </nav>
          <div className="flex gap-3">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/app">Login</Link>
            </Button>
            <Button asChild className="hover:scale-[1.02] transition-transform">
              <Link to="/app">Começar Agora</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16 animate-fade-in">
        <Outlet />
      </main>

      <footer className="bg-slate-950 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <Hexagon className="w-6 h-6 fill-primary text-primary" />
              <span>NexusERP</span>
            </div>
            <p className="text-sm text-slate-400">
              A plataforma definitiva para gerir sua empresa de ponta a ponta.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Módulos Ativos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/app" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/app/contatos" className="hover:text-primary transition-colors">
                  Contatos
                </Link>
              </li>
              <li>
                <Link to="/app/financeiro" className="hover:text-primary transition-colors">
                  Financeiro
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Próximos Lançamentos
            </h4>
            <ul className="space-y-2 text-sm grid grid-cols-2 gap-x-2">
              {UPCOMING_MODULES.slice(0, 8).map((m) => (
                <li key={m.name} className="truncate text-slate-500">
                  {m.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
