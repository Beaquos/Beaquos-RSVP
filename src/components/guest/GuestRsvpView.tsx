import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Users,
  Sparkles,
  Send,
  Edit3,
} from 'lucide-react';
import { EventData, GuestData, FormQuestionData } from '../../data/mockData';
import { formatDateBR } from '../../utils/dateUtils';

interface GuestRsvpViewProps {
  event: EventData;
  guest: GuestData;
  questions: FormQuestionData[];
  onBackToAdmin: () => void;
  onSubmitRsvp: (guestId: string, status: 'confirmed' | 'declined', companionCount: number, companionNames: string[], answers: Record<string, any>) => void;
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
    const finalCompanionNames = attending === 'sim' && hasCompanions === 'sim'
      ? companionNames.split(',').map((n) => n.trim()).filter(Boolean)
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
    <div className="min-h-screen bg-[#FEFDF3] text-[#231F20] font-sans pb-16">
      {/* Top Simulation Bar */}
      <div className="bg-[#231F20] text-[#FEFDF3] px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50 border-b border-[#FEFDF3]/10">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#DFFFAE] animate-pulse" />
          <span className="font-semibold text-[#DFFFAE]">Visualização do Convidado</span>
          <span className="hidden sm:inline text-[#FEFDF3]/60">| Código: {guest.rsvpCode}</span>
        </div>
        <button
          onClick={onBackToAdmin}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#1B3024] hover:bg-[#FEFDF3]/20 text-[#FEFDF3] font-semibold text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Painel Admin
        </button>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-6 space-y-6">
        {/* Event Hero Card */}
        <div className="rounded-3xl bg-[#1B3024] text-[#FEFDF3] p-6 sm:p-8 text-center space-y-3 relative overflow-hidden shadow-lg border border-[#1B3024]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFFFAE]/20 text-[#DFFFAE] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Convite Oficial • RSVP
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FEFDF3]">
            {event.name}
          </h1>

          <div className="pt-2.5 flex flex-col items-center justify-center gap-1.5 text-xs text-[#FEFDF3]/90">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#DFFFAE]" />
              <strong className="font-semibold">{formatDateBR(event.date)}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#DFFFAE]" />
              <span>{event.time}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#DFFFAE]" />
              <span>{event.location}</span>
            </span>
          </div>

          <div className="pt-3 border-t border-[#FEFDF3]/10 text-[11px] text-[#FEFDF3]/70">
            Confirmação até: <strong>{formatDateBR(event.rsvpDeadline)}</strong>
          </div>
        </div>

        {/* Personalized Welcome Card */}
        <div className="bg-white rounded-2xl p-5 border border-[#231F20]/10 shadow-xs space-y-1">
          <p className="text-xs text-[#231F20]/60">Convite individual emitido para:</p>
          <h2 className="text-lg font-bold text-[#1B3024]">{guest.displayName}</h2>
          <p className="text-xs text-[#231F20]/70">
            Cota máxima autorizada: <strong>{guest.maxGuests} acompanhante(s)</strong>
          </p>
        </div>

        {/* Success Confirmation Card if already submitted */}
        {submitted ? (
          <div className="bg-white rounded-2xl p-6 border border-[#1B3024]/20 shadow-md text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#DFFFAE] text-[#1B3024] flex items-center justify-center mx-auto">
              {attending === 'sim' ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : (
                <XCircle className="w-7 h-7" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#231F20]">
                {attending === 'sim' ? 'Presença Confirmada!' : 'Resposta Registrada'}
              </h3>
              <p className="text-xs text-[#231F20]/70">
                {attending === 'sim'
                  ? `Ficamos imensamente felizes! Sua presença e de seus acompanhantes (+${companionCount}) estão registradas.`
                  : 'Agradecemos por nos avisar. Sentiremos sua falta nessa celebração!'}
              </p>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#231F20]/20 text-xs font-semibold hover:bg-[#FEFDF3]"
            >
              <Edit3 className="w-3.5 h-3.5" /> Alterar Minha Resposta
            </button>
          </div>
        ) : (
          /* Interactive RSVP Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-[#231F20]/10 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#231F20] pb-2 border-b border-[#231F20]/10">
              Confirmação de Presença
            </h3>

            {/* Question 1: Attending? */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#231F20]">
                1. Você poderá comparecer ao evento? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttending('sim')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    attending === 'sim'
                      ? 'bg-[#1B3024] text-[#FEFDF3] border-[#1B3024] ring-2 ring-[#DFFFAE]'
                      : 'border-[#231F20]/20 hover:bg-[#FEFDF3] text-[#231F20]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#DFFFAE]" /> Sim, eu vou!
                </button>
                <button
                  type="button"
                  onClick={() => setAttending('nao')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    attending === 'nao'
                      ? 'bg-[#231F20] text-[#FEFDF3] border-[#231F20]'
                      : 'border-[#231F20]/20 hover:bg-[#FEFDF3] text-[#231F20]'
                  }`}
                >
                  <XCircle className="w-4 h-4 text-rose-300" /> Não poderei ir
                </button>
              </div>
            </div>

            {/* Conditional Branch: If Attending */}
            {attending === 'sim' && (
              <div className="space-y-5 pt-4 border-t border-[#231F20]/10 animate-fade-in">
                {/* Question 2: Companions? */}
                {guest.maxGuests > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#231F20]">
                      2. Você irá acompanhado? *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setHasCompanions('sim')}
                        className={`p-2.5 rounded-lg border text-xs font-semibold ${
                          hasCompanions === 'sim'
                            ? 'bg-[#1B3024] text-[#FEFDF3] border-[#1B3024]'
                            : 'border-[#231F20]/20 text-[#231F20]'
                        }`}
                      >
                        Sim, levarei acompanhante
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasCompanions('nao')}
                        className={`p-2.5 rounded-lg border text-xs font-semibold ${
                          hasCompanions === 'nao'
                            ? 'bg-[#1B3024] text-[#FEFDF3] border-[#1B3024]'
                            : 'border-[#231F20]/20 text-[#231F20]'
                        }`}
                      >
                        Não, irei sozinho
                      </button>
                    </div>
                  </div>
                )}

                {/* Question 3: Companion Count & Names */}
                {hasCompanions === 'sim' && guest.maxGuests > 0 && (
                  <div className="p-4 rounded-xl bg-[#FEFDF3] border border-[#231F20]/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#1B3024]">
                        Quantos acompanhantes? (Máximo permitido: {guest.maxGuests})
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
                        className="w-16 px-2 py-1 rounded border border-[#231F20]/20 bg-white font-bold text-center text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1B3024] mb-1">
                        Nome completo dos acompanhantes *
                      </label>
                      <input
                        type="text"
                        required
                        value={companionNames}
                        onChange={(e) => setCompanionNames(e.target.value)}
                        placeholder="Ex: Mariana Silva, Pedro Santos"
                        className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Question 4: Dietary Restrictions */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#231F20]">
                    Possui alguma restrição alimentar ou alergia?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Nenhuma restrição', 'Vegetariano', 'Vegano', 'Sem Glúten', 'Sem Lactose'].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleToggleDietary(item)}
                          className={`p-2 rounded-lg border text-[11px] font-medium text-left transition-colors ${
                            dietary.includes(item)
                              ? 'bg-[#1B3024] text-[#FEFDF3] border-[#1B3024]'
                              : 'bg-white border-[#231F20]/15 text-[#231F20] hover:bg-[#FEFDF3]'
                          }`}
                        >
                          {dietary.includes(item) ? '✓ ' : ''}{item}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Message to hosts */}
            <div className="space-y-1 pt-2">
              <label className="block text-xs font-bold text-[#231F20]">
                Mensagem para os anfitriões (opcional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Deixe uma mensagem de carinho..."
                className="w-full px-3 py-2 rounded-lg border border-[#231F20]/20 bg-white text-xs"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!attending}
              className="w-full py-3 rounded-xl bg-[#1B3024] hover:bg-[#231F20] text-[#FEFDF3] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4 text-[#DFFFAE]" /> Confirmar Resposta Agora
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
