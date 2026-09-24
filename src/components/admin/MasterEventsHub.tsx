import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Copy,
  Check,
  Plus,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Edit3,
} from 'lucide-react';
import { EventData, GuestData } from '../../data/mockData';
import { copyToClipboard, getEventRsvpUrl } from '../../utils/linkUtils';
import { formatDateBR } from '../../utils/dateUtils';

interface MasterEventsHubProps {
  events: EventData[];
  guests: GuestData[];
  onSelectEvent: (event: EventData) => void;
  onNewEvent: () => void;
  onEditEvent: (event: EventData) => void;
  onShowToast: (message: string) => void;
  onOpenPreview: (guestCode?: string) => void;
}

export const MasterEventsHub: React.FC<MasterEventsHubProps> = ({
  events,
  guests,
  onSelectEvent,
  onNewEvent,
  onEditEvent,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'closed'>('all');
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

  // Global metrics across all events
  const totalEvents = events.length;
  const activeEventsCount = events.filter((e) => e.status === 'active').length;
  const totalGuestsManaged = guests.length;
  const totalConfirmed = guests.filter((g) => g.status === 'confirmed').length;

  const handleCopyLink = async (e: React.MouseEvent, event: EventData) => {
    e.stopPropagation();
    const url = getEventRsvpUrl(event.id, event.slug);
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopiedEventId(event.id);
      onShowToast(`Link do evento "${event.name}" copiado com sucesso!`);
      setTimeout(() => setCopiedEventId(null), 2500);
    }
  };

  // Filter events
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.clientName && ev.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      ev.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return ev.status === statusFilter;
  });

  return (
    <div id="master-events-hub" className="space-y-6 pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#24152F]">
            Eventos
          </h2>
        </div>

        <button
          id="btn-master-create-event"
          onClick={onNewEvent}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#24152F] hover:bg-[#180D20] text-[#F7F1E5] font-semibold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer group w-full sm:w-fit border border-[#3F2553]"
        >
          <div className="w-5 h-5 rounded-md bg-[#DFFF5F] text-[#180D20] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span>+ Novo evento</span>
        </button>
      </div>

      {/* Global Master KPI Metrics with highlighted icon badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total de Eventos */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#24152F]/15 shadow-xs flex flex-col justify-between hover:border-[#24152F]/40 transition-all">
          <div className="flex items-center justify-between text-[#24152F] text-xs font-bold">
            <span className="truncate pr-1">Total Eventos</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#24152F]/10 text-[#24152F] flex items-center justify-center shadow-xs flex-shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#24152F]" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#24152F] tracking-tight">{totalEvents}</p>
            <p className="text-[10px] sm:text-[11px] text-[#24152F]/60 mt-0.5 font-medium">Cadastrados no sistema</p>
          </div>
        </div>

        {/* RSVP Ativo */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#24152F]/15 shadow-xs flex flex-col justify-between hover:border-[#24152F]/40 transition-all">
          <div className="flex items-center justify-between text-[#24152F] text-xs font-bold">
            <span className="truncate pr-1">RSVP Ativo</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#DFFF5F] text-[#180D20] flex items-center justify-center shadow-xs ring-1 ring-[#DFFF5F]/50 flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#180D20]" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#24152F] tracking-tight">{activeEventsCount}</p>
            <p className="text-[10px] sm:text-[11px] text-[#24152F]/60 mt-0.5 font-medium">Recebendo respostas</p>
          </div>
        </div>

        {/* Total de Convites */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#24152F]/15 shadow-xs flex flex-col justify-between hover:border-[#24152F]/40 transition-all">
          <div className="flex items-center justify-between text-[#24152F] text-xs font-bold">
            <span className="truncate pr-1">Total Convites</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#24152F]/10 text-[#24152F] flex items-center justify-center shadow-xs flex-shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#24152F]" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#24152F] tracking-tight">{totalGuestsManaged}</p>
            <p className="text-[10px] sm:text-[11px] text-[#24152F]/60 mt-0.5 font-medium">Cadastrados na base</p>
          </div>
        </div>

        {/* Confirmações Gerais */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#DFFF5F]/80 shadow-xs flex flex-col justify-between hover:border-[#DFFF5F] transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#DFFF5F]/15 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-[#24152F] text-xs font-bold">
            <span className="truncate pr-1">Confirmados</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#DFFF5F] text-[#180D20] flex items-center justify-center shadow-xs flex-shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#180D20]" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#24152F] tracking-tight">{totalConfirmed}</p>
            <p className="text-[10px] sm:text-[11px] text-[#24152F]/70 mt-0.5 font-medium">Presenças confirmadas</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#24152F]/10 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#24152F]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-master-events"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, evento, tipo ou local..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#24152F]/20 bg-[#F7F1E5]/40 text-xs text-[#24152F] placeholder-[#24152F]/40 focus:outline-none focus:ring-1 focus:ring-[#24152F]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-semibold text-[#24152F]/50 mr-1 hidden sm:inline">Status:</span>
          {(['all', 'active', 'draft', 'closed'] as const).map((filterKey) => {
            const labels = {
              all: 'Todos',
              active: 'Ativos',
              draft: 'Rascunhos',
              closed: 'Encerrados',
            };
            const isSelected = statusFilter === filterKey;
            return (
              <button
                key={filterKey}
                onClick={() => setStatusFilter(filterKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#24152F] text-[#F7F1E5]'
                    : 'bg-white border border-[#24152F]/15 text-[#24152F]/70 hover:bg-[#F7F1E5]'
                }`}
              >
                {labels[filterKey]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Client Events Catalog */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#24152F]/70">
            Eventos dos Clientes ({filteredEvents.length})
          </h3>
          <span className="text-xs text-[#24152F]/50">
            Clique em "Acessar Evento" para gerenciar convidados e formulário
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-[#24152F]/20 p-8 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-[#24152F]/30 mx-auto" />
            <p className="text-sm font-semibold text-[#24152F]">Nenhum evento encontrado</p>
            <p className="text-xs text-[#24152F]/50">
              Tente redefinir os filtros ou clique em "Cadastrar Novo Evento".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((ev) => {
              const eventGuests = guests.filter((g) => g.eventId === ev.id);
              const eventConfirmed = eventGuests.filter((g) => g.status === 'confirmed').length;
              const isCopied = copiedEventId === ev.id;

              return (
                <div
                  key={ev.id}
                  id={`card-event-${ev.id}`}
                  className="bg-white rounded-2xl border border-[#24152F]/10 hover:border-[#24152F]/40 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Type, Status, Client */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#24152F]/10 text-[#24152F]">
                          {ev.type}
                        </span>
                        {ev.clientName && (
                          <span className="text-[11px] font-medium text-[#24152F]/60 truncate">
                            • {ev.clientName}
                          </span>
                        )}
                      </div>

                      {ev.status === 'active' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DFFF5F] text-[#180D20] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#180D20] animate-pulse" />
                          RSVP Aberto
                        </span>
                      ) : ev.status === 'draft' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                          Rascunho
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#24152F]/10 text-[#24152F]/60">
                          Encerrado
                        </span>
                      )}
                    </div>

                    {/* Event Title */}
                    <div>
                      <h4 className="text-base font-bold text-[#24152F] group-hover:text-[#3F2553] transition-colors">
                        {ev.name}
                      </h4>
                      <p className="text-xs text-[#24152F]/70 line-clamp-1 mt-0.5">
                        {ev.description || 'Sem descrição cadastrada'}
                      </p>
                    </div>

                    {/* Date, Time and Location */}
                    <div className="space-y-1.5 text-xs text-[#24152F]/80 pt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-[#24152F]/10 text-[#24152F] flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-3 h-3" />
                        </div>
                        <span className="font-semibold text-[#24152F]">
                          {formatDateBR(ev.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-[#24152F]/10 text-[#24152F] flex items-center justify-center flex-shrink-0">
                          <Clock className="w-3 h-3" />
                        </div>
                        <span className="font-medium text-[#24152F]/90">
                          {ev.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-[#24152F]/10 text-[#24152F] flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-3 h-3" />
                        </div>
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>

                    {/* RSVP Deadline */}
                    <div className="p-2.5 rounded-xl bg-[#F7F1E5]/60 border border-[#24152F]/5 flex items-center gap-2 text-xs text-[#24152F]/75">
                      <div className="w-5 h-5 rounded bg-[#24152F]/10 text-[#24152F] flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3 h-3" />
                      </div>
                      <span>Confirmação até: <strong>{formatDateBR(ev.rsvpDeadline)}</strong></span>
                    </div>
                  </div>

                  {/* Actions Row: Responsive grid across mobile, tablet and desktop */}
                  <div className="pt-3.5 mt-3.5 border-t border-[#24152F]/10 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3 gap-2">
                    {/* 1. Copiar Link do Evento */}
                    <button
                      type="button"
                      id={`btn-copy-event-${ev.id}`}
                      onClick={(e) => handleCopyLink(e, ev)}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-98 ${
                        isCopied
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white hover:bg-[#F7F1E5] border-[#24152F]/15 hover:border-[#24152F] text-[#24152F]'
                      }`}
                      title="Copiar link RSVP do evento"
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                          isCopied ? 'bg-emerald-200 text-emerald-800' : 'bg-[#24152F]/10 text-[#24152F]'
                        }`}
                      >
                        {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </div>
                      <span className="truncate">{isCopied ? 'Link Copiado!' : 'Copiar Link'}</span>
                    </button>

                    {/* 2. Editar */}
                    <button
                      type="button"
                      id={`btn-edit-event-${ev.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvent(ev);
                      }}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white hover:bg-[#F7F1E5] border border-[#24152F]/15 hover:border-[#24152F] text-[#24152F] font-semibold text-xs transition-all cursor-pointer shadow-2xs active:scale-98"
                      title="Editar dados e configurações do evento"
                    >
                      <div className="w-5 h-5 rounded bg-[#24152F]/10 text-[#24152F] flex items-center justify-center flex-shrink-0">
                        <Edit3 className="w-3 h-3" />
                      </div>
                      <span className="truncate">Editar</span>
                    </button>

                    {/* 3. Acessar Evento */}
                    <button
                      type="button"
                      id={`btn-enter-event-${ev.id}`}
                      onClick={() => onSelectEvent(ev)}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#24152F] hover:bg-[#180D20] text-[#F7F1E5] font-semibold text-xs shadow-2xs transition-all active:scale-98 cursor-pointer group border border-[#3F2553]"
                      title="Entrar na gestão deste evento"
                    >
                      <div className="w-5 h-5 rounded bg-[#DFFF5F] flex items-center justify-center text-[#180D20] flex-shrink-0 group-hover:scale-105 transition-transform">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                      <span className="truncate">Acessar Evento</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
