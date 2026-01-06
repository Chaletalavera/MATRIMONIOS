
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';
import { ASPECT_RATIOS } from '../constants';
import { AspectRatio } from '../types';

export const VisionBoard: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    // MANDATORY: Check for selected API key when using gemini-3-pro-image-preview
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
      // Assume success after triggering key selection to avoid race conditions per guidelines
    }

    setIsLoading(true);
    try {
      const url = await gemini.generateVisionImage(prompt, aspectRatio);
      setGeneratedImage(url);
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert("Error al generar la imagen. Intenta con un prompt diferente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editPrompt.trim() || !generatedImage || isLoading) return;
    setIsLoading(true);
    try {
      const url = await gemini.editMarriageImage(generatedImage, editPrompt);
      setGeneratedImage(url);
      setEditPrompt('');
    } catch (error) {
      console.error(error);
      alert("Error al editar la imagen.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setGeneratedImage(event.target?.result as string);
        setEditMode(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl serif font-bold text-stone-800">Muro de Visión Matrimonial</h2>
        <p className="text-sm text-stone-500 italic">Visualiza el futuro que Dios tiene para tu pacto.</p>
      </div>

      {!generatedImage ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Descripción de la Visión</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Caminando de la mano por un sendero iluminado, reflejando paz y propósito espiritual..."
              className="w-full bg-stone-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 h-24"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Relación de Aspecto</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.value}
                  onClick={() => setAspectRatio(ar.value as AspectRatio)}
                  className={`text-[10px] p-2 rounded-lg border transition-all ${
                    aspectRatio === ar.value 
                      ? 'bg-amber-600 border-amber-600 text-white font-bold' 
                      : 'bg-white border-stone-200 text-stone-500 hover:border-amber-400'
                  }`}
                >
                  {ar.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="w-full bg-stone-800 text-white py-4 rounded-xl font-bold hover:bg-stone-900 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Manifestando Visión...' : 'Generar Imagen de Visión'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-stone-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-stone-400 font-bold">O sube una foto real</span></div>
          </div>

          <label className="block w-full border-2 border-dashed border-stone-200 p-8 rounded-2xl text-center cursor-pointer hover:border-amber-400 transition-colors group">
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            <svg className="w-10 h-10 text-stone-300 mx-auto mb-2 group-hover:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            <span className="text-sm font-medium text-stone-400">Seleccionar imagen para editar</span>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-stone-900 border-4 border-white">
            <img src={generatedImage} alt="Visión Matrimonial" className="w-full h-auto" />
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-sm font-bold uppercase tracking-widest">Transformando imagen...</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-stone-800 uppercase">Edición con Inteligencia Espiritual</h3>
              <button 
                onClick={() => setGeneratedImage(null)}
                className="text-xs text-stone-400 hover:text-red-500 font-bold uppercase"
              >
                Nueva Imagen
              </button>
            </div>
            
            <p className="text-xs text-stone-500 mb-4">Usa comandos como: "Añade un filtro retro", "Pon un versículo de fondo", "Hazlo más luminoso", "Elimina el fondo".</p>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="¿Qué cambio deseas realizar?"
                className="flex-1 bg-stone-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
              <button
                onClick={handleEdit}
                disabled={!editPrompt.trim() || isLoading}
                className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
      <p className="text-[10px] text-stone-400 text-center mt-4">
        Users must select a API key from a paid GCP project. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-600">Billing Documentation</a>
      </p>
    </div>
  );
};
