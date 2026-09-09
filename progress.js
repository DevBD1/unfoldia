/**
 * Versioned, local-only learning progress state.
 *
 * The first prototype stored `{ mode, completed, started }`. That data is
 * retained as `legacyCompleted` for transparency, but is intentionally not
 * promoted to v2 task/quiz completion: the new guided route must be earned
 * using its own events.
 */

export const PROGRESS_VERSION = 2;
export const MODES = ["basic", "advanced"];
export const DEFAULT_LESSON_IDS = [
  "energy",
  "battery",
  "inverter",
  "motor",
  "gears",
  "charging",
  "bms",
  "thermal",
];

function modeOrDefault(mode) {
  return mode === "advanced" ? "advanced" : "basic";
}

function emptyLessons() {
  return Object.fromEntries(
    DEFAULT_LESSON_IDS.map((id) => [id, { task: false, quiz: false }]),
  );
}

function cloneLessonMap(input) {
  const output = emptyLessons();
  if (!input || typeof input !== "object" || Array.isArray(input)) return output;
  for (const [id, value] of Object.entries(input)) {
    if (typeof id !== "string" || !id || !value || typeof value !== "object") continue;
    output[id] = { task: value.task === true, quiz: value.quiz === true };
  }
  return output;
}

function newState() {
  return {
    version: PROGRESS_VERSION,
    mode: "basic",
    started: false,
    selectedId: "battery",
    routeMode: "guided",
    lessonId: null,
    guideStep: { basic: 0, advanced: 0 },
    lessons: { basic: emptyLessons(), advanced: emptyLessons() },
    legacyCompleted: [],
  };
}

function parseRaw(raw) {
  if (raw == null || raw === "") return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : null;
}

/**
 * Parse old localStorage JSON or a v2 state into a complete v2 state.
 * Malformed values are treated as an untouched new learner.
 */
export function createProgress(raw = null) {
  const input = parseRaw(raw);
  const state = newState();
  if (!input) return state;

  state.mode = modeOrDefault(input.mode);
  state.started = input.started === true;
  state.selectedId = typeof input.selectedId === "string" && input.selectedId
    ? input.selectedId
    : state.selectedId;
  state.routeMode = input.routeMode === "free" ? "free" : "guided";
  state.lessonId = typeof input.lessonId === "string" ? input.lessonId : null;
  state.legacyCompleted = Array.isArray(input.legacyCompleted)
    ? input.legacyCompleted.filter((id) => typeof id === "string")
    : Array.isArray(input.completed)
      ? input.completed.filter((id) => typeof id === "string")
      : [];

  if (input.guideStep && typeof input.guideStep === "object") {
    for (const mode of MODES) {
      const value = input.guideStep[mode];
      if (Number.isInteger(value)) state.guideStep[mode] = Math.min(4, Math.max(0, value));
    }
  }
  if (input.lessons && typeof input.lessons === "object") {
    for (const mode of MODES) state.lessons[mode] = cloneLessonMap(input.lessons[mode]);
  }

  return state;
}

function copyState(state) {
  const base = createProgress(state);
  base.guideStep = { ...base.guideStep };
  base.lessons = {
    basic: Object.fromEntries(Object.entries(base.lessons.basic).map(([id, value]) => [id, { ...value }])),
    advanced: Object.fromEntries(Object.entries(base.lessons.advanced).map(([id, value]) => [id, { ...value }])),
  };
  base.legacyCompleted = [...base.legacyCompleted];
  return base;
}

function assertMode(mode) {
  if (!MODES.includes(mode)) throw new RangeError(`Unknown progress mode: ${mode}`);
}

function assertLessonId(lessonId) {
  if (typeof lessonId !== "string" || !lessonId) throw new RangeError("lessonId must be a non-empty string");
}

function ensureLesson(state, mode, lessonId) {
  if (!state.lessons[mode][lessonId]) state.lessons[mode][lessonId] = { task: false, quiz: false };
}

/** Return a new state with the lesson's model task marked complete. */
export function markTask(state, mode, lessonId) {
  assertMode(mode);
  assertLessonId(lessonId);
  const next = copyState(state);
  ensureLesson(next, mode, lessonId);
  next.lessons[mode][lessonId].task = true;
  return next;
}

/** Return a new state with the lesson's knowledge check marked complete. */
export function markQuiz(state, mode, lessonId) {
  assertMode(mode);
  assertLessonId(lessonId);
  const next = copyState(state);
  ensureLesson(next, mode, lessonId);
  next.lessons[mode][lessonId].quiz = true;
  return next;
}

/** A lesson is complete only after both its task and quiz are complete. */
export function isComplete(state, mode, lessonId) {
  assertMode(mode);
  assertLessonId(lessonId);
  const lesson = state?.lessons?.[mode]?.[lessonId];
  return lesson?.task === true && lesson?.quiz === true;
}

const GUIDE_EVENTS = [
  { type: "select", id: "battery" },
  { type: "flow", id: "inverter" },
  { type: "run", id: "motor" },
  { type: "select", id: "gears-wheels" },
];

/**
 * Advance the four-step guided introduction only when the next expected
 * event occurs. Events after completion or out of order are harmless.
 */
export function recordGuide(state, event) {
  const next = copyState(state);
  const mode = next.mode;
  const step = next.guideStep[mode];
  if (!event || typeof event !== "object" || step >= GUIDE_EVENTS.length) return next;
  const expected = GUIDE_EVENTS[step];
  if (event.type !== expected.type || event.id !== expected.id) return next;
  next.guideStep[mode] = step + 1;
  next.selectedId = event.id;
  next.started = true;
  return next;
}
