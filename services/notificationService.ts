
import { GoogleGenAI } from "@google/genai";
import { UserProfile } from '../types';

export const notificationService = {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones de escritorio');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  async scheduleDailyReminder(profile: UserProfile) {
    if (Notification.permission !== 'granted') return;

    // Calcular cuánto falta para las 6:00 AM
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(6, 0, 0, 0);

    // Si ya pasaron las 6 AM hoy, programar para mañana
    if (now > scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();

    console.log(`Notificación programada en ${Math.round(delay / 1000 / 60)} minutos (a las 6:00 AM)`);

    setTimeout(async () => {
      await this.sendEmotionalTankNotification(profile);
      // Re-programar para el día siguiente tras enviar
      this.scheduleDailyReminder(profile);
    }, delay);
  },

  async sendEmotionalTankNotification(profile: UserProfile) {
    if (!profile.partnerLoveLanguage) return;

    try {
      // Fixed: Always use import {GoogleGenAI} from "@google/genai" and create a new instance right before use.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Genera un mensaje de notificación de máximo 10 palabras para un esposo/a. El objetivo es llenar el tanque de su cónyuge (${profile.partnerName}) cuyo lenguaje es ${profile.partnerLoveLanguage}. Debe ser una acción pequeña y práctica para hoy.`
      });

      const text = response.text || `¡Hoy es un gran día para amar a ${profile.partnerName}!`;

      new Notification("Alianza: Misión de Amor", {
        body: text,
        icon: '/favicon.ico', // Asumiendo que existe un icono
        badge: '/favicon.ico',
        tag: 'daily-mission'
      });
    } catch (error) {
      console.error("Error al enviar notificación:", error);
    }
  },

  async testNotification(profile: UserProfile) {
    if (Notification.permission === 'granted') {
      await this.sendEmotionalTankNotification(profile);
    } else {
      const granted = await this.requestPermission();
      if (granted) await this.sendEmotionalTankNotification(profile);
    }
  }
};
