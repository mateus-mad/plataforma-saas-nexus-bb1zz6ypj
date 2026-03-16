import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, XCircle, UserPlus, ShieldCheck } from 'lucide-react'

export default function Onboarding() {
  const { token } = useParams()
  const [status, setStatus] = useState<'loading' | 'active' | 'expired' | 'success'>('loading')

  useEffect(() => {
    // Simula a verificação de link único via token
    if (localStorage.getItem(`onboarding_${token}`)) {
      setStatus('expired')
    } else {
      setStatus('active')
    }
  }, [token])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Marca o link como utilizado
    localStorage.setItem(`onboarding_${token}`, 'true')
    setStatus('success')
  }

  if (status === 'loading') return null

  if (status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4 border border-slate-100">
          <XCircle className="w-16 h-16 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800">Link Expirado</h2>
          <p className="text-slate-600">
            Este link de admissão já foi utilizado ou não é mais válido por motivos de segurança.
            Entre em contato com o RH da empresa.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4 border border-slate-100">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800">Dados Enviados!</h2>
          <p className="text-slate-600">
            Sua ficha de pré-admissão foi enviada com sucesso para o departamento de Recursos
            Humanos. O link foi desativado.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-xl w-full border border-slate-100">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
            <UserPlus className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800">Portal de Admissão</h2>
            <p className="text-sm text-slate-500">Preencha seus dados cadastrais iniciais</p>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" title="Ambiente Seguro" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-slate-700">Nome Completo</Label>
            <Input required placeholder="Conforme documento oficial" className="bg-slate-50" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-slate-700">CPF</Label>
              <Input required placeholder="000.000.000-00" className="bg-slate-50" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700">Data de Nascimento</Label>
              <Input type="date" required className="bg-slate-50" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-700">E-mail Pessoal</Label>
            <Input type="email" required placeholder="seu@email.com" className="bg-slate-50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-700">Telefone / WhatsApp</Label>
            <Input required placeholder="(00) 00000-0000" className="bg-slate-50" />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-4 text-center">
              Ao enviar, este link de uso único será expirado automaticamente.
            </p>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-semibold shadow-sm"
            >
              Confirmar e Enviar Dados
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
