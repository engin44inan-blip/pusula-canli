// Pusula servis çalışanı: uygulamanın bütün dosyalarını telefonda saklar, internet olmadan da açılmasını sağlar.
// Yeni sürüm yüklerken SURUM değerini değiştirin; telefon bir sonraki açılışta yeni dosyaları alır.
const SURUM = "5.0";
const UYGULAMA_ONBELLEGI = "pusula-uygulama-" + SURUM;
const MODEL_ONBELLEGI = "pusula-modeller-v1";   // index.html ile aynı ad olmalı

// Küçük uygulama dosyaları: kurulumda hemen indirilir
const KABUK = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "lib/ort.wasm.min.js",
  "lib/ort-wasm-simd-threaded.mjs",
  "yazitipi/atkinson-hyperlegible-latin-400-normal.woff2",
  "yazitipi/atkinson-hyperlegible-latin-700-normal.woff2",
  "yazitipi/atkinson-hyperlegible-latin-ext-400-normal.woff2",
  "yazitipi/atkinson-hyperlegible-latin-ext-700-normal.woff2",
  "simge/simge-192.png",
  "simge/simge-512.png",
  "simge/simge-maskable-512.png",
  "simge/apple-touch-icon.png"
];

// Büyük dosyalar (modeller, çalışma motoru): sayfa ilk kullanımda indirip MODEL_ONBELLEGI'ne koyar.
// Burada yalnızca güncel listede olmayan eski model dosyalarını silmek için tutulur.
const MODELLER = [
  "lib/ort-wasm-simd-threaded.wasm",
  "modeller/nesne-yolo11n-320.onnx",
  "modeller/derinlik-v2s-q8.onnx"
];

const tam = (yol) => new URL(yol, self.registration.scope).href;

self.addEventListener("install", (olay) => {
  olay.waitUntil((async () => {
    const c = await caches.open(UYGULAMA_ONBELLEGI);
    // cache: "reload" → tarayıcının eski kopyasını değil, sunucudaki güncel dosyayı al
    await c.addAll(KABUK.map((yol) => new Request(tam(yol), { cache: "reload" })));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (olay) => {
  olay.waitUntil((async () => {
    for (const ad of await caches.keys()) {
      if (ad !== UYGULAMA_ONBELLEGI && ad !== MODEL_ONBELLEGI && ad.startsWith("pusula-")) await caches.delete(ad);
    }
    // Artık kullanılmayan eski model dosyalarını sil (yer kaplamasın)
    const mc = await caches.open(MODEL_ONBELLEGI);
    const gecerli = new Set(MODELLER.map(tam));
    for (const istek of await mc.keys()) { if (!gecerli.has(istek.url)) await mc.delete(istek); }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (olay) => {
  const istek = olay.request;
  if (istek.method !== "GET") return;
  const url = new URL(istek.url);
  if (url.origin !== self.location.origin) return;
  olay.respondWith((async () => {
    // Önce telefondaki kayıt (sorgu dizesi yok sayılır), yoksa ağ
    const kayitli = await caches.match(istek, { ignoreSearch: true });
    if (kayitli) return kayitli;
    // Sayfa açılışı: ağ yoksa kayıtlı ana sayfayı göster
    if (istek.mode === "navigate") {
      try { return await fetch(istek); }
      catch (e) { return (await caches.match(tam("index.html"))) || Response.error(); }
    }
    const yanit = await fetch(istek);
    if (yanit.ok) {
      const buyuk = MODELLER.some((y) => tam(y) === url.origin + url.pathname);
      const c = await caches.open(buyuk ? MODEL_ONBELLEGI : UYGULAMA_ONBELLEGI);
      c.put(istek, yanit.clone()).catch(() => {});
    }
    return yanit;
  })());
});
