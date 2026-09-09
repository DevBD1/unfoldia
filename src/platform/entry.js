import { labs, resolveRoute } from './registry.js';
import { preserveCatalogLanguage, localizedHref } from './navigation.js';
const loaders = {
  ev: () => import('../labs/ev/main.js'),
  calculus: () => import('../labs/calculus/sets-app.js'),
  'calculus-machine': () => import('../labs/calculus/app.js'),
};
const url = new URL(location.href);
const language = url.searchParams.get('lang');
const route = resolveRoute(url);
try {
  if (route.kind === 'lab') {
    await loaders[route.entry]();
    const navigation = document.createElement('a');
    navigation.href = '/'; navigation.textContent = '← Tüm konular';
    navigation.style.cssText = 'font-size:13px;white-space:nowrap;';
    document.querySelector('header')?.append(navigation);
    preserveCatalogLanguage(document, language);
  } else {
    const { renderCatalog } = await import('./catalog.js');
    renderCatalog(document.querySelector('#app'), labs, route.kind === 'not-found');
  }
} catch (error) {
  console.error('Unable to load learning module', error);
  const host = document.querySelector('#app'); host.replaceChildren();
  const message = document.createElement('p');
  message.textContent = 'Ders yüklenemedi. Sayfayı yenileyebilirsin. İlerlemen silinmedi.';
  const home = document.createElement('a'); home.href = localizedHref('/', language); home.textContent = 'Konu kataloğuna dön';
  host.append(message, home);
}
