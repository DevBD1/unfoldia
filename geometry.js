import * as THREE from "three";

/**
 * The model intentionally uses representative dimensions.  It is a learning
 * diagram, not a Tesla CAD drawing.  All dimensions are in scene metres.
 */
export const SYSTEM_IDS = [
  "battery",
  "inverter",
  "motor",
  "gears",
  "charger",
  "dcdc",
  "thermal",
  "bms",
];

export const CHILD_IDS = [
  "battery-tray",
  "battery-lid",
  "battery-modules",
  "battery-cells",
  "battery-busbars",
  "battery-contactors",
  "motor-stator",
  "motor-rotor",
  "motor-shaft",
  "motor-housing",
  "inverter-switches",
  "inverter-capacitor",
  "inverter-heatsink",
  "inverter-board",
  "gears-pinion",
  "gears-reduction",
  "gears-case",
  "gears-internals",
  "gears-axles",
  "gears-wheels",
];

export const SYSTEM_COLORS = {
  battery: 0xb6db83,
  inverter: 0xe5b978,
  motor: 0x75c9c2,
  gears: 0xafadb8,
  charger: 0x9f9dd6,
  dcdc: 0xd697aa,
  thermal: 0x6f9ebc,
  bms: 0x58aa81,
};

export const CHILD_SIZES = {
  "battery-tray": [1.86, 0.18, 2.9],
  "battery-lid": [1.82, 0.1, 2.84],
  "battery-modules": [1.6, 0.15, 2.52],
  "battery-cells": [1.45, 0.22, 2.36],
  "battery-busbars": [1.52, 0.06, 2.42],
  "battery-contactors": [0.46, 0.2, 0.46],
  "motor-stator": [0.76, 0.66, 0.76],
  "motor-rotor": [0.53, 0.52, 0.53],
  "motor-shaft": [2.02, 0.14, 0.14],
  "motor-housing": [0.92, 0.84, 0.92],
  "inverter-switches": [0.74, 0.06, 0.54],
  "inverter-capacitor": [0.42, 0.23, 0.42],
  "inverter-heatsink": [0.86, 0.12, 0.65],
  "inverter-board": [0.78, 0.05, 0.55],
  "gears-pinion": [0.32, 0.18, 0.32],
  "gears-reduction": [0.72, 0.22, 0.72],
  "gears-case": [1.05, 0.55, 0.86],
  "gears-internals": [0.78, 0.32, 0.72],
  "gears-axles": [2.25, 0.12, 0.12],
  "gears-wheels": [0.9, 0.8, 0.9],
};

const makeMaterial = (color, options = {}) => {
  const parameters = {
    color,
    metalness: options.metalness ?? 0.3,
    roughness: options.roughness ?? 0.42,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
  };
  if (options.side !== undefined) parameters.side = options.side;
  return new THREE.MeshStandardMaterial(parameters);
};

const mesh = (parent, geometry, material, id, role, pickables) => {
  const object = new THREE.Mesh(geometry, material);
  object.castShadow = true;
  object.receiveShadow = true;
  if (id) {
    object.userData.id = id;
    object.userData.role = role;
    pickables.push(object);
  }
  parent.add(object);
  return object;
};

const addBox = (
  parent,
  size,
  position,
  color,
  id,
  role,
  pickables,
  opts = {},
) => {
  const object = mesh(
    parent,
    new THREE.BoxGeometry(...size),
    makeMaterial(color, opts),
    id,
    role,
    pickables,
  );
  object.position.set(...position);
  return object;
};

const addCylinder = (
  parent,
  radius,
  length,
  position,
  color,
  id,
  role,
  pickables,
  axis = "y",
  opts = {},
) => {
  const object = mesh(
    parent,
    new THREE.CylinderGeometry(radius, radius, length, opts.segments ?? 20),
    makeMaterial(color, opts),
    id,
    role,
    pickables,
  );
  object.position.set(...position);
  if (axis === "x") object.rotation.z = Math.PI / 2;
  if (axis === "z") object.rotation.x = Math.PI / 2;
  return object;
};

const addTorus = (
  parent,
  radius,
  tube,
  position,
  color,
  id,
  role,
  pickables,
  axis = "y",
) => {
  const object = mesh(
    parent,
    new THREE.TorusGeometry(radius, tube, 10, 24),
    makeMaterial(color, { metalness: 0.65, roughness: 0.3 }),
    id,
    role,
    pickables,
  );
  object.position.set(...position);
  // TorusGeometry is created in the XY plane (normal +Z).  Rotate it so its
  // hole/shaft axis is the requested local axis.
  if (axis === "x") object.rotation.y = Math.PI / 2;
  else if (axis === "y") object.rotation.x = Math.PI / 2;
  return object;
};

const addGear = (
  parent,
  radius,
  thickness,
  position,
  color,
  id,
  role,
  pickables,
) => {
  const group = new THREE.Group();
  group.position.set(...position);
  group.userData.role = role;
  parent.add(group);
  const teeth = 16;
  for (let i = 0; i < teeth; i += 1) {
    const angle = (i / teeth) * Math.PI * 2;
    const tooth = addBox(
      group,
      [radius * 0.24, thickness, radius * 0.22],
      [Math.cos(angle) * radius * 0.9, 0, Math.sin(angle) * radius * 0.9],
      color,
      id,
      role,
      pickables,
      { metalness: 0.7, roughness: 0.3 },
    );
    tooth.rotation.y = -angle;
  }
  const disc = mesh(
    group,
    new THREE.CylinderGeometry(radius * 0.82, radius * 0.82, thickness, 32),
    makeMaterial(color, { metalness: 0.7, roughness: 0.3 }),
    id,
    role,
    pickables,
  );
  return group;
};

const createSystem = (root, id, position) => {
  const group = new THREE.Group();
  group.name = id;
  group.userData.id = id;
  group.userData.systemId = id;
  group.userData.base = new THREE.Vector3(...position);
  group.position.copy(group.userData.base);
  root.add(group);
  return group;
};

const createChild = (system, id, position, offset = [0, 0, 0]) => {
  const group = new THREE.Group();
  group.name = id;
  group.userData.id = id;
  group.userData.parentId = system.userData.id;
  group.userData.base = new THREE.Vector3(...position);
  group.userData.offset = new THREE.Vector3(...offset);
  group.position.set(...position);
  system.add(group);
  return group;
};

function createBattery(system, pickables) {
  const tray = createChild(system, "battery-tray", [0, 0, 0], [0, -0.42, 0]);
  addBox(
    tray,
    [1.86, 0.18, 2.9],
    [0, 0, 0],
    0x49664c,
    "battery-tray",
    "battery",
    pickables,
  );

  const lid = createChild(system, "battery-lid", [0, 0.31, 0], [0, 0.25, 0]);
  addBox(
    lid,
    [1.82, 0.1, 2.84],
    [0, 0, 0],
    0x759274,
    "battery-lid",
    "battery",
    pickables,
  );

  const modules = createChild(
    system,
    "battery-modules",
    [0, 0.13, 0],
    [-0.32, 0.24, 0],
  );
  for (const x of [-0.52, 0.52])
    addBox(
      modules,
      [0.88, 0.15, 2.48],
      [x, 0, 0],
      0x6c9362,
      "battery-modules",
      "battery",
      pickables,
    );

  const cells = createChild(
    system,
    "battery-cells",
    [0, 0.25, 0],
    [-0.44, 0.55, 0],
  );
  const cellGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.48, 12);
  const cellMat = makeMaterial(0xb6db83, { metalness: 0.2, roughness: 0.35 });
  const instances = new THREE.InstancedMesh(cellGeo, cellMat, 48);
  instances.userData.id = "battery-cells";
  instances.userData.role = "battery";
  const matrix = new THREE.Matrix4();
  let index = 0;
  for (let x = 0; x < 6; x += 1)
    for (let z = 0; z < 8; z += 1) {
      matrix.makeTranslation((x - 2.5) * 0.22, 0, (z - 3.5) * 0.26);
      matrix.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));
      instances.setMatrixAt(index, matrix);
      index += 1;
    }
  instances.instanceMatrix.needsUpdate = true;
  instances.castShadow = true;
  instances.receiveShadow = true;
  cells.add(instances);
  pickables.push(instances);

  const busbars = createChild(
    system,
    "battery-busbars",
    [0, 0.48, 0],
    [-0.5, 0.78, 0],
  );
  for (const x of [-0.55, 0, 0.55])
    addBox(
      busbars,
      [0.045, 0.045, 2.45],
      [x, 0, 0],
      0xe7c16a,
      "battery-busbars",
      "battery",
      pickables,
    );

  const contactors = createChild(
    system,
    "battery-contactors",
    [0.65, 0.47, -1.05],
    [0.8, 1, -0.4],
  );
  addBox(
    contactors,
    [0.42, 0.2, 0.44],
    [0, 0, 0],
    0x53615c,
    "battery-contactors",
    "battery",
    pickables,
  );
  addCylinder(
    contactors,
    0.07,
    0.46,
    [0.1, 0.13, 0],
    0xe8bb68,
    "battery-contactors",
    "battery",
    pickables,
    "y",
  );
}

function createMotor(system, pickables) {
  const stator = createChild(
    system,
    "motor-stator",
    [0, 0, 0],
    [0, 0.65, -0.55],
  );
  addTorus(
    stator,
    0.34,
    0.1,
    [0, 0, 0],
    0x75c9c2,
    "motor-stator",
    "stator",
    pickables,
    "x",
  );
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    const coil = addBox(
      stator,
      [0.16, 0.035, 0.14],
      [0, Math.cos(a) * 0.3, Math.sin(a) * 0.3],
      0x4c918d,
      "motor-stator",
      "stator-field",
      pickables,
    );
    coil.rotation.x = -a;
    coil.userData.phaseIndex = i % 3;
  }

  const rotor = createChild(system, "motor-rotor", [0, 0, 0], [0, 0.65, -0.55]);
  addCylinder(
    rotor,
    0.23,
    0.5,
    [0, 0, 0],
    0xd1a34d,
    "motor-rotor",
    "rotor",
    pickables,
    "x",
    { metalness: 0.75 },
  );
  addTorus(
    rotor,
    0.22,
    0.035,
    [0, 0, 0],
    0xf1d37c,
    "motor-rotor",
    "rotor",
    pickables,
    "x",
  );

  const shaft = createChild(system, "motor-shaft", [0, 0, 0], [0, 0.65, -0.55]);
  // High-contrast teaching marker makes rotation of the symmetric rotor visible.
  addBox(rotor, [0.4, 0.025, 0.05], [0, 0.235, 0], 0xfff4c7, "motor-rotor", "rotation-marker", pickables);
  addCylinder(
    shaft,
    0.065,
    1.8,
    [0, 0, 0],
    0xc8d0cb,
    "motor-shaft",
    "shaft",
    pickables,
    "x",
    { metalness: 0.8 },
  );

  const housing = createChild(
    system,
    "motor-housing",
    [0, 0, 0],
    [0, 0.65, -0.55],
  );
  addCylinder(
    housing,
    0.48,
    0.75,
    [0, 0, 0],
    0x4c6863,
    "motor-housing",
    "motor",
    pickables,
    "x",
    { transparent: true, opacity: 0.26 },
  );
  addTorus(
    housing,
    0.45,
    0.035,
    [0, 0, 0],
    0x8fbab2,
    "motor-housing",
    "motor",
    pickables,
    "x",
  );
}

function createInverter(system, pickables) {
  const switches = createChild(
    system,
    "inverter-switches",
    [0, 0, 0],
    [0, 0.55, -0.48],
  );
  for (let i = 0; i < 3; i += 1)
    for (let j = 0; j < 2; j += 1)
      addBox(
        switches,
        [0.2, 0.06, 0.22],
        [(i - 1) * 0.24, j * 0.14, 0],
        [0xd78852, 0xe4b261, 0x76c7c4][i],
        "inverter-switches",
        `phase-${i}-${j}`,
        pickables,
      );

  const capacitor = createChild(
    system,
    "inverter-capacitor",
    [0.44, 0, 0.08],
    [0.6, 0.68, -0.4],
  );
  addCylinder(
    capacitor,
    0.17,
    0.38,
    [0, 0, 0],
    0x8f74a6,
    "inverter-capacitor",
    "capacitor",
    pickables,
    "y",
  );

  const heatsink = createChild(
    system,
    "inverter-heatsink",
    [0, -0.16, 0],
    [0, 0.36, -0.48],
  );
  addBox(
    heatsink,
    [0.88, 0.12, 0.65],
    [0, 0, 0],
    0xa6a69a,
    "inverter-heatsink",
    "heatsink",
    pickables,
    { metalness: 0.7 },
  );
  for (let i = 0; i < 8; i += 1)
    addBox(
      heatsink,
      [0.035, 0.12, 0.58],
      [(i - 3.5) * 0.105, 0.1, 0],
      0xd4d0bd,
      "inverter-heatsink",
      "heatsink",
      pickables,
      { metalness: 0.7 },
    );

  const board = createChild(
    system,
    "inverter-board",
    [0, 0.13, 0],
    [0, 0.86, -0.48],
  );
  addBox(
    board,
    [0.76, 0.04, 0.53],
    [0, 0, 0],
    0x326d5a,
    "inverter-board",
    "board",
    pickables,
  );
  for (let i = 0; i < 6; i += 1)
    addCylinder(
      board,
      0.025,
      0.05,
      [(i - 2.5) * 0.12, 0.04, 0],
      0xd8b867,
      "inverter-board",
      "board",
      pickables,
    );
}

function createGears(system, pickables) {
  const pinion = createChild(
    system,
    "gears-pinion",
    [-0.4, 0, 0],
    [0.65, 0.52, -0.56],
  );
  addGear(
    pinion,
    0.18,
    0.14,
    [0, 0, 0],
    0xc4c9c5,
    "gears-pinion",
    "gear",
    pickables,
  );
  const reduction = createChild(
    system,
    "gears-reduction",
    [0.16, 0, 0],
    [0.65, 0.52, -0.56],
  );
  addGear(
    reduction,
    0.35,
    0.16,
    [0, 0, 0],
    0x9fa9a4,
    "gears-reduction",
    "gear",
    pickables,
  );
  const casing = createChild(
    system,
    "gears-case",
    [0, 0, 0],
    [0.65, 0.52, -0.56],
  );
  addBox(
    casing,
    [1.02, 0.5, 0.8],
    [0, 0, 0],
    0x5f6c67,
    "gears-case",
    "gear-case",
    pickables,
    { transparent: true, opacity: 0.25 },
  );
  const internals = createChild(
    system,
    "gears-internals",
    [0.02, 0.02, 0],
    [0.65, 0.52, -0.56],
  );
  addGear(
    internals,
    0.27,
    0.12,
    [0.28, 0, 0],
    0xc1c7c3,
    "gears-internals",
    "gear",
    pickables,
  );
  const axles = createChild(
    system,
    "gears-axles",
    [0, 0, 0],
    [0.65, 0.52, -0.56],
  );
  addCylinder(
    axles,
    0.065,
    2.25,
    [0, 0, 0],
    0xc2cac6,
    "gears-axles",
    "axle",
    pickables,
    "x",
    { metalness: 0.75 },
  );
  const wheels = createChild(
    system,
    "gears-wheels",
    [0, 0, 0],
    [0.65, 0.52, -0.56],
  );
  for (const x of [-0.95, 0.95]) {
    const wheel = new THREE.Group();
    wheel.name = x < 0 ? "left-wheel" : "right-wheel";
    wheel.position.x = x;
    wheel.userData.role = "wheel";
    wheels.add(wheel);
    addCylinder(
      wheel,
      0.43,
      0.23,
      [0, 0, 0],
      0x242c29,
      "gears-wheels",
      "wheel",
      pickables,
      "x",
    );
    addCylinder(
      wheel,
      0.25,
      0.25,
      [0, 0, 0],
      0x84938b,
      "gears-wheels",
      "wheel",
      pickables,
      "x",
    );
  }
}

function createLeafSystems(groups, pickables) {
  const charger = createSystem(groups.root, "charger", [-0.64, 0.98, 1.54]);
  const chargerChild = createChild(charger, "charger", [0, 0, 0]);
  addBox(
    chargerChild,
    [0.68, 0.24, 0.58],
    [0, 0, 0],
    SYSTEM_COLORS.charger,
    "charger",
    "charger",
    pickables,
  );
  const dcdc = createSystem(groups.root, "dcdc", [0.42, 0.98, 1.53]);
  const dcdcChild = createChild(dcdc, "dcdc", [0, 0, 0]);
  addBox(
    dcdcChild,
    [0.54, 0.2, 0.5],
    [0, 0, 0],
    SYSTEM_COLORS.dcdc,
    "dcdc",
    "dcdc",
    pickables,
  );
  const thermal = createSystem(groups.root, "thermal", [0, 0.97, -1.5]);
  const thermalChild = createChild(thermal, "thermal", [0, 0, 0]);
  addBox(
    thermalChild,
    [1.35, 0.1, 0.34],
    [0, 0, 0],
    SYSTEM_COLORS.thermal,
    "thermal",
    "thermal",
    pickables,
  );
  for (let i = 0; i < 12; i += 1)
    addBox(
      thermalChild,
      [0.03, 0.13, 0.38],
      [(i - 5.5) * 0.1, 0.08, 0],
      0xa1c4d9,
      "thermal",
      "thermal",
      pickables,
    );
  const bms = createSystem(groups.root, "bms", [-0.72, 1.02, 0.87]);
  const bmsChild = createChild(bms, "bms", [0, 0, 0]);
  addBox(
    bmsChild,
    [0.38, 0.1, 0.52],
    [0, 0, 0],
    SYSTEM_COLORS.bms,
    "bms",
    "bms",
    pickables,
  );
  for (let i = 0; i < 4; i += 1)
    addBox(
      bmsChild,
      [0.1, 0.04, 0.06],
      [0, 0.07, (i - 1.5) * 0.1],
      0x263d32,
      "bms",
      "bms",
      pickables,
    );
}

function createBody(root) {
  const body = new THREE.Group();
  body.name = "vehicle-body";
  const outline = new THREE.Shape();
  outline.moveTo(-2.42, 0.45);
  outline.lineTo(-2.22, 1.02);
  outline.lineTo(-1.2, 1.2);
  outline.lineTo(-0.66, 1.8);
  outline.lineTo(0.86, 1.8);
  outline.lineTo(1.48, 1.22);
  outline.lineTo(2.28, 1.08);
  outline.lineTo(2.44, 0.46);
  outline.closePath();
  const geometry = new THREE.ExtrudeGeometry(outline, {
    depth: 1.84,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.08,
    bevelSegments: 2,
  });
  geometry.translate(0, 0, -0.92);
  geometry.rotateY(Math.PI / 2);
  const shell = new THREE.Mesh(
    geometry,
    new THREE.MeshPhysicalMaterial({
      color: 0xbad6c3,
      transparent: true,
      opacity: 0.12,
      metalness: 0.2,
      roughness: 0.28,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  shell.renderOrder = 2;
  body.add(shell);
  body.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry, 25),
      new THREE.LineBasicMaterial({
        color: 0x8bad97,
        transparent: true,
        opacity: 0.45,
      }),
    ),
  );
  root.add(body);
  return body;
}

function createContext(root, pickables) {
  const context = new THREE.Group();
  context.name = "vehicle-context";
  context.userData.role = "context";
  root.add(context);

  // The chassis and passive front axle provide orientation without becoming
  // selectable lesson parts.  The driven rear wheels live in gears-wheels.
  const chassis = addBox(
    context,
    [2.05, 0.12, 4.6],
    [0, 0.38, 0],
    0x59655f,
    null,
    "chassis",
    pickables,
  );
  chassis.renderOrder = -1;
  for (const x of [-0.98, 0.98])
    addBox(
      context,
      [0.08, 0.18, 4.38],
      [x, 0.48, 0],
      0x93a39a,
      null,
      "chassis",
      pickables,
    );

  const frontAxle = new THREE.Group();
  frontAxle.name = "front-passive-wheels";
  frontAxle.position.set(0, 0.55, 1.72);
  context.add(frontAxle);
  for (const x of [-0.95, 0.95]) {
    const wheel = new THREE.Group();
    wheel.name = x < 0 ? "front-left-wheel" : "front-right-wheel";
    wheel.position.x = x;
    wheel.userData.role = "passive-wheel";
    frontAxle.add(wheel);
    addCylinder(
      wheel,
      0.43,
      0.23,
      [0, 0, 0],
      0x242c29,
      null,
      "passive-wheel",
      pickables,
      "x",
    );
    addCylinder(
      wheel,
      0.25,
      0.25,
      [0, 0, 0],
      0x84938b,
      null,
      "passive-wheel",
      pickables,
      "x",
    );
  }
  return context;
}

/** Create the low-detail vehicle scene graph and return semantic handles. */
export function createVehicleGeometry(root, pickables = []) {
  const groups = { root, systems: {}, children: {}, pickables };
  const battery = createSystem(root, "battery", [0, 0.67, 0.18]);
  groups.systems.battery = battery;
  createBattery(battery, pickables);
  const inverter = createSystem(root, "inverter", [0, 0.96, -1.32]);
  groups.systems.inverter = inverter;
  createInverter(inverter, pickables);
  const motor = createSystem(root, "motor", [0, 0.72, -1.76]);
  groups.systems.motor = motor;
  createMotor(motor, pickables);
  const gears = createSystem(root, "gears", [0.02, 0.68, -1.82]);
  groups.systems.gears = gears;
  createGears(gears, pickables);
  createLeafSystems(groups, pickables);
  for (const id of SYSTEM_IDS) groups.systems[id] ??= root.getObjectByName(id);
  for (const system of Object.values(groups.systems)) {
    if (!system) continue;
    for (const child of system.children) {
      if (!child.userData.id) continue;
      groups.children[child.userData.id] = child;
    }
  }
  groups.body = createBody(root);
  groups.context = createContext(root, pickables);

  return groups;
}

export function systemForId(id) {
  if (SYSTEM_IDS.includes(id)) return id;
  return id?.split("-")[0] || null;
}
