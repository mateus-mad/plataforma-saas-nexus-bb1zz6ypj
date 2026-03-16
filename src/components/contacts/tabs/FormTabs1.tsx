import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Info, UploadCloud } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type Props = {
  data: any
  onChange: (f: string, v: any) => void
  errors?: Record<string, string>
  readOnly?: boolean
}

const LabelT = ({ l, t, req }: { l: string; t?: string; req?: boolean }) => (
  <Label className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1.5 text-xs sm:text-sm">
    {l} {req && <span className="text-rose-500">*</span>}
    {t && (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger type="button" tabIndex={-1}>
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 transition-colors" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[250px] text-xs font-normal">
            {t}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </Label>
)

export function DocsTab({ data, onChange, errors, readOnly }: Props) {
  const [ocrLoading, setOcrLoading] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleOcrSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setOcrLoading(true)
      setTimeout(() => {
        onChange('docType', 'RG')
        onChange('cpf', '123.456.789-00')
        onChange('docIssueDate', '2020-05-15')
        setOcrLoading(false)
        toast({
          title: 'Documento Processado',
          description: 'Dados extraídos com sucesso via Inteligência Artificial (OCR).',
        })
      }, 1500)
    }
  }

  const err = (f: string) =>
    errors?.[`docs.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {!readOnly && (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-blue-50/50 transition-colors">
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            <UploadCloud className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-slate-800 mb-1">
            Upload Automático de Documento (OCR)
          </h4>
          <p className="text-xs text-slate-500 mb-4 max-w-md">
            Faça upload da foto do RG, CNH ou CTPS para preencher os campos automaticamente com a
            nossa inteligência artificial.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,.pdf"
            onChange={handleOcrSimulate}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={ocrLoading}
            variant="outline"
            className="bg-white"
          >
            {ocrLoading ? 'Analisando Documento...' : 'Anexar Documento para Leitura'}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <LabelT l="Tipo de Documento" t="Selecione o documento principal" />
          <Select
            value={data.docType}
            onValueChange={(v) => onChange('docType', v)}
            disabled={readOnly}
          >
            <SelectTrigger className="bg-slate-50">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RG">RG</SelectItem>
              <SelectItem value="RNE">RNE</SelectItem>
              <SelectItem value="Passaporte">Passaporte</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <LabelT l="Data de Emissão" t="Data que consta no documento" />
          <Input
            type="date"
            value={data.docIssueDate || ''}
            onChange={(e) => onChange('docIssueDate', e.target.value)}
            disabled={readOnly}
            className={err('docIssueDate')}
          />
        </div>
        <div>
          <LabelT l="CPF" t="Apenas números, obrigatório para eSocial" req />
          <Input
            value={data.cpf || ''}
            onChange={(e) => onChange('cpf', e.target.value)}
            placeholder="000.000.000-00"
            className={cn('font-mono', err('cpf'))}
            disabled={readOnly}
          />
        </div>
        <div>
          <LabelT l="PIS/PASEP" t="Número de Inscrição" req />
          <Input
            value={data.pis || ''}
            onChange={(e) => onChange('pis', e.target.value)}
            placeholder="000.00000.00-0"
            className={cn('font-mono', err('pis'))}
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
          <h4 className="font-semibold text-slate-800 text-sm">CTPS - Carteira de Trabalho</h4>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
            Obrigatório para CLT
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <LabelT l="Número da CTPS" t="Número de registro da carteira" />
            <Input
              value={data.ctpsNum || ''}
              onChange={(e) => onChange('ctpsNum', e.target.value)}
              placeholder="Número"
              disabled={readOnly}
              className={err('ctpsNum')}
            />
          </div>
          <div>
            <LabelT l="Série" t="Série do documento" />
            <Input
              value={data.ctpsSeries || ''}
              onChange={(e) => onChange('ctpsSeries', e.target.value)}
              placeholder="Série"
              disabled={readOnly}
              className={err('ctpsSeries')}
            />
          </div>
          <div>
            <LabelT l="UF da CTPS" t="Estado de emissão" />
            <Select
              value={data.ctpsUf}
              onValueChange={(v) => onChange('ctpsUf', v)}
              disabled={readOnly}
            >
              <SelectTrigger className={err('ctpsUf')}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SP">SP</SelectItem>
                <SelectItem value="RJ">RJ</SelectItem>
                <SelectItem value="MG">MG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <LabelT l="Data de Emissão" t="Data de expedição da CTPS" />
            <Input
              type="date"
              value={data.ctpsDate || ''}
              onChange={(e) => onChange('ctpsDate', e.target.value)}
              disabled={readOnly}
              className={err('ctpsDate')}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-2">
          Outros Documentos
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <LabelT l="Título de Eleitor" t="Número de inscrição eleitoral" />
            <Input
              value={data.titEleitor || ''}
              onChange={(e) => onChange('titEleitor', e.target.value)}
              placeholder="Número"
              disabled={readOnly}
              className={err('titEleitor')}
            />
          </div>
          <div>
            <LabelT l="Zona Eleitoral" t="Zona de votação" />
            <Input
              value={data.zonaEleit || ''}
              onChange={(e) => onChange('zonaEleit', e.target.value)}
              placeholder="Zona"
              disabled={readOnly}
              className={err('zonaEleit')}
            />
          </div>
          <div>
            <LabelT l="Seção Eleitoral" t="Seção de votação" />
            <Input
              value={data.secaoEleit || ''}
              onChange={(e) => onChange('secaoEleit', e.target.value)}
              placeholder="Seção"
              disabled={readOnly}
              className={err('secaoEleit')}
            />
          </div>
          <div>
            <LabelT l="Certificado de Reservista" t="Para homens maiores de 18 anos" />
            <Input
              value={data.certReserv || ''}
              onChange={(e) => onChange('certReserv', e.target.value)}
              placeholder="Número"
              disabled={readOnly}
              className={err('certReserv')}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
        <div className="flex items-center gap-3">
          <Switch
            checked={data.isDriver}
            onCheckedChange={(v) => onChange('isDriver', v)}
            className="data-[state=checked]:bg-blue-600"
            disabled={readOnly}
          />
          <Label className="text-slate-800 font-semibold cursor-pointer">
            Colaborador necessita de CNH (Motorista)
          </Label>
        </div>
        {data.isDriver && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 animate-in fade-in slide-in-from-top-2">
            <div>
              <LabelT l="Número da CNH" t="Número de registro da CNH" req />
              <Input
                value={data.cnhNum || ''}
                onChange={(e) => onChange('cnhNum', e.target.value)}
                placeholder="Número"
                className={cn('bg-white', err('cnhNum'))}
                disabled={readOnly}
              />
            </div>
            <div>
              <LabelT l="Categoria" t="Categoria de habilitação (Ex: AB, C, D)" req />
              <Select
                value={data.cnhCat}
                onValueChange={(v) => onChange('cnhCat', v)}
                disabled={readOnly}
              >
                <SelectTrigger className={cn('bg-white', err('cnhCat'))}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="AB">AB</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                  <SelectItem value="E">E</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <LabelT l="Validade" t="Data de vencimento da CNH" req />
              <Input
                type="date"
                value={data.cnhVal || ''}
                onChange={(e) => onChange('cnhVal', e.target.value)}
                className={cn('bg-white', err('cnhVal'))}
                disabled={readOnly}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function AddressTab({ data, onChange, errors, readOnly }: Props) {
  const STATES = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ]

  const err = (f: string) =>
    errors?.[`endereco.${f}`] ? 'border-rose-500 bg-rose-50/30 focus-visible:ring-rose-500' : ''

  const onCepBlur = async (e: any) => {
    const cep = e.target.value.replace(/\D/g, '')
    if (cep.length === 8 && !readOnly) {
      try {
        const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const d = await r.json()
        if (!d.erro) {
          onChange('logradouro', d.logradouro)
          onChange('bairro', d.bairro)
          onChange('cidade', d.localidade)
          onChange('estado', d.uf)
        }
      } catch (err) {
        console.error('Failed to fetch CEP')
      }
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-blue-50/80 border border-blue-200 text-blue-800 p-3.5 rounded-xl flex gap-3 items-center text-sm shadow-sm">
        <Info className="w-5 h-5 text-blue-500 shrink-0" />
        <p className="leading-relaxed">
          <span className="font-semibold">Endereço:</span> Digite o CEP para preenchimento
          automático do endereço via ViaCEP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="space-y-1.5 md:col-span-2">
          <LabelT l="CEP" t="Digite apenas os números" req />
          <div className="relative">
            <Input
              value={data.cep || ''}
              onChange={(e) => onChange('cep', e.target.value)}
              onBlur={onCepBlur}
              placeholder="00000-000"
              className={cn('pl-10', err('cep'))}
              disabled={readOnly}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
          <p className="text-[10px] text-slate-400 ml-1">Formato: 00000-000</p>
        </div>
        <div className="space-y-1.5 md:col-span-4">
          <LabelT l="Logradouro" t="Rua, Avenida, Praça, etc." req />
          <Input
            value={data.logradouro || ''}
            onChange={(e) => onChange('logradouro', e.target.value)}
            placeholder="Rua, Avenida, etc."
            className={err('logradouro')}
            disabled={readOnly}
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <LabelT l="Número" t="Número da residência (Use 'SN' se não houver)" req />
          <Input
            value={data.numero || ''}
            onChange={(e) => onChange('numero', e.target.value)}
            placeholder="Nº"
            className={err('numero')}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5 md:col-span-4">
          <LabelT l="Complemento" t="Apto, Bloco, Fundos, etc." />
          <Input
            value={data.comp || ''}
            onChange={(e) => onChange('comp', e.target.value)}
            placeholder="Apto, Bloco, etc."
            className={err('comp')}
            disabled={readOnly}
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <LabelT l="Bairro" t="Bairro ou distrito" req />
          <Input
            value={data.bairro || ''}
            onChange={(e) => onChange('bairro', e.target.value)}
            placeholder="Bairro"
            className={err('bairro')}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <LabelT l="Cidade" t="Município" req />
          <Input
            value={data.cidade || ''}
            onChange={(e) => onChange('cidade', e.target.value)}
            placeholder="Cidade"
            className={err('cidade')}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <LabelT l="Estado (UF)" t="Unidade Federativa" req />
          <Select
            value={data.estado}
            onValueChange={(v) => onChange('estado', v)}
            disabled={readOnly}
          >
            <SelectTrigger className={err('estado')}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
