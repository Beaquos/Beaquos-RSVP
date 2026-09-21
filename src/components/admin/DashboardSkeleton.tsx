import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  UserPlus,
  Calendar,
  MapPin,
  FileText,
  Copy,
  ExternalLink,
  Download,
  Upload,
  ShieldCheck,
  Sparkles,
  Search,
  Trash2,
  Filter,
  Eye,
  Check,
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  Globe,
  Edit3,
} from 'lucide-react';
import { NavSection } from '../../types/navigation';
import { EventData, GuestData, FormQuestionData, ManagerData } from '../../data/mockData';
import { copyToClipboard, getEventRsvpUrl, getGuestRsvpUrl } from '../../utils/linkUtils';
import { formatDateBR } from '../../utils/dateUtils';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface DashboardSkeletonProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  event: EventData;
  onEditEvent: () => void;
  questions: FormQuestionData[];
  onAddQuestion: () => void;
  onDeleteQuestion: (id: string) => void;
  guests: GuestData[];
  onAddGuest: () => void;
  onImportCsv: () => void;
  onOpenWhatsApp: (guest: GuestData) => void;
  onOpenGuestDetails: (guest: GuestData) => void;
  onOpenGuestPreview: (guestCode: string) => void;
  managers: ManagerData[];
  onAddManager: () => void;
  onExportCsv: () => void;
  onExitToMaster?: () => void;
  onShowToast?: (message: string) => void;
  onCopyEventLink?: () => void;
  hasCopiedLink?: boolean;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  currentSection,
  onNavigate,
  event,
  onEditEvent,
  questions,
  onAddQuestion,
  onDeleteQuestion,
  guests,
  onAddGuest,
  onImportCsv,
  onOpenWhatsApp,
  onOpenGuestDetails,
  onOpenGuestPreview,
  managers,
  onAddManager,
  onExportCsv,
  onExitToMaster,
  onShowToast,
  onCopyEventLink,
  hasCopiedLink = false,
}) => {
  const [guestSearch, setGuestSearch] = useState('');
  const [guestStatusFilter, setGuestStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all');
  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);
  const [localEventCopied, setLocalEventCopied] = useState(false);

  const handleCopyEvent = async () => {
    if (onCopyEventLink) {
      onCopyEventLink();
    } else {
      const url = getEventRsvpUrl(event.id, event.slug);
      const ok = await copyToClipboard(url);
      if (ok) {
        setLocalEventCopied(true);
        if (onShowToast) onShowToast(`Link do evento "${event.name}" copiado com sucesso!`);
        setTimeout(() => setLocalEventCopied(false), 2500);
      }
    }
  };

  const handleCopyGuestLink = async (g: GuestData) => {
    const url = getGuestRsvpUrl(g.rsvpCode);
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopiedGuestId(g.id);
      if (onShowToast) onShowToast(`Link exclusivo de "${g.displayName}" copiado!`);
      setTimeout(() => setCopiedGuestId(null), 2500);
    }
  };

  // Calculate real metrics from guests
  const totalGuests = guests.length;
  const confirmedGuests = guests.filter((g) => g.status === 'confirmed');
  const pendingGuests = guests.filter((g) => g.status === 'pending');
  const declinedGuests = guests.filter((g) => g.status === 'declined');
  const totalCompanions = confirmedGuests.reduce((acc, g) => acc + (g.companionCount || 0), 0);
  const totalAttending = confirmedGuests.length + totalCompanions;
  const confirmedRate = totalGuests > 0 ? Math.round((confirmedGuests.length / totalGuests) * 100) : 0;

  // Filtered guests
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
      g.group.toLowerCase().includes(guestSearch.toLowerCase()) ||
      g.rsvpCode.toLowerCase().includes(guestSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (guestStatusFilter === 'all') return true;
    return g.status === guestStatusFilter;
  });

  return (
    <div id="admin-dashboard-skeleton" className="space-y-6 pb-12">
      {/* SECTION: OVERVIEW ONLY (Home data: Banner, KPIs, Charts, Quick Actions) */}
      {currentSection === 'overview' && (
        <div className="space-y-6">
          {/* Event Header Banner with Beaquos Style */}
      <div className="bg-[#1B3024] text-[#FEFDF3] rounded-2xl p-5 sm:p-7 shadow-md border border-[#1B3024]/60 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#DFFFAE]/5 pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#DFFFAE] text-[#1B3024]">
                {event.type}
              </span>
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#FEFDF3]/15 text-[#FEFDF3]">
                Status: {event.status === 'active' ? 'RSVP Aberto' : 'Fechado'}
              </span>
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#FEFDF3]/15 text-[#FEFDF3] flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#DFFFAE]" /> Confirmação até: <strong className="font-semibold text-[#FEFDF3]">{formatDateBR(event.rsvpDeadline)}</strong>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FEFDF3]">
              {event.name}
            </h2>

            {/* Date, Time and Location: Dia/mês/ano e abaixo o ícone com o horário */}
            <div className="flex flex-col gap-1.5 text-xs text-[#FEFDF3]/90 pt-0.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#DFFFAE] flex-shrink-0" />
                <span className="font-semibold">{formatDateBR(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#DFFFAE] flex-shrink-0" />
                <span className="font-medium">{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#DFFFAE] flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>

          {/* Banner Actions: Apenas Editar Detalhes e Formulário de Presença */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-edit-event-banner"
              onClick={onEditEvent}
              className="px-4 py-2.5 rounded-xl bg-[#FEFDF3] text-[#1B3024] hover:bg-[#FEFDF3]/90 text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              title="Editar dados e configurações do evento"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#1B3024]" />
              <span>Editar Detalhes</span>
            </button>
            <button
              id="btn-edit-form-banner"
              onClick={() => onNavigate('form-builder')}
              className="px-4 py-2.5 rounded-xl bg-[#231F20] text-[#FEFDF3] border border-[#DFFFAE]/30 hover:bg-[#231F20]/90 text-xs font-bold transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-sm"
              title="Acessar e configurar o formulário de confirmação de presença"
            >
              <FileText className="w-3.5 h-3.5 text-[#DFFFAE]" />
              <span>Formulário de Presença</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row (5 Cards) with highlighted icon badges */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Convites */}
        <div className="bg-[#FEFDF3] p-4 rounded-2xl border border-[#1B3024]/25 shadow-xs flex flex-col justify-between hover:border-[#1B3024]/50 transition-all">
          <div className="flex items-center justify-between text-[#1B3024] text-xs font-bold">
            <span>Total Convites</span>
            <div className="w-9 h-9 rounded-xl bg-[#DFFFAE] text-[#1B3024] flex items-center justify-center shadow-xs ring-1 ring-[#1B3024]/20">
              <Users className="w-4 h-4 text-[#1B3024]" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl sm:text-3xl font-bold text-[#1B3024] tracking-tight">
              {totalGuests}
            </p>
            <p className="text-[11px] text-[#231F20]/60 mt-0.5 font-medium">Cadastrados no evento</p>
          </div>
        </div>

        {/* Confirmados */}
        <div className="bg-[#FEFDF3] p-4 rounded-2xl border border-[#1B3024]/25 shadow-xs flex flex-col justify-between relative overflow-hidden hover:border-[#1B3024]/50 transition-all">
          <div className="flex items-center justify-between text-[#1B3024] text-xs font-bold">
            <span>Confirmados</span>
            <div className="w-9 h-9 rounded-xl bg-[#DFFFAE] text-[#1B3024] flex items-center justify-center shadow-xs ring-1 ring-[#1B3024]/20">
              <CheckCircle className="w-4 h-4 text-[#1B3024]" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-bold text-[#1B3024] tracking-tight">
                {confirmedGuests.length}
              </p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#DFFFAE] text-[#1B3024] shadow-2xs">
                {confirmedRate}%
              </span>
            </div>
            <p className="text-[11px] text-[#231F20]/60 mt-0.5 font-medium">Titulares presentes</p>
          </div>
        </div>

        {/* Acompanhantes */}
        <div className="bg-[#FEFDF3] p-4 rounded-2xl border border-emerald-300 shadow-xs flex flex-col justify-between hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between text-emerald-900 text-xs font-bold">
            <span>Acompanhantes</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center shadow-xs ring-1 ring-emerald-300">
              <UserPlus className="w-4 h-4 text-emerald-900" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-900 tracking-tight">
              +{totalCompanions}
            </p>
            <p className="text-[11px] text-emerald-800/80 font-medium mt-0.5">
              Total presenças: {totalAttending}
            </p>
          </div>
        </div>

        {/* Pendentes */}
        <div className="bg-[#FEFDF3] p-4 rounded-2xl border border-amber-300 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-amber-900 text-xs font-bold">
            <span>Pendentes</span>
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shadow-xs ring-1 ring-amber-300">
              <Clock className="w-4 h-4 text-amber-900" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl sm:text-3xl font-bold text-amber-900 tracking-tight">
              {pendingGuests.length}
            </p>
            <p className="text-[11px] text-amber-800/80 mt-0.5 font-medium">Aguardando resposta</p>
          </div>
        </div>

        {/* Recusados */}
        <div className="bg-[#FEFDF3] p-4 rounded-2xl border border-rose-300 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1 hover:border-rose-400 transition-all">
          <div className="flex items-center justify-between text-rose-900 text-xs font-bold">
            <span>Não Comparecem</span>
            <div className="w-9 h-9 rounded-xl bg-rose-200 text-rose-900 flex items-center justify-center shadow-xs ring-1 ring-rose-300">
              <XCircle className="w-4 h-4 text-rose-900" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl sm:text-3xl font-bold text-rose-900 tracking-tight">
              {declinedGuests.length}
            </p>
            <p className="text-[11px] text-rose-800/80 mt-0.5 font-medium">Ausência informada</p>
          </div>
        </div>
      </div>

          {/* Dynamic Content Panel for Overview */}
          <div className="bg-[#FEFDF3] rounded-xl border border-[#231F20]/10 p-5 sm:p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#231F20]/10">
              <div>
                <h3 className="text-base font-bold text-[#231F20]">Ações Rápidas de Gestão</h3>
                <p className="text-xs text-[#231F20]/60 mt-0.5">
                  Acesse os módulos essenciais para operação dos convites digitais
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="btn-quick-guests"
                  onClick={() => onNavigate('guests')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#231F20]/20 hover:bg-[#231F20]/5 text-[#231F20] transition-colors cursor-pointer"
                >
                  Ver Lista Completa ({guests.length})
                </button>
              </div>
            </div>

            {/* Feature Modules Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Formulário & Regras */}
              <div
                onClick={() => onNavigate('form-builder')}
                className="group cursor-pointer p-4 rounded-xl border border-[#231F20]/10 hover:border-[#1B3024] bg-white transition-all shadow-xs hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#DFFFAE] text-[#1B3024] flex items-center justify-center mb-3 shadow-xs ring-1 ring-[#1B3024]/20 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5 text-[#1B3024]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#231F20] group-hover:text-[#1B3024] transition-colors">
                    Formulário & Regras
                  </h4>
                  <p className="text-xs text-[#231F20]/70 mt-1 leading-relaxed">
                    {questions.length} perguntas configuradas com regras condicionais ativas.
                  </p>
                </div>

                <button
                  type="button"
                  id="btn-module-form-builder"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('form-builder');
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1B3024] hover:bg-[#231F20] text-[#FEFDF3] text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer group/btn"
                >
                  <span>Abrir Construtor</span>
                  <div className="w-5 h-5 rounded-md bg-[#DFFFAE] text-[#1B3024] flex items-center justify-center group-hover/btn:translate-x-0.5 transition-transform flex-shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              </div>

              {/* Card 2: Convidados */}
              <div
                onClick={() => onNavigate('guests')}
                className="group cursor-pointer p-4 rounded-xl border border-[#231F20]/10 hover:border-[#1B3024] bg-white transition-all shadow-xs hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#DFFFAE] text-[#1B3024] flex items-center justify-center mb-3 shadow-xs ring-1 ring-[#1B3024]/20 group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5 text-[#1B3024]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#231F20] group-hover:text-[#1B3024] transition-colors">
                    Convidados
                  </h4>
                  <p className="text-xs text-[#231F20]/70 mt-1 leading-relaxed">
                    {guests.length} convidados cadastrados. Envie mensagens com link individualizado.
                  </p>
                </div>

                <button
                  type="button"
                  id="btn-module-guests"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('guests');
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1B3024] hover:bg-[#231F20] text-[#FEFDF3] text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer group/btn"
                >
                  <span>Gerenciar Convidados</span>
                  <div className="w-5 h-5 rounded-md bg-[#DFFFAE] text-[#1B3024] flex items-center justify-center group-hover/btn:translate-x-0.5 transition-transform flex-shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              </div>

              {/* Card 3: Acesso dos Responsáveis */}
              <div
                onClick={() => onNavigate('managers')}
                className="group cursor-pointer p-4 rounded-xl border border-[#231F20]/10 hover:border-[#1B3024] bg-white transition-all shadow-xs hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#DFFFAE] text-[#1B3024] flex items-center justify-center mb-3 shadow-xs ring-1 ring-[#1B3024]/20 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5 text-[#1B3024]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#231F20] group-hover:text-[#1B3024] transition-colors">
                    Acesso dos Responsáveis
                  </h4>
                  <p className="text-xs text-[#231F20]/70 mt-1 leading-relaxed">
                    {managers.length} responsáveis cadastrados com período independente de acesso.
                  </p>
                </div>

                <button
                  type="button"
                  id="btn-module-managers"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('managers');
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1B3024] hover:bg-[#231F20] text-[#FEFDF3] text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer group/btn"
                >
                  <span>Configurar Acessos</span>
                  <div className="w-5 h-5 rounded-md bg-[#DFFFAE] text-[#1B3024] flex items-center justify-center group-hover/btn:translate-x-0.5 transition-transform flex-shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Confirmations Table */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#231F20]/60">
                  Respostas Registradas Recentemente
                </h4>
                <button
                  onClick={() => onNavigate('guests')}
                  className="text-[11px] text-[#1B3024] font-semibold hover:underline"
                >
                  Ver Todos ({guests.length})
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-[#231F20]/10 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FEFDF3] border-b border-[#231F20]/10 text-[#231F20]/60 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Convidado</th>
                      <th className="py-2.5 px-3">Grupo</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Acompanhantes</th>
                      <th className="py-2.5 px-3">Data Resposta</th>
                      <th className="py-2.5 px-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#231F20]/5 text-[#231F20]">
                    {guests.slice(0, 4).map((g) => (
                      <tr key={g.id} className="hover:bg-[#FEFDF3]/50">
                        <td className="py-3 px-3 font-medium">
                          {g.name}
                          <span className="block text-[10px] text-[#231F20]/50 font-mono">
                            Código: {g.rsvpCode}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#231F20]/60">{g.group}</td>
                        <td className="py-3 px-3">
                          {g.status === 'confirmed' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DFFFAE] text-[#1B3024]">
                              Confirmado
                            </span>
                          ) : g.status === 'declined' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#231F20]/10 text-[#231F20]/70">
                              Recusado
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900">
                              Pendente
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {g.status === 'confirmed' && g.companionCount > 0 ? (
                            <span className="font-semibold text-[#1B3024]">
                              +{g.companionCount} ({g.companionNames.join(', ')})
                            </span>
                          ) : (
                            <span className="text-[#231F20]/40">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[#231F20]/60">
                          {g.respondedAt || 'Pendente'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-2 justify-end">
                            <button
                              onClick={() => onOpenGuestDetails(g)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FEFDF3] hover:bg-[#DFFFAE]/30 border border-[#1B3024]/20 text-[#1B3024] font-bold text-[11px] transition-all shadow-2xs active:scale-95 cursor-pointer group"
                              title="Ver ficha completa do convidado"
                            >
                              <span className="w-5 h-5 rounded-md bg-[#1B3024]/10 group-hover:bg-[#1B3024] group-hover:text-[#FEFDF3] text-[#1B3024] flex items-center justify-center transition-colors">
                                <Eye className="w-3 h-3" />
                              </span>
                              <span>Ver Ficha</span>
                            </button>

                            <button
                              onClick={() => onOpenWhatsApp(g)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-[11px] transition-all shadow-2xs active:scale-95 cursor-pointer group"
                              title="Enviar mensagem no WhatsApp"
                            >
                              <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                                <WhatsAppIcon className="w-3 h-3" />
                              </span>
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NON-OVERVIEW MENU SECTIONS (Shows ONLY the selected menu data) */}
      {currentSection !== 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                id="btn-back-to-overview"
                onClick={() => onNavigate('overview')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#231F20]/15 bg-white hover:bg-[#FEFDF3] text-[#1B3024] text-xs font-semibold shadow-2xs transition-colors cursor-pointer active:scale-98"
                title="Voltar ao Resumo do Evento"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao Resumo</span>
              </button>
              <span className="text-[#231F20]/30 text-xs">/</span>
              <span className="text-xs font-bold text-[#1B3024] bg-[#DFFFAE] px-2.5 py-0.5 rounded-full">
                {event.name}
              </span>
            </div>
          </div>

          <div className="bg-[#FEFDF3] rounded-xl border border-[#231F20]/10 p-5 sm:p-6 shadow-xs">
            {/* SECTION: EVENTS */}
            {currentSection === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#231F20]/10">
              <div>
                <h3 className="text-base font-bold text-[#231F20]">Eventos Cadastrados</h3>
                <p className="text-xs text-[#231F20]/60">
                  Gerencie as informações gerais, locais e datas de cada celebração
                </p>
              </div>
              <button
                id="btn-create-event-tab"
                onClick={onEditEvent}
                className="px-3.5 py-2 bg-[#1B3024] text-[#FEFDF3] text-xs font-semibold rounded-lg hover:bg-[#231F20] transition-colors shadow-sm"
              >
                + Editar / Criar Evento
              </button>
            </div>

            <div className="p-5 rounded-xl border border-[#1B3024]/30 bg-white space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#1B3024] bg-[#DFFFAE] px-2 py-0.5 rounded">
                      {event.type}
                    </span>
                    <span className="text-xs font-bold text-[#1B3024]">Ativo (Recebendo RSVP)</span>
                  </div>
                  <h4 className="text-base font-bold text-[#231F20] mt-1">{event.name}</h4>
                  <p className="text-xs text-[#231F20]/70 mt-0.5">
                    {formatDateBR(event.date)} às {event.time} • {event.location}
                  </p>
                  <p className="text-xs text-[#1B3024] font-medium mt-1">
                    Confirmação até: <strong>{formatDateBR(event.rsvpDeadline)}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onEditEvent}
                    className="px-3.5 py-1.5 text-xs font-semibold text-[#1B3024] border border-[#1B3024]/30 rounded-lg hover:bg-[#FEFDF3] cursor-pointer"
                  >
                    Editar Informações
                  </button>
                  <button
                    onClick={() => onNavigate('form-builder')}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-[#1B3024] text-[#FEFDF3] rounded-lg hover:bg-[#231F20] cursor-pointer"
                  >
                    Editar Perguntas
                  </button>
                </div>
              </div>

              {/* Public RSVP Link Box */}
              <div className="p-3 rounded-xl bg-[#231F20]/5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Globe className="w-3.5 h-3.5 text-[#1B3024]/70 flex-shrink-0" />
                  <span className="font-mono text-[11px] text-[#231F20]/70 truncate">
                    {getEventRsvpUrl(event.id, event.slug)}
                  </span>
                </div>
                {onExitToMaster && (
                  <button
                    type="button"
                    onClick={onExitToMaster}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#231F20]/15 text-[#231F20] hover:bg-[#231F20]/5 text-xs font-semibold cursor-pointer flex-shrink-0"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-[#1B3024]" />
                    <span>Ver Todos os Eventos</span>
                  </button>
                )}
              </div>

              <div className="pt-3 border-t border-[#231F20]/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#231F20]/70">
                <div>
                  <span className="font-semibold text-[#231F20]">Endereço:</span> {event.address}
                </div>
                <div>
                  <span className="font-semibold text-[#231F20]">Acompanhantes:</span>{' '}
                  {event.allowGuests ? `Permitido (Máx. ${event.maxGuestsPerInvite})` : 'Não'}
                </div>
                <div>
                  <span className="font-semibold text-[#231F20]">Google Maps:</span>{' '}
                  <a
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1B3024] underline font-medium"
                  >
                    Abrir Localização
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: FORM BUILDER */}
        {currentSection === 'form-builder' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#231F20]/10">
              <div>
                <h3 className="text-base font-bold text-[#231F20]">Construtor de Formulário RSVP</h3>
                <p className="text-xs text-[#231F20]/60">
                  Crie perguntas personalizadas e configure regras condicionais de exibição
                </p>
              </div>
              <button
                id="btn-add-question-tab"
                onClick={onAddQuestion}
                className="px-3.5 py-2 bg-[#1B3024] text-[#FEFDF3] text-xs font-semibold rounded-lg hover:bg-[#231F20] transition-colors shadow-sm flex items-center gap-1.5"
              >
                + Adicionar Pergunta
              </button>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border transition-all ${
                    q.condition
                      ? 'border-[#231F20]/15 bg-white ml-0 sm:ml-5'
                      : 'border-[#1B3024]/30 bg-[#FEFDF3]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1B3024] text-[#FEFDF3]">
                          #{idx + 1}
                        </span>

                        {q.condition && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DFFFAE] text-[#1B3024]">
                            Condicional
                          </span>
                        )}

                        <span className="text-xs font-bold text-[#231F20]">{q.title}</span>

                        {q.required && (
                          <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                            Obrigatória
                          </span>
                        )}
                      </div>

                      {q.description && (
                        <p className="text-[11px] text-[#231F20]/60">{q.description}</p>
                      )}

                      {q.condition && (
                        <p className="text-[11px] text-[#1B3024] font-medium pt-1">
                          ↳ Regra: Exibir somente quando pergunta anterior atender à condição.
                        </p>
                      )}

                      {q.options && q.options.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {q.options.map((opt, oIdx) => (
                            <span
                              key={oIdx}
                              className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-[#231F20]/80"
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] uppercase font-semibold text-[#231F20]/50 px-2 py-1 bg-gray-100 rounded">
                        {q.type}
                      </span>
                      {idx > 0 && (
                        <button
                          onClick={() => onDeleteQuestion(q.id)}
                          className="p-1.5 rounded-lg text-[#231F20]/40 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Excluir pergunta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: GUESTS */}
        {currentSection === 'guests' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#231F20]/10">
              <div>
                <h3 className="text-base font-bold text-[#231F20]">
                  Gestão de Convidados ({guests.length})
                </h3>
                <p className="text-xs text-[#231F20]/60">
                  Links individuais com código único e envio direto para o WhatsApp
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="btn-export-csv"
                  onClick={onExportCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#231F20]/20 text-xs font-semibold rounded-lg hover:bg-[#231F20]/5"
                >
                  <Download className="w-3.5 h-3.5" /> Exportar CSV
                </button>
                <button
                  id="btn-import-csv"
                  onClick={onImportCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1B3024]/30 bg-[#DFFFAE]/30 text-[#1B3024] text-xs font-semibold rounded-lg hover:bg-[#DFFFAE]/60"
                >
                  <Upload className="w-3.5 h-3.5" /> Importar CSV
                </button>
                <button
                  id="btn-add-guest"
                  onClick={onAddGuest}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1B3024] text-[#FEFDF3] text-xs font-semibold rounded-lg hover:bg-[#231F20] cursor-pointer"
                >
                  + Cadastrar Convidado
                </button>
                <button
                  id="btn-copy-event-link-guests-bar"
                  onClick={handleCopyEvent}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#DFFFAE] text-[#1B3024] text-xs font-bold rounded-lg hover:bg-[#DFFFAE]/90 border border-[#1B3024]/20 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Link do Evento</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#231F20]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  placeholder="Buscar por nome, grupo ou código..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#231F20]/20 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#1B3024]"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
                {(['all', 'confirmed', 'pending', 'declined'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setGuestStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                      guestStatusFilter === status
                        ? 'bg-[#1B3024] text-[#FEFDF3]'
                        : 'bg-white border border-[#231F20]/15 text-[#231F20]/70 hover:bg-[#FEFDF3]'
                    }`}
                  >
                    {status === 'all'
                      ? `Todos (${guests.length})`
                      : status === 'confirmed'
                      ? `Confirmados (${confirmedGuests.length})`
                      : status === 'pending'
                      ? `Pendentes (${pendingGuests.length})`
                      : `Recusados (${declinedGuests.length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Guests Table */}
            <div className="overflow-x-auto rounded-xl border border-[#231F20]/10 bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FEFDF3] border-b border-[#231F20]/10 text-[#231F20]/70 font-bold">
                  <tr>
                    <th className="py-3 px-3.5">Convidado / Exibição</th>
                    <th className="py-3 px-3">Código RSVP</th>
                    <th className="py-3 px-3">Grupo</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Acompanhantes</th>
                    <th className="py-3 px-3">Telefone</th>
                    <th className="py-3 px-3.5 text-right">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#231F20]/5 text-[#231F20]">
                  {filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#231F20]/50 text-xs">
                        Nenhum convidado encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((g) => (
                      <tr key={g.id} className="hover:bg-[#FEFDF3]/60 transition-colors">
                        <td className="py-3 px-3.5 font-semibold">
                          {g.name}
                          {g.displayName !== g.name && (
                            <span className="block text-[11px] font-normal text-[#231F20]/60">
                              "{g.displayName}"
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[#1B3024]">
                          {g.rsvpCode}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-[11px] font-medium">
                            {g.group}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {g.status === 'confirmed' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DFFFAE] text-[#1B3024]">
                              Confirmado
                            </span>
                          ) : g.status === 'declined' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#231F20]/10 text-[#231F20]/70">
                              Recusado
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                              Pendente
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {g.status === 'confirmed' && g.companionCount > 0 ? (
                            <span className="font-bold text-[#1B3024]">
                              +{g.companionCount}
                            </span>
                          ) : (
                            <span className="text-[#231F20]/40">Cota: {g.maxGuests}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[#231F20]/70 font-mono text-[11px]">
                          {g.phone || '—'}
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleCopyGuestLink(g)}
                              title="Copiar link exclusivo do convidado"
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                                copiedGuestId === g.id
                                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                                  : 'bg-[#DFFFAE]/50 hover:bg-[#DFFFAE] border-[#1B3024]/15 text-[#1B3024]'
                              }`}
                            >
                              {copiedGuestId === g.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => onOpenWhatsApp(g)}
                              title="Gerar mensagem WhatsApp"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition-colors shadow-2xs cursor-pointer"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-800" />
                            </button>
                            <button
                              onClick={() => onOpenGuestDetails(g)}
                              title="Ver respostas completas"
                              className="p-1.5 rounded-lg bg-[#231F20]/5 hover:bg-[#231F20]/10 border border-[#231F20]/10 text-[#231F20]/80 hover:text-[#1B3024] transition-colors shadow-2xs cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onOpenGuestPreview(g.rsvpCode)}
                              title="Testar tela deste convidado"
                              className="p-1.5 rounded-lg bg-[#1B3024]/10 hover:bg-[#1B3024]/20 border border-[#1B3024]/15 text-[#1B3024] transition-colors shadow-2xs cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION: MANAGERS */}
        {currentSection === 'managers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#231F20]/10">
              <div>
                <h3 className="text-base font-bold text-[#231F20]">
                  Controle de Acesso dos Responsáveis
                </h3>
                <p className="text-xs text-[#231F20]/60">
                  Permissão de consulta sem senha identificada por e-mail dentro do período estipulado
                </p>
              </div>
              <button
                id="btn-add-manager"
                onClick={onAddManager}
                className="px-3.5 py-2 bg-[#1B3024] text-[#FEFDF3] text-xs font-semibold rounded-lg hover:bg-[#231F20] transition-colors shadow-sm"
              >
                + Adicionar Responsável
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {managers.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl border border-[#231F20]/10 bg-white space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#231F20]">{m.name}</h4>
                      <p className="text-xs text-[#231F20]/60 mt-0.5">{m.email}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === 'active'
                          ? 'bg-[#DFFFAE] text-[#1B3024]'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {m.status === 'active' ? 'Acesso Ativo' : 'Inativo'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#FEFDF3] border border-[#231F20]/10 text-xs space-y-1">
                    <p className="font-semibold text-[#1B3024] text-[11px] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Janela Temporal de Consulta:
                    </p>
                    <p className="text-[#231F20]/80">
                      De <strong>{formatDateBR(m.accessStart)}</strong> até <strong>{formatDateBR(m.accessEnd)}</strong>
                    </p>
                    <p className="text-[10px] text-[#231F20]/50">
                      (Independe da data de confirmação que se encerra em {formatDateBR(event.rsvpDeadline)})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: ANALYTICS & EXPORT */}
        {currentSection === 'analytics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#231F20]/10">
              <div>
                <h3 className="text-base font-bold text-[#231F20]">Relatórios & Exportação</h3>
                <p className="text-xs text-[#231F20]/60">
                  Exporte o banco consolidado para planilhas de cerimonial e buffet
                </p>
              </div>
              <button
                onClick={onExportCsv}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1B3024] text-[#FEFDF3] text-xs font-semibold rounded-lg hover:bg-[#231F20] transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-[#DFFFAE]" /> Baixar Planilha CSV
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#231F20]/10 bg-white space-y-2">
                <p className="font-bold text-xs text-[#231F20]">Resumo para Cerimonial / Buffet</p>
                <ul className="text-xs space-y-1.5 text-[#231F20]/80">
                  <li>• Total de Convites Emitidos: <strong>{totalGuests}</strong></li>
                  <li>• Titulares Confirmados: <strong>{confirmedGuests.length}</strong></li>
                  <li>• Acompanhantes Adicionais: <strong>+{totalCompanions}</strong></li>
                  <li className="text-[#1B3024] font-bold">• Total Geral de Presentes: <strong>{totalAttending} pessoas</strong></li>
                  <li>• Ausências Confirmadas: <strong>{declinedGuests.length}</strong></li>
                  <li>• Pendentes: <strong>{pendingGuests.length}</strong></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-[#231F20]/10 bg-white space-y-2">
                <p className="font-bold text-xs text-[#231F20]">Estrutura da Exportação CSV</p>
                <p className="text-xs text-[#231F20]/70">
                  O arquivo exportado contém: ID, Nome, Telefone, Grupo, Código RSVP, Status, Quantidade de Acompanhantes, Nomes dos Acompanhantes e Respostas dinâmicas das perguntas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: SETTINGS */}
        {currentSection === 'settings' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#231F20] pb-3 border-b border-[#231F20]/10">
              Configurações do Sistema Beaquos RSVP
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-[#231F20]/10 bg-white space-y-2">
                <p className="font-bold text-[#231F20]">Paleta Institucional</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-[#231F20] border border-black/10 inline-block" />
                    <span className="font-mono text-[10px]">#231F20</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-[#FEFDF3] border border-gray-300 inline-block" />
                    <span className="font-mono text-[10px]">#FEFDF3</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-[#1B3024] border border-black/10 inline-block" />
                    <span className="font-mono text-[10px]">#1B3024</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-[#DFFFAE] border border-gray-300 inline-block" />
                    <span className="font-mono text-[10px]">#DFFFAE</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#231F20]/10 bg-white space-y-1">
                <p className="font-bold text-[#231F20]">Beaquos Estúdio Criativo</p>
                <p className="text-[#231F20]/60">Módulo de RSVP Digital Integrado</p>
                <p className="text-[11px] text-[#1B3024] font-medium pt-2">
                  Versão 1.0 • Pronto para produção
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )}
</div>
);
};
