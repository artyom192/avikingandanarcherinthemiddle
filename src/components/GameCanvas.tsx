import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../game/engine';
import { GAME_WIDTH, GAME_HEIGHT, ARENA_PLATFORMS, ASSET_PATHS } from '../game/constants';
import { CharacterRenderer } from '../game/characterRenderer';
import { ARENA_THEMES } from '../game/customization';
import { ArenaTheme } from '../game/types';

interface GameCanvasProps {
  engine: GameEngine;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ engine }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  // Load arena background image
  useEffect(() => {
    const img = new Image();
    img.src = ASSET_PATHS.arenaBg;
    img.onload = () => {
      bgImageRef.current = img;
    };
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Prevent browser scroll on arrow keys & space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      engine.handleKeyDown(e.code);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      engine.handleKeyUp(e.code);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [engine]);

  // Main Render & Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(0.06, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      // Update engine
      engine.update(dt);

      // Render frame
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.save();
          ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

          // Apply screenshake
          if (engine.screenShake > 0) {
            const sx = (Math.random() - 0.5) * engine.screenShake * 1.5;
            const sy = (Math.random() - 0.5) * engine.screenShake * 1.5;
            ctx.translate(sx, sy);
          }

          const themeCfg =
            ARENA_THEMES[engine.currentTheme as ArenaTheme] || ARENA_THEMES.mystic_twilight;

          // 1. Draw Background with active theme color palette
          if (bgImageRef.current && bgImageRef.current.complete) {
            ctx.drawImage(bgImageRef.current, 0, 0, GAME_WIDTH, GAME_HEIGHT);
            // Atmospheric theme scrim tint
            ctx.fillStyle = themeCfg.scrimColor;
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

            // Ambient light radial glow
            const ambientGrad = ctx.createRadialGradient(
              GAME_WIDTH / 2,
              GAME_HEIGHT / 3,
              40,
              GAME_WIDTH / 2,
              GAME_HEIGHT / 3,
              GAME_WIDTH / 1.4,
            );
            ambientGrad.addColorStop(0, themeCfg.ambientLight);
            ambientGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
            ctx.fillStyle = ambientGrad;
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
          } else {
            // High fidelity Canvas theme gradient fallback
            const bgGrad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
            bgGrad.addColorStop(0, themeCfg.bgGradTop);
            bgGrad.addColorStop(0.5, themeCfg.bgGradMid);
            bgGrad.addColorStop(1, themeCfg.bgGradBottom);
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
          }

          // Ambient theme particles (embers / stardust / ice sparkles)
          const time = engine.gameTime;
          ctx.save();
          for (let i = 0; i < 16; i++) {
            const px = (i * 63 + time * 20 * (1 + (i % 3) * 0.5)) % GAME_WIDTH;
            const py =
              GAME_HEIGHT -
              70 -
              ((i * 37 + time * 25 * (1 + (i % 2) * 0.4)) % (GAME_HEIGHT - 120));
            const pr = 1.5 + (i % 3) * 1.2;
            ctx.fillStyle = themeCfg.accentColor;
            ctx.globalAlpha = 0.35 + Math.sin(time * 3 + i) * 0.25;
            ctx.beginPath();
            ctx.arc(px, py, pr, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // 2. Draw Arena Platforms & Floor with theme
          CharacterRenderer.drawPlatforms(ctx, ARENA_PLATFORMS, engine.currentTheme);

          // 3. Draw Warriors
          if (engine.p1) {
            CharacterRenderer.drawWarrior(ctx, engine.p1, engine.gameTime, engine.mode);
          }
          if (engine.p2) {
            CharacterRenderer.drawWarrior(ctx, engine.p2, engine.gameTime, engine.mode);
          }

          // 4. Draw Projectiles (Arrows, Magic Orbs, Shockwaves)
          CharacterRenderer.drawProjectiles(ctx, engine.projectiles, engine.gameTime);

          // 5. Draw Particles & Comic Hit Splats
          CharacterRenderer.drawParticles(ctx, engine.particles);

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [engine]);

  return (
    <div className="relative w-full aspect-[1000/560] max-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl border-3 border-amber-400/40 shadow-2xl bg-slate-950">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="w-full h-full object-contain block"
      />
    </div>
  );
};
