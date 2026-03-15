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
  ShoppingBag,
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

export const MENU_CATEGORIES = [
  {
    name: 'Visão Geral',
    icon: LayoutDashboard,
    path: '/app',
  },
  {
    name: 'Relacionamento',
    icon: Users,
    items: [
      {
        name: 'Contatos',
        path: '/app/contatos',
        icon: Users,
        description: 'Gestão de clientes e parceiros',
      },
      {
        name: 'CRM B2B',
        path: '/app/em-breve?module=CRM',
        icon: Briefcase,
        isUpcoming: true,
        description: 'Pipeline e vendas',
      },
    ],
  },
  {
    name: 'Administrativo',
    icon: CircleDollarSign,
    items: [
      {
        name: 'Financeiro',
        path: '/app/financeiro',
        icon: CircleDollarSign,
        description: 'Controle de caixa e despesas',
      },
      {
        name: 'Recursos Humanos',
        path: '/app/em-breve?module=Recurso%20Humanos',
        icon: UserPlus,
        isUpcoming: true,
        description: 'Gestão de colaboradores',
      },
      {
        name: 'Controle de Ponto',
        path: '/app/em-breve?module=Controle%20de%20Ponto',
        icon: Clock,
        isUpcoming: true,
        description: 'Jornada de trabalho',
      },
    ],
  },
  {
    name: 'Engenharia & Obras',
    icon: HardHat,
    items: [
      {
        name: 'Gestão de Obras',
        path: '/app/em-breve?module=Gestão%20de%20Obras',
        icon: HardHat,
        isUpcoming: true,
        description: 'Acompanhamento de projetos',
      },
      {
        name: 'Orçamento de Obra',
        path: '/app/em-breve?module=Orçamento%20de%20Obra',
        icon: Calculator,
        isUpcoming: true,
        description: 'Levantamento de custos',
      },
    ],
  },
  {
    name: 'Operacional',
    icon: Truck,
    items: [
      {
        name: 'Gestão de Frotas',
        path: '/app/em-breve?module=Gestão%20de%20Frotas',
        icon: Truck,
        isUpcoming: true,
        description: 'Controle de veículos',
      },
      {
        name: 'Equipamentos',
        path: '/app/em-breve?module=Gestão%20de%20Equipamentos',
        icon: Wrench,
        isUpcoming: true,
        description: 'Rastreio e manutenção',
      },
      {
        name: 'Locação',
        path: '/app/em-breve?module=Locação%20de%20Equipamentos',
        icon: Repeat2,
        isUpcoming: true,
        description: 'Contratos e locações',
      },
    ],
  },
  {
    name: 'Inteligência',
    icon: PieChart,
    items: [
      {
        name: 'BI Gerencial',
        path: '/app/em-breve?module=BI%20Gerencial',
        icon: PieChart,
        isUpcoming: true,
        description: 'Inteligência de negócios',
      },
      {
        name: 'Dashboard Builder',
        path: '/app/em-breve?module=Dashboard%20Builder',
        icon: PenTool,
        isUpcoming: true,
        description: 'Criação de painéis',
      },
      {
        name: 'Relatórios Avançados',
        path: '/app/em-breve?module=Relatórios%20Avançados',
        icon: FileBarChart,
        isUpcoming: true,
        description: 'Análises de dados',
      },
    ],
  },
  {
    name: 'Energia Solar',
    icon: Sun,
    items: [
      {
        name: 'Gerador de Proposta',
        path: '/app/em-breve?module=Gerador%20de%20Proposta%20Solar',
        icon: Sun,
        isUpcoming: true,
        description: 'Dimensionamento solar',
      },
      {
        name: 'Monitoramento',
        path: '/app/em-breve?module=Sistema%20de%20Monitoramento%20Solar',
        icon: Activity,
        isUpcoming: true,
        description: 'Geração de energia',
      },
    ],
  },
  {
    name: 'Ferramentas',
    icon: Wrench,
    items: [
      {
        name: 'Automação de Tarefas',
        path: '/app/em-breve?module=Sistema%20de%20Automação%20de%20Tarefas',
        icon: CheckSquare,
        isUpcoming: true,
        description: 'Workflows',
      },
      {
        name: 'Gerador de Documentos',
        path: '/app/em-breve?module=Gerador%20de%20Proposta%20e%20Documentos',
        icon: FileSignature,
        isUpcoming: true,
        description: 'Contratos automáticos',
      },
      {
        name: 'Escritório Virtual',
        path: '/app/em-breve?module=Escritório%20Virtual',
        icon: Monitor,
        isUpcoming: true,
        description: 'Colaboração remota',
      },
    ],
  },
  {
    name: 'Loja de Módulos',
    icon: ShoppingBag,
    path: '/app/loja',
  },
]
