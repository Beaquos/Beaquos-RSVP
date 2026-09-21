import React, { useEffect } from 'react';
import { X, CheckCircle, XCircle, Clock, User, Phone, Users } from 'lucide-react';
import { GuestData, FormQuestionData } from '../../data/mockData';

interface GuestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: GuestData | null;
  questions: FormQuestionData[];
}

export const GuestDetailsModal: React.FC<GuestDetailsModalProps> = ({
  isOpen,
  onClose,
  guest,
  questions,
}) => {
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

  const renderStatusBadge = () => {
    switch (guest.status) {
      case 'confirmed':
        return (
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold bg-[#DFFFAE] text-[#1B3024]">
            <CheckCircle className="w-3.5 h-3.5" /> Presença Confirmada
          </span>
        );
      case 'declined':
        return (
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold bg-[#231F20]/10 text-[#231F20]/70">
            <XCircle className="w-3.5 h-3.5" /> Não Comparecerá
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold bg-amber-100 text-amber-900">
            <Clock className="w-3.5 h-3.5" /> Resposta Pendente
          </span>
        );
    }
  };

  return (
    <div
      id="modal-backdrop-guest-details"
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
            <User className="w-5 h-5 text-[#DFFFAE]" />
            <h3 className="font-bold text-base">Ficha de Resposta do Convidado</h3>
          </div>
          <button
            type="button"
            id="btn-close-guest-details-modal"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1 rounded-lg hover:bg-[#FEFDF3]/15 text-[#FEFDF3] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-[#231F20] max-h-[80vh] overflow-y-auto">
          {/* Guest Identity Card */}
          <div className="p-4 rounded-xl border border-[#231F20]/10 bg-white flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#231F20]">{guest.name}</h4>
              <p className="text-[#231F20]/60 text-xs">Exibição: {guest.displayName}</p>
              <div className="flex items-center gap-3 text-[11px] text-[#231F20]/70 pt-1">
                <span>{guest.phone || 'Sem telefone'}</span>
                <span>•</span>
                <span>Grupo: <strong>{guest.group}</strong></span>
                <span>•</span>
                <span className="font-mono text-[#1B3024] font-bold">Código: {guest.rsvpCode}</span>
              </div>
            </div>
            <div>{renderStatusBadge()}</div>
          </div>

          {/* Companions Details */}
          {guest.status === 'confirmed' && (
            <div className="p-3.5 rounded-xl border border-[#1B3024]/20 bg-[#DFFFAE]/15 space-y-2">
              <div className="flex items-center justify-between font-semibold text-[#1B3024]">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> Acompanhantes Confirmados:
                </span>
                <span className="font-bold text-sm">+{guest.companionCount}</span>
              </div>

              {guest.companionNames.length > 0 ? (
                <div className="space-y-1 pt-1 border-t border-[#1B3024]/10">
                  <p className="text-[11px] text-[#1B3024]/80 font-medium">Nomes informados:</p>
                  <ul className="list-disc list-inside space-y-0.5 font-medium">
                    {guest.companionNames.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-[11px] text-[#231F20]/60">Sem acompanhantes (irá sozinho).</p>
              )}
            </div>
          )}

          {/* Form Answers */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#231F20]/60">
              Respostas do Formulário Personalizado
            </h5>

            {Object.keys(guest.answers).length === 0 ? (
              <div className="p-4 rounded-xl border border-[#231F20]/10 bg-white text-center text-[#231F20]/60">
                Nenhuma resposta enviada ainda. O convidado está pendente.
              </div>
            ) : (
              <div className="space-y-2">
                {questions.map((q) => {
                  const ans = guest.answers[q.id];
                  if (ans === undefined || ans === null) return null;

                  return (
                    <div key={q.id} className="p-3 rounded-lg border border-[#231F20]/10 bg-white space-y-1">
                      <p className="font-semibold text-[#231F20] text-xs">{q.title}</p>
                      <p className="text-[#1B3024] font-medium text-xs bg-[#FEFDF3] p-2 rounded border border-[#231F20]/5">
                        {Array.isArray(ans) ? ans.join(', ') : String(ans)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#231F20]/10 text-[11px] text-[#231F20]/50">
            <span>
              {guest.respondedAt ? `Confirmado em: ${guest.respondedAt}` : 'Aguardando resposta'}
            </span>
            <button
              type="button"
              id="btn-close-guest-details-bottom"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#1B3024] text-[#FEFDF3] font-semibold hover:bg-[#231F20] cursor-pointer transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
