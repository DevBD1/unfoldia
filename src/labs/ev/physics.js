/**
 * Small, deterministic teaching models used by the EV Atlas experiments.
 *
 * These are deliberately illustrative calculations, not Tesla/OEM models.
 * Inputs are SI-ish values (kW, kWh, Ah, rpm, Nm and volts) and every
 * function returns a fresh plain object so it can be used from the UI or in
 * unit tests without sharing mutable state.
 */

const TWO_PI = 2 * Math.PI;
const SQRT_THREE_OVER_TWO = Math.sqrt(3 / 2);

function finite(value, name) {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be finite`);
  }
  return value;
}

function positive(value, name) {
  finite(value, name);
  if (value <= 0) throw new RangeError(`${name} must be greater than zero`);
  return value;
}

function nonNegative(value, name) {
  finite(value, name);
  if (value < 0) throw new RangeError(`${name} must be non-negative`);
  return value;
}

function integerAtLeast(value, name, minimum = 1) {
  finite(value, name);
  if (!Number.isInteger(value) || value < minimum) {
    throw new RangeError(`${name} must be an integer >= ${minimum}`);
  }
  return value;
}

function between(value, name, minimum, maximum) {
  finite(value, name);
  if (value < minimum || value > maximum) {
    throw new RangeError(`${name} must be between ${minimum} and ${maximum}`);
  }
  return value;
}

/**
 * Illustrative series/parallel battery pack calculation.
 * A zero load has no current and an unknown/infinite runtime, represented by
 * null so that the result is safe to JSON.stringify.
 */
export function batteryExperiment({
  series = 96,
  parallel = 46,
  cellVoltage = 3.6,
  cellAh = 4.8,
  loadKW = 30,
  usableFraction = 0.9,
} = {}) {
  integerAtLeast(series, "series");
  integerAtLeast(parallel, "parallel");
  positive(cellVoltage, "cellVoltage");
  positive(cellAh, "cellAh");
  nonNegative(loadKW, "loadKW");
  between(usableFraction, "usableFraction", 0, 1);

  const voltage = series * cellVoltage;
  const capacityAh = parallel * cellAh;
  const nominalKWh = (voltage * capacityAh) / 1000;
  const usableKWh = nominalKWh * usableFraction;
  const currentA = loadKW === 0 ? 0 : (loadKW * 1000) / voltage;
  const durationHours = loadKW === 0 ? null : usableKWh / loadKW;

  return {
    voltage,
    capacityAh,
    nominalKWh,
    usableKWh,
    currentA,
    durationHours,
  };
}

/** Calculate ideal mechanical angular speed and shaft power. */
export function motorExperiment({ torqueNm = 100, rpm = 2000 } = {}) {
  nonNegative(torqueNm, "torqueNm");
  nonNegative(rpm, "rpm");
  const angularSpeed = (rpm * TWO_PI) / 60;
  return {
    angularSpeed,
    powerKW: (torqueNm * angularSpeed) / 1000,
  };
}

/**
 * Calculate one instant of an ideal sinusoidal PWM inverter.
 * phasePeakVoltage = modulation * Vdc / 2 is the teaching-model relation.
 * `lineRmsVoltage` is the RMS of a line-to-line voltage, not a phase-to-
 * neutral RMS value.
 */
export function inverterExperiment({
  dcVoltage = 350,
  modulation = 0.8,
  electricalHz = 50,
  time = 0,
} = {}) {
  positive(dcVoltage, "dcVoltage");
  between(modulation, "modulation", 0, 1);
  nonNegative(electricalHz, "electricalHz");
  finite(time, "time");

  const phasePeakVoltage = (modulation * dcVoltage) / 2;
  const angle = TWO_PI * electricalHz * time;
  const phaseVoltages = [
    Math.sin(angle),
    Math.sin(angle - (2 * Math.PI) / 3),
    Math.sin(angle + (2 * Math.PI) / 3),
  ].map((sine) => phasePeakVoltage * sine);

  return {
    phaseVoltages,
    phasePeakVoltage,
    lineRmsVoltage: phasePeakVoltage * SQRT_THREE_OVER_TWO,
  };
}

/**
 * Ideal single-speed reduction and open-differential teaching model.
 * Positive `turn` makes the right wheel faster and the left wheel slower;
 * their arithmetic mean remains the reduction output speed.
 */
export function gearsExperiment({
  inputRpm = 4000,
  inputTorqueNm = 100,
  ratio = 9,
  efficiency = 1,
  turn = 0,
} = {}) {
  nonNegative(inputRpm, "inputRpm");
  nonNegative(inputTorqueNm, "inputTorqueNm");
  positive(ratio, "ratio");
  between(efficiency, "efficiency", 0, 1);
  between(turn, "turn", -0.8, 0.8);

  const outputRpm = inputRpm / ratio;
  const outputTorqueNm = inputTorqueNm * ratio * efficiency;
  const inputPowerKW = (inputTorqueNm * inputRpm * TWO_PI) / 60 / 1000;
  const outputPowerKW = inputPowerKW * efficiency;

  return {
    outputRpm,
    outputTorqueNm,
    inputPowerKW,
    outputPowerKW,
    leftRpm: outputRpm * (1 - turn),
    rightRpm: outputRpm * (1 + turn),
  };
}

