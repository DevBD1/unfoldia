export const lessonId = 'pre-functions-v1';
export const rules = {
  double: { label: 'İki katını al', formula: 'f(x) = 2x', evaluate: x => 2 * x },
  square: { label: 'Karesini al', formula: 'f(x) = x²', evaluate: x => x * x },
};
export function evaluate(rule, x) {
  if (!rules[rule] || !Number.isFinite(x)) throw new TypeError('Geçerli kural ve sonlu girdi gerekli');
  return rules[rule].evaluate(x);
}
export function samples(rule, min = -4, max = 4, count = 160) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max || !Number.isInteger(count) || count < 2 || count > 10000) throw new RangeError('Geçersiz örnekleme aralığı');
  return Array.from({ length: count + 1 }, (_, i) => {
    const x = min + (max - min) * i / count;
    return { x, y: evaluate(rule, x) };
  });
}
export function restore(raw) {
  try {
    const data = JSON.parse(raw);
    if (data?.version === 1) return { version: 1, explored: data.explored === true, prediction: data.prediction === true, concept: data.concept === true };
  } catch {}
  return { version: 1, explored: false, prediction: false, concept: false };
}
export const complete = p => p.explored && p.prediction && p.concept;
