
import React, { useState } from 'react';
import { UserProfile, DISCStyle } from '../types';

interface Props {
  onSave: (profile: UserProfile) => void;
  currentProfile: UserProfile | null;
}

export const ProfileSetup: React.FC<Props> = ({ onSave, currentProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(currentProfile || {
    name: '',
    partnerName: '',
    discStyle: DISCStyle.S,
    enneagramType: 1,
    loveLanguage: 'Palabras de Afirmación',
    partnerLoveLanguage: 'Tiempo de Calidad',
    yearsMarried: 0,
    partnerDiscStyle: DISCStyle.D,
    partnerEnneagramType: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.partnerName) {
      onSave(formData);
    }
  };

  const LOVE_LANGUAGES = [
    'Palabras de Afirmación',
    'Tiempo de Calidad',
    'Actos de Servicio',
    'Regalos',
    'Contacto Físico'
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-stone-50">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl serif font-bold text-stone-800">Configuración de Alianza</h2>
          <p className="text-sm text-stone-500 italic">Define los perfiles de ambos para una mentoría precisa.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          {/* Tu Información */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest border-b pb-1">Tú</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase">Nombre</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-stone-50 rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-amber-100" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase">Años Casados</label>
                <input type="number" value={formData.yearsMarried} onChange={(e) => setFormData({ ...formData, yearsMarried: parseInt(e.target.value) })} className="w-full bg-stone-50 rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-amber-100" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase">Tu Lenguaje del Amor</label>
              <select value={formData.loveLanguage} onChange={(e) => setFormData({ ...formData, loveLanguage: e.target.value })} className="w-full bg-stone-50 rounded-lg px-3 py-2 text-sm border-none">
                {LOVE_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <p className="text-[9px] text-stone-400 italic">Recomendamos hacer el test en la pestaña "Tanque".</p>
            </div>
          </div>

          {/* Información Cónyuge */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest border-b pb-1">Tu Cónyuge</h3>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase">Nombre del Cónyuge</label>
              <input required type="text" value={formData.partnerName} onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })} className="w-full bg-stone-50 rounded-lg px-3 py-2 text-sm border-none focus:ring-2 focus:ring-amber-100" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase">Su Lenguaje del Amor</label>
              <select value={formData.partnerLoveLanguage} onChange={(e) => setFormData({ ...formData, partnerLoveLanguage: e.target.value })} className="w-full bg-stone-50 rounded-lg px-3 py-2 text-sm border-none">
                {LOVE_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-stone-800 text-white py-4 rounded-2xl font-bold hover:bg-stone-900 transition-all shadow-xl shadow-stone-200">
            Actualizar Alianza
          </button>
        </form>
      </div>
    </div>
  );
};
