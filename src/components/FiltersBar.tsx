import React from 'react';
import { FilterState, Zone, Side, GrenadeType } from '../types';

interface FiltersBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  setFilters,
  totalMatches,
}) => {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const zones: Array<{ id: 'all' | Zone; label: string }> = [
    { id: 'all', label: 'Все зоны' },
    { id: 'A', label: 'Плент A' },
    { id: 'Mid', label: 'Мид' },
    { id: 'B', label: 'Плент B' },
  ];

  const sides: Array<{ id: 'all' | Side; label: string; colorClass?: string }> = [
    { id: 'all', label: 'Все стороны' },
    { id: 'T', label: 'T (Атака)', colorClass: 'text-csterror' },
    { id: 'CT', label: 'CT (Защита)', colorClass: 'text-csct' },
  ];

  const grenades: Array<{ id: 'all' | GrenadeType; label: string; icon: string }> = [
    { id: 'all', label: 'Все гранаты', icon: '🎯' },
    { id: 'smoke', label: 'Смок', icon: '💨' },
    { id: 'molotov', label: 'Молотов', icon: '🔥' },
    { id: 'flash', label: 'Флеш', icon: '⚡' },
    { id: 'he', label: 'HE Осколочная', icon: '💣' },
  ];

  return (
    <div className="px-4 space-y-3">
      {/* Search Bar + Quick Stat */}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          placeholder="Поиск по точке, спавну (окно, коннектор, яма)..."
          className="w-full pl-9 pr-24 py-2 bg-csdark-950 border border-csdark-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-csorange transition-colors"
        />
        <div className="absolute right-2 px-2 py-0.5 rounded bg-csdark-800 text-[10px] font-mono text-gray-400 border border-csdark-700">
          {totalMatches} шт.
        </div>
      </div>

      {/* Row 1: Side Switcher (T / CT) + Quick Toggles (Favorites / Learned) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* Sides */}
        <div className="flex bg-csdark-950 p-1 rounded-xl border border-csdark-700/80">
          {sides.map((s) => {
            const isSelected = filters.selectedSide === s.id;
            return (
              <button
                key={s.id}
                onClick={() => updateFilter('selectedSide', s.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isSelected
                    ? s.id === 'T'
                      ? 'bg-amber-500/20 text-csterror border border-amber-500/50 shadow-sm'
                      : s.id === 'CT'
                      ? 'bg-sky-500/20 text-csct border border-sky-500/50 shadow-sm'
                      : 'bg-csdark-700 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Favorites and Learned Quick Toggles */}
        <button
          onClick={() => updateFilter('onlyFavorites', !filters.onlyFavorites)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
            filters.onlyFavorites
              ? 'bg-amber-500/20 border-csorange text-csorange'
              : 'bg-csdark-950 border-csdark-700 text-gray-400 hover:text-gray-300'
          }`}
        >
          <span>★</span>
          <span>Избранное</span>
        </button>

        <button
          onClick={() => updateFilter('onlyLearned', !filters.onlyLearned)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
            filters.onlyLearned
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
              : 'bg-csdark-950 border-csdark-700 text-gray-400 hover:text-gray-300'
          }`}
        >
          <span>✓</span>
          <span>Выучено</span>
        </button>
      </div>

      {/* Row 2: Zones (A, Mid, B) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1">
          Зона:
        </span>
        {zones.map((z) => {
          const isSelected = filters.selectedZone === z.id;
          return (
            <button
              key={z.id}
              onClick={() => updateFilter('selectedZone', z.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                isSelected
                  ? 'bg-csorange text-black font-bold shadow-glow-orange'
                  : 'bg-csdark-800 text-gray-300 border border-csdark-700 hover:bg-csdark-700'
              }`}
            >
              {z.label}
            </button>
          );
        })}
      </div>

      {/* Row 3: Grenade Types Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1">
          Тип:
        </span>
        {grenades.map((g) => {
          const isSelected = filters.selectedGrenade === g.id;
          return (
            <button
              key={g.id}
              onClick={() => updateFilter('selectedGrenade', g.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-csdark-700 text-white border border-csorange/70'
                  : 'bg-csdark-900 text-gray-400 border border-csdark-800 hover:text-gray-300'
              }`}
            >
              <span>{g.icon}</span>
              <span>{g.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
