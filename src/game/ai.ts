import { Warrior, Projectile, AIDifficulty } from './types';

export interface AIAction {
  left: boolean;
  right: boolean;
  jump: boolean;
  attackMelee: boolean;
  attackSpecial: boolean;
  attackShield?: boolean;
}

export class BattleAI {
  private lastActionTime: number = 0;
  private actionDecisionDelay: number = 0.12; // Reaction time
  private currentAction: AIAction = {
    left: false,
    right: false,
    jump: false,
    attackMelee: false,
    attackSpecial: false,
    attackShield: false,
  };

  public update(
    self: Warrior,
    opponent: Warrior,
    projectiles: Projectile[],
    difficulty: AIDifficulty,
    dt: number,
  ): AIAction {
    this.lastActionTime += dt;
    const reactionThreshold = difficulty === 'hard' ? 0.08 : 0.18;

    if (this.lastActionTime < reactionThreshold) {
      return this.currentAction;
    }
    this.lastActionTime = 0;

    const action: AIAction = {
      left: false,
      right: false,
      jump: false,
      attackMelee: false,
      attackSpecial: false,
      attackShield: false,
    };

    const dx = (opponent.x + opponent.width / 2) - (self.x + self.width / 2);
    const dist = Math.abs(dx);
    const opponentAbove = (opponent.y + opponent.height) < (self.y + 10);

    // Detect incoming threatening projectiles
    const incomingThreat = projectiles.find((p) => {
      if (p.ownerId === self.id) return false;
      const pDist = Math.abs(p.x - (self.x + self.width / 2));
      const movingTowards = (p.vx > 0 && p.x < self.x) || (p.vx < 0 && p.x > self.x);
      return movingTowards && pDist < 260;
    });

    if (self.type === 'axe') {
      // --- AI BEHAVIOR: AXE WARRIOR ---
      // Goal: Close in, smash ground at mid-range, cleave at close range

      // Defensive reaction to incoming projectile: jump over it or advance
      if (incomingThreat && self.isGrounded && Math.random() < (difficulty === 'hard' ? 0.85 : 0.55)) {
        action.jump = true;
      }

      // Vertical pursuit: if opponent is on an upper platform
      if (opponentAbove && self.isGrounded && dist < 200) {
        action.jump = true;
      }

      // Horizontal movement
      if (dist > 75) {
        if (dx > 0) action.right = true;
        else action.left = true;
      }

      // Attack: Earth Shockwave (Special) at medium range
      if (dist >= 110 && dist <= 380 && self.cooldowns.special <= 0) {
        action.attackSpecial = true;
      }
      // Attack: Melee Axe Cleave at close range
      else if (dist <= 85 && self.cooldowns.primary <= 0) {
        action.attackMelee = true;
      }
    } else {
      // --- AI BEHAVIOR: MAGIC ARCHER ---
      // Goal: Maintain distance, kite, use shield against incoming burst, shoot arrows and arcane orbs

      // Emergency Shield against incoming dangerous projectile or close shockwave
      if (incomingThreat && self.cooldowns.shield !== undefined && self.cooldowns.shield <= 0) {
        const threatDist = Math.abs(incomingThreat.x - (self.x + self.width / 2));
        if (threatDist < 160) {
          action.attackShield = true;
        }
      }

      // Jump over close shockwaves if shield not available
      if (incomingThreat && incomingThreat.type === 'shockwave' && self.isGrounded) {
        action.jump = true;
      }

      // Spacing / Kiting: maintain 220px - 440px distance
      if (dist < 180) {
        // Too close! Run away
        if (dx > 0) action.left = true;
        else action.right = true;

        // Jump to evade corner trap
        if (self.isGrounded && (self.x < 120 || self.x > 880 || Math.random() < 0.3)) {
          action.jump = true;
        }
      } else if (dist > 460) {
        // Too far: close in slightly to stay in shooting range
        if (dx > 0) action.right = true;
        else action.left = true;
      } else {
        // Good sweet spot: occasionally adjust
        if (Math.random() < 0.15) {
          if (dx > 0) action.right = true;
          else action.left = true;
        }
      }

      // Jump up to platform if pressured
      if (dist < 220 && self.isGrounded && Math.random() < 0.4) {
        action.jump = true;
      }

      // Abilities:
      // Magic Staff Blast when ready
      if (self.cooldowns.special <= 0 && dist >= 80) {
        action.attackSpecial = true;
      }
      // Primary Bow Arrow Shot
      else if (self.cooldowns.primary <= 0 && dist >= 60) {
        action.attackMelee = true;
      }
    }

    this.currentAction = action;
    return action;
  }
}
