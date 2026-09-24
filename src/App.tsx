import React, { useState, useEffect } from 'react';
import { GameEngine } from './game/engine';
import { GameStatus, GameMode, WarriorType, AIDifficulty } from './game/types';
import { sound } from './game/sound';
import { HUD } from './components/HUD';
import { GameCanvas } from './components/GameCanvas';
import { VictoryModal } from './components/VictoryModal';
import { ControlsGuide } from './components/ControlsGuide';
import { ModeSelector } from './components/ModeSelector';
import { TouchControls } from './components/TouchControls';
import { AttackBar } from './components/AttackBar';
import { Gamepad2, HelpCircle, Palette, Settings2, Sparkles, Swords } from 'lucide-react';

export default function App() {
  const [engine] = useState(() => new GameEngine());
  const [gameStatus, setGameStatus] = useState<GameStatus>('PLAYING');
  const [_, setHpTick] = useState(0); // Force re-render on hp or frame update
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [showControls, setShowControls] = useState(false);
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [modeModalTab, setModeModalTab] = useState<'mode' | 'theme' | 'skins'>('mode');
  const [showTouchControls, setShowTouchControls] = useState(false);

  // Sync state changes from game engine
  useEffect(() => {
    engine.setListeners({
      onStateChange: (status) => {
        setGameStatus(status);
      },
      onHpUpdate: () => {
        setHpTick((prev) => prev + 1);
      },
    });

    // Detect if device has touch capability
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setShowTouchControls(true);
    }
  }, [engine]);

  const handleToggleMute = () => {
    const next = !isMuted;
    sound.setMuted(next);
    setIsMuted(next);
  };

  const handlePlayAgain = () => {
    engine.initMatch();
    setGameStatus('PLAYING');
  };

  const handleConfirmMode = (mode: GameMode, hero: WarriorType, difficulty: AIDifficulty) => {
    engine.initMatch(mode, hero, difficulty);
    setGameStatus('PLAYING');
  };

  const openModalWithTab = (tab: 'mode' | 'theme' | 'skins' = 'mode') => {
    setModeModalTab(tab);
    setShowModeSelect(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-between font-sans selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      {/* Top Header Bar following Top Bar Contract */}
      <header className="w-full bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-30 px-4 py-2.5 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-md">
              <Swords className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              Битва Воинов <span className="text-amber-400 font-extrabold text-sm ml-1 hidden sm:inline">2D Арена</span>
            </span>
          </div>

          {/* Zone 2: Informational Links / Badges */}
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-300/90">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Воин с топором против Магического лучника
            </span>
          </div>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTouchControls(!showTouchControls)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showTouchControls
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Экранные кнопки управления"
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden sm:inline">Кнопки</span>
            </button>

            <button
              onClick={() => setShowControls(true)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Управление</span>
            </button>

            <button
              onClick={() => openModalWithTab('theme')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Цветовая гамма арены и гардероб бойцов"
            >
              <Palette className="w-4 h-4 text-fuchsia-400" />
              <span className="hidden sm:inline">Цвета и Скины</span>
            </button>

            <button
              onClick={() => openModalWithTab('mode')}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Settings2 className="w-4 h-4" />
              <span>Режим боя</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Container */}
      <main className="w-full max-w-6xl mx-auto flex-1 flex flex-col items-center justify-center p-2 sm:p-4 relative">
        {/* Fighter HUD */}
        {engine.p1 && engine.p2 && (
          <HUD
            p1={engine.p1}
            p2={engine.p2}
            mode={engine.mode}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onOpenControls={() => setShowControls(true)}
            onOpenModeSelect={() => openModalWithTab('mode')}
            onOpenCustomize={() => openModalWithTab('theme')}
          />
        )}

        {/* 2D Canvas Viewport */}
        <div className="w-full relative my-1">
          <GameCanvas engine={engine} />

          {/* On-screen touch controls if enabled */}
          {showTouchControls && <TouchControls engine={engine} />}
        </div>

        {/* Attack & Ability Control Bar */}
        <AttackBar engine={engine} mode={engine.mode} />
      </main>

      {/* Victory Modal */}
      {gameStatus === 'VICTORY' && engine.winner && (
        <VictoryModal
          winner={engine.winner}
          loser={engine.winner.id === 'p1' ? engine.p2 : engine.p1}
          mode={engine.mode}
          onPlayAgain={handlePlayAgain}
          onSelectHero={() => openModalWithTab('mode')}
        />
      )}

      {/* Controls Guide Modal */}
      <ControlsGuide
        isOpen={showControls}
        onClose={() => setShowControls(false)}
      />

      {/* Mode & Hero Selector Modal */}
      <ModeSelector
        isOpen={showModeSelect}
        onClose={() => setShowModeSelect(false)}
        engine={engine}
        initialTab={modeModalTab}
        onConfirm={handleConfirmMode}
      />

      {/* Quiet Footer */}
      <footer className="w-full py-2 border-t border-slate-900 text-center text-xs text-slate-500">
        Битва Воинов 2D · Мультяшная боевая арена · Без таймера боя
      </footer>
    </div>
  );
}
