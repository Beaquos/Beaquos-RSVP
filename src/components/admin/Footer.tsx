import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="system-footer"
      className="w-full py-4 px-6 border-t border-[#24152F]/10 bg-[#FAF6EE]/80 text-center select-none"
    >
      <p className="text-xs text-[#24152F]/65 font-medium tracking-wide">
        Desenvolvido com carinho por{' '}
        <span className="text-[#24152F] font-semibold">Beaquos Estúdio Criativo</span>
      </p>
    </footer>
  );
};
