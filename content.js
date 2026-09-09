// Interactive learning content for the EV explorer.
// `answer` is a zero-based index into `question.options`.

export const parts = [
  {
    id: "battery",
    name: "Batarya paketi",
    tag: "Enerji depolama",
    subtitle: "Kimyasal enerjiyi yüksek gerilimli elektrik enerjisine çevirir.",
    color: "#b6db83",
    basic: {
      title: "Aracın enerji deposu",
      description:
        "Batarya paketi, seçilen hücre mimarisine göre hücreleri doğrudan paket seviyesinde veya modüller üzerinden birleştirir. Sürüşte doğru akım sağlar; şarj olurken elektrik enerjisini kimyasal enerji olarak depolar.",
      points: [
        "Kapasite kWh ile, anlık güç ve akım sınırları kW ve A ile ifade edilir.",
        "Yüksek gerilimli paket ile aracın 12 V yardımcı sistemi farklı devrelerdir.",
        "Kullanılabilir enerji; sıcaklık, şarj seviyesi, yaşlanma ve güvenlik rezervlerinden etkilenir.",
      ],
    },
    advanced: {
      title: "Hücreden pakete: elektriksel ve güvenlik sınırları",
      description:
        "Hücreler seri bağlanarak gerilim, paralel bağlanarak kapasite ve akım kabiliyeti artırılır. Paket tasarımında enerji yoğunluğu kadar ısıl yayılım, izolasyon, servis edilebilirlik ve hata durumunda güvenli ayrılma da belirleyicidir.",
      points: [
        "Seri hücre sayısı toplam gerilimi; paralel gruplar Ah kapasitesini ve akım paylaşımını belirler.",
        "OCV-SOC ilişkisi kimyaya ve sıcaklığa bağlıdır; SOC doğrudan ölçülmez, akım integrasyonu ve model tabanlı kestirimle tahmin edilir.",
        "C-rate tek başına yeterli değildir: güç limiti, hücre iç direnci, sıcaklık gradyanı ve yaşlanma birlikte değerlendirilmelidir.",
      ],
    },
    stats: [
      { label: "Tipik paket", value: "400–800 V" },
      { label: "Enerji birimi", value: "kWh" },
      { label: "Hücre kimyası", value: "Li-ion" },
    ],
    question: {
      text: "Bir bataryanın 60 kWh olması öncelikle neyi anlatır?",
      options: [
        "Depolayabildiği yaklaşık enerji miktarını",
        "Her koşulda verebileceği en yüksek gücü",
        "Motorun dönme hızını",
      ],
      answer: 0,
      explanation:
        "kWh enerji miktarıdır. Maksimum güç; hücrelerin, kontaktörlerin, inverterin ve kontrol yazılımının akım-gerilim sınırlarına bağlıdır.",
    },
    advancedQuestion: {
      text: "Aynı nominal kWh değerine sahip iki paket neden farklı sürekli güç sağlayabilir?",
      options: [
        "Hücre kimyası, iç direnç, termal koşullar ve akım limitleri farklı olabilir",
        "kWh değeri motorun dişli oranını otomatik olarak belirler",
        "Nominal enerji eşitse her elektriksel ve termal sınır da kesinlikle aynıdır",
      ],
      answer: 0,
      explanation:
        "Enerji kapasitesi tek başına güç kabiliyetini belirlemez. Hücrelerin iç direnci, paralel grup yapısı, sıcaklık, soğutma ve BMS/inverter akım limitleri sürekli gücü değiştirir.",
    },
  },
  {
    id: "inverter",
    name: "İnverter",
    tag: "Güç elektroniği",
    subtitle:
      "Batarya DC'sini motorun istediği kontrollü üç fazlı AC'ye dönüştürür.",
    color: "#e5b978",
    basic: {
      title: "Elektrik ile tork arasındaki kumanda",
      description:
        "İnverter, gaz pedalı isteğini ve araç kontrolcüsünün komutlarını izleyerek motora giden faz akımlarını ayarlar. Böylece motor torku ve dönüş hızı kontrol edilir.",
      points: [
        "DC bağlantısındaki yüksek gerilimi anahtarlama elemanlarıyla üç fazlı AC dalga biçimine çevirir.",
        "Sürüşte enerji motora gider; rejeneratif frenlemede akımın yönü tersine döner.",
        "Anahtarlama ve iletim kayıpları ısı üretir; inverter bu nedenle soğutma ister.",
      ],
    },
    advanced: {
      title: "Anahtarlama, modülasyon ve akım kontrolü",
      description:
        "Tipik çekiş inverteri, IGBT veya SiC MOSFET yarı iletkenlerinden oluşan üç yarım köprüdür. PWM ve alan yönlendirmeli kontrol, d-q ekseninde akı ve tork bileşenlerini düzenler; gerçek uygulama motor tipine ve kontrol mimarisine göre değişir.",
      points: [
        "DC-link gerilimi, modülasyon derinliği ve anahtarlama frekansı erişilebilir faz gerilimini, kaybı ve akustik davranışı etkiler.",
        "Dead-time, akım örnekleme gecikmesi ve parasitik endüktanslar tork dalgalanmasına ve EMI'ya katkı verebilir.",
        "Desat/aşırı akım koruması, izolasyon izleme ve güvenli tork kesme gibi işlevler donanım-yazılım birlikte tasarlanır.",
      ],
    },
    stats: [
      { label: "Giriş", value: "DC" },
      { label: "Çıkış", value: "3 faz AC" },
      { label: "Anahtarlama", value: "PWM" },
    ],
    question: {
      text: "İnverterin temel görevi hangisidir?",
      options: [
        "DC'yi motor için kontrollü AC'ye çevirmek",
        "Bataryanın kimyasını değiştirmek",
        "Lastik basıncını ayarlamak",
      ],
      answer: 0,
      explanation:
        "Çekiş inverteri, bataryanın DC enerjisini motor sargılarında istenen akımı oluşturacak şekilde anahtarlanmış AC'ye dönüştürür.",
    },
    advancedQuestion: {
      text: "Aynı motor torkunu üretirken inverter anahtarlama frekansını artırmanın olası bedeli nedir?",
      options: [
        "Anahtarlama kayıpları ve EMI artabilir, bu da termal tasarımı zorlaştırır",
        "Bataryanın kimyasal kapasitesi anında iki katına çıkar",
        "Motorun tüm mekanik kayıpları otomatik olarak ortadan kalkar",
      ],
      answer: 0,
      explanation:
        "Daha yüksek anahtarlama frekansı akım dalgalanmasını ve duyulabilir gürültüyü azaltmaya yardımcı olabilir; ancak yarı iletken anahtarlama kaybı ve EMI genellikle artar.",
    },
  },
  {
    id: "motor",
    name: "Elektrik motoru",
    tag: "Elektromekanik dönüşüm",
    subtitle:
      "Kontrollü elektromanyetik alanları dönme hareketi ve torka çevirir.",
    color: "#75c9c2",
    basic: {
      title: "Elektriği harekete dönüştürmek",
      description:
        "Motorun statorundaki değişken manyetik alan rotor üzerinde kuvvet oluşturur. Bu kuvvet rotoru döndürür; milde oluşan tork redüksiyon ve diferansiyel üzerinden tekerleklere aktarılır.",
      points: [
        "Tork dönme etkisidir; güç ise torkun dönme hızıyla birlikte ne kadar hızlı iş yaptığını gösterir.",
        "Elektrikli araçlarda kalıcı mıknatıslı senkron ve asenkron motor gibi farklı tipler kullanılır.",
        "Motor verimi hız, tork, sıcaklık ve çalışma noktasına göre değişir.",
      ],
    },
    advanced: {
      title: "Çalışma noktası: tork, devir ve verim",
      description:
        "Motorun elektromanyetik torku, akım vektörü ve manyetik akı etkileşiminden doğar. Araç kontrolü, motor haritasındaki verimli bölgeleri kullanırken kalkış torku, taban hız, zayıflatılmış alan ve termal sınırlar arasında denge kurar.",
      points: [
        "Mekanik güç P = T·ω'dır; sabit güç bölgesinde hız arttıkça erişilebilir tork yaklaşık olarak azalır.",
        "PMSM'de MTPA ve alan zayıflatma gibi stratejiler DC-bus ve mıknatıs sınırlarına göre uygulanabilir.",
        "Bakır, demir, mıknatıs ve mekanik kayıplar; sıcaklık yükseldikçe direnç ve izin verilen sürekli tork değişir.",
      ],
    },
    stats: [
      { label: "Tork", value: "N·m" },
      { label: "Güç", value: "kW" },
      { label: "Yaygın tip", value: "PMSM" },
    ],
    question: {
      text: "Tork ve açısal hız birlikte arttığında genellikle hangi büyüklük artar?",
      options: ["Mekanik güç", "Batarya hücre sayısı", "Lastik çapı"],
      answer: 0,
      explanation:
        "Mekanik güç P = T·ω bağıntısıyla tork ve açısal hızın çarpımına bağlıdır. Gerçek sistemde kayıplar ayrıca hesaba katılır.",
    },
    advancedQuestion: {
      text: "Bir motorun hızı iki katına çıkarken mekanik gücü sabit tutuluyorsa ideal olarak torku nasıl değişir?",
      options: [
        "Yaklaşık yarıya iner",
        "Yaklaşık iki katına çıkar",
        "Hızdan bağımsız olarak kesinlikle aynı kalır",
      ],
      answer: 0,
      explanation:
        "P = T·ω olduğundan güç sabitse açısal hız iki katına çıktığında tork yaklaşık yarıya düşer. Gerçek motor haritası ve sınırlar bu ideal ilişkiyi sınırlar.",
    },
  },
  {
    id: "gears",
    name: "Redüksiyon ve diferansiyel",
    tag: "Mekanik aktarım",
    subtitle:
      "Motorun yüksek devrini tekerleklerin ihtiyaç duyduğu tork ve hıza uyarlar.",
    color: "#afadb8",
    basic: {
      title: "Hızı düşür, tekerlek torkunu artır",
      description:
        "Elektrik motoru geniş bir devir aralığında çalışır; tekerlekler ise yol hızına ve çekiş ihtiyacına uygun daha düşük hızlarda döner. Redüksiyon oranı bu uyumu sağlar.",
      points: [
        "İdeal durumda hız redüksiyon oranıyla azalırken tekerlek torku yaklaşık aynı oranla artar.",
        "Diferansiyel virajda iç ve dış tekerleklerin farklı hızlarda dönmesini sağlar.",
        "Birçok elektrikli otomobilde tek oranlı redüksiyon bulunur; bu, klasik çok vitesli şanzımandan daha basittir.",
      ],
    },
    advanced: {
      title: "Aktarma oranı ve çekiş sınırı",
      description:
        "Dişli oranı, motorun verimli çalışma bölgelerini araç hızına eşler. Tekerlek kuvveti yalnızca motor torkuyla değil; toplam oran, verim, lastik yarıçapı, yol-tutuş ve aks yük transferiyle belirlenir.",
      points: [
        "Yaklaşık olarak F_tekerlek = T_motor·i·η/r bağıntısı kullanılır; i oran, η aktarım verimi ve r etkin yarıçaptır.",
        "Açık diferansiyel torku düşük tutuşlu tekerlekle sınırlayabilir; elektronik çekiş kontrolü bu davranışı yönetir.",
        "Dişli gürültüsü, yağlama, yatak kayıpları ve termal dayanım; tek oranlı sistemlerde bile tasarım kısıtlarıdır.",
      ],
    },
    stats: [
      { label: "Tipik çözüm", value: "Tek oran" },
      { label: "Görev", value: "Devir ↓ / tork ↑" },
      { label: "Viraj", value: "Diferansiyel" },
    ],
    question: {
      text: "Diferansiyel neden gereklidir?",
      options: [
        "Virajda tekerleklerin farklı hızlarda dönmesini sağlamak",
        "Batarya hücrelerini dengelemek",
        "AC akımı DC'ye çevirmek",
      ],
      answer: 0,
      explanation:
        "Virajda dış tekerlek daha uzun yol alır. Diferansiyel, aks üzerindeki iki tekerleğin birbirine göre farklı hızlarda dönebilmesini sağlar.",
    },
    advancedQuestion: {
      text: "Redüksiyon oranı artırılırsa, aynı motor torku ve verim varsayımında tekerlek kuvveti ile araç hızı için ne beklenir?",
      options: [
        "Tekerlek kuvveti artar, aynı motor devrindeki teorik araç hızı azalır",
        "Tekerlek kuvveti azalır, teorik araç hızı artar",
        "Hem kuvvet hem hız her koşulda aynı kalır",
      ],
      answer: 0,
      explanation:
        "Daha büyük oran torku ve dolayısıyla tekerlek kuvvetini artırır; karşılığında aynı motor devrinde tekerlek devri ve teorik araç hızı düşer.",
    },
  },
  {
    id: "charger",
    name: "Şarj cihazı (OBC)",
    tag: "AC şarj",
    subtitle:
      "Şebekeden gelen AC'yi bataryanın kabul edebileceği DC'ye dönüştürür.",
    color: "#9f9dd6",
    basic: {
      title: "Ev ve AC istasyonundan bataryaya",
      description:
        "On-board charger (OBC), araç içindeki AC-DC güç dönüştürücüsüdür. AC şarj bağlantısından aldığı enerjiyi kontrollü DC olarak yüksek gerilim bataryasına aktarır.",
      points: [
        "AC şarj gücü; faz sayısı, şebeke gerilimi, akım sınırı ve aracın OBC kapasitesiyle sınırlıdır.",
        "DC hızlı şarjda AC-DC dönüşümün büyük kısmı istasyonda yapılır; bataryaya kontrollü DC doğrudan gelir.",
        "Şarj protokolü, kilitleme, topraklama ve iletişim kontrolleri enerji aktarımından önce güvenliği doğrular.",
      ],
    },
    advanced: {
      title: "Güç faktörü, izolasyon ve şarj profili",
      description:
        "Modern OBC'ler güç faktörü düzeltme ve izole DC-DC kademeleri içerebilir. Şarj akımı, batarya gerilimi ve sıcaklık sınırlarına göre sabit akım/sabit gerilim benzeri bir profil ile yönetilir; protokol ayrıntıları standarda ve pazara göre değişir.",
      points: [
        "PFC, şebekeden çekilen akımın dalga biçimini iyileştirerek harmonikleri ve görünür gücü azaltmaya yardımcı olur.",
        "Şarj gücü sabit görünse bile batarya gerilimi yükseldikçe gereken akım, OBC ve paket limitleriyle yeniden hesaplanır.",
        "CCS, Type 2 ve diğer arayüzlerde fiziksel konnektör ile haberleşme/protokol katmanlarını ayrı düşünmek gerekir.",
      ],
    },
    stats: [
      { label: "Giriş", value: "AC" },
      { label: "Çıkış", value: "DC" },
      { label: "Ev tipi örnek", value: "11 kW" },
    ],
    question: {
      text: "AC şarjda AC-DC dönüşümünü temel olarak hangi parça yapar?",
      options: [
        "Araç içi şarj cihazı (OBC)",
        "Diferansiyel",
        "Lastik basınç sensörü",
      ],
      answer: 0,
      explanation:
        "AC şarjda OBC şebeke AC'sini bataryaya uygun DC'ye dönüştürür. DC hızlı şarjda bu dönüşümün ana kademesi şarj istasyonundadır.",
    },
    advancedQuestion: {
      text: "Bir araç 11 kW AC destekliyor ancak istasyon 22 kW verebiliyor. İdeal koşullarda araç neden yine de yaklaşık 11 kW ile sınırlanır?",
      options: [
        "Araç içi OBC'nin kabul edebileceği maksimum AC gücü 11 kW'tır",
        "İstasyonun yüksek gücü her zaman batarya gerilimini düşürür",
        "Diferansiyel AC gücünü mekanik güce çeviremez",
      ],
      answer: 0,
      explanation:
        "AC şarjda dönüşüm araçtaki OBC'de yapılır. İstasyon daha yüksek güç sunabilse bile OBC, faz/akım ve batarya güvenlik limitleri dahilindeki gücü talep eder.",
    },
  },
  {
    id: "dcdc",
    name: "DC-DC dönüştürücü",
    tag: "Yardımcı güç",
    subtitle:
      "Yüksek gerilim bataryasından 12 V sistem için uygun besleme üretir.",
    color: "#d697aa",
    basic: {
      title: "İki elektrik dünyasını bağlar",
      description:
        "Araçtaki aydınlatma, ekranlar, kontrol üniteleri ve kilitler genellikle 12 V mimaride çalışır. DC-DC dönüştürücü, yüksek gerilim paketinden bu yardımcı sistemi besler ve 12 V aküyü şarj eder.",
      points: [
        "İnverter gibi DC-AC değil, DC gerilim seviyeleri arasında dönüşüm yapar.",
        "Yüksek gerilim sistemi kapalıyken bazı 12 V işlevleri küçük yardımcı aküden çalışabilir.",
        "12 V akünün durumu, yüksek gerilim bataryası dolu olsa bile aracın açılmasını etkileyebilir.",
      ],
    },
    advanced: {
      title: "Regülasyon, izolasyon ve yük geçişleri",
      description:
        "HV-LV dönüştürücü, giriş gerilimi ve yardımcı yük değişse de çıkışını regüle eder. Tasarım; izolasyon gereksinimi, verim, anahtarlama gürültüsü, kısa devre davranışı ve yük atımı gibi geçici durumları kapsar.",
      points: [
        "Topolojiler araç mimarisine göre izole veya izolesiz olabilir; güvenlik ve paketleme kararı bunu belirler.",
        "Kontrol döngüsü kararlılığı, EMI filtreleri ve termal tasarım; nominal verim kadar önemlidir.",
        "DC-DC çıkışı, 12 V akü ve dağıtım ağıyla birlikte düşünülür; tüm yükü yalnızca dönüştürücünün anma gücüyle açıklamak eksik kalır.",
      ],
    },
    stats: [
      { label: "Giriş", value: "HV DC" },
      { label: "Çıkış", value: "12 V DC" },
      { label: "Besler", value: "LV yükler" },
    ],
    question: {
      text: "DC-DC dönüştürücünün araçtaki ana rolü nedir?",
      options: [
        "HV bataryadan 12 V yardımcı sistemi beslemek",
        "Mekanik tork üretmek",
        "Tekerlek hızlarını eşitlemek",
      ],
      answer: 0,
      explanation:
        "DC-DC dönüştürücü yüksek gerilim DC'yi 12 V sistemin ihtiyaç duyduğu seviyeye indirir ve uygun koşullarda yardımcı aküyü şarj eder.",
    },
    advancedQuestion: {
      text: "Yüksek gerilim bataryası dolu olduğu hâlde araç neden 12 V akü sorunu nedeniyle açılmayabilir?",
      options: [
        "Kontrol üniteleri, kontaktör kumandası ve başlatma sırası 12 V beslemeye ihtiyaç duyabilir",
        "Doluluk oranı yüksek batarya 12 V'u fiziksel olarak yok eder",
        "Redüksiyon dişlisi 12 V akünün şarj durumunu ölçer",
      ],
      answer: 0,
      explanation:
        "DC-DC dönüştürücü ve yüksek gerilim kontaktörleri devreye girmeden önce düşük gerilim kontrol ağı çalışmalıdır. 12 V besleme yetersizse yüksek gerilim paketi erişilebilir olmayabilir.",
    },
  },
  {
    id: "thermal",
    name: "Termal yönetim",
    tag: "Sıcaklık kontrolü",
    subtitle:
      "Batarya, motor ve güç elektroniğini güvenli sıcaklık aralığında tutar.",
    color: "#6f9ebc",
    basic: {
      title: "Sıcaklık performansı belirler",
      description:
        "Hücreler, motor ve inverter çalışırken ısı üretir. Soğutma ve gerektiğinde ısıtma sistemi, verimi, gücü, hızlı şarjı ve bileşen ömrünü koruyacak sıcaklık aralıklarını hedefler.",
      points: [
        "Soğuk batarya yüksek güç ve rejeneratif fren kabulünde sınırlanabilir.",
        "Aşırı sıcaklık yaşlanmayı hızlandırır ve güvenlik riskini artırabilir.",
        "Sıvı devreleri, plakalar, ısı eşanjörleri ve ısı pompası mimariye göre birlikte kullanılabilir.",
      ],
    },
    advanced: {
      title: "Isı akışı, gradyan ve kontrol",
      description:
        "Termal yönetim yalnızca ortalama sıcaklığı değil, hücreler ve modüller arasındaki sıcaklık farkını da sınırlar. Kontrolcü; sensörlerden gelen veriye göre pompa, fan, valf, kompresör ve ısıtıcıları enerji tüketimi ile performans arasında optimize eder.",
      points: [
        "Hücre içi üretim yaklaşık olarak I²R kayıpları, polarizasyon ve reaksiyon kinetiğiyle ilişkilidir; sürüş profili ısı yükünü değiştirir.",
        "Sıcaklık gradyanı dengesiz yaşlanma ve kullanılabilir kapasite kaybına yol açabilir.",
        "Soğutma sisteminin kendi elektrik tüketimi menzili etkiler; HVAC ve batarya devreleri bazı araçlarda ortak, bazılarında ayrı tasarlanır.",
      ],
    },
    stats: [
      { label: "Hedef", value: "Güvenli aralık" },
      { label: "Aktüatör", value: "Pompa / valf" },
      { label: "Risk", value: "Termal kaçak" },
    ],
    question: {
      text: "Soğuk bir batarya neden rejeneratif gücü sınırlayabilir?",
      options: [
        "Hücreler düşük sıcaklıkta yüksek şarj akımını güvenle kabul etmeyebilir",
        "Diferansiyel viraj alamaz",
        "Tekerlek çapı büyür",
      ],
      answer: 0,
      explanation:
        "Düşük sıcaklıkta hücre içi süreçler yavaşlar; yüksek şarj akımı lityum kaplanması gibi hasar risklerini artırabilir. BMS bu nedenle gücü azaltabilir.",
    },
    advancedQuestion: {
      text: "İki batarya paketi aynı ortalama sıcaklığa sahipken biri neden daha düşük şarj gücü alabilir?",
      options: [
        "Hücreler arası sıcaklık gradyanı veya en soğuk hücrenin sınırı daha kısıtlayıcı olabilir",
        "Ortalama sıcaklık aynıysa bütün hücrelerin gerilimi kesinlikle aynıdır",
        "Şarj gücü yalnızca aracın dış hava sıcaklığıyla belirlenir",
      ],
      answer: 0,
      explanation:
        "Güvenlik limiti çoğu zaman en sıcak/en soğuk hücre gibi kritik noktaya göre belirlenir. Ortalama değer, hücreler arası gradyanı ve yerel sınırları gizleyebilir.",
    },
  },
  {
    id: "bms",
    name: "Batarya yönetim sistemi (BMS)",
    tag: "Ölçüm ve güvenlik",
    subtitle:
      "Hücreleri izler, sınırları hesaplar ve batarya için güvenli çalışma alanı oluşturur.",
    color: "#58aa81",
    basic: {
      title: "Bataryanın koruyucusu ve ölçümcüsü",
      description:
        "BMS hücre gerilimlerini, akımı ve sıcaklıkları izler. Şarj ve deşarj için güvenli sınırlar hesaplar; kontaktörler, dengeleme devreleri ve araç kontrolcüleriyle birlikte çalışır.",
      points: [
        "SOC kalan şarj tahmini, SOH ise kapasite ve performans yaşlanması hakkında bir göstergedir.",
        "Hücre dengeleme, seri hücreler arasındaki gerilim farklarını yönetmeye yardımcı olur.",
        "Aşırı gerilim, düşük gerilim, aşırı akım, izolasyon veya sıcaklık hatalarında güç kısıtlanabilir.",
      ],
    },
    advanced: {
      title: "Kestirim, limitler ve fonksiyonel güvenlik",
      description:
        "BMS ham sensör verisini filtreleyerek SOC, SOH ve izin verilen şarj/deşarj gücünü kestirir. Bu kararlar hücre modeli, sıcaklık, yaşlanma, ölçüm belirsizliği ve hata teşhisiyle birlikte ele alınır; tek bir voltaj eşiği bataryanın tüm durumunu açıklamaz.",
      points: [
        "SOC kestiriminde coulomb counting, OCV düzeltmesi ve eşdeğer devre/Kalman filtreleri gibi yöntemler birlikte kullanılabilir.",
        "Pasif dengeleme enerjiyi dirençte ısıya dönüştürür; aktif dengeleme daha karmaşık ama daha verimli güç aktarımı sağlayabilir.",
        "BMS ile inverter, şarj cihazı ve araç kontrolcüsü arasındaki mesajların geçerlilik, zaman aşımı ve güvenli durum davranışı doğrulanmalıdır.",
      ],
    },
    stats: [
      { label: "İzlenen", value: "V / A / °C" },
      { label: "Kestirim", value: "SOC / SOH" },
      { label: "Koruma", value: "Kontaktörler" },
    ],
    question: {
      text: "BMS'nin görevlerinden biri hangisidir?",
      options: [
        "Hücreleri izleyip güvenli şarj/deşarj limitleri belirlemek",
        "Lastik desenini üretmek",
        "Dişli oranını fiziksel olarak değiştirmek",
      ],
      answer: 0,
      explanation:
        "BMS gerilim, akım ve sıcaklık ölçümlerini kullanarak bataryanın güvenli çalışma alanını belirler ve koruma/iletişim işlevlerini yürütür.",
    },
    advancedQuestion: {
      text: "Coulomb counting ile tahmin edilen SOC neden uzun süre sonra tek başına güvenilmez hâle gelebilir?",
      options: [
        "Akım sensörü ofseti zamanla birikir; hücre modeli veya OCV gibi düzeltmeler gerekir",
        "SOC yalnızca motor devriyle ölçülür ve akımın hiçbir etkisi yoktur",
        "Coulomb counting batarya sıcaklığını otomatik olarak sabit tutar",
      ],
      answer: 0,
      explanation:
        "SOC, akımın zamana göre integraliyle izlenirken küçük sensör hataları birikir. BMS bu sürüklenmeyi gerilim, sıcaklık ve hücre modeli tabanlı düzeltmelerle azaltır.",
    },
  },
];

export const curriculum = [
  {
    title: "1. Enerjiden tekerleğe",
    description:
      "Elektronların enerji akışını izleyerek batarya, inverter, motor ve mekanik aktarımın birlikte nasıl hareket ürettiğini öğren.",
    partIds: ["battery", "inverter", "motor", "gears"],
  },
  {
    title: "2. Şarj ve yardımcı sistemler",
    description:
      "AC ve DC şarjın farkını, OBC'nin rolünü ve yüksek gerilimden 12 V araç elektroniğine geçişi kavra.",
    partIds: ["charger", "dcdc"],
  },
  {
    title: "3. Bataryayı yaşatmak",
    description:
      "Sıcaklığın, hücre sınırlarının ve BMS kararlarının performans, ömür ve güvenlik üzerindeki etkisini incele.",
    partIds: ["thermal", "bms", "battery"],
  },
  {
    title: "4. Sistem mühendisi bakışı",
    description:
      "Bileşenleri tek tek ezberlemek yerine güç, kontrol, haberleşme, termal yönetim ve güvenlik sınırlarını bir sistem olarak bağla.",
    partIds: [
      "battery",
      "inverter",
      "motor",
      "gears",
      "charger",
      "dcdc",
      "thermal",
      "bms",
    ],
  },
];
