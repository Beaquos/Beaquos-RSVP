import React, { useState, useEffect } from 'react';
import { X, Calendar, Check } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#24152F]/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#24152F]/15 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#24152F] text-[#F7F1E5] flex items-center justify-between border-b border-[#3F2553] flex-shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-lg bg-[#DFFF5F] text-[#180D20] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-[#180D20]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-[#F7F1E5] truncate">Configurar Evento</h3>
              <p className="text-[10px] sm:text-[11px] text-[#D2C4DC] truncate">Dados gerais, datas e regras de confirmação</p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-event-modal"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#F7F1E5] transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs text-[#24152F]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1 text-[#24152F]">Nome do Evento *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  const newName = e.target.value;
                  // If slug was empty or auto-generated, keep slug synced
                  const autoSlug = newName
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                  setFormData((prev) => ({
                    ...prev,
                    name: newName,
                    slug: prev.slug ? prev.slug : autoSlug,
                  }));
                }}
                className="w-full px-3 py-2 rounded-lg border border-[#24152F]/20 bg-[#FAF6EE] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
                placeholder="Ex: Casamento Marina & Lucas"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1 text-[#24152F]">
                Slug da URL Pública (Link RSVP)
              </label>
              <div className="flex items-center rounded-lg border border-[#24152F]/20 bg-[#FAF6EE] px-3 py-2 focus-within:ring-1 focus-within:ring-[#24152F]">
                <span className="text-[11px] text-[#24152F]/50 select-none mr-1">/rsvp/evento/</span>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => {
                    const cleanSlug = e.target.value
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/[^a-z0-9-]/g, '')
                      .replace(/--+/g, '-');
                    setFormData({ ...formData, slug: cleanSlug });
                  }}
                  placeholder="ex: marina-e-lucas"
                  className="w-full bg-transparent text-xs text-[#24152F] font-semibold focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-[#24152F]/60 mt-1">
                Identificador exclusivo do evento para o link público de confirmação.
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#24152F]">Tipo de Evento</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#24152F]/20 bg-[#FAF6EE] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
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
              <label className="block font-semibold mb-1 text-[#24152F]">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-[#24152F]/20 bg-[#FAF6EE] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
              >
                <option value="active">Ativo (Recebendo Respostas)</option>
                <option value="closed">Fechado</option>
                <option value="draft">Rascunho</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#24152F]">Data do Evento</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#24152F]/20 bg-[#FAF6EE] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#24152F]">Horário de Início</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#24152F]/20 bg-[#FAF6EE] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1 text-[#24152F]">
                Confirmação até (Data Limite para Convidado) *
              </label>
              <input
                type="date"
                required
                value={formData.rsvpDeadline}
                onChange={(e) => setFormData({ ...formData, rsvpDeadline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#24152F]/30 bg-[#DFFF5F]/15 font-semibold focus:outline-none focus:ring-1 focus:ring-[#24152F]"
              />
              <p className="text-[10px] text-[#24152F]/60 mt-0.5">
                Após esta data, os convidados não poderão mais enviar ou alterar respostas.
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#24152F]">Local / Espaço</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#24152F]/20 bg-[#FAF6EE] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
                placeholder="Ex: Villa Giardini Espaço de Eventos"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#24152F]">Link do Google Maps</label>
              <input
                type="url"
                value={formData.mapsUrl}
                onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#24152F]/20 bg-[#FAF6EE] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1 text-[#24152F]">Endereço Completo</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#24152F]/20 bg-[#FAF6EE] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
                placeholder="Endereço para os convidados localizarem"
              />
            </div>

            <div className="sm:col-span-2 p-3.5 rounded-xl border border-[#24152F]/15 bg-[#FAF6EE]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold block text-[#24152F]">Permitir Acompanhantes?</span>
                  <span className="text-[11px] text-[#24152F]/60">
                    Habilita o campo condicional de acompanhantes no formulário.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.allowGuests}
                  onChange={(e) => setFormData({ ...formData, allowGuests: e.target.checked })}
                  className="w-4 h-4 accent-[#24152F]"
                />
              </div>

              {formData.allowGuests && (
                <div className="mt-3 pt-3 border-t border-[#24152F]/10 flex items-center justify-between">
                  <label className="font-semibold text-xs text-[#24152F]">Limite Padrão por Convite:</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.maxGuestsPerInvite}
                    onChange={(e) => setFormData({ ...formData, maxGuestsPerInvite: parseInt(e.target.value) || 1 })}
                    className="w-20 px-2.5 py-1.5 rounded-lg border border-[#24152F]/20 text-center font-bold bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-[#24152F]/10">
            <button
              type="button"
              id="btn-cancel-event-modal"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#24152F]/20 text-xs font-semibold text-[#24152F] hover:bg-[#F7F1E5] cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-submit-event-modal"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#24152F] hover:bg-[#180D20] text-[#F7F1E5] text-xs font-semibold shadow-sm cursor-pointer border border-[#3F2553] text-center"
            >
              <Check className="w-3.5 h-3.5 text-[#DFFF5F]" /> Salvar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
