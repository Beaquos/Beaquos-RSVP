import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import { NavSection } from '../../types/navigation';
import { EventData } from '../../data/mockData';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onNewEventClick?: () => void;
  onOpenPreview?: () => void;
  isMasterView?: boolean;
  activeEvent?: EventData;
  events?: EventData[];
  onSelectEvent?: (event: EventData) => void;
  onExitToMaster?: () => void;
  onCopyEventLink?: () => void;
  hasCopiedLink?: boolean;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentSection,
  onSelectSection,
  onNewEventClick,
  onOpenPreview,
  isMasterView = false,
  activeEvent,
  events = [],
  onSelectEvent,
  onExitToMaster,
  onCopyEventLink,
  hasCopiedLink = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Handle ESC key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        handleCloseMobileMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, handleCloseMobileMenu]);

  return (
    <div id="admin-main-container" className="min-h-screen bg-[#FEFDF3] text-[#231F20] flex overflow-x-hidden font-sans">
      {/* 1. Desktop Persistent Sidebar */}
      <aside aria-label="Navegação Lateral Principal" className="hidden lg:block lg:flex-shrink-0 lg:w-72 fixed inset-y-0 left-0 z-40">
        <Sidebar
          currentSection={currentSection}
          onSelectSection={onSelectSection}
          onOpenPreview={onOpenPreview}
          eventName={activeEvent?.name}
          rsvpDeadline={activeEvent?.rsvpDeadline}
          isMasterView={isMasterView}
          onExitToMaster={onExitToMaster}
          onCopyEventLink={onCopyEventLink}
          hasCopiedLink={hasCopiedLink}
        />
      </aside>

      {/* 2. Mobile Drawer Sidebar (with motion animations) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true" aria-label="Menu de Navegação Móvel">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseMobileMenu}
              className="fixed inset-0 bg-[#231F20]/60 backdrop-blur-xs cursor-pointer"
              aria-hidden="true"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative flex-1 flex flex-col max-w-xs w-full bg-[#1B3024] shadow-2xl z-10"
            >
              <Sidebar
                currentSection={currentSection}
                onSelectSection={(sec) => {
                  onSelectSection(sec);
                  handleCloseMobileMenu();
                }}
                onCloseMobile={handleCloseMobileMenu}
                onOpenPreview={onOpenPreview}
                eventName={activeEvent?.name}
                rsvpDeadline={activeEvent?.rsvpDeadline}
                isMasterView={isMasterView}
                onExitToMaster={onExitToMaster}
                onCopyEventLink={onCopyEventLink}
                hasCopiedLink={hasCopiedLink}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Main Content Workspace */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <AdminHeader
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          currentSection={currentSection}
          onNewEventClick={onNewEventClick}
          isMasterView={isMasterView}
          activeEvent={activeEvent}
          events={events}
          onSelectEvent={onSelectEvent}
          onExitToMaster={onExitToMaster}
          onCopyEventLink={onCopyEventLink}
          hasCopiedLink={hasCopiedLink}
        />

        {/* Dynamic Body Content Container */}
        <main id="admin-main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
