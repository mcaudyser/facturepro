const CACHE_NAME = "facturepro-v2";
const ASSETS = ["./","./index.html","./manifest.json","https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).then((res) => {
      if (!res || res.status !== 200) return res;
      const clone = res.clone();
      caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
      return res;
    }).catch(() => {
      if (e.request.mode === "navigate") return caches.match("./index.html");
    }))
  );
});
