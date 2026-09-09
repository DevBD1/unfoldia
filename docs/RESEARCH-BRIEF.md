# P0 — İlk araştırma işi

Durum: **tamamlandı** (2026-09-08). Araştırma bulguları ve teknik doğrulama raporu: [RESEARCH-REPORT.md](RESEARCH-REPORT.md). Aday defteri ve lisans kayıtları: [assets/candidates.csv](assets/candidates.csv).

## Sorular

1. 2018 Model 3 LR RWD arka tahrik ünitesinin görünür iç düzeni hangi kaynaklarla doğrulanabilir?
2. Web'de yeniden dağıtılabilen, iç parçaları ayrılmış geometri var mı?
3. Hazır dış gövde + özgün iç mekanizma yaklaşımı tamamen özgün üretimden ucuz mu?
4. Motor/inverter/aktarım için eksik geometri ve eksik teknik bilgi nedir?

## Araştırılacak hatlar

- [Tesla servis portalı](https://service.tesla.com/en-US/vehicle-models/Model3): sistem/varlık varyantı. Portal erişimi CAD yeniden dağıtım izni değildir.
- [DOE bileşen açıklaması](https://afdc.energy.gov/vehicles/how-do-all-electric-cars-work): temel işlevler; Model 3 ölçüleri için kanıt değil.
- Weber State / WeberAuto teardown içerikleri: doğru video, parça ve zaman kodu araştırılacak; ekran görüntüsü ve varlık lisansı ayrıca incelenecek.
- Sketchfab, Blend Swap ve Wikimedia Commons: açık lisanslı aday taraması; her varlığın lisansı ayrı doğrulanacak.
- GrabCAD ve ticari model katalogları: keşif hattı; halka açık dosyalar varsayılan olarak dağıtılabilir kabul edilmez. Satın alma yapılmaz.
- [Human Atlas](https://github.com/ashemag/human-atlas): etkileşim ve görsel keşif karşılaştırması, EV geometrisi kaynağı değil.
- [Blender glTF export belgeleri](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html) ve [glTF Validator](https://github.com/KhronosGroup/glTF-Validator): üretim hattı doğrulaması.

## Teslim biçimi

`docs/assets/candidates.csv` veya eşdeğer okunaklı tablo:

`id, title, author, url, checkedAt, license, licenseEvidenceUrl, webRedistribution,
attribution, variant, interiorCoverage, separateNodes, format, bytes, repairWork, decision`

Her aday için geometri kalitesi, teknik uyum, lisans ve entegrasyon maliyeti ayrı puanlanır.
Lisans veto kriteridir; diğer puanlarla telafi edilmez. Bilinmeyen alanlar boş/unknown kalır.
Kaynak kanıtı olmadan sayısal oran veya ölçü uydurulmaz.

Sonuç: en iyi 2–3 uygulanabilir yol, dışlananların kısa gerekçesi, parça bazlı eksik listesi
ve bir pilot üretim önerisi. Uygun hazır varlık yoksa sonuç başarısız araştırma sayılmaz:
kanıtlı Blender üretim brifi araştırmanın geçerli çıktısıdır.
