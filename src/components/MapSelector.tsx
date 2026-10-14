import React from 'react';
import { MapItem, MapId } from '../types';

interface MapSelectorProps {
  maps: MapItem[];
  selectedMap: MapId;
  onSelectMap: (mapId: MapId) => void;
}

export const MapSelector: React.FC<MapSelectorProps> = ({
  maps,
  selectedMap,
  onSelectMap,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Соревновательный Маппул
        </h2>
        <span className="text-[11px] text-gray-500 font-mono">
          MVP: Mirage (CS2)
        </span>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none snap-x snap-mandatory">
        {maps.map((map) => {
          const isActive = map.id === selectedMap;
          const isAvailable = map.status === 'active';

          return (
            <button
              key={map.id}
              disabled={!isAvailable}
              onClick={() => isAvailable && onSelectMap(map.id)}
              className={`relative flex-shrink-0 w-36 h-24 rounded-xl overflow-hidden text-left snap-start transition-all duration-200 group ${
                isActive
                  ? 'ring-2 ring-csorange shadow-glow-orange scale-[1.02]'
                  : isAvailable
                  ? 'ring-1 ring-csdark-700 hover:ring-csdark-600 opacity-90'
                  : 'ring-1 ring-csdark-800 opacity-45 cursor-not-allowed'
              }`}
            >
              {/* Map Background Image */}
              <img
                src={map.image}
                alt={map.name}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  !isAvailable ? 'grayscale contrast-75' : ''
                }`}
              />

              {/* Gradient Dark Overlay */}
              <div
                className={`absolute inset-0 ${
                  isActive
                    ? 'bg-gradient-to-t from-black via-black/60 to-transparent'
                    : 'bg-gradient-to-t from-black/90 via-black/75 to-black/30'
                }`}
              />

              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                {isAvailable ? (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-csorange/90 text-black tracking-wider uppercase">
                    CS2 Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-csdark-950/80 text-gray-400 border border-csdark-700 uppercase">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Скоро
                  </span>
                )}
              </div>

              {/* Map Titles & Count */}
              <div className="absolute bottom-2 left-2.5 right-2">
                <p className="text-sm font-bold text-white font-tactical tracking-wide uppercase leading-tight drop-shadow">
                  {map.name}
                </p>
                <p className="text-[10px] text-gray-300 font-mono">
                  {isAvailable ? `${map.lineupCount} раскидок` : 'В разработке'}
                </p>
              </div>

              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-csorange to-amber-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
