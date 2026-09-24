import React from 'react';
import { GameEngine } from '../game/engine';
import { ArrowLeft, ArrowRight, ArrowUp, Swords, Zap, Wand2, Shield } from 'lucide-react';

interface TouchControlsProps {
  engine: GameEngine;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ engine }) => {
  const p1 = engine.p1;
  if (!p1) return null;

  const handleTouchStart = (key: string) => {
    engine.handleKeyDown(key);
  };

  const handleTouchEnd = (key: string) => {
    engine.handleKeyUp(key);
  };

  return (
    <div className="absolute inset-x-0 bottom-3 px-4 flex justify-between items-end pointer-events-none select-none z-20">
      {/* Left side: Movement D-Pad */}
      <div className="flex flex-col items-start gap-1 pointer-events-auto">
        <div className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[10px] shadow border border-white">
          ВЫ: {p1.name}
        </div>
        <div className="flex items-center gap-2">
          <button
            onPointerDown={() => handleTouchStart('KeyA')}
            onPointerUp={() => handleTouchEnd('KeyA')}
            onPointerLeave={() => handleTouchEnd('KeyA')}
            className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-slate-900/80 active:bg-amber-500 active:text-slate-950 text-white border-2 border-slate-700/80 shadow-lg flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-7 h-7" />
          </button>

          <button
            onPointerDown={() => handleTouchStart('KeyD')}
            onPointerUp={() => handleTouchEnd('KeyD')}
            onPointerLeave={() => handleTouchEnd('KeyD')}
            className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-slate-900/80 active:bg-amber-500 active:text-slate-950 text-white border-2 border-slate-700/80 shadow-lg flex items-center justify-center transition-colors"
          >
            <ArrowRight className="w-7 h-7" />
          </button>

          <button
            onPointerDown={() => handleTouchStart('KeyW')}
            onPointerUp={() => handleTouchEnd('KeyW')}
            onPointerLeave={() => handleTouchEnd('KeyW')}
            className="w-13 h-13 sm:w-15 sm:h-15 ml-2 rounded-2xl bg-slate-900/80 active:bg-amber-500 active:text-slate-950 text-white border-2 border-slate-700/80 shadow-lg flex items-center justify-center transition-colors"
          >
            <ArrowUp className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Primary Attack */}
        <button
          onPointerDown={() => handleTouchStart('KeyF')}
          onPointerUp={() => handleTouchEnd('KeyF')}
          onPointerLeave={() => handleTouchEnd('KeyF')}
          className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-amber-500 active:bg-amber-400 text-slate-950 border-2 border-white shadow-lg flex flex-col items-center justify-center font-black text-xs transition-colors"
        >
          {p1.type === 'axe' ? <Swords className="w-6 h-6" /> : <Zap className="w-6 h-6 text-slate-950" />}
          <span className="text-[10px] mt-0.5">{p1.type === 'axe' ? 'Топор' : 'Лук'}</span>
        </button>

        {/* Special Ability */}
        <button
          onPointerDown={() => handleTouchStart('KeyG')}
          onPointerUp={() => handleTouchEnd('KeyG')}
          onPointerLeave={() => handleTouchEnd('KeyG')}
          className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-orange-600 active:bg-orange-500 text-white border-2 border-amber-300 shadow-lg flex flex-col items-center justify-center font-black text-xs transition-colors"
        >
          {p1.type === 'axe' ? <Zap className="w-6 h-6" /> : <Wand2 className="w-6 h-6" />}
          <span className="text-[10px] mt-0.5">{p1.type === 'axe' ? 'Волна' : 'Посох'}</span>
        </button>

        {/* Shield (if Archer) */}
        {p1.type === 'archer' && (
          <button
            onPointerDown={() => handleTouchStart('KeyH')}
            onPointerUp={() => handleTouchEnd('KeyH')}
            onPointerLeave={() => handleTouchEnd('KeyH')}
            className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-cyan-600 active:bg-cyan-500 text-white border-2 border-cyan-200 shadow-lg flex flex-col items-center justify-center font-black text-xs transition-colors"
          >
            <Shield className="w-6 h-6" />
            <span className="text-[10px] mt-0.5">Щит</span>
          </button>
        )}
      </div>
    </div>
  );
};
