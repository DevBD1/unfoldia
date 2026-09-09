# Unfoldia — Görsel üretim ve platform yol haritası

## Güncel platform yönü

Ana yön [Unfoldia ürün vizyonudur](PRODUCT.md): küresel, çok dilli ve toplulukla
gelişen açık kaynaklı etkileşimli öğrenme. EV ve Calculus mevcut konulardır;
dersler bugün Türkçedir. Öncelik sırası: yeni platform kimliği ve vizyonu,
açık kaynak katkı katmanı, ardından kaynakları doğrulanmış ders çevirileri ve
yeni konu dilimleri. Aşağıdaki görsel üretim planı bu yönün EV odaklı alt planıdır.

Durum: plan. Tarih: 2026-09-08. Bu dosya gelecek işleri tarif eder; model araştırması,
Blender üretimi veya çok konulu platform tamamlanmış değildir.

## Hedef

EV Lab'i tanınabilir, teknik kaynaklarla ilişkilendirilmiş ve iç işleyişi gerçekten
görülebilen bir öğrenme deneyimine dönüştürmek. Ardından aynı yöntemi başka konulara
taşıyabilen Unfoldia platformunu kurmak. Gerçekçi geometri ile doğrulanmış fizik ayrı hedeflerdir.

Bugünkü güçlü taraf: parça hiyerarşisi, iki seviye, ders/görev/quiz, deneyler, seçim,
çalışma görünümü ve kaynak etiketleri. Zayıf taraf: primitive ağırlıklı geometri,
benzer malzemeler, doğrulanmamış oranlar, zayıf iç düzen ve görsel anlatım.
İlk adım polygon sayısını artırmak değil, doğru görsel referans ve sanat yönetimidir.

## Sıra ve karar kapıları

| Aşama | Çıktı | Tamamlanma koşulu |
| --- | --- | --- |
| P0 — Kaynak/varlık araştırması | Lisans ve varyant kanıtlı aday defteri, boşluk haritası | Hazır / hibrit / özgün üretim kararı gerekçeli |
| P1 — Görsel yön | Aynı kamerada 2 alternatif: teknik kesit ve sade gerçekçi model | Kullanıcı bir yönü seçer; görünüş kadar mekanizma okunabilirliği de değerlendirilir |
| P2 — Tahrik ünitesi pilotu | Motor + inverter + aktarım, düzenlenebilir kaynak ve GLB | Montaj, çalışma kesiti ve envanter tek örnekte başarılı |
| P3 — Varlık altyapısı | Yükleyici, manifest, kimlik eşlemesi, kalite kontrolleri | Yeni geometri dersleri ve kayıtları bozmadan değiştirilebilir |
| P4 — EV kapsamını tamamlama | Batarya, termal/şarj/BMS, gövde/şasi | 28 inceleme hedefi korunur; kaynak boşlukları etiketli |
| P5 — Öğrenme ve performans | Kullanıcı denemesi, mobil ölçüm, görsel regresyon | Hedef cihazlarda belirlenen bütçeler ölçümle doğrulanır |
| P6 — İkinci konu | Konu kataloğu ve bağımsız konu paketi | EV'ye özgü kabuller ortak motordan çıkarılır |

P0→P1→P2 bağımlıdır. Araştırma sırasında altyapı gereksinimleri not edilebilir, fakat
pilot görsel yön onaylanmadan bütün aracı veya platformu yeniden yazmaya başlanmaz.
Takvim tahmini P0 sonrası yapılır; model bulma ve elle üretim süreleri aynı değildir.

## P0 — Araştırma

[Araştırma brifi](RESEARCH-BRIEF.md) ilk iş paketidir. İki hattı ayrı yürüt:
teknik doğruluk için servis/teardown/akademik kaynak; dağıtılabilir geometri için
lisanslı modeller. Birincisi ikincisinin yeniden dağıtım hakkını vermez.

Referans 2018 Model 3 Long Range RWD kalır. Farklı varyanttan varlık ancak farkları
belirtilip uyarlama kapsamı çıkarılarak aday olur; sessizce kullanılmaz.
İlk araştırmayı 6–10 güçlü aday veya iki odaklı araştırma oturumuyla sınırla.
Kritik iç parçalar için uygun lisanslı aday yoksa özgün Blender üretimine geç.
Bulunamayan şeyi bulunmuş, portal bağlantısını parça ölçüsü kanıtı sayma.

## P1 — Sanat yönetimi

Silüet ve oranları gösteren referans panosu; metal, bakır, yalıtkan ve devre kartı için
sınırlı malzeme paleti; okunaklı ışık ve arka plan; seçili parça ve bağlantı dili.
Human Atlas'tan hiyerarşi ve keşif yaklaşımı alınır, anatomik varlıkları veya marka
kimliği kopyalanmaz. Sabit kamerada mevcut/pilot karşılaştırması yapılır.
İç parçalar için kontrollü kesit, yarı saydamlık ve örtücü kapak gizleme ayrı değerlendirilir.
Sadece araç dışını güzelleştiren çözüm kabul edilmez.

## P2 — Blender üretimi gerekirse

İlk üretim: arka tahrik ünitesi. Hedef high-poly CAD değil; tanınabilir, kaynaklı,
orta detaylı ve öğretime uygun model. Blender kurulumu mevcut mu önce kontrol edilir;
bu plan otomatik yazılım kurulumu veya ücretli model satın alma yetkisi değildir.

1. Kaynak ölçüleri ve belirsizlikleri işaretleyerek blockout oluştur.
2. Stator/rotor/mil, inverter anahtar-kondansatör-soğutucu ve dişli/aks bağlantılarını ayrı nesneler yap.
3. Pivot, dönme ekseni, birim ve rest transform'larını kayıt altına al. İç içe geçmeleri düzelt.
4. Kapak ve gövdeleri ayrı tut; çalışma kesitinde iç hareket görünür olsun.
5. Malzeme, normal ve basit kenar yumuşatmayı ekle. Doku ayrıntısı en son gelir.
6. `.blend`, yeniden üretilebilir export tarifi ve GLB sakla. Blender script'i gerekiyorsa sürümle.
7. glTF doğrulayıcı, parça kimliği ve gerçek tarayıcı testleriyle kabul et.

AI görselleri moodboard için kullanılabilir; doğrulanmış geometri, ölçü veya mekanik
kanıt yerine geçmez. AI mesh çıktısı da aynı lisans, topoloji ve teknik kontrol kapılarından geçer.

## P3 — Entegrasyon sözleşmesi

Önerilen, henüz oluşturulmamış üretim düzeni:

```text
assets-source/ev/        düzenlenebilir üretim kaynakları
public/models/ev/       web için export edilmiş varlıklar
topics/ev/              parçalar, dersler, kaynaklar, deney adaptörleri
docs/assets/            aday defteri, kaynak/atıf ve doğruluk kayıtları
```

GLTFLoader ile lazy load, yükleme/hata/yeniden deneme ve mevcut temsili model fallback'i.
Manifest: `assetId`, sürüm, konu, lisans/atıf, kaynak, dosya hash'i, byte boyutu,
metre ölçeği, up axis, node→partId eşlemesi, pivotlar ve animasyon eksenleri.
Eksik/tekrarlı kimlik build veya veri doğrulamasında görünür hata olmalı.
Tek mesh'e birleştirip seçilebilirliği kaybetme. Draco/Meshopt/KTX2 seçimini decoder
maliyeti dahil ölç; hepsini refleks olarak ekleme. LOD ve instancing gerçek darboğaza göre.

## P4–P5 — Kapsam ve kabul

Pilot onaylandıktan sonra batarya (temsilî hücre sayısını gerçek paket iddiasından ayır),
yardımcı sistemler ve bağlam gövdesi sırayla yenilenir. Geçiş sırasında mevcut deneyler,
arama, x-ray seçim, ders ilerlemesi ve WebGL'siz öğrenme korunur.

Başlangıç performans bütçesi önerisi, ölçülmüş başarı değil: tek konu için ilk GLB
transferi ≤8 MB, görünür geometri ≤200 bin üçgen, draw call ≤200; sonra gerçek cihaz
profiliyle ayarlanır. Hedef test profili masaüstü + kullanıcı tarafından seçilmiş orta
sınıf telefon; mobil 30 FPS hedefi ancak cihazda ölçülünce raporlanır. İlk etkileşime
kadar yükleme süresi ağ profiliyle, GPU/texture bellek maliyeti ayrıca raporlanır.

Görsel kabul seti: üç sabit kamera × montaj/kesit/envanter; 390×844 ve 320×568.
Seçilen parça başka parçanın arkasındayken anlaşılır; çalıştırınca hareket görünür;
envanter çakışmaz; durdurma/geri dönüş tutarlıdır. Yeni başlayan birkaç kullanıcıyla
ilk görev gözlemlenir: nerede takılıyor, terimleri anlıyor mu, güç/enerji ilişkisini
açıklayabiliyor mu? Sayılar başarı kanıtı değil, araştırma tasarımıdır.

## P6 — Çok konulu platform

Pilot EV kalitesi onaylandıktan sonra kullanıcı ikinci konuyu seçer (ör. güneş enerjisi
sistemi, ısı pompası veya farklı bir alan). Henüz konu kararı verilmiş değildir.
Konu seçici, konu manifest'i, ayrı ders ilerlemesi ve ortak explorer API çıkarılır.
Yeni konu sadece EV dosyalarını kopyalayıp ad değiştirmekle üretilmez.
Hesap, backend, ücretlendirme, AI öğretmen ve yayınlama ayrı ürün kararlarıdır.

## Risk ve durma koşulları

- Lisans/redistribution belirsiz: aday entegrasyona alınmaz; alternatif/özgün üretim.
- Varyant veya ölçü belirsiz: temsili etiketi; yüzde yüz doğru simülasyon iddiası yok.
- Görsel pilot kullanıcı onayı alamadı: bütün araç üretimi durur; pilot düzeltilir.
- Mobil bütçe aşıldı: LOD/doku/materyal/ışık optimizasyonu; bilgi hedeflerini körlemesine silme.
- Yeni konu mevcut motoru aşırı karmaşıklaştırıyor: ikinci konu adaptörü üzerinden sınırları yeniden belirle.
- Satın alma, dışarıdan sanatçı işi, yayın veya marka tescili: ayrıca kullanıcı kararı gerekir.
