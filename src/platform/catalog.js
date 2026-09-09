import './catalog.css';
export function renderCatalog(host, labs, notFound = false) {
  document.title = notFound ? 'Partwise — Sayfa bulunamadı' : 'Partwise — Learn how things work';
  host.innerHTML = `<main class="catalog"><header><a href="/">partwise</a><span>KEŞFEDEREK ÖĞREN</span></header><p class="eyebrow">BİR PLATFORM. FARKLI KEŞİFLER.</p><h1>${notFound ? 'Bu ders bulunamadı.' : 'Gör. Dene.<br>Bütünü anla.'}</h1><p class="intro">${notFound ? 'Aşağıdaki konulardan devam edebilirsin.' : 'Kendi hızında öğrenebileceğin etkileşimli laboratuvarlar. Hesap gerekmez; ilerlemen bu tarayıcıda kalır.'}</p><div class="lab-grid"></div><footer>Bağımsız eğitim projesi · İlk dersler geliştirme aşamasında.<br>Tarayıcı veya alan adı değişince ilerleme otomatik taşınmaz.</footer></main>`;
  const grid = host.querySelector('.lab-grid');
  for (const lab of labs) {
    const card = document.createElement('article');
    const heading = document.createElement('h2'); heading.textContent = lab.title;
    const description = document.createElement('p'); description.textContent = lab.description;
    const stages = document.createElement('ul');
    lab.stages.forEach(stage => { const item = document.createElement('li'); item.textContent = stage; stages.append(item); });
    const link = document.createElement('a'); link.href = lab.path; link.textContent = 'Keşfet →';
    card.append(heading, description, stages, link); grid.append(card);
  }
}
