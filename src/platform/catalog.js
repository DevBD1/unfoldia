import './catalog.css';
import { brand, catalogLanguage, catalogCopy } from './identity.js';
import { preserveCatalogLanguage } from './navigation.js';
export function renderCatalog(host, labs, notFound = false) {
  const url = new URL(location.href);
  const language = catalogLanguage(url, navigator.language);
  const copy = catalogCopy[language];
  document.documentElement.lang = language;
  document.title = `${brand} — ${notFound ? copy.missing : copy.title}`;
  host.innerHTML = `<main class="catalog"><header><a href="/">Unfoldia</a><label>${copy.language} <select aria-label="${copy.language}"><option value="en">English</option><option value="tr">Türkçe</option></select></label></header><p class="eyebrow">${copy.eyebrow}</p><h1>${notFound ? copy.missing : copy.title}</h1><p class="intro">${notFound ? copy.fallback : copy.intro}</p><p class="intro">${copy.availability}</p><div class="lab-grid"></div><footer>${copy.footer}</footer></main>`;
  const selector = host.querySelector('select');
  selector.value = language;
  selector.addEventListener('change', () => {
    url.searchParams.set('lang', selector.value);
    location.assign(url.href);
  });
  const grid = host.querySelector('.lab-grid');
  for (const lab of labs) {
    const card = document.createElement('article');
    const heading = document.createElement('h2'); heading.textContent = lab.title;
    const translated = copy.labs?.[lab.id] ?? lab;
    const description = document.createElement('p'); description.textContent = translated.description;
    const stages = document.createElement('ul');
    translated.stages.forEach(stage => { const item = document.createElement('li'); item.textContent = stage; stages.append(item); });
    const link = document.createElement('a'); link.href = lab.path; link.textContent = copy.explore;
    card.append(heading, description, stages, link); grid.append(card);
  }
  preserveCatalogLanguage(host, language);
}
