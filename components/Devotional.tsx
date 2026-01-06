
import React, { useState, useEffect } from 'react';
import { UserProfile, Devotional as DevotionalType } from '../types';
import { gemini } from '../services/geminiService';

interface Props {
  profile: UserProfile | null;
}

export const Devotional: React.FC<Props> = ({ profile }) => {
  const [devotional, setDevotional] = useState<DevotionalType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDevotional = async () => {
    if (!profile || isLoading) return;
    setIsLoading(true);
    try {
      const data = await gemini.getDailyDevotional(profile);
      setDevotional(data);
      localStorage.setItem('alianza_last_devotional', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('alianza_last_devotional');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if it's from today (optional logic, for now just load)
      setDevotional(parsed);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto bg-stone-50">
      <div className="text-center space-y-2">
        <h2 className="text-2xl serif font-bold text-stone-800">Conexión Espiritual</h2>
        <p className="text-sm text-stone-500 italic">Un momento de gracia para fortalecer el tercer hilo del pacto.</p>
      </div>

      {!devotional && !isLoading ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center space-y-4">
          <div className="bg-amber-50 p-4 rounded-full">
            <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h3 className="text-lg font-bold text-stone-800">Tu Devocional del Día</h3>
          <p className="text-stone-500 text-sm max-w-xs">Prepárate para un encuentro de 5 minutos con Dios y tu pareja.</p>
          <button
            onClick={fetchDevotional}
            className="mt-4 bg-stone-800 text-white px-8 py-3 rounded-full font-bold hover:bg-stone-900 transition-all shadow-lg"
          >
            Generar Devocional
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center py-20 space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full"></div>
              <p className="text-stone-400 text-sm uppercase font-bold tracking-widest">Preparando el altar familiar...</p>
            </div>
          ) : devotional && (
            <div className="space-y-6">
              {/* Reading Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-amber-500">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1 block">1. Lectura Bíblica</span>
                <p className="text-stone-800 italic serif text-lg leading-relaxed">"{devotional.reading}"</p>
              </div>

              {/* Reflection Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 block">2. El Tercer Hilo</span>
                <p className="text-sm text-stone-700 leading-relaxed">{devotional.reflection}</p>
              </div>

              {/* Practical Activity */}
              <div className="bg-amber-600 p-6 rounded-2xl shadow-xl text-white">
                <span className="text-[10px] font-bold text-amber-200 uppercase tracking-widest mb-2 block">3. Acción Práctica</span>
                <p className="text-base font-medium">{devotional.practicalActivity}</p>
              </div>

              {/* Prayer Guide */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">4. Guía de Oración</span>
                <p className="text-sm text-stone-700 leading-relaxed mb-4">{devotional.prayerGuide}</p>
                <div className="bg-stone-50 p-3 rounded-lg border border-dashed border-stone-200">
                  <p className="text-[10px] text-stone-400 italic text-center">Tómense de las manos y oren juntos.</p>
                </div>
              </div>

              <button
                onClick={fetchDevotional}
                className="w-full text-stone-400 text-xs font-bold uppercase hover:text-amber-600 transition-colors py-4"
              >
                Generar Nuevo Devocional
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
