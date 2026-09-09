import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createProgress,
  DEFAULT_LESSON_IDS,
  isComplete,
  markQuiz,
  markTask,
  recordGuide,
} from "./progress.js";

test("createProgress returns a complete v2 default state", () => {
  const state = createProgress();
  assert.equal(state.version, 2);
  assert.deepEqual(Object.keys(state.lessons.basic), DEFAULT_LESSON_IDS);
  assert.deepEqual(DEFAULT_LESSON_IDS, ["energy", "battery", "inverter", "motor", "gears", "charging", "bms", "thermal"]);
  assert.deepEqual(state.guideStep, { basic: 0, advanced: 0 });
  assert.equal(state.lessons.basic.battery.task, false);
  assert.equal(state.lessons.advanced.bms.quiz, false);
  assert.deepEqual(state.legacyCompleted, []);
});

test("legacy completed entries are preserved but do not unlock v2 lessons", () => {
  const state = createProgress(JSON.stringify({ mode: "advanced", completed: ["basic:battery", "advanced:motor"], started: true }));
  assert.equal(state.mode, "advanced");
  assert.equal(state.started, true);
  assert.deepEqual(state.legacyCompleted, ["basic:battery", "advanced:motor"]);
  assert.equal(state.lessons.basic.battery.task, false);
  assert.equal(isComplete(state, "advanced", "motor"), false);
});

test("malformed localStorage data safely becomes a fresh state", () => {
  const state = createProgress("not-json");
  assert.equal(state.version, 2);
  assert.equal(state.started, false);
  assert.equal(state.selectedId, "battery");
});

test("task and quiz are immutable, idempotent and mode-specific", () => {
  const initial = createProgress();
  const task = markTask(initial, "basic", "battery");
  const both = markQuiz(task, "basic", "battery");
  assert.equal(initial.lessons.basic.battery.task, false);
  assert.equal(task.lessons.basic.battery.task, true);
  assert.equal(task.lessons.basic.battery.quiz, false);
  assert.equal(isComplete(both, "basic", "battery"), true);
  assert.equal(isComplete(both, "advanced", "battery"), false);
  assert.deepEqual(markTask(task, "basic", "battery"), task);
});

test("guided introduction advances only through the expected event sequence", () => {
  let state = createProgress();
  state = recordGuide(state, { type: "flow", id: "inverter" });
  assert.equal(state.guideStep.basic, 0);
  state = recordGuide(state, { type: "select", id: "battery" });
  assert.equal(state.guideStep.basic, 1);
  state = recordGuide(state, { type: "flow", id: "inverter" });
  state = recordGuide(state, { type: "run", id: "motor" });
  state = recordGuide(state, { type: "select", id: "gears-wheels" });
  assert.equal(state.guideStep.basic, 4);
  assert.equal(state.selectedId, "gears-wheels");
  assert.equal(state.started, true);
  assert.equal(recordGuide(state, { type: "select", id: "battery" }).guideStep.basic, 4);
});

test("guided introduction progress is independent per mode", () => {
  let state = recordGuide(createProgress(), { type: "select", id: "battery" });
  state = { ...state, mode: "advanced" };
  state = recordGuide(state, { type: "select", id: "battery" });
  assert.equal(state.guideStep.basic, 1);
  assert.equal(state.guideStep.advanced, 1);
});
