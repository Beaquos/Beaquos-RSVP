import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, User, LogOut } from 'lucide-react';
import { AdminUser } from '../../types/user';

interface UserMenuProps {
  currentUser: AdminUser;
  onOpenProfile: () => void;
  onLogout: () => void;
  className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  currentUser,
  onOpenProfile,
  onLogout,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleProfileClick = () => {
    setIsOpen(false);
    onOpenProfile();
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  const displayName = `${currentUser.name} ${currentUser.lastName || ''}`.trim() || 'Administrador';
  const initials = `${currentUser.name?.charAt(0) || 'A'}${currentUser.lastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Avatar Button with Chevron */}
      <button
        type="button"
        id="btn-user-avatar-menu"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu do usuário"
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#24152F]/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#DFFF5F] transition-all cursor-pointer group"
      >
        {/* Circular Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#24152F] dark:bg-[#180D20] text-[#DFFF5F] font-bold text-xs flex items-center justify-center overflow-hidden flex-shrink-0 shadow-2xs border-2 border-white dark:border-[#3F2553] ring-1 ring-[#24152F]/20 dark:ring-white/10 group-hover:scale-105 transition-transform">
          {currentUser.photoUrl ? (
            <img
              src={currentUser.photoUrl}
              alt={displayName}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="select-none">{initials}</span>
          )}
        </div>

        {/* Chevron Icon indicating open/closed state */}
        <div className="text-[#24152F]/70 dark:text-[#D2C4DC] group-hover:text-[#24152F] dark:group-hover:text-[#F7F1E5] transition-colors pr-0.5">
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5 transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" />
          )}
        </div>
      </button>

      {/* Floating Dropdown Card */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-[#1E1128] border border-[#24152F]/15 dark:border-[#3F2553] shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header do Menu com foto de perfil posicionada no lado direito */}
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#24152F] dark:text-[#F7F1E5] truncate">
                {displayName}
              </p>
              <p className="text-[11px] text-[#24152F]/60 dark:text-[#D2C4DC]/70 truncate mt-0.5">
                {currentUser.email}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#24152F] dark:bg-[#180D20] text-[#DFFF5F] font-bold text-xs flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs border border-white/20">
              {currentUser.photoUrl ? (
                <img
                  src={currentUser.photoUrl}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="select-none">{initials}</span>
              )}
            </div>
          </div>

          {/* Linha Divisória */}
          <div className="my-1 border-t border-[#24152F]/10 dark:border-[#3F2553]/60" />

          {/* Opções */}
          <div className="py-1">
            {/* Meu Perfil */}
            <button
              type="button"
              id="btn-user-menu-profile"
              role="menuitem"
              onClick={handleProfileClick}
              className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#24152F] dark:text-[#F7F1E5] hover:bg-[#FAF6EE] dark:hover:bg-[#2E1B3C] flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-[#24152F]/70 dark:text-[#DFFF5F]" />
              <span>Meu Perfil</span>
            </button>

            {/* Sair */}
            <button
              type="button"
              id="btn-user-menu-logout"
              role="menuitem"
              onClick={handleLogoutClick}
              className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors cursor-pointer border-t border-[#24152F]/5 dark:border-[#3F2553]/40 mt-1"
            >
              <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
