import * as THREE from "three";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/** Motion state is intentionally schematic; it never claims to be a motor map. */
export function createMotionController({
  groups,
  flowPath = null,
  flowDots = [],
}) {
  const state = {
    active: null,
    params: { rpm: 900, ratio: 9, turn: 0, phase: 0.7, visualScale: 0.07 },
    flow: false,
    reduced: false,
    elapsed: 0,
    angle: 0,
    wheelAngles: [0, 0],
  };
  const phaseColors = [0xff9b64, 0xf1ca70, 0x75d3cf];

  const setMaterialEmissive = (object, color, intensity) => {
    object.traverse((node) => {
      if (!node.isMesh || !node.material || Array.isArray(node.material))
        return;
      if (node.material.emissive) {
        node.material.emissive.set(color);
        node.material.emissiveIntensity = intensity;
      }
    });
  };

  function update(t, dt = 0.016) {
    const safeDt = clamp(Number.isFinite(dt) ? dt : 0.016, 0, 0.1);
    state.elapsed += safeDt;
    if (!state.active && !state.flow) return;
    const p = state.params;
    const rpm = clamp(
      Number(p.inputRpm !== undefined ? p.inputRpm : p.rpm) || 0,
      0,
      22000,
    );
    const ratio = Math.max(1, Number(p.ratio) || 9);
    const speed =
      (rpm / 60) * Math.PI * 2 * Math.max(0, Number(p.visualScale) || 0.07);
    // Inverter mode visualizes its six switches and phase field only.  It does
    // not invent a mechanical 900 rpm rotor motion when no motor experiment is
    // running; motor/gears modes are the mechanical drivers.
    const activeDrive = ["motor", "gears"].includes(state.active);
    const phaseActivity = activeDrive || state.active === "inverter";
    const turn = clamp(Number(p.turn) || 0, -0.8, 0.8);
    const motorAngle = state.reduced ? 0 : state.angle;
    if (!state.reduced && activeDrive) {
      state.angle += speed * safeDt;
      const wheelDelta = (speed / ratio) * safeDt;
      state.wheelAngles[0] += wheelDelta * (1 - turn);
      state.wheelAngles[1] += wheelDelta * (1 + turn);
    }
    const motor = groups.children["motor-rotor"];
    const shaft = groups.children["motor-shaft"];
    // The motor's rotor and shaft are authored on the X axis.  Keeping both
    // groups on that axis makes the schematic rotation agree with the model.
    if (activeDrive && motor) motor.rotation.x = motorAngle;
    if (activeDrive && shaft) shaft.rotation.x = motorAngle;

    const pinion = groups.children["gears-pinion"];
    const reduction = groups.children["gears-reduction"];
    const internals = groups.children["gears-internals"];
    const gearAngle = motorAngle / ratio;
    if (state.active === "gears" || state.active === "motor") {
      if (pinion) pinion.rotation.y = motorAngle;
      if (reduction) reduction.rotation.y = -gearAngle;
      if (internals) internals.rotation.y = gearAngle;
      const wheels = groups.children["gears-wheels"];
      if (wheels) {
        wheels.children.forEach((wheel, index) => {
          wheel.rotation.x = state.wheelAngles[index] ?? gearAngle;
        });
      }
    }

    const stator = groups.children["motor-stator"];
    if (stator && phaseActivity) {
      const electricalHz = Math.max(0, Number(p.electricalHz) || 0);
      const fieldAngle = state.reduced
        ? 0
        : activeDrive
          ? motorAngle
          : t *
            0.001 *
            electricalHz *
            Math.max(0.01, Number(p.visualScale) || 0.07) *
            Math.PI *
            2;
      stator.traverse((node) => {
        if (
          !node.isMesh ||
          !node.material ||
          node.userData.role !== "stator-field"
        )
          return;
        const coilAngle = Math.atan2(node.position.z, node.position.y);
        const field = (Math.sin(fieldAngle - coilAngle) + 1) / 2;
        const phase =
          Math.floor(((coilAngle + Math.PI) / (Math.PI * 2)) * 3) % 3;
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];
        for (const material of materials) {
          if (!material.emissive) continue;
          material.emissive.set(phaseColors[(phase + 3) % 3]);
          material.emissiveIntensity = 0.04 + field * 0.38;
        }
      });
    }

    const switches = groups.children["inverter-switches"];
    if (switches && phaseActivity) {
      switches.traverse((node) => {
        const match = node.userData.role?.match(/^phase-(\d+)-(\d+)$/);
        if (!node.isMesh || !match) return;
        const phase = Number(match[1]);
        const half = Number(match[2]);
        const electricalHz = Math.max(0, Number(p.electricalHz) || 0);
        const modulation = clamp(Number(p.modulation) || 0, 0, 1);
        const phaseAngle =
          t *
          0.001 *
          electricalHz *
          Math.max(0.01, Number(p.visualScale) || 0.07) *
          Math.PI *
          2;
        const signal = Math.sin(phaseAngle + phase * ((Math.PI * 2) / 3));
        // Each phase leg is complementary: the upper switch follows the
        // positive half-wave, the lower switch the negative half-wave.
        const enabled =
          modulation > 0 && (half === 0 ? signal >= 0 : signal < 0);
        if (node.material?.emissive) {
          node.material.emissive.set(phaseColors[phase]);
          node.material.emissiveIntensity = enabled
            ? 0.08 + modulation * 0.42
            : 0.02;
        }
      });
    }

    const batteryLoad = p.loadKW === undefined || Number(p.loadKW) > 0;
    for (const dot of flowDots) {
      dot.visible =
        state.flow &&
        !state.reduced &&
        (state.active !== "battery" || batteryLoad);
      if (dot.visible && flowPath) {
        const index = flowDots.indexOf(dot);
        const phase =
          (t * 0.00012 * Math.max(0.25, p.phase) +
            index / Math.max(1, flowDots.length)) %
          1;
        dot.position.copy(flowPath.getPoint(phase));
      }
    }
  }

  return {
    state,
    update,
    setRunning(system, params = {}) {
      state.active = system;
      // A standalone battery run is itself the current-flow lesson.  The
      // scene can still hide the markers for a zero load in update().
      state.flow = system === "battery";
      state.params = { ...state.params, ...params };
      if (params.inputRpm !== undefined) state.params.rpm = params.inputRpm;
      else if (params.rpm !== undefined) delete state.params.inputRpm;
      state.angle = 0;
      state.wheelAngles = [0, 0];
    },
    setParams(params = {}) {
      state.params = { ...state.params, ...params };
      if (params.inputRpm !== undefined) state.params.rpm = params.inputRpm;
      else if (params.rpm !== undefined) delete state.params.inputRpm;
    },
    setFlow(enabled) {
      state.flow = Boolean(enabled);
    },
    setReduced(enabled) {
      state.reduced = Boolean(enabled);
    },
    stop() {
      state.active = null;
      state.flow = false;
      for (const dot of flowDots) dot.visible = false;
    },
    isAnimating() {
      return !state.reduced && Boolean(state.active || state.flow);
    },
  };
}

export function buildFlowPath(root) {
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.7, 0.9, 0.15),
    new THREE.Vector3(0.72, 0.92, -0.7),
    new THREE.Vector3(0.38, 1.04, -1.15),
    new THREE.Vector3(0, 1.04, -1.35),
    new THREE.Vector3(0, 0.8, -1.55),
  ]);
  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(path, 28, 0.018, 6, false),
    new THREE.MeshBasicMaterial({
      color: 0xee9857,
      transparent: true,
      opacity: 0.65,
    }),
  );
  tube.name = "dc-flow-connection";
  tube.userData.connection = { systems: ["battery", "inverter"], type: "dc" };
  root.add(tube);
  const dots = Array.from({ length: 9 }, () => {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0xe8ffc6 }),
    );
    dot.visible = false;
    root.add(dot);
    return dot;
  });
  return { path, tube, dots };
}
