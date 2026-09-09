import { test } from "node:test";
import assert from "node:assert/strict";
import { workingPartVisible } from "./working-view.js";

test("working cutaway hides neighbours and covers while retaining moving parts", () => {
  assert.equal(workingPartVisible("motor-housing", "motor", "motor"), false);
  assert.equal(workingPartVisible("motor-rotor", "motor", "motor"), true);
  assert.equal(workingPartVisible("motor-stator", "motor", "motor"), true);
  assert.equal(workingPartVisible("battery-lid", "battery", "motor"), false);
  assert.equal(workingPartVisible("gears-case", "gears", "gears"), false);
  assert.equal(workingPartVisible("gears-internals", "gears", "gears"), true);
  assert.equal(workingPartVisible("inverter-switches", "inverter", "inverter"), true);
});
test("stopping restores covers and neighbouring systems to normal visibility rules", () => {
  assert.equal(workingPartVisible("motor-housing", "motor", null), true);
  assert.equal(workingPartVisible("battery-lid", "battery", null), true);
});
