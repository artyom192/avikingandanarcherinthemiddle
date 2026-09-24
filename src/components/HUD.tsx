import React from 'react';
import { Warrior, GameMode } from '../game/types';
import { ASSET_PATHS, WARRIOR_CONFIGS } from '../game/constants';
import { Volume2, VolumeX, Shield, Zap, Sparkles, Swords, Palette } from 'lucide-react';
import { sound } from '../game/sound';

interface HUDProps {
  p1: Warrior;
  p2: Warrior;
  mode: GameMode;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenControls: () => void;
  onOpenModeSelect: () => void;
  onOpenCustomize?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  p1,
  p2,
  mode,
  isMuted,
  onToggleMute,
  onOpenControls,
  onOpenModeSelect,
  onOpenCustomize,
}) => {
  const p1Portrait = p1.type === 'axe' ? ASSET_PATHS.axePortrait : ASSET_PATHS.archerPortrait;
  const p2Portrait = p2.type === 'axe' ? ASSET_PATHS.axePortrait : ASSET_PATHS.archerPortrait;

  const p1HpPercent = Math.max(0, Math.min(100, (p1.hp / p1.maxHp) * 100));
  const p2HpPercent = Math.max(0, Math.min(100, (p2.hp / p2.maxHp) * 100));

  return (
    <div className="w-full select-none pointer-events-none px-3 pt-3 pb-1">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
        
        {/* --- PLAYER 1 (LEFT) --- */}
        <div className="flex-1 flex items-center gap-3">
          {/* Portrait with level badge */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-3 border-amber-400 shadow-lg bg-slate-800">
              <img
                src={p1Portrait}
                alt={p1.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {mode === 'pve' ? (
              <div className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full border-2 border-white shadow-lg flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>ВЫ</span>
              </div>
            ) : (
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full border border-white shadow">
                1P
              </div>
            )}
          </div>

          {/* Name & Health Bar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-bold text-base sm:text-lg text-white drop-shadow-md truncate">
                  {p1.name}
                </span>
                {mode === 'pve' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/60 font-black text-[11px] tracking-wide shrink-0 shadow-sm">
                    ВЫ
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-black text-amber-300 ml-2 font-mono shrink-0">
                {p1.hp}/{p1.maxHp} HP
              </span>
            </div>

            {/* Health Bar Frame */}
            <div className="relative h-5 sm:h-6 bg-slate-900/80 rounded-xl overflow-hidden p-0.5 border border-slate-700/80 shadow-inner">
              <div
                className="h-full rounded-lg transition-all duration-200 ease-out bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 shadow-md"
                style={{ width: `${p1HpPercent}%` }}
              />
              {p1.shieldActive && (
                <div className="absolute inset-0 bg-cyan-400/30 animate-pulse flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase text-cyan-200 tracking-wider">
                    Щит активен
                  </span>
                </div>
              )}
            </div>

            {/* Abilities & Cooldowns */}
            <div className="flex items-center gap-2 mt-1.5">
              {p1.type === 'axe' ? (
                <>
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
                    <Swords className="w-3.5 h-3.5 text-amber-400" />
                    <span>Удар топором:</span>
                    <span className="font-bold text-amber-300">F</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
                    <Zap className="w-3.5 h-3.5 text-orange-400" />
                    <span>Волна:</span>
                    <span className="font-bold text-orange-300">G</span>
                    {p1.cooldowns.special > 0 && (
                      <span className="text-orange-400 font-mono text-[10px]">
                        ({p1.cooldowns.special.toFixed(1)}s)
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Лук:</span>
                    <span className="font-bold text-cyan-300">F</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
                    <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>Посох:</span>
                    <span className="font-bold text-fuchsia-300">G</span>
                    {p1.cooldowns.special > 0 && (
                      <span className="text-fuchsia-400 font-mono text-[10px]">
                        ({p1.cooldowns.special.toFixed(1)}s)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
                    <Shield className="w-3.5 h-3.5 text-sky-400" />
                    <span>Щит:</span>
                    <span className="font-bold text-sky-300">H</span>
                    {p1.cooldowns.shield !== undefined && p1.cooldowns.shield > 0 && (
                      <span className="text-sky-400 font-mono text-[10px]">
                        ({p1.cooldowns.shield.toFixed(1)}s)
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* --- CENTER BANNER & CONTROLS --- */}
        <div className="flex flex-col items-center shrink-0 pointer-events-auto px-1">
          {/* Animated VS Emblem */}
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-white shadow-lg flex items-center justify-center">
              <span className="font-black text-slate-950 text-sm sm:text-base tracking-tighter italic">
                VS
              </span>
            </div>
          </div>

          {/* Quick buttons */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow transition-colors"
              title={isMuted ? 'Включить звук' : 'Выключить звук'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            {onOpenCustomize && (
              <button
                onClick={onOpenCustomize}
                className="px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow text-xs font-semibold transition-colors flex items-center gap-1"
                title="Изменить цвета арены и скины бойцов"
              >
                <Palette className="w-3.5 h-3.5 text-fuchsia-400" />
                <span className="hidden sm:inline">Стили</span>
              </button>
            )}
            <button
              onClick={onOpenControls}
              className="px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow text-xs font-semibold transition-colors"
            >
              Управление
            </button>
            <button
              onClick={onOpenModeSelect}
              className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow text-xs transition-colors"
            >
              {mode === 'pve' ? 'Против Бота' : '1 на 1 (PvP)'}
            </button>
          </div>
        </div>

        {/* --- PLAYER 2 (RIGHT) --- */}
        <div className="flex-1 flex items-center flex-row-reverse gap-3">
          {/* Portrait */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-3 border-cyan-400 shadow-lg bg-slate-800">
              <img
                src={p2Portrait}
                alt={p2.name}
                className="w-full h-full object-cover scale-x-[-1]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -left-1 bg-cyan-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full border border-white shadow">
              {mode === 'pve' ? 'БОТ' : '2P'}
            </div>
          </div>

          {/* Name & Health Bar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-1 flex-row-reverse">
              <div className="flex items-center gap-1.5 min-w-0 flex-row-reverse">
                <span className="font-bold text-base sm:text-lg text-white drop-shadow-md truncate">
                  {p2.name}
                </span>
                {mode === 'pve' && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-bold text-[11px] tracking-wide shrink-0">
                    БОТ
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-black text-cyan-300 mr-2 font-mono shrink-0">
                {p2.hp}/{p2.maxHp} HP
              </span>
            </div>

            {/* Health Bar Frame */}
            <div className="relative h-5 sm:h-6 bg-slate-900/80 rounded-xl overflow-hidden p-0.5 border border-slate-700/80 shadow-inner">
              <div
                className="h-full ml-auto rounded-lg transition-all duration-200 ease-out bg-gradient-to-l from-red-600 via-amber-500 to-cyan-400 shadow-md"
                style={{ width: `${p2HpPercent}%` }}
              />
              {p2.shieldActive && (
                <div className="absolute inset-0 bg-cyan-400/30 animate-pulse flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase text-cyan-200 tracking-wider">
                    Щит активен
                  </span>
                </div>
              )}
            </div>

            {/* Abilities & Cooldowns */}
            <div className="flex items-center justify-end gap-2 mt-1.5">
              {p2.type === 'archer' ? (
                <>
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Лук:</span>
                    <span className="font-bold text-cyan-300">{mode === 'pvp' ? 'K' : 'Авто'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
                    <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>Посох:</span>
                    <span className="font-bold text-fuchsia-300">{mode === 'pvp' ? 'L' : 'Авто'}</span>
                    {p2.cooldowns.special > 0 && (
                      <span className="text-fuchsia-400 font-mono text-[10px]">
                        ({p2.cooldowns.special.toFixed(1)}s)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
                    <Shield className="w-3.5 h-3.5 text-sky-400" />
                    <span>Щит:</span>
                    <span className="font-bold text-sky-300">{mode === 'pvp' ? 'I' : 'Авто'}</span>
                    {p2.cooldowns.shield !== undefined && p2.cooldowns.shield > 0 && (
                      <span className="text-sky-400 font-mono text-[10px]">
                        ({p2.cooldowns.shield.toFixed(1)}s)
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
                    <Swords className="w-3.5 h-3.5 text-amber-400" />
                    <span>Топор:</span>
                    <span className="font-bold text-amber-300">{mode === 'pvp' ? 'K' : 'Авто'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
                    <Zap className="w-3.5 h-3.5 text-orange-400" />
                    <span>Волна:</span>
                    <span className="font-bold text-orange-300">{mode === 'pvp' ? 'L' : 'Авто'}</span>
                    {p2.cooldowns.special > 0 && (
                      <span className="text-orange-400 font-mono text-[10px]">
                        ({p2.cooldowns.special.toFixed(1)}s)
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
