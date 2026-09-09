# Calculus Lab — ilk ders dilimi

## 2026-09-08 genişletme: kümeler ve fonksiyon koşulu

Varsayılan Calculus girişi artık dört adımlı küme/eşleştirme dersidir. Eski sayı makinesi `/?lab=calculus&lesson=machine` adresinde korunur. Yeni kayıt `partwise:calculus:sets-v1`; eski tamamlanma yeni dersi tamamlamaz.

Yeni modüller: `relation.js` saf ilişki denetimi; `relation-view.js` D3 ok diyagramı ve ayrık grafik adaptörü; `sets-content.js` açıklama/görev/soru verileri; `sets-app.js` akış ve kayıt. Tüm görünümler aynı ilişki ve girdi seçimini kullanır. Serbest ok çizme ve sürükleme henüz eklenmedi; üç kontrollü örnek seçilebilir.

Doğrulama: 49 otomatik test ve build geçti. Tarayıcıda dört görev ve doğru cevap akışı, ilk adım yanlış cevap açıklaması, sonrasında yenilemede 4/4 kaydının korunması görüldü. Test sırasında yeni ders bu tarayıcıda tamamlandı olarak kaydedildi; adımlar yeniden incelenebilir. Tarayıcı hata günlüğü boştu. Masaüstü görsel kontrolü yapıldı. Bu turda viewport aracı 320/390 talebine rağmen 1280 genişliği döndürdü; yeni dersin dar ekran görsel kabulü doğrulanmış sayılmıyor. CSS dar ekran yerleşimi ve deney/soru atlama bağlantıları mevcut. EV paket boyutu uyarısı sürüyor.

Motor ön değerlendirmesi: [MATH-ENGINE-DECISION.md](MATH-ENGINE-DECISION.md). Aşağıdaki notlar önceki ilk dilimin tarihsel kaydıdır.

Adres: `/?lab=calculus`. EV: `/?lab=ev` (varsayılan giriş korunur).

Sıfırdan başlayanlar için Pre-Calculus / Fonksiyonlar. Calculus I ve II görünür kapsam başlıklarıdır, hazır dersler değildir. Kitap eşleşmesi: Thomas–Finney 9. baskı, Ön Bilgiler §3. Kitabın metni veya soruları kopyalanmadı.

## Tekrar kullanım sınırları

- `calculus/graph.js`: D3/ISC tabanlı, domain + örnek noktalar + seçili nokta alan SVG grafik bileşeni. Ders bilgisi yok; `update` ve `destroy` yaşam döngüsü var. Animasyon döngüsü veya WebGL gerektirmez.
- `calculus/model.js`: saf fonksiyon hesapları, örnekleme, sürümlü kayıt doğrulama. Kullanıcı ifadeleri eval edilmez.
- `calculus/app.js`: ilk dersin rehberi ve etkileşim bağlantıları. İkinci ders gelince ortak form/geri bildirim yapıları gerçek ihtiyaç üzerinden ayrılacak; henüz genel amaçlı ders motoru iddiası yok.
- Ayrı, ders sürümlü kayıt anahtarı; deney + iki doğru kontrol tamamlanmadan bitmez. Depolama engelliyse oturum devam eder.

Sonraki dilimler: grafik okuma → fonksiyon dönüşümleri → önkoşul cebir/trigonometri kapsamı. Limit, türev ve integralde aynı grafik sözleşmesi üzerine sekant/teğet/alan katmanları eklenebilir. Mevcut sabit eksenler bu ilk dersin aralıkları içindir; genel yakınlaştırma veya sembolik cebir henüz yok.

Doğrulama: `npm test`, `npm run build`; masaüstü ve 390×844 / 320×568 görsel ve etkileşim kontrolü ayrıca kaydedilmeli. Gerçek telefon performansı ölçülmedi.

2026-09-08 doğrulama: 45 test geçti; üretim derlemesi geçti. Tarayıcıda kare kuralı / −2 → 4, 9 tahmini, Evet kontrolü ve yenileme sonrası tamamlanma kaydı doğrulandı. Masaüstü, 320×568 ve 390×844 görünümleri incelendi; dar ekrandaki küçük grafik etiketleri büyütüldü. Test sırasında bu tarayıcıda ilk ders tamamlandı olarak kaydedildi. EV büyük paket uyarısı sürüyor; Calculus ayrı dinamik paket olarak yükleniyor.
