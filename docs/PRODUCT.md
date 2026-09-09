# Partwise

**Learn how things work.**

Parçaları, bağlantıları ve neden-sonuç ilişkilerini keşfederek öğrenme platformu.
Part + wise: parçaları anlamak yoluyla bilgi kazanmak. EV'ye bağlı değil; anatomi,
enerji sistemleri, makineler ve başka konulara genişlemeye uygun bir ürün adı.
İsim tercihi yapılmıştır; ticari marka, domain ve sosyal hesap uygunluğu doğrulanmamıştır.
Kamuya açılmadan önce ilgili pazarlarda benzer ad taraması yapılmalıdır.

## Ürün ailesi

- Platform: **Partwise**.
- Mevcut ilk konu: **EV Lab**. EV Atlas eski prototip adıdır.
- Yeniden kullanılabilir geliştirme yöntemi: **Explorable**, DevBD1 agent skill'i.
- İlerideki konu adları konu bazlı olur; her konu için yeni ana marka üretilmez.

## Görsel tavır

Sakin, editoryal ve teknik bir öğrenme aracı. Öncelik: tanınabilir silüet, anlamlı
malzeme ayrımı, iyi aydınlatılmış iç mekanizma ve okunabilir açıklamalar.
Ne rastgele primitive yığınları ne de eğitim içeriğini örten sinematik otomobil reklamı.
Mevcut yeşil arayüz bir başlangıçtır; nihai sanat yönetimi onayı değildir.
Logo bu teslimde basit yazı işaretidir; özgün marka tasarımı sonraki görsel aşamada ele alınır.

## Platforma dönüşüm

Bugünkü uygulama tek konulu ve Türkçedir. Çok konulu platform bitmiş gibi sunulmaz.
İkinci konu eklenirken ortak keşif motoru ile konu içeriği ayrılacak:

```text
platform shell / topic catalog
  explorer: selection, cameras, layout, highlight, accessible panels
  learning: route, tasks, quizzes, versioned progress
  topic package: metadata, parts, sources, lessons, assets, mechanism adapters
```

`topicId` + `partId` + `lessonId` kalıcı kimliklerdir. Three.js nesne adları bunların
yerine geçmez. Sayısal deneyler konu paketine aittir; fizik zorunlu olmayan konular
aynı denklemlere zorlanmaz. React, backend, hesap ve AI entegrasyonu varsayılan değildir.
İkinci konu, ortak motorun gerçekten yeniden kullanılabildiğinin testi olacaktır.

Eski `ev-atlas` kayıtları şimdilik aynen kullanılır. Konu bazlı kayıt yapısına geçişte
eski veri okunup EV konusuna taşınır, yeni görevler tamamlanmış sayılmaz; orijinal kayıt
başarılı göç doğrulanana kadar silinmez. `127.0.0.1:5173` origin'inin değişmesi tarayıcı
kayıt erişimini etkiler; klasör adının değişmesi etkilemez.
