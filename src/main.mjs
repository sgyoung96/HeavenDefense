import { createBattle, skills, xpNeeded } from './battle.mjs';
import { createScene } from './scene.mjs';

const $ = id => document.getElementById(id);
const query = new URLSearchParams(location.search);
const seed = Number(query.get('seed') ?? 1) >>> 0;
let battle = createBattle(seed);
let scene;
try {
  scene = createScene($('game'));
} catch (error) {
  $('message').textContent = 'WebGL을 시작할 수 없습니다. 하드웨어 가속이 가능한 브라우저에서 다시 열어 주세요.';
  $('actions').replaceChildren();
  throw error;
}

const keys = new Set();
const joystick = { x: 0, z: 0, pointer: null };
const movement = {
  KeyW: [0, -1], ArrowUp: [0, -1], KeyS: [0, 1], ArrowDown: [0, 1],
  KeyA: [-1, 0], ArrowLeft: [-1, 0], KeyD: [1, 0], ArrowRight: [1, 0],
};
const stick = $('stick');

function clearStick() {
  joystick.x = joystick.z = 0;
  joystick.pointer = null;
  stick.firstElementChild.style.transform = '';
}

function moveStick(event) {
  if (joystick.pointer !== event.pointerId) return;
  const bounds = stick.getBoundingClientRect();
  const x = event.clientX - bounds.left - bounds.width / 2;
  const z = event.clientY - bounds.top - bounds.height / 2;
  const length = Math.max(28, Math.hypot(x, z));
  joystick.x = x / length;
  joystick.z = z / length;
  stick.firstElementChild.style.transform = `translate(${joystick.x * 28}px, ${joystick.z * 28}px)`;
}
stick.addEventListener('pointerdown', event => {
  if (joystick.pointer !== null) return;
  joystick.pointer = event.pointerId;
  stick.setPointerCapture(event.pointerId);
  moveStick(event);
});
stick.addEventListener('pointermove', moveStick);
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  stick.addEventListener(type, event => {
    if (event.pointerId === joystick.pointer) clearStick();
  });
}
window.addEventListener('blur', () => {
  keys.clear();
  clearStick();
});

function pause() {
  const { state } = battle;
  if (state.phase === 'playing') state.phase = 'paused';
  else if (state.phase === 'paused') state.phase = 'playing';
}

function start() {
  scene.reset();
  battle = createBattle(seed);
  battle.state.phase = 'playing';
  keys.clear();
  clearStick();
}

document.addEventListener('keydown', event => {
  if (movement[event.code]) {
    keys.add(event.code);
    event.preventDefault();
  }
  if (event.repeat) return;
  if (event.code === 'Escape') pause();
  const index = skills.findIndex(skill => event.code === `Key${skill.key.toUpperCase()}`);
  if (index !== -1) battle.cast(index);
});
document.addEventListener('keyup', event => keys.delete(event.code));
$('pause').addEventListener('click', pause);

function button(text, action) {
  const element = document.createElement('button');
  element.type = 'button';
  element.textContent = text;
  element.addEventListener('click', action);
  return element;
}

const skillButtons = skills.map((skill, index) => {
  const element = button('', () => battle.cast(index));
  const key = document.createElement('b');
  key.textContent = skill.key.toUpperCase();
  const label = document.createElement('span');
  element.append(key, label);
  element.setAttribute('aria-label', `${skill.name} · MP ${skill.cost}`);
  $('skills').append(element);
  return { element, label };
});

const panels = {
  title: ['Heaven Defense', '성을 지키고 결정을 모으세요. WASD 또는 조이스틱으로 이동하고 Q/E/R로 특수 스킬을 사용합니다.'],
  paused: ['일시정지', ''],
  level: ['레벨 업', '강화를 하나 선택하세요.'],
  won: ['방어 성공', '천상의 정원을 지켜냈습니다.'],
  lost: ['방어 실패', ''],
};
let shownPhase;

function updateHud(state) {
  const { player } = state;
  $('wave').textContent = `웨이브 ${state.wave} / 10`;
  $('clock').textContent = state.rest !== null ? `휴식 ${Math.ceil(state.rest)}초`
    : state.time >= 60 ? '남은 적 처치' : `${Math.ceil(60 - state.time)}초`;
  $('level').textContent = `Lv. ${player.level}`;
  $('hp').max = player.maxHp;
  $('xp').max = xpNeeded(player.level);
  $('xp').value = Math.min(player.xp, $('xp').max);
  const meters = { castle: state.castleHp, hp: player.hp, mp: player.mp };
  for (const [name, value] of Object.entries(meters)) {
    $(name).value = value;
    $(`${name}-value`).textContent = Math.floor(value);
  }
  for (const [index, { element, label }] of skillButtons.entries()) {
    const cooldown = state.cooldowns[index];
    element.disabled = cooldown > 0 || player.mp < skills[index].cost;
    label.textContent = cooldown > 0 ? `${Math.ceil(cooldown)}초` : skills[index].name;
  }
  if (shownPhase === state.phase && state.phase !== 'level') return;
  if (state.phase === 'level' && shownPhase === state.choices) return;
  shownPhase = state.phase === 'level' ? state.choices : state.phase;
  $('hud').hidden = state.phase === 'title';
  $('controls').hidden = state.phase !== 'playing';
  $('overlay').hidden = state.phase === 'playing';
  if (state.phase === 'playing') return;
  const [title, message] = panels[state.phase];
  $('title').textContent = title;
  $('message').textContent = state.phase === 'lost'
    ? (state.castleHp <= 0 ? '성이 무너졌습니다.' : '마법사가 쓰러졌습니다.') : message;
  const actions = state.phase === 'level' ? state.choices.map((choice, i) => button(choice.label, () => battle.choose(i)))
    : state.phase === 'paused' ? [button('계속하기', pause), button('다시 시작', start)]
      : [button(state.phase === 'title' ? '전투 시작' : '다시 시작', start)];
  $('actions').replaceChildren(...actions);
}

window.__game = Object.freeze({
  get state() {
    const { state } = battle;
    const { x, z, hp, mp, xp, level, speed } = state.player;
    return { phase: state.phase, seed, wave: state.wave, time: state.time, castleHp: state.castleHp,
      enemies: state.enemies.length, shots: state.shots.length, drops: state.drops.length, kills: state.kills,
      player: { x, z, hp, mp, xp, level, speed } };
  },
});

if (query.has('autostart')) start();
const step = 1 / 60;
let last = performance.now();
let accumulated = 0;
function frame(now) {
  const dt = Math.min((now - last) / 1000, .1);
  last = now;
  accumulated += dt;
  const input = { x: joystick.x, z: joystick.z };
  for (const key of keys) {
    input.x += movement[key][0];
    input.z += movement[key][1];
  }
  for (; accumulated >= step; accumulated -= step) battle.tick(step, input);
  updateHud(battle.state);
  scene.render(battle.state, dt);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
