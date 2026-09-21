import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  X,
  ExternalLink,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Copy,
  Check,
  ArrowLeft,
  LayoutGrid,
} from 'lucide-react';
import { NavSection, NavItem } from '../../types/navigation';
import { formatDateBR } from '../../utils/dateUtils';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onCloseMobile?: () => void;
  eventName?: string;
  rsvpDeadline?: string;
  onOpenPreview?: () => void;
  isMasterView?: boolean;
  onExitToMaster?: () => void;
  onCopyEventLink?: () => void;
  hasCopiedLink?: boolean;
}

const EVENT_NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Visão Geral',
    iconName: 'LayoutDashboard',
    description: 'Resumo e indicadores do evento',
  },
  {
    id: 'events',
    label: 'Dados do Evento',
    iconName: 'Calendar',
    badge: 'Ativo',
    description: 'Local, data, horário e prazo',
  },
  {
    id: 'form-builder',
    label: 'Construtor de Formulário',
    iconName: 'FileText',
    badge: 'Perguntas',
    description: 'Perguntas e regras do RSVP',
  },
  {
    id: 'guests',
    label: 'Lista de Convidados',
    iconName: 'Users',
    description: 'Importar CSV, links e WhatsApp',
  },
  {
    id: 'managers',
    label: 'Responsáveis',
    iconName: 'UserCheck',
    badge: 'Acessos',
    description: 'Controle de acesso por e-mail e data',
  },
  {
    id: 'analytics',
    label: 'Relatórios & Exportação',
    iconName: 'BarChart3',
    description: 'Exportar CSV e confirmações',
  },
  {
    id: 'settings',
    label: 'Configurações',
    iconName: 'Settings',
    description: 'Identidade e parâmetros',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  onCloseMobile,
  eventName = 'Casamento Marina & Lucas',
  rsvpDeadline = '10/Out/2026',
  onOpenPreview,
  isMasterView = false,
  onExitToMaster,
  onCopyEventLink,
  hasCopiedLink = false,
}) => {
  const renderIcon = (name: NavItem['iconName'], isActive: boolean) => {
    const iconClass = `w-4 h-4 transition-transform duration-200 ${
      isActive ? 'text-[#1B3024]' : 'text-[#DFFFAE] group-hover:scale-110'
    }`;

    let iconElement: React.ReactNode;
    switch (name) {
      case 'LayoutDashboard':
        iconElement = <LayoutDashboard className={iconClass} />;
        break;
      case 'Calendar':
        iconElement = <Calendar className={iconClass} />;
        break;
      case 'FileText':
        iconElement = <FileText className={iconClass} />;
        break;
      case 'Users':
        iconElement = <Users className={iconClass} />;
        break;
      case 'UserCheck':
        iconElement = <UserCheck className={iconClass} />;
        break;
      case 'BarChart3':
        iconElement = <BarChart3 className={iconClass} />;
        break;
      case 'Settings':
        iconElement = <Settings className={iconClass} />;
        break;
      default:
        iconElement = <LayoutDashboard className={iconClass} />;
    }

    return (
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all shadow-xs ${
          isActive
            ? 'bg-[#DFFFAE] text-[#1B3024] shadow-md ring-2 ring-[#DFFFAE]/40'
            : 'bg-[#FEFDF3]/10 text-[#DFFFAE] border border-[#FEFDF3]/15 group-hover:bg-[#FEFDF3]/20 group-hover:border-[#DFFFAE]/40'
        }`}
      >
        {iconElement}
      </div>
    );
  };

  return (
    <aside
      id="admin-sidebar"
      className="w-72 h-full bg-[#1B3024] text-[#FEFDF3] flex flex-col justify-between border-r border-[#1B3024]/40 shadow-xl select-none"
    >
      {/* Top Brand Header */}
      <div className="p-5 sm:p-6 border-b border-[#FEFDF3]/10">
        <div className="flex items-center justify-between">
          <div
            onClick={onExitToMaster}
            className="flex items-center space-x-3 cursor-pointer group"
            title="Ir para o Painel Geral Beaquos"
          >
            <div className="w-10 h-10 rounded-lg bg-[#231F20] border border-[#DFFFAE]/40 flex items-center justify-center shadow-inner group-hover:border-[#DFFFAE] transition-colors">
              <span className="font-bold text-base text-[#DFFFAE] tracking-tighter">B·</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm tracking-widest text-[#FEFDF3]">BEAQUOS</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#DFFFAE]/20 text-[#DFFFAE]">
                  RSVP
                </span>
              </div>
              <p className="text-[11px] text-[#FEFDF3]/60 tracking-tight">Estúdio Criativo</p>
            </div>
          </div>

          {onCloseMobile && (
            <button
              id="btn-close-sidebar-mobile"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#FEFDF3]/70 hover:text-[#FEFDF3] hover:bg-[#FEFDF3]/10 transition-colors cursor-pointer"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Master vs Event Workspace Card */}
        {isMasterView ? (
          <div className="mt-4 p-3 rounded-xl bg-[#231F20]/70 border border-[#DFFFAE]/30">
            <div className="flex items-center gap-1.5 text-[11px] text-[#DFFFAE] font-bold uppercase tracking-wider mb-1">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Painel Geral Multi-Eventos</span>
            </div>
            <p className="text-xs text-[#FEFDF3]/80">
              Visualizando todos os eventos cadastrados. Clique em um evento para abrir o painel individual.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {/* Explicit Back to Master Button */}
            {onExitToMaster && (
              <button
                type="button"
                id="btn-sidebar-exit-to-master"
                onClick={() => {
                  onExitToMaster();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#231F20]/80 hover:bg-[#231F20] border border-[#FEFDF3]/15 text-xs text-[#DFFFAE] font-semibold transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-6 h-6 rounded-md bg-[#DFFFAE]/20 text-[#DFFFAE] flex items-center justify-center flex-shrink-0 group-hover:bg-[#DFFFAE] group-hover:text-[#1B3024] transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">Sair para o Painel Geral</span>
                </div>
                <span className="text-[10px] bg-[#DFFFAE]/20 text-[#DFFFAE] px-2 py-0.5 rounded-full font-bold">Hub</span>
              </button>
            )}

            {/* Current Active Event Box */}
            <div className="p-3 rounded-xl bg-[#231F20]/60 border border-[#FEFDF3]/10">
              <div className="flex items-center justify-between text-[11px] text-[#FEFDF3]/60 mb-1">
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3 text-[#DFFFAE]" /> Evento Selecionado
                </span>
                <span className="text-[10px] text-[#DFFFAE] font-medium">Ativo</span>
              </div>
              <p className="text-xs font-semibold text-[#FEFDF3] truncate">{eventName}</p>
              <p className="text-[10px] text-[#FEFDF3]/70 mt-0.5">Confirmação até: {formatDateBR(rsvpDeadline)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#FEFDF3]/40">
            {isMasterView ? 'Gestão Geral' : 'Menu do Evento'}
          </p>
          {!isMasterView && onExitToMaster && (
            <button
              onClick={() => {
                onExitToMaster();
                if (onCloseMobile) onCloseMobile();
              }}
              className="text-[10px] text-[#DFFFAE] hover:underline font-medium cursor-pointer"
            >
              Meus Eventos
            </button>
          )}
        </div>

        {isMasterView ? (
          <div className="space-y-1.5">
            <button
              type="button"
              id="sidebar-master-hub"
              className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#231F20] text-[#FEFDF3] shadow-sm ring-1 ring-[#DFFFAE]/30 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#DFFFAE] text-[#1B3024] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <LayoutGrid className="w-4 h-4 text-[#1B3024]" />
                </div>
                <span>Hub de Eventos</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#DFFFAE]" />
            </button>

            <button
              type="button"
              onClick={() => onSelectSection('settings')}
              className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-[#FEFDF3]/80 hover:text-[#FEFDF3] hover:bg-[#FEFDF3]/10 cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#FEFDF3]/10 text-[#DFFFAE] border border-[#FEFDF3]/15 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FEFDF3]/20 transition-colors">
                  <Settings className="w-4 h-4 text-[#DFFFAE]" />
                </div>
                <span>Configurações Globais</span>
              </div>
            </button>
          </div>
        ) : (
          EVENT_NAV_ITEMS.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  onSelectSection(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full group text-left flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#231F20] text-[#FEFDF3] shadow-sm ring-1 ring-[#DFFFAE]/30'
                    : 'text-[#FEFDF3]/80 hover:text-[#FEFDF3] hover:bg-[#FEFDF3]/10'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  {renderIcon(item.iconName, isActive)}
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#DFFFAE] text-[#1B3024]'
                          : 'bg-[#FEFDF3]/10 text-[#FEFDF3]/70 group-hover:bg-[#FEFDF3]/20 group-hover:text-[#FEFDF3]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#DFFFAE]" />}
                </div>
              </button>
            );
          })
        )}
      </nav>

      {/* Footer Profile & Link */}
      <div className="p-4 border-t border-[#FEFDF3]/10 bg-[#231F20]/40">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1B3024]/60 border border-[#FEFDF3]/10 mb-2.5">
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-[#DFFFAE] text-[#1B3024] font-bold text-xs flex items-center justify-center flex-shrink-0">
              AD
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-[#FEFDF3] truncate">Admin Beaquos</p>
              <p className="text-[10px] text-[#FEFDF3]/50 truncate">beaquos@gmail.com</p>
            </div>
          </div>
          <ShieldCheck className="w-4 h-4 text-[#DFFFAE] flex-shrink-0" />
        </div>

        <button
          id="btn-preview-rsvp-link"
          onClick={() => {
            if (onOpenPreview) {
              onOpenPreview();
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-[#1B3024] bg-[#DFFFAE] hover:bg-[#DFFFAE]/90 transition-all shadow-sm active:scale-98 cursor-pointer group"
        >
          <div className="w-5 h-5 rounded-md bg-[#1B3024]/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <ExternalLink className="w-3.5 h-3.5 text-[#1B3024]" />
          </div>
          <span>Testar Link Convidado</span>
        </button>
      </div>
    </aside>
  );
};
