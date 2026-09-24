import { ArenaTheme, WarriorType } from './types';

export interface CustomizationItem {
  id: string;
  name: string;
  description: string;
  badge: string;
  previewColors: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
    hairOrDetail?: string;
    capeOrHorns?: string;
  };
}

export interface ThemeConfig {
  id: ArenaTheme;
  name: string;
  subtitle: string;
  badge: string;
  bgGradTop: string;
  bgGradMid: string;
  bgGradBottom: string;
  scrimColor: string;
  ambientLight: string;
  accentColor: string;
  platformTop: string;
  platformEdge: string;
  previewGradient: string;
}

// 4 Distinct Arena Color Schemes
export const ARENA_THEMES: Record<ArenaTheme, ThemeConfig> = {
  mystic_twilight: {
    id: 'mystic_twilight',
    name: 'Мистические Сумерки',
    subtitle: 'Неоновые индиго-фиолетовые тона и сияющие руны',
    badge: 'Сумерки',
    bgGradTop: '#1E1B4B',
    bgGradMid: '#4C1D95',
    bgGradBottom: '#311042',
    scrimColor: 'rgba(76, 29, 149, 0.22)',
    ambientLight: 'rgba(192, 132, 252, 0.15)',
    accentColor: '#A855F7',
    platformTop: '#9333EA',
    platformEdge: '#2E1065',
    previewGradient: 'from-indigo-900 via-purple-900 to-fuchsia-950',
  },
  crimson_colosseum: {
    id: 'crimson_colosseum',
    name: 'Багровый Колизей',
    subtitle: 'Огненный закат, лавовые отблески и янтарное золото',
    badge: 'Пламя',
    bgGradTop: '#450A0A',
    bgGradMid: '#991B1B',
    bgGradBottom: '#431407',
    scrimColor: 'rgba(185, 28, 28, 0.25)',
    ambientLight: 'rgba(249, 115, 22, 0.18)',
    accentColor: '#F97316',
    platformTop: '#EA580C',
    platformEdge: '#450A0A',
    previewGradient: 'from-red-950 via-amber-900 to-stone-950',
  },
  emerald_sanctuary: {
    id: 'emerald_sanctuary',
    name: 'Изумрудный Оазис',
    subtitle: 'Таинственный нефритовый лес с парящими светлячками',
    badge: 'Природа',
    bgGradTop: '#064E3B',
    bgGradMid: '#065F46',
    bgGradBottom: '#022C22',
    scrimColor: 'rgba(5, 150, 105, 0.2)',
    ambientLight: 'rgba(52, 211, 153, 0.15)',
    accentColor: '#10B981',
    platformTop: '#059669',
    platformEdge: '#022C22',
    previewGradient: 'from-emerald-950 via-teal-900 to-slate-950',
  },
  frozen_citadel: {
    id: 'frozen_citadel',
    name: 'Ледяная Цитадель',
    subtitle: 'Северное сияние, полярная лазурь и сверкающий лёд',
    badge: 'Мороз',
    bgGradTop: '#0C4A6E',
    bgGradMid: '#0284C7',
    bgGradBottom: '#082F49',
    scrimColor: 'rgba(2, 132, 199, 0.22)',
    ambientLight: 'rgba(56, 189, 248, 0.18)',
    accentColor: '#38BDF8',
    platformTop: '#0284C7',
    platformEdge: '#082F49',
    previewGradient: 'from-sky-950 via-cyan-900 to-slate-950',
  },
};

// Outfits for Axe Warrior
export const AXE_OUTFITS: CustomizationItem[] = [
  {
    id: 'viking',
    name: 'Викинг-берсерк',
    description: 'Классическая кожаная броня с рогатым железным шлемом и огненно-рыжей бородой',
    badge: 'Классика',
    previewColors: ['#78350F', '#B45309', '#EA580C'],
    colors: {
      primary: '#78350F', // Brown leather
      secondary: '#451A03',
      accent: '#F59E0B', // Gold studs
      glow: '#F59E0B',
      hairOrDetail: '#EA580C', // Orange-red beard
      capeOrHorns: '#F1F5F9', // Horns
    },
  },
  {
    id: 'flame_knight',
    name: 'Рыцарь Пламени',
    description: 'Тяжёлые багрово-обсидиановые латы с драконьими шипами и огненной бородой',
    badge: 'Огонь',
    previewColors: ['#991B1B', '#F97316', '#450A0A'],
    colors: {
      primary: '#7F1D1D', // Crimson armor
      secondary: '#1C1917', // Dark steel
      accent: '#F97316', // Flame trim
      glow: '#EF4444',
      hairOrDetail: '#DC2626', // Crimson beard
      capeOrHorns: '#FBBF24', // Golden dragon horns
    },
  },
  {
    id: 'frost_juggernaut',
    name: 'Ледяной Джаггернаут',
    description: 'Лазурно-морозная титаническая броня со сверкающими ледяными кристаллами',
    badge: 'Лёд',
    previewColors: ['#0284C7', '#38BDF8', '#E0F2FE'],
    colors: {
      primary: '#0369A1', // Deep ice blue
      secondary: '#082F49',
      accent: '#7DD3FC', // Bright ice cyan
      glow: '#38BDF8',
      hairOrDetail: '#E2E8F0', // Frost-white beard
      capeOrHorns: '#BAE6FD', // Crystal ice horns
    },
  },
  {
    id: 'shadow_paladin',
    name: 'Теневой Паладин',
    description: 'Обсидиановый тёмный доспех с мистическими неоновыми рунами фиолетового цвета',
    badge: 'Тень',
    previewColors: ['#581C87', '#A855F7', '#18181B'],
    colors: {
      primary: '#3B0764', // Deep obsidian violet
      secondary: '#18181B',
      accent: '#C084FC', // Neon purple runes
      glow: '#A855F7',
      hairOrDetail: '#7E22CE', // Dark purple hair
      capeOrHorns: '#E9D5FF', // Glowing amethyst horns
    },
  },
];

// Weapons for Axe Warrior
export const AXE_WEAPONS: CustomizationItem[] = [
  {
    id: 'classic_axe',
    name: 'Боевой секач викинга',
    description: 'Массивный двуручный топор из кованой стали с гравированными рунами',
    badge: 'Сталь',
    previewColors: ['#94A3B8', '#F59E0B', '#78350F'],
    colors: {
      primary: '#94A3B8', // Steel blade
      secondary: '#64748B',
      accent: '#F59E0B', // Gold rune
      glow: '#FCD34D',
    },
  },
  {
    id: 'fire_cleaver',
    name: 'Огненный секач дракона',
    description: 'Пылающее золотисто-багровое лезвие, испускающее языки вулканического пламени',
    badge: 'Лава',
    previewColors: ['#DC2626', '#F97316', '#FEF08A'],
    colors: {
      primary: '#DC2626', // Fiery red
      secondary: '#7F1D1D',
      accent: '#FBBF24', // Blazing flame edge
      glow: '#F97316',
    },
  },
  {
    id: 'frost_axe',
    name: 'Морозный колун титана',
    description: 'Топор из цельного сапфирового льда со снежной аурой и морозным шлейфом',
    badge: 'Кристалл',
    previewColors: ['#0284C7', '#38BDF8', '#FFFFFF'],
    colors: {
      primary: '#0284C7', // Ice blade
      secondary: '#075985',
      accent: '#BAE6FD', // Glacier shine
      glow: '#38BDF8',
    },
  },
  {
    id: 'golden_axe',
    name: 'Золотой топор царя арены',
    description: 'Инкрустированное рубинами парадное оружие из чистого зачарованного золота',
    badge: 'Золото',
    previewColors: ['#F59E0B', '#FEF08A', '#BE123C'],
    colors: {
      primary: '#F59E0B', // Pure gold
      secondary: '#B45309',
      accent: '#FEF08A', // Diamond sheen
      glow: '#FBBF24',
    },
  },
];

// Outfits for Magic Archer
export const ARCHER_OUTFITS: CustomizationItem[] = [
  {
    id: 'emerald_ranger',
    name: 'Изумрудный следопыт',
    description: 'Традиционный эльфийский плащ из листьев древа жизни с золотой вышивкой',
    badge: 'Эльф',
    previewColors: ['#059669', '#10B981', '#FEF08A'],
    colors: {
      primary: '#047857', // Emerald tunic
      secondary: '#064E3B',
      accent: '#34D399', // Bright leaf green
      glow: '#10B981',
      hairOrDetail: '#FDE047', // Blonde golden hair
      capeOrHorns: '#059669', // Emerald cloak
    },
  },
  {
    id: 'celestial_mage',
    name: 'Чародей Звёздного Неба',
    description: 'Бархатная тёмно-синяя мантия с созвездиями и сияющей звёздной диадемой',
    badge: 'Космос',
    previewColors: ['#1E3A8A', '#38BDF8', '#C084FC'],
    colors: {
      primary: '#1E3A8A', // Deep celestial blue
      secondary: '#172554',
      accent: '#60A5FA', // Starlight blue
      glow: '#818CF8',
      hairOrDetail: '#E0E7FF', // Silver-starlight hair
      capeOrHorns: '#312E81', // Midnight cloak
    },
  },
  {
    id: 'phoenix_archer',
    name: 'Алый лучник Феникса',
    description: 'Огненно-алое оперение и золотые доспехи из перьев возрождающегося феникса',
    badge: 'Феникс',
    previewColors: ['#DC2626', '#F97316', '#FBBF24'],
    colors: {
      primary: '#B91C1C', // Phoenix scarlet
      secondary: '#7F1D1D',
      accent: '#F59E0B', // Golden plumage
      glow: '#F97316',
      hairOrDetail: '#EA580C', // Fiery hair
      capeOrHorns: '#EF4444', // Red fiery wings cape
    },
  },
  {
    id: 'phantom_rogue',
    name: 'Призрачный фантом',
    description: 'Таинственный эфирный наряд с бирюзовым свечением и мистическим капюшоном',
    badge: 'Эфир',
    previewColors: ['#581C87', '#06B6D4', '#2DD4BF'],
    colors: {
      primary: '#4C1D95', // Phantom purple
      secondary: '#2E1065',
      accent: '#06B6D4', // Ethereal cyan glow
      glow: '#2DD4BF',
      hairOrDetail: '#A78BFA', // Pale violet hair
      capeOrHorns: '#6D28D9', // Shadow cape
    },
  },
];

// Weapons for Magic Archer (Bow & Staff)
export const ARCHER_WEAPONS: CustomizationItem[] = [
  {
    id: 'classic_bow',
    name: 'Эльфийский лук и жезл',
    description: 'Гибкий лук из железного дуба и посох с сапфировым кристаллом магии',
    badge: 'Древо',
    previewColors: ['#78350F', '#38BDF8', '#F59E0B'],
    colors: {
      primary: '#92400E', // Wood bow
      secondary: '#78350F',
      accent: '#38BDF8', // Sapphire magic orb
      glow: '#60A5FA',
    },
  },
  {
    id: 'moon_bow',
    name: 'Лунная дуга и Посох Звезд',
    description: 'Светящийся лук из лунного серебра и посох, стреляющий звёздным светом',
    badge: 'Луна',
    previewColors: ['#93C5FD', '#E0F2FE', '#818CF8'],
    colors: {
      primary: '#60A5FA', // Moon silver
      secondary: '#3B82F6',
      accent: '#E0F2FE', // Moon ray glow
      glow: '#93C5FD',
    },
  },
  {
    id: 'phoenix_bow',
    name: 'Пылающий лук Феникса',
    description: 'Огненный лук с тетивой из солнечной нити и посох солнечной вспышки',
    badge: 'Солнце',
    previewColors: ['#EA580C', '#F59E0B', '#EF4444'],
    colors: {
      primary: '#EA580C', // Blazing flame
      secondary: '#C2410C',
      accent: '#FDE047', // Sun flare core
      glow: '#F97316',
    },
  },
  {
    id: 'neon_arcane',
    name: 'Неоновый арканный комплект',
    description: 'Футуристический энергетический лук с фиолетовыми лазерными стрелами',
    badge: 'Аркана',
    previewColors: ['#A855F7', '#EC4899', '#38BDF8'],
    colors: {
      primary: '#A855F7', // Neon purple
      secondary: '#7E22CE',
      accent: '#EC4899', // Pink plasma
      glow: '#C084FC',
    },
  },
];
