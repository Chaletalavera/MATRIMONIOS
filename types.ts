
export enum DISCStyle {
  D = 'Dominante',
  I = 'Influyente',
  S = 'Estable',
  C = 'Cumplidor'
}

export interface LoveLanguageScores {
  words: number;
  acts: number;
  gifts: number;
  time: number;
  touch: number;
}

export interface UserProfile {
  name: string;
  partnerName: string;
  discStyle: DISCStyle;
  enneagramType: number;
  loveLanguage: string;
  partnerLoveLanguage?: string;
  yearsMarried: number;
  partnerDiscStyle?: DISCStyle;
  partnerEnneagramType?: number;
  scores?: LoveLanguageScores;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingUrls?: { uri: string; title: string }[];
}

// Guidelines: Supported values for aspectRatio are "1:1", "3:4", "4:3", "9:16", and "16:9".
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface JournalEntry {
  id: string;
  type: 'Individual' | 'Compartida';
  category: 'Reflexión' | 'Oración' | 'Gratitud' | 'Meta' | 'Pacto';
  content: string;
  verse?: string;
  author: string;
  timestamp: Date;
}

export interface SimulationTurn {
  role: 'system' | 'partner' | 'coach' | 'user';
  text: string;
}

export interface Devotional {
  reading: string;
  reflection: string;
  practicalActivity: string;
  prayerGuide: string;
  timestamp: Date;
}

export interface DailyMission {
  title: string;
  action: string;
  theology: string;
  language: string;
}
