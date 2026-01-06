
import React, { useState, useEffect } from 'react';
import { UserProfile, DailyMission } from '../types';
import { gemini } from '../services/geminiService';
import { LoveLanguageTest } from './LoveLanguageTest';
import { notificationService } from '../services/notificationService';

interface Props {
  profile: UserProfile | null;
  onUpdateProfile: (p: UserProfile) => void;
}

const LOVE_LANGUAGES = [
  'Palabras de Afirmación',
  'Tiempo de Calidad',
  'Actos de Servicio',
  'Regalos',
  'Contacto Físico'
];

export const EmotionalTank: React.FC<Props> = ({ profile, onUpdateProfile }) => {
  const [testTarget, setTestTarget] = useState<'self' | 'partner' | null>(null);
  const [mission, setMission] = useState<DailyMission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingPartner, setIsEditingPartner] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if (profile?.partnerLoveLanguage) {
      fetchMission();
    }
    setNotificationsEnabled(Notification.permission === 'granted');
  }, [profile?.partnerLoveLanguage]);

  const fetchMission = async () => {
    if (!profile?.partnerLoveLanguage || isLoading) return;
    setIsLoading(true);
    try {
      const data = await gemini.getDailyMission(profile.partnerName, profile.partnerLoveLanguage);
      setMission(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNotifications = async () => {
    if (notificationsEnabled) {
      alert("Para desactivar las notificaciones, por favor usa la configuración de tu navegador.");
      return;
    }
    
    const granted = await notificationService.requestPermission();
    if (granted && profile) {
      setNotificationsEnabled(true);
      notificationService.scheduleDailyReminder(profile);
      alert("¡Listo! Recibirás un recordatorio cada mañana a las 6:00 AM.");
    }
  };

  const handleTestNotification = () => {
    if (profile) notificationService.testNotification(profile);
  };

  const handleTestComplete = (scores: any, primary: string) => {
    if (profile) {
      const updatedProfile = { ...profile };
      if (testTarget === 'self') {
        updatedProfile.loveLanguage = primary;
        updatedProfile.scores = scores;
      } else {
        updatedProfile.partnerLoveLanguage = primary;
      }
      onUpdateProfile(updatedProfile);
    }
    setTestTarget(null);
  };

  if (testTarget) {
    return (
      <div className="p-6 overflow-y-auto h-full bg-stone-50">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={() => setTestTarget(null)} 
            className="mb-6 flex items-center gap-2 text-xs font-bold text-stone-400 uppercase hover:text-stone-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver al Tanque
          </button>
          <LoveLanguageTest 
            userName={testTarget === 'self' ? profile?.name || 'Tú' : profile?.partnerName || 'Tu Cónyuge'} 
            onComplete={handleTestComplete} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-stone-50">
      <div className="text-center space-y-2">
        <h2 className="text-2xl serif font-bold text-stone-800">Sincronización de Amor</h2>
        <p className="text-sm text-stone-500 italic">Entendiendo cómo dar y recibir amor en el pacto.</p>
      </div>

      {/* Recordatorios a las 6:00 AM */}
      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-800">Recordatorio de las 6:00 AM</h4>
            <p className="text-[10px] text-stone-500">Recibe una misión diaria en tu teléfono para amar a {profile?.partnerName}.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {notificationsEnabled && (
            <button 
              onClick={handleTestNotification}
              className="p-2 text-amber-600 hover:bg-amber-100 rounded-full transition-colors"
              title="Probar notificación"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
            </button>
          )}
          <button 
            onClick={handleToggleNotifications}
            className={`w-12 h-6 rounded-full transition-all relative ${notificationsEnabled ? 'bg-amber-600' : 'bg-stone-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notificationsEnabled ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>
      </div>

      {/* Grid de Lenguajes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mi Perfil */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Tu Lenguaje</span>
            </div>
            <h3 className="text-lg font-bold text-stone-800 leading-tight">
              {profile?.loveLanguage || 'Pendiente de Test'}
            </h3>
            <p className="text-[10px] text-stone-500 mt-1">
              Esto es lo que {profile?.partnerName} necesita saber para llenar tu tanque.
            </p>
          </div>
          <button 
            onClick={() => setTestTarget('self')}
            className="w-full bg-stone-50 text-stone-600 py-3 rounded-2xl text-[10px] font-bold uppercase hover:bg-amber-50 hover:text-amber-700 transition-all border border-stone-100"
          >
            {profile?.loveLanguage ? 'Repetir mi Test' : 'Descubrir mi Lenguaje'}
          </button>
        </div>

        {/* Perfil del Cónyuge */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Lenguaje de {profile?.partnerName}</span>
            </div>
            <h3 className="text-lg font-bold text-stone-800 leading-tight">
              {profile?.partnerLoveLanguage || 'Pendiente de Definir'}
            </h3>
            <p className="text-[10px] text-stone-500 mt-1">
              Esto es lo que tú necesitas saber para amar intencionalmente a {profile?.partnerName}.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setTestTarget('partner')}
              className="flex-1 bg-stone-800 text-white py-3 rounded-2xl text-[10px] font-bold uppercase hover:bg-stone-900 transition-all shadow-md"
            >
              Realizar Test por {profile?.partnerName}
            </button>
            <button 
              onClick={() => setIsEditingPartner(!isEditingPartner)}
              className="p-3 bg-stone-100 text-stone-500 rounded-2xl hover:bg-stone-200"
              title="Seleccionar manualmente"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
          </div>
        </div>
      </div>

      {isEditingPartner && (
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 animate-in slide-in-from-top-2 duration-300">
          <p className="text-[10px] font-bold text-amber-800 uppercase mb-3">Selecciona el lenguaje de {profile?.partnerName}:</p>
          <div className="flex flex-wrap gap-2">
            {LOVE_LANGUAGES.map(lang => (
              <button 
                key={lang}
                onClick={() => updatePartnerLanguage(lang)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  profile?.partnerLoveLanguage === lang ? 'bg-amber-600 text-white' : 'bg-white text-stone-600 hover:border-amber-400 border border-stone-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* El Tanque de mi Cónyuge - Área de Acción */}
      <div className="bg-stone-800 p-8 rounded-3xl shadow-xl text-white space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
        </div>

        <div className="flex justify-between items-start relative z-10">
          <div>
            <h3 className="text-xl serif font-bold">Misión para {profile?.partnerName}</h3>
            <p className="text-stone-400 text-xs uppercase tracking-widest mt-1">Actuar en: {profile?.partnerLoveLanguage || 'Define su lenguaje'}</p>
          </div>
          <div className="bg-amber-500 p-3 rounded-full shadow-lg shadow-amber-900/50">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
          </div>
        </div>

        {!profile?.partnerLoveLanguage ? (
          <div className="bg-stone-700/50 p-6 rounded-2xl text-center border border-dashed border-stone-600 relative z-10">
            <p className="text-sm text-stone-300">Completa el test de {profile?.partnerName} para recibir misiones diarias personalizadas.</p>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            <div className="bg-white/10 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest block mb-2">Instrucción del Mentor</span>
              {isLoading ? (
                <div className="animate-pulse flex space-y-3 flex-col">
                  <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  <div className="h-3 bg-white/20 rounded w-full"></div>
                </div>
              ) : mission ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h4 className="font-bold text-lg leading-tight text-amber-50">{mission.title}</h4>
                  <p className="text-sm text-stone-200 leading-relaxed italic border-l-2 border-amber-500 pl-3">"{mission.action}"</p>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-[10px] text-stone-400 font-medium leading-relaxed">
                      <span className="font-bold uppercase text-amber-500 mr-1">Teología del Amor:</span> {mission.theology}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <button onClick={fetchMission} className="text-xs text-amber-400 font-bold uppercase hover:underline">Obtener Nueva Misión</button>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => {
                alert(`¡Excelente! Has amado a ${profile?.partnerName} con intención hoy.`);
                fetchMission();
              }}
              className="w-full bg-amber-600 text-white py-4 rounded-2xl text-xs font-bold uppercase hover:bg-amber-700 transition-all shadow-lg shadow-amber-900/40 active:scale-95"
            >
              He llenado su tanque hoy
            </button>
          </div>
        )}
      </div>

      {/* Recordatorios de Intencionalidad */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 shadow-sm group hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">Conexión</span>
          <p className="text-xs font-bold text-blue-900 mt-1">15 min de charla sin pantallas</p>
        </div>
        <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100 shadow-sm group hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-rose-200 transition-colors">
            <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <span className="text-[9px] font-bold text-rose-400 uppercase tracking-tighter">Cercanía</span>
          <p className="text-xs font-bold text-rose-900 mt-1">Abrazo intencional (20s)</p>
        </div>
      </div>
    </div>
  );

  function updatePartnerLanguage(lang: string) {
    if (profile) {
      onUpdateProfile({ ...profile, partnerLoveLanguage: lang });
    }
    setIsEditingPartner(false);
  }
};
