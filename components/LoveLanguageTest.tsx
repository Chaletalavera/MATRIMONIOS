
import React, { useState } from 'react';
import { LoveLanguageScores } from '../types';

interface Question {
  id: number;
  options: {
    text: string;
    type: keyof LoveLanguageScores;
  }[];
}

const QUESTIONS: Question[] = [
  { id: 1, options: [{ text: "Me gusta recibir notas de amor.", type: 'words' }, { text: "Me gusta que me abrazen.", type: 'touch' }] },
  { id: 2, options: [{ text: "Me gusta pasar tiempo a solas con mi pareja.", type: 'time' }, { text: "Me siento amado cuando mi pareja me ayuda con las tareas.", type: 'acts' }] },
  { id: 3, options: [{ text: "Me gusta recibir pequeños regalos.", type: 'gifts' }, { text: "Me gusta que mi pareja me diga lo mucho que me aprecia.", type: 'words' }] },
  { id: 4, options: [{ text: "Me gusta caminar tomados de la mano.", type: 'touch' }, { text: "Aprecio que mi pareja me escuche sin interrumpir.", type: 'time' }] },
  { id: 5, options: [{ text: "Me hace feliz que mi pareja lave los platos por mí.", type: 'acts' }, { text: "Me encanta recibir detalles sin motivo.", type: 'gifts' }] },
  { id: 6, options: [{ text: "Me gusta que mi pareja me felicite por mis logros.", type: 'words' }, { text: "Aprecio cuando mi pareja hace algo que sabe que no me gusta hacer.", type: 'acts' }] },
  { id: 7, options: [{ text: "Me gusta que estemos cerca físicamente.", type: 'touch' }, { text: "Me gusta que mi pareja me sorprenda con un regalo.", type: 'gifts' }] },
  { id: 8, options: [{ text: "Me gusta salir a cenar o pasear solo los dos.", type: 'time' }, { text: "Me gusta que mi pareja me diga: 'Estoy orgulloso de ti'.", type: 'words' }] },
  { id: 9, options: [{ text: "Me siento querido cuando recibo un regalo inesperado.", type: 'gifts' }, { text: "Me siento querido cuando mi pareja me ayuda con la limpieza.", type: 'acts' }] },
  { id: 10, options: [{ text: "Me gusta que mi pareja me toque el hombro o la espalda.", type: 'touch' }, { text: "Me gusta que mi pareja me dedique toda su atención.", type: 'time' }] },
  { id: 11, options: [{ text: "Valoro que mi pareja se esfuerce por terminar tareas de la casa.", type: 'acts' }, { text: "Valoro que mi pareja me traiga algo especial de la tienda.", type: 'gifts' }] },
  { id: 12, options: [{ text: "Me gusta que mi pareja me diga cosas bonitas.", type: 'words' }, { text: "Me gusta que nos sentemos juntos en el sofá.", type: 'touch' }] },
  { id: 13, options: [{ text: "Prefiero hacer un viaje juntos que recibir un regalo caro.", type: 'time' }, { text: "Me gusta que mi pareja me ayude cuando estoy cansado.", type: 'acts' }] },
  { id: 14, options: [{ text: "Me gusta recibir abrazos largos.", type: 'touch' }, { text: "Me gusta que mi pareja note cuando hago algo bien.", type: 'words' }] },
  { id: 15, options: [{ text: "Me gusta que me den un regalo por mi cumpleaños.", type: 'gifts' }, { text: "Me gusta que me escuchen de verdad.", type: 'time' }] },
  { id: 16, options: [{ text: "Me gusta que mi pareja me traiga el desayuno a la cama.", type: 'acts' }, { text: "Me gusta el contacto físico mientras hablamos.", type: 'touch' }] },
  { id: 17, options: [{ text: "Me gusta que me envíen mensajes cariñosos durante el día.", type: 'words' }, { text: "Me gusta que planeemos una cita especial.", type: 'time' }] },
  { id: 18, options: [{ text: "Aprecio los regalos que mi pareja hace a mano.", type: 'gifts' }, { text: "Aprecio que mi pareja me anime en mis proyectos.", type: 'words' }] },
  { id: 19, options: [{ text: "Me gusta que me den un beso al salir de casa.", type: 'touch' }, { text: "Me gusta que mi pareja se ofrezca a hacer mis recados.", type: 'acts' }] },
  { id: 20, options: [{ text: "Me gusta pasar el fin de semana sin distracciones.", type: 'time' }, { text: "Me gusta recibir un detalle aunque sea pequeño.", type: 'gifts' }] }
];

const LANGUAGE_NAMES: Record<string, string> = {
  words: 'Palabras de Afirmación',
  acts: 'Actos de Servicio',
  gifts: 'Regalos',
  time: 'Tiempo de Calidad',
  touch: 'Contacto Físico'
};

interface Props {
  onComplete: (scores: LoveLanguageScores, primary: string) => void;
  userName: string;
}

export const LoveLanguageTest: React.FC<Props> = ({ onComplete, userName }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<LoveLanguageScores>({
    words: 0, acts: 0, gifts: 0, time: 0, touch: 0
  });
  const [showResult, setShowResult] = useState(false);
  const [primaryLang, setPrimaryLang] = useState('');

  const handleSelect = (type: keyof LoveLanguageScores) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    if (currentIdx < QUESTIONS.length - 1) {
      setScores(newScores);
      setCurrentIdx(currentIdx + 1);
    } else {
      // Fix: Use explicit Number conversion to resolve arithmetic operator type errors in sort
      const sorted = (Object.entries(newScores) as [string, number][]).sort((a, b) => Number(b[1]) - Number(a[1]));
      setScores(newScores);
      setPrimaryLang(LANGUAGE_NAMES[sorted[0][0]]);
      setShowResult(true);
    }
  };

  const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;

  if (showResult) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 max-w-lg mx-auto text-center animate-in fade-in zoom-in duration-300">
        <div className="mb-6">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
          <h3 className="text-2xl serif font-bold text-stone-800">¡Test Completado!</h3>
          <p className="text-stone-500 text-sm mt-2">Tu lenguaje principal es:</p>
          <div className="mt-4 inline-block px-6 py-2 bg-amber-600 text-white rounded-full font-bold text-lg shadow-lg shadow-amber-200">
            {primaryLang}
          </div>
        </div>

        <div className="space-y-4 mb-8 text-left">
          {/* Fix: Use explicit Number conversion to resolve arithmetic operator type errors in sort */}
          {(Object.entries(scores) as [string, number][]).sort((a, b) => Number(b[1]) - Number(a[1])).map(([key, val]) => (
            <div key={key}>
              <div className="flex justify-between text-[10px] font-bold uppercase text-stone-400 mb-1">
                <span>{LANGUAGE_NAMES[key]}</span>
                <span>{val} pts</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-1000" 
                  style={{ width: `${(val / QUESTIONS.length) * 200}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => onComplete(scores, primaryLang)}
          className="w-full bg-stone-800 text-white py-4 rounded-2xl font-bold hover:bg-stone-900 transition-all"
        >
          Guardar y Volver al Tanque
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 max-w-lg mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Descubriendo tu Lenguaje</span>
          <span className="text-[10px] text-stone-400 font-bold">{currentIdx + 1} / {QUESTIONS.length}</span>
        </div>
        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-stone-800 mb-8 text-center serif min-h-[3rem]">
        {userName}, ¿qué te hace sentir más amado/a?
      </h3>

      <div className="space-y-4">
        {QUESTIONS[currentIdx].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt.type)}
            className="w-full text-left p-6 rounded-2xl border-2 border-stone-50 hover:border-amber-200 hover:bg-amber-50 transition-all group flex items-center gap-4 active:scale-95 transform"
          >
            <div className="w-10 h-10 rounded-full bg-stone-50 group-hover:bg-amber-200 flex items-center justify-center text-xs font-bold text-stone-300 group-hover:text-amber-700 transition-colors">
              {i === 0 ? 'A' : 'B'}
            </div>
            <span className="text-sm text-stone-700 font-medium leading-snug">{opt.text}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
             <div key={i} className={`w-1 h-1 rounded-full ${Math.floor(currentIdx/4) >= i ? 'bg-amber-400' : 'bg-stone-200'}`}></div>
          ))}
        </div>
        <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">
          Faltan {QUESTIONS.length - currentIdx - 1} preguntas
        </p>
      </div>
    </div>
  );
};
