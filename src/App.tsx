import React, { useState } from 'react';
import { Header } from './components/Header';
import { MirageRadar } from './components/MirageRadar';
import { AICaptainTab } from './components/AICaptainTab';
import { useAuth } from './context/AuthContext';
import { useUserLineups } from './hooks/useUserLineups';

export const App: React.FC = () => {
  const { user, signOut } = useAuth();
  const { isSyncing } = useUserLineups();

  // Screens: 'select-map' (default upon entry) | 'map-view'
  const [currentScreen, setCurrentScreen] = useState<'select-map' | 'map-view'>('select-map');
  const [activeTab, setActiveTab] = useState<'lineups' | 'ai-captain'>('lineups');
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  // Map Pool in 2 Columns (as in CS2)
  const MAP_COLUMNS = [
    [
      { id: 'mirage', name: 'MIRAGE', active: true, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80', badge: 'ДОСТУПНО' },
      { id: 'inferno', name: 'INFERNO', active: false, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80', badge: 'В РАЗРАБОТКЕ' },
      { id: 'nuke', name: 'NUKE', active: false, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', badge: 'В РАЗРАБОТКЕ' },
      { id: 'dust2', name: 'DUST II', active: false, image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', badge: 'В РАЗРАБОТКЕ' },
    ],
    [
      { id: 'ancient', name: 'ANCIENT', active: false, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', badge: 'В РАЗРАБОТКЕ' },
      { id: 'anubis', name: 'ANUBIS', active: false, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80', badge: 'В РАЗРАБОТКЕ' },
      { id: 'vertigo', name: 'VERTIGO', active: false, image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80', badge: 'В РАЗРАБОТКЕ' },
      { id: 'overpass', name: 'OVERPASS', active: false, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80', badge: 'В РАЗРАБОТКЕ' },
    ]
  ];

  const handleSelectMap = (map: { id: string; name: string; active: boolean }) => {
    if (!map.active) {
      setLockedNotice(`Карта ${map.name} в разработке. Доступен Mirage!`);
      setTimeout(() => setLockedNotice(null), 3000);
      return;
    }
    setCurrentScreen('map-view');
  };

  return (
    <div className="min-h-screen bg-csdark-950 text-gray-100 flex flex-col font-sans pb-10">
      {/* Header */}
      <Header
        userEmail={user?.email ?? null}
        isAuthenticated={Boolean(user)}
        isSyncing={isSyncing}
        onOpenAuth={() => {}}
        onSignOut={signOut}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col justify-center">
        {activeTab === 'ai-captain' ? (
          <AICaptainTab />
        ) : currentScreen === 'select-map' ? (
          /* 1. Map Selection Screen (2 Columns) */
          <div className="space-y-5 animate-fade-in py-2">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-csorange/10 border border-csorange/30 text-csorange text-xs font-mono font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-csorange animate-ping" />
                CS2 MAP POOL SELECTION
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-tactical tracking-wider">
                ВЫБЕРИТЕ КАРТУ
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Выберите карту соревновательного пула (2 колонки CS2)
              </p>
            </div>

            {lockedNotice && (
              <div className="max-w-md mx-auto p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs text-center font-mono">
                🔒 {lockedNotice}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3.5 max-w-2xl mx-auto">
              <div className="space-y-3">
                {MAP_COLUMNS[0].map((map) => (
                  <button
                    key={map.id}
                    onClick={() => handleSelectMap(map)}
                    className={`w-full text-left relative rounded-2xl overflow-hidden transition-all duration-200 border h-28 ${
                      map.active
                        ? 'border-csorange ring-1 ring-csorange/50 shadow-glow-orange hover:scale-[1.02] cursor-pointer'
                        : 'border-csdark-800 opacity-50 grayscale cursor-not-allowed'
                    }`}
                  >
                    <img src={map.image} alt={map.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono ${map.active ? 'bg-csorange text-black' : 'bg-black/80 text-gray-400'}`}>
                        {map.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-3">
                      <h3 className="text-base font-extrabold text-white uppercase font-tactical">{map.name}</h3>
                      <p className="text-[11px] font-mono text-gray-300">{map.active ? 'Нажмите для входа ➜' : 'Скоро в пуле'}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {MAP_COLUMNS[1].map((map) => (
                  <button
                    key={map.id}
                    onClick={() => handleSelectMap(map)}
                    className="w-full text-left relative rounded-2xl overflow-hidden border border-csdark-800 opacity-50 grayscale cursor-not-allowed h-28"
                  >
                    <img src={map.image} alt={map.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono bg-black/80 text-gray-400">
                        {map.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-3">
                      <h3 className="text-base font-extrabold text-white uppercase font-tactical">{map.name}</h3>
                      <p className="text-[11px] font-mono text-gray-300">Скоро в пуле</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* 2. Mirage Radar Screen */
          <MirageRadar onBack={() => setCurrentScreen('select-map')} />
        )}
      </main>
    </div>
  );
};

export default App;
