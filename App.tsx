
import React, { useState, useEffect } from 'react';
import { MentorChat } from './components/MentorChat';
import { VisionBoard } from './components/VisionBoard';
import { ProfileSetup } from './components/ProfileSetup';
import { Journal } from './components/Journal';
import { Simulator } from './components/Simulator';
import { Devotional } from './components/Devotional';
import { EmotionalTank } from './components/EmotionalTank';
import { IntroSplash } from './components/IntroSplash';
import { UserProfile } from './types';
import { notificationService } from './services/notificationService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'journal' | 'simulator' | 'devotional' | 'vision' | 'profile' | 'tank'>('chat');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const savedProfile = localStorage.getItem('alianza_profile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      // Iniciar recordatorios si ya hay perfil
      notificationService.scheduleDailyReminder(parsedProfile);
    } else {
      setActiveTab('profile');
    }
  }, []);

  const handleProfileSave = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('alianza_profile', JSON.stringify(newProfile));
    // Re-programar recordatorios con el nuevo perfil
    notificationService.scheduleDailyReminder(newProfile);
    if (activeTab === 'profile') setActiveTab('chat');
  };

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto bg-white shadow-xl relative">
      {showIntro && <IntroSplash onComplete={() => setShowIntro(false)} />}
      
      <header className="bg-stone-800 text-white p-5 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl serif font-bold tracking-tight text-white">Alianza</h1>
            <p className="text-[9px] text-stone-400 uppercase tracking-widest">Pacto Sagrado Matrimonial</p>
          </div>
          {profile && (
            <div className="text-right">
              <p className="text-xs font-medium text-amber-400">{profile.name} & {profile.partnerName}</p>
              <p className="text-[9px] text-stone-500 uppercase">{profile.yearsMarried} años unidos</p>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col bg-[#fcfaf7]">
        {activeTab === 'chat' && <MentorChat profile={profile} />}
        {activeTab === 'journal' && <Journal profile={profile} />}
        {activeTab === 'simulator' && <Simulator profile={profile} />}
        {activeTab === 'devotional' && <Devotional profile={profile} />}
        {activeTab === 'vision' && <VisionBoard />}
        {activeTab === 'tank' && <EmotionalTank profile={profile} onUpdateProfile={handleProfileSave} />}
        {activeTab === 'profile' && <ProfileSetup onSave={handleProfileSave} currentProfile={profile} />}
      </main>

      <nav className="bg-white border-t border-stone-100 p-2 grid grid-cols-7 gap-0.5 sticky bottom-0">
        {[
          { id: 'chat', label: 'Mentor', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
          { id: 'tank', label: 'Tanque', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
          { id: 'devotional', label: 'Pacto', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
          { id: 'journal', label: 'Diario', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
          { id: 'simulator', label: 'Simular', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          { id: 'vision', label: 'Visión', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
          { id: 'profile', label: 'Perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === item.id ? 'text-amber-700 bg-amber-50' : 'text-stone-400 hover:bg-stone-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
            <span className="text-[6px] mt-1 font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
