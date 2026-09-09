import { test } from "node:test";
import assert from "node:assert/strict";
import { CHILD_IDS, SYSTEM_IDS, systemForId } from "./geometry.js";
import { computeInventoryLayout, footprintOf, inventoryPieceIds, rectanglesOverlap } from "./scene-layout.js";
import * as THREE from "three";
import { isTapGesture } from "./scene.js";
import { createMotionController } from "./scene-motion.js";

test("scene model exposes the eight systems and exact twenty child ids", () => {
  assert.equal(SYSTEM_IDS.length, 8);
  assert.equal(new Set(SYSTEM_IDS).size, 8);
  assert.equal(CHILD_IDS.length, 20);
  assert.equal(new Set(CHILD_IDS).size, CHILD_IDS.length);
  for (const id of CHILD_IDS) assert.ok(SYSTEM_IDS.includes(systemForId(id)), id);
});

test("inventory packs all twenty children and four leaf systems without overlap", () => {
  const ids = inventoryPieceIds(SYSTEM_IDS);
  assert.equal(ids.length, 24);
  const layout = computeInventoryLayout(SYSTEM_IDS);
  for (const id of ids) assert.ok(layout[id], id);
  for (let i = 0; i < ids.length; i += 1)
    for (let j = i + 1; j < ids.length; j += 1)
      assert.equal(rectanglesOverlap(layout[ids[i]], layout[ids[j]]), false, `${ids[i]} overlaps ${ids[j]}`);
});

test("tap helper rejects drags, cancelled pointers and multitouch", () => {
  const start = { pointerId: 1, x: 10, y: 10 };
  assert.equal(isTapGesture(start, { pointerId: 1, x: 12, y: 12 }), true);
  assert.equal(isTapGesture(start, { pointerId: 1, x: 30, y: 10 }), false);
  assert.equal(isTapGesture({ ...start, multiTouch: true }, { pointerId: 1, x: 10, y: 10 }), false);
  assert.equal(isTapGesture(start, { ...start, pointerId: 2 }), false);
  assert.equal(isTapGesture({ ...start, cancelled: true }, { pointerId: 1, x: 10, y: 10 }), false);
});

test("inventory layout honors transformed actual footprints", () => {
  const footprints = {
    "battery-tray": { width: 4.8, height: 0.2, depth: 0.25 },
    "battery-lid": { width: 0.25, height: 0.2, depth: 4.8 },
  };
  const layout = computeInventoryLayout(["battery"], footprints);
  assert.equal(layout["battery-tray"].width, 4.8);
  assert.equal(layout["battery-lid"].depth, 4.8);
  assert.equal(rectanglesOverlap(layout["battery-tray"], layout["battery-lid"]), false);
  const object = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 4));
  object.rotation.y = Math.PI / 2;
  const actual = footprintOf(object);
  assert.ok(Math.abs(actual.width - 4) < 1e-6);
  assert.ok(Math.abs(actual.height - 3) < 1e-6);
});

test("reduced motion remains static when a mechanism is started", () => {
  const motion = createMotionController({ groups: { children: {} }, flowDots: [] });
  motion.setReduced(true);
  motion.setRunning("motor", { inputRpm: 1800 });
  assert.equal(motion.state.reduced, true);
  assert.equal(motion.isAnimating(), false);
  motion.update(100, 0.016);
  assert.equal(motion.state.angle, 0);
});
