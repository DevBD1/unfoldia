import test from 'node:test';
import assert from 'node:assert/strict';
import { localizedHref, preserveCatalogLanguage } from './navigation.js';
import { catalogLanguage } from './identity.js';
import { resolveRoute } from './registry.js';

test('catalog language survives wordmark, labs, aliases, and return against browser preference', () => {
  for (const [language, browser] of [['en', 'tr-TR'], ['tr', 'en-US']]) {
    for (const href of ['/', '/labs/ev?renderer=off', '/labs/calculus', '/labs/calculus/machine', '?lab=ev', '?lab=calculus&lesson=machine']) {
      const original = new URL(href.startsWith('?') ? `/${href}` : href, 'https://example.test');
      const linked = new URL(localizedHref(href, language), original);
      assert.deepEqual(resolveRoute(linked), resolveRoute(original));
      assert.equal(catalogLanguage(linked, browser), language);
      for (const [key, value] of original.searchParams) assert.equal(linked.searchParams.get(key), value);
      assert.equal(catalogLanguage(new URL(localizedHref('/', linked.searchParams.get('lang')), linked), browser), language);
    }
  }
});

test('navigation preserves fragments and external links without introducing storage or invalid languages', () => {
  for (const href of ['#question', 'https://openstax.org', '//example.org', 'mailto:example@example.org']) {
    assert.equal(localizedHref(href, 'tr'), href);
  }
  assert.equal(localizedHref('/labs/ev?renderer=off#inputs', 'tr'), '/labs/ev?renderer=off&lang=tr#inputs');
  assert.equal(localizedHref('/?lang=tr', 'en'), '/?lang=en');
  assert.equal(localizedHref('/', 'xx'), '/');
  assert.equal(localizedHref('?lab=ev', null), '/?lab=ev');
});

test('navigation updates actual anchor attributes including legacy lab links', () => {
  const anchors = ['/', '?lab=calculus', '#inputs', 'https://example.org'].map(href => ({
    href, getAttribute() { return this.href; }, setAttribute(name, value) { assert.equal(name, 'href'); this.href = value; },
  }));
  preserveCatalogLanguage({ querySelectorAll(selector) { assert.equal(selector, 'a[href]'); return anchors; } }, 'en');
  assert.deepEqual(anchors.map(a => a.href), ['/?lang=en', '/?lab=calculus&lang=en', '#inputs', 'https://example.org']);
});
