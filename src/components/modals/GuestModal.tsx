import React, { useState, useEffect } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { GuestData } from '../../data/mockData';

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newGuest: GuestData) => void;
  defaultMaxGuests?: number;
}

export const GuestModal: React.FC<GuestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultMaxGuests = 2,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    phone: '',
    email: '',
    group: 'Amigos',
    maxGuests: defaultMaxGuests,
    notes: '',
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        displayName: '',
        phone: '',
        email: '',
        group: 'Amigos',
        maxGuests: defaultMaxGuests,
        notes: '',
      });
    }
  }, [isOpen, defaultMaxGuests]);

  // Handle ESC key to close
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
    const randomCode = 'BEA-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    const newGuest: GuestData = {
      id: 'g-' + Date.now(),
      eventId: 'ev-01',
      name: formData.name,
      displayName: formData.displayName || formData.name,
      phone: formData.phone,
      email: formData.email,
      group: formData.group,
      maxGuests: formData.maxGuests,
      rsvpCode: randomCode,
      notes: formData.notes,
      status: 'pending',
      respondedAt: null,
      companionCount: 0,
      companionNames: [],
      answers: {},
    };

    onSave(newGuest);
    onClose();
  };

  return (
    <div
      id="modal-backdrop-guest"
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
            <UserPlus className="w-5 h-5 text-[#DFFFAE]" />
            <h3 className="font-bold text-base">Cadastrar Novo Convidado</h3>
          </div>
          <button
            type="button"
            id="btn-close-guest-modal"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1 rounded-lg hover:bg-[#FEFDF3]/15 text-[#FEFDF3] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs text-[#231F20]">
          <div>
            <label className="block font-semibold mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
              placeholder="Ex: Gabriela Vasconcelos"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Nome de Exibição no Convite</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
              placeholder="Ex: Gabriela e Família (deixe vazio para usar nome completo)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Telefone (WhatsApp)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
                placeholder="(61) 99999-9999"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Grupo / Categoria</label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
              >
                <option value="Família">Família</option>
                <option value="Família Noiva">Família Noiva</option>
                <option value="Família Noivo">Família Noivo</option>
                <option value="Padrinhos">Padrinhos</option>
                <option value="Amigos">Amigos</option>
                <option value="Trabalho">Trabalho</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">E-mail (opcional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Cota de Acompanhantes</label>
              <input
                type="number"
                min={0}
                max={10}
                value={formData.maxGuests}
                onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white text-center font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Observações Internas (Cerimonial)</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
              placeholder="Ex: Mesa próxima aos pais, restrição de mobilidade..."
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#231F20]/10">
            <button
              type="button"
              id="btn-cancel-guest-modal"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#231F20]/20 text-xs font-semibold hover:bg-[#231F20]/5 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-submit-guest-modal"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1B3024] hover:bg-[#231F20] text-[#FEFDF3] text-xs font-semibold cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5 text-[#DFFFAE]" /> Salvar Convidado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
