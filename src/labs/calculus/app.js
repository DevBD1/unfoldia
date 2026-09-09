import './style.css';
import { createGraph } from './graph.js';
import { rules, evaluate, samples, restore, complete, lessonId } from './model.js';

document.title = 'Unfoldia — Calculus Lab';
const key = `partwise:calculus:${lessonId}`;
let raw;
try { raw = localStorage.getItem(key); } catch {}
const progress = restore(raw);
document.querySelector('#app').innerHTML = `
<header><a class="brand" href="?lab=calculus">Unfoldia<span> / calculus lab</span></a><a href="?lab=ev">EV Lab ↗</a></header>
<main>
  <nav class="stages" aria-label="Öğrenme kademeleri"><span aria-current="step">01 · Pre-Calculus</span><span>02 · Calculus I <small>Yakında</small></span><span>03 · Calculus II <small>Yakında</small></span></nav>
  <div class="heading"><div><p class="eyebrow">PRE-CALCULUS / 01 · FONKSİYONLAR</p><h1>Bir girdi. Bir kural.<br><em>Bir çıktı.</em></h1></div><p class="lede">Fonksiyon, izin verilen her girdiye tam bir çıktı eşleyen kuraldır. Bu deneyde sayıları kullanıyoruz. Ön bilgi gerekmez.</p></div>
  <div class="lesson-layout"><section class="experiment" aria-labelledby="experiment-title">
    <div class="section-head"><h2 id="experiment-title">Fonksiyon tezgâhı</h2><span>CANLI · 2D</span></div>
    <label for="rule">Kuralı seç</label><select id="rule"><option value="double">İki katını al · f(x) = 2x</option><option value="square">Karesini al · f(x) = x²</option></select>
    <div class="machine"><div><small>GİRDİ · x</small><strong id="input-value"></strong></div><span aria-hidden="true">→</span><div><small>KURAL</small><strong id="formula"></strong></div><span aria-hidden="true">→</span><div><small>ÇIKTI · f(x)</small><strong id="output-value"></strong></div></div>
    <label for="x">Girdiyi değiştir <span>−4 ile 4 arasında · ok tuşlarını da kullanabilirsin</span></label><input id="x" type="range" min="-4" max="4" step="0.5" value="1">
    <div id="graph"></div><p class="caption">Yatay eksen girdi, dikey eksen çıktı. Turuncu nokta seçtiğin (x, f(x)) çiftidir. Eğri diğer girdilerin çıktılarını gösterir.</p>
    <details><summary>Grafiğin sayı tablosu</summary><table><caption>Seçili kural için örnekler</caption><thead><tr><th>Girdi x</th><th>Çıktı f(x)</th></tr></thead><tbody id="values"></tbody></table></details>
    <p class="note">Her iki kuralın tanım kümesi (izin verilen girdiler) tüm gerçek sayılardır. Burada yalnızca −4 ≤ x ≤ 4 penceresini gösteriyoruz; değerler birimsizdir.</p>
  </section><aside class="lesson" aria-label="Rehberli ders">
    <p class="eyebrow">İLK KEŞFİN · YAKLAŞIK 5 DAKİKA</p><h2>Fonksiyon ne yapar?</h2><p>Hedef: girdi, kural ve çıktıyı ayırt etmek; bir çıktıyı hesaplayıp grafikte bulmak.</p>
    <ol><li><b>Oku.</b> f, kuralın adı; x girdidir. f(x), “f'nin x girdisindeki çıktısı” demektir. f ile x'in çarpımı değildir.</li><li><b>Dene.</b> “Karesini al” kuralını seç ve girdiyi −2 yap. (−2) × (−2) = 4: negatif girdi, pozitif çıktı verebilir. <span id="task-status"></span></li><li><b>Tahmin et.</b> Aynı kuralda x = 3 olursa çıktı kaçtır?</li></ol>
    <form id="prediction"><label for="answer">Tahminin</label><div class="answer-row"><input id="answer" type="number" required step="any" placeholder="Sayı yaz"><button type="submit">Kontrol et</button></div></form><p id="prediction-feedback" role="status"></p>
    <p>Bu sorudan önce: farklı girdiler aynı çıktıyı verebilir. Örneğin −2 ve 2’nin karesi 4’tür; her girdinin yine tek çıktısı vardır. Bir girdinin boşta kalması veya iki farklı çıktıya bağlanması ise fonksiyon koşulunu bozar. <a href="?lab=calculus">Kümeler ve oklarla ayrıntılı dersi aç →</a></p>
    <fieldset><legend>−2 ve 2 aynı çıktıyı veriyor. Bu hâlâ bir fonksiyon mu?</legend><button type="button" data-answer="yes">Evet</button><button type="button" data-answer="no">Hayır</button></fieldset><p id="concept-feedback" role="status"></p>
    <div class="completion" id="completion" role="status"></div><p id="save-status" class="note"></p>
    <details><summary>Kaynak ve kitap eşleşmesi</summary><p>Thomas–Finney, 9. baskı · Ön Bilgiler §3: Functions. Anlatım ve deney özgün olarak hazırlanmıştır; kitaptan alıntı değildir.</p><a href="https://openstax.org/books/precalculus-2e/pages/1-1-functions-and-function-notation" target="_blank" rel="noreferrer">Açık ders kaynağı: OpenStax — Functions and Function Notation ↗</a><p>Grafik: açık kaynak D3 (ISC). Sonraki dilim: fonksiyonların grafiklerini okumak.</p></details>
  </aside></div>
</main><footer>GÖR. DENE. ANLA. <span>İlk ders dilimi · diğer dersler henüz hazır değil</span></footer>`;
const $ = s => document.querySelector(s);
const graph = createGraph($('#graph'), { xDomain: [-4, 4], yDomain: [-9, 17], label: 'Girdi ve çıktı grafiği' });
function save() {
  try { localStorage.setItem(key, JSON.stringify(progress)); $('#save-status').textContent = 'İlerleme bu tarayıcıda saklanır. EV kaydın ayrı tutulur.'; }
  catch { $('#save-status').textContent = 'Tarayıcı kayda izin vermiyor. Bu oturumda öğrenmeye devam edebilirsin; yenilemede ilerleme kaybolabilir.'; }
  $('#task-status').textContent = progress.explored ? '✓ Deney tamamlandı.' : '';
  $('#completion').textContent = complete(progress) ? '✓ İlk ders tamamlandı. Girdi → kural → çıktı ilişkisini keşfettin. Serbestçe denemeye devam edebilirsin.' : `${[progress.explored, progress.prediction, progress.concept].filter(Boolean).length}/3 · Deney ve iki bilgi kontrolünü tamamla.`;
}
function update(userAction = false) {
  const rule = $('#rule').value, x = Number($('#x').value), y = evaluate(rule, x);
  $('#input-value').textContent = x;
  $('#output-value').textContent = y;
  $('#formula').textContent = rules[rule].formula;
  graph.update({ points: samples(rule), selected: { x, y } });
  $('#values').innerHTML = [-4, -2, 0, 2, 4].map(n => `<tr><td>${n}</td><td>${evaluate(rule, n)}</td></tr>`).join('');
  if (userAction && rule === 'square' && x === -2) progress.explored = true;
  save();
}
$('#x').addEventListener('input', () => update(true));
$('#rule').addEventListener('change', () => update(true));
$('#prediction').addEventListener('submit', event => {
  event.preventDefault();
  const correct = $('#answer').value.trim() !== '' && Number($('#answer').value) === evaluate('square', 3);
  progress.prediction ||= correct;
  $('#prediction-feedback').textContent = correct ? 'Doğru: f(3) = 3 × 3 = 9. Kare kuralında 3 noktasına giderek kontrol edebilirsin.' : 'Bir daha dene: karesini almak sayıyı 2 ile değil, kendisiyle çarpmaktır. 3 × 3 kaç eder?';
  save();
});
document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
  const correct = button.dataset.answer === 'yes';
  progress.concept ||= correct;
  $('#concept-feedback').textContent = correct ? 'Evet. −2 ve 2 farklı girdiler; her birinin tek çıktısı 4.' : 'Yukarıdaki örneğe dön: −2 × −2 = 4 ve 2 × 2 = 4. Her girdi için tek bir sonuç bulduk. Ortak sonuca ulaşmaları sorun değil. Ok diyagramlı derste bunu adım adım inceleyebilirsin.';
  save();
}));
update();
