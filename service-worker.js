// 更新后改成v2、v3，每次上线都+1
const CACHE_NAME = "flyingchess-cache-v2";
const APP_SHELL = [
  "./",
  "./SP-FlyingChess-config.json",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/special-wing.png",
  "./css/style.css",
  "./data/default.json",
  "./index.html",
  "./js/app.js",
  "./js/board.js",
  "./js/body.js",
  "./js/editor.js",
  "./js/game.js",
  "./js/players.js",
  "./js/punish.js",
  "./js/renderer.js",
  "./js/reward.js",
  "./js/special.js",
  "./js/state.js",
  "./js/storage.js",
  "./js/trap.js",
  "./js/utils.js",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
