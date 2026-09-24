import { ArenaPlatform } from './types';

// Virtual resolution for canvas game coordinates
export const GAME_WIDTH = 1000;
export const GAME_HEIGHT = 560;

export const GRAVITY = 0.58;
export const FLOOR_Y = 460;

export const ARENA_PLATFORMS: ArenaPlatform[] = [
  // Main ground platform
  { x: 0, y: FLOOR_Y, width: GAME_WIDTH, height: GAME_HEIGHT - FLOOR_Y, isOneWay: false },
  // Left elevated combat ledge
  { x: 120, y: 330, width: 220, height: 18, isOneWay: true },
  // Right elevated combat ledge
  { x: 660, y: 330, width: 220, height: 18, isOneWay: true },
  // Central high crystal perch
  { x: 410, y: 220, width: 180, height: 16, isOneWay: true },
];

// Stats & Balancing
export const WARRIOR_CONFIGS = {
  axe: {
    name: 'Воин с топором',
    subtitle: 'Тяжёлый берсерк ближнего боя',
    maxHp: 120,
    width: 68,
    height: 96,
    speed: 4.2,
    jumpForce: -13.5,
    meleeDamage: 14,
    meleeRange: 85,
    meleeCooldown: 0.38,
    specialDamage: 26,
    specialCooldown: 3.5,
  },
  archer: {
    name: 'Магический лучник',
    subtitle: 'Ловкий стрелок и чародей',
    maxHp: 100,
    width: 54,
    height: 88,
    speed: 5.2,
    jumpForce: -14.8,
    arrowDamage: 10,
    arrowCooldown: 0.42,
    magicDamage: 24,
    magicCooldown: 3.2,
    shieldDuration: 2.5,
    shieldCooldown: 6.5,
  },
} as const;

export const ASSET_PATHS = {
  arenaBg: '/src/assets/images/arena_fantasy_colosseum_1790231300588.jpg',
  axePortrait: '/src/assets/images/warrior_axe_portrait_1790231321628.jpg',
  archerPortrait: '/src/assets/images/warrior_archer_portrait_1790231337341.jpg',
};
