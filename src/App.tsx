/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AdminLayout } from './components/admin/AdminLayout';
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
import { NavSection } from './types/navigation';
import { copyToClipboard, getEventRsvpUrl } from './utils/linkUtils';

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('overview');

  // Multi-event separation & navigation mode: 'master' (Hub geral) | 'event' (Painel do evento do cliente)
  const [viewMode, setViewMode] = useState<'master' | 'event'>('event');

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
    setToastMessage(`Acessando o painel de "${selected.name}"`);
  };

  const handleExitToMaster = () => {
    setViewMode('master');
    setToastMessage('Você está no Painel Geral Beaquos (Hub de Eventos).');
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
    const code = guestCode || activeEventGuests[0]?.rsvpCode || guests[0]?.rsvpCode || 'BEA-7X9K2';
    setPreviewGuestCode(code);
    setIsGuestPreviewMode(true);
  };

  const handleSubmitGuestRsvp = (
    guestId: string,
    status: 'confirmed' | 'declined',
    companionCount: number,
    companionNames: string[],
    answers: Record<string, any>
  ) => {
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    setGuests((prev) =>
      prev.map((g) => {
        if (g.id === guestId) {
          return {
            ...g,
            status,
            companionCount,
            companionNames,
            answers,
            respondedAt: formattedDate,
          };
        }
        return g;
      })
    );
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Nome',
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

  // If in guest simulation mode, render guest experience
  if (isGuestPreviewMode) {
    const activeGuest =
      guests.find((g) => g.rsvpCode === previewGuestCode) || activeEventGuests[0] || guests[0] || INITIAL_GUESTS[0];

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
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        onNewEventClick={handleOpenNewEventModal}
        onOpenPreview={() => handleOpenGuestPreview()}
        isMasterView={viewMode === 'master'}
        activeEvent={activeEvent}
        events={events}
        onSelectEvent={handleSelectEvent}
        onExitToMaster={handleExitToMaster}
        onCopyEventLink={() => handleCopyEventLink()}
        hasCopiedLink={hasCopiedHeaderLink}
      >
        {viewMode === 'master' ? (
          /* 1. MASTER MANAGEMENT HUB: Global Beaquos Hub with all client events */
          <MasterEventsHub
            events={events}
            guests={guests}
            onSelectEvent={handleSelectEvent}
            onNewEvent={handleOpenNewEventModal}
            onEditEvent={handleOpenEditEventModal}
            onShowToast={(msg) => setToastMessage(msg)}
            onOpenPreview={handleOpenGuestPreview}
          />
        ) : (
          /* 2. CLIENT EVENT WORKSPACE: Deep management of active event */
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

        {/* Modals */}
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
