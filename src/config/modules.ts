import {
  LayoutDashboard,
  Users,
  CircleDollarSign,
  UserPlus,
  Truck,
  Wrench,
  Repeat2,
  HardHat,
  LayoutTemplate,
  FileBarChart,
  Briefcase,
  Monitor,
  PenTool,
  Calculator,
  FileSignature,
  PieChart,
  Sun,
  Activity,
  Clock,
  CheckSquare,
} from 'lucide-react'

export const ACTIVE_MODULES = [
  {
    name: 'Dashboard',
    path: '/app',
    icon: LayoutDashboard,
    description:
      'Central de inteligência para monitoramento em tempo real e tomada de decisão baseada em dados.',
  },
  {
    name: 'Contatos',
    path: '/app/contatos',
    icon: Users,
    description: 'Sistema de gestão centralizada para clientes, parceiros e stakeholders.',
  },
  {
    name: 'Financeiro',
    path: '/app/financeiro',
    icon: CircleDollarSign,
    description:
      'Módulo robusto de controle financeiro para gestão de fluxo de caixa, despesas e sustentabilidade econômica.',
  },
]

export const UPCOMING_MODULES = [
  {
    name: 'Recurso Humanos',
    icon: UserPlus,
    description: 'Gestão completa do ciclo de vida dos colaboradores.',
  },
  {
    name: 'Gestão de Frotas',
    icon: Truck,
    description: 'Controle de veículos, manutenções e rotas logísticas.',
  },
  {
    name: 'Gestão de Equipamentos',
    icon: Wrench,
    description: 'Rastreio e manutenção preventiva de maquinário.',
  },
  {
    name: 'Locação de Equipamentos',
    icon: Repeat2,
    description: 'Gestão de contratos e disponibilidade de locação.',
  },
  {
    name: 'Gestão de Obras',
    icon: HardHat,
    description: 'Acompanhamento físico e financeiro de projetos.',
  },
  {
    name: 'Dashboards Modulares',
    icon: LayoutTemplate,
    description: 'Visões customizáveis para diferentes departamentos.',
  },
  {
    name: 'Relatórios Avançados',
    icon: FileBarChart,
    description: 'Análises profundas e exportação flexível de dados.',
  },
  {
    name: 'CRM',
    icon: Briefcase,
    description: 'Gestão de relacionamento e pipeline de vendas B2B.',
  },
  {
    name: 'Escritório Virtual',
    icon: Monitor,
    description: 'Ambiente digital de colaboração remota e comunicação.',
  },
  {
    name: 'Dashboard Builder',
    icon: PenTool,
    description: 'Criação visual e dinâmica de painéis de indicadores.',
  },
  {
    name: 'Orçamento de Obra',
    icon: Calculator,
    description: 'Composição de custos e levantamento de quantitativos.',
  },
  {
    name: 'Gerador de Proposta e Documentos',
    icon: FileSignature,
    description: 'Automação na criação de contratos e propostas comerciais.',
  },
  {
    name: 'BI Gerencial',
    icon: PieChart,
    description: 'Inteligência de negócios avançada para alta gestão.',
  },
  {
    name: 'Gerador de Proposta Solar',
    icon: Sun,
    description: 'Dimensionamento e propostas para sistemas de energia.',
  },
  {
    name: 'Sistema de Monitoramento Solar',
    icon: Activity,
    description: 'Acompanhamento de geração de energia em tempo real.',
  },
  {
    name: 'Controle de Ponto',
    icon: Clock,
    description: 'Registro e gestão inteligente de jornada de trabalho.',
  },
  {
    name: 'Sistema de Automação de Tarefas',
    icon: CheckSquare,
    description: 'Workflows automatizados para processos rotineiros.',
  },
]
