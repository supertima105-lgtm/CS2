import React, { useState } from 'react';
import { MIRAGE_LINEUPS } from '../data/mockData';
import { Lineup } from '../types';

interface MirageRadarProps {
  selectedTeam: 'T' | 'CT';
  onSwitchTeam: () => void;
  onBack: () => void;
}

const GRENADE_TYPES = [
  { id: 'smoke', label: 'Смок', icon: '/media/smoke.png' },
  { id: 'molotov', label: 'Молотов', icon: '/media/molotov.png' },
  { id: 'flash', label: 'Флеш', icon: '/media/flash.png' },
  { id: 'he', label: 'Осколочная', icon: '/media/he.png' },
];

export const MirageRadar: React.FC<MirageRadarProps> = ({
  selectedTeam,
  onSwitchTeam,
  onBack,
}) => {
  const [selectedGrenade, setSelectedGrenade] = useState<string>('all');
  const [selectedLineup, setSelectedLineup] = useState<Lineup | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  const filteredLineups = MIRAGE_LINEUPS.filter((l) => {
    if (l.side !== selectedTeam) return false;
    if (selectedGrenade !== 'all' && l.grenadeType !== selectedGrenade) return false;
    return true;
  });

  const steps = selectedLineup
    ? [
        {
          id: 'pos',
          number: 1,
          title: 'Куда становиться',
          badge: 'Позиция',
          desc: 'Встаньте в упор к мусорному баку в углу на Т-спавне (на отметку на земле у мусорки).',
          img: selectedLineup.standingPositionImg,
        },
        {
          id: 'aim',
          number: 2,
          title: 'Куда целиться',
          badge: 'Прицел',
          desc: 'Наведите прицел на верхнюю часть темного узора ковра на балконе (ровно по метке).',
          img: selectedLineup.aimPointImg,
        },
        {
          id: 'res',
          number: 3,
          title: 'Результат',
          badge: 'Приземление',
          desc: 'Выполните бросок в прыжке (Jumpthrow). Дым раскрывается строго в арке коннектора без щелей.',
          img: selectedLineup.landingImg || selectedLineup.thumbnail,
        },
      ]
    : [];

  return (
    <div className="space-y-4 animate-fade-in w-full flex flex-col items-center">
      {/* Controls Bar on Map Screen */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#14151b] border border-slate-200 dark:border-[#232530] px-4 py-3 rounded-xl shadow-sm">
        {/* Left: Back button & Team pill */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1c24] dark:hover:bg-[#232530] border border-slate-200 dark:border-[#2a2c38] text-xs font-medium text-slate-700 dark:text-zinc-300 transition-colors flex items-center gap-1 active:scale-95"
          >
            <span>←</span>
            <span>К картам</span>
          </button>

          <span className="text-base font-bold text-slate-900 dark:text-white">
            Mirage
          </span>

          <button
            onClick={onSwitchTeam}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex items-center gap-1 transition-all ${
              selectedTeam === 'T'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400'
            }`}
          >
            <span>{selectedTeam === 'T' ? 'T-Side (Атака)' : 'CT-Side (Защита)'}</span>
            <span className="opacity-60 text-[10px]">⇄</span>
          </button>
        </div>

        {/* Grenade Filter Icon Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setSelectedGrenade('all')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              selectedGrenade === 'all'
                ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'border-slate-200 dark:border-[#232530] text-slate-500 hover:border-slate-400 dark:hover:border-zinc-500'
            }`}
          >
            Все
          </button>
          {GRENADE_TYPES.map((g) => {
            const isSelected = selectedGrenade === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGrenade((prev) => (prev === g.id ? 'all' : g.id))}
                title={isSelected ? `${g.label} (активно — нажмите чтобы сбросить)` : g.label}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-150 border ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/30 scale-105 shadow-sm'
                    : 'border-slate-200 dark:border-[#232530] bg-white dark:bg-[#14151b] opacity-60 hover:opacity-100 hover:border-slate-400 dark:hover:border-zinc-500'
                }`}
              >
                <img
                  src={g.icon}
                  alt={g.label}
                  className={`w-5 h-5 sm:w-6 sm:h-6 object-contain pointer-events-none transition-transform ${
                    isSelected ? 'scale-110' : ''
                  } invert dark:invert-0`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* LINEUPS LIST CARDS (GRID) */}
      <div className="w-full">
        {filteredLineups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLineups.map((lineup) => (
              <div
                key={lineup.id}
                onClick={() => {
                  setSelectedLineup(lineup);
                  setActiveStep(0);
                }}
                className="group rounded-xl overflow-hidden border border-slate-200 dark:border-[#232530] bg-white dark:bg-[#14151b] hover:border-amber-500/80 dark:hover:border-amber-500/70 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col"
              >
                {/* Thumbnail Preview */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={lineup.thumbnail}
                    alt={lineup.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5 shadow-sm">
                      <img
                        src={`/media/${lineup.grenadeType}.png`}
                        alt=""
                        className="w-3.5 h-3.5 object-contain"
                      />
                      <span>Смок</span>
                    </span>
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        lineup.side === 'T' ? 'bg-amber-500 text-black' : 'bg-sky-400 text-black'
                      }`}
                    >
                      {lineup.side === 'T' ? 'T-Side' : 'CT-Side'}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/30">
                      {lineup.throwTechnique}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-black/75 backdrop-blur-sm text-zinc-300 flex items-center gap-1">
                      <span>📷</span>
                      <span>3 фото</span>
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                      {lineup.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {lineup.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-[#232530] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
                      <span>{lineup.startPosition}</span>
                      <span className="text-amber-500">→</span>
                      <span className="text-amber-500 font-semibold">{lineup.targetPosition}</span>
                    </div>
                    <span className="text-xs font-semibold text-amber-500 group-hover:translate-x-0.5 transition-transform">
                      Открыть →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 dark:border-[#232530] text-slate-400 dark:text-zinc-500 text-xs">
            <p className="text-base font-semibold text-slate-700 dark:text-zinc-300">
              Раскидки для выбранных фильтров пока не добавлены
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              Переключите сторону (T / CT) или выберите другой тип гранаты.
            </p>
          </div>
        )}
      </div>

      {/* 3-PHOTO DETAIL MODAL */}
      {selectedLineup && steps.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedLineup(null)}
        >
          <div
            className="w-full max-w-3xl bg-white dark:bg-[#14151b] border border-slate-200 dark:border-[#232530] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-[#232530] bg-slate-50 dark:bg-[#0c0d10]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center p-1">
                  <img
                    src={`/media/${selectedLineup.grenadeType}.png`}
                    alt=""
                    className="w-5 h-5 object-contain invert dark:invert-0"
                  />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {selectedLineup.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
                    <span>Mirage</span>
                    <span>•</span>
                    <span className="text-amber-500 font-medium">{selectedLineup.throwTechnique}</span>
                    <span>•</span>
                    <span>{selectedLineup.startPosition} → {selectedLineup.targetPosition}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedLineup(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-[#232530] flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 3 Step Tabs Switcher */}
            <div className="px-4 sm:px-6 pt-3 pb-2 flex gap-2 border-b border-slate-200 dark:border-[#232530] bg-slate-100/50 dark:bg-[#0c0d10]/50">
              {steps.map((st, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={st.id}
                    onClick={() => setActiveStep(idx)}
                    className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      isActive
                        ? 'bg-amber-500 text-black shadow-sm font-bold'
                        : 'bg-white dark:bg-[#14151b] border border-slate-200 dark:border-[#232530] text-slate-600 dark:text-zinc-400 hover:border-amber-500/50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                        isActive
                          ? 'bg-black text-amber-500'
                          : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                      }`}
                    >
                      {st.number}
                    </span>
                    <span className="truncate">{st.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Photo Viewport */}
            <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
              <img
                src={steps[activeStep].img}
                alt={steps[activeStep].title}
                className="w-full h-full object-contain select-none"
              />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/30">
                  Шаг {activeStep + 1} из 3: {steps[activeStep].badge}
                </span>
              </div>

              {activeStep > 0 && (
                <button
                  onClick={() => setActiveStep((prev) => prev - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 flex items-center justify-center text-lg"
                >
                  ‹
                </button>
              )}

              {activeStep < steps.length - 1 && (
                <button
                  onClick={() => setActiveStep((prev) => prev + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 flex items-center justify-center text-lg"
                >
                  ›
                </button>
              )}
            </div>

            {/* Caption & Mini filmstrip */}
            <div className="p-4 sm:p-5 bg-white dark:bg-[#14151b] space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold text-sm shrink-0">
                  {activeStep + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {steps[activeStep].title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 mt-0.5 leading-relaxed">
                    {steps[activeStep].desc}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-[#232530]">
                {steps.map((st, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setActiveStep(idx)}
                      className={`relative rounded-lg overflow-hidden border text-left aspect-video transition-all ${
                        isActive
                          ? 'border-amber-500 ring-2 ring-amber-500/40 scale-[1.02]'
                          : 'border-slate-200 dark:border-[#232530] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={st.img} alt={st.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[10px] font-bold text-white truncate leading-tight">
                          {idx + 1}. {st.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
