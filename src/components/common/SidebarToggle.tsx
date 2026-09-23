import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
  variant?: 'inline' | 'border-handle';
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  isCollapsed,
  onToggle,
  className = '',
  variant = 'inline',
}) => {
  const label = isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral';

  if (variant === 'border-handle') {
    return (
      <button
        type="button"
        id="btn-sidebar-toggle-handle"
        onClick={onToggle}
        aria-label={label}
        title={label}
        className={`absolute -right-3 top-20 z-50 w-6 h-6 rounded-full bg-[#24152F] text-[#DFFF5F] border border-[#3F2553] shadow-md flex items-center justify-center hover:bg-[#3F2553] hover:scale-110 active:scale-95 transition-all cursor-pointer ${className}`}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-[#DFFF5F]" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-[#DFFF5F]" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      id="btn-sidebar-toggle-button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className={`w-9 h-9 rounded-full flex items-center justify-center bg-[#2E1B3C] hover:bg-[#3F2553] text-[#F7F1E5] hover:text-[#DFFF5F] border border-[#3F2553] hover:border-[#DFFF5F]/40 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer ring-1 ring-white/5 ${className}`}
    >
      {isCollapsed ? (
        <ChevronRight className="w-4 h-4 text-[#DFFF5F]" />
      ) : (
        <ChevronLeft className="w-4 h-4 text-[#F7F1E5] hover:text-[#DFFF5F]" />
      )}
    </button>
  );
};
