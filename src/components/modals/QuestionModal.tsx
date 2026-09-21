import React, { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { FormQuestionData } from '../../data/mockData';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newQuestion: FormQuestionData) => void;
  existingQuestions: FormQuestionData[];
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingQuestions,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<FormQuestionData['type']>('short_text');
  const [required, setRequired] = useState(true);
  const [optionsText, setOptionsText] = useState('Opção 1\nOpção 2\nOpção 3');
  const [hasCondition, setHasCondition] = useState(false);
  const [conditionTarget, setConditionTarget] = useState(existingQuestions[0]?.id || '');
  const [conditionValue, setConditionValue] = useState('sim');

  // Reset fields when opening
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setType('short_text');
      setRequired(true);
      setOptionsText('Opção 1\nOpção 2\nOpção 3');
      setHasCondition(false);
      setConditionTarget(existingQuestions[0]?.id || '');
      setConditionValue('sim');
    }
  }, [isOpen, existingQuestions]);

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

    const options = ['single_choice', 'multiple_choice', 'dropdown'].includes(type)
      ? optionsText.split('\n').map((o) => o.trim()).filter(Boolean)
      : undefined;

    const newQ: FormQuestionData = {
      id: 'q_' + Date.now(),
      eventId: 'ev-01',
      title,
      description,
      type,
      required,
      options,
      order: existingQuestions.length + 1,
      condition: hasCondition
        ? {
            targetQuestionId: conditionTarget,
            operator: 'equals',
            value: conditionValue,
          }
        : undefined,
    };

    onSave(newQ);
    onClose();
  };

  return (
    <div
      id="modal-backdrop-question"
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
            <Plus className="w-5 h-5 text-[#DFFFAE]" />
            <h3 className="font-bold text-base">Nova Pergunta RSVP</h3>
          </div>
          <button
            type="button"
            id="btn-close-question-modal"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1 rounded-lg hover:bg-[#FEFDF3]/15 text-[#FEFDF3] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-[#231F20]">
          <div>
            <label className="block font-semibold mb-1">Título da Pergunta *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
              placeholder="Ex: Qual o seu prato preferido no jantar?"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Texto de Apoio / Descrição (opcional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
              placeholder="Ex: Escolha para organizarmos os lugares à mesa."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Tipo de Pergunta</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
              >
                <option value="short_text">Texto Curto</option>
                <option value="long_text">Texto Longo</option>
                <option value="yes_no">Sim / Não</option>
                <option value="single_choice">Escolha Única</option>
                <option value="multiple_choice">Múltipla Escolha</option>
                <option value="number">Número</option>
                <option value="dropdown">Lista Suspensa</option>
                <option value="date">Data</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-5 px-3 rounded-lg border border-[#231F20]/15 bg-white">
              <span className="font-semibold">Obrigatória?</span>
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                className="w-4 h-4 accent-[#1B3024]"
              />
            </div>
          </div>

          {['single_choice', 'multiple_choice', 'dropdown'].includes(type) && (
            <div>
              <label className="block font-semibold mb-1">Opções (uma por linha)</label>
              <textarea
                rows={3}
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white"
              />
            </div>
          )}

          {/* Conditional Logic Section */}
          <div className="p-3.5 rounded-lg border border-[#231F20]/15 bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold block">Regra Condicional de Exibição</span>
                <span className="text-[11px] text-[#231F20]/60">
                  Mostrar esta pergunta apenas se outra pergunta atender a uma condição.
                </span>
              </div>
              <input
                type="checkbox"
                checked={hasCondition}
                onChange={(e) => setHasCondition(e.target.checked)}
                className="w-4 h-4 accent-[#1B3024]"
              />
            </div>

            {hasCondition && existingQuestions.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#231F20]/10">
                <div>
                  <label className="block text-[10px] font-semibold mb-0.5">Se a pergunta:</label>
                  <select
                    value={conditionTarget}
                    onChange={(e) => setConditionTarget(e.target.value)}
                    className="w-full p-1.5 rounded border border-[#231F20]/20 text-[11px]"
                  >
                    {existingQuestions.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold mb-0.5">Tiver a resposta:</label>
                  <input
                    type="text"
                    value={conditionValue}
                    onChange={(e) => setConditionValue(e.target.value)}
                    className="w-full p-1.5 rounded border border-[#231F20]/20 text-[11px]"
                    placeholder="Ex: sim"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#231F20]/10">
            <button
              type="button"
              id="btn-cancel-question-modal"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#231F20]/20 text-xs font-semibold hover:bg-[#231F20]/5 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-submit-question-modal"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1B3024] hover:bg-[#231F20] text-[#FEFDF3] text-xs font-semibold cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5 text-[#DFFFAE]" /> Salvar Pergunta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
