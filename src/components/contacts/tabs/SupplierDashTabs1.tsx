import { Building2, MapPin, Phone, Mail, Briefcase, Calendar, HeartHandshake } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const Section = ({ t, icon: Icon, children }: any) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full flex flex-col">
    <h3 className="font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4 text-base">
      <Icon className="w-5 h-5 text-blue-600" /> {t}
    </h3>
    <div className="flex-1">{children}</div>
  </div>
)

const Field = ({ l, v, mono }: { l: string; v: string; mono?: boolean }) => (
  <div className="space-y-1 mb-4">
    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{l}</p>
    <p className={`text-sm font-semibold text-slate-800 ${mono ? 'font-mono' : ''}`}>{v || '-'}</p>
  </div>
)

export function SupplierIdentificationTab({ data }: any) {
  const d = data.dados || {}
  const e = data.endereco || {}
  const isPJ = d.tipoPessoa === 'PJ'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <Section t="Dados Cadastrais" icon={Building2}>
        <div className="grid grid-cols-2 gap-4">
          <Field l={isPJ ? 'CNPJ' : 'CPF'} v={d.documento} mono />
          <Field l={isPJ ? 'Razão Social' : 'Nome Completo'} v={d.nomeRazao} />
          {isPJ && <Field l="Nome Fantasia" v={d.fantasia} />}
          <Field l="Segmento de Atuação" v={d.segmento} />
          {isPJ && <Field l="Inscrição Estadual" v={d.ie} mono />}
          {isPJ && <Field l="Inscrição Municipal" v={d.im} mono />}
          <Field
            l={isPJ ? 'Data de Abertura' : 'Data de Nascimento'}
            v={isPJ ? d.dataAbertura : d.dataNascimento}
          />
          <div className="space-y-1 mb-4">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Status ERP
            </p>
            {d.ativo ? (
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none shadow-none mt-1">
                Fornecedor Ativo
              </Badge>
            ) : (
              <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none shadow-none mt-1">
                Inativo
              </Badge>
            )}
          </div>
        </div>
      </Section>
      <Section t="Endereço e Contato Padrão" icon={MapPin}>
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6">
          <p className="text-slate-800 text-base leading-relaxed">
            <span className="font-bold">{e.logradouro || 'Rua/Av'}</span>, {e.numero || 'S/N'}{' '}
            {e.comp ? `(${e.comp})` : ''}
            <br />
            <span className="text-slate-600">
              {e.bairro}, {e.cidade}/{e.estado}
            </span>
            <br />
            <span className="text-sm font-mono text-slate-500 mt-2 block">CEP: {e.cep}</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field l="E-mail Padrão (Faturamento)" v={data.contato?.emailCobranca} />
          <Field l="Website Corporativo" v={data.contato?.website} />
        </div>
      </Section>
    </div>
  )
}

export function SupplierContactsTab({ data }: any) {
  const pessoas = data.contato?.pessoas || []
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {pessoas.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500">Nenhum contato estratégico cadastrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pessoas.map((p: any, i: number) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-blue-300 transition-colors"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-blue-600 text-white font-bold">
                    {p.nome?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate">{p.nome}</h4>
                  <Badge
                    variant="outline"
                    className="bg-white mt-1 flex w-fit items-center gap-1 text-[10px]"
                  >
                    <Briefcase className="w-3 h-3" /> {p.cargo}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 mt-auto pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" /> {p.telefone || '-'}
                </p>
                <p className="text-sm text-slate-600 flex items-center gap-2 truncate">
                  <Mail className="w-4 h-4 text-slate-400" /> {p.email || '-'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SupplierRelationshipTab({ data, updateData }: any) {
  const rel = data.relacionamento || {}
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
          <HeartHandshake className="w-6 h-6 text-rose-500" /> Gestão Contínua de Relacionamento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="md:col-span-2 flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 w-fit">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Calendar className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 block">
                Início da Parceria
              </Label>
              <Input
                type="date"
                value={rel.dataInicio || ''}
                onChange={(e) => updateData('relacionamento', 'dataInicio', e.target.value)}
                className="h-8 font-bold border-transparent bg-transparent shadow-none px-0 focus-visible:ring-0 w-36"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-bold text-rose-700 flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Problemas & Ocorrências
            </Label>
            <Textarea
              value={rel.problemas || ''}
              onChange={(e) => updateData('relacionamento', 'problemas', e.target.value)}
              placeholder="Registre aqui atrasos, avarias, falhas de SLA..."
              className="min-h-[140px] bg-rose-50/30 border-rose-100 focus-visible:ring-rose-500"
            />
          </div>
          <div>
            <Label className="text-sm font-bold text-emerald-700 flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Elogios & Pontos Fortes
            </Label>
            <Textarea
              value={rel.elogios || ''}
              onChange={(e) => updateData('relacionamento', 'elogios', e.target.value)}
              placeholder="Registre entregas antecipadas, qualidade excepcional..."
              className="min-h-[140px] bg-emerald-50/30 border-emerald-100 focus-visible:ring-emerald-500"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Observações Estratégicas
            </Label>
            <Textarea
              value={rel.observacoes || ''}
              onChange={(e) => updateData('relacionamento', 'observacoes', e.target.value)}
              placeholder="Notas estratégicas sobre a parceria a longo prazo..."
              className="min-h-[100px] bg-blue-50/30 border-blue-100 focus-visible:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
