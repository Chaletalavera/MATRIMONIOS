
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, SimulationTurn } from '../types';
import { gemini } from '../services/geminiService';
import { SCENARIOS } from '../constants';

interface Props {
  profile: UserProfile | null;
}

export const Simulator: React.FC<Props> = ({ profile }) => {
  const [activeScenario, setActiveScenario] = useState<typeof SCENARIOS[0] | null>(null);
  const [turns, setTurns] = useState<SimulationTurn[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [turns, isLoading]);

  const startScenario = (scenario: typeof SCENARIOS[0]) => {
    setActiveScenario(scenario);
    setTurns([{
      role: 'coach',
      text: `Has iniciado el escenario: **${scenario.title}**. Imagina que ${profile?.partnerName} llega a casa y surge este tema. ¿Cómo iniciarías la conversación usando el lenguaje del "Yo"?`
    }]);
  };

  const handleSend = async () => {
    if (!userInput.trim() || isLoading) return;
    
    const newUserTurn: SimulationTurn = { role: 'user', text: userInput };
    setTurns(prev => [...prev, newUserTurn]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await gemini.getSimulationTurn(userInput, profile!, turns);
      if (response) {
        setTurns(prev => [...prev, { role: 'partner', text: response }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeScenario) {
    return (
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl serif font-bold text-stone-800">Simulador de Conversaciones</h2>
          <p className="text-sm text-stone-500">Practica la comunicación en gracia antes de hablar en la vida real.</p>
        </div>
        <div className="grid gap-4">
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => startScenario(s)}
              className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm text-left hover:border-amber-400 transition-all group"
            >
              <h3 className="font-bold text-stone-800 mb-1 group-hover:text-amber-700">{s.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{s.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-stone-50">
      <div className="bg-white p-3 border-b border-stone-200 flex justify-between items-center px-6">
        <div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Escenario Activo</span>
          <h3 className="text-sm font-bold text-stone-800">{activeScenario.title}</h3>
        </div>
        <button onClick={() => setActiveScenario(null)} className="text-xs text-stone-400 hover:text-stone-600 font-bold uppercase">Salir</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {turns.map((t, i) => (
          <div key={i} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-2xl p-4 shadow-sm ${
              t.role === 'user' ? 'bg-amber-100 text-amber-900' : 
              t.role === 'coach' ? 'bg-stone-800 text-white' : 'bg-white text-stone-800 border border-stone-200'
            }`}>
              {t.role === 'coach' && <span className="text-[9px] font-bold uppercase text-amber-400 block mb-1 tracking-widest">Mentor Mediador</span>}
              {t.role === 'partner' && <span className="text-[9px] font-bold uppercase text-stone-400 block mb-1 tracking-widest">Simulación: {profile?.partnerName}</span>}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{t.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-stone-200 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-stone-400 uppercase">Procesando respuesta...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-stone-200 flex gap-2 items-end">
        <textarea
          rows={1}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Escribe tu planteamiento..."
          className="flex-1 bg-stone-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-200 border-none resize-none"
        />
        <button
          onClick={handleSend}
          disabled={!userInput.trim() || isLoading}
          className="bg-amber-600 text-white p-3 rounded-xl hover:bg-amber-700 disabled:opacity-50 transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </div>
    </div>
  );
};
