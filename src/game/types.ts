export type GameMode = 'pve' | 'pvp';
export type AIDifficulty = 'normal' | 'hard';
export type WarriorType = 'axe' | 'archer';

export type ArenaTheme = 'mystic_twilight' | 'crimson_colosseum' | 'emerald_sanctuary' | 'frozen_citadel';

export type GameStatus = 'MENU' | 'PLAYING' | 'VICTORY';

export interface AbilityCooldown {
  name: string;
  key: string;
  cooldown: number; // in seconds
  current: number; // remaining cooldown
  icon: string;
}

export interface Warrior {
  id: 'p1' | 'p2';
  type: WarriorType;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  facing: 1 | -1; // 1 = right, -1 = left
  hp: number;
  maxHp: number;
  prevHp: number; // for smooth health drop animations
  isHit: boolean;
  hitTimer: number;
  isAttacking: boolean;
  attackTimer: number;
  attackType: 'melee' | 'special' | 'magic' | null;
  shieldActive: boolean;
  shieldTimer: number;
  shieldHp: number;
  state: 'idle' | 'run' | 'jump' | 'attack' | 'special' | 'hit' | 'defeated';
  animFrame: number;
  animTimer: number;
  // Customization
  outfitId?: string;
  weaponId?: string;
  // Stats
  speed: number;
  jumpForce: number;
  cooldowns: {
    primary: number;
    special: number;
    shield?: number;
  };
  stats: {
    damageDealt: number;
    hitsTaken: number;
    shieldsBlocked: number;
  };
}

export interface Projectile {
  id: string;
  ownerId: 'p1' | 'p2';
  type: 'arrow' | 'magic_orb' | 'shockwave';
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  damage: number;
  life: number;
  maxLife: number;
  angle: number;
  homingTarget?: 'p1' | 'p2';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'star' | 'rock' | 'sparkle' | 'text';
  text?: string;
  scale?: number;
}

export interface ArenaPlatform {
  x: number;
  y: number;
  width: number;
  height: number;
  isOneWay?: boolean;
}
