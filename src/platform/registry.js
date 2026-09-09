// Public metadata only: do not import lab content or rendering dependencies here.
export const labs = Object.freeze([
  { id: 'ev', title: 'EV Lab', path: '/labs/ev', entry: 'ev', description: 'Bataryadan tekerleğe: parçalar, enerji ve hareket.', stages: ['Başlangıç', 'İleri seviye'] },
  { id: 'calculus', title: 'Calculus Lab', path: '/labs/calculus', entry: 'calculus', description: 'Kümeler ve fonksiyonları deneyerek öğren. İlk dersler hazır.', stages: ['Pre-Calculus · İlk dersler', 'Calculus I · Planlandı', 'Calculus II · Planlandı'] },
]);
export function resolveRoute(url) {
  const path = url.pathname.replace(/\/+$/, '') || '/';
  if (path === '/') {
    const id = url.searchParams.get('lab');
    if (!id && url.searchParams.get('renderer') === 'off') return { kind: 'lab', entry: 'ev' };
    if (!id) return { kind: 'catalog' };
    if (!labs.some(lab => lab.id === id)) return { kind: 'not-found' };
    return lessonRoute(id, url.searchParams.get('lesson'));
  }
  const lab = labs.find(l => l.path === path);
  if (lab) return lessonRoute(lab.id, url.searchParams.get('lesson'));
  if (path === '/labs/calculus/machine') return { kind: 'lab', entry: 'calculus-machine' };
  return { kind: 'not-found' };
}
function lessonRoute(id, lesson) {
  if (id === 'calculus' && lesson === 'machine') return { kind: 'lab', entry: 'calculus-machine' };
  if (lesson) return { kind: 'not-found' };
  return { kind: 'lab', entry: id };
}
