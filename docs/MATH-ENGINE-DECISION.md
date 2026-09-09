# Matematik görselleştirme motoru — ilk karar

2026-09-08. Bu bir özellik/lisans ön değerlendirmesidir; üç motorla yapılmış performans benchmarkı değildir.

## Bu dilimin ihtiyacı

Sonlu ilişki → ok diyagramı + ayrık grafik + tablo; tek seçim; klavye/dokunma; ders olayları ve bağımsız matematik kontrolleri. Sembolik çözüm, dinamik geometri inşası veya kullanıcı formülü çalıştırma bu dilimde gerekli değil.

| Seçenek | Bu ders için değerlendirme | Sonraki rol |
| --- | --- | --- |
| D3 | Kurulu; özel ok diyagramı ve senkron vurguyu doğrudan kontrol edebiliyoruz. Matematik kurallarını sağlamaz; saf modelimiz sağlar. | Bu dilimde korundu. |
| JSXGraph | Resmi README geometri, fonksiyon çizimi, SVG/canvas ve çoklu dokunma desteği belirtiyor. MIT veya LGPL çift lisans. Aynı dersin ok diyagramını yine tasarlamak gerekir. | Sürüklenebilir nokta, sekant/teğet ve yakınlaştırma diliminde küçük bir adaptör prototipi için güçlü aday. Henüz kurulmadı/benchmark yapılmadı. |
| GeoGebra | Büyük matematik uygulaması kod tabanı; resmi depo ayrı lisans sayfasına yönlendiriyor. Kaynak kodu, gömülen uygulama ve içerik şartları tek lisans varsayılmamalı. | Gömme API, çevrimdışı kullanım, ticari dağıtım ve arayüz kontrolü ayrıca doğrulanmadan bağımlılık yapılmayacak. |

Karar: şimdilik D3; GeoGebra klonu geliştirmek yok. Tek bir model sözleşmesiyle görsel motor değiştirilebilir. `relation.js` model, `relation-view.js` çizim adaptörü, `sets-content.js` öğretim içeriği, `sets-app.js` ders akışıdır. İlerleme görsel motora bağlı değildir. Bu, henüz genel amaçlı CAS veya geometri motoru değildir.

## Okunan resmi kaynaklar

- https://github.com/jsxgraph/jsxgraph/blob/main/README.md — özellikler ve MIT/LGPL lisans seçimi doğrudan okundu.
- https://github.com/geogebra/geogebra/blob/main/README.md — uygulama yapısı ve lisans yönlendirmesi okundu.
- https://www.geogebra.org/license — erişildi; bu turda şartların tamamına ilişkin hukuki/ürün uygunluk incelemesi yapılmadı.
- D3: yerel npm bağımlılığı; ISC lisans bildirimi dağıtımda korunmalı.

Sonraki teknik değerlendirme: aynı sürüklenebilir sekant deneyi için D3/JSXGraph adaptörleri; klavye eşdeğeri, 320px okunabilirlik, temizleme, paket boyutu ve giriş gecikmesi ölçümü. Ardından kalıcı motor seçimi. Motor büyüklüğü öğretim içeriğinin yerini tutmaz.
