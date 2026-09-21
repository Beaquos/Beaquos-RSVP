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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231F20]/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-[#FEFDF3] rounded-2xl border border-[#231F20]/10 shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 bg-[#1B3024] text-[#FEFDF3] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <WhatsAppIcon className="w-5 h-5 text-[#DFFFAE]" />
            <h3 className="font-bold text-base">Mensagem para WhatsApp</h3>
          </div>
          <button
            type="button"
            id="btn-close-whatsapp-modal"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1 rounded-lg hover:bg-[#FEFDF3]/15 text-[#FEFDF3] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-[#231F20]">
          <div>
            <div className="flex items-center justify-between mb-1 text-[11px] text-[#231F20]/70">
              <span>Destinatário: <strong>{guest.name}</strong> ({guest.phone || 'Sem telefone'})</span>
              <span className="font-mono text-[#1B3024] font-bold">Código: {guest.rsvpCode}</span>
            </div>

            <textarea
              readOnly
              rows={8}
              value={messageText}
              className="w-full p-3 rounded-lg border border-[#231F20]/20 bg-white font-sans text-xs focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#231F20]/10">
            {onOpenGuestPreview && (
              <button
                type="button"
                id="btn-test-invite-whatsapp"
                onClick={() => {
                  onClose();
                  onOpenGuestPreview(guest.rsvpCode);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1B3024]/30 text-[#1B3024] font-semibold hover:bg-[#DFFFAE]/30 text-xs cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Testar este Convite
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                id="btn-copy-whatsapp-text"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#231F20]/20 font-semibold text-xs hover:bg-[#231F20]/5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1B3024]" />
                    <span className="text-[#1B3024]">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="btn-open-whatsapp-link"
                onClick={handleOpenWhatsApp}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1B3024] hover:bg-[#231F20] text-[#FEFDF3] font-semibold text-xs transition-colors cursor-pointer shadow-sm"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#DFFFAE]" /> Abrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
