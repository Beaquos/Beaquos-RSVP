import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, Users, Check } from 'lucide-react';
import { EventData } from '../../data/mockData';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventData;
  onSave: (updatedEvent: EventData) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  onSave,
}) => {
  const [formData, setFormData] = useState<EventData>(event);

  useEffect(() => {
    setFormData(event);
  }, [event, isOpen]);

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div
      id="modal-backdrop-event"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231F20]/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-[#FEFDF3] rounded-2xl border border-[#231F20]/10 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1B3024] text-[#FEFDF3] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#DFFFAE]" />
            <h3 className="font-bold text-base">Configurar Evento</h3>
          </div>
          <button
            type="button"
            id="btn-close-event-modal"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1 rounded-lg hover:bg-[#FEFDF3]/15 text-[#FEFDF3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs text-[#231F20]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Nome do Evento *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B3024]"
                placeholder="Ex: Casamento Marina & Lucas"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Tipo de Evento</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B3024]"
              >
                <option value="Casamento">Casamento</option>
                <option value="Aniversário">Aniversário</option>
                <option value="15 Anos">15 Anos</option>
                <option value="Infantil">Infantil</option>
                <option value="Formatura">Formatura</option>
                <option value="Corporativo">Corporativo</option>
                <option value="Chá">Chá de Panela / Bebê</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B3024]"
              >
                <option value="active">Ativo (Recebendo Respostas)</option>
                <option value="closed">Fechado</option>
                <option value="draft">Rascunho</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Data do Evento</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B3024]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Horário de Início</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B3024]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Prazo Final para RSVP (Data Limite Convidado) *</label>
              <input
                type="date"
                required
                value={formData.rsvpDeadline}
                onChange={(e) => setFormData({ ...formData, rsvpDeadline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#1B3024]/40 bg-[#DFFFAE]/10 focus:outline-none focus:ring-1 focus:ring-[#1B3024]"
              />
              <p className="text-[10px] text-[#231F20]/60 mt-0.5">
                Após esta data, os convidados não poderão mais enviar ou alterar respostas.
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1">Local / Espaço</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B3024]"
                placeholder="Ex: Villa Giardini Espaço de Eventos"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Link do Google Maps</label>
              <input
                type="url"
                value={formData.mapsUrl}
                onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B3024]"
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Endereço Completo</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B3024]"
                placeholder="Endereço para os convidados localizarem"
              />
            </div>

            <div className="sm:col-span-2 p-3 rounded-lg border border-[#231F20]/15 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold block">Permitir Acompanhantes?</span>
                  <span className="text-[11px] text-[#231F20]/60">
                    Habilita o campo condicional de acompanhantes no formulário.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.allowGuests}
                  onChange={(e) => setFormData({ ...formData, allowGuests: e.target.checked })}
                  className="w-4 h-4 accent-[#1B3024]"
                />
              </div>

              {formData.allowGuests && (
                <div className="mt-3 pt-3 border-t border-[#231F20]/10 flex items-center justify-between">
                  <label className="font-semibold text-xs">Limite Padrão por Convite:</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.maxGuestsPerInvite}
                    onChange={(e) => setFormData({ ...formData, maxGuestsPerInvite: parseInt(e.target.value) || 1 })}
                    className="w-20 px-2.5 py-1.5 rounded border border-[#231F20]/20 text-center font-bold"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-[#231F20]/10">
            <button
              type="button"
              id="btn-cancel-event-modal"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#231F20]/20 text-xs font-semibold hover:bg-[#231F20]/5 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-submit-event-modal"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1B3024] hover:bg-[#231F20] text-[#FEFDF3] text-xs font-semibold shadow-sm cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-[#DFFFAE]" /> Salvar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
