
import React, { useState, useEffect } from 'react';
import { JournalEntry, UserProfile } from '../types';
import { gemini } from '../services/geminiService';

interface Props {
  profile: UserProfile | null;
}

export const Journal: React.FC<Props> = ({ profile }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newContent, setNewContent] = useState('');
  const [entryType, setEntryType] = useState<'Individual' | 'Compartida'>('Individual');
  const [category, setCategory] = useState<JournalEntry['category']>('Reflexión');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('alianza_journal');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const handleSave = async () => {
    if (!newContent.trim() || isSaving) return;
    setIsSaving(true);

    try {
      const verse = await gemini.getVerseForEntry(newContent);
      const entry: JournalEntry = {
        id: Date.now().toString(),
        content: newContent,
        type: entryType,
        category,
        verse: verse || '',
        author: profile?.name || 'Usuario',
        timestamp: new Date()
      };

      const updated = [entry, ...entries];
      setEntries(updated);
      localStorage.setItem('alianza_journal', JSON.stringify(updated));
      setNewContent('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto bg-stone-50">
      <div className="text-center">
        <h2 className="text-2xl serif font-bold text-stone-800">Diario de Pacto</h2>
        <p className="text-sm text-stone-500 italic">Un espacio para la desnudez emocional y la gratitud.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
        <div className="flex gap-2">
          {(['Individual', 'Compartida'] as const).map(t => (
            <button
              key={t}
              onClick={() => setEntryType(t)}
              className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${
                entryType === t ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {t === 'Individual' ? 'Solo Yo' : 'Compartida'}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {(['Reflexión', 'Oración', 'Gratitud', 'Meta', 'Pacto'] as const).map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-now8rap px-4 py-2 text-[10px] font-bold uppercase rounded-full border transition-all ${
                category === c ? 'border-amber-600 text-amber-700 bg-amber-50' : 'border-stone-200 text-stone-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder={`Escribe tu ${category.toLowerCase()} aquí...`}
          className="w-full bg-stone-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-200 h-32 border-none resize-none"
        />

        <button
          onClick={handleSave}
          disabled={!newContent.trim() || isSaving}
          className="w-full bg-stone-800 text-white py-3 rounded-xl font-bold hover:bg-stone-900 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Vinculando con la Palabra...' : 'Guardar en el Diario'}
        </button>
      </div>

      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 relative group">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                entry.type === 'Compartida' ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-600'
              }`}>
                {entry.category} • {entry.type}
              </span>
              <span className="text-[10px] text-stone-400">
                {new Date(entry.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-stone-800 leading-relaxed mb-3">{entry.content}</p>
            {entry.verse && (
              <div className="mt-2 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                <p className="text-xs italic text-amber-900 leading-tight">"{entry.verse}"</p>
              </div>
            )}
            <div className="mt-3 text-[9px] text-stone-300 font-bold uppercase tracking-widest">Escrito por {entry.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
