import React, { useState, useEffect } from 'react';
import { X, UserCheck, Check, Clock } from 'lucide-react';
import { ManagerData } from '../../data/mockData';

interface ManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newManager: ManagerData) => void;
  eventName: string;
}

export const ManagerModal: React.FC<ManagerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  eventName,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accessStart, setAccessStart] = useState('2026-09-01');
  const [accessEnd, setAccessEnd] = useState('2026-10-30');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Reset fields when opening modal
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setAccessStart('2026-09-01');
      setAccessEnd('2026-10-30');
      setStatus('active');
    }
  }, [isOpen]);

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
    const newManager: ManagerData = {
      id: 'm-' + Date.now(),
      eventId: 'ev-01',
      name,
      email,
      accessStart,
      accessEnd,
      status,
    };
    onSave(newManager);
    onClose();
  };

  return (
    <div
      id="modal-backdrop-manager"
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
            <UserCheck className="w-5 h-5 text-[#DFFFAE]" />
            <h3 className="font-bold text-base">Cadastrar Responsável pelo Evento</h3>
          </div>
          <button
            type="button"
            id="btn-close-manager-modal"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1 rounded-lg hover:bg-[#FEFDF3]/15 text-[#FEFDF3] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-[#231F20]">
          <div className="p-3 rounded-lg bg-[#DFFFAE]/20 border border-[#DFFFAE] text-[#1B3024] text-[11px] space-y-1">
            <p className="font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Acesso Sem Senha por E-mail
            </p>
            <p>
              O responsável se identificará pelo e-mail cadastrado e terá acesso de visualização apenas
              durante o período configurado abaixo (independente do prazo de RSVP).
            </p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Evento Vinculado</label>
            <input
              type="text"
              disabled
              value={eventName}
              className="w-full px-3 py-2 rounded-lg border border-[#231F20]/15 bg-gray-100 font-medium text-[#231F20]/70"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Nome do Responsável *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
              placeholder="Ex: Lucas Ferreira (Noivo)"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">E-mail de Acesso *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
              placeholder="lucas.noivo@email.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Início do Acesso *</label>
              <input
                type="date"
                required
                value={accessStart}
                onChange={(e) => setAccessStart(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Fim do Acesso *</label>
              <input
                type="date"
                required
                value={accessEnd}
                onChange={(e) => setAccessEnd(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Status do Acesso</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
            >
              <option value="active">Ativo (Permitir acesso)</option>
              <option value="inactive">Inativo (Bloquear temporariamente)</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#231F20]/10">
            <button
              type="button"
              id="btn-cancel-manager-modal"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#231F20]/20 text-xs font-semibold hover:bg-[#231F20]/5 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-submit-manager-modal"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1B3024] hover:bg-[#231F20] text-[#FEFDF3] text-xs font-semibold cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5 text-[#DFFFAE]" /> Salvar Responsável
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
