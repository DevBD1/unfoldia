// Carry catalog preference in links, never in lesson content or persisted progress.
// Existing query-only links are platform-root aliases, not relative lab routes.
export function localizedHref(href, language) {
  if (!href || (!href.startsWith('/') && !href.startsWith('?')) || href.startsWith('//')) return href;
  const rooted = href.startsWith('?') ? `/${href}` : href;
  if (language !== 'en' && language !== 'tr') return rooted;
  const target = new URL(rooted, 'https://navigation.invalid');
  target.searchParams.set('lang', language);
  return `${target.pathname}${target.search}${target.hash}`;
}

export function preserveCatalogLanguage(host, language) {
  host.querySelectorAll('a[href]').forEach(anchor => {
    const href = anchor.getAttribute('href');
    const localized = localizedHref(href, language);
    if (localized !== href) anchor.setAttribute('href', localized);
  });
}
