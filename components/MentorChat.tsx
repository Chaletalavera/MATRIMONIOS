
import React, { useState, useRef, useEffect } from 'react';
import { Message, UserProfile } from '../types';
import { gemini } from '../services/geminiService';

interface Props {
  profile: UserProfile | null;
}

export const MentorChat: React.FC<Props> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: '¡Hola! Soy tu Mentor Matrimonial. Estoy aquí para acompañarte en este viaje sagrado. ¿En qué puedo ayudarte hoy a fortalecer tu pacto?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await gemini.getMentorAdvice(input, history);
      
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: new Date(),
        groundingUrls: response.groundingUrls
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Lo siento, hubo un error al conectar con la sabiduría celestial. Por favor intenta de nuevo.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
              m.role === 'user' 
                ? 'bg-amber-100 text-amber-900 rounded-tr-none' 
                : 'bg-white text-stone-800 rounded-tl-none border border-stone-100'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed text-sm">
                {m.text}
              </div>
              {m.groundingUrls && m.groundingUrls.length > 0 && (
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <p className="text-[10px] font-bold text-stone-400 uppercase mb-2">Fuentes y Referencias:</p>
                  <ul className="space-y-1">
                    {m.groundingUrls.map((url, i) => (
                      <li key={i}>
                        <a 
                          href={url.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          {url.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="text-[10px] mt-2 text-stone-400 text-right italic">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              <span className="text-xs text-stone-400 ml-1">Buscando guía bíblica...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-stone-100 flex gap-2 items-end">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Escribe aquí tu situación o duda..."
          className="flex-1 bg-stone-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none max-h-32"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="bg-amber-600 text-white p-3 rounded-xl hover:bg-amber-700 disabled:opacity-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </div>
    </div>
  );
};
