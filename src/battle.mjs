export const arena = { minX: -9, maxX: 9, minZ: -10, maxZ: 10 };
export const castle = { x: 0, z: -6, radius: 2.4, maxHp: 1000 };
export const skills = [
  { key: 'q', name: '마력 소용돌이', cost: 20, cooldown: 15, radius: 4, rate: 3, duration: 2 },
  { key: 'e', name: '별빛 폭격', cost: 30, cooldown: 25, radius: 3.5, rate: 5, duration: .5 },
  { key: 'r', name: '태양의 심판', cost: 50, cooldown: 60, radius: 8, rate: 10, duration: .6 },
];

const waveCounts = [10, 15, 25, 35, 45, 60, 75, 90, 120, 150];
const spawns = [-8, 8].flatMap(x => [-9, -4, 2, 8].map(z => ({ x, z })));
const upgrades = [
  { label: '공격력 +3', apply: p => { p.atk += 3; } },
  { label: '공격 간격 15% 감소', apply: p => { p.interval *= .85; } },
  { label: '이동속도 +0.4', apply: p => { p.speed += .4; } },
  { label: '최대 체력 +15 및 체력 회복', apply: p => { p.maxHp += 15; p.hp += 15; } },
  { label: '결정 획득 범위 +0.5', apply: p => { p.pickup += .5; } },
];
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const xpNeeded = level => Math.round(20 * level ** 1.25);
export const damage = (atk, def, rate = 1, crit = 1) => Math.max(1, Math.round(atk * rate * 100 / (100 + def) * crit));

function move(actor, dx, dz) {
  const next = {
    x: clamp(actor.x + dx, arena.minX, arena.maxX),
    z: clamp(actor.z + dz, arena.minZ, arena.maxZ),
  };
  const radius = castle.radius + (actor.radius ?? .35);
  const gap = distance(next, castle);
  if (gap < radius && gap > 0) {
    next.x = castle.x + (next.x - castle.x) * radius / gap;
    next.z = castle.z + (next.z - castle.z) * radius / gap;
  }
  Object.assign(actor, next);
}

function approach(actor, target, step) {
  const gap = distance(actor, target);
  if (gap > 0) {
    const ratio = Math.min(step, gap) / gap;
    move(actor, (target.x - actor.x) * ratio, (target.z - actor.z) * ratio);
  }
}

function chase(enemy, player, step) {
  const dx = player.x - enemy.x;
  const dz = player.z - enemy.z;
  const gapSquared = dx * dx + dz * dz;
  if (!gapSquared) return;
  const fraction = clamp(((castle.x - enemy.x) * dx + (castle.z - enemy.z) * dz) / gapSquared, 0, 1);
  const obstruction = distance({ x: enemy.x + fraction * dx, z: enemy.z + fraction * dz }, castle);
  if (obstruction >= castle.radius + enemy.radius) {
    approach(enemy, player, step);
    return;
  }
  const offsetX = enemy.x - castle.x;
  const offsetZ = enemy.z - castle.z;
  const cross = offsetX * dz - offsetZ * dx;
  const direction = cross >= 0 ? 1 : -1;
  const radius = Math.hypot(offsetX, offsetZ);
  move(enemy, -offsetZ / radius * step * direction, offsetX / radius * step * direction);
}

export function createBattle(seed) {
  let randomState = seed >>> 0;
  let nextId = 0;
  const random = () => {
    randomState = (Math.imul(1664525, randomState) + 1013904223) >>> 0;
    return randomState / 4294967296;
  };
  const player = { x: 0, z: 1, hp: 100, maxHp: 100, mp: 100, atk: 10, def: 5, speed: 4,
    interval: 1, attack: 0, pickup: 2, level: 1, xp: 0 };
  const state = {
    seed, player, pet: { x: 1, z: 2 }, castleHp: castle.maxHp, wave: 1, time: 0,
    phase: 'title', enemies: [], shots: [], drops: [], effects: [], cooldowns: [0, 0, 0],
    choices: [], kills: 0, rest: null, spawned: 0, bossSpawned: false, heal: 10,
  };

  function spawn(boss = false) {
    const sites = spawns.filter(site => distance(site, player) >= 5);
    const site = sites[Math.floor(random() * sites.length)];
    const kind = boss ? 'boss' : (state.spawned + 1) % 5 === 0 ? 'siege' : 'slime';
    const hp = boss ? 90 + state.wave * 16 : kind === 'siege' ? 24 + state.wave * 2 : 13 + state.wave * 2;
    state.enemies.push({ ...site, id: nextId++, kind, hp, maxHp: hp, attack: 0, flash: 0,
      radius: boss ? .85 : .42, def: boss ? 12 : kind === 'siege' ? 8 : 2 });
  }

  function hurt(enemy, amount) {
    if (enemy.hp <= 0) return;
    enemy.hp -= amount;
    enemy.flash = .15;
    if (enemy.hp <= 0) {
      state.kills++;
      state.drops.push({ id: nextId++, x: enemy.x, z: enemy.z, xp: enemy.kind === 'boss' ? 25 : 5 });
    }
  }

  function nearest() {
    let best = null;
    let range = 6;
    for (const enemy of state.enemies) {
      const gap = distance(player, enemy);
      if (enemy.hp > 0 && gap <= range) {
        best = enemy;
        range = gap;
      }
    }
    return best;
  }

  function cast(index) {
    const skill = skills[index];
    if (!skill || state.phase !== 'playing' || state.cooldowns[index] > 0 || player.mp < skill.cost) return;
    let center = player;
    if (index === 1) {
      const candidates = state.enemies.filter(enemy => enemy.hp > 0);
      let largest = -1;
      for (const candidate of candidates) {
        const count = candidates.filter(enemy => distance(enemy, candidate) <= skill.radius).length;
        if (count > largest) {
          largest = count;
          center = candidate;
        }
      }
    }
    player.mp -= skill.cost;
    state.cooldowns[index] = skill.cooldown;
    state.effects.push({ id: nextId++, x: center.x, z: center.z, index, age: 0, hits: 0 });
  }

  function checkLevel() {
    if (player.level >= 30 || player.xp < xpNeeded(player.level)) return;
    player.xp -= xpNeeded(player.level);
    player.level++;
    const pool = [...upgrades];
    state.choices = Array.from({ length: 3 }, () => pool.splice(Math.floor(random() * pool.length), 1)[0]);
    state.phase = 'level';
  }

  function choose(index) {
    const upgrade = state.choices[index];
    if (state.phase !== 'level' || !upgrade) return;
    upgrade.apply(player);
    state.choices = [];
    state.phase = 'playing';
    checkLevel();
  }

  function tick(dt, input) {
    if (state.phase !== 'playing') return;
    state.time += dt;
    const magnitude = Math.max(1, Math.hypot(input.x, input.z));
    move(player, input.x / magnitude * player.speed * dt, input.z / magnitude * player.speed * dt);
    const companion = { x: player.x + 1, z: player.z + .7 };
    if (distance(state.pet, companion) > 6) Object.assign(state.pet, companion);
    else approach(state.pet, companion, 5 * dt);
    player.mp = Math.min(100, player.mp + 2.4 * dt);
    state.heal -= dt;
    if (state.heal <= 0) {
      player.hp = Math.min(player.maxHp, player.hp + 5);
      state.heal += 10;
    }
    state.cooldowns = state.cooldowns.map(time => Math.max(0, time - dt));

    const count = waveCounts[state.wave - 1];
    if (state.rest === null) {
      while (state.spawned < count && state.time >= state.spawned * 60 / count) {
        spawn();
        state.spawned++;
      }
      if (state.time >= 60 && !state.bossSpawned && state.wave % 5 === 0) {
        spawn(true);
        state.bossSpawned = true;
      }
    }

    player.attack = Math.max(0, player.attack - dt);
    const target = player.attack === 0 ? nearest() : null;
    if (target) {
      player.attack = player.interval;
      state.shots.push({ id: nextId++, x: player.x, z: player.z, target,
        amount: damage(player.atk, target.def, 1, random() < .05 ? 1.5 : 1) });
    }
    for (const shot of state.shots) {
      if (distance(shot, shot.target) <= 12 * dt) {
        hurt(shot.target, shot.amount);
        shot.done = true;
      } else {
        const ratio = 12 * dt / distance(shot, shot.target);
        shot.x += (shot.target.x - shot.x) * ratio;
        shot.z += (shot.target.z - shot.z) * ratio;
      }
    }
    state.shots = state.shots.filter(shot => !shot.done && shot.target.hp > 0);

    for (const effect of state.effects) {
      const skill = skills[effect.index];
      effect.age += dt;
      const hit = effect.index === 0 ? effect.age >= (effect.hits + 1) * .45
        : effect.hits === 0 && effect.age >= skill.duration / 2;
      for (const enemy of state.enemies) {
        if (enemy.hp <= 0 || distance(enemy, effect) > skill.radius) continue;
        if (effect.index === 0) approach(enemy, effect, dt * 2);
        if (hit) hurt(enemy, damage(player.atk, enemy.def, skill.rate / (effect.index === 0 ? 4 : 1)));
      }
      if (hit) effect.hits++;
    }
    state.effects = state.effects.filter(effect => effect.age < skills[effect.index].duration);
    state.enemies = state.enemies.filter(enemy => enemy.hp > 0);

    for (const enemy of state.enemies) {
      const attacksCastle = enemy.kind !== 'slime';
      const goal = attacksCastle ? castle : player;
      const reach = attacksCastle ? castle.radius + enemy.radius + .25 : enemy.radius + .48;
      enemy.flash = Math.max(0, enemy.flash - dt);
      enemy.attack -= dt;
      if (distance(enemy, goal) > reach) {
        const step = (enemy.kind === 'boss' ? 1.35 : 1.75) * dt;
        if (attacksCastle) approach(enemy, goal, step);
        else chase(enemy, player, step);
        continue;
      }
      if (enemy.attack > 0) continue;
      enemy.attack = 1.2;
      if (attacksCastle) state.castleHp = Math.max(0, state.castleHp - damage(enemy.kind === 'boss' ? 45 : 18, 10));
      else player.hp = Math.max(0, player.hp - damage(8, player.def));
    }
    if (player.hp <= 0 || state.castleHp <= 0) {
      state.phase = 'lost';
      return;
    }

    state.drops = state.drops.filter(drop => {
      if (distance(player, drop) > player.pickup) return true;
      player.xp += drop.xp;
      return false;
    });
    if (state.time >= 60 && state.enemies.length === 0) {
      if (state.wave === waveCounts.length) {
        state.phase = 'won';
        return;
      }
      state.rest = state.rest === null ? 10 : state.rest - dt;
      if (state.rest <= 0) {
        state.wave++;
        Object.assign(state, { time: 0, spawned: 0, rest: null, bossSpawned: false });
      }
    }
    checkLevel();
  }

  return { state, tick, cast, choose };
}
