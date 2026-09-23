import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import { GuestData, EventData } from '../../data/mockData';
import { formatDateBR } from '../../utils/dateUtils';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: GuestData | null;
  event: EventData;
  onOpenGuestPreview?: (guestCode: string) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  guest,
  event,
  onOpenGuestPreview,
}) => {
  const [copied, setCopied] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !guest) return null;

  const rsvpLink = `${window.location.origin}/rsvp/${guest.rsvpCode}`;
  const messageText = `Olá, ${guest.displayName}!\n\nVocê é nosso convidado especial para o *${event.name}* no dia *${formatDateBR(event.date)}*!\n\nPor favor, confirme sua presença através do seu link exclusivo do RSVP:\n👉 ${rsvpLink}\n\nContamos com sua presença! ✨`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    const phoneClean = guest.phone.replace(/\D/g, '');
    const url = phoneClean
      ? `https://api.whatsapp.com/send?phone=55${phoneClean}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div
      id="modal-backdrop-whatsapp"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#24152F]/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#24152F]/15 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#24152F] text-[#F7F1E5] flex items-center justify-between border-b border-[#3F2553] flex-shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <WhatsAppIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-[#F7F1E5] truncate">Mensagem para WhatsApp</h3>
              <p className="text-[10px] sm:text-[11px] text-[#D2C4DC] truncate">Convite personalizado com link individual</p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-whatsapp-modal"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#F7F1E5] cursor-pointer transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 text-xs text-[#24152F] overflow-y-auto flex-1">
          <div>
            <div className="flex items-center justify-between mb-1.5 text-[11px] text-[#24152F]/70">
              <span>Destinatário: <strong className="text-[#24152F]">{guest.name}</strong> ({guest.phone || 'Sem telefone'})</span>
              <span className="font-mono text-[#24152F] font-bold bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#24152F]/10">
                Código: {guest.rsvpCode}
              </span>
            </div>

            <textarea
              readOnly
              rows={8}
              value={messageText}
              className="w-full p-3 rounded-xl border border-[#24152F]/20 bg-[#FAF6EE] font-sans text-xs focus:outline-none text-[#24152F]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#24152F]/10">
            {onOpenGuestPreview && (
              <button
                type="button"
                id="btn-test-invite-whatsapp"
                onClick={() => {
                  onClose();
                  onOpenGuestPreview(guest.rsvpCode);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#24152F]/20 text-[#24152F] font-semibold hover:bg-[#F7F1E5] text-xs cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#24152F]" /> Testar este Convite
              </button>
            )}

            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <button
                type="button"
                id="btn-copy-whatsapp-text"
                onClick={handleCopy}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#24152F]/20 font-semibold text-xs text-[#24152F] hover:bg-[#F7F1E5] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#24152F]" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="btn-open-whatsapp-link"
                onClick={handleOpenWhatsApp}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm active:scale-98"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" /> Abrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
