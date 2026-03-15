import { useSearchParams, Link } from 'react-router-dom'
import { HardHat, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ComingSoon() {
  const [searchParams] = useSearchParams()
  const moduleName = searchParams.get('module') || 'Este módulo'

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-lg mx-auto animate-fade-in">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <HardHat className="w-10 h-10 text-slate-400" />
      </div>
      <h1 className="text-3xl font-bold mb-4">{moduleName} em Desenvolvimento</h1>
      <p className="text-slate-600 mb-8 text-lg">
        Nossa equipe de engenharia está trabalhando duro para trazer recursos incríveis para esta
        área. A arquitetura da plataforma já está preparada para recebê-lo em breve!
      </p>
      <Button asChild variant="outline">
        <Link to="/app">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o Dashboard
        </Link>
      </Button>
    </div>
  )
}
