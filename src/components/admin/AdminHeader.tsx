import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Plus,
  Calendar,
  Copy,
  Check,
  ChevronDown,
  Clock,
  ArrowLeft,
  Sparkles,
  LayoutGrid,
  CheckCircle2,
} from 'lucide-react';
import { NavSection } from '../../types/navigation';
import { EventData } from '../../data/mockData';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  currentSection: NavSection;
  onNewEventClick?: () => void;
  isMasterView?: boolean;
  activeEvent?: EventData;
  events?: EventData[];
  onSelectEvent?: (event: EventData) => void;
  onExitToMaster?: () => void;
  onCopyEventLink?: () => void;
  hasCopiedLink?: boolean;
}

const SECTION_TITLES: Record<NavSection, { title: string; subtitle: string }> = {
  overview: {
    title: 'Visão Geral do Evento',
    subtitle: 'Painel executivo de confirmações e métricas do RSVP',
  },
  events: {
    title: 'Gerenciamento de Eventos',
    subtitle: 'Crie, edite e configure prazos e dados do evento',
  },
  'form-builder': {
    title: 'Construtor de Formulário RSVP',
    subtitle: 'Estruturação de perguntas personalizadas e regras condicionais',
  },
  guests: {
    title: 'Gestão de Convidados',
    subtitle: 'Importação CSV, emissão de links exclusivos e status',
  },
  managers: {
    title: 'Responsáveis & Acessos',
    subtitle: 'Controle de acesso por e-mail e janela temporal permitida',
  },
  analytics: {
    title: 'Relatórios & Exportação',
    subtitle: 'Exportação em lote de dados consolidados e respostas',
  },
  settings: {
    title: 'Configurações do Sistema',
    subtitle: 'Identidade visual Beaquos, domínios e parâmetros gerais',
  },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  currentSection,
  onNewEventClick,
  isMasterView = false,
  activeEvent,
  events = [],
  onSelectEvent,
  onExitToMaster,
  onCopyEventLink,
  hasCopiedLink = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentMeta = SECTION_TITLES[currentSection] || SECTION_TITLES.overview;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="admin-top-header"
      className="sticky top-0 z-30 bg-[#FEFDF3]/95 backdrop-blur-md border-b border-[#231F20]/10 px-4 sm:px-6 py-3 transition-all"
    >
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Mobile Menu Button + Navigation / Breadcrumb */}
        <div className="flex items-center space-x-3 min-w-0">
          <button
            id="btn-open-sidebar-mobile"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-[#1B3024]/5 hover:bg-[#1B3024]/10 text-[#231F20] border border-[#1B3024]/10 shadow-2xs transition-colors cursor-pointer"
            aria-label="Abrir navegação"
          >
            <Menu className="w-5 h-5 text-[#1B3024]" />
          </button>

          <div className="min-w-0">
            {isMasterView ? (
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-bold text-[#231F20] tracking-tight">
                  Painel de Eventos
                </h1>
                <span className="text-[11px] bg-[#1B3024]/10 text-[#1B3024] font-bold px-2 py-0.5 rounded-full">
                  {events.length} eventos
                </span>
              </div>
            ) : (
              <div className="space-y-0.5">
                {/* Breadcrumb with explicit back button */}
                <div className="flex items-center space-x-1.5 text-[11px] font-medium text-[#231F20]/60">
                  {onExitToMaster && (
                    <button
                      type="button"
                      id="btn-breadcrumb-exit-master"
                      onClick={onExitToMaster}
                      className="text-[#1B3024] hover:underline font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <div className="w-4 h-4 rounded bg-[#1B3024]/10 flex items-center justify-center text-[#1B3024]">
                        <ArrowLeft className="w-2.5 h-2.5" />
                      </div>
                      <span>Painel Geral</span>
                    </button>
                  )}
                  <span>/</span>
                  <span className="text-[#231F20]/80 truncate">{currentMeta.title}</span>
                </div>

                {/* Event Dropdown Selector */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    id="btn-event-switcher-header"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-base sm:text-lg font-bold text-[#231F20] tracking-tight hover:text-[#1B3024] transition-colors cursor-pointer text-left group"
                    title="Clique para alternar de evento"
                  >
                    <span className="truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                      {activeEvent?.name || currentMeta.title}
                    </span>
                    <div className="w-5 h-5 rounded-md bg-[#1B3024]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1B3024]/20 transition-colors">
                      <ChevronDown className="w-3.5 h-3.5 text-[#1B3024]" />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-72 sm:w-80 rounded-xl bg-white border border-[#231F20]/15 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {onExitToMaster && (
                        <button
                          type="button"
                          id="dropdown-item-exit-to-master"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onExitToMaster();
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#1B3024] hover:bg-[#FEFDF3] flex items-center gap-2.5 border-b border-[#231F20]/10 cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-md bg-[#DFFFAE] flex items-center justify-center text-[#1B3024]">
                            <LayoutGrid className="w-3.5 h-3.5" />
                          </div>
                          <span>← Sair para o Painel Geral (Todos os Eventos)</span>
                        </button>
                      )}

                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#231F20]/40">
                        Trocar para outro Evento:
                      </div>

                      <div className="max-h-60 overflow-y-auto divide-y divide-[#231F20]/5">
                        {events.map((ev) => {
                          const isCurrent = ev.id === activeEvent?.id;
                          return (
                            <button
                              key={ev.id}
                              type="button"
                              onClick={() => {
                                setIsDropdownOpen(false);
                                if (onSelectEvent) onSelectEvent(ev);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                isCurrent
                                  ? 'bg-[#1B3024]/5 text-[#1B3024] font-bold'
                                  : 'text-[#231F20] hover:bg-[#FEFDF3]'
                              }`}
                            >
                              <div className="truncate pr-2">
                                <p className="truncate font-semibold">{ev.name}</p>
                                <p className="text-[10px] text-[#231F20]/50 truncate">
                                  {ev.type} • {ev.date}
                                </p>
                              </div>
                              {isCurrent && (
                                <div className="w-5 h-5 rounded-full bg-[#DFFFAE] flex items-center justify-center text-[#1B3024]">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0">
          {!isMasterView && activeEvent && (
            <>
              {/* Prominent "Copiar Link do Evento" Button */}
              {onCopyEventLink && (
                <button
                  type="button"
                  id="btn-copy-event-link-header"
                  onClick={onCopyEventLink}
                  title="Copiar link de RSVP deste evento"
                  className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                    hasCopiedLink
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#DFFFAE] hover:bg-[#DFFFAE]/90 text-[#1B3024] border border-[#1B3024]/20'
                  }`}
                >
                  {hasCopiedLink ? (
                    <>
                      <div className="w-5 h-5 rounded-md bg-emerald-200 text-emerald-800 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>Link Copiado!</span>
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 rounded-md bg-[#1B3024]/10 text-[#1B3024] flex items-center justify-center flex-shrink-0">
                        <Copy className="w-3 h-3" />
                      </div>
                      <span className="hidden sm:inline">Copiar Link do Evento</span>
                      <span className="sm:hidden">Copiar Link</span>
                    </>
                  )}
                </button>
              )}

              {/* Explicit "Sair para o Painel Geral" Button */}
              {onExitToMaster && (
                <button
                  type="button"
                  id="btn-exit-to-master-header"
                  onClick={onExitToMaster}
                  title="Sair deste evento e voltar para a lista de todos os eventos"
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-[#231F20]/20 hover:border-[#1B3024] text-[#231F20] hover:bg-[#231F20]/5 text-xs font-semibold transition-colors cursor-pointer group shadow-2xs"
                >
                  <div className="w-5 h-5 rounded-md bg-[#231F20]/5 group-hover:bg-[#1B3024]/10 text-[#1B3024] flex items-center justify-center flex-shrink-0 transition-colors">
                    <ArrowLeft className="w-3 h-3" />
                  </div>
                  <span>Sair do Evento</span>
                </button>
              )}
            </>
          )}

          {/* New Event Button */}
          <button
            id="btn-new-event-header"
            onClick={onNewEventClick}
            className="flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#1B3024] hover:bg-[#231F20] text-[#FEFDF3] text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer group"
          >
            <div className="w-5 h-5 rounded-md bg-[#FEFDF3]/15 text-[#DFFFAE] flex items-center justify-center flex-shrink-0 group-hover:bg-[#DFFFAE] group-hover:text-[#1B3024] transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline">Novo Evento</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
