
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MENTOR_SYSTEM_INSTRUCTION, SIMULATOR_INSTRUCTION, DEVOTIONAL_SYSTEM_INSTRUCTION } from "../constants";
import { AspectRatio, UserProfile, Devotional, DailyMission } from "../types";

/**
 * Augmented window interface for AI Studio key selection.
 * Consolidating declaration in global scope to resolve conflict with platform types.
 */
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    // Fixed: All declarations of 'aistudio' must have identical modifiers. Removed readonly to match platform definition.
    aistudio: AIStudio;
  }
}

export class GeminiService {
  // Helper to ensure a new GoogleGenAI instance is used for every call per guidelines
  private async executeCall<T>(fn: (ai: GoogleGenAI) => Promise<T>): Promise<T> {
    // Guidelines: Always use process.env.API_KEY directly when initializing the client.
    // Create a new instance right before making an API call to ensure it uses the most up-to-date key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      return await fn(ai);
    } catch (error: any) {
      // Handle the case where a user-selected key from AI Studio is invalid or missing
      if (error.message?.includes("Requested entity was not found") && window.aistudio?.openSelectKey) {
        await window.aistudio.openSelectKey();
      }
      throw error;
    }
  }

  async getMentorAdvice(message: string, history: { role: 'user' | 'model', text: string }[]) {
    return this.executeCall(async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: MENTOR_SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }]
        }
      });

      return {
        text: response.text || "Lo siento, no pude procesar tu solicitud en este momento.",
        groundingUrls: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
          uri: chunk.web?.uri || '',
          title: chunk.web?.title || 'Fuente'
        })).filter((c: any) => c.uri) || []
      };
    });
  }

  async getDailyMission(partnerName: string, partnerLanguage: string): Promise<DailyMission> {
    return this.executeCall(async (ai) => {
      const prompt = `Genera una misión diaria para un esposo/a cuyo cónyuge se llama ${partnerName} y su lenguaje del amor es ${partnerLanguage}. 
      La misión debe ser práctica, basada en la gracia y con una breve base teológica.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              action: { type: Type.STRING },
              theology: { type: Type.STRING },
              language: { type: Type.STRING }
            },
            required: ['title', 'action', 'theology', 'language']
          }
        }
      });
      return JSON.parse(response.text || '{}');
    });
  }

  async getSimulationTurn(prompt: string, profile: UserProfile, history: any[]) {
    return this.executeCall(async (ai) => {
      const context = `
        Usuario: ${profile.name} (DISC: ${profile.discStyle}, Eneagrama: ${profile.enneagramType})
        Cónyuge a simular: ${profile.partnerName} (DISC: ${profile.partnerDiscStyle}, Eneagrama: ${profile.partnerEnneagramType})
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          { role: 'user', parts: [{ text: `CONTEXTO DEL PACTO:\n${context}\n\nMENSAJE DEL USUARIO: ${prompt}` }] },
          ...history.map(h => ({ role: h.role === 'partner' ? 'model' : 'user', parts: [{ text: h.text }] }))
        ],
        config: {
          systemInstruction: SIMULATOR_INSTRUCTION
        }
      });
      return response.text;
    });
  }

  async getDailyDevotional(profile: UserProfile): Promise<Devotional> {
    return this.executeCall(async (ai) => {
      const context = `Usuario: ${profile.name}, Cónyuge: ${profile.partnerName}, Lenguaje de Amor: ${profile.loveLanguage}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Genera un devocional para: ${context}`,
        config: {
          systemInstruction: DEVOTIONAL_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reading: { type: Type.STRING, description: 'Cita y texto bíblico' },
              reflection: { type: Type.STRING, description: 'Reflexión Eclesiastés 4:12' },
              practicalActivity: { type: Type.STRING, description: 'Actividad basada en lenguaje del amor' },
              prayerGuide: { type: Type.STRING, description: 'Instrucciones para la oración mutua' }
            },
            required: ['reading', 'reflection', 'practicalActivity', 'prayerGuide']
          }
        }
      });
      
      const data = JSON.parse(response.text || '{}');
      return {
        ...data,
        timestamp: new Date()
      };
    });
  }

  async getVerseForEntry(content: string) {
    return this.executeCall(async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Sugiere un versículo bíblico corto y relevante para esta entrada de diario matrimonial: "${content}". Solo devuelve la cita y el texto del versículo.`,
      });
      return response.text;
    });
  }

  async generateVisionImage(prompt: string, aspectRatio: AspectRatio) {
    return this.executeCall(async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `A beautiful Christian marriage symbolic image: ${prompt}. High quality, cinematic lighting, peaceful atmosphere.` }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: "1K"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
      throw new Error("No image data found in response");
    });
  }

  async editMarriageImage(base64Image: string, editPrompt: string) {
    return this.executeCall(async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image.split(',')[1],
                mimeType: 'image/png'
              }
            },
            { text: editPrompt }
          ]
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
      throw new Error("No image data found in response");
    });
  }
}

export const gemini = new GeminiService();
