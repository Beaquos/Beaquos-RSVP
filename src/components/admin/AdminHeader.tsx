import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  ChevronDown,
  ArrowLeft,
  Copy,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { HubSection, NavSection } from '../../types/navigation';
import { EventData, GuestData } from '../../data/mockData';
import { AdminUser } from '../../types/user';
import { NotificationsDropdown } from './NotificationsDropdown';
import { ThemeToggle } from '../common/ThemeToggle';
import { UserMenu } from '../common/UserMenu';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  isMasterView: boolean;
  currentHubSection?: HubSection;
  currentSection?: NavSection;
  activeEvent?: EventData;
  events?: EventData[];
  guests?: GuestData[];
  currentUser: AdminUser;
  onSelectEvent?: (event: EventData) => void;
  onExitToMaster?: () => void;
  onCopyEventLink?: () => void;
  hasCopiedLink?: boolean;
  onOpenUserProfile: () => void;
  onLogout: () => void;
}

const HUB_TITLES: Record<HubSection, { title: string }> = {
  dashboard: {
    title: 'Dashboard',
  },
  events: {
    title: 'Eventos',
  },
  reports: {
    title: 'Relatórios',
  },
  users: {
    title: 'Usuários',
  },
};

const EVENT_SECTION_TITLES: Record<NavSection, { title: string }> = {
  overview: {
    title: 'Dashboard',
  },
  events: {
    title: 'Dados do Evento',
  },
  'form-builder': {
    title: 'Formulários',
  },
  guests: {
    title: 'Convidados',
  },
  managers: {
    title: 'Responsáveis',
  },
  analytics: {
    title: 'Relatórios',
  },
  settings: {
    title: 'Configurações',
  },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  isMasterView,
  currentHubSection = 'dashboard',
  currentSection = 'overview',
  activeEvent,
  events = [],
  guests = [],
  currentUser,
  onSelectEvent,
  onExitToMaster,
  onCopyEventLink,
  hasCopiedLink = false,
  onOpenUserProfile,
  onLogout,
}) => {
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const eventDropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        eventDropdownRef.current &&
        !eventDropdownRef.current.contains(event.target as Node)
      ) {
        setIsEventDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hubMeta = HUB_TITLES[currentHubSection] || HUB_TITLES.dashboard;
  const eventMeta = EVENT_SECTION_TITLES[currentSection] || EVENT_SECTION_TITLES.overview;

  return (
    <header
      id="admin-top-header"
      className="sticky top-0 z-30 bg-[#FAF6EE]/95 dark:bg-[#180D20]/95 backdrop-blur-md border-b border-[#24152F]/10 dark:border-[#3F2553]/60 px-4 sm:px-6 py-3 transition-colors"
    >
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Mobile Menu Button + Navigation / Breadcrumb Context */}
        <div className="flex items-center space-x-3 min-w-0">
          <button
            type="button"
            id="btn-open-sidebar-mobile"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-white dark:bg-[#24152F] border border-[#24152F]/15 dark:border-[#3F2553] text-[#24152F] dark:text-[#F7F1E5] shadow-2xs hover:bg-[#FAF6EE] dark:hover:bg-[#2E1B3C] transition-colors cursor-pointer"
            aria-label="Abrir navegação"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            {isMasterView ? (
              /* Hub View Header - Apenas o nome principal do menu, sem subtítulo */
              <div className="flex items-center">
                <h1 className="text-base sm:text-lg font-bold text-[#24152F] dark:text-[#F7F1E5] tracking-tight">
                  {hubMeta.title}
                </h1>
              </div>
            ) : (
              /* Inside Specific Event Header */
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5 text-[11px] font-medium text-[#24152F]/60 dark:text-[#D2C4DC]/70">
                  {onExitToMaster && (
                    <button
                      type="button"
                      id="btn-breadcrumb-exit-master"
                      onClick={onExitToMaster}
                      className="text-[#24152F] dark:text-[#F7F1E5] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Hub Geral</span>
                    </button>
                  )}
                  <span>/</span>
                  <span className="text-[#24152F]/80 dark:text-[#D2C4DC] truncate">{eventMeta.title}</span>
                </div>

                {/* Event Selector Dropdown */}
                <div className="relative" ref={eventDropdownRef}>
                  <button
                    type="button"
                    id="btn-event-switcher-header"
                    onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                    className="flex items-center gap-1.5 text-base sm:text-lg font-bold text-[#24152F] dark:text-[#F7F1E5] tracking-tight hover:text-[#3F2553] dark:hover:text-[#DFFF5F] transition-colors cursor-pointer text-left"
                    title="Alternar evento"
                  >
                    <span className="truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                      {activeEvent?.name || eventMeta.title}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[#24152F]/60 dark:text-[#D2C4DC]/60" />
                  </button>

                  {isEventDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-[#1E1128] border border-[#24152F]/15 dark:border-[#3F2553] shadow-xl py-2 z-50">
                      {onExitToMaster && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEventDropdownOpen(false);
                            onExitToMaster();
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#24152F] dark:text-[#F7F1E5] hover:bg-[#FAF6EE] dark:hover:bg-[#2E1B3C] flex items-center gap-2 border-b border-[#24152F]/10 dark:border-[#3F2553]/60 cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 text-[#24152F] dark:text-[#DFFF5F]" />
                          <span>Voltar ao Hub Geral</span>
                        </button>
                      )}

                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#24152F]/40 dark:text-[#D2C4DC]/50">
                        Trocar para outro Evento:
                      </div>

                      <div className="max-h-60 overflow-y-auto divide-y divide-[#24152F]/5 dark:divide-[#3F2553]/40">
                        {events.map((ev) => {
                          const isCurrent = ev.id === activeEvent?.id;
                          return (
                            <button
                              key={ev.id}
                              type="button"
                              onClick={() => {
                                setIsEventDropdownOpen(false);
                                if (onSelectEvent) onSelectEvent(ev);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                isCurrent
                                  ? 'bg-[#FAF6EE] dark:bg-[#2E1B3C] text-[#24152F] dark:text-[#DFFF5F] font-bold'
                                  : 'text-[#24152F] dark:text-[#F7F1E5] hover:bg-[#FAF6EE]/50 dark:hover:bg-[#2E1B3C]/50'
                              }`}
                            >
                              <div className="truncate pr-2">
                                <p className="truncate font-semibold">{ev.name}</p>
                                <p className="text-[10px] text-[#24152F]/50 dark:text-[#D2C4DC]/50 truncate">{ev.type}</p>
                              </div>
                              {isCurrent && (
                                <CheckCircle2 className="w-4 h-4 text-[#24152F] dark:text-[#DFFF5F] flex-shrink-0" />
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

        {/* Right Side: Quick Action (Event Only) + Notifications Icon + ThemeToggle + UserMenu */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0">
          {/* Quick link button when inside an event */}
          {!isMasterView && activeEvent && onCopyEventLink && (
            <button
              type="button"
              id="btn-copy-event-link-header"
              onClick={onCopyEventLink}
              title="Copiar link deste evento"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                hasCopiedLink
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-[#DFFF5F] hover:bg-[#CEF04A] text-[#180D20] border border-[#DFFF5F]'
              }`}
            >
              {hasCopiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedLink ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
          )}

          {/* 7. Notification Icon */}
          <NotificationsDropdown
            guests={guests}
            events={events}
            onSelectEvent={onSelectEvent}
          />

          {/* 1. Botão de alternar tema (ícone de sol/lua) no header */}
          <ThemeToggle />

          {/* 2. Menu dropdown do usuário (ao clicar no avatar) */}
          <UserMenu
            currentUser={currentUser}
            onOpenProfile={onOpenUserProfile}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
};
