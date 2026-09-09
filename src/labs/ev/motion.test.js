import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createMotionController } from "./scene-motion.js";
import { createVehicleGeometry } from "./geometry.js";

test("motor geometry and authored motion use the X shaft axis", () => {
  const root = new THREE.Group();
  const groups = createVehicleGeometry(root, []);
  const shaftMesh = groups.children["motor-shaft"].children[0];
  const rotorMesh = groups.children["motor-rotor"].children[0];
  assert.ok(Math.abs(shaftMesh.rotation.z - Math.PI / 2) < 1e-9);
  assert.ok(Math.abs(rotorMesh.rotation.z - Math.PI / 2) < 1e-9);
  assert.ok(groups.context);
  assert.equal(groups.context.userData.role, "context");
  assert.equal(
    groups.context.getObjectByName("front-passive-wheels")?.children.length,
    2,
  );
});

test("differential wheel motion follows turn parameter and gear ratio", () => {
  const wheels = new THREE.Group();
  wheels.add(new THREE.Group(), new THREE.Group());
  const motion = createMotionController({
    groups: { children: { "gears-wheels": wheels } },
    flowDots: [],
  });
  motion.setRunning("gears", {
    rpm: 600,
    ratio: 10,
    turn: 0.5,
    visualScale: 1,
  });
  motion.update(1000, 1);
  const outputAngle = (((600 / 60) * Math.PI * 2) / 10) * 0.1; // controller caps a frame step at 100 ms
  assert.ok(Math.abs(wheels.children[0].rotation.x - outputAngle * 0.5) < 1e-9);
  assert.ok(Math.abs(wheels.children[1].rotation.x - outputAngle * 1.5) < 1e-9);
});

test("inverter switch legs are complementary and modulation zero disables both", () => {
  const switches = new THREE.Group();
  for (let phase = 0; phase < 3; phase += 1) {
    for (let half = 0; half < 2; half += 1) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ emissive: 0 }),
      );
      mesh.userData.role = `phase-${phase}-${half}`;
      switches.add(mesh);
    }
  }
  const motion = createMotionController({
    groups: { children: { "inverter-switches": switches } },
    flowDots: [],
  });
  motion.setRunning("inverter", {
    electricalHz: 1,
    modulation: 1,
    visualScale: 1,
  });
  motion.update(0, 0.016);
  for (let phase = 0; phase < 3; phase += 1) {
    const upper = switches.children[phase * 2];
    const lower = switches.children[phase * 2 + 1];
    assert.notEqual(
      upper.material.emissiveIntensity,
      lower.material.emissiveIntensity,
    );
  }
  motion.setParams({ modulation: 0 });
  motion.update(20, 0.016);
  for (const mesh of switches.children)
    assert.equal(mesh.material.emissiveIntensity, 0.02);
});

test("standalone battery run shows flow and stops at zero load", () => {
  const dots = [new THREE.Mesh(), new THREE.Mesh()];
  const path = new THREE.LineCurve3(
    new THREE.Vector3(),
    new THREE.Vector3(1, 0, 0),
  );
  const motion = createMotionController({
    groups: { children: {} },
    flowPath: path,
    flowDots: dots,
  });
  motion.setRunning("battery", { loadKW: 12 });
  motion.update(100, 0.016);
  assert.equal(
    dots.every((dot) => dot.visible),
    true,
  );
  motion.setParams({ loadKW: 0 });
  motion.update(100, 0.016);
  assert.equal(
    dots.some((dot) => dot.visible),
    false,
  );
});

test("motor field follows rotor angle when no electrical frequency is supplied", () => {
  const stator = new THREE.Group();
  for (const [index, angle] of [0, Math.PI / 2, Math.PI].entries()) {
    const coil = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ emissive: 0 }),
    );
    coil.userData.role = "stator-field";
    coil.position.set(0, Math.cos(angle), Math.sin(angle));
    stator.add(coil);
  }
  const rotor = new THREE.Group();
  const motion = createMotionController({
    groups: { children: { "motor-stator": stator, "motor-rotor": rotor } },
    flowDots: [],
  });
  motion.setRunning("motor", { rpm: 1200, visualScale: 1 });
  motion.update(0, 0.016);
  const first = stator.children.map((coil) => coil.material.emissiveIntensity);
  motion.update(100, 0.016);
  const second = stator.children.map((coil) => coil.material.emissiveIntensity);
  assert.notDeepEqual(first, second);
});
