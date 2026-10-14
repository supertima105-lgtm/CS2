import React, { useState, useEffect } from 'react';
import { Side, TacticalPlan } from '../types';
import {
  generateTacticalPlan,
  getStoredApiKey,
  setStoredApiKey,
} from '../lib/gemini';

export const AICaptainTab: React.FC = () => {
  const [side, setSide] = useState<Side>('T');
  const [playersCount, setPlayersCount] = useState<number>(5);
  const [objective, setObjective] = useState<string>('Быстрый выход на Плент A');
  const [smokes, setSmokes] = useState<number>(3);
  const [molotovs, setMolotovs] = useState<number>(2);
  const [flashes, setFlashes] = useState<number>(3);
  const [hes, setHes] = useState<number>(1);

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [tacticalPlan, setTacticalPlan] = useState<TacticalPlan | null>(null);
  const [isLiveAiGenerated, setIsLiveAiGenerated] = useState<boolean>(false);

  // API Key management
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [savedApiKey, setSavedApiKey] = useState<string>('');

  useEffect(() => {
    const key = getStoredApiKey();
    setSavedApiKey(key);
    setApiKeyInput(key);
  }, []);

  const handleSaveApiKey = () => {
    setStoredApiKey(apiKeyInput);
    setSavedApiKey(apiKeyInput.trim());
    setIsKeyModalOpen(false);
  };

  // Preset objectives for quick selection
  const presetObjectives = [
    'Быстрый выход на Плент A',
    'Занятие Мида со смоком в Окно',
    'Сплит A через Коннектор и Рампу',
    'Фейк на А с перетяжкой и рашем B',
    'Медленный дефолт (Контроль карты)',
  ];

  const handleGenerateTactics = async () => {
    setIsGenerating(true);
    setLoadingStep('🤖 Подключение к тактическому ИИ CS2...');

    // Dynamic loading messages for high-tech CS2 feel
    const timer1 = setTimeout(() => {
      setLoadingStep('🎯 Анализ волюметрических смоков и геометрии Mirage...');
    }, 600);

    const timer2 = setTimeout(() => {
      setLoadingStep('📋 Расчет ролей игроков и сабтик таймингов...');
    }, 1200);

    try {
      const result = await generateTacticalPlan({
        side,
        playersCount,
        objective,
        utility: {
          smokes,
          molotovs,
          flashes,
          hes,
        },
      });

      setTacticalPlan(result.plan);
      setIsLiveAiGenerated(result.isLiveAi);
    } catch (err) {
      console.error('Tactical generation failed:', err);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="px-4 py-2 space-y-4 max-w-2xl mx-auto">
      {/* Intro Banner + API Key Action */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-csdark-850 to-csdark-900 border border-csdark-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-csorange/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-csorange text-black uppercase tracking-wider font-mono">
              Gemini 1.5 Flash
            </span>
            <span className="text-xs text-gray-400 font-mono">
              CS2 Tactical IGL
            </span>
          </div>

          {/* API Key Modal Button */}
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border transition-all flex items-center gap-1 ${
              savedApiKey
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-csdark-800 border-csdark-600 text-gray-400 hover:text-csorange'
            }`}
          >
            <span>🔑</span>
            <span>{savedApiKey ? 'Gemini API активен' : 'Ввести API ключ'}</span>
          </button>
        </div>

        <h2 className="text-base font-bold text-white font-tactical tracking-wide uppercase">
          AI Тактический Капитан
        </h2>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          Укажите сторону, количество игроков и арсенал гранат. Нейросеть Google Gemini сгенерирует пошаговый киберспортивный план раунда на Mirage.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="p-4 rounded-2xl bg-csdark-850 border border-csdark-700/80 space-y-4">
        {/* 1. Side Selector */}
        <div>
          <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
            1. Сторона раунда
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSide('T')}
              className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                side === 'T'
                  ? 'bg-amber-500/20 text-csterror border-amber-500 shadow-glow-orange'
                  : 'bg-csdark-950 text-gray-400 border-csdark-800'
              }`}
            >
              Террористы (T - Атака)
            </button>
            <button
              onClick={() => setSide('CT')}
              className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                side === 'CT'
                  ? 'bg-sky-500/20 text-csct border-sky-500 shadow-glow-ct'
                  : 'bg-csdark-950 text-gray-400 border-csdark-800'
              }`}
            >
              Спецназ (CT - Защита)
            </button>
          </div>
        </div>

        {/* 2. Players Count Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-mono uppercase text-gray-400">
              2. Живых игроков в раунде
            </label>
            <span className="text-sm font-bold text-csorange font-mono">
              {playersCount} {playersCount === 1 ? 'игрок' : playersCount < 5 ? 'игрока' : 'игроков'}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={playersCount}
            onChange={(e) => setPlayersCount(Number(e.target.value))}
            className="w-full accent-csorange cursor-pointer"
          />
        </div>

        {/* 3. Utility / Grenades Counter */}
        <div>
          <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
            3. Закуп гранат в команде
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Smokes */}
            <div className="p-2.5 rounded-xl bg-csdark-950 border border-csdark-800 flex items-center justify-between">
              <span className="text-xs text-gray-300">💨 Смоки</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSmokes(Math.max(0, smokes - 1))}
                  className="w-6 h-6 rounded bg-csdark-800 text-gray-400 hover:text-white"
                >
                  -
                </button>
                <span className="text-xs font-mono font-bold text-white w-3 text-center">{smokes}</span>
                <button
                  onClick={() => setSmokes(Math.min(5, smokes + 1))}
                  className="w-6 h-6 rounded bg-csdark-800 text-gray-400 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Molotovs */}
            <div className="p-2.5 rounded-xl bg-csdark-950 border border-csdark-800 flex items-center justify-between">
              <span className="text-xs text-gray-300">🔥 Молотовы</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMolotovs(Math.max(0, molotovs - 1))}
                  className="w-6 h-6 rounded bg-csdark-800 text-gray-400 hover:text-white"
                >
                  -
                </button>
                <span className="text-xs font-mono font-bold text-white w-3 text-center">{molotovs}</span>
                <button
                  onClick={() => setMolotovs(Math.min(5, molotovs + 1))}
                  className="w-6 h-6 rounded bg-csdark-800 text-gray-400 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Flashes */}
            <div className="p-2.5 rounded-xl bg-csdark-950 border border-csdark-800 flex items-center justify-between">
              <span className="text-xs text-gray-300">⚡ Флешки</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFlashes(Math.max(0, flashes - 1))}
                  className="w-6 h-6 rounded bg-csdark-800 text-gray-400 hover:text-white"
                >
                  -
                </button>
                <span className="text-xs font-mono font-bold text-white w-3 text-center">{flashes}</span>
                <button
                  onClick={() => setFlashes(Math.min(5, flashes + 1))}
                  className="w-6 h-6 rounded bg-csdark-800 text-gray-400 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* HE */}
            <div className="p-2.5 rounded-xl bg-csdark-950 border border-csdark-800 flex items-center justify-between">
              <span className="text-xs text-gray-300">💣 HE</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHes(Math.max(0, hes - 1))}
                  className="w-6 h-6 rounded bg-csdark-800 text-gray-400 hover:text-white"
                >
                  -
                </button>
                <span className="text-xs font-mono font-bold text-white w-3 text-center">{hes}</span>
                <button
                  onClick={() => setHes(Math.min(5, hes + 1))}
                  className="w-6 h-6 rounded bg-csdark-800 text-gray-400 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Objective */}
        <div>
          <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
            4. Цель раунда (Стратегия)
          </label>
          <input
            type="text"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="w-full px-3 py-2 bg-csdark-950 border border-csdark-700 rounded-xl text-xs text-white focus:outline-none focus:border-csorange mb-2"
          />

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5">
            {presetObjectives.map((p) => (
              <button
                key={p}
                onClick={() => setObjective(p)}
                className={`text-[10px] px-2 py-1 rounded-lg border transition-colors ${
                  objective === p
                    ? 'bg-csorange/20 border-csorange text-csorange font-semibold'
                    : 'bg-csdark-900 border-csdark-800 text-gray-400 hover:text-gray-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateTactics}
          disabled={isGenerating}
          className="w-full py-3 bg-gradient-to-r from-csorange to-amber-600 hover:from-amber-500 hover:to-csorange text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-glow-orange active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span className="font-mono text-xs">{loadingStep || 'Генерация тактики...'}</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>Сгенерировать тактику раунда</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Tactical Plan Output */}
      {tacticalPlan && (
        <div className="p-4 rounded-2xl bg-csdark-850 border border-csorange/40 shadow-glow-orange space-y-4 animate-fade-in">
          <div className="border-b border-csdark-700 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-csorange uppercase tracking-wider font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isLiveAiGenerated ? 'Сгенерировано Google Gemini 1.5' : 'Тактический движок CS2'}
              </span>
              <span className="text-[10px] text-gray-500 font-mono">
                {tacticalPlan.zoneTarget}
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-tactical mt-1.5">
              {tacticalPlan.title}
            </h3>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed bg-csdark-950 p-2.5 rounded-xl border border-csdark-800">
              {tacticalPlan.strategySummary}
            </p>
          </div>

          {/* Player Roles Assignment */}
          <div>
            <h4 className="text-xs font-mono uppercase text-csorange font-bold mb-2">
              Распределение ролей ({tacticalPlan.playerRoles.length} игроков):
            </h4>
            <div className="space-y-2">
              {tacticalPlan.playerRoles.map((role) => (
                <div
                  key={role.playerIndex}
                  className="p-2.5 rounded-xl bg-csdark-950 border border-csdark-800 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{role.roleName}</span>
                    <span className="text-[10px] font-mono text-gray-400 bg-csdark-900 px-1.5 py-0.5 rounded border border-csdark-700">
                      {role.utilityUsed}
                    </span>
                  </div>
                  {role.lineupRecommendation && (
                    <div className="text-[11px] text-csorange font-mono mb-1 flex items-center gap-1">
                      <span>🎯</span>
                      <span>Раскидка: <strong>{role.lineupRecommendation}</strong></span>
                    </div>
                  )}
                  <p className="text-gray-300 text-[11px] leading-relaxed">
                    {role.assignment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline / Grenade Order */}
          <div>
            <h4 className="text-xs font-mono uppercase text-csorange font-bold mb-2">
              Тайминг и порядок броска гранат:
            </h4>
            <div className="space-y-2">
              {tacticalPlan.timeline.map((step, idx) => (
                <div key={idx} className="flex gap-2.5 text-xs bg-csdark-950 p-2.5 rounded-xl border border-csdark-800">
                  <span className="font-mono text-csorange font-bold flex-shrink-0 text-[11px]">
                    [{step.timing}]
                  </span>
                  <div>
                    <span className="font-bold text-white block text-[11px]">{step.title}</span>
                    <span className="text-gray-400 text-[11px]">{step.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contingency Tip */}
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs">
            <span className="font-bold text-rose-400 block mb-0.5 font-mono">
              План «Б» (Контр-меры против поджима):
            </span>
            <p className="text-gray-300 text-[11px]">
              {tacticalPlan.contingencyTip}
            </p>
          </div>
        </div>
      )}

      {/* API Key Configuration Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-sm bg-csdark-900 border border-csdark-700 rounded-2xl p-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsKeyModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <div className="w-10 h-10 rounded-xl bg-csorange/10 border border-csorange/30 text-csorange flex items-center justify-center mx-auto mb-2">
                🔑
              </div>
              <h3 className="text-base font-bold text-white font-tactical uppercase">
                Google Gemini API
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Подключение нейросети для живой генерации тактик
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                  API Ключ (Gemini Key)
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 bg-csdark-950 border border-csdark-700 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-csorange font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSaveApiKey}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-csorange to-amber-600 text-black font-bold text-xs uppercase tracking-wider shadow-glow-orange active:scale-95"
                >
                  Сохранить ключ
                </button>
                {savedApiKey && (
                  <button
                    onClick={() => {
                      setStoredApiKey('');
                      setSavedApiKey('');
                      setApiKeyInput('');
                    }}
                    className="px-3 py-2.5 rounded-xl bg-csdark-800 text-rose-400 border border-csdark-700 text-xs font-semibold hover:bg-csdark-700"
                  >
                    Сбросить
                  </button>
                )}
              </div>

              <p className="text-[10px] text-gray-500 text-center font-mono">
                Ключ сохраняется в вашем браузере (LocalStorage) или файле <code>.env</code>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
