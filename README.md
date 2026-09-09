# Partwise

**Learn how things work.** Parçaları keşfederek bütünü anlamayı hedefleyen eğitim platformu.
İlk çalışan konu **EV Lab** (eski adı EV Atlas). Diğer konular henüz uygulanmadı.

Ana proje: `/Users/burak/Repository/Projects/DevBD1/partwise`.
Eski Codex çalışma yolu aynı klasöre sembolik bağlantıdır; ikinci bir proje kopyası değildir.
Marka/alan adı uygunluğu henüz araştırılmadı; ad tescil edilmiş gibi sunulmaz.

- [Uzun vadeli görsel ve platform planı](docs/ROADMAP.md)
- [İlk araştırma görevi ve kaynak adayları](docs/RESEARCH-BRIEF.md)
- [Ürün kimliği ve mimari yön](docs/PRODUCT.md)

Mevcut `ev-atlas` localStorage anahtarı bilerek korunur; isim değişikliği ilerlemeyi sıfırlamaz.

EV Atlas, elektrikli bir otomobilin bataryadan tekerleğe enerji ve hareket
yolunu keşfederek öğrenmek için hazırlanmış, Türkçe bir yerel web uygulamasıdır.
Başlangıç ve ileri seviye içerikleri aynı parçayı paylaşır; açıklama, denklem,
görev ve bilgi kontrolü seviyeye göre değişir.

Uygulama, **2018 Tesla Model 3 Long Range RWD'yi referans bağlam** olarak kullanır.
Tesla tarafından hazırlanmış, onaylanmış veya gerçek aracın dijital ikizi değildir.
Geometri özgün, düşük detaylı ve öğretim amaçlıdır; ölçeksiz parçalarla işlev,
bağlantı ve hareket ilişkisini görünür kılar.

## Çalıştırma

```sh
npm install
npm run dev -- --port 5173
```

Ardından <http://127.0.0.1:5173/> adresini açın. Üretim derlemesi ve testler:

```sh
npm test
npm run build
```

## Vercel'e dağıtım

Proje kök dizini Vercel'e import edildiğinde `vercel.json` aşağıdaki ayarları
otomatik olarak kullanır:

- Framework: Vite
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variable: gerekmez

Vercel panelinden Git reposunu bağlamak veya yerel CLI ile denemek yeterlidir:

```sh
npx vercel
npx vercel --prod
```

`.vercelignore`, geliştirme testlerini ve web bundle'ına dahil olmayan araştırma
belgelerini deployment payload'ından çıkarır.

WebGL başlatılamayan bir cihazda veya metin modunu özellikle denemek için:

<http://127.0.0.1:5173/?renderer=off>

Bu modda 3D sahne yerine parça açıklamaları, öğrenme rotası ve sayısal deneyler
kullanılabilir kalır. Hesap, backend, API anahtarı veya ağ servisi gerekmez.

## Uygulama akışı

- İlk açılışta **Başlangıç** veya **İleri seviye** seçilir.
- Rehberli giriş; bataryayı seçme, DC akışını gösterme, motoru çalıştırma ve
  tekerleği inceleme adımlarından oluşur.
- Serbest keşifte sistemler ve alt parçalar aranabilir; parça seçilebilir,
  gizlenebilir, izole edilebilir, odaklanabilir veya üst seviyeye dönülebilir.
- Montaj görünümü bağlantıları korur. Envanter görünümü parçaları ayrı hücrelere
  dağıtır. “Parçaları ayır” görsel bir açıklama animasyonudur; servis söküm sırası
  değildir.
- Model sürüklenerek döndürülür, tekerlekle yakınlaşıp uzaklaşılır. Perspektif,
  üstten, yandan ve görünümü sıfırlama kontrolleri bulunur. `/` aramayı açar;
  `Escape` açık paneli kapatır.
- Öğrenme ilerlemesi `localStorage` içindeki `ev-atlas` kaydında, başlangıç ve
  ileri seviye için ayrı tutulur. Eski prototipteki kayıtlar silinmez ancak yeni
  görevler otomatik tamamlanmış sayılmaz.

## Model kapsamı

Sahnede sekiz ana sistem ve yirmi anlamlı alt parça bulunur:

| Sistem | Alt parçalar |
| --- | --- |
| Batarya | Alt muhafaza, kapak, modüller, hücreler, bara bağlantıları, kontaktör grubu |
| Motor | Stator, rotor, mil, muhafaza |
| İnverter | Güç anahtarları, DC-link kondansatörü, soğutucu, kontrol kartı |
| Mekanik aktarım | Giriş pinyonu, redüksiyon dişlisi, diferansiyel gövdesi, diferansiyel iç dişlileri, yarım akslar, tekerlekler |
| Şarj cihazı (OBC) | Sistem düzeyinde gösterilir |
| DC-DC dönüştürücü | Sistem düzeyinde gösterilir |
| Termal yönetim | Sistem düzeyinde gösterilir |
| BMS | Sistem düzeyinde gösterilir |

Her kayıt; Türkçe/İngilizce ad, arama takma adları, üst parça, sistem, kaynak
bağlantıları ve ayrı geometri/bilgi doğruluk notu taşır. “Temsili”, “referansa
dayalı sadeleştirme”, “belgelenmiş”, “hesaplanmış” ve “varsayılmış” etiketleri
birbirine karıştırılmaz.

## Çalışan deneyler

Detay panelindeki dört mekanizma, görüntü kodundan ayrı saf hesap fonksiyonları
olarak uygulanır. Ekrandaki değerler açıkça öğretim amaçlı örnek parametrelerdir;
Tesla paket veya kontrol kalibrasyonu değildir.

1. **Batarya:** seri/paralel hücrelerden gerilim, kapasite, enerji, akım ve ideal
   süre; `V = Ns × Vhücre`, `Ah = Np × Ahhücre`, `t = Ekullanılabilir / P`.
2. **Motor:** tork ve devirden açısal hız ve mekanik güç; `P = T × ω`.
3. **İnverter:** ideal üç fazlı sinüzoidal ortalama gösterimi; `Vfaz,tepe =
   m × VDC / 2`. Çizim, gerçek PWM anahtarlama darbeleri değildir.
4. **Aktarım:** redüksiyon oranı, çıkış torku/deviri ve açık diferansiyelde sol/sağ
   tekerlek hız farkı; kayıplar ve lastik tutuşu idealleştirilmiştir.

Batarya, motor, inverter ve aktarım animasyonları yavaşlatılmış şematik
gösterimlerdir. Üretici yazılımı, termal kalibrasyon, yol tutuşu, rejeneratif
frenleme, gerçek güç sınırları veya tam araç dinamiği simüle edilmez. Azaltılmış
hareket tercihi algılanır; bu durumda sayısal sonuçlar ve sabit durum korunur.

## Öğrenme rotası

Sekiz bölüm, önerilen haftada iki bölüm ve bölüm başına 3 × 25 dakikalık tempoyla
sunulur:

1. Enerji ve güç akışı
2. Batarya paketi
3. İnverter
4. Elektrik motoru
5. Redüksiyon ve diferansiyel
6. Şarj ve yardımcı güç
7. BMS
8. Termal yönetim ve sistem bütünleştirme

Bir bölüm, model üzerinde görevin ve seviyeye uygun bilgi kontrolünün ikisi de
tamamlandığında ilerlemeye yazılır. Serbest keşif kilitli değildir.

## Kod yapısı

- `main.js` — uygulama durumu, seçim, arama, seviyeler, görevler ve paneller.
- `shell.js`, `style.css` — masaüstü/mobil arayüz ve erişilebilir metin düzeni.
- `atlas.js`, `content.js` — sistem/parça hiyerarşisi, kaynaklar, sözlük ve dersler.
- `geometry.js` — özgün parametrik düşük detaylı araç geometrisi ve parça kimlikleri.
- `scene.js`, `scene-layout.js`, `scene-motion.js` — Three.js sahnesi, kamera,
  seçim, görünürlük, montaj/envanter yerleşimi ve hareket.
- `physics.js` — test edilebilir batarya, motor, inverter ve aktarım hesapları.
- `progress.js` — sürümlü ve seviyeye göre ayrılmış localStorage ilerlemesi.
- `*.test.js` — veri bütünlüğü, fizik sınırları, ilerleme, geometri yerleşimi ve
  entegrasyon kontrolleri.

## Kaynaklar ve sınırlar

Kaynaklar işlev ve servis bağlamını destekler; hiçbir kaynak bu eğitimsel
geometriyi OEM CAD, gizli devre şeması veya üretim kalibrasyonu hâline getirmez.

- [Tesla Model 3 Service Portal](https://service.tesla.com/en-US/vehicle-models/Model3)
- [Tesla Model 3 Service Manual — 2017 index](https://service.tesla.com/docs/Model3/ServiceManual/index-model-3-2017.html)
- [Tesla Model 3 Service Manual — English index](https://service.tesla.com/docs/Model3/ServiceManual/en-us/)
- [U.S. DOE AFDC — How Do All-Electric Cars Work?](https://afdc.energy.gov/vehicles/how-do-all-electric-cars-work)
- [Human Atlas](https://github.com/ashemag/human-atlas) yalnızca keşif etkileşimi
  için tasarım referansıdır. Kaynak kodu veya anatomik 3D varlıklar kopyalanmamıştır.

Bu proje bağımsız bir eğitim prototipidir; Tesla onayı veya servis talimatı
iddiası taşımaz. Yüksek gerilimli araç sistemlerine müdahale yalnızca uygun
eğitim, ekipman ve yetkilendirmeyle yapılmalıdır.
