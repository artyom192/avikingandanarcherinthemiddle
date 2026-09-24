import React, { useState } from 'react';
import { GameMode, WarriorType, AIDifficulty, ArenaTheme } from '../game/types';
import { GameEngine } from '../game/engine';
import { ASSET_PATHS, WARRIOR_CONFIGS } from '../game/constants';
import {
  ARENA_THEMES,
  AXE_OUTFITS,
  AXE_WEAPONS,
  ARCHER_OUTFITS,
  ARCHER_WEAPONS,
  CustomizationItem,
  ThemeConfig,
} from '../game/customization';
import {
  Bot,
  Users,
  Swords,
  X,
  Palette,
  Shirt,
  Sparkles,
  Check,
  Flame,
  Shield,
  Zap,
} from 'lucide-react';

interface ModeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  engine: GameEngine;
  initialTab?: 'mode' | 'theme' | 'skins';
  onConfirm: (mode: GameMode, hero: WarriorType, difficulty: AIDifficulty) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  isOpen,
  onClose,
  engine,
  initialTab = 'mode',
  onConfirm,
}) => {
  const [activeTab, setActiveTab] = useState<'mode' | 'theme' | 'skins'>(initialTab);
  const [mode, setMode] = useState<GameMode>(engine.mode);
  const [hero, setHero] = useState<WarriorType>(engine.player1Hero);
  const [difficulty, setDifficulty] = useState<AIDifficulty>(engine.difficulty);

  const [currentTheme, setCurrentTheme] = useState<ArenaTheme>(engine.currentTheme);
  const [customizingHero, setCustomizingHero] = useState<WarriorType>('axe');

  const [axeOutfit, setAxeOutfit] = useState<string>(engine.axeOutfit);
  const [axeWeapon, setAxeWeapon] = useState<string>(engine.axeWeapon);
  const [archerOutfit, setArcherOutfit] = useState<string>(engine.archerOutfit);
  const [archerWeapon, setArcherWeapon] = useState<string>(engine.archerWeapon);

  if (!isOpen) return null;

  const handleSelectTheme = (themeId: ArenaTheme) => {
    setCurrentTheme(themeId);
    engine.setTheme(themeId);
  };

  const handleSelectAxeOutfit = (outfitId: string) => {
    setAxeOutfit(outfitId);
    engine.setCustomization('axe', outfitId, axeWeapon);
  };

  const handleSelectAxeWeapon = (weaponId: string) => {
    setAxeWeapon(weaponId);
    engine.setCustomization('axe', axeOutfit, weaponId);
  };

  const handleSelectArcherOutfit = (outfitId: string) => {
    setArcherOutfit(outfitId);
    engine.setCustomization('archer', outfitId, archerWeapon);
  };

  const handleSelectArcherWeapon = (weaponId: string) => {
    setArcherWeapon(weaponId);
    engine.setCustomization('archer', archerOutfit, weaponId);
  };

  const activeOutfitId = customizingHero === 'axe' ? axeOutfit : archerOutfit;
  const activeWeaponId = customizingHero === 'axe' ? axeWeapon : archerWeapon;
  const outfitList: CustomizationItem[] = customizingHero === 'axe' ? AXE_OUTFITS : ARCHER_OUTFITS;
  const weaponList: CustomizationItem[] = customizingHero === 'axe' ? AXE_WEAPONS : ARCHER_WEAPONS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-400/90 rounded-3xl p-5 sm:p-7 shadow-2xl text-white my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-10">
          <h2 className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-2">
            <Swords className="w-6 h-6 text-amber-400 shrink-0" />
            <span>Настройки Арены и Бойцов</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Режимы битвы, цветовая гамма арены и кастомизация снаряжения
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-5 shrink-0">
          <button
            onClick={() => setActiveTab('mode')}
            className={`py-2 px-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'mode'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span className="truncate">Режим и Боец</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`py-2 px-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'theme'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span className="truncate">Цветовая гамма</span>
          </button>

          <button
            onClick={() => setActiveTab('skins')}
            className={`py-2 px-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'skins'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span className="truncate">Одежда и Оружие</span>
          </button>
        </div>

        {/* Tab Content Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* TAB 1: MODE & HERO */}
          {activeTab === 'mode' && (
            <div className="space-y-5 animate-fade-in">
              {/* Game Mode */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Режим сражения:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMode('pve')}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                      mode === 'pve'
                        ? 'border-amber-400 bg-amber-500/10 text-white'
                        : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl ${
                        mode === 'pve' ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm">Против Бота</div>
                      <div className="text-[11px] text-slate-400">Одиночная битва</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setMode('pvp')}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                      mode === 'pvp'
                        ? 'border-cyan-400 bg-cyan-500/10 text-white'
                        : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl ${
                        mode === 'pvp' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm">На двоих (1 на 1)</div>
                      <div className="text-[11px] text-slate-400">Одна клавиатура</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Fighter Selection (PvE) */}
              {mode === 'pve' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Выберите персонажа:
                    </label>
                    <span className="text-[11px] text-emerald-400 font-bold">
                      Ваш герой отмечен значком «ВЫ»
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Warrior 1 (Axe) */}
                    <button
                      onClick={() => setHero('axe')}
                      className={`relative p-3 rounded-2xl border-2 flex items-center gap-3 text-left transition-all cursor-pointer ${
                        hero === 'axe'
                          ? 'border-emerald-400 bg-emerald-500/15 text-white ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-500/10'
                          : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="relative w-13 h-13 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-900">
                        <img
                          src={ASSET_PATHS.axePortrait}
                          alt="Воин с топором"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-white truncate">
                          {WARRIOR_CONFIGS.axe.name}
                        </div>
                        <div className="text-[11px] text-amber-300">Ближний бой (120 HP)</div>
                        <div className="text-[10px] font-semibold mt-0.5">
                          {hero === 'axe' ? (
                            <span className="text-emerald-400 font-black">Ваш персонаж</span>
                          ) : (
                            <span className="text-slate-400">Противник (Бот)</span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {hero === 'axe' ? (
                          <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-black text-xs shadow-md border-2 border-white flex items-center gap-1 animate-pulse">
                            <span>✓ ВЫ</span>
                          </div>
                        ) : (
                          <div className="px-2 py-0.5 rounded-lg bg-slate-800/90 text-slate-400 font-semibold text-[10px] border border-slate-700">
                            БОТ
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Warrior 2 (Archer) */}
                    <button
                      onClick={() => setHero('archer')}
                      className={`relative p-3 rounded-2xl border-2 flex items-center gap-3 text-left transition-all cursor-pointer ${
                        hero === 'archer'
                          ? 'border-emerald-400 bg-emerald-500/15 text-white ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-500/10'
                          : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="relative w-13 h-13 rounded-xl overflow-hidden border-2 border-cyan-400 shrink-0 bg-slate-900">
                        <img
                          src={ASSET_PATHS.archerPortrait}
                          alt="Магический лучник"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-white truncate">
                          {WARRIOR_CONFIGS.archer.name}
                        </div>
                        <div className="text-[11px] text-cyan-300">Дальний бой + Магия</div>
                        <div className="text-[10px] font-semibold mt-0.5">
                          {hero === 'archer' ? (
                            <span className="text-emerald-400 font-black">Ваш персонаж</span>
                          ) : (
                            <span className="text-slate-400">Противник (Бот)</span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {hero === 'archer' ? (
                          <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-black text-xs shadow-md border-2 border-white flex items-center gap-1 animate-pulse">
                            <span>✓ ВЫ</span>
                          </div>
                        ) : (
                          <div className="px-2 py-0.5 rounded-lg bg-slate-800/90 text-slate-400 font-semibold text-[10px] border border-slate-700">
                            БОТ
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Bot Difficulty */}
              {mode === 'pve' && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Сложность бота:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDifficulty('normal')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        difficulty === 'normal'
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      Обычная
                    </button>
                    <button
                      onClick={() => setDifficulty('hard')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        difficulty === 'hard'
                          ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      Мастер (Быстрая реакция)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ARENA COLOR THEMES */}
          {activeTab === 'theme' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Выберите цветовую гамму арены:
                </span>
                <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Применяется мгновенно
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(Object.values(ARENA_THEMES) as ThemeConfig[]).map((thm) => {
                  const isSelected = currentTheme === thm.id;
                  return (
                    <button
                      key={thm.id}
                      onClick={() => handleSelectTheme(thm.id)}
                      className={`relative p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer overflow-hidden group ${
                        isSelected
                          ? 'border-amber-400 bg-slate-800/90 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/40'
                          : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Gradient preview ribbon */}
                      <div
                        className={`h-10 rounded-xl mb-2.5 bg-gradient-to-r ${thm.previewGradient} flex items-center justify-between px-3 border border-white/10 shadow-inner`}
                      >
                        <span className="text-[10px] uppercase font-black tracking-widest text-white/90 drop-shadow">
                          {thm.badge}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/50 shadow"
                            style={{ backgroundColor: thm.platformTop }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/50 shadow"
                            style={{ backgroundColor: thm.accentColor }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                            {thm.name}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {thm.subtitle}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="shrink-0 p-1.5 rounded-full bg-amber-400 text-slate-950 shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: OUTFITS & WEAPONS */}
          {activeTab === 'skins' && (
            <div className="space-y-4 animate-fade-in">
              {/* Hero Selector Sub-nav */}
              <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  onClick={() => setCustomizingHero('axe')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    customizingHero === 'axe'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Воин с топором</span>
                </button>

                <button
                  onClick={() => setCustomizingHero('archer')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    customizingHero === 'archer'
                      ? 'bg-cyan-400 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Магический лучник</span>
                </button>
              </div>

              {/* 1. OUTFITS / CLOTHES */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-amber-400" />
                  <span>Одежда и доспехи:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {outfitList.map((item) => {
                    const isSelected = activeOutfitId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (customizingHero === 'axe') handleSelectAxeOutfit(item.id);
                          else handleSelectArcherOutfit(item.id);
                        }}
                        className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/10'
                            : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs sm:text-sm text-white">
                            {item.name}
                          </span>
                          {isSelected && (
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px]">
                              Надето
                            </span>
                          )}
                        </div>

                        {/* Color swatches */}
                        <div className="flex items-center gap-1.5 mb-1.5">
                          {item.previewColors.map((col, idx) => (
                            <span
                              key={idx}
                              className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
                              style={{ backgroundColor: col }}
                            />
                          ))}
                          <span className="text-[10px] text-slate-400 ml-1">
                            {item.badge}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. WEAPONS */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Оружие воина:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {weaponList.map((item) => {
                    const isSelected = activeWeaponId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (customizingHero === 'axe') handleSelectAxeWeapon(item.id);
                          else handleSelectArcherWeapon(item.id);
                        }}
                        className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/10'
                            : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs sm:text-sm text-white">
                            {item.name}
                          </span>
                          {isSelected && (
                            <span className="px-1.5 py-0.5 rounded-md bg-cyan-400 text-slate-950 font-black text-[10px]">
                              В руке
                            </span>
                          )}
                        </div>

                        {/* Color swatches */}
                        <div className="flex items-center gap-1.5 mb-1.5">
                          {item.previewColors.map((col, idx) => (
                            <span
                              key={idx}
                              className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
                              style={{ backgroundColor: col }}
                            />
                          ))}
                          <span className="text-[10px] text-slate-400 ml-1">
                            {item.badge}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Confirmation Button */}
        <div className="mt-5 pt-3 border-t border-slate-800 shrink-0">
          <button
            onClick={() => {
              onConfirm(mode, hero, difficulty);
              onClose();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all border border-white cursor-pointer flex items-center justify-center gap-2"
          >
            <Swords className="w-5 h-5" />
            <span>ПРИМЕНИТЬ И НАЧАТЬ БИТВУ!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
