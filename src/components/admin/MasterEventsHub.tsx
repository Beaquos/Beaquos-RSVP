import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
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
  onOpenPreview,
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
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#231F20]">
            Eventos
          </h2>
          <p className="text-xs sm:text-sm text-[#231F20]/70 mt-0.5">
            Gerencie convidados, formulários RSVP e confirmações de presença de cada celebração
          </p>
        </div>

        <button
          id="btn-master-create-event"
          onClick={onNewEvent}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B3024] hover:bg-[#231F20] text-[#FEFDF3] font-semibold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer group w-fit"
        >
          <div className="w-5 h-5 rounded-md bg-[#DFFFAE] text-[#1B3024] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span>Cadastrar Novo Evento</span>
        </button>
      </div>

      {/* Global Master KPI Metrics with highlighted icon badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total de Eventos */}
        <div className="bg-[#FEFDF3] p-4 sm:p-5 rounded-2xl border border-[#1B3024]/25 shadow-xs flex flex-col justify-between hover:border-[#1B3024]/50 transition-all">
          <div className="flex items-center justify-between text-[#1B3024] text-xs font-bold">
            <span>Total de Eventos</span>
            <div className="w-9 h-9 rounded-xl bg-[#DFFFAE] text-[#1B3024] flex items-center justify-center shadow-xs ring-1 ring-[#1B3024]/20">
              <Calendar className="w-4 h-4 text-[#1B3024]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-bold text-[#1B3024] tracking-tight">{totalEvents}</p>
            <p className="text-[11px] text-[#231F20]/60 mt-0.5 font-medium">Sob administração</p>
          </div>
        </div>

        {/* RSVP Ativo */}
        <div className="bg-[#FEFDF3] p-4 sm:p-5 rounded-2xl border border-[#1B3024]/25 shadow-xs flex flex-col justify-between hover:border-[#1B3024]/50 transition-all">
          <div className="flex items-center justify-between text-[#1B3024] text-xs font-bold">
            <span>RSVP Ativo</span>
            <div className="w-9 h-9 rounded-xl bg-[#DFFFAE] text-[#1B3024] flex items-center justify-center shadow-xs ring-1 ring-[#1B3024]/20">
              <Sparkles className="w-4 h-4 text-[#1B3024]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-bold text-[#1B3024] tracking-tight">{activeEventsCount}</p>
            <p className="text-[11px] text-[#231F20]/60 mt-0.5 font-medium">Recebendo confirmações</p>
          </div>
        </div>

        {/* Total de Convites */}
        <div className="bg-[#FEFDF3] p-4 sm:p-5 rounded-2xl border border-[#1B3024]/25 shadow-xs flex flex-col justify-between hover:border-[#1B3024]/50 transition-all">
          <div className="flex items-center justify-between text-[#1B3024] text-xs font-bold">
            <span>Total de Convites</span>
            <div className="w-9 h-9 rounded-xl bg-[#DFFFAE] text-[#1B3024] flex items-center justify-center shadow-xs ring-1 ring-[#1B3024]/20">
              <Users className="w-4 h-4 text-[#1B3024]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-bold text-[#1B3024] tracking-tight">{totalGuestsManaged}</p>
            <p className="text-[11px] text-[#231F20]/60 mt-0.5 font-medium">Cadastrados na base</p>
          </div>
        </div>

        {/* Confirmações Gerais */}
        <div className="bg-[#FEFDF3] p-4 sm:p-5 rounded-2xl border border-emerald-300 shadow-xs flex flex-col justify-between hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between text-emerald-900 text-xs font-bold">
            <span>Confirmações Gerais</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center shadow-xs ring-1 ring-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-900" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-900 tracking-tight">{totalConfirmed}</p>
            <p className="text-[11px] text-emerald-800/80 mt-0.5 font-medium">Presenças confirmadas</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FEFDF3] p-4 rounded-xl border border-[#231F20]/10 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#231F20]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-master-events"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, evento, tipo ou local..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#231F20]/20 bg-white text-xs text-[#231F20] placeholder-[#231F20]/40 focus:outline-none focus:ring-1 focus:ring-[#1B3024]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-semibold text-[#231F20]/50 mr-1 hidden sm:inline">Status:</span>
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
                    ? 'bg-[#1B3024] text-[#FEFDF3]'
                    : 'bg-white border border-[#231F20]/15 text-[#231F20]/70 hover:bg-[#FEFDF3]'
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
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#231F20]/70">
            Eventos dos Clientes ({filteredEvents.length})
          </h3>
          <span className="text-xs text-[#231F20]/50">
            Clique em "Acessar Evento" para gerenciar convidados e formulário
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-[#231F20]/20 p-8 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-[#231F20]/30 mx-auto" />
            <p className="text-sm font-semibold text-[#231F20]">Nenhum evento encontrado</p>
            <p className="text-xs text-[#231F20]/50">
              Tente redefinir os filtros ou clique em "Cadastrar Novo Evento".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((ev) => {
              const eventGuests = guests.filter((g) => g.eventId === ev.id);
              const eventConfirmed = eventGuests.filter((g) => g.status === 'confirmed').length;
              const isCopied = copiedEventId === ev.id;
              const rsvpUrl = getEventRsvpUrl(ev.id, ev.slug);

              return (
                <div
                  key={ev.id}
                  id={`card-event-${ev.id}`}
                  className="bg-white rounded-2xl border border-[#231F20]/10 hover:border-[#1B3024]/40 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Type, Status, Client */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1B3024]/10 text-[#1B3024]">
                          {ev.type}
                        </span>
                        {ev.clientName && (
                          <span className="text-[11px] font-medium text-[#231F20]/60 truncate">
                            • {ev.clientName}
                          </span>
                        )}
                      </div>

                      {ev.status === 'active' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DFFFAE] text-[#1B3024] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1B3024] animate-pulse" />
                          RSVP Aberto
                        </span>
                      ) : ev.status === 'draft' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          Rascunho
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#231F20]/10 text-[#231F20]/60">
                          Encerrado
                        </span>
                      )}
                    </div>

                    {/* Event Title */}
                    <div>
                      <h4 className="text-base font-bold text-[#231F20] group-hover:text-[#1B3024] transition-colors">
                        {ev.name}
                      </h4>
                      <p className="text-xs text-[#231F20]/70 line-clamp-1 mt-0.5">
                        {ev.description || 'Sem descrição cadastrada'}
                      </p>
                    </div>

                    {/* Date, Time and Location: Dia/mês/ano e abaixo o horário */}
                    <div className="space-y-1.5 text-xs text-[#231F20]/80 pt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-[#1B3024]/10 text-[#1B3024] flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-3 h-3" />
                        </div>
                        <span className="font-semibold text-[#231F20]">
                          {formatDateBR(ev.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-[#1B3024]/10 text-[#1B3024] flex items-center justify-center flex-shrink-0">
                          <Clock className="w-3 h-3" />
                        </div>
                        <span className="font-medium text-[#231F20]/90">
                          {ev.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-[#1B3024]/10 text-[#1B3024] flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-3 h-3" />
                        </div>
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>

                    {/* RSVP Deadline and Stats */}
                    <div className="p-2.5 rounded-xl bg-[#FEFDF3] border border-[#231F20]/5 flex items-center justify-between text-xs">
                      <span className="text-[#231F20]/70 flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-[#1B3024]/10 text-[#1B3024] flex items-center justify-center flex-shrink-0">
                          <Clock className="w-3 h-3" />
                        </div>
                        <span>Confirmação até: <strong>{formatDateBR(ev.rsvpDeadline)}</strong></span>
                      </span>
                      <span className="font-semibold text-[#1B3024]">
                        {eventGuests.length} convidados ({eventConfirmed} confirmados)
                      </span>
                    </div>
                  </div>

                  {/* Actions Row: Equal prominence for Copiar Link do Evento, Editar, and Acessar Evento */}
                  <div className="pt-3.5 mt-3.5 border-t border-[#231F20]/10 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* 1. Copiar Link do Evento */}
                    <button
                      type="button"
                      id={`btn-copy-event-${ev.id}`}
                      onClick={(e) => handleCopyLink(e, ev)}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-98 ${
                        isCopied
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white hover:bg-[#FEFDF3] border-[#231F20]/15 hover:border-[#1B3024] text-[#1B3024]'
                      }`}
                      title="Copiar link RSVP do evento"
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                          isCopied ? 'bg-emerald-200 text-emerald-800' : 'bg-[#1B3024]/10 text-[#1B3024]'
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
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white hover:bg-[#FEFDF3] border border-[#231F20]/15 hover:border-[#1B3024] text-[#231F20] font-semibold text-xs transition-all cursor-pointer shadow-2xs active:scale-98"
                      title="Editar dados e configurações do evento"
                    >
                      <div className="w-5 h-5 rounded bg-[#1B3024]/10 text-[#1B3024] flex items-center justify-center flex-shrink-0">
                        <Edit3 className="w-3 h-3" />
                      </div>
                      <span className="truncate">Editar</span>
                    </button>

                    {/* 3. Acessar Evento */}
                    <button
                      type="button"
                      id={`btn-enter-event-${ev.id}`}
                      onClick={() => onSelectEvent(ev)}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1B3024] hover:bg-[#231F20] text-[#FEFDF3] font-semibold text-xs shadow-2xs transition-all active:scale-98 cursor-pointer group"
                      title="Entrar na gestão deste evento"
                    >
                      <div className="w-5 h-5 rounded bg-[#DFFFAE] flex items-center justify-center text-[#1B3024] flex-shrink-0 group-hover:scale-105 transition-transform">
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
