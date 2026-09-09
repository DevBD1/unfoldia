import * as THREE from "three";
import { createSelectionHighlight } from "./selection-highlight.js";
import { workingPartVisible } from "./working-view.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  CHILD_IDS,
  SYSTEM_IDS,
  createVehicleGeometry,
  systemForId,
} from "./geometry.js";
import {
  CORE_SYSTEM_IDS,
  LEAF_SYSTEM_IDS,
  applyChildAssembly,
  applyInventoryPiece,
  computeInventoryLayout,
  fitCameraToObject,
  footprintOf,
  inventoryPieceIds,
  visibleSystemSet,
} from "./scene-layout.js";
import { buildFlowPath, createMotionController } from "./scene-motion.js";

const DEFAULT_PARAMS = { rpm: 900, ratio: 9, turn: 0, phase: 0.7 };
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function isTapGesture(start, end, threshold = 6) {
  if (!start || !end || start.pointerId !== end.pointerId) return false;
  if (start.cancelled || end.cancelled || start.multiTouch || end.multiTouch)
    return false;
  return Math.hypot(end.x - start.x, end.y - start.y) <= threshold;
}

function makeConnection(root, points, color, systems, type, width = 0.018) {
  const path = new THREE.CatmullRomCurve3(
    points.map((point) => new THREE.Vector3(...point)),
  );
  const samples = path.getPoints(24);
  const object =
    type === "mechanical"
      ? new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(samples),
          new THREE.LineDashedMaterial({
            color,
            dashSize: 0.08,
            gapSize: 0.05,
            transparent: true,
            opacity: 0.78,
          }),
        )
      : new THREE.Mesh(
          new THREE.TubeGeometry(path, 24, width, 6, false),
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.68,
          }),
        );
  if (object.isLine) object.computeLineDistances();
  object.userData.connection = { systems, type };
  root.add(object);
  return object;
}

function makeSceneLights(scene) {
  scene.add(new THREE.HemisphereLight(0xe8f5ee, 0x34453b, 3));
  const key = new THREE.DirectionalLight(0xffffff, 4);
  key.position.set(3, 9, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb5efc8, 2);
  rim.position.set(-5, 3, -3);
  scene.add(rim);
}

export function createScene(host, onSelect, onMetrics) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#101713");
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(7, 6.2, 8);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.prepend(renderer.domElement);
  renderer.domElement.setAttribute(
    "aria-label",
    "Etkileşimli elektrikli araç modeli. Döndürmek için sürükleyin; parçaları seçmek için dokunun.",
  );

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  controls.target.set(0, 0.6, 0);
  controls.minDistance = 3;
  controls.maxDistance = 100;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.enablePan = false;
  makeSceneLights(scene);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshBasicMaterial({ color: 0x0d1411 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.12;
  floor.receiveShadow = true;
  scene.add(floor);
  const grid = new THREE.GridHelper(24, 48, 0x34473a, 0x203028);
  grid.position.y = -0.11;
  scene.add(grid);

  const root = new THREE.Group();
  root.name = "vehicle-root";
  scene.add(root);
  const pickables = [];
  const groups = createVehicleGeometry(root, pickables);
  const selectionHighlight = createSelectionHighlight(scene);
  const selectionBadge = document.createElement("div");
  selectionBadge.className = "selection-badge";
  selectionBadge.setAttribute("role", "status");
  host.append(selectionBadge);
  for (const [id, child] of Object.entries(groups.children)) {
    child.userData.assemblyParent = groups.systems[systemForId(id)] ?? root;
    child.userData.assemblyPosition = child.position.clone();
    child.userData.assemblyQuaternion = child.quaternion.clone();
  }

  const flow = buildFlowPath(root);
  const acPaths = [-0.035, 0, 0.035].map((x) =>
    makeConnection(
      root,
      [
        [0.02 + x, 0.98, -1.36],
        [x, 0.9, -1.53],
        [x, 0.76, -1.68],
      ],
      0x62d2d4,
      ["inverter", "motor"],
      "ac",
      0.009,
    ),
  );
  const connections = [
    flow.tube,
    ...acPaths,
    makeConnection(
      root,
      [
        [0, 0.75, -1.77],
        [0.35, 0.7, -1.81],
      ],
      0xb6b7ad,
      ["motor", "gears"],
      "mechanical",
      0.024,
    ),
    makeConnection(
      root,
      [
        [-0.63, 0.98, 1.52],
        [0, 0.78, 0.48],
      ],
      0xbab5e8,
      ["charger", "battery"],
      "ac-charge",
      0.014,
    ),
  ];
  const reduced = Boolean(
    globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  const motion = createMotionController({
    groups,
    flowPath: flow.path,
    flowDots: flow.dots,
  });
  motion.setReduced(reduced);

  const inventoryLabels = new Map();
  const labelNames = {
    "battery-tray": "Batarya alt muhafazası",
    "battery-lid": "Batarya kapağı",
    "battery-modules": "Batarya modülleri",
    "battery-cells": "Hücreler",
    "battery-busbars": "Bara bağlantıları",
    "battery-contactors": "Kontaktör grubu",
    "motor-stator": "Stator",
    "motor-rotor": "Rotor",
    "motor-shaft": "Motor mili",
    "motor-housing": "Motor muhafazası",
    "inverter-switches": "Güç anahtarları",
    "inverter-capacitor": "DC-link kondansatörü",
    "inverter-heatsink": "Soğutucu",
    "inverter-board": "Kontrol kartı",
    "gears-pinion": "Giriş pinyonu",
    "gears-reduction": "Redüksiyon dişlisi",
    "gears-case": "Diferansiyel gövdesi",
    "gears-internals": "Diferansiyel içi",
    "gears-axles": "Yarım akslar",
    "gears-wheels": "Tekerlekler",
    charger: "Şarj cihazı",
    dcdc: "DC-DC dönüştürücü",
    thermal: "Termal yönetim",
    bms: "BMS",
  };
  const labelLayer = document.createElement("div");
  labelLayer.className = "inventory-label-layer";
  Object.assign(labelLayer.style, {
    position: "absolute",
    inset: "0",
    pointerEvents: "none",
    zIndex: "5",
    overflow: "hidden",
  });
  host.append(labelLayer);
  for (const [id, text] of Object.entries(labelNames)) {
    const label = document.createElement("button");
    label.className = "inventory-label";
    label.type = "button";
    label.textContent = text;
    label.title = text;
    label.style.cssText =
      "position:absolute;transform:translate(-50%,8px);display:none;pointer-events:auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:9px;padding:3px 4px;background:#15251eee;border:1px solid #42614e;border-radius:4px;color:#d9eadf;";
    label.addEventListener("click", () => {
      setSelected(id, true);
      fit(id);
      requestRender();
    });
    labelLayer.append(label);
    inventoryLabels.set(id, label);
  }

  let visibleSystems = new Set(SYSTEM_IDS);
  let selected = "battery";
  let isolated = null;
  let focusedId = null;
  let layoutMode = "assembly";
  let explodeAmount = 0;
  let explodeTarget = 0;
  let bodyVisible = true;
  let destroyed = false;
  let frame = null;
  let dirty = true;
  let lastTime = 0;
  let metrics = {
    triangles: 0,
    drawCalls: 0,
    frameMs: 0,
    pixelRatio: renderer.getPixelRatio(),
  };
  let lastMetricsSent = 0;
  let tapStart = null;
  let inTick = false;

  function objectIsVisible(object) {
    let node = object;
    while (node) {
      if (!node.visible) return false;
      node = node.parent;
    }
    return true;
  }
  function semanticObject(id) {
    return groups.children[id] ?? groups.systems[id] ?? null;
  }
  function applyHighlight() {
    const targets = SYSTEM_IDS.includes(selected)
      ? [groups.systems[selected], ...CHILD_IDS.filter(id => systemForId(id) === selected).map(id => groups.children[id])]
      : [semanticObject(selected)];
    selectionHighlight.select(targets);
    selectionBadge.textContent = `SEÇİLİ · ${labelNames[selected] || {battery:'Batarya paketi',motor:'Elektrik motoru',inverter:'İnverter',gears:'Mekanik aktarım'}[selected] || selected}`;
    for (const [id, child] of Object.entries(groups.children)) {
      if (!child) continue;
      const system = systemForId(id);
      const match =
        selected === id || (selected === system && visibleSystems.has(system));
      child.traverse((node) => {
        if (!node.isMesh || !node.material) return;
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];
        for (const material of materials) {
          if (!material.emissive) continue;
          if (node.userData.baseEmissive === undefined)
            node.userData.baseEmissive = material.emissive.getHex();
          material.emissive.set(match ? 0x294720 : node.userData.baseEmissive);
          material.emissiveIntensity = match ? 0.6 : 0;
        }
      });
    }
  }
  function applyVisibility() {
    groups.body.visible = bodyVisible && layoutMode === "assembly" && !isolated;
    if (groups.context)
      groups.context.visible = layoutMode === "assembly" && !isolated;
    for (const id of CHILD_IDS)
      groups.children[id].visible = visibleSystems.has(systemForId(id));
    for (const id of SYSTEM_IDS) {
      const system = groups.systems[id];
      if (system) system.visible = visibleSystems.has(id);
    }
    if (layoutMode === "inventory") {
      const inventoryIds = new Set(inventoryPieceIds(visibleSystems, isolated));
      for (const id of CHILD_IDS) {
        const child = groups.children[id];
        if (child?.parent === root) child.visible = inventoryIds.has(id);
      }
      for (const id of LEAF_SYSTEM_IDS) {
        const system = groups.systems[id];
        if (system) system.visible = inventoryIds.has(id);
      }
    }
    if (isolated) {
      const targetSystem = systemForId(isolated);
      const isolatedSystem = SYSTEM_IDS.includes(isolated);
      for (const id of SYSTEM_IDS) {
        const system = groups.systems[id];
        if (system)
          system.visible = visibleSystems.has(id) && id === targetSystem;
      }
      for (const id of CHILD_IDS) {
        const child = groups.children[id];
        if (!child) continue;
        child.visible =
          visibleSystems.has(systemForId(id)) &&
          (isolatedSystem ? systemForId(id) === targetSystem : id === isolated);
      }
      for (const id of LEAF_SYSTEM_IDS) {
        const system = groups.systems[id];
        if (system) system.visible = visibleSystems.has(id) && isolated === id;
      }
    }
    if (motion.state.active) {
      groups.body.visible = false;
      if (groups.context) groups.context.visible = false;
      for (const id of SYSTEM_IDS) groups.systems[id].visible = visibleSystems.has(id) && id === motion.state.active;
      for (const id of CHILD_IDS) groups.children[id].visible = visibleSystems.has(systemForId(id)) && workingPartVisible(id, systemForId(id), motion.state.active);
    }
    for (const connection of connections) {
      const info = connection.userData.connection;
      if (!info) continue;
      const gate = info.type === "mechanical" || motion.state.flow;
      connection.visible =
        layoutMode === "assembly" &&
        explodeAmount === 0 &&
        !isolated &&
        gate &&
        info.systems.every((id) => visibleSystems.has(id));
    }
    applyHighlight();
  }
  function applyLayout() {
    if (layoutMode === "assembly") {
      for (const id of CHILD_IDS) {
        const child = groups.children[id];
        const parent = groups.systems[systemForId(id)] ?? root;
        if (!child) continue;
        applyChildAssembly(child, parent, explodeAmount);
        child.visible = visibleSystems.has(systemForId(id));
      }
      for (const id of LEAF_SYSTEM_IDS) {
        const system = groups.systems[id];
        if (system?.userData.base) system.position.copy(system.userData.base);
      }
      applyVisibility();
      return;
    }
    for (const id of CHILD_IDS) groups.children[id]?.rotation.set(0, 0, 0);
    for (const id of LEAF_SYSTEM_IDS) groups.systems[id]?.rotation.set(0, 0, 0);
    const footprints = {};
    for (const id of CHILD_IDS)
      if (groups.children[id])
        footprints[id] = footprintOf(groups.children[id]);
    for (const id of LEAF_SYSTEM_IDS)
      if (groups.systems[id]) footprints[id] = footprintOf(groups.systems[id]);
    const placements = computeInventoryLayout(
      visibleSystems,
      footprints,
      isolated,
      camera.aspect,
    );
    for (const id of CHILD_IDS) {
      const child = groups.children[id];
      const placement = placements[id];
      if (child && placement) applyInventoryPiece(child, root, placement);
    }
    for (const id of LEAF_SYSTEM_IDS) {
      const system = groups.systems[id];
      const placement = placements[id];
      if (system && placement) {
        applyInventoryPiece(system, root, placement);
      }
    }
    applyVisibility();
  }
  function fit(target = null) {
    focusedId = target;
    let object = target ? semanticObject(target) : root;
    if (layoutMode === "inventory" && CORE_SYSTEM_IDS.includes(target)) {
      const pieces = CHILD_IDS.filter((id) => systemForId(id) === target).map(
        (id) => groups.children[id],
      );
      object = {
        updateWorldMatrix() {
          root.updateWorldMatrix(true, true);
        },
        traverseVisible(fn) {
          pieces.forEach((piece) => piece.traverseVisible(fn));
        },
      };
    }
    if (object)
      fitCameraToObject(
        camera,
        controls,
        object,
        layoutMode === "inventory" ? 1.15 : 1.25,
      );
  }
  function setSelected(id, notify = false) {
    if (!id || (!SYSTEM_IDS.includes(id) && !CHILD_IDS.includes(id))) return;
    selected = id;
    applyHighlight();
    dirty = true;
    requestRender();
    if (notify && typeof onSelect === "function") onSelect(id);
  }
  function render(now = performance.now()) {
    const start = performance.now();
    const bounds = selectionHighlight.update();
    selectionBadge.hidden = bounds.isEmpty();
    if (!bounds.isEmpty()) {
      const anchor = bounds.getCenter(new THREE.Vector3());
      anchor.y = bounds.max.y;
      anchor.project(camera);
      const rect = host.getBoundingClientRect();
      selectionBadge.style.left = `${clamp((anchor.x + 1) * rect.width / 2, 100, Math.max(100, rect.width - 100))}px`;
      selectionBadge.style.top = `${clamp((1 - anchor.y) * rect.height / 2 - 36, 8, Math.max(8, rect.height - 40))}px`;
    }
    renderer.render(scene, camera);
    metrics = {
      renderCount: (metrics.renderCount || 0) + 1,
      triangles: renderer.info.render.triangles,
      drawCalls: renderer.info.render.calls,
      frameMs: performance.now() - start,
      pixelRatio: renderer.getPixelRatio(),
    };
    host.dataset.triangles = String(metrics.triangles);
    host.dataset.drawCalls = String(metrics.drawCalls);
    host.dataset.frameMs = metrics.frameMs.toFixed(2);
    host.dataset.renderCount = String(metrics.renderCount);
    if (typeof onMetrics === "function" && now - lastMetricsSent > 500) {
      lastMetricsSent = now;
      onMetrics({ ...metrics });
    }
    const rect = host.getBoundingClientRect();
    for (const [id, label] of inventoryLabels) {
      const piece = groups.children[id] ?? groups.systems[id];
      const visible =
        layoutMode === "inventory" && piece && objectIsVisible(piece);
      label.style.display = visible ? "block" : "none";
      if (visible) {
        const point = (
          piece.userData.inventoryCenter?.clone() ??
          new THREE.Vector3().setFromMatrixPosition(piece.matrixWorld)
        ).project(camera);
        const columns = Math.max(
          1,
          Math.round(
            Math.sqrt(
              inventoryPieceIds(visibleSystems, isolated).length *
                camera.aspect,
            ),
          ),
        );
        label.style.maxWidth = `${Math.max(35, rect.width / (columns + 1) - 8)}px`;
        label.style.left = `${((point.x + 1) / 2) * rect.width}px`;
        label.style.top = `${((1 - point.y) / 2) * rect.height}px`;
      }
    }
    dirty = false;
  }
  function tick(now) {
    frame = null;
    if (destroyed) return;
    const dt = lastTime ? Math.min(0.1, (now - lastTime) / 1000) : 0.016;
    lastTime = now;
    inTick = true;
    const controlsChanged = controls.update();
    const moving = motion.isAnimating();
    const transitioning =
      layoutMode === "assembly" && explodeAmount !== explodeTarget;
    if (transitioning) {
      explodeAmount += (explodeTarget - explodeAmount) * Math.min(1, dt * 12);
      if (Math.abs(explodeAmount - explodeTarget) < 0.002)
        explodeAmount = explodeTarget;
      applyLayout();
      fit(isolated);
    }
    if (moving) motion.update(now, dt);
    if (dirty || controlsChanged || moving || transitioning) render(now);
    inTick = false;
    if (dirty || controlsChanged || moving || transitioning)
      frame = requestAnimationFrame(tick);
  }
  function requestRender() {
    dirty = true;
    if (!frame && !inTick) frame = requestAnimationFrame(tick);
  }

  function resize() {
    const rect = host.getBoundingClientRect();
    renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), true);
    camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
    camera.updateProjectionMatrix();
    if (layoutMode === "inventory") applyLayout();
    fit(focusedId || isolated);
    requestRender();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  controls.addEventListener("change", requestRender);
  controls.addEventListener("start", requestRender);
  controls.addEventListener("end", requestRender);

  function pointerDown(event) {
    if (event.pointerType === "touch" && event.isPrimary === false) {
      if (tapStart) tapStart.multiTouch = true;
      return;
    }
    tapStart = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      multiTouch: false,
    };
  }
  function pointerMove(event) {
    if (!tapStart || tapStart.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - tapStart.x, event.clientY - tapStart.y) > 6)
      tapStart.moved = true;
  }
  function pointerCancel(event) {
    if (tapStart?.pointerId === event.pointerId) tapStart.cancelled = true;
  }
  function pointerUp(event) {
    if (
      !tapStart ||
      !isTapGesture(tapStart, {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        multiTouch: tapStart.moved,
      })
    ) {
      tapStart = null;
      return;
    }
    const rect = renderer.domElement.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(pointer, camera);
    const hit = ray.intersectObjects(
      pickables.filter(objectIsVisible),
      true,
    )[0];
    if (hit?.object?.userData?.id) setSelected(hit.object.userData.id, true);
    tapStart = null;
  }
  renderer.domElement.addEventListener("pointerdown", pointerDown);
  renderer.domElement.addEventListener("pointermove", pointerMove);
  renderer.domElement.addEventListener("pointercancel", pointerCancel);
  renderer.domElement.addEventListener("pointerup", pointerUp);

  resize();
  applyLayout();
  fit();
  requestRender();

  return {
    select(id) {
      setSelected(id, false);
    },
    focus(id = null) {
      fit(id);
      requestRender();
    },
    setVisibility(ids = SYSTEM_IDS) {
      const next = visibleSystemSet(ids);
      if ([...next].join() === [...visibleSystems].join()) return;
      visibleSystems = next;
      motion.stop();
      motion.setFlow(false);
      if (layoutMode === "inventory") applyLayout();
      else applyVisibility();
      fit();
      requestRender();
    },
    isolate(id = null) {
      const next =
        id && (SYSTEM_IDS.includes(id) || CHILD_IDS.includes(id)) ? id : null;
      if (next === isolated) return;
      isolated = next;
      motion.stop();
      motion.setFlow(false);
      if (layoutMode === "inventory") applyLayout();
      else applyVisibility();
      fit(isolated);
      requestRender();
    },
    setLayout(mode) {
      if (mode !== "assembly" && mode !== "inventory") return;
      layoutMode = mode;
      motion.stop();
      motion.setFlow(false);
      if (mode === "assembly") explodeAmount = 0;
      else {
        controls.target.set(0, 0, 0);
        camera.position.set(0, 20, 0.001);
      }
      applyLayout();
      explodeTarget = explodeAmount;
      fit();
      requestRender();
    },
    explode(value) {
      explodeTarget = clamp(Number(value) || 0, 0, 1);
      if (reduced) explodeAmount = explodeTarget;
      if (layoutMode === "assembly") {
        applyLayout();
        if (explodeTarget > 0) motion.stop();
        fit();
        requestRender();
      }
    },
    body(value) {
      bodyVisible = Boolean(value);
      applyVisibility();
      requestRender();
    },
    flow(value) {
      motion.setFlow(value);
      if (!value) motion.stop();
      applyVisibility();
      requestRender();
    },
    view(type) {
      const position =
        type === "top"
          ? [0, 15, 0.01]
          : type === "side"
            ? [10, 2.4, 0]
            : [7, 6.2, 8];
      camera.position.set(...position);
      controls.target.set(0, layoutMode === "inventory" ? 0.3 : 0.6, 0);
      controls.update();
      fit(isolated);
      requestRender();
    },
    run(system = null, params = {}) {
      if (system && !SYSTEM_IDS.includes(system)) return;
      if (!system) {
        motion.stop();
        applyVisibility();
        requestRender();
        return;
      }
      isolated = null;
      layoutMode = "assembly";
      explodeAmount = 0;
      explodeTarget = 0;
      applyLayout();
      motion.setRunning(system, { ...DEFAULT_PARAMS, ...params });
      motion.update(performance.now(), 0);
      applyVisibility();
      controls.target.copy(groups.systems[system].position);
      camera.position.copy(controls.target).add(new THREE.Vector3(5, 3, 4));
      controls.update();
      fit(system);
      requestRender();
    },
    updateParams(params = {}) {
      motion.setParams(params);
      motion.update(performance.now(), 0);
      requestRender();
    },
    getMetrics() {
      return { ...metrics };
    },
    destroy() {
      destroyed = true;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      labelLayer.remove();
      selectionBadge.remove();
      selectionHighlight.destroy();
      controls.removeEventListener("change", requestRender);
      controls.removeEventListener("start", requestRender);
      controls.removeEventListener("end", requestRender);
      renderer.domElement.removeEventListener("pointerdown", pointerDown);
      renderer.domElement.removeEventListener("pointermove", pointerMove);
      renderer.domElement.removeEventListener("pointercancel", pointerCancel);
      renderer.domElement.removeEventListener("pointerup", pointerUp);
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
