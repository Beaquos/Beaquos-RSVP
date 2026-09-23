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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#24152F]/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#24152F]/15 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#24152F] text-[#F7F1E5] flex items-center justify-between border-b border-[#3F2553] flex-shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-lg bg-[#DFFF5F] text-[#180D20] flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-4 h-4 text-[#180D20]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-[#F7F1E5] truncate">Cadastrar Responsável pelo Evento</h3>
              <p className="text-[10px] sm:text-[11px] text-[#D2C4DC] truncate">Permissão de consulta de convidados e respostas</p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-manager-modal"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#F7F1E5] cursor-pointer transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs text-[#24152F] overflow-y-auto flex-1">
          <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#24152F]/15 text-[#24152F] text-[11px] space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-xs text-[#24152F]">
              <Clock className="w-3.5 h-3.5 text-[#24152F]" /> Acesso Sem Senha por E-mail
            </p>
            <p className="text-[#24152F]/70">
              O responsável se identificará pelo e-mail cadastrado e terá acesso de visualização apenas
              durante o período configurado abaixo (independente do prazo de confirmação dos convidados).
            </p>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-[#24152F]">Nome do Responsável *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#24152F]/20 bg-[#FAF6EE] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
              placeholder="Ex: Cerimonialista Roberta / Noivo Marcos"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-[#24152F]">E-mail de Identificação *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#24152F]/20 bg-[#FAF6EE] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
              placeholder="roberta@cerimonial.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-[#24152F]">Início do Acesso</label>
              <input
                type="date"
                required
                value={accessStart}
                onChange={(e) => setAccessStart(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#24152F]/20 bg-[#FAF6EE] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#24152F]">Término do Acesso</label>
              <input
                type="date"
                required
                value={accessEnd}
                onChange={(e) => setAccessEnd(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#24152F]/20 bg-[#FAF6EE] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-[#24152F]">Status do Acesso</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-[#24152F]/20 bg-[#FAF6EE] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
            >
              <option value="active">Ativo (Pode acessar)</option>
              <option value="inactive">Inativo (Acesso bloqueado)</option>
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-[#24152F]/10">
            <button
              type="button"
              id="btn-cancel-manager-modal"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#24152F]/20 text-xs font-semibold text-[#24152F] hover:bg-[#F7F1E5] cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-submit-manager-modal"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#24152F] hover:bg-[#180D20] text-[#F7F1E5] text-xs font-semibold shadow-sm cursor-pointer border border-[#3F2553] text-center"
            >
              <Check className="w-3.5 h-3.5 text-[#DFFF5F]" /> Salvar Responsável
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
