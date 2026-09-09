import { labs, resolveRoute } from './registry.js';
const loaders = {
  ev: () => import('../labs/ev/main.js'),
  calculus: () => import('../labs/calculus/sets-app.js'),
  'calculus-machine': () => import('../labs/calculus/app.js'),
};
const route = resolveRoute(new URL(location.href));
try {
  if (route.kind === 'lab') {
    await loaders[route.entry]();
    const navigation = document.createElement('a');
    navigation.href = '/'; navigation.textContent = '← Tüm konular';
    navigation.style.cssText = 'font-size:13px;white-space:nowrap;';
    document.querySelector('header')?.append(navigation);
    document.querySelectorAll('a[href^="?"]').forEach(a => a.setAttribute('href', '/' + a.getAttribute('href')));
  } else {
    const { renderCatalog } = await import('./catalog.js');
    renderCatalog(document.querySelector('#app'), labs, route.kind === 'not-found');
  }
} catch (error) {
  console.error('Unable to load learning module', error);
  const host = document.querySelector('#app'); host.replaceChildren();
  const message = document.createElement('p');
  message.textContent = 'Ders yüklenemedi. Sayfayı yenileyebilirsin. İlerlemen silinmedi.';
  const home = document.createElement('a'); home.href = '/'; home.textContent = 'Konu kataloğuna dön';
  host.append(message, home);
}
