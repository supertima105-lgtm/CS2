import React from 'react';

interface HeaderProps {
  userEmail: string | null;
  isAuthenticated: boolean;
  isSyncing: boolean;
  onOpenAuth: () => void;
  onSignOut: () => void;
  activeTab: 'lineups' | 'ai-captain';
  setActiveTab: (tab: 'lineups' | 'ai-captain') => void;
}

export const Header: React.FC<HeaderProps> = ({
  userEmail,
  isAuthenticated,
  isSyncing,
  onOpenAuth,
  onSignOut,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-csdark-900/95 backdrop-blur-md border-b border-csdark-700">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top Bar: Brand + Auth */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* CS2 Tactical Logo Icon */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-csorange to-amber-600 flex items-center justify-center shadow-glow-orange flex-shrink-0">
              <span className="font-bold text-black font-tactical text-lg tracking-wider">CS2</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-wider uppercase text-white font-tactical leading-none">
                  Tactics Lab
                </h1>
                <span className="text-[10px] font-semibold bg-csorange/20 text-csorange border border-csorange/40 px-1.5 py-0.5 rounded tracking-widest uppercase font-mono">
                  SUBTICK
                </span>
              </div>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest">
                Справочник раскидок & AI
              </p>
            </div>
          </div>

          {/* Profile / Supabase Auth Button */}
          <div className="flex items-center gap-2">
            {isSyncing && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-csorange">
                <span className="w-1.5 h-1.5 rounded-full bg-csorange animate-ping" />
                Синхронизация...
              </span>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-medium text-gray-200 truncate max-w-[130px]">{userEmail}</p>
                  <p className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Supabase Cloud
                  </p>
                </div>
                <button
                  onClick={onSignOut}
                  className="px-3 py-1.5 rounded-lg bg-csdark-800 hover:bg-csdark-700 border border-csdark-600 text-xs text-gray-300 hover:text-white transition-colors"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-csorange to-amber-600 hover:from-amber-500 hover:to-csorange text-black font-semibold text-xs tracking-wide shadow-glow-orange transition-all active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Войти</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mt-3 p-1 bg-csdark-950 rounded-xl border border-csdark-700/80">
          <button
            onClick={() => setActiveTab('lineups')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'lineups'
                ? 'bg-csdark-800 text-csorange shadow-sm border border-csorange/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>Карта и Раскидки</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-captain')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'ai-captain'
                ? 'bg-csdark-800 text-csorange shadow-sm border border-csorange/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-csorange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-csorange"></span>
            </span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>AI Тактик (Gemini)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
