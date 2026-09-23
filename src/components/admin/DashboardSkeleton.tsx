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
  Search,
  Trash2,
  Eye,
  Check,
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  Globe,
  Edit3,
  FileSpreadsheet,
} from 'lucide-react';
import { NavSection } from '../../types/navigation';
import { EventData, GuestData, FormQuestionData, ManagerData } from '../../data/mockData';
import { copyToClipboard, getEventRsvpUrl, getGuestRsvpUrl } from '../../utils/linkUtils';
import { formatDateBR, formatDateTimeBR } from '../../utils/dateUtils';
import { exportReportToXLSX, exportReportToPDF } from '../../utils/reportExportUtils';
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
      {/* SECTION: OVERVIEW ONLY (Home data: Banner, KPIs, Quick Actions, Recent Responses) */}
      {currentSection === 'overview' && (
        <div className="space-y-6">
          {/* Event Header Banner with Rafluo Deep Purple & Neon Style */}
          <div className="bg-[#24152F] text-[#F7F1E5] rounded-2xl p-5 sm:p-7 shadow-lg border border-[#3F2553] relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-[#DFFF5F]/10 pointer-events-none blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#DFFF5F] text-[#180D20]">
                    {event.type}
                  </span>
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F7F1E5]/15 text-[#F7F1E5]">
                    Status: {event.status === 'active' ? 'RSVP Aberto' : 'Fechado'}
                  </span>
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F7F1E5]/15 text-[#F7F1E5] flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#DFFF5F]" /> Confirmação até: <strong className="font-semibold text-[#F7F1E5]">{formatDateBR(event.rsvpDeadline)}</strong>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F1E5]">
                  {event.name}
                </h2>

                {/* Date, Time and Location */}
                <div className="flex flex-col gap-1.5 text-xs text-[#D2C4DC] pt-0.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#DFFF5F] flex-shrink-0" />
                    <span className="font-semibold text-[#F7F1E5]">{formatDateBR(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#DFFF5F] flex-shrink-0" />
                    <span className="font-medium text-[#F7F1E5]">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#DFFF5F] flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Banner Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  id="btn-edit-event-banner"
                  onClick={onEditEvent}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F7F1E5] text-[#24152F] text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                  title="Editar dados e configurações do evento"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#24152F]" />
                  <span>Editar Detalhes</span>
                </button>
                <button
                  id="btn-edit-form-banner"
                  onClick={() => onNavigate('form-builder')}
                  className="px-4 py-2.5 rounded-xl bg-[#2E1B3C] text-[#F7F1E5] border border-[#3F2553] hover:border-[#DFFF5F]/50 text-xs font-bold transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-sm"
                  title="Acessar e configurar o formulário de confirmação de presença"
                >
                  <FileText className="w-3.5 h-3.5 text-[#DFFF5F]" />
                  <span>Formulário de Presença</span>
                </button>
              </div>
            </div>
          </div>

          {/* Metrics Row (5 Cards) with highlighted icon badges */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {/* Total Convites */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#24152F]/15 shadow-xs flex flex-col justify-between hover:border-[#24152F]/30 transition-all">
              <div className="flex items-center justify-between text-[#24152F] text-xs font-bold">
                <span className="truncate pr-1">Total Convites</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#24152F]/10 text-[#24152F] flex items-center justify-center shadow-xs flex-shrink-0">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#24152F]" />
                </div>
              </div>
              <div className="mt-2.5">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#24152F] tracking-tight">
                  {totalGuests}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#24152F]/60 mt-0.5 font-medium">Cadastrados no evento</p>
              </div>
            </div>

            {/* Confirmados */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DFFF5F]/80 shadow-xs flex flex-col justify-between relative overflow-hidden hover:border-[#DFFF5F] transition-all">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#DFFF5F]/20 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-[#24152F] text-xs font-bold">
                <span className="truncate pr-1">Confirmados</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#DFFF5F] text-[#180D20] flex items-center justify-center shadow-xs ring-1 ring-[#DFFF5F]/60 flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#180D20]" />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="flex items-baseline gap-2">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#24152F] tracking-tight">
                    {confirmedGuests.length}
                  </p>
                  <span className="text-[11px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-[#DFFF5F] text-[#180D20] shadow-2xs">
                    {confirmedRate}%
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#24152F]/70 mt-0.5 font-medium">Titulares confirmados</p>
              </div>
            </div>

            {/* Acompanhantes */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#24152F]/15 shadow-xs flex flex-col justify-between hover:border-[#24152F]/30 transition-all">
              <div className="flex items-center justify-between text-[#24152F] text-xs font-bold">
                <span className="truncate pr-1">Acompanhantes</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#24152F]/10 text-[#24152F] flex items-center justify-center shadow-xs flex-shrink-0">
                  <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#24152F]" />
                </div>
              </div>
              <div className="mt-2.5">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#24152F] tracking-tight">
                  +{totalCompanions}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#24152F]/60 font-medium mt-0.5">
                  Total presenças: {totalAttending}
                </p>
              </div>
            </div>

            {/* Pendentes */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between text-amber-900 text-xs font-bold">
                <span className="truncate pr-1">Pendentes</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-xs flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-900" />
                </div>
              </div>
              <div className="mt-2.5">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900 tracking-tight">
                  {pendingGuests.length}
                </p>
                <p className="text-[10px] sm:text-[11px] text-amber-800/80 mt-0.5 font-medium">Aguardando resposta</p>
              </div>
            </div>

            {/* Recusados */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-rose-200 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1 hover:border-rose-300 transition-all">
              <div className="flex items-center justify-between text-rose-900 text-xs font-bold">
                <span className="truncate pr-1">Não Comparecem</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center shadow-xs flex-shrink-0">
                  <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-900" />
                </div>
              </div>
              <div className="mt-2.5">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-rose-900 tracking-tight">
                  {declinedGuests.length}
                </p>
                <p className="text-[10px] sm:text-[11px] text-rose-800/80 mt-0.5 font-medium">Ausência informada</p>
              </div>
            </div>
          </div>

          {/* Dynamic Content Panel for Overview */}
          <div className="bg-white rounded-2xl border border-[#24152F]/10 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#24152F]/10">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#24152F]">Respostas Recentemente</h3>
                <p className="text-xs text-[#24152F]/60 mt-0.5">
                  Acompanhe as últimas confirmações e recusas registradas pelos convidados
                </p>
              </div>
              <button
                id="btn-quick-guests"
                onClick={() => onNavigate('guests')}
                className="self-start sm:self-auto px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-[#24152F]/20 hover:bg-[#F7F1E5] text-[#24152F] transition-colors cursor-pointer"
              >
                Ver Todos ({guests.length})
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#24152F]/10 bg-white">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[560px]">
                <thead className="bg-[#F7F1E5] border-b border-[#24152F]/10 text-[#24152F]/70 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Convidado</th>
                    <th className="py-2.5 px-3">Evento</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Acompanhantes</th>
                    <th className="py-2.5 px-3">Data e Hora</th>
                    <th className="py-2.5 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#24152F]/5 text-[#24152F]">
                  {guests.slice(0, 5).map((g) => (
                    <tr key={g.id} className="hover:bg-[#F7F1E5]/50 transition-colors">
                      <td className="py-3 px-3 font-medium">
                        <span className="font-semibold text-[#24152F]">{g.name}</span>
                        <span className="block text-[10px] text-[#24152F]/50 font-mono">
                          Código: {g.rsvpCode}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#24152F]/80">
                        <span className="truncate max-w-[150px] inline-block" title={event.name}>
                          {event.name}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {g.status === 'confirmed' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DFFF5F] text-[#180D20]">
                            Confirmado
                          </span>
                        ) : g.status === 'declined' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#24152F]/10 text-[#24152F]/70">
                            Recusado
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            Pendente
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {g.status === 'confirmed' ? (
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md font-bold text-xs bg-[#FAF6EE] text-[#24152F] border border-[#24152F]/10">
                            {g.companionCount || 0}
                          </span>
                        ) : (
                          <span className="text-[#24152F]/40">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[#24152F]/75 font-medium">
                        {g.respondedAt ? formatDateTimeBR(g.respondedAt) : 'Pendente'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => onOpenGuestDetails(g)}
                            className="w-8 h-8 rounded-lg bg-white hover:bg-[#24152F] text-[#24152F] hover:text-[#F7F1E5] border border-[#24152F]/20 flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                            title="Ver Ficha de Resposta"
                            aria-label="Ver Ficha de Resposta"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenWhatsApp(g)}
                            className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 flex items-center justify-center transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                            title="WhatsApp"
                            aria-label="WhatsApp"
                          >
                            <WhatsAppIcon className="w-4 h-4" />
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
      )}

      {/* NON-OVERVIEW MENU SECTIONS */}
      {currentSection !== 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                id="btn-back-to-overview"
                onClick={() => onNavigate('overview')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#24152F]/15 bg-white hover:bg-[#F7F1E5] text-[#24152F] text-xs font-semibold shadow-2xs transition-colors cursor-pointer active:scale-98"
                title="Voltar ao Dashboard do Evento"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao Dashboard</span>
              </button>
              <span className="text-[#24152F]/30 text-xs">/</span>
              <span className="text-xs font-bold text-[#180D20] bg-[#DFFF5F] px-2.5 py-0.5 rounded-full">
                {event.name}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#24152F]/10 p-5 sm:p-6 shadow-xs">
            {/* SECTION: EVENTS */}
            {currentSection === 'events' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#24152F]/10">
                  <div>
                    <h3 className="text-base font-bold text-[#24152F]">Dados do Evento</h3>
                  </div>
                  <button
                    id="btn-create-event-tab"
                    onClick={onEditEvent}
                    className="px-3.5 py-2 bg-[#24152F] text-[#F7F1E5] text-xs font-semibold rounded-lg hover:bg-[#180D20] transition-colors shadow-sm border border-[#3F2553]"
                  >
                    Editar Dados do Evento
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-[#24152F]/15 bg-[#FAF6EE] space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-[#180D20] bg-[#DFFF5F] px-2 py-0.5 rounded">
                          {event.type}
                        </span>
                        <span className="text-xs font-bold text-[#24152F]">Ativo (Recebendo RSVP)</span>
                      </div>
                      <h4 className="text-base font-bold text-[#24152F] mt-1">{event.name}</h4>
                      <p className="text-xs text-[#24152F]/70 mt-0.5">
                        {formatDateBR(event.date)} às {event.time} • {event.location}
                      </p>
                      <p className="text-xs text-[#24152F] font-medium mt-1">
                        Confirmação até: <strong>{formatDateBR(event.rsvpDeadline)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={onEditEvent}
                        className="px-3.5 py-1.5 text-xs font-semibold text-[#24152F] bg-white border border-[#24152F]/20 rounded-lg hover:bg-[#F7F1E5] cursor-pointer"
                      >
                        Editar Informações
                      </button>
                      <button
                        onClick={() => onNavigate('form-builder')}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-[#24152F] text-[#F7F1E5] rounded-lg hover:bg-[#180D20] cursor-pointer border border-[#3F2553]"
                      >
                        Editar Perguntas
                      </button>
                    </div>
                  </div>

                  {/* Public RSVP Link Box */}
                  <div className="p-3 rounded-xl bg-white border border-[#24152F]/10 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <Globe className="w-3.5 h-3.5 text-[#24152F]/70 flex-shrink-0" />
                      <span className="font-mono text-[11px] text-[#24152F]/70 truncate">
                        {getEventRsvpUrl(event.id, event.slug)}
                      </span>
                    </div>
                    {onExitToMaster && (
                      <button
                        type="button"
                        onClick={onExitToMaster}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#24152F]/15 text-[#24152F] hover:bg-[#F7F1E5] text-xs font-semibold cursor-pointer flex-shrink-0"
                      >
                        <LayoutGrid className="w-3.5 h-3.5 text-[#24152F]" />
                        <span>Ver Todos os Eventos</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#24152F]/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#24152F]/70">
                    <div>
                      <span className="font-semibold text-[#24152F]">Endereço:</span> {event.address}
                    </div>
                    <div>
                      <span className="font-semibold text-[#24152F]">Acompanhantes:</span>{' '}
                      {event.allowGuests ? `Permitido (Máx. ${event.maxGuestsPerInvite})` : 'Não'}
                    </div>
                    <div>
                      <span className="font-semibold text-[#24152F]">Google Maps:</span>{' '}
                      <a
                        href={event.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#24152F] underline font-medium"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#24152F]/10">
                  <div>
                    <h3 className="text-base font-bold text-[#24152F]">Formulários</h3>
                  </div>
                  <button
                    id="btn-add-question-tab"
                    onClick={onAddQuestion}
                    className="px-3.5 py-2 bg-[#24152F] text-[#F7F1E5] text-xs font-semibold rounded-lg hover:bg-[#180D20] transition-colors shadow-sm flex items-center gap-1.5 border border-[#3F2553]"
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
                          ? 'border-[#24152F]/15 bg-white ml-0 sm:ml-5'
                          : 'border-[#24152F]/20 bg-[#FAF6EE]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#24152F] text-[#F7F1E5]">
                              #{idx + 1}
                            </span>

                            {q.condition && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DFFF5F] text-[#180D20]">
                                Condicional
                              </span>
                            )}

                            <span className="text-xs font-bold text-[#24152F]">{q.title}</span>

                            {q.required && (
                              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                                Obrigatória
                              </span>
                            )}
                          </div>

                          {q.description && (
                            <p className="text-[11px] text-[#24152F]/60">{q.description}</p>
                          )}

                          {q.condition && (
                            <p className="text-[11px] text-[#24152F] font-medium pt-1">
                              ↳ Regra: Exibir somente quando pergunta anterior atender à condição.
                            </p>
                          )}

                          {q.options && q.options.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1.5">
                              {q.options.map((opt, oIdx) => (
                                <span
                                  key={oIdx}
                                  className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-[#24152F]/80"
                                >
                                  {opt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] uppercase font-semibold text-[#24152F]/50 px-2 py-1 bg-gray-100 rounded">
                            {q.type}
                          </span>
                          {idx > 0 && (
                            <button
                              onClick={() => onDeleteQuestion(q.id)}
                              className="p-1.5 rounded-lg text-[#24152F]/40 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#24152F]/10">
                  <div>
                    <h3 className="text-base font-bold text-[#24152F]">
                      Convidados ({guests.length})
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      id="btn-export-guest-xlsx"
                      onClick={() => {
                        try {
                          exportReportToXLSX({
                            reportTitle: `Lista_Convidados_${event.name}`,
                            eventName: event.name,
                            filterLabel: 'Lista Completa do Evento',
                            guests,
                            events: [event],
                          });
                          if (onShowToast) onShowToast('Planilha Excel (XLSX) exportada com sucesso!');
                        } catch (err) {
                          console.error(err);
                          if (onShowToast) onShowToast('Erro ao exportar planilha XLSX.');
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-800 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 cursor-pointer text-white shadow-2xs"
                      title="Exportar dados para planilha Excel (.xlsx)"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#DFFF5F]" /> Exportar XLSX
                    </button>
                    <button
                      id="btn-export-guest-pdf"
                      onClick={() => {
                        try {
                          exportReportToPDF({
                            reportTitle: `Lista de Convidados - ${event.name}`,
                            eventName: event.name,
                            filterLabel: 'Documento Oficial do Evento',
                            guests,
                            events: [event],
                          });
                          if (onShowToast) onShowToast('Documento PDF oficial gerado com sucesso!');
                        } catch (err) {
                          console.error(err);
                          if (onShowToast) onShowToast('Erro ao exportar documento PDF.');
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#3F2553] text-xs font-semibold rounded-lg bg-[#24152F] hover:bg-[#180D20] cursor-pointer text-[#F7F1E5] shadow-2xs"
                      title="Exportar documento oficial em PDF formatado"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#DFFF5F]" /> Exportar PDF
                    </button>
                    <button
                      id="btn-import-csv"
                      onClick={onImportCsv}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#24152F]/20 bg-[#F7F1E5] text-[#24152F] text-xs font-semibold rounded-lg hover:bg-[#EDE4D3] cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" /> Importar CSV
                    </button>
                    <button
                      id="btn-add-guest"
                      onClick={onAddGuest}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#24152F] hover:bg-[#180D20] text-[#F7F1E5] text-xs font-semibold rounded-lg cursor-pointer border border-[#3F2553]"
                    >
                      + Cadastrar Convidado
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-[#24152F]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={guestSearch}
                      onChange={(e) => setGuestSearch(e.target.value)}
                      placeholder="Buscar por nome, grupo ou código..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#24152F]/20 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#24152F]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
                    {(['all', 'confirmed', 'pending', 'declined'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setGuestStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                          guestStatusFilter === status
                            ? 'bg-[#24152F] text-[#F7F1E5]'
                            : 'bg-white border border-[#24152F]/15 text-[#24152F]/70 hover:bg-[#F7F1E5]'
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
                <div className="overflow-x-auto rounded-xl border border-[#24152F]/10 bg-white shadow-xs">
                  <table className="w-full text-left text-xs min-w-[660px] whitespace-nowrap">
                    <thead className="bg-[#F7F1E5] border-b border-[#24152F]/10 text-[#24152F]/70 font-bold">
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
                    <tbody className="divide-y divide-[#24152F]/5 text-[#24152F]">
                      {filteredGuests.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-[#24152F]/50 text-xs">
                            Nenhum convidado encontrado com os filtros aplicados.
                          </td>
                        </tr>
                      ) : (
                        filteredGuests.map((g) => (
                          <tr key={g.id} className="hover:bg-[#F7F1E5]/60 transition-colors">
                            <td className="py-3 px-3.5 font-semibold">
                              {g.name}
                              {g.displayName !== g.name && (
                                <span className="block text-[11px] font-normal text-[#24152F]/60">
                                  "{g.displayName}"
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-[#24152F]">
                              {g.rsvpCode}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded bg-gray-100 text-[11px] font-medium">
                                {g.group}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              {g.status === 'confirmed' ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DFFF5F] text-[#180D20]">
                                  Confirmado
                                </span>
                              ) : g.status === 'declined' ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#24152F]/10 text-[#24152F]/70">
                                  Recusado
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                  Pendente
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              {g.status === 'confirmed' && g.companionCount > 0 ? (
                                <span className="font-bold text-[#24152F]">
                                  +{g.companionCount}
                                </span>
                              ) : (
                                <span className="text-[#24152F]/40">Cota: {g.maxGuests}</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-[#24152F]/70 font-mono text-[11px]">
                              {g.phone || '—'}
                            </td>
                            <td className="py-3 px-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleCopyGuestLink(g)}
                                  title="Copiar link exclusivo do convidado"
                                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                                    copiedGuestId === g.id
                                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                                      : 'bg-[#F7F1E5] hover:bg-[#EDE4D3] border-[#24152F]/15 text-[#24152F]'
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
                                  title="WhatsApp"
                                  aria-label="WhatsApp"
                                  className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                >
                                  <WhatsAppIcon className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onOpenGuestDetails(g)}
                                  title="Ver Ficha"
                                  aria-label="Ver Ficha"
                                  className="w-7 h-7 rounded-lg bg-white hover:bg-[#24152F] text-[#24152F] hover:text-[#F7F1E5] border border-[#24152F]/20 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onOpenGuestPreview(g.rsvpCode)}
                                  title="Testar tela deste convidado"
                                  className="w-7 h-7 rounded-lg bg-[#24152F]/10 hover:bg-[#24152F]/20 border border-[#24152F]/15 text-[#24152F] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
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
                <div className="flex items-center justify-between pb-3 border-b border-[#24152F]/10">
                  <div>
                    <h3 className="text-base font-bold text-[#24152F]">
                      Responsáveis
                    </h3>
                  </div>
                  <button
                    id="btn-add-manager"
                    onClick={onAddManager}
                    className="px-3.5 py-2 bg-[#24152F] hover:bg-[#180D20] text-[#F7F1E5] text-xs font-semibold rounded-lg transition-colors shadow-sm border border-[#3F2553]"
                  >
                    + Adicionar Responsável
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {managers.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl border border-[#24152F]/10 bg-white space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-[#24152F]">{m.name}</h4>
                          <p className="text-xs text-[#24152F]/60 mt-0.5">{m.email}</p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.status === 'active'
                              ? 'bg-[#DFFF5F] text-[#180D20]'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {m.status === 'active' ? 'Acesso Ativo' : 'Inativo'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#FAF6EE] border border-[#24152F]/10 text-xs space-y-1">
                        <p className="font-semibold text-[#24152F] text-[11px] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#24152F]" /> Janela Temporal de Consulta:
                        </p>
                        <p className="text-[#24152F]/80">
                          De <strong>{formatDateBR(m.accessStart)}</strong> até <strong>{formatDateBR(m.accessEnd)}</strong>
                        </p>
                        <p className="text-[10px] text-[#24152F]/50">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#24152F]/10">
                  <div>
                    <h3 className="text-base font-bold text-[#24152F]">Relatórios</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      id="btn-event-export-xlsx"
                      onClick={() => {
                        try {
                          exportReportToXLSX({
                            reportTitle: `Relatorio_${event.name}`,
                            eventName: event.name,
                            filterLabel: 'Dados Consolidados do Evento',
                            guests,
                            events: [event],
                          });
                          if (onShowToast) onShowToast('Planilha Excel (XLSX) exportada com sucesso!');
                        } catch (err) {
                          console.error(err);
                          if (onShowToast) onShowToast('Erro ao exportar XLSX.');
                        }
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs border border-emerald-900 cursor-pointer"
                      title="Exportar planilha Excel (.xlsx)"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#DFFF5F]" /> Exportar XLSX
                    </button>

                    <button
                      type="button"
                      id="btn-event-export-pdf"
                      onClick={() => {
                        try {
                          exportReportToPDF({
                            reportTitle: `Relatório de Confirmações - ${event.name}`,
                            eventName: event.name,
                            filterLabel: 'Documento Oficial do Evento',
                            guests,
                            events: [event],
                          });
                          if (onShowToast) onShowToast('Documento PDF oficial gerado com sucesso!');
                        } catch (err) {
                          console.error(err);
                          if (onShowToast) onShowToast('Erro ao exportar PDF.');
                        }
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#24152F] hover:bg-[#180D20] text-[#F7F1E5] text-xs font-semibold rounded-lg transition-colors shadow-2xs border border-[#3F2553] cursor-pointer"
                      title="Exportar documento oficial em PDF formatado"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#DFFF5F]" /> Exportar PDF
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-[#24152F]/10 bg-white space-y-2">
                    <p className="font-bold text-xs text-[#24152F]">Resumo para Cerimonial / Buffet</p>
                    <ul className="text-xs space-y-1.5 text-[#24152F]/80">
                      <li>• Total de Convites Emitidos: <strong>{totalGuests}</strong></li>
                      <li>• Titulares Confirmados: <strong>{confirmedGuests.length}</strong></li>
                      <li>• Acompanhantes Adicionais: <strong>+{totalCompanions}</strong></li>
                      <li className="text-[#24152F] font-bold">• Total Geral de Presentes: <strong>{totalAttending} pessoas</strong></li>
                      <li>• Ausências Confirmadas: <strong>{declinedGuests.length}</strong></li>
                      <li>• Pendentes: <strong>{pendingGuests.length}</strong></li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-[#24152F]/10 bg-white space-y-2">
                    <p className="font-bold text-xs text-[#24152F]">Exportação de Dados</p>
                    <p className="text-xs text-[#24152F]/70">
                      Disponível em <strong>XLSX (Excel)</strong> para cálculos analíticos ou em <strong>PDF Oficial</strong> com cabeçalho institucional, dados da empresa, resumo executivo e rodapé formal para impressão e cerimonial.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION: SETTINGS */}
            {currentSection === 'settings' && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-[#24152F]/10">
                  <h3 className="text-base font-bold text-[#24152F]">
                    Configurações
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-[#24152F]/10 bg-white space-y-2">
                    <p className="font-bold text-[#24152F]">Paleta Institucional Rafluo</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-[#24152F] border border-black/10 inline-block shadow-2xs" />
                        <span className="font-mono text-[10px] text-[#24152F]">#24152F</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-[#F7F1E5] border border-[#EDE4D3] inline-block shadow-2xs" />
                        <span className="font-mono text-[10px] text-[#24152F]">#F7F1E5</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-[#DFFF5F] border border-black/10 inline-block shadow-2xs" />
                        <span className="font-mono text-[10px] text-[#24152F]">#DFFF5F</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#24152F]/60 pt-1">
                      Roxo Escuro (#24152F) • Bege (#F7F1E5) • Verde Neon (#DFFF5F)
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[#24152F]/10 bg-white space-y-1">
                    <p className="font-bold text-[#24152F]">Rafluo</p>
                    <p className="text-[#24152F]/70">Gestão inteligente de confirmações.</p>
                    <p className="text-[11px] text-[#24152F]/60 pt-2 font-medium">
                      Desenvolvido com carinho por{' '}
                      <span className="text-[#24152F] font-bold">Beaquos Estúdio Criativo</span>
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
