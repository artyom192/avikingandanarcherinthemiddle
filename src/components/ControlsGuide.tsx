import React from 'react';
import { X, Swords, Wand2, Shield, ArrowUp, ArrowRight, Zap } from 'lucide-react';
import { ASSET_PATHS } from '../game/constants';

interface ControlsGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlsGuide: React.FC<ControlsGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-black text-amber-400 mb-1 flex items-center gap-2">
          <Swords className="w-6 h-6 text-amber-400" />
          <span>Руководство по управлению</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          Сражайся один против умного бота или вдвоём на одной клавиатуре!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Warrior 1: Axe Warrior */}
          <div className="bg-slate-800/80 border border-amber-500/40 rounded-2xl p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-900">
                <img
                  src={ASSET_PATHS.axePortrait}
                  alt="Воин с топором"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-black text-white text-base">Воин с топором</h3>
                <span className="text-xs text-amber-400 font-semibold">Тяжелый ближний бой (120 HP)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg">
                <span className="text-slate-400">Перемещение:</span>
                <span className="font-mono font-bold text-amber-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  A / D
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg">
                <span className="text-slate-400">Прыжок:</span>
                <span className="font-mono font-bold text-amber-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  W / Пробел
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg">
                <span className="flex items-center gap-1.5 text-amber-200">
                  <Swords className="w-3.5 h-3.5 text-amber-400" />
                  Удар топором (14 урона):
                </span>
                <span className="font-mono font-bold text-amber-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  F
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg">
                <span className="flex items-center gap-1.5 text-orange-200">
                  <Zap className="w-3.5 h-3.5 text-orange-400" />
                  Удар по земле / Волна (26 урона):
                </span>
                <span className="font-mono font-bold text-orange-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  G
                </span>
              </div>
            </div>
          </div>

          {/* Warrior 2: Magic Archer */}
          <div className="bg-slate-800/80 border border-cyan-500/40 rounded-2xl p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-cyan-400 shrink-0 bg-slate-900">
                <img
                  src={ASSET_PATHS.archerPortrait}
                  alt="Магический лучник"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-black text-white text-base">Магический лучник</h3>
                <span className="text-xs text-cyan-400 font-semibold">Ловкий стрелок и маг (100 HP)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg">
                <span className="text-slate-400">Перемещение (2P / 1P):</span>
                <span className="font-mono font-bold text-cyan-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  ← / → (или A / D)
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg">
                <span className="text-slate-400">Прыжок (2P / 1P):</span>
                <span className="font-mono font-bold text-cyan-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  ↑ (или W)
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg">
                <span className="flex items-center gap-1.5 text-cyan-200">
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  Выстрел из лука (10 урона):
                </span>
                <span className="font-mono font-bold text-cyan-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  K (или F)
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg">
                <span className="flex items-center gap-1.5 text-fuchsia-200">
                  <Wand2 className="w-3.5 h-3.5 text-fuchsia-400" />
                  Снаряд посоха (24 урона):
                </span>
                <span className="font-mono font-bold text-fuchsia-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  L (или G)
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg">
                <span className="flex items-center gap-1.5 text-sky-200">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  Магический щит (-75% урона):
                </span>
                <span className="font-mono font-bold text-sky-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  I / O (или H)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="bg-slate-800/40 rounded-xl p-3 text-xs text-slate-400 border border-slate-700/60 flex items-center justify-between">
          <span>Подсказка: используйте верхние летающие платформы, чтобы уклоняться от наземных волн!</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shrink-0 ml-3 cursor-pointer"
          >
            Понятно!
          </button>
        </div>
      </div>
    </div>
  );
};
