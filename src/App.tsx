/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AdminLayout } from './components/admin/AdminLayout';
import { HubDashboardView } from './components/admin/HubDashboardView';
import { HubReportsView } from './components/admin/HubReportsView';
import { HubUsersView } from './components/admin/HubUsersView';
import { UserProfileModal } from './components/admin/UserProfileModal';
import { LoginView } from './components/auth/LoginView';
import { DashboardSkeleton } from './components/admin/DashboardSkeleton';
import { MasterEventsHub } from './components/admin/MasterEventsHub';
import { GuestRsvpView } from './components/guest/GuestRsvpView';
import { EventModal } from './components/modals/EventModal';
import { GuestModal } from './components/modals/GuestModal';
import { ImportCsvModal } from './components/modals/ImportCsvModal';
import { QuestionModal } from './components/modals/QuestionModal';
import { ManagerModal } from './components/modals/ManagerModal';
import { WhatsAppModal } from './components/modals/WhatsAppModal';
import { GuestDetailsModal } from './components/modals/GuestDetailsModal';
import { Toast } from './components/common/Toast';
import {
  INITIAL_EVENTS,
  INITIAL_GUESTS,
  INITIAL_QUESTIONS,
  INITIAL_MANAGERS,
  EventData,
  GuestData,
  FormQuestionData,
  ManagerData,
} from './data/mockData';
import { HubSection, NavSection } from './types/navigation';
import { AdminUser, AdminUserStatus } from './types/user';
import { copyToClipboard, getEventRsvpUrl } from './utils/linkUtils';

// Initial Registered Administrator User
const INITIAL_ADMIN_USER: AdminUser = {
  id: 'usr-01',
  name: 'Beatriz',
  lastName: 'Alencar',
  email: 'beaquos@gmail.com',
  phone: '(61) 98765-4321',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  role: 'Super Administrador',
  status: 'active',
  createdAt: '2026-01-15',
};

const INITIAL_ADMIN_USERS_LIST: AdminUser[] = [
  INITIAL_ADMIN_USER,
  {
    id: 'usr-02',
    name: 'Lucas',
    lastName: 'Ferreira',
    email: 'lucas@beaquos.com',
    phone: '(61) 99123-4567',
    photoUrl: null,
    role: 'Gestor de Eventos',
    status: 'active',
    createdAt: '2026-02-10',
  },
  {
    id: 'usr-03',
    name: 'Helena',
    lastName: 'Vasconcelos',
    email: 'helena.eventos@gmail.com',
    phone: '(61) 98234-5678',
    photoUrl: null,
    role: 'Cerimonialista',
    status: 'active',
    createdAt: '2026-03-01',
  },
  {
    id: 'usr-04',
    name: 'Mariana',
    lastName: 'Ribeiro',
    email: 'mariana.apoio@beaquos.com',
    phone: '(61) 98345-6789',
    photoUrl: null,
    role: 'Cerimonialista',
    status: 'temporary',
    accessStart: '2026-10-01',
    accessEnd: '2026-10-31',
    createdAt: '2026-09-21',
  },
];

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState<AdminUser>(INITIAL_ADMIN_USER);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS_LIST);

  // Hub Navigation State: 'dashboard' | 'events' | 'reports' | 'users'
  const [currentHubSection, setCurrentHubSection] = useState<HubSection>('dashboard');

  // Navigation mode: 'master' (Hub geral Rafluo) | 'event' (Painel do evento do cliente)
  const [viewMode, setViewMode] = useState<'master' | 'event'>('master');
  const [currentSection, setCurrentSection] = useState<NavSection>('overview');

  // Core Data States
  const [events, setEvents] = useState<EventData[]>(INITIAL_EVENTS);
  const [activeEventId, setActiveEventId] = useState<string>(INITIAL_EVENTS[0].id);
  const [guests, setGuests] = useState<GuestData[]>(INITIAL_GUESTS);
  const [questions, setQuestions] = useState<FormQuestionData[]>(INITIAL_QUESTIONS);
  const [managers, setManagers] = useState<ManagerData[]>(INITIAL_MANAGERS);

  // Modals Visibility
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isImportCsvModalOpen, setIsImportCsvModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isGuestDetailsModalOpen, setIsGuestDetailsModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);

  // Selected entities for modals
  const [selectedGuest, setSelectedGuest] = useState<GuestData | null>(null);

  // Simulation / Guest Mode
  const [isGuestPreviewMode, setIsGuestPreviewMode] = useState(false);
  const [previewGuestCode, setPreviewGuestCode] = useState<string>(INITIAL_GUESTS[0]?.rsvpCode || '');

  // Notifications / Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasCopiedHeaderLink, setHasCopiedHeaderLink] = useState(false);

  // Currently Active Event
  const activeEvent: EventData =
    events.find((e) => e.id === activeEventId) || events[0] || INITIAL_EVENTS[0];

  // Filter guests belonging to the active event for the event dashboard
  const activeEventGuests = guests.filter((g) => g.eventId === activeEvent.id);

  // Handlers for switching and exiting
  const handleSelectEvent = (selected: EventData) => {
    setActiveEventId(selected.id);
    setViewMode('event');
    setCurrentSection('overview');
    setToastMessage(`Acessando a gestão operacional de "${selected.name}"`);
  };

  const handleExitToMaster = () => {
    setViewMode('master');
    setCurrentHubSection('events');
    setToastMessage('Você está no Hub Administrativo Geral.');
  };

  // Copying event RSVP link
  const handleCopyEventLink = async (targetEvent?: EventData) => {
    const ev = targetEvent || activeEvent;
    const url = getEventRsvpUrl(ev.id, ev.slug);
    const ok = await copyToClipboard(url);
    if (ok) {
      setHasCopiedHeaderLink(true);
      setToastMessage(`Link do evento "${ev.name}" copiado com sucesso!`);
      setTimeout(() => setHasCopiedHeaderLink(false), 2500);
    }
  };

  // Event modal handlers (new or edit)
  const handleOpenNewEventModal = () => {
    const newDraft: EventData = {
      id: `ev-${Date.now().toString().slice(-4)}`,
      name: '',
      clientName: '',
      slug: '',
      type: 'Casamento',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      location: '',
      address: '',
      mapsUrl: 'https://maps.google.com',
      description: '',
      rsvpDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      allowGuests: true,
      maxGuestsPerInvite: 2,
      status: 'active',
    };
    setEditingEvent(newDraft);
    setIsEventModalOpen(true);
  };

  const handleOpenEditEventModal = (eventToEdit?: EventData) => {
    setEditingEvent(eventToEdit || activeEvent);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (updated: EventData) => {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === updated.id);
      if (exists) {
        return prev.map((e) => (e.id === updated.id ? updated : e));
      } else {
        return [updated, ...prev];
      }
    });

    setActiveEventId(updated.id);
    setToastMessage(`Evento "${updated.name || 'Novo Evento'}" salvo com sucesso!`);
  };

  const handleAddGuest = (newGuest: GuestData) => {
    const guestWithEvent = {
      ...newGuest,
      eventId: activeEvent.id,
    };
    setGuests((prev) => [guestWithEvent, ...prev]);
    setToastMessage(`Convidado "${newGuest.name}" cadastrado com sucesso!`);
  };

  const handleImportGuests = (newGuests: GuestData[]) => {
    const guestsWithEvent = newGuests.map((g) => ({
      ...g,
      eventId: activeEvent.id,
    }));
    setGuests((prev) => [...guestsWithEvent, ...prev]);
    setToastMessage(`${newGuests.length} convidados importados com sucesso!`);
  };

  const handleAddQuestion = (newQuestion: FormQuestionData) => {
    const questionWithEvent = {
      ...newQuestion,
      eventId: activeEvent.id,
    };
    setQuestions((prev) => [...prev, questionWithEvent]);
    setToastMessage('Pergunta adicionada ao formulário RSVP!');
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    setToastMessage('Pergunta removida do formulário.');
  };

  const handleAddManager = (newManager: ManagerData) => {
    const managerWithEvent = {
      ...newManager,
      eventId: activeEvent.id,
    };
    setManagers((prev) => [...prev, managerWithEvent]);
    setToastMessage(`Responsável "${newManager.name}" adicionado.`);
  };

  const handleOpenWhatsApp = (guest: GuestData) => {
    setSelectedGuest(guest);
    setIsWhatsAppModalOpen(true);
  };

  const handleOpenGuestDetails = (guest: GuestData) => {
    setSelectedGuest(guest);
    setIsGuestDetailsModalOpen(true);
  };

  const handleOpenGuestPreview = (guestCode?: string) => {
    if (guestCode) {
      setPreviewGuestCode(guestCode);
    } else if (activeEventGuests.length > 0) {
      setPreviewGuestCode(activeEventGuests[0].rsvpCode);
    }
    setIsGuestPreviewMode(true);
  };

  // Submit RSVP from the guest perspective
  const handleSubmitGuestRsvp = (
    guestId: string,
    status: 'confirmed' | 'declined',
    companionCount: number,
    companionNames: string[],
    answers: Record<string, any>
  ) => {
    const updatedTimestamp = new Date().toISOString().split('T')[0];

    setGuests((prev) =>
      prev.map((g) =>
        g.id === guestId
          ? {
              ...g,
              status,
              companionCount,
              companionNames,
              respondedAt: updatedTimestamp,
              answers: { ...g.answers, ...answers },
            }
          : g
      )
    );

    setToastMessage(
      status === 'confirmed'
        ? 'Presença confirmada com sucesso!'
        : 'Ausência informada com sucesso.'
    );
  };

  // User Profile update
  const handleSaveUserProfile = (updatedUser: AdminUser) => {
    setCurrentUser(updatedUser);
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  // Administrative users management
  const handleSaveAdminUser = (user: AdminUser) => {
    setAdminUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      if (exists) {
        return prev.map((u) => (u.id === user.id ? user : u));
      }
      return [...prev, user];
    });
    if (user.id === currentUser.id) {
      setCurrentUser(user);
    }
  };

  const handleToggleAdminUserStatus = (userId: string, newStatus?: AdminUserStatus) => {
    if (userId === currentUser.id) return;
    setAdminUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const targetStatus: AdminUserStatus =
          newStatus || (u.status === 'active' ? 'disabled' : 'active');
        return { ...u, status: targetStatus };
      })
    );
    setToastMessage('Status do usuário administrativo alterado com sucesso.');
  };

  // Logout - Section 10
  const handleLogout = () => {
    setIsAuthenticated(false);
    setToastMessage('Sessão encerrada com sucesso.');
  };

  // Login - Section 10
  const handleLogin = (user: AdminUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setToastMessage(`Bem-vindo(a) ao Rafluo, ${user.name}!`);
  };

  // Export CSV for active event
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Nome Principal',
      'Nome Exibicao',
      'Telefone',
      'Grupo',
      'Codigo RSVP',
      'Status',
      'Qtd Acompanhantes',
      'Nomes Acompanhantes',
      'Data Resposta',
      'Observacoes',
    ];

    const rows = activeEventGuests.map((g) => [
      `"${g.id}"`,
      `"${g.name}"`,
      `"${g.displayName}"`,
      `"${g.phone}"`,
      `"${g.group}"`,
      `"${g.rsvpCode}"`,
      `"${g.status}"`,
      `"${g.companionCount}"`,
      `"${g.companionNames.join(', ')}"`,
      `"${g.respondedAt || ''}"`,
      `"${g.notes || ''}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `convidados_${activeEvent.name.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToastMessage('Planilha de convidados exportada com sucesso!');
  };

  // 10. If not authenticated, render Login Screen
  if (!isAuthenticated) {
    return (
      <>
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        <LoginView
          onLogin={handleLogin}
          defaultUser={currentUser}
          registeredUsers={adminUsers}
        />
      </>
    );
  }

  // If in guest simulation mode, render guest experience
  if (isGuestPreviewMode) {
    const activeGuest =
      guests.find((g) => g.rsvpCode === previewGuestCode) ||
      activeEventGuests[0] ||
      guests[0] ||
      INITIAL_GUESTS[0];

    return (
      <GuestRsvpView
        event={activeEvent}
        guest={activeGuest}
        questions={questions}
        onBackToAdmin={() => setIsGuestPreviewMode(false)}
        onSubmitRsvp={handleSubmitGuestRsvp}
      />
    );
  }

  return (
    <>
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <AdminLayout
        isMasterView={viewMode === 'master'}
        currentHubSection={currentHubSection}
        onSelectHubSection={(hubSection) => {
          setCurrentHubSection(hubSection);
          setViewMode('master');
        }}
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        onOpenPreview={() => handleOpenGuestPreview()}
        activeEvent={activeEvent}
        events={events}
        guests={guests}
        currentUser={currentUser}
        onSelectEvent={handleSelectEvent}
        onExitToMaster={handleExitToMaster}
        onCopyEventLink={() => handleCopyEventLink()}
        hasCopiedLink={hasCopiedHeaderLink}
        onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
        onLogout={handleLogout}
      >
        {viewMode === 'master' ? (
          /* 1. MASTER ADMINISTRATIVE HUB: Dashboard | Eventos | Relatórios | Usuários */
          <>
            {currentHubSection === 'dashboard' && (
              <HubDashboardView
                currentUser={currentUser}
                events={events}
                guests={guests}
                onSelectEvent={handleSelectEvent}
                onNavigateToEvents={() => setCurrentHubSection('events')}
              />
            )}

            {currentHubSection === 'events' && (
              <MasterEventsHub
                events={events}
                guests={guests}
                onSelectEvent={handleSelectEvent}
                onNewEvent={handleOpenNewEventModal}
                onEditEvent={handleOpenEditEventModal}
                onShowToast={(msg) => setToastMessage(msg)}
                onOpenPreview={handleOpenGuestPreview}
              />
            )}

            {currentHubSection === 'reports' && (
              <HubReportsView
                events={events}
                guests={guests}
                onShowToast={(msg) => setToastMessage(msg)}
                onSelectEvent={handleSelectEvent}
              />
            )}

            {currentHubSection === 'users' && (
              <HubUsersView
                adminUsers={adminUsers}
                currentUser={currentUser}
                onSaveUser={handleSaveAdminUser}
                onToggleStatus={handleToggleAdminUserStatus}
                onShowToast={(msg) => setToastMessage(msg)}
              />
            )}
          </>
        ) : (
          /* 2. EVENT OPERATIONAL WORKSPACE: Deep management of active event */
          <DashboardSkeleton
            currentSection={currentSection}
            onNavigate={setCurrentSection}
            event={activeEvent}
            onEditEvent={() => handleOpenEditEventModal(activeEvent)}
            questions={questions}
            onAddQuestion={() => setIsQuestionModalOpen(true)}
            onDeleteQuestion={handleDeleteQuestion}
            guests={activeEventGuests}
            onAddGuest={() => setIsGuestModalOpen(true)}
            onImportCsv={() => setIsImportCsvModalOpen(true)}
            onOpenWhatsApp={handleOpenWhatsApp}
            onOpenGuestDetails={handleOpenGuestDetails}
            onOpenGuestPreview={handleOpenGuestPreview}
            managers={managers}
            onAddManager={() => setIsManagerModalOpen(true)}
            onExportCsv={handleExportCsv}
            onExitToMaster={handleExitToMaster}
            onShowToast={(msg) => setToastMessage(msg)}
            onCopyEventLink={() => handleCopyEventLink()}
            hasCopiedLink={hasCopiedHeaderLink}
          />
        )}

        {/* User Profile Modal (Dados Cadastrais) */}
        <UserProfileModal
          isOpen={isUserProfileModalOpen}
          onClose={() => setIsUserProfileModalOpen(false)}
          currentUser={currentUser}
          onSaveProfile={handleSaveUserProfile}
          onShowToast={(msg) => setToastMessage(msg)}
        />

        {/* Existing Event, Guest & Operational Modals */}
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => {
            setIsEventModalOpen(false);
            setEditingEvent(null);
          }}
          event={editingEvent || activeEvent}
          onSave={handleSaveEvent}
        />

        <GuestModal
          isOpen={isGuestModalOpen}
          onClose={() => setIsGuestModalOpen(false)}
          onSave={handleAddGuest}
          defaultMaxGuests={activeEvent.maxGuestsPerInvite}
        />

        <ImportCsvModal
          isOpen={isImportCsvModalOpen}
          onClose={() => setIsImportCsvModalOpen(false)}
          onImport={handleImportGuests}
        />

        <QuestionModal
          isOpen={isQuestionModalOpen}
          onClose={() => setIsQuestionModalOpen(false)}
          onSave={handleAddQuestion}
          existingQuestions={questions}
        />

        <ManagerModal
          isOpen={isManagerModalOpen}
          onClose={() => setIsManagerModalOpen(false)}
          onSave={handleAddManager}
          eventName={activeEvent.name}
        />

        <WhatsAppModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => {
            setIsWhatsAppModalOpen(false);
            setSelectedGuest(null);
          }}
          guest={selectedGuest}
          event={activeEvent}
          onOpenGuestPreview={handleOpenGuestPreview}
        />

        <GuestDetailsModal
          isOpen={isGuestDetailsModalOpen}
          onClose={() => {
            setIsGuestDetailsModalOpen(false);
            setSelectedGuest(null);
          }}
          guest={selectedGuest}
          questions={questions}
        />
      </AdminLayout>
    </>
  );
}
