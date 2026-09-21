export interface EventData {
  id: string;
  name: string;
  clientName?: string;
  slug?: string;
  type: string;
  date: string;
  time: string;
  location: string;
  address: string;
  mapsUrl: string;
  description: string;
  rsvpDeadline: string;
  allowGuests: boolean;
  maxGuestsPerInvite: number;
  status: 'active' | 'closed' | 'draft';
}

export interface GuestData {
  id: string;
  eventId: string;
  name: string;
  displayName: string;
  phone: string;
  email: string;
  group: string;
  maxGuests: number;
  rsvpCode: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'declined';
  respondedAt: string | null;
  companionCount: number;
  companionNames: string[];
  answers: Record<string, any>;
}

export interface ManagerData {
  id: string;
  eventId: string;
  name: string;
  email: string;
  accessStart: string;
  accessEnd: string;
  status: 'active' | 'inactive';
}

export interface FormQuestionData {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  type: 'short_text' | 'long_text' | 'yes_no' | 'single_choice' | 'multiple_choice' | 'number' | 'dropdown' | 'date';
  required: boolean;
  options?: string[];
  order: number;
  condition?: {
    targetQuestionId: string;
    operator: 'equals' | 'greater_than' | 'not_equals';
    value: any;
  };
}

export const INITIAL_EVENTS: EventData[] = [
  {
    id: 'ev-01',
    name: 'Casamento Marina & Lucas',
    clientName: 'Marina Silva & Lucas Prado',
    slug: 'marina-e-lucas',
    type: 'Casamento',
    date: '2026-10-24',
    time: '16:30',
    location: 'Villa Giardini Espaço de Eventos',
    address: 'SHTQ Trecho 1 Conjunto 12, Lago Norte, Brasília - DF',
    mapsUrl: 'https://maps.google.com/?q=Villa+Giardini+Brasilia',
    description: 'Celebração da nossa união com cerimônia ao ar livre seguida de recepção.',
    rsvpDeadline: '2026-10-10',
    allowGuests: true,
    maxGuestsPerInvite: 2,
    status: 'active',
  },
  {
    id: 'ev-02',
    name: '15 Anos Sophia Martins',
    clientName: 'Família Martins & Sophia',
    slug: '15-anos-sophia',
    type: '15 Anos / Debutante',
    date: '2026-11-14',
    time: '20:00',
    location: 'Espaço Contemporâneo Festas',
    address: 'Setor de Mansões Park Way, Brasília - DF',
    mapsUrl: 'https://maps.google.com/?q=Espaco+Contemporaneo+Park+Way',
    description: 'Noite dos sonhos: comemoração dos 15 anos com jantar e balada.',
    rsvpDeadline: '2026-10-31',
    allowGuests: true,
    maxGuestsPerInvite: 1,
    status: 'active',
  },
  {
    id: 'ev-03',
    name: 'Bodas de Prata Carlos & Helena',
    clientName: 'Carlos e Helena Medeiros',
    slug: 'bodas-carlos-helena',
    type: 'Bodas de Prata',
    date: '2026-12-05',
    time: '12:30',
    location: 'Restaurante Coco Bambu Lago Sul',
    address: 'SCES Trecho 2, Conjunto 36, Brasília - DF',
    mapsUrl: 'https://maps.google.com/?q=Coco+Bambu+Lago+Sul',
    description: 'Almoço comemorativo de 25 anos de casamento em família.',
    rsvpDeadline: '2026-11-20',
    allowGuests: true,
    maxGuestsPerInvite: 2,
    status: 'draft',
  },
  {
    id: 'ev-04',
    name: 'Gala Beaquos Design Awards 2026',
    clientName: 'Beaquos Estúdio Criativo',
    slug: 'gala-beaquos-2026',
    type: 'Corporativo',
    date: '2026-08-15',
    time: '19:30',
    location: 'Centro de Convenções Ulysses Guimarães',
    address: 'SDC Eixo Monumental, Brasília - DF',
    mapsUrl: 'https://maps.google.com/?q=Centro+de+Convencoes+Ulysses+Guimaraes',
    description: 'Premiação e networking das marcas parceiras do estúdio.',
    rsvpDeadline: '2026-08-01',
    allowGuests: false,
    maxGuestsPerInvite: 1,
    status: 'closed',
  },
];

export const INITIAL_EVENT: EventData = INITIAL_EVENTS[0];

export const INITIAL_QUESTIONS: FormQuestionData[] = [
  {
    id: 'q_presence',
    eventId: 'ev-01',
    title: 'Você poderá comparecer ao casamento?',
    description: 'Sua confirmação é essencial para a organização do buffet e cerimonial.',
    type: 'yes_no',
    required: true,
    order: 1,
  },
  {
    id: 'q_has_companions',
    eventId: 'ev-01',
    title: 'Você levará acompanhante(s)?',
    description: 'Informe se irá acompanhado de acordo com a sua cota de convite.',
    type: 'yes_no',
    required: true,
    order: 2,
    condition: {
      targetQuestionId: 'q_presence',
      operator: 'equals',
      value: 'sim',
    },
  },
  {
    id: 'q_companion_count',
    eventId: 'ev-01',
    title: 'Quantos acompanhantes irão com você?',
    description: 'Quantidade de pessoas além do titular do convite.',
    type: 'number',
    required: true,
    order: 3,
    condition: {
      targetQuestionId: 'q_has_companions',
      operator: 'equals',
      value: 'sim',
    },
  },
  {
    id: 'q_companion_names',
    eventId: 'ev-01',
    title: 'Nome completo dos acompanhantes',
    description: 'Necessário para a lista da portaria e crachás de identificação.',
    type: 'short_text',
    required: true,
    order: 4,
    condition: {
      targetQuestionId: 'q_companion_count',
      operator: 'greater_than',
      value: 0,
    },
  },
  {
    id: 'q_dietary',
    eventId: 'ev-01',
    title: 'Possui alguma restrição alimentar ou alergia?',
    description: 'Ex: Vegetariano, Vegano, Celíaco (sem glúten), Intolerante à lactose.',
    type: 'multiple_choice',
    required: false,
    options: ['Nenhuma restrição', 'Vegetariano', 'Vegano', 'Sem Glúten (Celíaco)', 'Sem Lactose', 'Outra'],
    order: 5,
    condition: {
      targetQuestionId: 'q_presence',
      operator: 'equals',
      value: 'sim',
    },
  },
  {
    id: 'q_message',
    eventId: 'ev-01',
    title: 'Deixe uma mensagem especial para os noivos',
    description: 'Envie seus votos e carinho para o livro de memórias.',
    type: 'long_text',
    required: false,
    order: 6,
  },
];

export const INITIAL_GUESTS: GuestData[] = [
  {
    id: 'g-01',
    eventId: 'ev-01',
    name: 'Carlos Eduardo Mendes',
    displayName: 'Carlos e Juliana Mendes',
    phone: '(61) 98765-4321',
    email: 'carlos.mendes@email.com',
    group: 'Padrinhos',
    maxGuests: 1,
    rsvpCode: 'BEA-7X9K2',
    notes: 'Padrinho do noivo. Precisa de transfer do aeroporto.',
    status: 'confirmed',
    respondedAt: '2026-09-21 10:14',
    companionCount: 1,
    companionNames: ['Juliana Mendes'],
    answers: {
      q_presence: 'sim',
      q_has_companions: 'sim',
      q_companion_count: 1,
      q_companion_names: 'Juliana Mendes',
      q_dietary: ['Vegetariano'],
      q_message: 'Muito felizes por celebrar este momento tão lindo com vocês!',
    },
  },
  {
    id: 'g-02',
    eventId: 'ev-01',
    name: 'Mariana Duarte',
    displayName: 'Família Duarte',
    phone: '(61) 99123-8877',
    email: 'mariana.duarte@email.com',
    group: 'Família Noiva',
    maxGuests: 2,
    rsvpCode: 'BEA-3M4P9',
    notes: 'Tia da noiva. Mesa 04 reservada.',
    status: 'confirmed',
    respondedAt: '2026-09-20 18:32',
    companionCount: 2,
    companionNames: ['Lucas Duarte', 'Beatriz Duarte'],
    answers: {
      q_presence: 'sim',
      q_has_companions: 'sim',
      q_companion_count: 2,
      q_companion_names: 'Lucas Duarte, Beatriz Duarte',
      q_dietary: ['Nenhuma restrição'],
      q_message: 'Estaremos todos aí para comemorar!',
    },
  },
  {
    id: 'g-03',
    eventId: 'ev-01',
    name: 'Rafael Augusto Prado',
    displayName: 'Rafael Prado',
    phone: '(11) 97654-3210',
    email: 'rafael.prado@email.com',
    group: 'Amigos de Faculdade',
    maxGuests: 1,
    rsvpCode: 'BEA-8L2W5',
    notes: 'Mora em SP, estará viajando a trabalho na data.',
    status: 'declined',
    respondedAt: '2026-09-19 14:05',
    companionCount: 0,
    companionNames: [],
    answers: {
      q_presence: 'nao',
      q_message: 'Infelizmente estarei fora do país nessa semana, mas desejo toda felicidade do mundo a vocês!',
    },
  },
  {
    id: 'g-04',
    eventId: 'ev-01',
    name: 'Ana Beatriz Souza',
    displayName: 'Dra. Ana Beatriz',
    phone: '(61) 99881-2233',
    email: 'anabeatriz@hospital.com',
    group: 'Trabalho',
    maxGuests: 1,
    rsvpCode: 'BEA-9Q1Z4',
    notes: 'Colega de clínica da noiva.',
    status: 'pending',
    respondedAt: null,
    companionCount: 0,
    companionNames: [],
    answers: {},
  },
  {
    id: 'g-05',
    eventId: 'ev-01',
    name: 'Henrique Faria e Convidada',
    displayName: 'Henrique Faria',
    phone: '(61) 98444-5566',
    email: 'henrique.faria@email.com',
    group: 'Amigos de Infância',
    maxGuests: 1,
    rsvpCode: 'BEA-2T8Y1',
    notes: 'Convite entregue pessoalmente.',
    status: 'pending',
    respondedAt: null,
    companionCount: 0,
    companionNames: [],
    answers: {},
  },
  {
    id: 'g-06',
    eventId: 'ev-02',
    name: 'Isabela Ribeiro',
    displayName: 'Isa Ribeiro',
    phone: '(61) 98111-2233',
    email: 'isabela.rib@email.com',
    group: 'Amigas de Escola',
    maxGuests: 1,
    rsvpCode: 'BEA-SOPH1',
    notes: 'Colega de turma do 1º ano.',
    status: 'confirmed',
    respondedAt: '2026-09-20 16:45',
    companionCount: 0,
    companionNames: [],
    answers: {
      q_presence: 'sim',
    },
  },
  {
    id: 'g-07',
    eventId: 'ev-02',
    name: 'Felipe Valente',
    displayName: 'Felipe Valente e Família',
    phone: '(61) 99222-3344',
    email: 'felipe.valente@email.com',
    group: 'Família',
    maxGuests: 2,
    rsvpCode: 'BEA-SOPH2',
    notes: 'Primo de segundo grau.',
    status: 'pending',
    respondedAt: null,
    companionCount: 0,
    companionNames: [],
    answers: {},
  },
];

export const INITIAL_MANAGERS: ManagerData[] = [
  {
    id: 'm-01',
    eventId: 'ev-01',
    name: 'Marina Silva (Noiva)',
    email: 'marina.silva@exemplo.com',
    accessStart: '2026-09-01',
    accessEnd: '2026-10-30',
    status: 'active',
  },
  {
    id: 'm-02',
    eventId: 'ev-01',
    name: 'Camila Cerimonialista',
    email: 'camila@cerimonialbeaquos.com',
    accessStart: '2026-09-15',
    accessEnd: '2026-10-28',
    status: 'active',
  },
];
