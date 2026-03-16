import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function DocsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-2">
        <Label>CPF</Label>
        <Input placeholder="000.000.000-00" />
      </div>
      <div className="space-y-2">
        <Label>RG</Label>
        <Input placeholder="00.000.000-0" />
      </div>
      <div className="space-y-2">
        <Label>PIS/PASEP</Label>
        <Input placeholder="000.00000.00-0" />
      </div>
      <div className="space-y-2">
        <Label>CTPS (Número/Série)</Label>
        <Input placeholder="0000000 / 000-0" />
      </div>
      <div className="space-y-2">
        <Label>Título de Eleitor</Label>
        <Input placeholder="0000 0000 0000" />
      </div>
      <div className="space-y-2">
        <Label>Reservista (Masculino)</Label>
        <Input placeholder="Número" />
      </div>
    </div>
  )
}

export function AddressTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-2">
        <Label>CEP</Label>
        <Input placeholder="00000-000" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Logradouro</Label>
        <Input placeholder="Rua, Avenida..." />
      </div>
      <div className="space-y-2">
        <Label>Número</Label>
        <Input placeholder="123" />
      </div>
      <div className="space-y-2">
        <Label>Complemento</Label>
        <Input placeholder="Apto, Sala..." />
      </div>
      <div className="space-y-2">
        <Label>Bairro</Label>
        <Input placeholder="Bairro" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Cidade</Label>
        <Input placeholder="Cidade" />
      </div>
      <div className="space-y-2">
        <Label>Estado (UF)</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="UF" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sp">SP</SelectItem>
            <SelectItem value="rj">RJ</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function ContactTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-2">
        <Label>Celular (WhatsApp)</Label>
        <Input placeholder="(00) 00000-0000" />
      </div>
      <div className="space-y-2">
        <Label>Telefone Fixo</Label>
        <Input placeholder="(00) 0000-0000" />
      </div>
      <div className="space-y-2">
        <Label>E-mail Pessoal</Label>
        <Input type="email" placeholder="email@exemplo.com" />
      </div>
      <div className="space-y-2">
        <Label>E-mail Corporativo</Label>
        <Input type="email" placeholder="nome@empresa.com" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Contato de Emergência</Label>
        <Input placeholder="Nome - (00) 00000-0000" />
      </div>
    </div>
  )
}

export function WorkTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-2">
        <Label>Cargo/Função</Label>
        <Input placeholder="Engenheiro Civil" />
      </div>
      <div className="space-y-2">
        <Label>Departamento</Label>
        <Input placeholder="Engenharia" />
      </div>
      <div className="space-y-2">
        <Label>Data de Admissão</Label>
        <Input type="date" />
      </div>
      <div className="space-y-2">
        <Label>Tipo de Contrato</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clt">CLT</SelectItem>
            <SelectItem value="pj">PJ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Jornada de Trabalho</Label>
        <Input placeholder="44h semanais" />
      </div>
      <div className="space-y-2">
        <Label>Gestor Direto</Label>
        <Input placeholder="Nome do Gestor" />
      </div>
    </div>
  )
}

export function SalaryTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-2">
        <Label>Salário Base</Label>
        <Input placeholder="R$ 0,00" />
      </div>
      <div className="space-y-2">
        <Label>Forma de Pagamento</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mensal">Mensal</SelectItem>
            <SelectItem value="horista">Horista</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Banco</Label>
        <Input placeholder="Nome do Banco" />
      </div>
      <div className="space-y-2">
        <Label>Agência e Conta</Label>
        <Input placeholder="0000 / 00000-0" />
      </div>
      <div className="space-y-2">
        <Label>Chave PIX</Label>
        <Input placeholder="Chave" />
      </div>
    </div>
  )
}

export function BenefitsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-2">
        <Label>Vale Transporte</Label>
        <Input placeholder="R$ por dia/mês ou Não recebe" />
      </div>
      <div className="space-y-2">
        <Label>Vale Refeição</Label>
        <Input placeholder="R$ por dia/mês ou Não recebe" />
      </div>
      <div className="space-y-2">
        <Label>Plano de Saúde</Label>
        <Input placeholder="Operadora/Plano" />
      </div>
      <div className="space-y-2">
        <Label>Plano Odontológico</Label>
        <Input placeholder="Operadora/Plano" />
      </div>
    </div>
  )
}

export function ChargesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-2">
        <Label>Alíquota INSS (%)</Label>
        <Input placeholder="Calculado" readOnly className="bg-slate-50" />
      </div>
      <div className="space-y-2">
        <Label>Alíquota IRRF (%)</Label>
        <Input placeholder="Calculado" readOnly className="bg-slate-50" />
      </div>
      <div className="space-y-2">
        <Label>Dependentes IR</Label>
        <Input type="number" placeholder="0" />
      </div>
      <div className="space-y-2">
        <Label>Dependentes Salário Família</Label>
        <Input type="number" placeholder="0" />
      </div>
    </div>
  )
}

export function VacationTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-2">
        <Label>Início Período Aquisitivo</Label>
        <Input type="date" />
      </div>
      <div className="space-y-2">
        <Label>Fim Período Aquisitivo</Label>
        <Input type="date" />
      </div>
      <div className="space-y-2">
        <Label>Dias de Direito</Label>
        <Input type="number" placeholder="30" />
      </div>
      <div className="space-y-2">
        <Label>Dias Tirados</Label>
        <Input type="number" placeholder="0" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Próximas Férias Programadas</Label>
        <Input type="date" />
      </div>
    </div>
  )
}
