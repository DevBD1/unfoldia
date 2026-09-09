import './style.css';
import './sets.css';
import { domain, codomain, scenarios, inspectRelation, restoreSets } from './relation.js';
import { createRelationView } from './relation-view.js';
import { steps } from './sets-content.js';

const key = 'partwise:calculus:sets-v1';
let raw; try { raw = localStorage.getItem(key); } catch {}
const progress = restoreSets(raw);
let selected = -2, scenario = 'square';
const visited = steps.map(() => new Set());
const $ = s => document.querySelector(s);
document.title = 'Unfoldia — Fonksiyonlar ve kümeler';
$('#app').innerHTML = `<header><a class="brand" href="?lab=calculus">Unfoldia<span> / calculus lab</span></a><a href="?lab=ev">EV Lab ↗</a></header><main>
<nav class="stages" aria-label="Öğrenme kademeleri"><span aria-current="step">Pre-Calculus</span><span>Calculus I · Yakında</span><span>Calculus II · Yakında</span></nav>
<div class="heading"><div><p class="eyebrow">FONKSİYONLAR / TEMEL KAVRAMLAR</p><h1>Her okun<br><em>bir anlamı var.</em></h1></div><p class="lede">Tanım, değer ve görüntü kümelerini keşfet. Sonra bir ilişkinin neden fonksiyon olduğunu kendin açıklayabilirsin.</p></div>
<nav id="steps" class="step-nav" aria-label="Ders adımları"></nav>
<div class="sets-layout"><section class="lesson" aria-label="Adım anlatımı"><p id="step-count" class="eyebrow"></p><h2 id="step-title" tabindex="-1"></h2><div id="teaching"></div><div class="completion"><b>Model üzerinde dene</b><p id="task"></p><span id="task-done" role="status"></span></div><fieldset><legend id="question"></legend><div id="answers"></div></fieldset><p id="feedback" role="status"></p><button id="next">Sonraki adım →</button><p id="record" class="note" role="status"></p></section>
<section class="experiment" aria-label="Eşleştirme laboratuvarı"><h2>Aynı ilişki, üç görünüm</h2><label for="scenario">İlişkiyi incele</label><select id="scenario"><option value="square">Her girdinin karesi</option><option value="missing">0 girdisinin oku eksik</option><option value="multiple">2 girdisinden iki ok</option></select><p>Girdiyi seç: turuncu ok, nokta ve tablo satırı aynı girdiyi gösterir.</p><div id="inputs" class="input-buttons" aria-label="Tanım kümesindeki girdiler"></div><div id="relation"></div><p id="relation-status" role="status"></p><div class="set-summary"><p>A · Tanım: {−2, −1, 0, 1, 2}</p><p>B · Değer (hedef): {0, 1, 2, 3, 4}</p><p id="image-set"></p></div><table><caption>Okların tablo karşılığı · seçili satır ★ ile işaretlenir</caption><thead><tr><th>Girdi</th><th>Bağlanan çıktı(lar)</th></tr></thead><tbody id="relation-table"></tbody></table><p class="note">Noktalar birleştirilmez: bu örnekte tanım kümesi yalnızca beş elemanlıdır. Yeşil dolgulu hedeflere en az bir ok ulaşır.</p></section></div>
<section class="sources"><h2>Bu dersin yeri</h2><p>Önceki <a href="?lab=calculus&lesson=machine">sayı makinesini</a> serbestçe kullanabilirsin. Onun kaydı korunur; bu dört adım ayrı kaydedilir. Bu dilim tüm fonksiyon müfredatı değildir; dönüşümler ve daha kapsamlı grafik okuma sonraki konulardır.</p><p>Kitap eşleşmesi: Thomas–Finney 9. baskı, Ön Bilgiler §3. Özgün anlatım ve sorular. <a href="https://openstax.org/books/precalculus-2e/pages/1-2-domain-and-range">OpenStax: Domain and Range</a>. Grafik ve diyagram: D3 (ISC).</p></section></main>`;
const view = createRelationView($('#relation'), value => { selected = value; update(true); });
$('#inputs').innerHTML = domain.map(x=>`<button data-input="${x}" aria-pressed="${x===selected}">${x}</button>`).join('');
document.querySelectorAll('[data-input]').forEach(b=>b.addEventListener('click',()=>view.select(Number(b.dataset.input))));
const toModel = document.createElement('a'); toModel.href='#inputs'; toModel.textContent='Deney kontrollerine git ↓'; $('#task').after(toModel);
const toQuestion = document.createElement('a'); toQuestion.href='#question'; toQuestion.textContent='Ders sorusuna dön ↑'; $('#relation-table').closest('table').after(toQuestion);
function taskDone() {
  const v = visited[progress.step];
  return progress.passed[progress.step] || [v.has('square:-2'), v.has('square:0') && v.has('square:2'), ['square','missing','multiple'].every(s => [...v].some(x => x.startsWith(s+':'))), v.has('square:1')][progress.step];
}
function save() {
  try { localStorage.setItem(key, JSON.stringify(progress)); $('#record').textContent = `${progress.passed.filter(Boolean).length}/4 adım tamamlandı · Bu tarayıcıda saklandı.`; }
  catch { $('#record').textContent = 'Kayıt kullanılamıyor; ilerleme yalnızca bu oturumda korunur.'; }
}
function update(action = false) {
  if (action) visited[progress.step].add(`${scenario}:${selected}`);
  const pairs = scenarios[scenario].pairs, result = inspectRelation(domain,codomain,pairs);
  view.update({ domain,codomain,pairs,selected });
  document.querySelectorAll('[data-input]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.input)===selected)));
  $('#relation-table').innerHTML = domain.map(x=>`<tr class="${x===selected?'selected-row':''}"><td>${x===selected?'★ ':''}${x}</td><td>${pairs.filter(p=>p.x===x).map(p=>p.y).join(', ') || 'Ok yok'}</td></tr>`).join('');
  $('#image-set').textContent = `${result.isFunction?'f(A) · Görüntü':'İlişkinin ulaştığı hedefler'}: {${result.image.join(', ')}}`;
  $('#relation-status').textContent = progress.step < 2 ? 'Oklar girdiler ile hedefler arasındaki eşleşmeleri gösterir.' : result.isFunction ? '✓ Fonksiyon: A’daki her girdinin tam bir çıktısı var.' : result.missing.length ? 'Fonksiyon değil: 0 girdisi boşta. A’daki her girdinin bir çıktısı olmalı.' : 'Fonksiyon değil: 2 girdisinden hem 3’e hem 4’e ok çıkıyor.';
  $('#task-done').textContent = taskDone() ? '✓ Deney görevi tamam.' : 'Yukarıdaki seçme görevini yap; ardından soruyu yanıtla.';
}
function renderStep(focus=false) {
  const step = steps[progress.step];
  $('#steps').innerHTML = steps.map((s,i)=>`<button data-step="${i}" ${i===progress.step?'aria-current="step"':''}>${progress.passed[i]?'✓':i+1} · ${s.title}</button>`).join('');
  document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{progress.step=Number(b.dataset.step);renderStep(true);}));
  $('#step-count').textContent = `ADIM ${progress.step+1} / 4`;
  $('#step-title').textContent = step.title; $('#teaching').innerHTML = step.body;
  $('#task').textContent = step.task; $('#question').textContent = step.question;
  $('#answers').innerHTML = step.options.map((o,i)=>`<button data-choice="${i}">${o}</button>`).join('');
  $('#feedback').textContent = progress.passed[progress.step] ? '✓ Bu adımı tamamladın. İstersen yeniden deneyebilirsin.' : '';
  $('#next').textContent = progress.step===3?'İlerlemeyi gözden geçir':'Sonraki adım →';
  $('#next').disabled = !progress.passed[progress.step];
  // Return to the explained baseline rather than carrying an invalid relation into an earlier lesson.
  scenario='square'; $('#scenario').value=scenario;
  document.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{
    if (!taskDone()) { $('#feedback').textContent='Önce model üzerinde dene kutusundaki görevi tamamla. Grafik ve oklar cevabını gerekçelendirmeni sağlayacak.'; return; }
    const correct=Number(b.dataset.choice)===step.answer;
    $('#feedback').textContent=correct?step.correct:step.hint;
    if(correct) {progress.passed[progress.step]=true;$('#next').disabled=false;save();}
  }));
  update(); save(); if(focus) $('#step-title').focus();
}
$('#scenario').addEventListener('change',()=>{scenario=$('#scenario').value;update(true);});
$('#next').addEventListener('click',()=>{
  if(progress.step<3){progress.step++;renderStep(true);}
  else {const pending=progress.passed.indexOf(false);if(pending>=0){progress.step=pending;renderStep(true);}else $('#feedback').textContent='✓ Dört adım tamamlandı. Tanım, değer ve görüntü kümelerini; tek çıktı koşulunu ve sonlu grafikleri çalıştın. İstediğin adıma dönebilirsin.';}
});
renderStep();
