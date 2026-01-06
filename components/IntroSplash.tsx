
import React, { useEffect, useState } from 'react';

export const IntroSplash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 800); // Dar tiempo a la transición de salida
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-stone-950 flex flex-col items-center justify-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Fondo de Horizonte Infinito */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[150%] bg-[radial-gradient(circle_at_50%_70%,rgba(251,191,36,0.15)_0%,transparent_50%)]"></div>
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent blur-sm"></div>
      </div>

      {/* Animación de la Pareja */}
      <div className="relative mb-12 animate-walk">
        <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
          {/* Silueta Simplificada Pareja */}
          <g className="animate-sway">
            {/* Hombre */}
            <path d="M45 150 L40 100 L45 60 C45 60 35 55 35 40 C35 25 45 15 55 15 C65 15 75 25 75 40 C75 55 65 60 65 60 L70 100 L65 150" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
            {/* Mujer */}
            <path d="M75 150 L80 110 L75 75 C75 75 85 70 85 55 C85 40 75 30 65 30 C55 30 45 40 45 55 C45 70 55 75 55 75 L60 110 L55 150" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
            {/* Manos Entrelazadas (Centro) */}
            <circle cx="60" cy="95" r="4" fill="#fbbf24" className="animate-pulse shadow-amber-500"/>
          </g>
        </svg>
      </div>

      {/* Texto de Marca */}
      <div className="text-center relative z-10">
        <h1 className="text-4xl serif font-bold text-white tracking-widest mb-2 overflow-hidden">
          <span className="inline-block animate-reveal text-transparent bg-clip-text bg-gradient-to-b from-white to-stone-400">
            ALIANZA
          </span>
        </h1>
        <div className="h-0.5 w-12 bg-amber-500 mx-auto mb-4 animate-expand"></div>
        <p className="text-[10px] text-stone-500 uppercase tracking-[0.3em] font-light animate-fade-up">
          Uniendo dos hilos con el Tercero
        </p>
      </div>

      <style>{`
        @keyframes walk {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(0.98); }
          100% { transform: translateY(0) scale(0.95); opacity: 0.8; }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
        @keyframes reveal {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
        @keyframes expand {
          0% { width: 0; opacity: 0; }
          100% { width: 48px; opacity: 1; }
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-walk { animation: walk 4s ease-in-out infinite; }
        .animate-sway { animation: sway 2s ease-in-out infinite; transform-origin: bottom; }
        .animate-reveal { animation: reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1); }
        .animate-expand { animation: expand 1.5s ease-out 0.5s forwards; opacity: 0; }
        .animate-fade-up { animation: fade-up 1s ease-out 1.2s forwards; opacity: 0; }
      `}</style>
    </div>
  );
};
