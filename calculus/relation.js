export const domain = [-2, -1, 0, 1, 2];
export const codomain = [0, 1, 2, 3, 4];
export const squarePairs = () => domain.map(x => ({ x, y: x * x }));
export function inspectRelation(inputs, targets, pairs) {
  if (![...inputs, ...targets].every(Number.isFinite) || new Set(inputs).size !== inputs.length || new Set(targets).size !== targets.length) throw new TypeError('Kümeler farklı, sonlu sayılardan oluşmalı');
  if (!pairs.every(p => inputs.includes(p.x) && targets.includes(p.y))) throw new RangeError('Eşleşme kümelerin dışında');
  const unique = pairs.filter((p, i) => pairs.findIndex(q => q.x === p.x && q.y === p.y) === i);
  const missing = inputs.filter(x => !unique.some(p => p.x === x));
  const multiple = inputs.filter(x => unique.filter(p => p.x === x).length > 1);
  return { image: targets.filter(y => unique.some(p => p.y === y)), missing, multiple, isFunction: missing.length === 0 && multiple.length === 0 };
}
export const scenarios = {
  square: { label: 'Her girdinin karesi', pairs: squarePairs() },
  missing: { label: '0 girdisinin oku eksik', pairs: squarePairs().filter(p => p.x !== 0) },
  multiple: { label: '2 girdisinden iki ok', pairs: [...squarePairs(), { x: 2, y: 3 }] },
};
export function restoreSets(raw) {
  try {
    const p = JSON.parse(raw);
    if (p?.version === 1) return { version: 1, step: Number.isInteger(p.step) && p.step >= 0 && p.step < 4 ? p.step : 0, passed: Array.from({ length: 4 }, (_, i) => p.passed?.[i] === true) };
  } catch {}
  return { version: 1, step: 0, passed: [false, false, false, false] };
}
