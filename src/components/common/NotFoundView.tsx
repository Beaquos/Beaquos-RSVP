import React from 'react';
import { CalendarX2, ArrowLeft, Search } from 'lucide-react';
import { RafluoLogo } from './RafluoLogo';

interface NotFoundViewProps {
  searchedSlug?: string;
  onGoHome?: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  searchedSlug,
  onGoHome,
}) => {
  return (
    <div className="min-h-screen bg-[#F7F1E5] text-[#24152F] font-sans flex flex-col justify-between p-4 sm:p-8">
      {/* Header */}
      <header className="flex items-center justify-center pt-2 sm:pt-4">
        <RafluoLogo variant="light" size="sm" showDescriptor={false} showOrigin={false} />
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto my-auto text-center space-y-6 py-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#24152F] text-[#DFFF5F] flex items-center justify-center mx-auto shadow-xl border border-[#3F2553]">
          <CalendarX2 className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#24152F]/10 text-[#24152F] text-[11px] font-bold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-[#24152F]" />
            Evento não encontrado
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#24152F]">
            Ops! Evento não localizado
          </h1>
          <p className="text-xs sm:text-sm text-[#24152F]/70 leading-relaxed max-w-sm mx-auto">
            {searchedSlug ? (
              <>
                Não encontramos nenhum evento ativo com o link{' '}
                <code className="px-1.5 py-0.5 rounded bg-[#24152F]/10 font-bold text-[#24152F]">
                  /rsvp/evento/{searchedSlug}
                </code>
                .
              </>
            ) : (
              'O endereço acessado não corresponde a nenhum evento ativo no sistema Rafluo.'
            )}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#24152F]/10 shadow-xs text-xs text-[#24152F]/75 space-y-2 text-left">
          <p className="font-semibold text-[#24152F]">O que pode ter acontecido?</p>
          <ul className="list-disc list-inside space-y-1 text-[#24152F]/70 text-[11px]">
            <li>O link pode conter algum erro de digitação</li>
            <li>O evento pode ter sido encerrado pelos anfitriões</li>
            <li>O identificador pode ter sido alterado pela organização</li>
          </ul>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onGoHome ? onGoHome : () => { window.location.href = '/'; }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#24152F] hover:bg-[#180D20] text-[#F7F1E5] text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer border border-[#3F2553]"
          >
            <ArrowLeft className="w-4 h-4 text-[#DFFF5F]" />
            <span>Voltar ao Início</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center space-y-1 pt-6 pb-2">
        <p className="text-xs font-bold text-[#24152F]">
          Rafluo <span className="font-normal text-[#24152F]/70">• Gestão inteligente de confirmações.</span>
        </p>
        <p className="text-[11px] text-[#24152F]/60">
          Desenvolvido com carinho por{' '}
          <span className="font-semibold text-[#24152F]">Beaquos Estúdio Criativo</span>
        </p>
      </footer>
    </div>
  );
};
