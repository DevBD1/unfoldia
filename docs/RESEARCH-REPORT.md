# P0 Araştırma Raporu: 2018 Tesla Model 3 Arka Tahrik Ünitesi ve 3D Varlık Değerlendirmesi

**Durum:** Tamamlandı  
**Tarih:** 2026-09-08  
**İlgili Belgeler:**  
- [RESEARCH-BRIEF.md](RESEARCH-BRIEF.md) — İlk araştırma iş paketi ve soruları  
- [assets/candidates.csv](assets/candidates.csv) — Lisans, varyant ve teknik uygunluk aday defteri  
- [ROADMAP.md](ROADMAP.md) — Görsel üretim ve platform yol haritası  

---

## 1. Yönetici Özeti ve Karar

Bu araştırma, **2018 Tesla Model 3 Long Range RWD** arka tahrik ünitesinin (Rear Drive Unit - 3DU: Motor, İnverter, Mekanik Aktarım) iç düzenini teknik teardown kayıtlarıyla doğrulamış; kamuya açık 3D model kataloglarını lisans, varyant ve geometri ayrımı açısından taramıştır.

### Temel Bulgular:
1. **İç Düzen Doğrulaması:** WeberAuto (Prof. John D. Kelly), All EV Canada ve Ingineerix teardown kayıtlarıyla aktarım dişli sayıları (**31/81/24/83** -> **9.036:1** redüksiyon oranı), IPM-SynRM rotor yapısı (çift-V daimi mıknatıs boşlukları), inverter bileşenleri (**24 SiC MOSFET**, 6 gate driver, DSP kontrol kartı) ve açık konik diferansiyel mekanizması saniye ve parça bazında kanıtlanmıştır.
2. **Hazır Dağıtılabilir Geometri Durumu:** Web'de iç mekanizmaları ayrılmış, 2018 Model 3 arka tahrik ünitesini temsil eden ve web üzerinde yeniden dağıtıma (open redistribution) izin veren **hiçbir hazır 3D model bulunmamaktadır**. Mevcut modeller ya telifli/vetolu dış taramalardır (GrabCAD TOS §5 veya CC-NC) ya da yanlış varyant/araçtır (Model S LDU veya Ön Asenkron SDU).
3. **Hibrit vs. Özgün Üretim:** Taranmış dış gövde üzerine özgün iç mekanizma ekleme ("hibrit") yaklaşımı, 100% özgün üretimden **daha pahalı, daha riskli ve görsel olarak tutarsızdır**. 750k–1.7M poligonluk gürültülü tarama kabuklarını temizlemek ve iç mekanik toleransları boolean ile açmak 12–18 saat sürerken, baştan temiz teknik kesitli düşük poligonlu (<30 bin üçgen) bir tahrik ünitesini Blender'da üretmek 15–20 saat sürmektedir ve telif riski sıfırdır.
4. **Tavsiye Edilen Yol:** **100% Özgün Blender Üretimi (Clean-Room CAD/Low-Poly)**. Diferansiyel iç dişlileri ve PCB detayları için CC0 kamu malı donörlerden (`blendswap-14602`, `blendswap-9975`) faydalanılabilir; ana gövde, IPM-SynRM motor ve SiC inverter özgün teknik üretim olarak modellenmelidir.

---

## 2. Soruların Ayrıntılı Yanıtları

### Soru 1: 2018 Model 3 LR RWD arka tahrik ünitesinin görünür iç düzeni hangi kaynaklarla doğrulanabilir?

İç düzen, akademik teardown videoları, tersine mühendislik raporları ve parça kataloglarıyla doğrulanmıştır:

#### A. WeberAuto (Weber State University - Prof. John D. Kelly)
- **Video:** *Tesla Model 3 and Y Modular Motors*  
  **URL:** `https://www.youtube.com/watch?v=SRUrB7ruh-8` (Süre: 27:56)  
  - `03:00 (180s)` — **1. Kademe Dişliler:** Motor giriş mili pinyonu (**31 Diş**) ve ara mil (countershaft) büyük dişlisi (**81 Diş**). Dişli oranı: $81 / 31 = 2.6129:1$.
  - `04:30 (270s)` — **2. Kademe Dişliler:** Ara mil küçük pinyonu (**24 Diş**) ve diferansiyel ayna dişlisi (ring gear) (**83 Diş**). Dişli oranı: $83 / 24 = 3.4583:1$.  
    *Toplam Redüksiyon Oranı:* $\frac{81}{31} \times \frac{83}{24} = \frac{6723}{744} \approx 9.03629:1$ (Model 3 resmi 9.036:1 / 9.04:1 oranıyla tam uyumlu).
  - `08:16 (496s)` — Modüler tahrik ünitesi gövde dökümü, stator ve rotorun montaj yuvaları, kuru motor hacmi ile ıslak dişli kutusu ayrımı.
  - `10:38 (638s)` — İnverter ve statorun "eşlenik takım" (matched set) olması; 3 faz bara terminallerinin gövde içi sızdırmaz geçişleri.
  - `14:06 (846s)` — İnverter güç dönüşümü; STMicroelectronics SiC MOSFET paketleri, pin-fin sıvı soğutma plakası.
  - `20:47 (1247s)` — Yağlama ve yardımcı parçalar: Değişken hızlı elektrikli yağ pompası, vidalı yağ filtresi, ATF-glikol ısı eşanjörü ve aks keçeleri.
  - `21:21 (1281s)` — Tahrik ünitesinin arka alt şaside yere paralel (yatay) konumu.

#### B. All EV Canada (Steele Auto Group)
- **Video:** *Tesla Model 3 Motor Tear Down - ALL EV*  
  **URL:** `https://www.youtube.com/watch?v=oVge8I6kxPY` (Süre: 14:53)  
  - `01:58 - 03:33` — Sıvı soğutma hortumları, HV DC kabloları ve inverter soğutucu manifoldu sökümü.
  - `04:56` — İnverterin motor gövdesinden ayrılması, DC bara bağlantıları.
  - `06:08 - 07:28` — Motor kapağının açılması, IPM-SynRM rotorun statordan çıkarılması; rotor saç paketindeki gömülü kalıcı mıknatıs yuvaları ve içi boş rotor mili.
  - `07:48 - 08:54` — Dişli kutusunun ikiye ayrılması (split-case), ara yatak plakasının sökümü.
  - `09:25` — 2 kademeli dişli grubunun (giriş pinyonu, ara mil, ayna dişlisi) yataktan çıkarılması.
  - `10:15` — İnverter DSP kontrol kartı, gate driver katmanı ve SiC güç anahtarları.
  - `11:39` — Açık konik diferansiyelin içi: diferansiyel kafesi, istavroz mili, 2 adet konik pinyon dişli (spider gears), 2 adet aks yan dişlisi (side gears).
  - `12:10 - 12:19` — Entegre elektrikli yağ pompası ve dişli yağ filtresi sökümü.

#### C. Ingineerix Teardown İncelemeleri
- **Video:** *Tesla Model 3 Drive Inverter*  
  **URL:** `https://www.youtube.com/watch?v=l6dV2re3rtM` (Süre: 2:53)  
  - İnverter güç kartı tam parça listesi (BOM):
    - **24 × SiC MOSFET:** STMicroelectronics STGK026 (her anahtar için paralel 4 adet, 3 fazlı köprüde toplam 6 anahtar).
    - **6 × İzole Gate Driver:** STMicroelectronics STGAP1AS.
    - **Ana DSP/MCU:** Texas Instruments TMS320F28377DPTPQ (Dual-core C2000 Delfino 32-bit floating-point).
    - **Resolver Sinyal Yükseltici:** ON Semiconductor TCA0372BDW.
    - **HV Algılama:** Broadcom ACPL-C87BT-000E.
    - **Güç Yönetimi:** Infineon TLF35584 PMIC ve TDK DC-DC trafosu.
  - Pin-fin sıvı soğutma bloğu ve 400V DC-link film kondansatör yerleşimi.
- **Video:** *First Look: Tesla Model 3 Drive Unit*  
  **URL:** `https://www.youtube.com/watch?v=m4eQ7nN_Lwo`  
  - Sıvı ve karter dahil toplam ünite ağırlığı: ~90 kg (198 lbs).

#### D. Munro & Associates & Tesla Servis Portalı
- **Munro Teardown Raporu (2018):** Rotor laminasyonunda çift-V akı bariyerleri (reluctance flux barriers), neodimyum mıknatıs segmentleri ve SiC verim analizi.
- **Tesla Service Portal & Manual:** (`https://service.tesla.com/docs/Model3/ServiceManual/en-us/`)  
  Bölüm 17 (Rear Drive Unit) servis bağlantıları, yüksek gerilim izolasyonu, şasi kulakları ve aks bağlantı arayüzlerini doğrular; ancak iç CAD sağlamaz (Tesla ünitesi sahada açılmaz, komple LRU olarak değiştirilir).

---

### Soru 2: Web'de yeniden dağıtılabilen, iç parçaları ayrılmış geometri var mı?

**HAYIR.** Yapılan detaylı tarama sonucunda aşağıdaki durum tespit edilmiştir:

| Aday Kaynağı | Bulunan Varlık | Lisans | İç Detay | Karar |
| :--- | :--- | :--- | :--- | :--- |
| **Sketchfab** (`alexsmith99`) | Tesla Model 3 Rear Drive Unit | CC-BY-NC 4.0 | %0 (Sadece dış kabuk taraması, 753k yüzey) | **Reddedildi** (NC ticari/geniş dağıtım kısıtı + iç mekanizma yok) |
| **Sketchfab** (`altrous`) | Tesla Front Small Drive Unit | CC-BY 4.0 | %0 (1.7M poligon dış tarama) | **Reddedildi** (Yanlış varyant: Ön asenkron motor; iç parça yok) |
| **Sketchfab** (`altrous`) | Tesla Model S Drive Unit | CC-BY 4.0 | %0 (2.18M poligon katı model) | **Reddedildi** (Yanlış araç: Model S LDU asenkron; iç parça yok) |
| **GrabCAD** (`Paul Baque`) | Tesla Model 3 Rear Drive Unit | GrabCAD TOS | %0 (Dış tarama STL/STEP) | **Reddedildi** (GrabCAD TOS §5 web dağıtımını yasaklar; iç parça yok) |
| **GrabCAD** (`oliver`) | Model 3 Tesla Motor | GrabCAD TOS | %0 (Dış tarama STL) | **Reddedildi** (GrabCAD TOS §5 dağıtım yasağı; iç parça yok) |
| **Blend Swap** (`16346`) | Electric motor | CC-BY 3.0 | %50 (Endüstriyel asenkron) | **Reddedildi** (Yanlış teknoloji: sincap kafesli klasik motor) |
| **Blend Swap** (`14602`) | Differential Gear | CC0 1.0 | %100 (Diferansiyel iç dişlileri) | **Kabul (Donör)** (CC0 kamu malı; diferansiyel içi için kullanılabilir) |
| **Blend Swap** (`9975`) | Printed Circuit Board | CC0 1.0 | %60 (SMD elektronik parçalar) | **Kabul (Donör)** (CC0; inverter kartı detaylandırması için uygun) |
| **GitHub** (`damienmaguire`) | Model 3 Logic Board CAD | GPL-3.0 | %100 (PCB sınırları ve delikler) | **Referans** (Telif bulaşmaması için CAD kopyalanmaz, ölçü alınır) |

*Tüm detaylar [docs/assets/candidates.csv](assets/candidates.csv) dosyasına işlenmiştir.*

---

### Soru 3: Hazır dış gövde + özgün iç mekanizma yaklaşımı tamamen özgün üretimden ucuz mu?

**HAYIR, ucuz değildir; aksine daha maliyetli ve risklidir.**

1. **Topoloji ve Ağır Temizlik Yükü:**  
   İnternetteki mevcut dış gövde taramaları 750.000 ile 1.700.000 üçgen arasındadır. Bu modeller fotogrametri gürültüsü, açık delikler, hatalı yüzey normalleri ve sıfır et kalınlığına sahip "non-manifold" yüzeyler içerir. WebGL performans bütçesi (≤30.000 üçgen) için bu kabukları retopolojiye sokmak, shrinkwrap uygulamak ve normal map çıkarmak **8–12 saat** sürer.
2. **İç Hacim ve Mekanik Çakışma:**  
   Dış taramaların iç geometrisi boştur veya tarama kalıntılarıyla doludur. İçine elle çizilecek 81 dişli ara mili, 83 dişli diferansiyeli ve inverter soğutma bloğunu yerleştirmeye çalışırken taranmış gövdenin iç duvar kalınlıkları ile mekanik parçalar çakışır. Boole işlemleri (boolean cut) taranmış kirli ağlarda çöker.
3. **Lisans Riski:**  
   Kullanılacak en iyi dış kabuk GrabCAD (dağıtım yasak) veya Sketchfab CC-BY-NC (gayri-ticari kısıt) kaynaklıdır. Projeye telif şüphesi taşır.
4. **Özgün Blender Üretiminin Üstünlüğü:**  
   Doğrulanmış fotoğraflar ve teknik ölçüler üzerinden Blender'da düşük poligonlu, et kalınlığı bilinen, montaj/kesit eksenleri ayrılmış özgün bir gövde modellemek **4–6 saat** sürer. Toplam tahrik ünitesi (gövde + iç mekanizma) 15–20 saatte tamamlanır; 100% temiz telif hakkı ve mükemmel WebGL performansı sağlar.

---

### Soru 4: Motor/inverter/aktarım için eksik geometri ve eksik teknik bilgi nedir?

Mevcut prototipteki `geometry.js` temel Three.js primitifleri (kutu/silindir) kullanmaktadır. Gerçek parçalarla arasındaki boşluk haritası:

| Parça Kimliği (`partId`) | Mevcut Geometri (`geometry.js`) | Gerçekte Olan / Eksik Geometri | Eksik Teknik Bilgi / Çözüm Kaynağı |
| :--- | :--- | :--- | :--- |
| `motor-housing` | Düz silindir (`CylinderGeometry`) | Döküm alüminyum gövde, montaj kulakları, soğutma ceketi federleri, arka rulman kapağı, dişli kutusu birleşim flanşı | WeberAuto 08:16; All EV 06:08 |
| `motor-stator` | İnce içi boş silindir | 54 slotlu laminasyon saç paketi, bakır sargı başları (end windings), invertere çıkan 3 faz terminal barası | WeberAuto 10:38; Stator slot sayısı ve bakır yalıtım verniği rengi |
| `motor-rotor` | Düz dolu silindir | IPM-SynRM rotor laminasyon paketi, çift-V şeklinde gömülü neodimyum mıknatıs yuvaları, balans delikleri, içi boş soğutma kanallı mil | All EV 06:41; Munro IPM lamination şeması |
| `motor-shaft` | Düz uzun çubuk | Dişli tarafında 31 diş helisel giriş pinyonu, karşı uçta 36 dişli resolver hedef çarkı, rulman faturaları | WeberAuto 03:00; All EV 07:28 |
| `inverter-heatsink` | Düz plaka | Alüminyum pin-fin sıvı soğutma bloğu, glikol giriş/çıkış rekorları, montaj kuleleri | Ingineerix Inverter Teardown; All EV 03:33 |
| `inverter-switches` | İnce kutu | 24 adet STMicroelectronics SiC MOSFET güç modülü (6 anahtar × 4 paralel), kalın bakır bara köprüleri | Ingineerix BOM; All EV 10:15 |
| `inverter-capacitor` | Tek silindir/kutu | TDK/EPCOS dikdörtgen DC-link film kondansatör bloğu, entegre lamine DC bara terminalleri | Ingineerix; WeberAuto 14:06 |
| `inverter-board` | Düz yeşil plaka | TI C2000 DSP MCU, 6 adet ST izole gate driver entegresi, resolver sinyal katı, soket konnektörleri | Damien Maguire KiCad şeması; Ingineerix BOM |
| `gears-pinion` | Küçük silindir | Helisel kesim 31 dişli motor çıkış pinyonu, mil ile yekpare yapı | WeberAuto 03:00 diş sayısı kanıtı (81/31) |
| `gears-reduction` | Düz disk | İki kademeli ara mil (countershaft): 81 diş helisel büyük dişli + 24 diş helisel çıkış pinyonu, konik makaralı rulmanlar | WeberAuto 03:00 ve 04:30 diş sayıları (81T ve 24T) |
| `gears-case` | Prizmatik kutu | İkiye bölünen döküm alüminyum karter (split case), rulman yatak yuvaları, yağ toplama havuzu, yağ pompası yuvası | All EV 07:48 - 08:54 |
| `gears-internals` | Soyut iç blok | 83 diş helisel ayna dişlisi, diferansiyel kafesi, istavroz mili, 2 adet konik pinyon (spider), 2 adet aks yan dişlisi | WeberAuto 04:30 (83T); All EV 11:39; BlendSwap 14602 donör |
| `gears-axles` | İki tarafa uzanan tek çubuk | Sol ve sağ bağımsız CV yarım akslar, iç mafsal (tripot) yuvaları, körükler, dış porya frezeleri | All EV 00:14; Tesla Service Manual |
| `gears-wheels` | Basit silindirler | Fren diski, kaliper, 5 bijonlu porya flanşı, jant ve lastik kesiti | Mevcut parametrik geometri korunabilir |

---

## 3. Uygulanabilir Yollar ve Değerlendirme

### Yol 1: 100% Özgün Blender Üretimi (Tavsiye Edilen / Birincil Yol)
- **Açıklama:** Teardown referansları (WeberAuto, All EV, Ingineerix) ve Tesla servis şemaları baz alınarak tahrik ünitesinin (gövde, motor, inverter, dişliler) sıfırdan Blender'da low-to-mid poly teknik model olarak üretilmesi.
- **Geometri Kalitesi:** Mükemmel. WebGL için optimize topoloji (20k–30k üçgen), temiz UV'ler ve malzeme ayrımları (Döküm Alüminyum, Bakır Sargı, Silikon Karbür, PCB, Çelik Dişli).
- **Lisans Durumu:** 100% temiz ve Partwise mülkiyetinde. İstenen açık lisansla (MIT/CC-BY/Apache 2.0) dağıtılabilir.
- **Entegrasyon Maliyeti:** Düşük. Three.js `geometry.js` içindeki parça kimlikleri ve rotasyon eksenleriyle birebir eşleşen node hiyerarşisi ilk günden doğru kurulur.
- **Tahmini Süre:** 15–20 çalışma saati.

### Yol 2: Hibrit Donör Yaklaşımı (İkincil Destekleyici Yol)
- **Açıklama:** Ana gövde, motor statoru ve rotoru sıfırdan modellenir; diferansiyel iç dişlileri CC0 lisanslı `blendswap-14602` modelinden, inverter elektronik komponentleri ise CC0 lisanslı `blendswap-9975` modelinden aktarılır.
- **Geometri Kalitesi:** İyi. Donör parçaların poligon sayısı düşürülmeli ve 83 dişli Tesla diferansiyel geometrisine uyarlanmalıdır.
- **Lisans Durumu:** Temiz (CC0 kamu malı kullanımı telif ihlali yaratmaz).
- **Entegrasyon Maliyeti:** Orta. Donör parçaların ölçek, pivot ve normallerinin uyarlanması 4–6 saat ek işçilik gerektirir.
- **Tahmini Süre:** 12–16 çalışma saati.

### Yol 3: Dış Tarama İndirme ve İçi Boşaltma (Dışlanan Yol)
- **Açıklama:** GrabCAD veya Sketchfab'deki taranmış dış gövdeyi indirip retopoloji yapmak.
- **Dışlanma Gerekçesi:** Lisans vetosu (GrabCAD dağıtılamaz, Sketchfab NC kısıtlı), aşırı poligon temizleme yükü (1.7M poligon) ve iç mekanizma yerleşiminde fiziksel çakışmalar.

---

## 4. Pilot Üretim Brifi (Blender Teknik Şartnamesi)

P1 (Sanat Yönetimi) ve P2 (Tahrik Ünitesi Pilotu) aşamalarına temel teşkil edecek Blender üretim standartları:

### A. Sahne ve Koordinat Standartları
- **Birim:** Metre (Blender varsayılan unit scale = 1.0).
- **Eksenler:** $+Y$ Yukarı (Up), $+Z$ İleri (Forward), $+X$ Sağ (Right) — Three.js ve glTF standart koordinat sistemi.
- **Orijin ve Pivotlar:**
  - `motor-shaft` ve `motor-rotor`: Pivot tam olarak motor mili dönme ekseni merkezinde.
  - `gears-reduction`: Pivot, ara mil (countershaft) dönüş ekseninde.
  - `gears-internals`: Pivot, diferansiyel ayna dişlisi ve aks merkez ekseninde.
  - `inverter-*`: İnverter montaj taban düzleminde.

### B. Düğüm (Node) ve Parça Kimliği Hiyerarşisi
Export edilen GLB dosyası doğrudan aşağıdaki nesne adlarını taşımalıdır:
```text
DriveUnit_Root
├── Housing_Group
│   ├── motor-housing
│   ├── gears-case
│   └── gears-case-cover (ayrılabilir / gizlenebilir kesit kapağı)
├── Motor_Group
│   ├── motor-stator (sabit)
│   ├── motor-rotor (hareketli - rotor mili ile döner)
│   └── motor-shaft (hareketli)
├── Inverter_Group
│   ├── inverter-heatsink (soğutucu blok)
│   ├── inverter-switches (24 SiC MOSFET)
│   ├── inverter-capacitor (DC-link film kondansatör)
│   └── inverter-board (kontrol ve sürücü kartı)
└── Transmission_Group
    ├── gears-pinion (31 Diş, motor miliyle döner)
    ├── gears-reduction (81 Diş + 24 Diş ara mil grubu)
    ├── gears-internals (83 Diş ayna dişli + konik diferansiyel grubu)
    ├── gears-axles (sol ve sağ aks milleri)
    └── gears-wheels (tekerlek porya bağlantıları)
```

### C. Kesit ve Eğitim Görünürlüğü Kuralı
- Gövde (`motor-housing` ve `gears-case`) tam kapalı bir kutu olarak değil, üst ve yan yüzeyinde kontrollü bir **eğitim kesit penceresi** (cutaway window) veya çıkarılabilir/yarı-saydam bir kapak nesnesi ile tasarlanmalıdır.
- Sahnede "Çalıştır" dendiğinde; statorun içinde rotorun dönüşü, pinyonun ara mili çevirmesi ve diferansiyel kafesinin dönüşü dışarıdan engelsiz görülmelidir.

### D. Performans ve Export Profili
- **Hedef Poligon Bütçesi:** Tüm tahrik ünitesi için $\le 30.000$ üçgen (triangles).
- **Malzeme (Material) Bütçesi:** En fazla 5 paylaşılan PBR materyal:
  1. `Mat_CastAluminum` (Gövde ve karter için mat pürüzlü alüminyum)
  2. `Mat_Copper` (Stator sargıları ve inverter baraları için parlak bakır)
  3. `Mat_SteelGear` (Helisel dişliler ve miller için işlenmiş çelik)
  4. `Mat_PCB_FR4` (İnverter kontrol kartı için koyu yeşil devre kartı)
  5. `Mat_SiliconCarbide` (SiC güç paketleri ve kondansatör gövdesi için siyah teknik plastik)
- **glTF Doğrulama:** `glTF-Validator` ile 0 hata, 0 uyarı ile geçmeli; tüm transformlar `Apply Transform` yapılmış olmalıdır.

---

## 5. Çıkarılan Sonuç ve Bir Sonraki Adım

P0 aşaması başarıyla tamamlanmıştır:
1. Kaynaklar ve zaman kodları kanıtlanmış, uydurma veri kullanılmamıştır.
2. Web varlıklarının durumu CSV formatında belgelenmiş, lisans vetoları netleştirilmiştir.
3. Hibrit modelleme reddedilmiş, 100% özgün Blender modelleme kararı gerekçelendirilmiştir.
4. Pilot üretim için gerekli geometrik hiyerarşi ve teknik sınırlar belirlenmiştir.

**Sıradaki Aşama (P1 — Sanat Yönetimi & P2 Pilotu):**
Kullanıcı onayına istinaden; malzeme renk paleti, teknik kesit açısı ve sabit kamera açıları belirlenerek Blender üzerinde P2 tahrik ünitesi pilot üretimine geçilebilir.
