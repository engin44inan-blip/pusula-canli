# Pusula Canlı

Görme engelliler için deneme amaçlı yürüme yardımcısı. Telefon kamerasıyla önünüzdeki engelleri, çukurları ve aşağı inen basamakları sesli, titreşimli ve yön bipleriyle bildirir.

**Bastonun yerine kullanılmaz.** Deneme sürümüdür.

## Tamamen cihaz içinde çalışır

- Bütün yapay zekâ modelleri bu depodadır ve telefonda çalışır. Görüntü hiçbir sunucuya gönderilmez.
- İlk açılışta yaklaşık 60 MB indirilir ve telefona kaydedilir. Sonra uygulama internetsiz, uçak modunda bile çalışır.
- iPhone'da internetsiz kullanım için Safari'de "Paylaş" düğmesi, ardından "Ana Ekrana Ekle" ile kurun.

## Dosyalar

| Dosya | Ne işe yarar |
| --- | --- |
| `index.html` | Uygulamanın kendisi |
| `sw.js` | Dosyaları telefonda saklayıp internetsiz açılmayı sağlar |
| `manifest.webmanifest`, `simge/` | Ana ekrana ekleme bilgileri ve simgeler |
| `lib/` | ONNX Runtime Web 1.29.0, yapay zekâ çalışma motoru |
| `modeller/derinlik-v2s-q8.onnx` | Depth Anything V2 Small, 8 bite küçültülmüş derinlik modeli |
| `modeller/nesne-yolo11n-320.onnx` | YOLO11n nesne tanıma modeli (80 nesne türü) |
| `yazitipi/` | Atkinson Hyperlegible yazı tipi |

## Güncelleme

Yeni sürüm yüklerken `sw.js` içindeki `SURUM` değerini değiştirin. Bir model dosyası değişirse dosya adını da değiştirin (örneğin `-v2` ekleyin) ve hem `index.html` içindeki `DOSYALAR` listesini hem de `sw.js` içindeki `MODELLER` listesini güncelleyin.

## Lisanslar

| Parça | Lisans | Not |
| --- | --- | --- |
| ONNX Runtime Web | MIT | Ticari kullanıma uygun |
| Depth Anything V2 Small | Apache 2.0 | Ticari kullanıma uygun. ONNX dönüşümü: fabio-sim/Depth-Anything-ONNX |
| Atkinson Hyperlegible | SIL Open Font License 1.1 | `yazitipi/OFL.txt` |
| YOLO11n (Ultralytics) | **AGPL-3.0** | Deneme için uygundur. Ürün satışında ya Ultralytics'ten ticari lisans alınmalı ya da kendi eğitilmiş, uygun lisanslı bir modelle değiştirilmelidir. |
