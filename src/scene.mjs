import * as THREE from 'three';
import { arena, castle, skills } from './battle.mjs';

const box = new THREE.BoxGeometry();
const orb = new THREE.IcosahedronGeometry(1, 1);
const crystal = new THREE.OctahedronGeometry();
const ring = new THREE.RingGeometry(.92, 1, 48);
const materials = new Map();

function mesh(parent, geometry, color, x, y, z, width, height, depth) {
  if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: .86 }));
  const shape = new THREE.Mesh(geometry, materials.get(color));
  shape.position.set(x, y, z);
  shape.scale.set(width, height, depth);
  parent.add(shape);
  return shape;
}

const block = (parent, color, x, y, z, width, height, depth) =>
  mesh(parent, box, color, x, y, z, width, height, depth);

function buildGarden(scene) {
  const cream = 0xfff1cc;
  const gold = 0xeec177;
  const blue = 0x668bcc;
  block(scene, 0x856d85, 0, -1.9, 0, 19.8, 2.6, 22);
  block(scene, 0x94bd79, 0, -.4, 0, 19.8, .8, 22);
  block(scene, 0xd9c59b, 0, .015, 1.6, 2.9, .03, 16);
  block(scene, 0xd9c59b, 0, .02, -2, 17, .04, 2);
  for (const x of [-9.65, 9.65]) {
    block(scene, 0x63b9dd, x, .01, 0, .48, .04, 22);
    block(scene, 0x76c8ee, x, -1.5, 10.97, .47, 3, .1);
  }
  for (let i = 0; i < 32; i++) {
    const x = (i % 2 ? 1 : -1) * (3 + (i * 47 % 53) / 10);
    const z = (i * 53 % 173) / 10 - 8;
    block(scene, i % 3 ? 0xb3d393 : 0x84af73, x, .025, z, .8, .045, .55);
    if (i % 3 === 0) {
      block(scene, 0x5c985d, x, .16, z, .06, .32, .06);
      block(scene, i % 2 ? 0xf0a7d0 : 0xffeb9e, x, .33, z, .2, .13, .2);
    }
  }
  for (const x of [-7.5, 7.5]) {
    for (const z of [-7, 5]) {
      block(scene, 0x8e6e63, x, .3, z, .26, .6, .3);
      block(scene, 0x74a879, x, .9, z, 1, .75, .9);
      block(scene, 0x97bd85, x, 1.42, z, .68, .4, .7);
    }
  }
  const z = castle.z;
  block(scene, cream, 0, 1.1, z, 3.65, 2.2, 2.55);
  block(scene, gold, 0, 2.17, z, 3.86, .19, 2.7);
  block(scene, 0x4a547e, 0, .71, z + 1.29, 1.08, 1.42, .06);
  block(scene, gold, 0, 1.52, z + 1.33, 1.27, .18, .12);
  block(scene, blue, 0, 2.52, z, 2.95, .55, 2.05);
  block(scene, blue, 0, 2.92, z, 2.15, .28, 1.55);
  for (const x of [-1.56, 1.56]) {
    block(scene, cream, x, 1.5, z + .64, 1.06, 3, 1.22);
    block(scene, gold, x, 2.96, z + .64, 1.19, .2, 1.33);
    block(scene, blue, x, 3.2, z + .64, 1.13, .38, 1.26);
    block(scene, blue, x, 3.48, z + .64, .79, .2, .88);
    block(scene, blue, x, 3.66, z + .64, .45, .17, .49);
    block(scene, gold, x, 3.81, z + .64, .14, .18, .14);
  }
}

export function createScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaab8e6);
  scene.fog = new THREE.Fog(0xafbdeb, 30, 72);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  container.prepend(renderer.domElement);
  const camera = new THREE.PerspectiveCamera(50, 1, .1, 100);
  const sun = new THREE.DirectionalLight(0xffe6c7, 2.25);
  sun.position.set(-6, 12, 5);
  scene.add(sun, new THREE.HemisphereLight(0xd7e4ff, 0x997595, 1.8));
  buildGarden(scene);

  const wizard = new THREE.Group();
  const pet = new THREE.Group();
  scene.add(wizard, pet);
  block(wizard, 0x537cbc, 0, .38, 0, .57, .62, .46);
  block(wizard, 0xf8ead8, 0, .32, .22, .28, .43, .06);
  block(wizard, 0xf6cca6, 0, .83, 0, .38, .36, .36);
  block(wizard, 0xffd784, 0, 1.04, -.045, .48, .17, .49);
  block(wizard, 0xffd784, -.19, .82, -.1, .12, .36, .35);
  block(wizard, 0x6c5296, .37, .6, .05, .07, 1.02, .07);
  mesh(wizard, crystal, 0x85e3ff, .37, 1.2, .05, .13, .19, .13);
  block(pet, 0xfff4e4, 0, .34, 0, .35, .33, .55);
  block(pet, 0xfff4e4, 0, .53, .24, .3, .32, .26);
  block(pet, 0xcba6eb, 0, .53, -.26, .2, .17, .35);
  mesh(pet, crystal, 0xffd884, 0, .76, .29, .075, .17, .075);
  for (const x of [-.11, .11]) for (const z of [-.16, .16]) {
    block(pet, 0xe4d4e9, x, .13, z, .09, .27, .1);
  }

  const objects = new Map();
  let zoom = 18;
  const focus = new THREE.Vector3(0, 0, -1);
  const goal = new THREE.Vector3();
  function resize() {
    const { clientWidth, clientHeight } = container;
    if (!clientWidth || !clientHeight) return;
    renderer.setSize(clientWidth, clientHeight);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);
  resize();
  renderer.domElement.addEventListener('wheel', event => {
    event.preventDefault();
    zoom = THREE.MathUtils.clamp(zoom + event.deltaY * .009, 15, 23);
  }, { passive: false });

  function entity(id, create, visible) {
    visible.add(id);
    if (!objects.has(id)) objects.set(id, create());
    return objects.get(id);
  }

  function render(state, dt) {
    const { player } = state;
    wizard.position.set(player.x, 0, player.z);
    pet.position.set(state.pet.x, 0, state.pet.z);
    const visible = new Set();
    for (const enemy of state.enemies) {
      const color = enemy.kind === 'slime' ? (enemy.id % 2 ? 0x7ecaf0 : 0xf399c9)
        : enemy.kind === 'siege' ? 0xac82d6 : 0xb278cf;
      const appearance = entity(enemy.id, () => {
        const slime = new THREE.Group();
        const size = enemy.radius;
        const body = mesh(slime, orb, color, 0, size * .63, 0, size, size * .75, size);
        for (const x of [-.27, .27]) block(slime, 0x303455, x * size, size * .77, size * .86, size * .15, size * .18, size * .1);
        if (enemy.kind === 'boss') block(slime, 0xffd773, 0, size * 1.42, 0, size * .7, size * .25, size * .55);
        scene.add(slime);
        return { node: slime, body };
      }, visible);
      appearance.node.position.set(enemy.x, Math.abs(Math.sin(state.time * 5 + enemy.id)) * .11, enemy.z);
      appearance.body.material = enemy.flash > 0 ? materials.get(0xfff4e4) : materials.get(color);
    }
    for (const shot of state.shots) {
      const appearance = entity(shot.id, () => ({ node: mesh(scene, orb, 0x72d9ff, 0, 0, 0, .15, .15, .15) }), visible);
      appearance.node.position.set(shot.x, .55, shot.z);
    }
    for (const drop of state.drops) {
      const appearance = entity(drop.id, () => ({ node: mesh(scene, crystal, 0x6feb95, 0, 0, 0, .17, .29, .17) }), visible);
      appearance.node.position.set(drop.x, .4, drop.z);
      appearance.node.rotation.y = state.time * 2;
    }
    for (const effect of state.effects) {
      const appearance = entity(effect.id, () => {
        const node = new THREE.Mesh(ring, new THREE.MeshBasicMaterial({
          color: [0x8bd7ff, 0xd7a7ff, 0xffdc8e][effect.index], transparent: true, depthWrite: false,
        }));
        node.rotation.x = -Math.PI / 2;
        scene.add(node);
        return { node, dispose: () => node.material.dispose() };
      }, visible);
      const skill = skills[effect.index];
      const progress = effect.age / skill.duration;
      appearance.node.position.set(effect.x, .06, effect.z);
      appearance.node.scale.setScalar(skill.radius * (.2 + .8 * progress));
      appearance.node.material.opacity = 1 - progress * .8;
    }
    for (const [id, appearance] of objects) {
      if (visible.has(id)) continue;
      scene.remove(appearance.node);
      appearance.dispose?.();
      objects.delete(id);
    }
    goal.set(THREE.MathUtils.clamp(player.x * .6, arena.minX, arena.maxX), 0, player.z * .65 - 1.7);
    focus.lerp(goal, 1 - Math.exp(-dt * 5));
    const tilt = THREE.MathUtils.degToRad(50);
    camera.position.set(focus.x, Math.sin(tilt) * zoom, focus.z + Math.cos(tilt) * zoom);
    camera.lookAt(focus);
    renderer.render(scene, camera);
  }

  return { render, reset() {
    for (const appearance of objects.values()) {
      scene.remove(appearance.node);
      appearance.dispose?.();
    }
    objects.clear();
  } };
}
