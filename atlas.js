// EV Atlas: source-aware, representative learning data for a 2018 Tesla
// Model 3 Long Range RWD. The geometry described here is intentionally
// educational; it is not an OEM CAD dataset or a claim about hidden Tesla
// implementation details.

import { parts } from "./content.js";

// Evidence checked 2026-09-06 with read-only HTTP requests (HTTP 200):
// https://service.tesla.com/en-US/vehicle-models/Model3
// https://service.tesla.com/docs/Model3/ServiceManual/index-model-3-2017.html
// https://afdc.energy.gov/vehicles/how-do-all-electric-cars-work
export const sources = [
  {
    id: "tesla-model3-service",
    title: "Tesla Model 3 Service Portal",
    url: "https://service.tesla.com/en-US/vehicle-models/Model3",
    scope:
      "Model 3 servis dokümanları ve model ailesi başlıkları için birincil referans; her alt parçanın iç tasarımını doğrulamaz.",
  },
  {
    id: "tesla-model3-manual",
    title: "Tesla Model 3 Service Manual (2017)",
    url: "https://service.tesla.com/docs/Model3/ServiceManual/index-model-3-2017.html",
    scope:
      "2017 sonrası Model 3 servis bağlamı, sistem adları ve servis perspektifi; eğitim geometrisi OEM CAD olarak kullanılmaz.",
  },
  {
    id: "tesla-model3-manual-en-us",
    title: "Tesla Model 3 Service Manual (English index)",
    url: "https://service.tesla.com/docs/Model3/ServiceManual/en-us/",
    scope:
      "Model 3 İngilizce servis kılavuzu konu ağacına giriş; servis prosedürleri ve parça bağlamı için doğrudan model-spesifik referans, CAD veya OEM kontrol algoritması değildir.",
  },
  {
    id: "doe-all-electric-cars",
    title: "U.S. DOE Alternative Fuels Data Center: How Do All-Electric Cars Work?",
    url: "https://afdc.energy.gov/vehicles/how-do-all-electric-cars-work",
    scope:
      "Elektrik akışının batarya, inverter, motor ve tekerleklere genel açıklaması; Tesla Model 3'e özgü ölçü veya kalibrasyon kaynağı değildir.",
  },
];

export const vehicle = {
  name: "Tesla Model 3",
  year: 2018,
  variant: "Long Range RWD",
  disclaimer:
    "Bu atlas, 2018 Tesla Model 3 Long Range RWD'yi referans alan eğitimsel bir modeldir. Geometriler temsili veya referansa dayalı sadeleştirmedir; gerçek OEM CAD, servis söküm sırası, gizli inverter uygulaması ya da Tesla onayı iddia etmez.",
};

const sourceIds = {
  generic: ["doe-all-electric-cars"],
  model3: ["tesla-model3-service", "tesla-model3-manual", "tesla-model3-manual-en-us"],
  system: ["doe-all-electric-cars", "tesla-model3-service"],
};

const rootById = new Map(parts.map((part) => [part.id, part]));

const energyRoot = {
  id: "energy",
  parentId: "vehicle",
  systemId: "energy",
  name: "Enerji ve güç akışı",
  english: "Energy and power flow",
  aliases: ["enerji", "güç", "power", "energy", "bataryadan tekerleğe"],
  color: "#f0c36b",
  basic: {
    title: "Bataryadan tekerleğe enerji yolu",
    description:
      "Sürüşte bataryanın doğru akımı inverter üzerinden motorun kontrollü akımlarına, oradan da redüksiyon ve diferansiyel üzerinden tekerlek hareketine dönüşür.",
    points: [
      "kWh depolanan enerjiyi, kW ise enerjinin aktarılma hızını ifade eder.",
      "Gaz pedalı isteği, bataryanın sınırları ve motor kontrolü birlikte değerlendirilir.",
      "Rejeneratif frenlemede mekanik enerji elektrik enerjisine geri döner.",
    ],
  },
  advanced: {
    title: "Güç akışı bir sınırlar zinciridir",
    description:
      "Araçtaki anlık güç, batarya gerilimi ve akımı, inverterin modülasyon sınırları, motorun çalışma noktası ve aktarma verimi tarafından birlikte belirlenir.",
    points: [
      "İdeal zincir P_tekerlek ≈ V_batarya·I_batarya·η_toplam ile tahmin edilir.",
      "Akım, gerilim, sıcaklık ve SOC sınırlarından en kısıtlayıcı olanı kullanılabilir gücü belirleyebilir.",
      "Her hesapta belgelenmiş değer ile öğretim amaçlı varsayım birbirinden ayrılmalıdır.",
    ],
  },
  sources: sourceIds.generic,
  geometryStatus: "Temsili",
  informationStatus: "Hesaplanmış",
  accuracyNote:
    "Akış, elektrikli araçların genel mimarisini öğretir; bu sayısal değerler belirli bir Model 3 kalibrasyonu değildir.",
  stats: [
    { label: "Akış", value: "DC → AC → hareket" },
    { label: "Enerji", value: "kWh" },
    { label: "Güç", value: "kW" },
  ],
  question: {
    text: "Sürüşte batarya ile tekerlekler arasındaki temel sıra hangisidir?",
    options: [
      "Batarya → inverter → motor → aktarma → tekerlek",
      "Batarya → diferansiyel → inverter → motor",
      "Tekerlek → OBC → batarya → motor",
    ],
    answer: 0,
    explanation:
      "İnverter DC enerjiyi motorun istediği kontrollü akımlara dönüştürür; aktarma sistemi motor torkunu tekerleklere taşır.",
  },
  advancedQuestion: {
    text: "Aynı batarya enerjisi neden farklı araçlarda farklı tekerlek gücü oluşturabilir?",
    options: [
      "Gerilim-akım sınırları, verimler, motor çalışma noktası ve kontrol limitleri farklıdır",
      "kWh değeri tek başına her güç elektroniği parametresini sabitler",
      "Tekerlek gücü yalnızca araç renginden etkilenir",
    ],
    answer: 0,
    explanation:
      "Depolanan enerji, anlık güç kapasitesini ve zincirdeki kayıpları tek başına belirlemez.",
  },
};

const rootConfig = [
  ["battery", "Batarya paketi", "Battery pack", ["batarya", "battery", "yüksek gerilim", "hv"], sourceIds.model3],
  ["inverter", "İnverter", "Inverter", ["inverter", "invertör", "güç elektroniği", "dc-ac"], sourceIds.system],
  ["motor", "Elektrik motoru", "Electric motor", ["motor", "electric motor", "çekiş motoru", "pmsm"], sourceIds.generic],
  ["gears", "Redüksiyon ve diferansiyel", "Reduction gear and differential", ["redüksiyon", "dişli", "gear", "diferansiyel", "aktarma"], sourceIds.generic],
  ["charger", "Şarj cihazı (OBC)", "On-board charger", ["şarj", "charging", "obc", "on-board charger", "ac şarj"], sourceIds.system],
  ["dcdc", "DC-DC dönüştürücü", "DC-DC converter", ["dc-dc", "dcdc", "yardımcı güç", "12 v", "hv-lv"], sourceIds.system],
  ["thermal", "Termal yönetim", "Thermal management", ["termal", "thermal", "soğutma", "ısı", "sıcaklık"], sourceIds.system],
  ["bms", "Batarya yönetim sistemi", "Battery management system", ["bms", "batarya yönetimi", "soc", "soh", "hücre dengeleme"], sourceIds.system],
];

function cloneRoot(part, id, name, english, aliases, sourceList) {
  return {
    id,
    parentId: "vehicle",
    systemId: id,
    name,
    english,
    aliases,
    color: part.color,
    basic: part.basic,
    advanced: part.advanced,
    sources: sourceList,
    geometryStatus: "Temsili",
    informationStatus: "Belgelenmiş",
    accuracyNote:
      "Sistem işlevi genel EV mimarisi ve Model 3 servis bağlamıyla uyumludur; bu kayıt belirli üretim alt varyantının iç CAD'ini doğrulamaz.",
    ...(part.stats ? { stats: part.stats } : {}),
    ...(part.question ? { question: part.question } : {}),
    ...(part.advancedQuestion ? { advancedQuestion: part.advancedQuestion } : {}),
  };
}

export const systems = [
  ...rootConfig.map(([id, name, english, aliases, sourceList]) =>
    cloneRoot(rootById.get(id), id, name, english, aliases, sourceList),
  ),
];

const childDefinitions = [
  ["battery-tray", "battery", "Batarya alt muhafazası", "Battery tray", ["alt muhafaza", "tray", "battery enclosure"], "Batarya modüllerini ve koruyucu katmanları taşıyan alt yapı; yükleri tabana dağıtır ve dış etkilerden korumaya yardımcı olur.", "Batarya alt muhafazası, paket içindeki hücre ve modüller için mekanik bir referans yüzeyi oluşturur. Gerçek kesit ve bağlantı noktaları üretim varyantına göre değişebilir.", "Referansa dayalı sadeleştirme", "Belgelenmiş", "Model 3 servis bağlamında paket çevresi servis edilebilir bir birim olarak ele alınır; burada gösterilen taban geometrisi eğitim için sadeleştirilmiştir."],
  ["battery-lid", "battery", "Batarya üst kapağı", "Battery lid", ["kapak", "üst kapak", "battery cover"], "Üst kapak, paketin üst bölümünü kapatır ve iç bileşenleri çevresel etkilerden ayırır.", "Kapak tasarımında sızdırmazlık, rijitlik, servis erişimi ve yüksek gerilim izolasyon mesafeleri birlikte düşünülür; bu atlas ayrıntılı conta tasarımını göstermiyor.", "Temsili", "Belgelenmiş", "Kapak işlevi mühendislik açısından geneldir; bu geometri gerçek Model 3 panel ölçüsü olarak sunulmaz."],
  ["battery-modules", "battery", "Batarya modülleri", "Battery modules", ["modül", "modüller", "battery module"], "Modüller, birden fazla hücreyi mekanik ve elektriksel olarak gruplayan eğitimsel ara katmandır.", "Modül sınırları; hücre formatı, paketleme ve üretim mimarisine bağlıdır. Buradaki bloklar, tekrar eden hücreleri tek tek ders konusu yapmadan seri-paralel fikrini görünür kılar.", "Temsili", "Varsayılmış", "2018 Model 3 varyantındaki gerçek modül sayısı veya iç yerleşim bu genel kaynaklarla doğrulanmış kabul edilmemiştir."],
  ["battery-cells", "battery", "Batarya hücreleri", "Battery cells", ["hücre", "cell", "li-ion", "battery cell"], "Hücre, kimyasal enerjiyi elektrik enerjisine dönüştüren temel depolama elemanıdır.", "Seri hücreler paket gerilimini, paralel gruplar ise kapasite ve akım paylaşımını etkiler. SOC, sıcaklık ve iç direnç hücre davranışını değiştirir.", "Temsili", "Belgelenmiş", "Hücrelerin işlevi genel Li-ion prensibidir; belirli hücre üreticisi, kimyası ve ölçüsü iddia edilmez."],
  ["battery-busbars", "battery", "Bara bağlantıları", "Busbars", ["bara", "busbar", "bus bars", "bara bağlantısı"], "Bara bağlantıları, hücre veya modül terminalleri arasında düşük dirençli elektriksel yollar sağlar.", "Bara kesiti, temas direnci, izolasyon ve kısa devre koruması yüksek akımlı paketin güvenliği için önemlidir; şekil yalnızca akış yönünü anlatır.", "Temsili", "Varsayılmış", "İç bara güzergâhı ve kesiti açık kaynak servis sayfalarından doğrulanmış değildir."],
  ["battery-contactors", "battery", "Kontaktör grubu", "Contactor assembly", ["kontaktör", "contactor", "precharge", "ön şarj"], "Kontaktörler yüksek gerilim paketini araç DC barasına bağlayan veya ayıran kontrollü anahtarlardır.", "Ön şarj yolu, DC-link kapasitörlerinin ani akımını sınırlamaya yardımcı olur. Kontaktör durumu, BMS ve araç kontrolcüsünün güvenlik kararlarıyla ilişkilidir.", "Temsili", "Belgelenmiş", "Kontaktörlerin güvenlik işlevi genel HV mimarisidir; gerçek Tesla devre şeması veya parça numarası çıkarımı yapılmamıştır."],
  ["motor-stator", "motor", "Stator", "Stator", ["stator", "sargı", "winding", "motor sargısı"], "Stator, inverterden gelen faz akımlarının oluşturduğu dönen manyetik alanı taşıyan sabit bölümdür.", "Sargı geometrisi, faz bağlantısı ve soğutma; tork dalgalanması, bakır kaybı ve termal sınırları etkiler.", "Temsili", "Belgelenmiş", "Stator işlevi elektrik motorlarının genel prensibidir; Model 3 motorunun tüm elektromanyetik ayrıntıları açıklanmamıştır."],
  ["motor-rotor", "motor", "Rotor", "Rotor", ["rotor", "dönen kısım", "permanent magnet", "mıknatıs"], "Rotor, stator alanıyla etkileşerek dönen elektromanyetik bölümdür; torkun mekanik çıkışa taşınmasına katkı verir.", "Kalıcı mıknatıslı veya asenkron mimariler farklı rotor davranışlarına sahiptir. Bu atlas motor tipini tüm üretim varyantları için kesinleştirmez.", "Temsili", "Varsayılmış", "Rotor iç mıknatısları ve laminasyon düzeni genel eğitim modeli olarak gösterilir; gizli OEM tasarımı iddia edilmez."],
  ["motor-shaft", "motor", "Motor mili", "Motor shaft", ["mil", "shaft", "çıkış mili", "rotor mili"], "Motor mili elektromanyetik torku redüksiyon dişlisine taşıyan dönen mekanik bağlantıdır.", "Mil burulması, yatak kayıpları, kritik devir ve yağlama; yüksek devirli çekiş motorunda mekanik tasarımın parçalarıdır.", "Temsili", "Belgelenmiş", "Mildeki boyutlar ve yatak yerleşimi ölçülmüş araç verisi değildir."],
  ["motor-housing", "motor", "Motor muhafazası", "Motor housing", ["muhafaza", "housing", "motor gövdesi", "kasa"], "Muhafaza, motorun elektromanyetik ve mekanik parçalarını konumlandırır; ısı geçişi ve sızdırmazlığa katkı verir.", "Muhafaza rijitliği, titreşim, soğutma kanalları ve servis bağlantıları birlikte tasarlanır. Gösterim, katmanları öğrenmek için kısmen transparandır.", "Referansa dayalı sadeleştirme", "Varsayılmış", "Dış siluet eğitimsel bir temsilidir; gerçek döküm şekli veya bağlantı ölçüleri doğrulanmamıştır."],
  ["inverter-switches", "inverter", "Güç anahtarları", "Power switches", ["anahtar", "mosfet", "igbt", "sic", "yarı iletken"], "Güç anahtarları, batarya DC'sini motor fazlarında kontrollü akım oluşturacak şekilde hızlıca anahtarlayan yarı iletkenlerdir.", "Üç yarım köprü, PWM ve dead-time ile birlikte değerlendirilir. Anahtarlama kaybı, iletim kaybı ve EMI tasarımı sınırlar.", "Temsili", "Belgelenmiş", "Yarı iletken topolojisi genel çekiş inverteri prensibidir; Tesla'nın gizli komponent seçimi iddia edilmez."],
  ["inverter-capacitor", "inverter", "DC-link kondansatörü", "DC-link capacitor", ["kondansatör", "capacitor", "dc link", "dc-link"], "DC-link kondansatörü, anahtarlama akım darbelerini ve DC bara gerilim dalgalanmasını yönetmeye yardımcı olur.", "Kapasite, ESR, parasitik endüktans ve gerilim dayanımı; inverterin dinamik davranışı ve anahtarlama güvenliği için önemlidir.", "Temsili", "Hesaplanmış", "İnverter DC-link işlevi genel güç elektroniği modelidir; gerçek değerler bu kaynaklardan çıkarılamaz."],
  ["inverter-heatsink", "inverter", "İnverter soğutucusu", "Inverter heatsink", ["soğutucu", "heatsink", "soğutma plakası", "cooler"], "Soğutucu, güç anahtarları ve çevresindeki ısıyı sıvı veya başka bir termal yola aktarır.", "Termal direnç, temas yüzeyi, soğutucu akışı ve anahtarlama kayıpları birlikte güç sınırı oluşturur.", "Temsili", "Varsayılmış", "Gösterilen kanal düzeni kavramsaldır; gerçek Model 3 inverter soğutma geometrisi olarak doğrulanmamıştır."],
  ["inverter-board", "inverter", "Kontrol kartı", "Control board", ["kart", "control board", "gate driver", "kontrol elektroniği"], "Kontrol kartı, akım/gerilim geri beslemesi ve sürücü devreleriyle güç anahtarlarının zamanlamasını yönetir.", "İzolasyon, örnekleme gecikmesi, hata bayrakları ve güvenli tork kesme sinyalleri güç katıyla birlikte tasarlanır.", "Temsili", "Varsayılmış", "Kartın yazılımı ve devre ayrıntıları eğitimsel soyutlamadır; OEM algoritması veya şeması değildir."],
  ["gears-pinion", "gears", "Giriş pinyonu", "Input pinion", ["pinyon", "pinion", "giriş dişlisi"], "Giriş pinyonu motor milinden gelen yüksek deviri redüksiyon dişli çiftine aktarır.", "Diş sayısı oranı, temas gerilmesi ve yağlama; aynı motor torkundan elde edilecek tekerlek kuvvetini etkiler.", "Temsili", "Hesaplanmış", "Diş sayısı ve oran, deneyde ayarlanabilir öğretim parametreleridir; Model 3 servis verisi olarak sabitlenmemiştir."],
  ["gears-reduction", "gears", "Redüksiyon dişlisi", "Reduction gear", ["redüksiyon", "reduction", "dişli oranı", "gear ratio"], "Redüksiyon dişlisi motor devrini düşürerek tekerlek tarafında kullanılabilir torku artırır.", "İdeal ilişkide i = n_motor/n_tekerlek ve T_tekerlek ≈ T_motor·i·η kullanılır; gerçek kayıplar yağ, yatak ve diş temasından gelir.", "Temsili", "Hesaplanmış", "Oran ve verim, formülü öğretmek için seçilmiş örneklerdir; üretim kalibrasyonu değildir."],
  ["gears-case", "gears", "Dişli muhafazası", "Gear case", ["gear case", "diferansiyel gövdesi", "muhafaza"], "Dişli muhafazası, dişli ve diferansiyel bileşenlerini hizalar; yağlama ve yapısal koruma sağlar.", "Rijitlik ve termal davranış, dişli temas desenini ve gürültüyü etkiler. Dış gövdeyi kesit görünümünde yarı saydam gösteriyoruz.", "Referansa dayalı sadeleştirme", "Varsayılmış", "Gövde silueti eğitimsel bir sadeleştirmedir; döküm ve montaj ölçüleri doğrulanmış OEM çizimi değildir."],
  ["gears-internals", "gears", "Diferansiyel iç dişlileri", "Differential internals", ["diferansiyel", "differential", "iç dişli", "side gear", "spider gear"], "Diferansiyel iç dişlileri, virajda iki çıkışın birbirinden farklı hızlarda dönmesini sağlar.", "Açık diferansiyelde tork davranışı, düşük tutuşlu taraf ve çekiş kontrolüyle birlikte anlaşılmalıdır; yalnızca ‘hız eşitleme’ demek eksiktir.", "Temsili", "Belgelenmiş", "İç dişli yerleşimi genel diferansiyel prensibidir; belirli Model 3 varyantının kesit modeli değildir."],
  ["gears-axles", "gears", "Yarım akslar", "Half-shafts", ["aks", "half shaft", "yarım aks", "aks mili"], "Yarım akslar diferansiyel çıkış torkunu süspansiyon hareketine izin vererek tekerlek göbeklerine taşır.", "Sabit hız mafsalları, açı değişimi, burulma ve darbe yükleri; aksın gerçek sürüşteki sınırlarını belirler.", "Temsili", "Belgelenmiş", "Aksların işlevi genel aktarma mimarisidir; boyutlar ve mafsal tipi kaynaklardan çıkarılmamıştır."],
  ["gears-wheels", "gears", "Tekerlekler", "Wheels", ["tekerlek", "wheel", "lastik", "tire"], "Tekerlekler, aks torkunu yol ile temas kuvvetine dönüştürür; araç kuvveti lastik-yol sınırıyla sınırlanır.", "Etkin yarıçap, yuvarlanma direnci, basınç, yük ve tutuş; aynı aktarma torkunun hızlanma ve menzil sonucunu etkiler.", "Temsili", "Belgelenmiş", "Tekerlek modeli araç bağlamı içindir; jant, lastik ve gerçek temas parametreleri üretim konfigürasyonu değildir."],
];

function childNode([id, systemId, name, english, aliases, basicDescription, advancedDescription, geometryStatus, informationStatus, accuracyNote]) {
  const system = systems.find((candidate) => candidate.id === systemId);
  return {
    id,
    parentId: systemId,
    systemId,
    name,
    english,
    aliases,
    color: system.color,
    basic: {
      title: name,
      description: basicDescription,
      points: [
        `Bu parça ${system.name.toLowerCase()} sisteminin bir bölümüdür.`,
        "Model üzerinde seçerek görevi ve enerji/mekanik bağlantısını takip edebilirsin.",
        "Geometri öğrenme amaçlıdır; açıklamadaki doğruluk etiketi kaynak kapsamını belirtir.",
      ],
    },
    advanced: {
      title: `${name}: mühendislik bakışı`,
      description: advancedDescription,
      points: [
        "Sınırlar; elektriksel, mekanik, termal ve kontrol koşullarının birlikte değerlendirilmesini gerektirir.",
        "Bir değeri araç varyantına taşımadan önce kaynağın kapsamını ve varsayımlarını kontrol et.",
        "Temsili animasyon gerçek servis söküm sırası veya OEM kontrol algoritması değildir.",
      ],
    },
    sources: sourceIds.model3.includes("tesla-model3-service") ? ["tesla-model3-service", "doe-all-electric-cars"] : sourceIds.generic,
    geometryStatus,
    informationStatus,
    accuracyNote,
  };
}

export const children = childDefinitions.map(childNode);
export const nodes = [...systems, ...children];

export function getNode(id) {
  return nodes.find((node) => node.id === id);
}

export function childrenOf(id) {
  return children.filter((node) => node.parentId === id);
}

function normalize(value) {
  return String(value ?? "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i");
}

export function searchNodes(query) {
  const needle = normalize(query).trim();
  if (!needle) return nodes;
  return nodes.filter((node) =>
    [node.name, node.english, ...node.aliases].some((value) => normalize(value).includes(needle)),
  );
}

const lessonData = [
  ["energy", "Enerji ve güç", "kWh, kW ve bataryadan tekerleğe enerji yolunu ayırt etmek.", "Enerjiyi depodaki miktar, gücü ise akış hızı gibi düşün.", "P = T·ω, verim ve sınırların birlikte güç akışını belirlediğini incele.", "battery", "adjust", "Batarya yükünü ayarla.", "60 kWh ile 150 kW aynı tür büyüklük müdür?", ["Hayır; biri enerji, diğeri güç birimidir", "Evet; ikisi de aynı kapasiteyi gösterir", "Yalnızca tekerlek çapını gösterir"], 0, "kWh enerji miktarını, kW ise enerji aktarım hızını ifade eder.", "Sürekli 30 kW ideal çekişte 60 kWh yaklaşık kaç saat sürer?", ["2 saat", "0,5 saat", "30 saat"], 0, "İdeal süre enerji/güç = 60/30 = 2 saattir."],
  ["battery", "Batarya", "Hücre, modül, bara ve kontaktörlerin paketteki rollerini tanımak.", "Bataryayı aracın yüksek gerilim enerji deposu olarak incele.", "Seri-paralel yapı, SOC, iç direnç ve güç limitlerinin birbirinden farkını çözümle.", "battery-cells", "select", "Batarya hücrelerini seç.", "Seri bağlanan hücrelerde öncelikle hangi büyüklük artar?", ["Toplam gerilim", "Tekerlek çapı", "Diferansiyel hızı"], 0, "Seri bağlantı gerilimleri toplar; paralel bağlantı kapasite ve akım kabiliyetini etkiler.", "Aynı kWh değerindeki iki paket neden farklı sürekli güç verebilir?", ["İç direnç, sıcaklık ve akım limitleri farklı olabilir", "kWh her sınırı kesinlikle eşitler", "Yalnızca boya farkı nedeniyle"], 0, "Enerji kapasitesi tek başına güç kabiliyetini belirlemez."],
  ["inverter", "İnverter", "Batarya DC'sinin motor için kontrollü faz akımlarına dönüşmesini görmek.", "DC giriş ve üç fazlı çıkışı şematik olarak takip et.", "Yarım köprüler, PWM, dead-time ve anahtarlama kayıplarını ilişkilendir.", "inverter", "run", "İnverteri çalıştır; DC baradan üç fazlı çıkışın oluşumunu yavaşlatılmış şemayla gözle.", "Çekiş inverterinin temel dönüşümü nedir?", ["DC → kontrollü AC", "AC → lastik basıncı", "Mekanik → kimyasal"], 0, "İnverter motor faz akımlarını kontrol etmek için DC'yi anahtarlanmış AC'ye dönüştürür.", "Anahtarlama frekansını artırmanın olası bedeli nedir?", ["Anahtarlama kaybı ve EMI artabilir", "Batarya kapasitesi anında iki katına çıkar", "Mekanik kayıplar yok olur"], 0, "Daha yüksek frekans kontrol avantajı sağlayabilir ancak kayıp ve EMI'yi artırabilir."],
  ["motor", "Motor", "Stator, rotor ve mil üzerinden elektromanyetik torkun oluşmasını açıklamak.", "Rotoru döndür ve stator alanını takip et.", "Tork, devir, güç, verim haritası ve termal sınırlar arasındaki ilişkiyi kur.", "motor", "run", "Motoru çalıştır; stator alanını, rotoru ve çıkış milini birlikte gözlemle.", "Mekanik güç hangi iki büyüklükle ilişkilidir?", ["Tork ve açısal hız", "Hücre sayısı ve lastik basıncı", "Renk ve gövde uzunluğu"], 0, "P = T·ω bağıntısında tork ve açısal hız birlikte mekanik gücü belirler.", "Güç sabitken motor hızı iki katına çıkarsa ideal tork ne olur?", ["Yaklaşık yarıya iner", "İki katına çıkar", "Kesinlikle değişmez"], 0, "Güç sabitse hız iki katına çıktığında tork yaklaşık yarıya düşer."],
  ["gears", "Aktarma ve diferansiyel", "Redüksiyon, diferansiyel ve tekerleklerin hareketi nasıl dönüştürdüğünü kavramak.", "Dişli oranını ayarla ve tekerlekteki sonucu gör.", "Tekerlek kuvveti, oran, verim, yarıçap ve viraj kinematiğini hesapla.", "gears", "adjust", "Redüksiyon oranını ayarla; motor devri ve torkunun tekerlek tarafında nasıl değiştiğini gözle.", "Diferansiyelin temel görevi nedir?", ["Virajda farklı tekerlek hızlarına izin vermek", "DC'yi AC'ye çevirmek", "Hücreleri şarj etmek"], 0, "İç ve dış tekerlek virajda farklı mesafe alır; diferansiyel hız farkını mümkün kılar.", "Oran artırılırsa aynı motor devrinde ne beklenir?", ["Tekerlek kuvveti artar, teorik hız azalır", "Kuvvet azalır, hız artar", "İkisi de kesinlikle sabit kalır"], 0, "Redüksiyon torku artırırken aynı motor devrindeki tekerlek hızını düşürür."],
  ["charging", "Şarj ve yardımcı güç", "AC OBC, DC hızlı şarj ve HV'den 12 V'a dönüşümü ayırmak.", "Şarj yolunu ve DC-DC'nin yardımcı sistemleri nasıl beslediğini incele.", "OBC, PFC, şarj profili, izolasyon ve yük geçişlerini sistem sınırlarıyla değerlendir.", "dcdc", "select", "DC-DC dönüştürücüyü seç.", "AC şarjda temel AC-DC dönüşümünü hangi parça yapar?", ["OBC", "Diferansiyel", "Motor mili"], 0, "AC şarjda araç içi OBC şebeke AC'sini bataryaya uygun DC'ye dönüştürür.", "İstasyon 22 kW verebildiği hâlde araç neden 11 kW ile sınırlanabilir?", ["OBC'nin araç içi kabul limiti 11 kW olabilir", "Diferansiyel gücü engeller", "Batarya her zaman boşalır"], 0, "Araç, OBC ve batarya güvenlik sınırlarının izin verdiği gücü talep eder."],
  ["bms", "BMS", "Ölçüm, SOC/SOH kestirimi ve güvenli şarj/deşarj limitlerini anlamak.", "BMS'nin sensörlerden güvenli çalışma sınırına giden kararını izle.", "Coulomb counting, OCV düzeltmesi, dengeleme ve hata durumlarını ilişkilendir.", "bms", "select", "BMS'yi seç; gerilim, akım ve sıcaklık ölçümlerinin güç limitlerine nasıl dönüştüğünü incele.", "BMS'nin görevlerinden biri nedir?", ["Güvenli şarj/deşarj limitleri belirlemek", "Dişli oranını değiştirmek", "Lastik üretmek"], 0, "BMS sensör verileriyle bataryanın güvenli çalışma alanını belirler.", "Coulomb counting neden uzun süre sonra tek başına sürüklenebilir?", ["Akım sensörü ofseti birikir", "Motor devri SOC'yi doğrudan ölçer", "Sıcaklık otomatik sabitlenir"], 0, "Küçük akım ölçüm hataları zamanla birikir; model ve gerilim düzeltmeleri gerekir."],
  ["thermal", "Termal yönetim ve sistem bütünleştirme", "Sıcaklık, güç sınırları ve sistemler arası kararların birlikte çalışmasını görmek.", "Batarya, motor ve inverterin neden soğutulduğunu öğren.", "Sıcaklık gradyanı, I²R kayıpları, aktüatör tüketimi ve bütünleşik kontrol ödünleşimlerini değerlendir.", "thermal", "select", "Termal yönetim sistemini seç ve sıcaklık limitlerini karşılaştır.", "Soğuk batarya neden rejeneratif gücü sınırlayabilir?", ["Yüksek şarj akımını güvenle kabul etmeyebilir", "Diferansiyel çalışamaz", "Tekerlek çapı büyür"], 0, "Düşük sıcaklık hücrelerin yüksek şarj akımını kabul etmesini kısıtlayabilir.", "Aynı ortalama sıcaklıkta paketlerden biri neden daha düşük şarj gücü alabilir?", ["En soğuk hücre veya sıcaklık gradyanı daha kısıtlayıcı olabilir", "Ortalama aynıysa her şey kesinlikle aynıdır", "Yalnızca dış hava belirler"], 0, "Güvenlik limiti ortalamadan çok kritik hücrenin yerel sınırına göre belirlenebilir."],
];

export const lessons = lessonData.map(([id, title, objective, basic, advanced, targetId, type, description, questionText, options, answer, explanation, advancedQuestionText, advancedOptions, advancedAnswer, advancedExplanation]) => ({
  id,
  title,
  objective,
  basic,
  advanced,
  targetId,
  task: { type, targetId, description },
  question: { text: questionText, options, answer, explanation },
  advancedQuestion: { text: advancedQuestionText, options: advancedOptions, answer: advancedAnswer, explanation: advancedExplanation },
}));

export const glossary = [
  { term: "kWh", definition: "Bataryanın depoladığı enerji miktarı; güç değil, toplam enerji birimidir." },
  { term: "kW", definition: "Enerjinin aktarılma hızını, yani gücü ifade eder." },
  { term: "Tork", definition: "Bir kuvvetin dönme ekseni etrafındaki döndürme etkisidir; birimi N·m'dir." },
  { term: "İnverter", definition: "Batarya DC'sini motor için kontrollü çok fazlı AC akımlarına dönüştüren güç elektroniği katıdır." },
  { term: "SOC", definition: "Bataryada kalan şarj durumunun kestirimidir; doğrudan tek bir sensörle ölçülmez." },
  { term: "SOH", definition: "Bataryanın yaşlanma ve kullanılabilir kapasite/güç durumunu ifade eden sağlık göstergesidir." },
  { term: "BMS", definition: "Hücreleri izleyen, koruyan, dengeleyen ve izin verilen güç sınırlarını hesaplayan batarya yönetim sistemi." },
  { term: "Rejeneratif frenleme", definition: "Tekerleklerin mekanik enerjisinin motor-jeneratör ve inverter üzerinden bataryaya geri aktarılmasıdır." },
  { term: "DC", definition: "Doğru akım; elektrikli araç bataryasının temel elektriksel çıkış biçimidir." },
  { term: "AC", definition: "Alternatif akım; motor fazlarında ve şebeke tarafında kullanılan yönü değişen akımdır." },
  { term: "Rotor", definition: "Motorun manyetik alanla etkileşerek dönen kısmıdır." },
  { term: "Stator", definition: "Motorun sabit kalan, faz sargılarını ve dönen manyetik alanı taşıyan kısmıdır." },
  { term: "PWM", definition: "Ortalama gerilim ve akımı kontrol etmek için anahtarlama darbe oranının ayarlanmasıdır." },
  { term: "RMS", definition: "Değişken bir elektriksel büyüklüğün ısıtma veya güç etkisini karşılaştıran etkin değeridir." },
  { term: "A", definition: "Akım birimi amperdir; elektrik yükünün ne kadar hızlı aktığını ifade eder." },
  { term: "Ah", definition: "Akım-zaman kapasitesi; bataryanın belirli akımı ne kadar süre sağlayabileceğini ifade eden birimdir." },
  { term: "V", definition: "Gerilim birimi volt; elektriksel potansiyel farkını ifade eder." },
  { term: "Kontaktör", definition: "Yüksek gerilim devresini kontrollü biçimde bağlayan veya ayıran elektromekanik anahtardır." },
];
