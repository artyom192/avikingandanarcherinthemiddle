import {
  Warrior,
  WarriorType,
  Projectile,
  Particle,
  GameStatus,
  GameMode,
  AIDifficulty,
  ArenaTheme,
} from './types';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GRAVITY,
  FLOOR_Y,
  ARENA_PLATFORMS,
  WARRIOR_CONFIGS,
} from './constants';
import { sound } from './sound';
import { BattleAI } from './ai';

export interface GameEngineListeners {
  onStateChange?: (status: GameStatus) => void;
  onHpUpdate?: (p1Hp: number, p2Hp: number) => void;
}

export class GameEngine {
  public status: GameStatus = 'MENU';
  public mode: GameMode = 'pve';
  public difficulty: AIDifficulty = 'normal';
  public player1Hero: WarriorType = 'axe';
  public winner: Warrior | null = null;

  // Customization & Theme
  public currentTheme: ArenaTheme = 'mystic_twilight';
  public axeOutfit: string = 'viking';
  public axeWeapon: string = 'classic_axe';
  public archerOutfit: string = 'emerald_ranger';
  public archerWeapon: string = 'classic_bow';

  public p1!: Warrior;
  public p2!: Warrior;
  public projectiles: Projectile[] = [];
  public particles: Particle[] = [];

  public screenShake: number = 0;
  public gameTime: number = 0;

  private aiController: BattleAI = new BattleAI();
  private keysDown: Set<string> = new Set();
  private listeners: GameEngineListeners = {};

  constructor(listeners?: GameEngineListeners) {
    if (listeners) this.listeners = listeners;
    this.initMatch('pve', 'axe', 'normal');
  }

  public setTheme(theme: ArenaTheme) {
    this.currentTheme = theme;
  }

  public setCustomization(type: WarriorType, outfitId: string, weaponId: string) {
    if (type === 'axe') {
      this.axeOutfit = outfitId;
      this.axeWeapon = weaponId;
    } else {
      this.archerOutfit = outfitId;
      this.archerWeapon = weaponId;
    }

    if (this.p1 && this.p1.type === type) {
      this.p1.outfitId = outfitId;
      this.p1.weaponId = weaponId;
    }
    if (this.p2 && this.p2.type === type) {
      this.p2.outfitId = outfitId;
      this.p2.weaponId = weaponId;
    }
  }

  public setListeners(listeners: GameEngineListeners) {
    this.listeners = listeners;
  }

  /** Initialize or reset a match */
  public initMatch(mode: GameMode = this.mode, p1Type: WarriorType = this.player1Hero, difficulty: AIDifficulty = this.difficulty) {
    this.mode = mode;
    this.difficulty = difficulty;
    this.player1Hero = p1Type;
    this.status = 'PLAYING';
    this.winner = null;
    this.projectiles = [];
    this.particles = [];
    this.screenShake = 0;

    // Determine types for P1 and P2
    const p2Type: WarriorType = p1Type === 'axe' ? 'archer' : 'axe';

    this.p1 = this.createWarrior('p1', p1Type, 180, FLOOR_Y - 120, 1);
    this.p2 = this.createWarrior('p2', p2Type, GAME_WIDTH - 250, FLOOR_Y - 120, -1);

    if (this.listeners.onStateChange) this.listeners.onStateChange('PLAYING');
    if (this.listeners.onHpUpdate) this.listeners.onHpUpdate(this.p1.hp, this.p2.hp);
  }

  private createWarrior(id: 'p1' | 'p2', type: WarriorType, x: number, y: number, facing: 1 | -1): Warrior {
    const config = WARRIOR_CONFIGS[type];
    return {
      id,
      type,
      name: config.name,
      x,
      y,
      vx: 0,
      vy: 0,
      width: config.width,
      height: config.height,
      isGrounded: false,
      facing,
      hp: config.maxHp,
      maxHp: config.maxHp,
      prevHp: config.maxHp,
      isHit: false,
      hitTimer: 0,
      isAttacking: false,
      attackTimer: 0,
      attackType: null,
      shieldActive: false,
      shieldTimer: 0,
      shieldHp: 0,
      state: 'idle',
      animFrame: 0,
      animTimer: 0,
      outfitId: type === 'axe' ? this.axeOutfit : this.archerOutfit,
      weaponId: type === 'axe' ? this.axeWeapon : this.archerWeapon,
      speed: config.speed,
      jumpForce: config.jumpForce,
      cooldowns: {
        primary: 0,
        special: 0,
        shield: type === 'archer' ? 0 : undefined,
      },
      stats: {
        damageDealt: 0,
        hitsTaken: 0,
        shieldsBlocked: 0,
      },
    };
  }

  // --- Input Handling ---

  public handleKeyDown(code: string) {
    this.keysDown.add(code);
  }

  public handleKeyUp(code: string) {
    this.keysDown.delete(code);
  }

  public isKeyPressed(code: string): boolean {
    return this.keysDown.has(code);
  }

  // --- Main Tick Update ---

  public update(dt: number) {
    this.gameTime += dt;

    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 25);
    }

    if (this.status !== 'PLAYING') {
      // Just update victory particles/animations
      this.updateParticles(dt);
      return;
    }

    // 1. Process Player 1 Controls (WASD + F/G)
    this.processP1Input(dt);

    // 2. Process Player 2 Controls (PvP Keyboard OR PvE AI)
    if (this.mode === 'pvp') {
      this.processP2Input(dt);
    } else {
      const aiAction = this.aiController.update(
        this.p2,
        this.p1,
        this.projectiles,
        this.difficulty,
        dt,
      );
      this.applyAIAction(this.p2, aiAction, dt);
    }

    // 3. Update Physics & Cooldowns
    this.updateWarriorPhysics(this.p1, dt);
    this.updateWarriorPhysics(this.p2, dt);

    // 4. Update Projectiles & Collisions
    this.updateProjectiles(dt);

    // 5. Update Particles
    this.updateParticles(dt);

    // 6. Check Win Condition
    this.checkMatchOutcome();

    // 7. Fire HP listeners if changed
    if (this.listeners.onHpUpdate) {
      this.listeners.onHpUpdate(this.p1.hp, this.p2.hp);
    }
  }

  /** Player 1 controls */
  private processP1Input(_dt: number) {
    if (this.p1.hp <= 0) return;

    // Movement
    if (this.isKeyPressed('KeyA')) {
      this.p1.vx = -this.p1.speed;
      this.p1.facing = -1;
    } else if (this.isKeyPressed('KeyD')) {
      this.p1.vx = this.p1.speed;
      this.p1.facing = 1;
    } else {
      this.p1.vx *= 0.75;
      if (Math.abs(this.p1.vx) < 0.1) this.p1.vx = 0;
    }

    // Jump
    if ((this.isKeyPressed('KeyW') || this.isKeyPressed('Space')) && this.p1.isGrounded) {
      this.p1.vy = this.p1.jumpForce;
      this.p1.isGrounded = false;
      sound.playJump();
      this.spawnDust(this.p1.x + this.p1.width / 2, this.p1.y + this.p1.height);
    }

    // Attacks & Abilities
    if (this.p1.type === 'axe') {
      // Primary: Axe Melee (KeyF)
      if (this.isKeyPressed('KeyF')) {
        this.triggerAxeMelee(this.p1, this.p2);
      }
      // Special: Earth Shockwave (KeyG)
      if (this.isKeyPressed('KeyG')) {
        this.triggerAxeSpecial(this.p1);
      }
    } else {
      // Archer: Bow Shot (KeyF)
      if (this.isKeyPressed('KeyF')) {
        this.triggerArcherBow(this.p1);
      }
      // Special: Magic Blast (KeyG)
      if (this.isKeyPressed('KeyG')) {
        this.triggerArcherMagic(this.p1);
      }
      // Ability: Shield (KeyH or KeyR)
      if (this.isKeyPressed('KeyH') || this.isKeyPressed('KeyR')) {
        this.triggerArcherShield(this.p1);
      }
    }
  }

  /** Player 2 controls (PvP Mode on Keyboard) */
  private processP2Input(_dt: number) {
    if (this.p2.hp <= 0) return;

    // Movement
    if (this.isKeyPressed('ArrowLeft')) {
      this.p2.vx = -this.p2.speed;
      this.p2.facing = -1;
    } else if (this.isKeyPressed('ArrowRight')) {
      this.p2.vx = this.p2.speed;
      this.p2.facing = 1;
    } else {
      this.p2.vx *= 0.75;
      if (Math.abs(this.p2.vx) < 0.1) this.p2.vx = 0;
    }

    // Jump
    if (this.isKeyPressed('ArrowUp') && this.p2.isGrounded) {
      this.p2.vy = this.p2.jumpForce;
      this.p2.isGrounded = false;
      sound.playJump();
      this.spawnDust(this.p2.x + this.p2.width / 2, this.p2.y + this.p2.height);
    }

    // Attacks & Abilities for P2
    if (this.p2.type === 'axe') {
      if (this.isKeyPressed('KeyK') || this.isKeyPressed('Numpad1') || this.isKeyPressed('Digit1')) {
        this.triggerAxeMelee(this.p2, this.p1);
      }
      if (this.isKeyPressed('KeyL') || this.isKeyPressed('Numpad2') || this.isKeyPressed('Digit2')) {
        this.triggerAxeSpecial(this.p2);
      }
    } else {
      // Archer
      if (this.isKeyPressed('KeyK') || this.isKeyPressed('Numpad1') || this.isKeyPressed('Digit1')) {
        this.triggerArcherBow(this.p2);
      }
      if (this.isKeyPressed('KeyL') || this.isKeyPressed('Numpad2') || this.isKeyPressed('Digit2')) {
        this.triggerArcherMagic(this.p2);
      }
      if (this.isKeyPressed('KeyI') || this.isKeyPressed('KeyO') || this.isKeyPressed('Numpad3') || this.isKeyPressed('Digit3')) {
        this.triggerArcherShield(this.p2);
      }
    }
  }

  /** Apply AI Bot actions to P2 */
  private applyAIAction(w: Warrior, action: { left: boolean; right: boolean; jump: boolean; attackMelee: boolean; attackSpecial: boolean; attackShield?: boolean }, _dt: number) {
    if (w.hp <= 0) return;

    if (action.left) {
      w.vx = -w.speed;
      w.facing = -1;
    } else if (action.right) {
      w.vx = w.speed;
      w.facing = 1;
    } else {
      w.vx *= 0.75;
      if (Math.abs(w.vx) < 0.1) w.vx = 0;
    }

    if (action.jump && w.isGrounded) {
      w.vy = w.jumpForce;
      w.isGrounded = false;
      sound.playJump();
      this.spawnDust(w.x + w.width / 2, w.y + w.height);
    }

    const opponent = w.id === 'p1' ? this.p2 : this.p1;

    if (w.type === 'axe') {
      if (action.attackMelee) this.triggerAxeMelee(w, opponent);
      if (action.attackSpecial) this.triggerAxeSpecial(w);
    } else {
      if (action.attackMelee) this.triggerArcherBow(w);
      if (action.attackSpecial) this.triggerArcherMagic(w);
      if (action.attackShield) this.triggerArcherShield(w);
    }
  }

  // --- Combat Action Triggers ---

  /** Axe Melee Cleave */
  public triggerAxeMelee(attacker: Warrior, target: Warrior) {
    if (attacker.cooldowns.primary > 0 || attacker.hp <= 0) return;
    const cfg = WARRIOR_CONFIGS.axe;

    attacker.cooldowns.primary = cfg.meleeCooldown;
    attacker.isAttacking = true;
    attacker.attackTimer = cfg.meleeCooldown;
    attacker.attackType = 'melee';
    sound.playAxeSwing();

    // Hit detection: frontal check
    const ax = attacker.x + attacker.width / 2;
    const tx = target.x + target.width / 2;
    const dist = Math.abs(tx - ax);
    const facingTarget = (attacker.facing === 1 && tx >= ax - 20) || (attacker.facing === -1 && tx <= ax + 20);
    const yOverlap = Math.abs(attacker.y - target.y) < 70;

    if (dist <= cfg.meleeRange && facingTarget && yOverlap) {
      setTimeout(() => {
        if (attacker.hp <= 0 || target.hp <= 0) return;
        this.applyDamage(target, cfg.meleeDamage, attacker);
        sound.playAxeHit();
        this.screenShake = 6;

        // Knockback
        target.vx = attacker.facing * 7;
        target.vy = -3;

        // Cartoon Splat
        const hitX = target.x + target.width / 2;
        const hitY = target.y + target.height / 2;
        this.spawnComicText(hitX, hitY - 20, 'БАМ!', '#FFD600');
        this.spawnStars(hitX, hitY, 6, '#FF9100');
      }, 100);
    }
  }

  /** Axe Ground Smash Ability */
  public triggerAxeSpecial(attacker: Warrior) {
    if (attacker.cooldowns.special > 0 || attacker.hp <= 0) return;
    const cfg = WARRIOR_CONFIGS.axe;

    attacker.cooldowns.special = cfg.specialCooldown;
    attacker.isAttacking = true;
    attacker.attackTimer = 0.48;
    attacker.attackType = 'special';

    // Delay shockwave launch slightly to align with axe hitting ground
    setTimeout(() => {
      if (attacker.hp <= 0) return;
      sound.playGroundSmash();
      this.screenShake = 10;

      const spawnX = attacker.facing === 1 ? attacker.x + attacker.width + 10 : attacker.x - 10;
      const spawnY = FLOOR_Y - 14;

      this.projectiles.push({
        id: 'shock_' + Math.random().toString(36).substr(2, 6),
        ownerId: attacker.id,
        type: 'shockwave',
        x: spawnX,
        y: spawnY,
        vx: attacker.facing * 9.5,
        vy: 0,
        width: 44,
        height: 48,
        damage: cfg.specialDamage,
        life: 0,
        maxLife: 0.75, // Travels ~450px
        angle: 0,
      });

      // Rock & dust burst at impact point
      this.spawnRocks(spawnX, spawnY, 8);
      this.spawnComicText(attacker.x + attacker.width / 2, attacker.y - 15, 'ТРЕСК!', '#FF5722');
    }, 180);
  }

  /** Archer Bow Arrow Shot */
  public triggerArcherBow(attacker: Warrior) {
    if (attacker.cooldowns.primary > 0 || attacker.hp <= 0) return;
    const cfg = WARRIOR_CONFIGS.archer;

    attacker.cooldowns.primary = cfg.arrowCooldown;
    attacker.isAttacking = true;
    attacker.attackTimer = cfg.arrowCooldown;
    attacker.attackType = 'melee';
    sound.playBowShot();

    const spawnX = attacker.facing === 1 ? attacker.x + attacker.width + 6 : attacker.x - 6;
    const spawnY = attacker.y + 38;

    this.projectiles.push({
      id: 'arrow_' + Math.random().toString(36).substr(2, 6),
      ownerId: attacker.id,
      type: 'arrow',
      x: spawnX,
      y: spawnY,
      vx: attacker.facing * 14.5,
      vy: 0,
      width: 24,
      height: 8,
      damage: cfg.arrowDamage,
      life: 0,
      maxLife: 1.2,
      angle: attacker.facing === 1 ? 0 : Math.PI,
    });
  }

  /** Archer Magic Staff Orb */
  public triggerArcherMagic(attacker: Warrior) {
    if (attacker.cooldowns.special > 0 || attacker.hp <= 0) return;
    const cfg = WARRIOR_CONFIGS.archer;

    attacker.cooldowns.special = cfg.magicCooldown;
    attacker.isAttacking = true;
    attacker.attackTimer = 0.5;
    attacker.attackType = 'magic';
    sound.playMagicCast();

    const spawnX = attacker.facing === 1 ? attacker.x + attacker.width + 12 : attacker.x - 12;
    const spawnY = attacker.y + 24;

    this.projectiles.push({
      id: 'magic_' + Math.random().toString(36).substr(2, 6),
      ownerId: attacker.id,
      type: 'magic_orb',
      x: spawnX,
      y: spawnY,
      vx: attacker.facing * 8.5,
      vy: 0,
      width: 32,
      height: 32,
      damage: cfg.magicDamage,
      life: 0,
      maxLife: 1.6,
      angle: 0,
      homingTarget: attacker.id === 'p1' ? 'p2' : 'p1',
    });

    this.spawnComicText(spawnX, spawnY - 20, 'МАГИЯ!', '#E040FB');
  }

  /** Archer Magic Shield */
  public triggerArcherShield(attacker: Warrior) {
    if (attacker.cooldowns.shield === undefined || attacker.cooldowns.shield > 0 || attacker.hp <= 0) return;
    const cfg = WARRIOR_CONFIGS.archer;

    attacker.cooldowns.shield = cfg.shieldCooldown;
    attacker.shieldActive = true;
    attacker.shieldTimer = cfg.shieldDuration;
    attacker.shieldHp = 50;
    sound.playShieldActivate();

    this.spawnComicText(attacker.x + attacker.width / 2, attacker.y - 18, 'ЩИТ!', '#00E5FF');
  }

  // --- Damage & Hit Calculation ---

  private applyDamage(target: Warrior, amount: number, attacker: Warrior) {
    let finalDamage = amount;

    // Check Magic Shield reduction
    if (target.shieldActive) {
      sound.playShieldBlock();
      finalDamage = Math.round(amount * 0.25); // 75% absorption
      target.stats.shieldsBlocked += 1;
      this.spawnComicText(target.x + target.width / 2, target.y - 25, 'БЛОК!', '#00E5FF');
    }

    target.prevHp = target.hp;
    target.hp = Math.max(0, target.hp - finalDamage);
    target.isHit = true;
    target.hitTimer = 0.22;
    target.stats.hitsTaken += 1;
    attacker.stats.damageDealt += finalDamage;

    // Floating damage number
    this.spawnDamageNumber(
      target.x + target.width / 2 + (Math.random() * 20 - 10),
      target.y + 10,
      finalDamage,
      finalDamage >= 20 ? '#FF1744' : '#FFD600',
    );
  }

  // --- Projectile Physics & Collisions ---

  private updateProjectiles(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life += dt;

      // Homing for magic orb
      if (p.type === 'magic_orb' && p.homingTarget) {
        const target = p.homingTarget === 'p1' ? this.p1 : this.p2;
        const targetCy = target.y + target.height / 2;
        const dy = targetCy - p.y;
        p.vy += Math.sign(dy) * 22 * dt;
        p.vy = Math.max(-5, Math.min(5, p.vy));
      }

      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;

      // Projectile particle trail
      if (p.type === 'magic_orb') {
        this.particles.push({
          x: p.x + (Math.random() * 12 - 6),
          y: p.y + (Math.random() * 12 - 6),
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: 4 + Math.random() * 3,
          color: Math.random() > 0.5 ? '#E040FB' : '#00E5FF',
          alpha: 0.8,
          life: 0.35,
          maxLife: 0.35,
          shape: 'circle',
        });
      } else if (p.type === 'shockwave') {
        this.particles.push({
          x: p.x + (Math.random() * 16 - 8),
          y: p.y - 6,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 3,
          size: 3 + Math.random() * 4,
          color: '#FF9800',
          alpha: 0.7,
          life: 0.3,
          maxLife: 0.3,
          shape: 'rock',
        });
      }

      // Check boundary or life expiry
      if (p.life >= p.maxLife || p.x < -50 || p.x > GAME_WIDTH + 50) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Check collision with opponent
      const target = p.ownerId === 'p1' ? this.p2 : this.p1;
      const attacker = p.ownerId === 'p1' ? this.p1 : this.p2;

      const collides =
        p.x >= target.x - 10 &&
        p.x <= target.x + target.width + 10 &&
        p.y >= target.y &&
        p.y <= target.y + target.height + 15;

      if (collides && target.hp > 0) {
        if (p.type === 'arrow') {
          sound.playArrowHit();
          this.applyDamage(target, p.damage, attacker);
          this.spawnStars(p.x, p.y, 4, '#FFEB3B');
          target.vx += p.vx > 0 ? 3 : -3;
        } else if (p.type === 'magic_orb') {
          sound.playMagicHit();
          this.screenShake = 7;
          this.applyDamage(target, p.damage, attacker);
          this.spawnMagicBurst(p.x, p.y);
          this.spawnComicText(target.x + target.width / 2, target.y - 20, 'БА-БАХ!', '#E040FB');
          target.vx += p.vx > 0 ? 5 : -5;
          target.vy = -3;
        } else if (p.type === 'shockwave') {
          sound.playAxeHit();
          this.screenShake = 8;
          this.applyDamage(target, p.damage, attacker);
          this.spawnRocks(p.x, p.y, 8);
          this.spawnComicText(target.x + target.width / 2, target.y - 20, 'БУМ!', '#FF5722');
          target.vx += p.vx > 0 ? 6 : -6;
          target.vy = -5.5; // Pop into air!
        }

        this.projectiles.splice(i, 1);
      }
    }
  }

  // --- Warrior Physics & Platform Collisions ---

  private updateWarriorPhysics(w: Warrior, dt: number) {
    // Update cooldowns
    if (w.cooldowns.primary > 0) w.cooldowns.primary = Math.max(0, w.cooldowns.primary - dt);
    if (w.cooldowns.special > 0) w.cooldowns.special = Math.max(0, w.cooldowns.special - dt);
    if (w.cooldowns.shield !== undefined && w.cooldowns.shield > 0) {
      w.cooldowns.shield = Math.max(0, w.cooldowns.shield - dt);
    }

    // Shield duration
    if (w.shieldActive) {
      w.shieldTimer -= dt;
      if (w.shieldTimer <= 0) {
        w.shieldActive = false;
      }
    }

    // Hit flash timer
    if (w.isHit) {
      w.hitTimer -= dt;
      if (w.hitTimer <= 0) w.isHit = false;
    }

    // Attack anim timer
    if (w.isAttacking) {
      w.attackTimer -= dt;
      if (w.attackTimer <= 0) {
        w.isAttacking = false;
        w.attackType = null;
      }
    }

    // Gravity
    w.vy += GRAVITY;

    // Apply movement
    w.x += w.vx;
    w.y += w.vy;

    // Platform collisions
    w.isGrounded = false;

    for (const plat of ARENA_PLATFORMS) {
      const feetY = w.y + w.height;
      const prevFeetY = feetY - w.vy;
      const withinX = w.x + w.width * 0.7 > plat.x && w.x + w.width * 0.3 < plat.x + plat.width;

      if (withinX) {
        if (plat.isOneWay) {
          // One-way jump-through platform: only land when falling downwards
          if (w.vy >= 0 && prevFeetY <= plat.y + 6 && feetY >= plat.y) {
            w.y = plat.y - w.height;
            w.vy = 0;
            w.isGrounded = true;
          }
        } else {
          // Solid ground platform
          if (feetY >= plat.y) {
            w.y = plat.y - w.height;
            w.vy = 0;
            w.isGrounded = true;
          }
        }
      }
    }

    // Screen horizontal bounds
    if (w.x < 15) {
      w.x = 15;
      w.vx = 0;
    }
    if (w.x + w.width > GAME_WIDTH - 15) {
      w.x = GAME_WIDTH - 15 - w.width;
      w.vx = 0;
    }
  }

  // --- Particles Management ---

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
      if (p.shape === 'rock') {
        p.vy += 0.3; // Gravity for rocks
      }
    }
  }

  public spawnDamageNumber(x: number, y: number, dmg: number, color: string) {
    this.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -2.8,
      size: 26,
      color,
      alpha: 1,
      life: 0.85,
      maxLife: 0.85,
      shape: 'text',
      text: `-${dmg}`,
    });
  }

  public spawnComicText(x: number, y: number, text: string, color: string) {
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: -1.2,
      size: 28,
      scale: 1.2,
      color,
      alpha: 1,
      life: 0.7,
      maxLife: 0.7,
      shape: 'text',
      text,
    });
  }

  public spawnDust(x: number, y: number) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x: x + (Math.random() * 20 - 10),
        y: y - 2,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 1.5,
        size: 4 + Math.random() * 4,
        color: '#B0BEC5',
        alpha: 0.6,
        life: 0.35,
        maxLife: 0.35,
        shape: 'circle',
      });
    }
  }

  public spawnStars(x: number, y: number, count: number, color: string) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 7 + Math.random() * 5,
        color,
        alpha: 1,
        life: 0.5,
        maxLife: 0.5,
        shape: 'star',
      });
    }
  }

  public spawnRocks(x: number, y: number, count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() * 16 - 8),
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: -3 - Math.random() * 4,
        size: 4 + Math.random() * 5,
        color: Math.random() > 0.5 ? '#6D4C41' : '#8D6E63',
        alpha: 1,
        life: 0.6,
        maxLife: 0.6,
        shape: 'rock',
      });
    }
  }

  public spawnMagicBurst(x: number, y: number) {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 4.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 5,
        color: Math.random() > 0.4 ? '#E040FB' : '#00E5FF',
        alpha: 1,
        life: 0.55,
        maxLife: 0.55,
        shape: 'circle',
      });
    }
  }

  // --- Victory & End Game ---

  private checkMatchOutcome() {
    if (this.p1.hp <= 0 && this.p2.hp <= 0) {
      // Tie breaker: one with greater damage wins
      this.winner = this.p1.stats.damageDealt >= this.p2.stats.damageDealt ? this.p1 : this.p2;
      this.finishMatch();
    } else if (this.p1.hp <= 0) {
      this.winner = this.p2;
      this.finishMatch();
    } else if (this.p2.hp <= 0) {
      this.winner = this.p1;
      this.finishMatch();
    }
  }

  private finishMatch() {
    this.status = 'VICTORY';
    sound.playVictory();
    this.screenShake = 12;

    // Victory celebration confetti
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: GAME_WIDTH / 2 + (Math.random() * 300 - 150),
        y: 120 + (Math.random() * 100 - 50),
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 5,
        size: 8 + Math.random() * 6,
        color: ['#FFD600', '#FF4081', '#00E5FF', '#76FF03', '#FF9100'][Math.floor(Math.random() * 5)],
        alpha: 1,
        life: 2.2,
        maxLife: 2.2,
        shape: 'star',
      });
    }

    if (this.listeners.onStateChange) {
      this.listeners.onStateChange('VICTORY');
    }
  }
}
