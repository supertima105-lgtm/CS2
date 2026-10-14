import React from 'react';

interface MirageRadarProps {
  selectedTeam: 'T' | 'CT';
  onSwitchTeam: () => void;
  onBack: () => void;
}

export const MirageRadar: React.FC<MirageRadarProps> = ({
  selectedTeam,
  onSwitchTeam,
  onBack,
}) => {
  return (
    <div className="space-y-3 animate-fade-in w-full flex flex-col items-center">
      {/* Header bar on Map Screen */}
      <div className="w-full flex items-center justify-between pb-1">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white dark:bg-csdark-900 hover:bg-slate-200 dark:hover:bg-csdark-850 border border-slate-300 dark:border-csdark-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-csorange transition-all flex items-center gap-2 active:scale-95 shadow-sm"
        >
          <span>⬅</span>
          <span className="font-mono uppercase tracking-wider">К картам</span>
        </button>

        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold uppercase font-tactical text-slate-900 dark:text-white tracking-widest">
            MIRAGE
          </h2>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase border ${
              selectedTeam === 'T'
                ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400'
                : 'bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-400'
            }`}
          >
            {selectedTeam === 'T' ? 'T - Атака' : 'CT - Защита'}
          </span>
        </div>

        {/* Quick Team Toggle button */}
        <button
          onClick={onSwitchTeam}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
            selectedTeam === 'T'
              ? 'bg-amber-500/15 border-amber-500/60 text-amber-600 dark:text-csterror hover:bg-amber-500/25'
              : 'bg-sky-500/15 border-sky-500/60 text-sky-600 dark:text-csct hover:bg-sky-500/25'
          }`}
        >
          <span>⇄</span>
          <span>Сменить на {selectedTeam === 'T' ? 'CT' : 'T'}</span>
        </button>
      </div>

      {/* Large clean map image */}
      <div className="w-full flex items-center justify-center">
        <img
          src="/media/mirage_radar.jpg"
          alt="Карта Mirage"
          className="w-full max-h-[82vh] object-contain rounded-2xl drop-shadow-[0_0_40px_rgba(0,0,0,0.85)]"
        />
      </div>
    </div>
  );
};
