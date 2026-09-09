import "./style.css";
import {
  systems,
  nodes,
  getNode,
  childrenOf,
  searchNodes,
  sources,
  vehicle,
  lessons,
  glossary,
} from "./atlas.js";
import { createScene } from "./scene.js";
import {
  createProgress,
  markTask,
  markQuiz,
  isComplete,
  recordGuide,
} from "./progress.js";
import {
  experimentMarkup,
  bindExperiment,
  experimentValues,
} from "./experiments.js";
import { shell } from "./shell.js";

const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let raw;
try {
  raw = localStorage.getItem("ev-atlas");
} catch {}
let progress = createProgress(raw),
  scene;
if (!getNode(progress.selectedId)) progress.selectedId = "battery";
if (!lessons.some((l) => l.id === progress.lessonId))
  progress.lessonId = lessons[0].id;
const state = {
  visible: new Set(systems.map((s) => s.id)),
  isolate: null,
  layout: "assembly",
  explode: 0,
  body: true,
  flow: false,
  running: null,
  query: "",
  expanded: new Set([getNode(progress.selectedId).systemId]),
  detailOpen: false,
};
const symbols = {
  battery: "▤",
  inverter: "⌁",
  motor: "◉",
  gears: "⚙",
  charger: "↯",
  dcdc: "⇄",
  thermal: "❄",
  bms: "▦",
};
const guideSteps = [
  {
    title: "Enerji nereden geliyor?",
    text: "Bataryayı seç. Aracın enerji deposunu birlikte bulalım.",
    action: "Bataryayı bul",
    type: "select",
    id: "battery",
  },
  {
    title: "Bağlantıyı izle",
    text: "Enerji akışını aç: turuncu DC hattı bataryayı invertere bağlar.",
    action: "Enerji akışını göster",
    type: "flow",
    id: "inverter",
  },
  {
    title: "Elektrikten harekete",
    text: "Motoru çalıştır. İçte dönen rotor, hareketi mile aktarır.",
    action: "Motoru çalıştır",
    type: "run",
    id: "motor",
  },
  {
    title: "Yolculuğun sonu: tekerlek",
    text: "Tekerleği seç. Motorun dönüşü dişliler ve akslarla buraya ulaşır.",
    action: "Tekerleği incele",
    type: "select",
    id: "gears-wheels",
  },
];
$("#app").innerHTML = shell;
function persist() {
  try {
    localStorage.setItem("ev-atlas", JSON.stringify(progress));
  } catch {
    $("#scene-status").textContent =
      "Depolama kullanılamıyor; ilerleme bu oturumda korunur.";
  }
}
const mode = () => progress.mode,
  selected = () => getNode(progress.selectedId),
  lesson = () => lessons.find((l) => l.id === progress.lessonId) || lessons[0];
const lessonState = () =>
  progress.lessons?.[mode()]?.[lesson().id] || { task: false, quiz: false };
const questionFor = (l) =>
  mode() === "advanced" ? l.advancedQuestion : l.question;
const guideIndex = () => progress.guideStep?.[mode()] || 0;
function syncScene() {
  if (!scene) return;
  scene.setVisibility([...state.visible]);
  scene.isolate(state.isolate);
  scene.select(progress.selectedId);
}
function closeSidebar() {
  $(".sidebar").classList.remove("sidebar-open");
  $("#systems-toggle").setAttribute("aria-expanded", "false");
}
function setDetailOpen(value) {
  state.detailOpen = value;
  $("#detail").classList.toggle("detail-open", value);
  $("#detail-toggle").setAttribute("aria-expanded", value);
}
function refreshProgress() {
  const count = lessons.filter((l) =>
    isComplete(progress, mode(), l.id),
  ).length;
  $("#progress-count").textContent = `${count} / ${lessons.length}`;
  $("#progress-bar").style.width = `${(count / lessons.length) * 100}%`;
  $("#legacy-note").textContent = progress.legacyCompleted?.length
    ? `${progress.legacyCompleted.length} eski bilgi kontrolü kaydı korundu. Yeni görevler ayrı izlenir.`
    : "";
}
function renderTree() {
  const matches = new Set(searchNodes(state.query).map((n) => n.id));
  $("#parts").innerHTML =
    systems
      .map((s) => {
        const kids = childrenOf(s.id),
          open = state.expanded.has(s.id) || !!state.query;
        if (
          state.query &&
          !matches.has(s.id) &&
          !kids.some((n) => matches.has(n.id))
        )
          return "";
        return `<div class="system-branch ${state.visible.has(s.id) ? "" : "system-hidden"}"><div class="system-row"><button class="expand" data-expand="${s.id}" aria-expanded="${open}" aria-label="${esc(s.name)} alt parçaları">${kids.length ? (open ? "−" : "+") : "·"}</button><button class="system-select ${progress.selectedId === s.id ? "selected" : ""}" data-part="${s.id}" aria-pressed="${progress.selectedId === s.id}" style="--part-color:${s.color}"><span class="part-icon">${symbols[s.id]}</span><span>${esc(s.name)}<small>${esc(s.english)}</small></span></button><button class="visibility" data-visible="${s.id}" aria-pressed="${state.visible.has(s.id)}" aria-label="${esc(s.name)} görünürlüğü">${state.visible.has(s.id) ? "◉" : "○"}</button></div>${
          open && kids.length
            ? `<div class="children">${kids
                .filter(
                  (n) => !state.query || matches.has(n.id) || matches.has(s.id),
                )
                .map(
                  (n) =>
                    `<button data-part="${n.id}" class="child-row ${progress.selectedId === n.id ? "selected" : ""}" aria-pressed="${progress.selectedId === n.id}"><span style="background:${s.color}"></span>${esc(n.name)}</button>`,
                )
                .join("")}</div>`
            : ""
        }</div>`;
      })
      .join("") ||
    '<p class="empty-state">Parça bulunamadı. “Rotor”, “hücre” veya “BMS” deneyebilirsin.</p>';
  $("#parts")
    .querySelectorAll("[data-part]")
    .forEach((b) => (b.onclick = () => selectNode(b.dataset.part)));
  $("#parts")
    .querySelectorAll("[data-expand]")
    .forEach(
      (b) =>
        (b.onclick = () => {
          const id = b.dataset.expand;
          state.expanded.has(id)
            ? state.expanded.delete(id)
            : state.expanded.add(id);
          renderTree();
        }),
    );
  $("#parts")
    .querySelectorAll("[data-visible]")
    .forEach(
      (b) =>
        (b.onclick = () => {
          const id = b.dataset.visible;
          stopRun();
          state.flow = false;
          scene?.flow(false);
          if (state.visible.has(id)) {
            state.visible.delete(id);
            if (getNode(state.isolate)?.systemId === id) state.isolate = null;
            if (state.running === id) stopRun();
          } else state.visible.add(id);
          syncScene();
          renderTree();
          syncControls();
        }),
    );
  document
    .querySelectorAll("[data-mode]")
    .forEach((b) => b.setAttribute("aria-pressed", b.dataset.mode === mode()));
  $("#mobile-mode").textContent =
    (mode() === "basic" ? "Başlangıç" : "İleri seviye") + " ⇄";
  refreshProgress();
}
function dispatch(event) {
  if (progress.routeMode === "guided") progress = recordGuide(progress, event);
  const l = lesson(),
    t = l.task;
  if (
    event.type === t.type &&
    (event.id === t.targetId || getNode(event.id)?.systemId === t.targetId)
  )
    progress = markTask(progress, mode(), l.id);
  persist();
  renderGuide();
  refreshProgress();
  renderLessonStatus();
}
function selectNode(
  id,
  { record = true, focus = true, openDetail = true } = {},
) {
  const n = getNode(id);
  if (!n) return;
  if (state.running) stopRun();
  progress.selectedId = id;
  state.visible.add(n.systemId);
  state.expanded.add(n.systemId);
  if (state.isolate && state.isolate !== id && state.isolate !== n.systemId)
    state.isolate = null;
  syncScene();
  if (focus) scene?.focus(id);
  if (record) dispatch({ type: "select", id });
  persist();
  renderTree();
  renderDetail();
  syncControls();
  if (openDetail) setDetailOpen(true);
  closeSidebar();
}
function setMode(value) {
  progress.mode = value;
  persist();
  renderTree();
  renderDetail();
  renderGuide();
}
function renderGuide() {
  const step = guideSteps[guideIndex()];
  if (progress.routeMode === "free") {
    $("#guide").innerHTML =
      '<div class="guide-card free"><div><span class="eyebrow">SERBEST KEŞİF</span><p>Parçaları seç, ayır ve kendi hızında incele.</p></div><button id="resume-guide">Rotama dön →</button></div>';
    $("#resume-guide").onclick = () => {
      progress.routeMode = "guided";
      persist();
      renderGuide();
    };
    return;
  }
  $("#guide").innerHTML = step
    ? `<div class="guide-card"><div class="guide-number">${guideIndex() + 1}<small>/ 4</small></div><div class="guide-copy"><span class="eyebrow">İLK KEŞİF · ${esc(step.title)}</span><p>${esc(step.text)}</p></div><button id="guide-action">${esc(step.action)} →</button><button class="guide-exit" id="free-explore" aria-label="Serbest keşfe geç">×</button></div>`
    : `<div class="guide-card"><div class="guide-number">✓</div><div class="guide-copy"><span class="eyebrow">ENERJİ YOLCULUĞUNU KEŞFETTİN</span><p>8 bölümlük rotayla mekanizmaları daha yakından öğren.</p></div><button id="guide-lessons">Rotayı aç →</button><button class="guide-exit" id="free-explore" aria-label="Serbest keşfe geç">×</button></div>`;
  $("#free-explore").onclick = () => {
    progress.routeMode = "free";
    persist();
    renderGuide();
  };
  if (step)
    $("#guide-action").onclick = () => {
      if (step.type === "select") selectNode(step.id);
      if (step.type === "flow") {
        selectNode("inverter", { record: false });
        setFlow(true);
      }
      if (step.type === "run") {
        selectNode("motor", { record: false });
        runMechanism("motor", experimentValues.motor);
      }
    };
  else $("#guide-lessons").onclick = openPlan;
}
function renderDetail() {
  const p = selected(),
    root = getNode(p.systemId),
    c = p[mode()],
    kids = childrenOf(p.id);
  $("#detail-toggle-name").textContent = p.name;
  $("#detail-content").innerHTML =
    `<div class="breadcrumb"><button id="vehicle-overview">Araç</button><span>›</span>${p.parentId !== "vehicle" ? `<button data-parent="${root.id}">${esc(root.name)}</button><span>›</span>` : ""}<span>${esc(p.name)}</span></div><div class="detail-top"><span class="eyebrow">${mode() === "basic" ? "TEMELLERİ ANLA" : "MÜHENDİSLİK PERSPEKTİFİ"}</span><span>${p.parentId === "vehicle" ? "SİSTEM" : "ALT PARÇA"}</span></div><div class="part-title"><span class="color-dot" style="background:${p.color}"></span><h2>${esc(p.name)}</h2></div><p class="subtitle">${esc(p.english)} · ${esc(root.name)}</p><div class="inspect-actions"><button id="focus-part">⌖ Odaklan</button><button id="isolate-part" aria-pressed="${state.isolate === p.id}">◈ Tek başına</button></div><h3>${esc(c.title)}</h3><p class="description">${esc(c.description)}</p><ul class="key-points">${c.points.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>${kids.length ? `<div class="section-label">İÇİNDE NELER VAR? <span>${kids.length} ALT PARÇA</span></div><div class="subpart-grid">${kids.map((n) => `<button data-child="${n.id}">${esc(n.name)} <span>↗</span></button>`).join("")}</div>` : ""}${experimentMarkup(p.systemId, mode())}<section class="learning-card" id="lesson-card"></section><details class="glossary"><summary>Kavram sözlüğü</summary><dl>${glossary.map((g) => `<dt>${esc(g.term)}</dt><dd>${esc(g.definition)}</dd>`).join("")}</dl></details><details class="accuracy"><summary>Kaynak ve doğruluk bilgisi</summary><p><b>Geometri:</b> ${esc(p.geometryStatus)}<br><b>Bilgi:</b> ${esc(p.informationStatus)}</p><p>${esc(p.accuracyNote)}</p>${p.sources
      .map((id) => sources.find((s) => s.id === id))
      .filter(Boolean)
      .map(
        (s) =>
          `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><small>${esc(s.scope)}</small>`,
      )
      .join(
        "",
      )}</details><p class="disclaimer">Ölçeksiz eğitim modeli · Gerçek servis talimatı değildir. Yüksek gerilim sistemlerine müdahale etmeyin.</p>`;
  if (mode() === "basic") {
    const text = `${c.description} ${c.points.join(" ")}`.toLocaleLowerCase(
      "tr",
    );
    const terms = glossary
      .filter(
        (g) =>
          g.term.length > 1 && text.includes(g.term.toLocaleLowerCase("tr")),
      )
      .slice(0, 3);
    if (terms.length) {
      const hint = document.createElement("aside");
      hint.className = "term-hint";
      hint.innerHTML = terms
        .map(
          (g) => `<p><strong>${esc(g.term)}:</strong> ${esc(g.definition)}</p>`,
        )
        .join("");
      $(".description").after(hint);
    }
  }
  $("#vehicle-overview").onclick = showOverview;
  $("#detail-content")
    .querySelector("[data-parent]")
    ?.addEventListener("click", (e) =>
      selectNode(e.currentTarget.dataset.parent),
    );
  $("#detail-content")
    .querySelectorAll("[data-child]")
    .forEach((b) => (b.onclick = () => selectNode(b.dataset.child)));
  $("#focus-part").onclick = () => {
    scene?.focus(p.id);
    $("#scene-status").textContent = `${p.name} odağa alındı.`;
  };
  $("#isolate-part").onclick = () => {
    state.isolate = state.isolate === p.id ? null : p.id;
    stopRun();
    state.flow = false;
    scene?.flow(false);
    syncScene();
    scene?.focus(state.isolate || p.systemId);
    syncControls();
    $("#isolate-part").setAttribute("aria-pressed", state.isolate === p.id);
  };
  bindExperiment($("#detail-content"), p.systemId, {
    onRun: runMechanism,
    onParams: (params) => {
      if (state.running === p.systemId) scene?.updateParams(params);
    },
    onAdjust: (id) => dispatch({ type: "adjust", id }),
  });
  renderLessonStatus();
  syncRunButton();
  $("#detail-content").scrollTop = 0;
}
function renderLessonStatus() {
  const host = $("#lesson-card");
  if (!host) return;
  const l = lesson(),
    q = questionFor(l),
    s = lessonState();
  host.innerHTML = `<div class="section-label">ROTA · ${lessons.indexOf(l) + 1} / 8 <span>${isComplete(progress, mode(), l.id) ? "TAMAMLANDI" : "ÇALIŞMA ALANI"}</span></div><h3>${esc(l.title)}</h3><p class="lesson-objective">${esc(l.objective)}</p><p>${esc(l[mode()])}</p><div class="task-check ${s.task ? "done" : ""}">${s.task ? "✓" : "○"} ${esc(l.task.description)}</div><button id="lesson-target">Görev alanına git →</button><details class="quiz" ${s.task ? "open" : ""}><summary>Bilgi kontrolü ${s.quiz ? "✓" : ""}</summary><p>${esc(q.text)}</p><div class="answers">${q.options.map((o, i) => `<button data-answer="${i}">${String.fromCharCode(65 + i)} <span>${esc(o)}</span></button>`).join("")}</div><p id="feedback" role="status">${s.quiz ? "Doğru cevap kaydedildi. " + esc(q.explanation) : ""}</p></details>${isComplete(progress, mode(), l.id) ? '<button class="primary" id="next-lesson">Sıradaki bölüme geç →</button>' : "<small>İlerleme için hem görevi yap hem soruyu yanıtla.</small>"}`;
  $("#lesson-target").onclick = () => selectNode(l.targetId, { record: false });
  host.querySelectorAll("[data-answer]").forEach(
    (b) =>
      (b.onclick = () => {
        const correct = Number(b.dataset.answer) === q.answer;
        $("#feedback").textContent =
          (correct ? "Doğru. " : "Henüz değil. ") + q.explanation;
        $("#feedback").className = correct ? "correct" : "incorrect";
        b.classList.add(correct ? "answer-correct" : "answer-wrong");
        if (correct) {
          progress = markQuiz(progress, mode(), l.id);
          persist();
          refreshProgress();
          if (isComplete(progress, mode(), l.id)) {
            renderLessonStatus();
            $("#feedback").textContent = "Doğru. " + q.explanation;
          }
        }
      }),
  );
  $("#next-lesson")?.addEventListener("click", () =>
    openLesson(lessons[(lessons.indexOf(l) + 1) % lessons.length].id),
  );
}
function openLesson(id) {
  const l = lessons.find((l) => l.id === id);
  if (!l) return;
  progress.lessonId = id;
  progress.routeMode = "free";
  persist();
  $("#plan").close();
  selectNode(l.targetId, { record: false });
  renderGuide();
  $("#lesson-card")?.scrollIntoView({ block: "nearest", behavior: "auto" });
}
function openPlan() {
  $("#curriculum").innerHTML = lessons
    .map(
      (l, i) =>
        `<article class="lesson"><span>${isComplete(progress, mode(), l.id) ? "✓" : String(i + 1).padStart(2, "0")}</span><div><small>${Math.floor(i / 2) + 1}. HAFTA · 3 × 25 DK</small><h3>${esc(l.title)}</h3><p>${esc(l.objective)}</p><button data-lesson="${l.id}">${l.id === progress.lessonId ? "Kaldığım bölüm" : "Bölümü aç"} →</button></div></article>`,
    )
    .join("");
  $("#curriculum")
    .querySelectorAll("[data-lesson]")
    .forEach((b) => (b.onclick = () => openLesson(b.dataset.lesson)));
  $("#plan").showModal();
}
function showOverview() {
  state.isolate = null;
  syncScene();
  scene?.focus();
  setDetailOpen(true);
  $("#detail-toggle-name").textContent = "Araç genel görünümü";
  $("#detail-content").innerHTML =
    `<div class="eyebrow">ARAÇ GENEL GÖRÜNÜMÜ</div><h2>Model 3</h2><p>2018 Long Range RWD referanslı, tek arka motorlu öğretim mimarisi.</p><p class="description">Bir sistemi seçerek içine in. Gerçek bir aracın tüm parçaları değil, enerji yolculuğunu anlaman için seçilmiş 28 inceleme hedefi gösteriliyor.</p><div class="subpart-grid">${systems.map((s) => `<button data-root="${s.id}">${esc(s.name)} ↗</button>`).join("")}</div><p class="safety">Geometri temsili; Tesla tarafından onaylanmış değildir. Doğrulanmamış ölçüler gerçek değer olarak kullanılmaz.</p>`;
  $("#detail-content")
    .querySelectorAll("[data-root]")
    .forEach((b) => (b.onclick = () => selectNode(b.dataset.root)));
  syncControls();
}
function stopRun() {
  state.running = null;
  scene?.run(null);
  syncRunButton();
}
function syncRunButton() {
  const b = $("#run-experiment");
  if (b) {
    b.textContent =
      state.running === selected().systemId
        ? "Ⅱ Mekanizmayı durdur"
        : "▶ Mekanizmayı çalıştır";
    b.setAttribute("aria-pressed", state.running === selected().systemId);
  }
}
function runMechanism(system, params) {
  if (state.running === system) {
    stopRun();
    scene?.focus();
    syncControls();
    return;
  }
  state.explode = 0;
  state.layout = "assembly";
  state.flow = false;
  state.isolate = null;
  state.visible.add(system);
  scene?.setLayout("assembly");
  scene?.explode(0);
  scene?.flow(false);
  syncScene();
  state.running = system;
  scene?.run(system, params);
  scene?.focus(system);
  dispatch({ type: "run", id: system });
  syncControls();
  syncRunButton();
}
function setFlow(value) {
  state.flow = value;
  if (value) {
    stopRun();
    state.explode = 0;
    state.layout = "assembly";
    state.isolate = null;
    ["battery", "inverter", "motor", "gears"].forEach((id) =>
      state.visible.add(id),
    );
    scene?.setLayout("assembly");
    scene?.explode(0);
    syncScene();
    scene?.focus();
    dispatch({ type: "flow", id: "inverter" });
  }
  scene?.flow(value);
  syncControls();
  renderTree();
}
function syncControls() {
  $(".model-caption").hidden = state.layout === "inventory";
  $("#body-toggle").setAttribute("aria-pressed", state.body);
  $("#flow-toggle").setAttribute("aria-pressed", state.flow);
  $("#clear-isolation").hidden = !state.isolate;
  $("#explode").value = state.explode * 100;
  $("#explode-value").textContent = Math.round(state.explode * 100) + "%";
  document
    .querySelectorAll("[data-layout]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", b.dataset.layout === state.layout),
    );
  $("#selected-tag").textContent = selected().name;
  $("#scene-status").textContent = !scene
    ? "3D kullanılamıyor · metin ve deneyler açık"
    : state.running
      ? `${getNode(state.running).name}: çalışma görünümü · örtücü parçalar geçici gizli`
      : state.flow
        ? "Çekiş yönü: batarya → inverter → motor → aktarım"
        : state.isolate
          ? "Tek parça incelemesi"
          : !state.visible.has(selected().systemId)
            ? "Seçili sistem gizli; listeden yeniden gösterebilirsin."
            : state.layout === "inventory"
              ? "Envanter: görünür parçalar ayrı hücrelerde"
              : "Parçaya tıkla, içindeki sistemi keşfet.";
  syncRunButton();
}
function resetView() {
  stopRun();
  state.isolate = null;
  state.explode = 0;
  state.layout = "assembly";
  state.body = true;
  state.flow = false;
  state.visible = new Set(systems.map((s) => s.id));
  scene?.setLayout("assembly");
  scene?.explode(0);
  scene?.body(true);
  scene?.flow(false);
  syncScene();
  scene?.view("perspective");
  scene?.focus();
  renderTree();
  syncControls();
}
$("#part-search").addEventListener("input", (e) => {
  state.query = e.target.value;
  renderTree();
});
document
  .querySelectorAll("[data-mode]")
  .forEach((b) => (b.onclick = () => setMode(b.dataset.mode)));
$("#mobile-mode").onclick = () =>
  setMode(mode() === "basic" ? "advanced" : "basic");
$("#systems-toggle").onclick = () => {
  const open = $(".sidebar").classList.toggle("sidebar-open");
  $("#systems-toggle").setAttribute("aria-expanded", open);
  if (open) $("#part-search").focus();
};
$("#close-sidebar").onclick = closeSidebar;
$("#detail-toggle").onclick = () => setDetailOpen(!state.detailOpen);
$("#show-all").onclick = () => {
  state.visible = new Set(systems.map((s) => s.id));
  state.isolate = null;
  syncScene();
  scene?.focus();
  renderTree();
  syncControls();
};
$("#hide-all").onclick = () => {
  stopRun();
  state.flow = false;
  scene?.flow(false);
  state.visible.clear();
  state.isolate = null;
  syncScene();
  renderTree();
  syncControls();
};
$("#body-toggle").onclick = () => {
  state.body = !state.body;
  scene?.body(state.body);
  syncControls();
};
$("#flow-toggle").onclick = () => setFlow(!state.flow);
$("#clear-isolation").onclick = () => {
  state.isolate = null;
  syncScene();
  scene?.focus();
  renderDetail();
  syncControls();
};
$("#explode").oninput = (e) => {
  state.explode = Number(e.target.value) / 100;
  if (state.explode > 0) {
    stopRun();
    state.flow = false;
    scene?.flow(false);
  }
  scene?.explode(state.explode);
  syncControls();
};
document.querySelectorAll("[data-layout]").forEach(
  (b) =>
    (b.onclick = () => {
      state.layout = b.dataset.layout;
      stopRun();
      state.flow = false;
      scene?.flow(false);
      state.explode = state.layout === "inventory" ? 1 : 0;
      scene?.setLayout(state.layout);
      scene?.explode(state.explode);
      scene?.focus();
      syncControls();
    }),
);
document
  .querySelectorAll("[data-view]")
  .forEach((b) => (b.onclick = () => scene?.view(b.dataset.view)));
$("#reset-view").onclick = resetView;
$("#explore-nav").onclick = () => {
  progress.routeMode = "free";
  persist();
  renderGuide();
  setDetailOpen(false);
  closeSidebar();
};
$("#plan-nav").onclick = openPlan;
$("#route-button").onclick = openPlan;
$("#about-nav").onclick = () => {
  $("#about-content").innerHTML =
    `<div class="eyebrow">MODELİN KİMLİĞİ VE SINIRLARI</div><h2>Ne biliyoruz, neyi temsil ediyoruz?</h2><p>${esc(vehicle.name)} · ${vehicle.year} · ${esc(vehicle.variant)}</p><p>${esc(vehicle.disclaimer)}</p><div class="accuracy-grid"><div><strong>Geometri</strong><p>Özgün ve sadeleştirilmiş. Parça adetleri, ölçüler ve elektronik iç düzen temsili olabilir; CAD veya servis çizimi değildir.</p></div><div><strong>Davranış</strong><p>Dört ideal öğretim deneyi. Üretici yazılımı, termal kalibrasyon, yol tutuşu ve gerçek güç sınırları modellenmez.</p></div></div><h3>Kaynaklar</h3><div class="source-list">${sources.map((s) => `<p><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><small>${esc(s.scope)}</small></p>`).join("")}</div><p>Etkileşim ilhamı: <a href="https://github.com/ashemag/human-atlas" target="_blank" rel="noopener noreferrer">Human Atlas</a>. Kod veya anatomik varlık kopyalanmadı.</p><p class="safety">Yüksek gerilim sistemlerine müdahale etmeyin. Bu uygulama mesleki yetkilendirme veya servis talimatı değildir.</p>`;
  $("#about").showModal();
};
document
  .querySelectorAll("[data-close]")
  .forEach((b) => (b.onclick = () => $("#" + b.dataset.close).close()));
function updateMetrics() {
  $("#metrics-output").textContent = scene
    ? JSON.stringify(scene.getMetrics(), null, 2) +
      "\n\nframeMs: CPU çizim gönderim süresi (ms); GPU süresi veya FPS değildir.\nrenderCount: bu oturumda çizilen kare sayısı."
    : "WebGL kullanılamıyor; geometri çizilmedi.";
}
$("#metrics-toggle").onclick = () => {
  updateMetrics();
  $("#metrics").showModal();
};
$("#metrics-refresh").onclick = updateMetrics;
document.querySelectorAll("[data-start]").forEach(
  (b) =>
    (b.onclick = () => {
      progress.started = true;
      progress.routeMode = "guided";
      setMode(b.dataset.start);
      $("#welcome").close();
    }),
);
$("#welcome").addEventListener("cancel", () => {
  progress.started = true;
  persist();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    setDetailOpen(false);
    closeSidebar();
  }
  if (
    e.key === "/" &&
    !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) &&
    !document.querySelector("dialog[open]")
  ) {
    e.preventDefault();
    $(".sidebar").classList.add("sidebar-open");
    $("#systems-toggle").setAttribute("aria-expanded", "true");
    $("#part-search").focus();
  }
});
try {
  if (new URLSearchParams(location.search).get("renderer") === "off")
    throw new Error("Metin modu");
  scene = createScene($("#canvas-host"), (id) => selectNode(id));
  syncScene();
} catch {
  $("#canvas-host").innerHTML =
    '<div class="webgl-error"><h2>Metin laboratuvarı açık.</h2><p>3D görünüm başlatılamadı. Parça listesinden tüm açıklamalara, görevlere ve sayısal deneylere erişebilirsin.</p></div>';
}
renderTree();
renderGuide();
renderDetail();
syncControls();
if (!progress.started) $("#welcome").showModal();
window.addEventListener("pagehide", () => scene?.destroy(), { once: true });
