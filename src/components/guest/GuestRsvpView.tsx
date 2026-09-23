import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  Send,
  Edit3,
} from 'lucide-react';
import { EventData, GuestData, FormQuestionData } from '../../data/mockData';
import { formatDateBR } from '../../utils/dateUtils';
import { RafluoLogo } from '../common/RafluoLogo';

interface GuestRsvpViewProps {
  event: EventData;
  guest: GuestData;
  questions: FormQuestionData[];
  onBackToAdmin: () => void;
  onSubmitRsvp: (
    guestId: string,
    status: 'confirmed' | 'declined',
    companionCount: number,
    companionNames: string[],
    answers: Record<string, any>
  ) => void;
}

export const GuestRsvpView: React.FC<GuestRsvpViewProps> = ({
  event,
  guest,
  questions,
  onBackToAdmin,
  onSubmitRsvp,
}) => {
  const [attending, setAttending] = useState<'sim' | 'nao' | null>(
    guest.status === 'confirmed' ? 'sim' : guest.status === 'declined' ? 'nao' : null
  );
  const [hasCompanions, setHasCompanions] = useState<'sim' | 'nao'>(
    guest.companionCount > 0 ? 'sim' : 'nao'
  );
  const [companionCount, setCompanionCount] = useState<number>(guest.companionCount || 1);
  const [companionNames, setCompanionNames] = useState<string>(
    guest.companionNames?.join(', ') || ''
  );
  const [dietary, setDietary] = useState<string[]>(guest.answers?.q_dietary || []);
  const [message, setMessage] = useState<string>(guest.answers?.q_message || '');
  const [submitted, setSubmitted] = useState<boolean>(guest.status !== 'pending');

  const handleToggleDietary = (item: string) => {
    if (dietary.includes(item)) {
      setDietary(dietary.filter((d) => d !== item));
    } else {
      setDietary([...dietary, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attending) return;

    const finalStatus = attending === 'sim' ? 'confirmed' : 'declined';
    const finalCompanionCount = attending === 'sim' && hasCompanions === 'sim' ? companionCount : 0;
    const finalCompanionNames =
      attending === 'sim' && hasCompanions === 'sim'
        ? companionNames
            .split(',')
            .map((n) => n.trim())
            .filter(Boolean)
        : [];

    const answers: Record<string, any> = {
      q_presence: attending,
      q_has_companions: hasCompanions,
      q_companion_count: finalCompanionCount,
      q_companion_names: companionNames,
      q_dietary: dietary,
      q_message: message,
    };

    onSubmitRsvp(guest.id, finalStatus, finalCompanionCount, finalCompanionNames, answers);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F1E5] text-[#24152F] font-sans pb-16 selection:bg-[#DFFF5F] selection:text-[#180D20]">
      {/* Top Simulation Bar (Admin preview banner) */}
      <div className="bg-[#24152F] text-[#F7F1E5] px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 text-xs sticky top-0 z-50 border-b border-[#3F2553]/60 shadow-md">
        <div className="flex items-center space-x-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#DFFF5F] animate-pulse flex-shrink-0" />
          <span className="font-semibold text-[#DFFF5F] truncate">Visualização do Convidado</span>
          <span className="hidden sm:inline text-[#D2C4DC]/70">| Código: {guest.rsvpCode}</span>
        </div>
        <button
          onClick={onBackToAdmin}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-[#2E1B3C] hover:bg-[#3F2553] text-[#F7F1E5] font-semibold text-xs transition-colors border border-[#3F2553] cursor-pointer flex-shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Voltar ao Painel</span>
          <span className="sm:hidden">Voltar</span>
        </button>
      </div>

      <div className="max-w-xl mx-auto px-3.5 sm:px-4 pt-4 sm:pt-8 space-y-5 sm:space-y-6">
        {/* Rafluo Header Badge */}
        <div className="flex items-center justify-center pt-2">
          <RafluoLogo variant="light" size="sm" showDescriptor={false} showOrigin={false} />
        </div>

        {/* Event Hero Card in Deep Purple with Neon Accents */}
        <div className="rounded-3xl bg-[#24152F] text-[#F7F1E5] p-5 sm:p-8 text-center space-y-4 relative overflow-hidden shadow-xl border border-[#3F2553]">
          <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[#DFFF5F]/10 blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFFF5F]/15 text-[#DFFF5F] text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-[#DFFF5F]/20">
            <Sparkles className="w-3.5 h-3.5" /> Convite Oficial • RSVP
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#F7F1E5] break-words">
            {event.name}
          </h1>

          <div className="pt-1 sm:pt-2 flex flex-col items-center justify-center gap-2 text-xs sm:text-sm text-[#D2C4DC]">
            <span className="flex items-center gap-1.5 font-medium text-[#F7F1E5]">
              <Calendar className="w-4 h-4 text-[#DFFF5F]" />
              <strong>{formatDateBR(event.date)}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#DFFF5F]" />
              <span>{event.time}</span>
            </span>
            <span className="flex items-center gap-1.5 text-center break-words max-w-full">
              <MapPin className="w-3.5 h-3.5 text-[#DFFF5F] flex-shrink-0" />
              <span>{event.location}</span>
            </span>
          </div>

          <div className="pt-3 border-t border-[#3F2553]/80 text-[11px] text-[#D2C4DC]/80">
            Confirmação até: <strong className="text-[#F7F1E5]">{formatDateBR(event.rsvpDeadline)}</strong>
          </div>
        </div>

        {/* Personalized Welcome Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#24152F]/10 shadow-xs space-y-1">
          <p className="text-xs text-[#24152F]/60 font-medium">Você está convidado(a):</p>
          <h2 className="text-lg sm:text-xl font-bold text-[#24152F] break-words">{guest.displayName}</h2>
          <p className="text-xs text-[#24152F]/70 pt-0.5">
            Cota autorizada: <strong>{guest.maxGuests} acompanhante(s)</strong>
          </p>
        </div>

        {/* Success Confirmation Card if already submitted */}
        {submitted ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#24152F]/15 shadow-md text-center space-y-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-sm ${
                attending === 'sim'
                  ? 'bg-[#DFFF5F] text-[#180D20] ring-4 ring-[#DFFF5F]/30'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {attending === 'sim' ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <XCircle className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-[#24152F]">
                {attending === 'sim' ? 'Presença Confirmada!' : 'Resposta Registrada'}
              </h3>
              <p className="text-xs sm:text-sm text-[#24152F]/70 max-w-sm mx-auto leading-relaxed">
                {attending === 'sim'
                  ? `Ficamos muito felizes! Sua confirmação${
                      companionCount > 0 ? ` e de seus acompanhantes (+${companionCount})` : ''
                    } foi registrada com sucesso.`
                  : 'Agradecemos por nos avisar com antecedência. Sua resposta foi salva!'}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#24152F]/20 text-xs font-semibold text-[#24152F] hover:bg-[#F7F1E5] transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Alterar Minha Resposta
              </button>
            </div>
          </div>
        ) : (
          /* Interactive RSVP Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 sm:p-7 border border-[#24152F]/10 shadow-sm space-y-6"
          >
            <div className="pb-3 border-b border-[#24152F]/10">
              <h3 className="text-base font-bold text-[#24152F]">
                Confirmação de Presença
              </h3>
              <p className="text-xs text-[#24152F]/60 mt-0.5">
                Por favor, responda até {formatDateBR(event.rsvpDeadline)}
              </p>
            </div>

            {/* Question 1: Attending? Large Buttons */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-[#24152F]">
                1. Você poderá comparecer ao evento? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttending('sim')}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    attending === 'sim'
                      ? 'bg-[#DFFF5F] text-[#180D20] border-[#DFFF5F] ring-2 ring-[#DFFF5F]/50 shadow-sm'
                      : 'border-[#24152F]/20 hover:bg-[#F7F1E5] text-[#24152F]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#180D20]" /> Confirmar Presença
                </button>
                <button
                  type="button"
                  onClick={() => setAttending('nao')}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    attending === 'nao'
                      ? 'bg-[#24152F] text-[#F7F1E5] border-[#24152F] ring-2 ring-[#24152F]/30'
                      : 'border-[#24152F]/20 hover:bg-[#F7F1E5] text-[#24152F]'
                  }`}
                >
                  <XCircle className="w-4 h-4 text-rose-300" /> Não poderei comparecer
                </button>
              </div>
            </div>

            {/* Conditional Branch: If Attending */}
            {attending === 'sim' && (
              <div className="space-y-5 pt-4 border-t border-[#24152F]/10">
                {/* Question 2: Companions? */}
                {guest.maxGuests > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#24152F]">
                      2. Você irá acompanhado(a)? *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setHasCompanions('sim')}
                        className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-colors text-center ${
                          hasCompanions === 'sim'
                            ? 'bg-[#24152F] text-[#F7F1E5] border-[#24152F]'
                            : 'border-[#24152F]/20 text-[#24152F] hover:bg-[#F7F1E5]'
                        }`}
                      >
                        Sim, levarei acompanhante
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasCompanions('nao')}
                        className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-colors text-center ${
                          hasCompanions === 'nao'
                            ? 'bg-[#24152F] text-[#F7F1E5] border-[#24152F]'
                            : 'border-[#24152F]/20 text-[#24152F] hover:bg-[#F7F1E5]'
                        }`}
                      >
                        Não, irei sozinho(a)
                      </button>
                    </div>
                  </div>
                )}

                {/* Question 3: Companion Count & Names */}
                {hasCompanions === 'sim' && guest.maxGuests > 0 && (
                  <div className="p-4 rounded-xl bg-[#FAF6EE] border border-[#24152F]/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#24152F]">
                        Quantos acompanhantes? (Máximo: {guest.maxGuests})
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={guest.maxGuests}
                        value={companionCount}
                        onChange={(e) =>
                          setCompanionCount(
                            Math.min(guest.maxGuests, Math.max(1, parseInt(e.target.value) || 1))
                          )
                        }
                        className="w-16 px-2 py-1 rounded-lg border border-[#24152F]/20 bg-white font-bold text-center text-xs text-[#24152F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#24152F] mb-1">
                        Nome completo dos acompanhantes *
                      </label>
                      <input
                        type="text"
                        required
                        value={companionNames}
                        onChange={(e) => setCompanionNames(e.target.value)}
                        placeholder="Ex: Mariana Silva, Pedro Santos"
                        className="w-full px-3 py-2.5 rounded-lg border border-[#24152F]/20 bg-white text-xs text-[#24152F] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
                      />
                    </div>
                  </div>
                )}

                {/* Question 4: Dietary Restrictions */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#24152F]">
                    Possui alguma restrição alimentar ou alergia?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {['Nenhuma restrição', 'Vegetariano', 'Vegano', 'Sem Glúten', 'Sem Lactose'].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleToggleDietary(item)}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors cursor-pointer flex items-center gap-1.5 ${
                            dietary.includes(item)
                              ? 'bg-[#24152F] text-[#F7F1E5] border-[#24152F]'
                              : 'bg-white border-[#24152F]/15 text-[#24152F] hover:bg-[#F7F1E5]'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${dietary.includes(item) ? 'bg-[#DFFF5F] text-[#180D20] font-bold' : 'border border-[#24152F]/30'}`}>
                            {dietary.includes(item) ? '✓' : ''}
                          </span>
                          <span>{item}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Message to hosts */}
            <div className="space-y-1 pt-2">
              <label className="block text-xs font-bold text-[#24152F]">
                Mensagem para os anfitriões (opcional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Deixe uma mensagem de carinho..."
                className="w-full px-3 py-2 rounded-lg border border-[#24152F]/20 bg-white text-xs text-[#24152F] focus:outline-none focus:ring-1 focus:ring-[#24152F]"
              />
            </div>

            {/* Primary Submit Button in Neon Green */}
            <button
              type="submit"
              disabled={!attending}
              className="w-full py-3.5 rounded-xl bg-[#DFFF5F] hover:bg-[#CEF04A] text-[#180D20] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-40 cursor-pointer active:scale-98"
            >
              <Send className="w-4 h-4 text-[#180D20]" />
              <span>Confirmar Resposta Agora</span>
            </button>
          </form>
        )}

        {/* Footer Identity */}
        <div className="pt-6 pb-2 text-center space-y-1">
          <p className="text-xs font-bold text-[#24152F]">
            Rafluo <span className="font-normal text-[#24152F]/70">• Gestão inteligente de confirmações.</span>
          </p>
          <p className="text-[11px] text-[#24152F]/60">
            Desenvolvido com carinho por{' '}
            <span className="font-semibold text-[#24152F]">Beaquos Estúdio Criativo</span>
          </p>
        </div>
      </div>
    </div>
  );
};
