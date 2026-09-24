import { Warrior, Projectile, Particle, ArenaPlatform, ArenaTheme } from './types';
import {
  ARENA_THEMES,
  AXE_OUTFITS,
  AXE_WEAPONS,
  ARCHER_OUTFITS,
  ARCHER_WEAPONS,
} from './customization';

/**
 * Procedural Cartoon Character & Arena Renderer
 * Renders stylized vector characters, weapons, effects, and arena elements on HTML5 Canvas.
 */

export class CharacterRenderer {
  /** Draw Arena Platforms and decorations with active theme styling */
  public static drawPlatforms(
    ctx: CanvasRenderingContext2D,
    platforms: ArenaPlatform[],
    theme: ArenaTheme = 'mystic_twilight',
  ) {
    const themeCfg = ARENA_THEMES[theme] || ARENA_THEMES.mystic_twilight;

    platforms.forEach((p) => {
      if (p.isOneWay) {
        // Floating combat ledges (Ancient stone with theme energy runes)
        ctx.save();
        // Drop shadow
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.beginPath();
        ctx.roundRect(p.x, p.y + 4, p.width, p.height, 6);
        ctx.fill();

        // Main platform body
        const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
        grad.addColorStop(0, '#2D283E');
        grad.addColorStop(0.4, '#1F1B2C');
        grad.addColorStop(1, '#110E1B');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.width, p.height, 6);
        ctx.fill();

        // Top theme crystal / glowing ledge fringe
        ctx.fillStyle = themeCfg.platformTop;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.width, 5, [6, 6, 0, 0]);
        ctx.fill();

        // Glowing metal brackets on edges
        ctx.fillStyle = themeCfg.accentColor;
        ctx.fillRect(p.x + 8, p.y + 3, 6, p.height - 5);
        ctx.fillRect(p.x + p.width - 14, p.y + 3, 6, p.height - 5);

        // Runes / carving details
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(p.x + p.width / 2 - 20, p.y + 7, 40, 3);
        ctx.restore();
      } else {
        // Main Ground Arena Floor
        ctx.save();
        // Top theme-tinted ground strip
        const topGrad = ctx.createLinearGradient(0, p.y, 0, p.y + 14);
        topGrad.addColorStop(0, themeCfg.platformTop);
        topGrad.addColorStop(1, themeCfg.platformEdge);
        ctx.fillStyle = topGrad;
        ctx.fillRect(p.x, p.y, p.width, 14);

        // Cartoon energy runes / grass tufts along edge
        ctx.fillStyle = themeCfg.accentColor;
        for (let gx = 10; gx < p.width; gx += 28) {
          ctx.beginPath();
          ctx.moveTo(gx, p.y);
          ctx.lineTo(gx + 5, p.y - 7);
          ctx.lineTo(gx + 10, p.y);
          ctx.fill();
        }

        // Earth / stone foundation
        const rockGrad = ctx.createLinearGradient(0, p.y + 14, 0, p.y + p.height);
        rockGrad.addColorStop(0, '#261F35');
        rockGrad.addColorStop(0.4, '#1A1424');
        rockGrad.addColorStop(1, '#0F0B15');
        ctx.fillStyle = rockGrad;
        ctx.fillRect(p.x, p.y + 14, p.width, p.height - 14);

        // Decorative stone slabs in foundation
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        for (let bx = 30; bx < p.width; bx += 80) {
          ctx.fillRect(bx, p.y + 22, 60, 20);
          ctx.fillRect(bx - 30, p.y + 50, 70, 22);
        }
        ctx.restore();
      }
    });
  }

  /** Render Warrior: Handles type switching and procedural animation */
  public static drawWarrior(ctx: CanvasRenderingContext2D, w: Warrior, time: number, mode: 'pve' | 'pvp' = 'pve') {
    ctx.save();
    // Center origin at bottom-middle of character bounding box
    const cx = w.x + w.width / 2;
    const cy = w.y + w.height;

    ctx.translate(cx, cy);
    ctx.scale(w.facing, 1); // Flip horizontally according to facing direction

    // Hit flash: blink white/red when taking damage
    if (w.isHit && Math.floor(time * 30) % 2 === 0) {
      ctx.filter = 'brightness(1.8) contrast(1.2)';
    }

    if (w.type === 'axe') {
      this.drawAxeWarrior(ctx, w, time);
    } else {
      this.drawMagicArcher(ctx, w, time);
    }

    ctx.restore();

    // Render Magic Shield Sphere if active (centered on warrior)
    if (w.shieldActive) {
      this.drawShieldBubble(ctx, w, time);
    }

    // Render Floating Overhead Indicator ("ВЫ" for player, "БОТ" for AI)
    this.drawOverheadTag(ctx, w, time, mode);
  }

  /** Overhead tag above character's head to clearly distinguish "ВЫ" and "БОТ" */
  private static drawOverheadTag(
    ctx: CanvasRenderingContext2D,
    w: Warrior,
    time: number,
    mode: 'pve' | 'pvp',
  ) {
    if (w.hp <= 0) return; // Don't show tag when defeated

    const cx = w.x + w.width / 2;
    const floatY = w.y - 14 + Math.sin(time * 5) * 3;

    ctx.save();
    ctx.translate(cx, floatY);

    if (mode === 'pve') {
      if (w.id === 'p1') {
        // --- PLAYER: "ВЫ" (Bright Emerald & Gold Badge) ---
        // Glow shadow
        ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
        ctx.shadowBlur = 8;

        // Badge pill
        ctx.fillStyle = '#10B981'; // Emerald
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-22, -20, 44, 20, 6);
        ctx.fill();
        ctx.stroke();

        // Pointer triangle
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(0, 5);
        ctx.lineTo(5, 0);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;

        // Text "ВЫ"
        ctx.font = "900 12px 'Fredoka', system-ui, sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#022C22';
        ctx.fillText('ВЫ', 0, -9.5);
      } else {
        // --- BOT: "БОТ" (Clean Slate Badge) ---
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-18, -17, 36, 17, 5);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(0, 4);
        ctx.lineTo(4, 0);
        ctx.closePath();
        ctx.fill();

        ctx.font = "bold 10px 'Fredoka', system-ui, sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('БОТ', 0, -8);
      }
    } else {
      // PvP mode: 1P and 2P
      const isP1 = w.id === 'p1';
      ctx.fillStyle = isP1 ? '#F59E0B' : '#06B6D4';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-16, -17, 32, 17, 5);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(0, 4);
      ctx.lineTo(4, 0);
      ctx.closePath();
      ctx.fill();

      ctx.font = "900 11px 'Fredoka', system-ui, sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#0F172A';
      ctx.fillText(isP1 ? '1P' : '2P', 0, -8);
    }

    ctx.restore();
  }

  /**
   * --- AXE WARRIOR (Воин с топором) ---
   * Heavyweight, broad chest, horned helmet, braided red beard, giant battleaxe
   */
  private static drawAxeWarrior(ctx: CanvasRenderingContext2D, w: Warrior, time: number) {
    const isMoving = Math.abs(w.vx) > 0.5 && w.isGrounded;
    const bob = isMoving ? Math.sin(time * 12) * 4 : Math.sin(time * 3) * 1.5;
    const legSwing = isMoving ? Math.sin(time * 12) * 16 : 0;
    const isDefeated = w.hp <= 0;

    if (isDefeated) {
      // Knocked out dizzy cartoon pose
      this.drawDefeatedAxeWarrior(ctx, time);
      return;
    }

    // Shadow on ground
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 32, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(0, bob);

    // Custom outfit & weapon lookup
    const outfit = AXE_OUTFITS.find((o) => o.id === w.outfitId) || AXE_OUTFITS[0];

    // 1. Back Arm & Huge Battleaxe (when idle or running)
    const attackProgress = w.attackTimer > 0 ? 1 - w.attackTimer / 0.38 : 0;
    const specialProgress = w.attackType === 'special' ? 1 - w.attackTimer / 0.5 : 0;

    // Draw axe
    this.drawBattleAxe(ctx, w, attackProgress, specialProgress, time);

    // 2. Heavy Armored Legs & Boots
    // Back leg
    ctx.fillStyle = outfit.colors.secondary;
    ctx.fillRect(-18 + legSwing * 0.4, -28, 14, 20);
    // Back Boot
    ctx.fillStyle = outfit.colors.primary;
    ctx.fillRect(-22 + legSwing * 0.4, -12, 18, 12);
    ctx.fillStyle = outfit.colors.accent; // Boot steel toe cap
    ctx.fillRect(-12 + legSwing * 0.4, -8, 10, 8);

    // Front leg
    ctx.fillStyle = outfit.colors.secondary;
    ctx.fillRect(4 - legSwing * 0.4, -28, 14, 20);
    // Front Boot
    ctx.fillStyle = outfit.colors.primary;
    ctx.fillRect(0 - legSwing * 0.4, -12, 20, 12);
    ctx.fillStyle = outfit.colors.accent;
    ctx.fillRect(10 - legSwing * 0.4, -8, 12, 8);

    // 3. Bulky Torso / Studded Armor
    ctx.fillStyle = outfit.colors.primary; // Main tunic / armor body
    ctx.beginPath();
    ctx.roundRect(-24, -68, 48, 42, 8);
    ctx.fill();

    // Steel / Dragon Chestplate
    ctx.fillStyle = outfit.colors.secondary;
    ctx.beginPath();
    ctx.roundRect(-18, -65, 36, 26, 6);
    ctx.fill();

    // Golden cross emblem / rivets
    ctx.fillStyle = outfit.colors.accent;
    ctx.fillRect(-3, -62, 6, 20);
    ctx.fillRect(-12, -55, 24, 6);
    // Belt with heavy brass buckle
    ctx.fillStyle = outfit.colors.secondary;
    ctx.fillRect(-24, -34, 48, 8);
    ctx.fillStyle = outfit.colors.accent;
    ctx.fillRect(-8, -36, 16, 12);

    // 4. Large Horned Shoulder Pauldron (front)
    ctx.fillStyle = outfit.colors.secondary;
    ctx.beginPath();
    ctx.arc(-16, -66, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = outfit.colors.accent;
    ctx.beginPath();
    ctx.arc(-16, -66, 6, 0, Math.PI * 2);
    ctx.fill();

    // 5. Head & Braided Beard
    // Head / Face skin
    ctx.fillStyle = '#FFCC80';
    ctx.beginPath();
    ctx.arc(0, -78, 15, 0, Math.PI * 2);
    ctx.fill();

    // Fierce Cartoon Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(2, -81, 7, 6);
    ctx.fillStyle = '#212121';
    ctx.fillRect(5, -80, 4, 5); // Iris looking forward

    // Big Beard styled according to outfit
    const beardBob = Math.sin(time * 8) * 2;
    const beardColor = outfit.colors.hairOrDetail || '#D84315';
    ctx.fillStyle = beardColor;
    ctx.beginPath();
    ctx.moveTo(-16, -74);
    ctx.quadraticCurveTo(-18, -50 + beardBob, -4, -42 + beardBob);
    ctx.quadraticCurveTo(8, -38 + beardBob, 16, -52 + beardBob);
    ctx.quadraticCurveTo(18, -74, 16, -76);
    ctx.closePath();
    ctx.fill();

    // Beard braided bands
    ctx.fillStyle = outfit.colors.accent;
    ctx.fillRect(-6, -46 + beardBob, 12, 4);

    // Mustache
    ctx.fillStyle = beardColor;
    ctx.beginPath();
    ctx.arc(4, -73, 7, 0, Math.PI);
    ctx.fill();

    // 6. Heavy Iron Viking Helmet
    ctx.fillStyle = outfit.colors.secondary;
    ctx.beginPath();
    ctx.arc(0, -82, 17, Math.PI, 0, false);
    ctx.fill();
    // Helmet rim
    ctx.fillStyle = outfit.colors.primary;
    ctx.fillRect(-18, -84, 36, 6);
    // Nose guard
    ctx.fillRect(0, -84, 6, 10);

    // Curved Horns / Spikes styled according to outfit!
    const hornColor = outfit.colors.capeOrHorns || '#ECEFF1';
    // Left Horn
    ctx.fillStyle = hornColor;
    ctx.beginPath();
    ctx.moveTo(-14, -84);
    ctx.quadraticCurveTo(-34, -92, -30, -112);
    ctx.quadraticCurveTo(-22, -95, -10, -89);
    ctx.closePath();
    ctx.fill();

    // Right Horn
    ctx.fillStyle = hornColor;
    ctx.beginPath();
    ctx.moveTo(10, -89);
    ctx.quadraticCurveTo(22, -95, 30, -112);
    ctx.quadraticCurveTo(34, -92, 14, -84);
    ctx.closePath();
    ctx.fill();

    // Accent rings around horn base
    ctx.fillStyle = outfit.colors.accent;
    ctx.fillRect(-16, -88, 7, 4);
    ctx.fillRect(9, -88, 7, 4);

    ctx.restore();
  }

  /** Draw Axe Weapon and dynamic swinging arcs with equipped weapon style */
  private static drawBattleAxe(
    ctx: CanvasRenderingContext2D,
    w: Warrior,
    attackProgress: number,
    specialProgress: number,
    time: number,
  ) {
    const wep = AXE_WEAPONS.find((item) => item.id === w.weaponId) || AXE_WEAPONS[0];

    ctx.save();

    let axeAngle = 0.3; // Default idle rest angle
    let axeX = 14;
    let axeY = -56;

    if (w.isAttacking && w.attackType === 'melee') {
      // Melee attack: Overhead windup into a devastating forward slash!
      if (attackProgress < 0.3) {
        axeAngle = -1.2 + attackProgress * 0.8;
      } else {
        const t = (attackProgress - 0.3) / 0.7;
        axeAngle = -0.9 + t * 2.8;
        axeX = 14 + t * 24;
      }

      // Draw dynamic cartoon swoosh slash trail!
      if (attackProgress > 0.25 && attackProgress < 0.85) {
        ctx.save();
        ctx.strokeStyle = wep.colors.glow || '#FFE082';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(10, -60, 68, -0.6, 1.4);
        ctx.stroke();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(10, -60, 68, -0.4, 1.3);
        ctx.stroke();
        ctx.restore();
      }
    } else if (w.attackType === 'special') {
      // Ground smash: high overhead, then brutal downward slam into earth!
      if (specialProgress < 0.4) {
        axeAngle = -1.8;
        axeY = -72;
      } else {
        axeAngle = 1.3;
        axeX = 26;
        axeY = -28;
      }
    } else {
      // Idle / Run gentle swing
      axeAngle += Math.sin(time * 6) * 0.15;
    }

    ctx.translate(axeX, axeY);
    ctx.rotate(axeAngle);

    // Thick handle
    ctx.fillStyle = '#4E342E';
    ctx.fillRect(-4, -64, 8, 76);

    // Grip wrapping
    ctx.fillStyle = wep.colors.accent;
    ctx.fillRect(-5, -28, 10, 24);

    // Double-bitted massive axe head
    const grad = ctx.createLinearGradient(-35, -70, 35, -45);
    grad.addColorStop(0, wep.colors.primary);
    grad.addColorStop(0.5, wep.colors.secondary);
    grad.addColorStop(1, wep.colors.primary);
    ctx.fillStyle = grad;

    // Front blade
    ctx.beginPath();
    ctx.moveTo(0, -66);
    ctx.quadraticCurveTo(28, -78, 36, -58);
    ctx.quadraticCurveTo(28, -34, 0, -42);
    ctx.closePath();
    ctx.fill();

    // Sharp glowing cutting edge
    ctx.strokeStyle = wep.colors.accent;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(34, -76);
    ctx.quadraticCurveTo(40, -58, 32, -36);
    ctx.stroke();

    // Back blade
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -66);
    ctx.quadraticCurveTo(-26, -76, -32, -58);
    ctx.quadraticCurveTo(-24, -36, 0, -42);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = wep.colors.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-30, -74);
    ctx.quadraticCurveTo(-36, -58, -28, -38);
    ctx.stroke();

    // Central runic ring on axe head
    ctx.fillStyle = wep.colors.accent;
    ctx.beginPath();
    ctx.arc(0, -54, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, -54, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * --- MAGIC ARCHER (Магический лучник) ---
   * Nimble, hooded elven cloak, elegant recurve bow, glowing crystal magic staff
   */
  private static drawMagicArcher(ctx: CanvasRenderingContext2D, w: Warrior, time: number) {
    const isMoving = Math.abs(w.vx) > 0.5 && w.isGrounded;
    const bob = isMoving ? Math.sin(time * 14) * 3 : Math.sin(time * 4) * 1.5;
    const legSwing = isMoving ? Math.sin(time * 14) * 14 : 0;
    const isDefeated = w.hp <= 0;

    if (isDefeated) {
      this.drawDefeatedMagicArcher(ctx, time);
      return;
    }

    // Shadow on ground
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(0, bob);

    // Custom outfit & weapon lookup
    const outfit = ARCHER_OUTFITS.find((o) => o.id === w.outfitId) || ARCHER_OUTFITS[0];

    // 1. Back Magic Staff (Carried on back / off-hand)
    this.drawMagicStaff(ctx, w, time);

    // 2. Fluttering Cape (Behind character)
    const capeFlutter = isMoving ? Math.sin(time * 16) * 12 : Math.sin(time * 4) * 4;
    ctx.fillStyle = outfit.colors.capeOrHorns || outfit.colors.primary;
    ctx.beginPath();
    ctx.moveTo(-10, -64);
    ctx.quadraticCurveTo(-30 - capeFlutter, -40, -22 - capeFlutter * 1.2, -10);
    ctx.lineTo(-6, -42);
    ctx.closePath();
    ctx.fill();

    // 3. Nimble Boots & Trousers
    // Back leg
    ctx.fillStyle = outfit.colors.secondary;
    ctx.fillRect(-12 + legSwing * 0.5, -26, 10, 18);
    ctx.fillStyle = '#3E2723'; // Leather riding boot
    ctx.fillRect(-15 + legSwing * 0.5, -12, 14, 12);

    // Front leg
    ctx.fillStyle = outfit.colors.secondary;
    ctx.fillRect(4 - legSwing * 0.5, -26, 10, 18);
    ctx.fillStyle = '#4E342E';
    ctx.fillRect(1 - legSwing * 0.5, -12, 15, 12);
    ctx.fillStyle = outfit.colors.accent; // Ankle buckle
    ctx.fillRect(3 - legSwing * 0.5, -7, 4, 3);

    // 4. Slender Body & Magic Archer Tunic
    ctx.fillStyle = outfit.colors.primary; // Vibrant tunic
    ctx.beginPath();
    ctx.roundRect(-14, -62, 28, 38, 6);
    ctx.fill();

    // Golden filigree trim & sash
    ctx.fillStyle = outfit.colors.accent;
    ctx.fillRect(-14, -40, 28, 5);
    ctx.beginPath();
    ctx.arc(0, -40, 5, 0, Math.PI * 2);
    ctx.fill();

    // Quiver with arrows on back
    ctx.fillStyle = outfit.colors.secondary;
    ctx.fillRect(-18, -60, 9, 24);
    // Arrow fletchings (white and accent feathers)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-19, -68, 4, 8);
    ctx.fillStyle = outfit.colors.accent;
    ctx.fillRect(-14, -70, 4, 10);

    // 5. Head, Elven Face & Hood
    // Neck / Chin
    ctx.fillStyle = '#FFE0B2';
    ctx.beginPath();
    ctx.arc(2, -68, 11, 0, Math.PI * 2);
    ctx.fill();

    // Large Cartoon Eye (Keen archer eye)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(4, -72, 7, 7);
    ctx.fillStyle = outfit.colors.glow || '#00B0FF'; // Glowing iris
    ctx.fillRect(6, -71, 4, 5);
    ctx.fillStyle = '#000000';
    ctx.fillRect(8, -70, 2, 3);

    // Pointed Elven Ear
    ctx.fillStyle = '#FFCC80';
    ctx.beginPath();
    ctx.moveTo(-4, -69);
    ctx.lineTo(-14, -75);
    ctx.lineTo(-4, -65);
    ctx.closePath();
    ctx.fill();

    // Hood / Cloak (Framing face)
    ctx.fillStyle = outfit.colors.primary;
    ctx.beginPath();
    ctx.arc(0, -72, 15, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();
    // Hood Peak
    ctx.beginPath();
    ctx.moveTo(-12, -80);
    ctx.lineTo(-24, -90);
    ctx.lineTo(-4, -84);
    ctx.closePath();
    ctx.fill();

    // Hair bang visible from under hood
    ctx.fillStyle = outfit.colors.hairOrDetail || '#FDE047';
    ctx.beginPath();
    ctx.moveTo(-6, -78);
    ctx.lineTo(2, -72);
    ctx.lineTo(-2, -68);
    ctx.closePath();
    ctx.fill();

    // 6. Recurve Bow (Front hand)
    this.drawRecurveBow(ctx, w, time);

    ctx.restore();
  }

  /** Draw Recurve Bow and arrow loading */
  private static drawRecurveBow(ctx: CanvasRenderingContext2D, w: Warrior, time: number) {
    const wep = ARCHER_WEAPONS.find((item) => item.id === w.weaponId) || ARCHER_WEAPONS[0];

    ctx.save();
    let bowAngle = 0;
    let bowX = 14;
    let bowY = -48;
    const isAttacking = w.isAttacking && w.attackType === 'melee'; // normal bow shot
    const progress = isAttacking ? 1 - w.attackTimer / 0.42 : 0;

    if (isAttacking) {
      bowAngle = -0.1 + progress * 0.1;
      bowX += 4;
    }

    ctx.translate(bowX, bowY);
    ctx.rotate(bowAngle);

    // Outer bow glow/shine
    ctx.strokeStyle = wep.colors.glow || '#D7CCC8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 36, -Math.PI * 0.45, Math.PI * 0.45);
    ctx.stroke();

    // Bow body
    ctx.strokeStyle = wep.colors.primary;
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.arc(0, 0, 34, -Math.PI * 0.38, Math.PI * 0.38);
    ctx.stroke();

    // Tip reinforcements
    ctx.fillStyle = wep.colors.accent;
    ctx.fillRect(8, -32, 6, 6);
    ctx.fillRect(8, 26, 6, 6);

    // Bowstring
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (isAttacking && progress < 0.6) {
      const pull = 16 * (progress / 0.6);
      ctx.moveTo(11, -29);
      ctx.lineTo(11 - pull, 0);
      ctx.lineTo(11, 29);

      // Glowing Nocked Arrow
      ctx.save();
      ctx.strokeStyle = wep.colors.accent;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(11 - pull, 0);
      ctx.lineTo(26 - pull, 0);
      ctx.stroke();
      // Arrowhead
      ctx.fillStyle = wep.colors.glow || '#00E5FF';
      ctx.beginPath();
      ctx.moveTo(26 - pull, 0);
      ctx.lineTo(22 - pull, -4);
      ctx.lineTo(22 - pull, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else {
      ctx.moveTo(11, -29);
      ctx.lineTo(11, 29);
    }
    ctx.stroke();

    ctx.restore();
  }

  /** Draw Magic Staff */
  private static drawMagicStaff(ctx: CanvasRenderingContext2D, w: Warrior, time: number) {
    const wep = ARCHER_WEAPONS.find((item) => item.id === w.weaponId) || ARCHER_WEAPONS[0];

    ctx.save();
    const isCasting = w.attackType === 'magic';
    let staffAngle = -0.3;
    let staffX = -10;
    let staffY = -52;

    if (isCasting) {
      staffAngle = -0.9;
      staffX = 6;
      staffY = -68;
    }

    ctx.translate(staffX, staffY);
    ctx.rotate(staffAngle);

    // Staff shaft
    ctx.fillStyle = wep.colors.secondary || '#4E342E';
    ctx.fillRect(-3, -55, 6, 75);

    // Crystal Prongs at top
    ctx.fillStyle = wep.colors.accent;
    ctx.beginPath();
    ctx.arc(0, -56, 8, 0, Math.PI);
    ctx.fill();

    // Floating Arcane Crystal Orb
    const pulse = 1 + Math.sin(time * 10) * 0.18;
    const crystalGrad = ctx.createRadialGradient(0, -66, 2, 0, -66, 12 * pulse);
    crystalGrad.addColorStop(0, '#FFFFFF');
    crystalGrad.addColorStop(0.3, wep.colors.accent);
    crystalGrad.addColorStop(0.7, wep.colors.glow || '#7C4DFF');
    crystalGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = crystalGrad;
    ctx.beginPath();
    ctx.arc(0, -66, 12 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Core Gem
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, -66, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting mini magical stars when casting
    if (isCasting) {
      for (let i = 0; i < 3; i++) {
        const oAngle = time * 12 + (i * Math.PI * 2) / 3;
        const ox = Math.cos(oAngle) * 16;
        const oy = -66 + Math.sin(oAngle) * 8;
        ctx.fillStyle = wep.colors.accent;
        ctx.beginPath();
        ctx.arc(ox, oy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  /** Draw Shimmering Magic Shield Sphere */
  private static drawShieldBubble(ctx: CanvasRenderingContext2D, w: Warrior, time: number) {
    ctx.save();
    const cx = w.x + w.width / 2;
    const cy = w.y + w.height / 2;
    const radius = 54;

    // Outer pulsating glow
    const pulse = 1 + Math.sin(time * 8) * 0.05;
    const shieldGrad = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius * pulse);
    shieldGrad.addColorStop(0, 'rgba(0, 229, 255, 0.08)');
    shieldGrad.addColorStop(0.7, 'rgba(124, 77, 255, 0.22)');
    shieldGrad.addColorStop(0.95, 'rgba(0, 229, 255, 0.6)');
    shieldGrad.addColorStop(1, 'rgba(255, 255, 255, 0.8)');

    ctx.fillStyle = shieldGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Shield rim outline
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * pulse, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating hexagon rune outlines inside the sphere
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(time * 1.5);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const hx = Math.cos(a) * (radius * 0.7);
      const hy = Math.sin(a) * (radius * 0.7);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  /** Cartoon Defeated pose for Axe Warrior with dizzy spinning stars */
  private static drawDefeatedAxeWarrior(ctx: CanvasRenderingContext2D, time: number) {
    ctx.save();
    // Sitting knocked out on the floor
    ctx.rotate(0.3);
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.roundRect(-20, -42, 40, 36, 8);
    ctx.fill();

    // Legs stretched forward
    ctx.fillStyle = '#37474F';
    ctx.fillRect(8, -14, 26, 12);

    // Head tilted back
    ctx.fillStyle = '#FFCC80';
    ctx.beginPath();
    ctx.arc(0, -56, 15, 0, Math.PI * 2);
    ctx.fill();

    // Helmet askew
    ctx.fillStyle = '#455A64';
    ctx.beginPath();
    ctx.arc(3, -64, 16, Math.PI, 0);
    ctx.fill();

    // X_X cartoon knockout eyes
    ctx.strokeStyle = '#212121';
    ctx.lineWidth = 2.5;
    [-4, 6].forEach((ex) => {
      ctx.beginPath();
      ctx.moveTo(ex - 3, -58);
      ctx.lineTo(ex + 3, -52);
      ctx.moveTo(ex + 3, -58);
      ctx.lineTo(ex - 3, -52);
      ctx.stroke();
    });

    // Spinning Yellow Cartoon Stars around head
    for (let i = 0; i < 3; i++) {
      const starAngle = time * 5 + (i * Math.PI * 2) / 3;
      const sx = Math.cos(starAngle) * 28;
      const sy = -75 + Math.sin(starAngle) * 10;
      this.drawCartoonStar(ctx, sx, sy, 7, '#FFD600');
    }

    ctx.restore();
  }

  /** Cartoon Defeated pose for Magic Archer */
  private static drawDefeatedMagicArcher(ctx: CanvasRenderingContext2D, time: number) {
    ctx.save();
    ctx.rotate(-0.25);
    ctx.fillStyle = '#00897B';
    ctx.beginPath();
    ctx.roundRect(-16, -38, 32, 34, 6);
    ctx.fill();

    // Legs sprawled
    ctx.fillStyle = '#283593';
    ctx.fillRect(-24, -12, 24, 10);

    // Head slumped
    ctx.fillStyle = '#FFE0B2';
    ctx.beginPath();
    ctx.arc(0, -52, 12, 0, Math.PI * 2);
    ctx.fill();

    // Dazed spiral eyes
    ctx.strokeStyle = '#00B0FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(3, -52, 4, 0, Math.PI * 2);
    ctx.stroke();

    // Spinning Stars & Sparkles
    for (let i = 0; i < 3; i++) {
      const starAngle = time * 4.5 + (i * Math.PI * 2) / 3;
      const sx = Math.cos(starAngle) * 24;
      const sy = -70 + Math.sin(starAngle) * 8;
      this.drawCartoonStar(ctx, sx, sy, 6, '#00E5FF');
    }

    ctx.restore();
  }

  /** Helper to draw a cartoon 5-pointed star */
  private static drawCartoonStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    color: string,
  ) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const ai = a + Math.PI / 5;
      const x1 = cx + Math.cos(a) * r;
      const y1 = cy + Math.sin(a) * r;
      const x2 = cx + Math.cos(ai) * (r * 0.45);
      const y2 = cy + Math.sin(ai) * (r * 0.45);
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /** Render Projectiles: Arrows, Magic Orbs, and Earth Shockwaves */
  public static drawProjectiles(ctx: CanvasRenderingContext2D, projectiles: Projectile[], time: number) {
    projectiles.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.type === 'arrow') {
        // --- Flying Arrow with trailing glow ---
        ctx.rotate(p.angle);

        // Trail
        ctx.strokeStyle = 'rgba(255, 235, 59, 0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-18, 0);
        ctx.lineTo(-4, 0);
        ctx.stroke();

        // Wooden shaft
        ctx.fillStyle = '#8D6E63';
        ctx.fillRect(-12, -2, 24, 4);

        // Feathers (Turquoise & White)
        ctx.fillStyle = '#00E5FF';
        ctx.beginPath();
        ctx.moveTo(-12, -2);
        ctx.lineTo(-18, -6);
        ctx.lineTo(-14, -2);
        ctx.lineTo(-18, 6);
        ctx.lineTo(-12, 2);
        ctx.closePath();
        ctx.fill();

        // Steel / Magic Arrowhead
        ctx.fillStyle = '#ECEFF1';
        ctx.beginPath();
        ctx.moveTo(12, -5);
        ctx.lineTo(20, 0);
        ctx.lineTo(12, 5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#00B0FF';
        ctx.fillRect(8, -2, 4, 4);
      } else if (p.type === 'magic_orb') {
        // --- Arcane Staff Magic Orb ---
        const pulse = 1 + Math.sin(time * 16) * 0.2;
        const r = 18 * pulse;

        // Radiant Outer Flare
        const flare = ctx.createRadialGradient(0, 0, 4, 0, 0, r);
        flare.addColorStop(0, '#FFFFFF');
        flare.addColorStop(0.3, '#E040FB');
        flare.addColorStop(0.7, '#7C4DFF');
        flare.addColorStop(1, 'rgba(124, 77, 255, 0)');

        ctx.fillStyle = flare;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Whirling Arcane Rings
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.7, r * 0.3, time * 8, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'shockwave') {
        // --- Ground Smash Energy Wave ---
        // Travels along ground with jagged earthen spikes and glowing shock crests
        const dir = p.vx > 0 ? 1 : -1;
        ctx.scale(dir, 1);

        // Energy Shock Arc
        const shockGrad = ctx.createLinearGradient(0, -35, 30, 0);
        shockGrad.addColorStop(0, '#FFF59D'); // Bright golden crest
        shockGrad.addColorStop(0.5, '#FF9800'); // Fiery orange
        shockGrad.addColorStop(1, '#D84315'); // Deep earthen magma

        ctx.fillStyle = shockGrad;
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.quadraticCurveTo(5, -45, 25, 0);
        ctx.lineTo(15, 0);
        ctx.quadraticCurveTo(0, -25, -10, 0);
        ctx.closePath();
        ctx.fill();

        // Jagged cartoon earth rocks erupting
        ctx.fillStyle = '#5D4037';
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(8, -28);
        ctx.lineTo(16, 0);
        ctx.closePath();
        ctx.fill();

        // Glowing spark crest
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(10, -34, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  /** Render Particles & Hit Splats */
  public static drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
    particles.forEach((p) => {
      ctx.save();
      const progress = p.life / p.maxLife; // 1 down to 0
      ctx.globalAlpha = Math.max(0, Math.min(1, progress * p.alpha));

      if (p.shape === 'text' && p.text) {
        // Comic pop text ("БАМ!", "ВЖУХ!", "БУМ!", damage number)
        ctx.font = `bold ${Math.round(p.size * (p.scale || 1))}px 'Fredoka', system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Dark outline for contrast
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 4;
        ctx.strokeText(p.text, p.x, p.y);

        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y);
      } else if (p.shape === 'star') {
        this.drawCartoonStar(ctx, p.x, p.y, p.size * progress, p.color);
      } else if (p.shape === 'rock') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * progress, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Circular spark / poof
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.size * progress), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }
}
