const cacheName = "dunkers-files";
const assets = [
  "/",
  "index.html",
  "teams.html",
  "best.html",
  "team&players.html",
  "top-team.html",
  "css/style.css",
  "css/bootstrap.min.css",
  "js/bootstrap.bundle.js",
  "js/script.js",
];

self.addEventListener("install", (event) => {
  console.log("SW. Se instaló");
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(assets)));
});

self.addEventListener("activate", (event) => {
  console.log("SW. Se activó");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((respuesta) => {
      if (respuesta) {
        return respuesta;
      }
      let requestToCache = event.request.clone();

      return fetch(requestToCache).then((res) => {
        if (!res || res.status !== 200) {
          return res;
        }
        let respuestaCache = res.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(requestToCache, respuestaCache);
        });
        return res;
      });
    })
  );
});
