import { test } from "node:test";
import assert from "node:assert/strict";
import {
  children,
  getNode,
  lessons,
  nodes,
  systems,
} from "./atlas.js";
import { CHILD_IDS, SYSTEM_IDS, systemForId } from "./geometry.js";
import { experimentValues } from "./experiments.js";
import {
  batteryExperiment,
  gearsExperiment,
  inverterExperiment,
  motorExperiment,
} from "./physics.js";
import {
  createProgress,
  DEFAULT_LESSON_IDS,
  isComplete,
  markQuiz,
  markTask,
} from "./progress.js";

test("atlas and geometry expose one semantic 28-node vocabulary", () => {
  assert.deepEqual(systems.map((system) => system.id), SYSTEM_IDS);
  assert.equal(nodes.length, 28);
  assert.equal(children.length, 20);
  assert.deepEqual(
    children.map((child) => child.id),
    CHILD_IDS,
  );

  for (const id of SYSTEM_IDS) {
    const node = getNode(id);
    assert.ok(node, `missing system node: ${id}`);
    assert.equal(node.parentId, "vehicle");
    assert.equal(node.systemId, id);
    assert.equal(systemForId(id), id);
  }
  for (const id of CHILD_IDS) {
    const node = getNode(id);
    assert.ok(node, `missing child node: ${id}`);
    assert.ok(SYSTEM_IDS.includes(node.parentId));
    assert.equal(node.systemId, node.parentId);
    assert.ok(node.name && node.english && node.aliases.length > 0);
  }
});

test("every lesson task is executable by the supported UI action vocabulary", () => {
  assert.deepEqual(lessons.map((lesson) => lesson.id), DEFAULT_LESSON_IDS);
  const supportedRoots = new Set(["battery", "inverter", "motor", "gears"]);
  for (const lesson of lessons) {
    const { type, targetId } = lesson.task;
    assert.equal(targetId, lesson.targetId);
    if (type === "select") {
      assert.ok(getNode(targetId), `${lesson.id} select target is not a node`);
    } else if (type === "adjust" || type === "run") {
      assert.ok(supportedRoots.has(targetId), `${lesson.id} ${type} target is not a runnable experiment root`);
      assert.ok(SYSTEM_IDS.includes(targetId));
    } else if (type === "flow") {
      assert.equal(targetId, "inverter");
    } else {
      assert.fail(`${lesson.id} uses unsupported task type ${type}`);
    }
  }
});

test("all eight lessons can reach completion independently in both modes", () => {
  for (const mode of ["basic", "advanced"]) {
    let state = createProgress({ mode, started: true });
    for (const lesson of lessons) {
      const before = state;
      state = markTask(state, mode, lesson.id);
      state = markQuiz(state, mode, lesson.id);
      assert.equal(isComplete(state, mode, lesson.id), true);
      assert.equal(isComplete(before, mode, lesson.id), false);
    }
    const roundTrip = createProgress(JSON.stringify(state));
    for (const lesson of lessons) assert.equal(isComplete(roundTrip, mode, lesson.id), true);
    assert.equal(roundTrip.mode, mode);
  }
});

test("legacy completion remains visible without completing any new lesson", () => {
  const state = createProgress({ mode: "basic", started: true, completed: ["basic:battery", "advanced:motor"] });
  assert.deepEqual(state.legacyCompleted, ["basic:battery", "advanced:motor"]);
  for (const lesson of lessons) {
    assert.equal(isComplete(state, "basic", lesson.id), false);
    assert.equal(isComplete(state, "advanced", lesson.id), false);
  }
});

test("physical experiment endpoints stay finite and zero load is JSON-safe", () => {
  const battery = experimentValues.battery;
  for (const series of [12, 120]) {
    for (const parallel of [1, 60]) {
      for (const loadKW of [battery.loadKW, 0, 150]) {
        const result = batteryExperiment({ ...battery, series, parallel, loadKW });
        for (const [key, value] of Object.entries(result)) {
          if (key !== "durationHours") assert.ok(Number.isFinite(value), `battery ${key}`);
        }
        if (loadKW === 0) assert.equal(result.durationHours, null);
        else assert.ok(Number.isFinite(result.durationHours));
      }
    }
  }

  for (const torqueNm of [0, 300]) {
    for (const rpm of [0, 10000]) {
      const result = motorExperiment({ ...experimentValues.motor, torqueNm, rpm });
      assert.ok(Number.isFinite(result.angularSpeed));
      assert.ok(Number.isFinite(result.powerKW));
    }
  }

  for (const dcVoltage of [100, 450]) {
    for (const modulation of [0, 1]) {
      for (const electricalHz of [1, 100]) {
        const result = inverterExperiment({ ...experimentValues.inverter, dcVoltage, modulation, electricalHz });
        assert.ok(result.phaseVoltages.every(Number.isFinite));
        assert.ok(Number.isFinite(result.phasePeakVoltage));
        assert.ok(Number.isFinite(result.lineRmsVoltage));
      }
    }
  }

  for (const inputRpm of [0, 10000]) {
    for (const inputTorqueNm of [0, 300]) {
      for (const ratio of [2, 12]) {
        for (const turn of [-0.6, 0.6]) {
          const result = gearsExperiment({ ...experimentValues.gears, inputRpm, inputTorqueNm, ratio, turn });
          assert.ok(Object.values(result).every(Number.isFinite));
        }
      }
    }
  }
});
