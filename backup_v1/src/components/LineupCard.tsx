import React from 'react';
import { Lineup } from '../types';

interface LineupCardProps {
  lineup: Lineup;
  isFavorite: boolean;
  isLearned: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onToggleLearned: (id: string, e: React.MouseEvent) => void;
  onClick: () => void;
}

export const LineupCard: React.FC<LineupCardProps> = ({
  lineup,
  isFavorite,
  isLearned,
  onToggleFavorite,
  onToggleLearned,
  onClick,
}) => {
  // Color configuration by grenade type
  const grenadeBadgeConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
    smoke: { label: 'Смок', bg: 'bg-slate-700/80', text: 'text-slate-200', icon: '💨' },
    molotov: { label: 'Молотов', bg: 'bg-amber-950/80', text: 'text-amber-400', icon: '🔥' },
    flash: { label: 'Флеш', bg: 'bg-yellow-950/80', text: 'text-yellow-300', icon: '⚡' },
    he: { label: 'HE Осколочная', bg: 'bg-emerald-950/80', text: 'text-emerald-400', icon: '💣' },
  };

  const grenadeInfo = grenadeBadgeConfig[lineup.grenadeType] || {
    label: lineup.grenadeType,
    bg: 'bg-gray-800',
    text: 'text-gray-200',
    icon: '🎯',
  };

  // Difficulty colors
  const difficultyConfig = {
    easy: { label: 'Легко', text: 'text-emerald-400' },
    medium: { label: 'Средне', text: 'text-amber-400' },
    hard: { label: 'Сложно', text: 'text-rose-400' },
  };

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl bg-csdark-850 border transition-all duration-200 overflow-hidden cursor-pointer active:scale-[0.99] hover:border-csorange/50 ${
        isLearned
          ? 'border-emerald-500/40'
          : isFavorite
          ? 'border-csorange/40'
          : 'border-csdark-700/80'
      }`}
    >
      {/* Top Media Preview Section */}
      <div className="relative h-36 w-full overflow-hidden bg-csdark-950">
        <img
          src={lineup.thumbnail}
          alt={lineup.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-csdark-850 via-csdark-850/40 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          {/* Side Badge */}
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
              lineup.side === 'T'
                ? 'bg-amber-500/20 text-csterror border-amber-500/40'
                : 'bg-sky-500/20 text-csct border-sky-500/40'
            }`}
          >
            {lineup.side}
          </span>

          {/* Grenade Type Badge */}
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border border-csdark-600 ${grenadeInfo.bg} ${grenadeInfo.text}`}
          >
            <span>{grenadeInfo.icon}</span>
            <span>{grenadeInfo.label}</span>
          </span>

          {/* Zone Badge */}
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-csdark-900/90 text-gray-300 border border-csdark-700">
            {lineup.zone === 'Mid' ? 'Мид' : `Плент ${lineup.zone}`}
          </span>
        </div>

        {/* Action Buttons: Favorite and Learned */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {/* Favorite Toggle Button */}
          <button
            onClick={(e) => onToggleFavorite(lineup.id, e)}
            title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all backdrop-blur-md ${
              isFavorite
                ? 'bg-csorange text-black font-bold shadow-glow-orange scale-105'
                : 'bg-csdark-900/80 text-gray-400 hover:text-white border border-csdark-700'
            }`}
          >
            ★
          </button>

          {/* Learned Toggle Button */}
          <button
            onClick={(e) => onToggleLearned(lineup.id, e)}
            title={isLearned ? 'Отметить как не выучено' : 'Выучено!'}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all backdrop-blur-md ${
              isLearned
                ? 'bg-emerald-500 text-black font-bold shadow-lg scale-105'
                : 'bg-csdark-900/80 text-gray-400 hover:text-white border border-csdark-700'
            }`}
          >
            ✓
          </button>
        </div>

        {/* Bottom overlay: Throw Technique Badge */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/85 text-csorange border border-csorange/30 text-[10px] font-mono font-semibold uppercase">
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {lineup.throwTechnique}
          </span>

          <span className="text-[10px] font-mono text-gray-400">
            {difficultyConfig[lineup.difficulty].label}
          </span>
        </div>
      </div>

      {/* Card Content & Trajectory */}
      <div className="p-3.5 space-y-2">
        <h3 className="text-sm font-bold text-white font-tactical tracking-wide group-hover:text-csorange transition-colors line-clamp-1">
          {lineup.title}
        </h3>

        {/* Tactical Positions Trajectory */}
        <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono bg-csdark-950/70 p-2 rounded-lg border border-csdark-800">
          <div className="flex-1 truncate">
            <span className="text-[9px] text-gray-500 block uppercase">Позиция</span>
            <span className="text-gray-200 font-medium">{lineup.startPosition}</span>
          </div>

          <div className="text-csorange px-1 flex-shrink-0">
            ➜
          </div>

          <div className="flex-1 truncate text-right">
            <span className="text-[9px] text-gray-500 block uppercase">Куда падает</span>
            <span className="text-csorange-light font-medium">{lineup.targetPosition}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {lineup.description}
        </p>

        {/* Footer Meta */}
        <div className="pt-2 flex items-center justify-between border-t border-csdark-800 text-[11px]">
          <span className="text-gray-500 font-mono">
            Subtick CS2
          </span>
          <span className="text-csorange font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Смотреть прицел ➜
          </span>
        </div>
      </div>
    </div>
  );
};
