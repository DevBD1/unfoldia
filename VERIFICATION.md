# Yerel doğrulama — 2026-09-08

## Otomatik kontroller

- `npm test`: 38 test geçti. Fizik birimleri/sınır değerleri, görev ve quiz ayrımı, eski kayıt göçü, iki seviyenin bağımsızlığı, 28 kimliğin veri/geometri eşleşmesi, gerçek geometrinin envanterde çakışmaması, görünür sınırların kameraya sığması, motor ekseni ve mekanizma parametreleri kapsanıyor.
- `npm run build`: başarılı. JS 646,57 kB; gzip 174,96 kB. Vite 500 kB üzerindeki paket için uyarı veriyor; hata değil. Kod bölme henüz uygulanmadı.

## Bağlı tarayıcıda yapılan kontroller

- Masaüstü, 390×844 ve 320×568 boyutlarında model/temel kontroller gözle incelendi. Mobil envanter etiketleri kısaltılır; seçim tam adı ve açıklamayı açar. Gerçek telefon testi değildir.
- 24 envanter öğesi (20 alt parça + 4 yapraksız sistem) görünür. Rotor etiketine tıklama açıklama ve kamera odağını birlikte güncelledi.
- İzolasyondan dönüş, kamera sıfırlama, montaj/enventere geçiş ve ayrıştırma kontrolü denendi.
- Sürükleme seçili Rotor'u değiştirmedi. BMS araması doğru sistemi gösterdi.
- İleri seviyeye geçiş seçili Rotor'u korudu; yenilemeden sonra ileri seviye kaldı. Başlangıç ilerlemesi 1/8, ileri ilerlemesi 0/8 olarak ayrı kaldı.
- `?renderer=off` ile metin laboratuvarı açıldı. Motor devri sıfıra indirilince 0 kW ve 0 rad/s hesaplandı.
- Kaynaklar penceresi model kimliğini, kaynak kapsamlarını ve Tesla onayı olmadığını gösterdi.
- Önceki çalışma oturumunda rehberli dört adım, doğru/yanlış quiz geribildirimi ve bataryada sıfır yük kontrol edildi. Sekiz dersin tamamının iki seviyede tamamlanabilirliği otomatik entegrasyon testiyle kontrol edildi; bütün dersler kullanıcıyla denenmiş değildir.

## Ölçüm ve sınırlar

- Bu bağlı tarayıcıdaki bir birleşik sahne örneği: 7.210 üçgen, 141 çizim çağrısı, 2,80 ms CPU çizim gönderimi. Bu değer GPU süresi veya FPS değildir ve cihaz garantisi vermez.
- Aynı durağan sahnede `renderCount` iki ayrı okumada 8 olarak kaldı.
- Eski tarayıcı kayıtlarında kesilmiş geliştirme sunucusuna ait Vite WebSocket bağlantı hatası bulunuyordu. Sunucu yeniden başlatıldı; uygulama güncel dosyalarla yüklendi. Üretim dağıtımı yapılmadı.
- Azaltılmış hareket mantığı otomatik test edildi; işletim sistemi tercihi değiştirilerek cihaz testi yapılmadı.
- Geometri özgün ve temsili; kaynaklar bütün iç geometrileri veya deney parametrelerini doğrulamaz. Bu teslim OEM dijital ikizi, servis simülatörü ya da tam araç dinamiği modeli değildir.
