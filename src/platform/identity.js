export const brand = 'Unfoldia';
export const tagline = 'Explore the parts, understand the whole.';

// Catalog language only. Existing Turkish lessons and progress are untouched.
export function catalogLanguage(url, browserLanguage = 'en') {
  const requested = url.searchParams.get('lang');
  if (requested === 'en' || requested === 'tr') return requested;
  return browserLanguage.toLowerCase().startsWith('tr') ? 'tr' : 'en';
}

export const catalogCopy = {
  en: {
    title: tagline, missing: 'Lesson not found', eyebrow: 'MANY SUBJECTS. SHARED UNDERSTANDING.',
    intro: 'Interactive learning, built in the open. Explore at your own pace, discover connections, and help a global learning community grow.',
    fallback: 'Continue exploring with one of the labs below.',
    availability: 'Catalog: English and Turkish. Current lessons: Turkish. More languages and subjects are part of our community-driven vision.',
    explore: 'Explore in Turkish →', language: 'Catalog language',
    communityHeading: 'Build understanding together',
    contribute: 'Help build Unfoldia →', community: 'Contribute explanations, translations, source reviews, accessible design, or code.',
    footer: 'No account required. Progress stays in this browser; it does not automatically transfer between browsers or domains.',
    labs: {
      ev: { description: 'From battery to wheel: explore parts, energy, and motion.', stages: ['Beginner', 'Advanced'] },
      calculus: { description: 'Investigate sets and functions through interactive diagrams. Introductory lessons available.', stages: ['Pre-Calculus · First lessons', 'Calculus I · Planned', 'Calculus II · Planned'] },
    },
  },
  tr: {
    title: 'Parçaları keşfet, bütünü anla.', missing: 'Bu ders bulunamadı.', eyebrow: 'FARKLI KONULAR. ORTAK ANLAYIŞ.',
    intro: 'Açık kaynaklı etkileşimli öğrenme. Kendi hızında keşfet, bağlantıları gör ve küresel bir öğrenme topluluğunun büyümesine katkı sağla.',
    fallback: 'Aşağıdaki konulardan devam edebilirsin.',
    availability: 'Katalog: Türkçe ve İngilizce. Mevcut dersler: Türkçe. Daha fazla dil ve konu, toplulukla büyüme vizyonumuzun parçası.',
    explore: 'Türkçe keşfet →', language: 'Katalog dili',
    communityHeading: 'Birlikte öğren, birlikte geliştir',
    contribute: 'Unfoldia’ya katkı sağla →', community: 'Açıklamalar, çeviriler, kaynak incelemeleri, erişilebilir tasarım veya kod ile katkıda bulun.',
    footer: 'Hesap gerekmez. İlerlemen bu tarayıcıda kalır; tarayıcı veya alan adı değişince otomatik taşınmaz.',
  },
};
