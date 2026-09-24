import React, { useEffect, useState } from 'react';
import { GameEngine } from '../game/engine';
import { Warrior, GameMode } from '../game/types';
import {
  Swords,
  Zap,
  Wand2,
  Shield,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Sparkles,
  Flame,
} from 'lucide-react';

interface AttackBarProps {
  engine: GameEngine;
  mode: GameMode;
}

export const AttackBar: React.FC<AttackBarProps> = ({ engine, mode }) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const p1 = engine.p1;
  const p2 = engine.p2;

  // Track key presses for visual feedback
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      setPressedKeys((prev) => new Set(prev).add(e.code));
    };
    const handleUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  if (!p1 || !p2) return null;

  // Attack trigger handlers
  const handleP1Primary = () => {
    if (p1.type === 'axe') {
      engine.triggerAxeMelee(p1, p2);
    } else {
      engine.triggerArcherBow(p1);
    }
  };

  const handleP1Special = () => {
    if (p1.type === 'axe') {
      engine.triggerAxeSpecial(p1);
    } else {
      engine.triggerArcherMagic(p1);
    }
  };

  const handleP1Shield = () => {
    if (p1.type === 'archer') {
      engine.triggerArcherShield(p1);
    }
  };

  const handleP2Primary = () => {
    if (p2.type === 'axe') {
      engine.triggerAxeMelee(p2, p1);
    } else {
      engine.triggerArcherBow(p2);
    }
  };

  const handleP2Special = () => {
    if (p2.type === 'axe') {
      engine.triggerAxeSpecial(p2);
    } else {
      engine.triggerArcherMagic(p2);
    }
  };

  const handleP2Shield = () => {
    if (p2.type === 'archer') {
      engine.triggerArcherShield(p2);
    }
  };

  const isP1PrimaryReady = p1.cooldowns.primary <= 0;
  const isP1SpecialReady = p1.cooldowns.special <= 0;
  const isP1ShieldReady = p1.cooldowns.shield !== undefined ? p1.cooldowns.shield <= 0 : false;

  const isP2PrimaryReady = p2.cooldowns.primary <= 0;
  const isP2SpecialReady = p2.cooldowns.special <= 0;
  const isP2ShieldReady = p2.cooldowns.shield !== undefined ? p2.cooldowns.shield <= 0 : false;

  return (
    <div className="w-full bg-slate-900/95 border-2 border-amber-400/60 rounded-3xl p-3 sm:p-4 mt-2 shadow-2xl backdrop-blur-md select-none">
      {/* Title / Action bar header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/40">
            <Swords className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm text-amber-300 uppercase tracking-wider">
              Панель ударов
            </span>
            {mode === 'pve' && (
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1 border border-white">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                <span>ВЫ: {p1.name}</span>
              </span>
            )}
          </div>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          {mode === 'pve'
            ? 'Управляйте своим персонажем кнопками или клавишами F, G, H'
            : 'Нажимай кнопки мышью или используй клавиатуру'}
        </span>
      </div>

      {mode === 'pvp' ? (
        // --- 2-PLAYER MODE (PVP) TWO ACTION COLUMNS ---
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Player 1 Actions */}
          <div className="bg-slate-950/70 border border-amber-500/40 rounded-2xl p-3">
            <div className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Игрок 1: {p1.name}</span>
              <span className="text-[11px] text-slate-400 font-mono">WASD + F, G, H</span>
            </div>

            {/* Movement buttons */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <button
                onPointerDown={() => engine.handleKeyDown('KeyA')}
                onPointerUp={() => engine.handleKeyUp('KeyA')}
                onPointerLeave={() => engine.handleKeyUp('KeyA')}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer shadow"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Влево [A]</span>
              </button>
              <button
                onPointerDown={() => engine.handleKeyDown('KeyW')}
                onPointerUp={() => engine.handleKeyUp('KeyW')}
                onPointerLeave={() => engine.handleKeyUp('KeyW')}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer shadow"
              >
                <ArrowUp className="w-4 h-4" />
                <span>Прыжок [W]</span>
              </button>
              <button
                onPointerDown={() => engine.handleKeyDown('KeyD')}
                onPointerUp={() => engine.handleKeyUp('KeyD')}
                onPointerLeave={() => engine.handleKeyUp('KeyD')}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer shadow"
              >
                <span>Вправо [D]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Attack strike buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleP1Primary}
                disabled={!isP1PrimaryReady || p1.hp <= 0}
                className={`py-3 px-3 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border-2 shadow-lg ${
                  pressedKeys.has('KeyF') || p1.isAttacking && p1.attackType === 'melee'
                    ? 'scale-95 ring-4 ring-amber-400'
                    : ''
                } ${
                  isP1PrimaryReady && p1.hp > 0
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 border-white active:scale-95'
                    : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {p1.type === 'axe' ? <Swords className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                  <span>{p1.type === 'axe' ? 'УДАР ТОПОРОМ' : 'ВЫСТРЕЛ ИЗ ЛУКА'}</span>
                </div>
                <span className="text-[10px] font-bold opacity-80">
                  {p1.type === 'axe' ? '14 урона · Ближний [F]' : '10 урона · Стрела [F]'}
                </span>
              </button>

              <button
                onClick={handleP1Special}
                disabled={!isP1SpecialReady || p1.hp <= 0}
                className={`py-3 px-3 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border-2 shadow-lg ${
                  pressedKeys.has('KeyG') || p1.isAttacking && p1.attackType === 'special'
                    ? 'scale-95 ring-4 ring-orange-400'
                    : ''
                } ${
                  isP1SpecialReady && p1.hp > 0
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white border-amber-300 active:scale-95'
                    : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {p1.type === 'axe' ? <Flame className="w-4 h-4 text-yellow-300" /> : <Wand2 className="w-4 h-4" />}
                  <span>{p1.type === 'axe' ? 'ВОЛНА ЭНЕРГИИ' : 'СНАРЯД ПОСОХА'}</span>
                </div>
                <span className="text-[10px] font-bold opacity-90 font-mono">
                  {isP1SpecialReady
                    ? p1.type === 'axe'
                      ? '26 урона · [G]'
                      : '24 урона · [G]'
                    : `Кулдаун: ${p1.cooldowns.special.toFixed(1)}s`}
                </span>
              </button>
            </div>

            {p1.type === 'archer' && (
              <button
                onClick={handleP1Shield}
                disabled={!isP1ShieldReady || p1.hp <= 0}
                className={`w-full mt-2 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer shadow ${
                  isP1ShieldReady && p1.hp > 0
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>МАГИЧЕСКИЙ ЩИТ [H]</span>
                {p1.cooldowns.shield !== undefined && p1.cooldowns.shield > 0 && (
                  <span className="font-mono text-[10px]">({p1.cooldowns.shield.toFixed(1)}s)</span>
                )}
              </button>
            )}
          </div>

          {/* Player 2 Actions */}
          <div className="bg-slate-950/70 border border-cyan-500/40 rounded-2xl p-3">
            <div className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Игрок 2: {p2.name}</span>
              <span className="text-[11px] text-slate-400 font-mono">Стрелки + K, L, I</span>
            </div>

            {/* Movement buttons */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <button
                onPointerDown={() => engine.handleKeyDown('ArrowLeft')}
                onPointerUp={() => engine.handleKeyUp('ArrowLeft')}
                onPointerLeave={() => engine.handleKeyUp('ArrowLeft')}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-500 active:text-slate-950 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer shadow"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Влево [←]</span>
              </button>
              <button
                onPointerDown={() => engine.handleKeyDown('ArrowUp')}
                onPointerUp={() => engine.handleKeyUp('ArrowUp')}
                onPointerLeave={() => engine.handleKeyUp('ArrowUp')}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-500 active:text-slate-950 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer shadow"
              >
                <ArrowUp className="w-4 h-4" />
                <span>Прыжок [↑]</span>
              </button>
              <button
                onPointerDown={() => engine.handleKeyDown('ArrowRight')}
                onPointerUp={() => engine.handleKeyUp('ArrowRight')}
                onPointerLeave={() => engine.handleKeyUp('ArrowRight')}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-500 active:text-slate-950 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer shadow"
              >
                <span>Вправо [→]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Attack strike buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleP2Primary}
                disabled={!isP2PrimaryReady || p2.hp <= 0}
                className={`py-3 px-3 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border-2 shadow-lg ${
                  pressedKeys.has('KeyK') || p2.isAttacking && p2.attackType === 'melee'
                    ? 'scale-95 ring-4 ring-cyan-400'
                    : ''
                } ${
                  isP2PrimaryReady && p2.hp > 0
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-white active:scale-95'
                    : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {p2.type === 'archer' ? <Zap className="w-4 h-4" /> : <Swords className="w-4 h-4" />}
                  <span>{p2.type === 'archer' ? 'ВЫСТРЕЛ ИЗ ЛУКА' : 'УДАР ТОПОРОМ'}</span>
                </div>
                <span className="text-[10px] font-bold opacity-90">
                  {p2.type === 'archer' ? '10 урона · Стрела [K]' : '14 урона · Топор [K]'}
                </span>
              </button>

              <button
                onClick={handleP2Special}
                disabled={!isP2SpecialReady || p2.hp <= 0}
                className={`py-3 px-3 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border-2 shadow-lg ${
                  pressedKeys.has('KeyL') || p2.isAttacking && p2.attackType === 'special'
                    ? 'scale-95 ring-4 ring-fuchsia-400'
                    : ''
                } ${
                  isP2SpecialReady && p2.hp > 0
                    ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white border-fuchsia-300 active:scale-95'
                    : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {p2.type === 'archer' ? <Wand2 className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                  <span>{p2.type === 'archer' ? 'СНАРЯД ПОСОХА' : 'ВОЛНА ЭНЕРГИИ'}</span>
                </div>
                <span className="text-[10px] font-bold opacity-90 font-mono">
                  {isP2SpecialReady
                    ? p2.type === 'archer'
                      ? '24 урона · [L]'
                      : '26 урона · [L]'
                    : `Кулдаун: ${p2.cooldowns.special.toFixed(1)}s`}
                </span>
              </button>
            </div>

            {p2.type === 'archer' && (
              <button
                onClick={handleP2Shield}
                disabled={!isP2ShieldReady || p2.hp <= 0}
                className={`w-full mt-2 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer shadow ${
                  isP2ShieldReady && p2.hp > 0
                    ? 'bg-sky-600 hover:bg-sky-500 text-white border-sky-300'
                    : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>МАГИЧЕСКИЙ ЩИТ [I]</span>
                {p2.cooldowns.shield !== undefined && p2.cooldowns.shield > 0 && (
                  <span className="font-mono text-[10px]">({p2.cooldowns.shield.toFixed(1)}s)</span>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        // --- SINGLE PLAYER MODE (PVE) FULL-WIDTH HERO ACTION DECK ---
        <div className="space-y-2">
          {/* Identity banner showing who is "ВЫ" and who is "БОТ" */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/70 border border-emerald-500/30 rounded-2xl px-3.5 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs shadow-sm">
                ВЫ
              </span>
              <span className="font-extrabold text-white text-sm">
                {p1.name}
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline">
                {p1.type === 'axe' ? '(Тяжелый ближний бой · 120 HP)' : '(Дальний бой и магия · 100 HP)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs">Противник:</span>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700">
                БОТ
              </span>
              <span className="font-bold text-cyan-300 text-xs">{p2.name}</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-3">
          {/* Movement buttons cluster */}
          <div className="flex items-center gap-2 shrink-0 bg-slate-950/60 p-2 rounded-2xl border border-slate-800">
            <button
              onPointerDown={() => engine.handleKeyDown('KeyA')}
              onPointerUp={() => engine.handleKeyUp('KeyA')}
              onPointerLeave={() => engine.handleKeyUp('KeyA')}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow"
              title="Движение влево [A]"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Влево [A]</span>
            </button>

            <button
              onPointerDown={() => engine.handleKeyDown('KeyW')}
              onPointerUp={() => engine.handleKeyUp('KeyW')}
              onPointerLeave={() => engine.handleKeyUp('KeyW')}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow"
              title="Прыжок [W или Пробел]"
            >
              <ArrowUp className="w-4 h-4 text-amber-400" />
              <span>Прыжок [W]</span>
            </button>

            <button
              onPointerDown={() => engine.handleKeyDown('KeyD')}
              onPointerUp={() => engine.handleKeyUp('KeyD')}
              onPointerLeave={() => engine.handleKeyUp('KeyD')}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow"
              title="Движение вправо [D]"
            >
              <span>Вправо [D]</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Big Attack Strike Buttons Cluster */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {/* Primary Strike Button */}
            <button
              onClick={handleP1Primary}
              disabled={!isP1PrimaryReady || p1.hp <= 0}
              className={`py-3 px-4 rounded-2xl font-black text-sm flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border-2 shadow-xl ${
                pressedKeys.has('KeyF') || (p1.isAttacking && p1.attackType === 'melee')
                  ? 'scale-95 ring-4 ring-amber-400'
                  : 'hover:-translate-y-0.5'
              } ${
                isP1PrimaryReady && p1.hp > 0
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 border-white shadow-amber-500/20 active:translate-y-0'
                  : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 text-base">
                {p1.type === 'axe' ? <Swords className="w-5 h-5 text-slate-950 stroke-[2.5]" /> : <Zap className="w-5 h-5 text-slate-950 stroke-[2.5]" />}
                <span className="tracking-wide">
                  {p1.type === 'axe' ? 'НАНЕСТИ УДАР ТОПОРОМ' : 'ВЫСТРЕЛИТЬ ИЗ ЛУКА'}
                </span>
              </div>
              <span className="text-xs font-extrabold text-slate-900/90">
                {p1.type === 'axe' ? '14 урона · Ближний бой · Клавиша [F]' : '10 урона · Стрела · Клавиша [F]'}
              </span>
            </button>

            {/* Special Ability Button */}
            <button
              onClick={handleP1Special}
              disabled={!isP1SpecialReady || p1.hp <= 0}
              className={`py-3 px-4 rounded-2xl font-black text-sm flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border-2 shadow-xl ${
                pressedKeys.has('KeyG') || (p1.isAttacking && p1.attackType === 'special')
                  ? 'scale-95 ring-4 ring-orange-400'
                  : 'hover:-translate-y-0.5'
              } ${
                isP1SpecialReady && p1.hp > 0
                  ? 'bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white border-amber-300 shadow-orange-600/30 active:translate-y-0'
                  : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 text-base">
                {p1.type === 'axe' ? <Flame className="w-5 h-5 text-yellow-300 stroke-[2.5]" /> : <Wand2 className="w-5 h-5 stroke-[2.5]" />}
                <span className="tracking-wide">
                  {p1.type === 'axe' ? 'СОКРУШИТЕЛЬНАЯ ВОЛНА' : 'МАГИЧЕСКИЙ СНАРЯД'}
                </span>
              </div>
              <span className="text-xs font-bold text-amber-100 font-mono">
                {isP1SpecialReady
                  ? p1.type === 'axe'
                    ? '26 урона · Удар по земле · [G]'
                    : '24 урона · Взрыв посоха · [G]'
                  : `Перезарядка: ${p1.cooldowns.special.toFixed(1)} сек`}
              </span>
            </button>

            {/* Shield or Heavy Cleave Info for third slot */}
            {p1.type === 'archer' ? (
              <button
                onClick={handleP1Shield}
                disabled={!isP1ShieldReady || p1.hp <= 0}
                className={`py-3 px-4 rounded-2xl font-black text-sm flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border-2 shadow-xl ${
                  pressedKeys.has('KeyH')
                    ? 'scale-95 ring-4 ring-cyan-400'
                    : 'hover:-translate-y-0.5'
                } ${
                  isP1ShieldReady && p1.hp > 0
                    ? 'bg-gradient-to-r from-cyan-600 via-sky-500 to-cyan-500 text-white border-cyan-200 shadow-cyan-500/25 active:translate-y-0'
                    : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 text-base">
                  <Shield className="w-5 h-5 text-cyan-100 stroke-[2.5]" />
                  <span className="tracking-wide">МАГИЧЕСКИЙ ЩИТ</span>
                </div>
                <span className="text-xs font-bold text-cyan-100 font-mono">
                  {isP1ShieldReady
                    ? 'Блок 75% урона на 2.5 сек · [H]'
                    : `Перезарядка: ${(p1.cooldowns.shield ?? 0).toFixed(1)} сек`}
                </span>
              </button>
            ) : (
              <div className="py-2.5 px-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-center items-center text-center">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Совет берсерка
                </span>
                <span className="text-[11px] text-slate-300 mt-0.5">
                  Подходи вплотную для удара топором и пускай волну земли издалека!
                </span>
              </div>
            )}
          </div>
        </div>
        </div>
      )}
    </div>
  );
};
