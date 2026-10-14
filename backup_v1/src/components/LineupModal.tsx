import React, { useState } from 'react';
import { Lineup } from '../types';

interface LineupModalProps {
  lineup: Lineup | null;
  onClose: () => void;
  isFavorite: boolean;
  isLearned: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleLearned: (id: string) => void;
}

export const LineupModal: React.FC<LineupModalProps> = ({
  lineup,
  onClose,
  isFavorite,
  isLearned,
  onToggleFavorite,
  onToggleLearned,
}) => {
  const [activeImageTab, setActiveImageTab] = useState<'aim' | 'standing' | 'landing'>('aim');

  if (!lineup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-csdark-900 border border-csdark-700 rounded-t-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-csdark-900/95 backdrop-blur-md px-4 py-3 border-b border-csdark-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                lineup.side === 'T'
                  ? 'bg-amber-500/20 text-csterror border border-amber-500/30'
                  : 'bg-sky-500/20 text-csct border border-sky-500/30'
              }`}
            >
              {lineup.side}
            </span>
            <span className="text-xs font-mono text-gray-400">
              {lineup.zone === 'Mid' ? 'Мид' : `Плент ${lineup.zone}`}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-csdark-800 text-gray-400 hover:text-white flex items-center justify-center border border-csdark-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white font-tactical tracking-wide">
              {lineup.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 font-mono">
              <span>{lineup.startPosition}</span>
              <span className="text-csorange">➜</span>
              <span className="text-csorange-light">{lineup.targetPosition}</span>
            </div>
          </div>

          {/* Image Tabs */}
          <div className="space-y-2">
            <div className="flex p-1 bg-csdark-950 rounded-xl border border-csdark-800">
              <button
                onClick={() => setActiveImageTab('aim')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeImageTab === 'aim'
                    ? 'bg-csorange text-black font-bold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                1. Точка прицела
              </button>
              <button
                onClick={() => setActiveImageTab('standing')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeImageTab === 'standing'
                    ? 'bg-csorange text-black font-bold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                2. Где стоять
              </button>
              <button
                onClick={() => setActiveImageTab('landing')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeImageTab === 'landing'
                    ? 'bg-csorange text-black font-bold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                3. Результат
              </button>
            </div>

            {/* Displayed Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-csdark-950 border border-csdark-700">
              <img
                src={
                  activeImageTab === 'aim'
                    ? lineup.aimPointImg
                    : activeImageTab === 'standing'
                    ? lineup.standingPositionImg
                    : lineup.thumbnail
                }
                alt="Guide view"
                className="w-full h-full object-cover"
              />

              {/* Tactical Crosshair watermark */}
              {activeImageTab === 'aim' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 border border-csorange/60 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-csorange rounded-full animate-ping" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Technique & Execution Badge */}
          <div className="p-3 rounded-xl bg-csdark-950 border border-csdark-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-mono">
                Тип броска
              </span>
              <span className="text-sm font-bold text-csorange font-mono">
                {lineup.throwTechnique}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-mono">
                Серверный тикрейт
              </span>
              <span className="text-xs font-semibold text-emerald-400 font-mono">
                CS2 Subtick (100% точно)
              </span>
            </div>
          </div>

          {/* Description & Pro-Tip */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-mono mb-1">
                Описание гранаты
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed bg-csdark-850 p-3 rounded-xl border border-csdark-800">
                {lineup.description}
              </p>
            </div>

            {lineup.proTip && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-csorange/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-csorange mb-1 font-mono">
                  <span>💡</span>
                  <span>Совет профессионала:</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {lineup.proTip}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="sticky bottom-0 bg-csdark-900/95 backdrop-blur-md p-4 border-t border-csdark-700 flex gap-2">
          <button
            onClick={() => onToggleFavorite(lineup.id)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all border ${
              isFavorite
                ? 'bg-csorange text-black border-csorange shadow-glow-orange'
                : 'bg-csdark-800 hover:bg-csdark-700 text-gray-300 border-csdark-600'
            }`}
          >
            <span>★</span>
            <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>
          </button>

          <button
            onClick={() => onToggleLearned(lineup.id)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all border ${
              isLearned
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg'
                : 'bg-csdark-800 hover:bg-csdark-700 text-gray-300 border-csdark-600'
            }`}
          >
            <span>✓</span>
            <span>{isLearned ? 'Выучено!' : 'Отметить выученным'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
