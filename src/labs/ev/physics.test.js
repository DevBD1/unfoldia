import { test } from "node:test";
import assert from "node:assert/strict";
import {
  batteryExperiment,
  gearsExperiment,
  inverterExperiment,
  motorExperiment,
} from "./physics.js";

test("battery experiment calculates pack energy, current and runtime", () => {
  const result = batteryExperiment();
  assert.equal(result.voltage, 345.6);
  assert.ok(Math.abs(result.capacityAh - 220.8) < 1e-12);
  assert.ok(Math.abs(result.nominalKWh - 76.30848) < 1e-12);
  assert.ok(Math.abs(result.usableKWh - 68.677632) < 1e-12);
  assert.ok(Math.abs(result.currentA - 30000 / 345.6) < 1e-12);
  assert.ok(Math.abs(result.durationHours - 68.677632 / 30) < 1e-12);
});

test("battery zero load uses JSON-safe null runtime", () => {
  const result = batteryExperiment({ loadKW: 0, usableFraction: 0 });
  assert.equal(result.currentA, 0);
  assert.equal(result.durationHours, null);
  assert.doesNotThrow(() => JSON.stringify(result));
});

test("motor power follows P = T times omega", () => {
  const result = motorExperiment({ torqueNm: 100, rpm: 2000 });
  assert.ok(Math.abs(result.angularSpeed - (2000 * 2 * Math.PI) / 60) < 1e-12);
  assert.ok(Math.abs(result.powerKW - (100 * 2000 * 2 * Math.PI) / 60 / 1000) < 1e-12);
});

test("inverter returns balanced 120-degree sinusoidal phases", () => {
  const result = inverterExperiment({ dcVoltage: 350, modulation: 0.8, electricalHz: 50, time: 0 });
  assert.equal(result.phasePeakVoltage, 140);
  assert.ok(Math.abs(result.phaseVoltages[0]) < 1e-12);
  assert.ok(Math.abs(result.phaseVoltages[1] + 140 * Math.sqrt(3) / 2) < 1e-12);
  assert.ok(Math.abs(result.phaseVoltages[2] - 140 * Math.sqrt(3) / 2) < 1e-12);
  assert.ok(Math.abs(result.lineRmsVoltage - 140 * Math.sqrt(3 / 2)) < 1e-12);
});

test("gears conserve mean wheel speed and apply efficiency to power", () => {
  const result = gearsExperiment({ inputRpm: 4000, inputTorqueNm: 100, ratio: 9, efficiency: 0.9, turn: 0.25 });
  assert.equal(result.outputRpm, 4000 / 9);
  assert.equal(result.outputTorqueNm, 810);
  assert.ok(Math.abs(result.outputPowerKW - result.inputPowerKW * 0.9) < 1e-12);
  assert.equal((result.leftRpm + result.rightRpm) / 2, result.outputRpm);
  assert.ok(result.rightRpm > result.leftRpm);
});

test("physics inputs reject non-finite and out-of-range values", () => {
  assert.throws(() => batteryExperiment({ series: 0 }), RangeError);
  assert.throws(() => batteryExperiment({ loadKW: -1 }), RangeError);
  assert.throws(() => batteryExperiment({ usableFraction: 1.1 }), RangeError);
  assert.throws(() => motorExperiment({ rpm: Infinity }), RangeError);
  assert.throws(() => inverterExperiment({ modulation: -0.1 }), RangeError);
  assert.throws(() => inverterExperiment({ time: NaN }), RangeError);
  assert.throws(() => gearsExperiment({ ratio: 0 }), RangeError);
  assert.throws(() => gearsExperiment({ turn: 0.81 }), RangeError);
});
