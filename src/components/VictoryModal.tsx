import React from 'react';
import { Warrior, GameMode } from '../game/types';
import { ASSET_PATHS } from '../game/constants';
import { Trophy, RotateCcw, Swords, ShieldCheck, Flame } from 'lucide-react';

interface VictoryModalProps {
  winner: Warrior;
  loser: Warrior;
  mode: GameMode;
  onPlayAgain: () => void;
  onSelectHero?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  loser,
  mode,
  onPlayAgain,
  onSelectHero,
}) => {
  const winnerPortrait =
    winner.type === 'axe' ? ASSET_PATHS.axePortrait : ASSET_PATHS.archerPortrait;

  const isPlayer1Winner = winner.id === 'p1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-3 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        {/* Decorative corner glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Crown / Trophy icon */}
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg border-2 border-white transform hover:scale-110 transition-transform">
            <Trophy className="w-9 h-9 text-slate-950" />
          </div>
        </div>

        {/* Big Victory Heading (as requested: «ПОБЕДА!») */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] uppercase mb-2">
          ПОБЕДА!
        </h1>

        <p className="text-sm sm:text-base text-slate-300 mb-6">
          {mode === 'pvp'
            ? `${isPlayer1Winner ? 'Игрок 1' : 'Игрок 2'} одержал сокрушительную победу!`
            : isPlayer1Winner
            ? 'Поздравляем! ВЫ победили в этой битве!'
            : `Бот оказался сильнее! Ваш герой: ${loser.name}. Возьмите реванш!`}
        </p>

        {/* Winner Hero Card */}
        <div className="flex items-center justify-center gap-4 bg-slate-800/80 border border-amber-400/40 rounded-2xl p-4 mb-6 shadow-inner">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0 bg-slate-900">
            <img
              src={winnerPortrait}
              alt={winner.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {mode === 'pve' && (
              <div
                className={`absolute bottom-0 inset-x-0 py-0.5 text-[10px] font-black text-center ${
                  isPlayer1Winner ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-200'
                }`}
              >
                {isPlayer1Winner ? 'ВЫ' : 'БОТ'}
              </div>
            )}
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                Триумфатор Арены
              </span>
              {mode === 'pve' && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isPlayer1Winner
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isPlayer1Winner ? 'ВЫ' : 'БОТ'}
                </span>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-black text-white truncate">
              {winner.name}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Осталось здоровья: <span className="text-emerald-400 font-bold">{winner.hp} HP</span>
            </div>
          </div>
        </div>

        {/* Battle Stats Breakdown */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-2.5">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Урон</span>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {winner.stats.damageDealt}
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-2.5">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <Swords className="w-3.5 h-3.5 text-red-400" />
              <span>Попадания</span>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {loser.stats.hitsTaken}
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-2.5">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Блоки</span>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {winner.stats.shieldsBlocked}
            </div>
          </div>
        </div>

        {/* Big Action Button (as requested: «ИГРАТЬ СНОВА») */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-lg rounded-2xl shadow-xl hover:shadow-amber-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 border-2 border-white cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            <span>ИГРАТЬ СНОВА</span>
          </button>

          {onSelectHero && (
            <button
              onClick={onSelectHero}
              className="py-4 px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm rounded-2xl border border-slate-700 transition-colors cursor-pointer"
            >
              Сменить героя
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
