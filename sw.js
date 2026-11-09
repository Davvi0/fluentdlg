
const cacheName = "fluent-shell:/fluentdlg/:assets/index-Bsz7W_FK.css,assets/index-C8mVl6do.js,assets/learning-CEesYdHT.js,assets/lessons-DZ2Ri0y_.js,assets/music-Dhqeexkf.js,assets/word-check-DWgjpafC.js";
const staticPaths = ["/fluentdlg/index.html","/fluentdlg/manifest.webmanifest","/fluentdlg/fluent.svg","/fluentdlg/icon-192.png","/fluentdlg/icon-512.png","/fluentdlg/assets/index-Bsz7W_FK.css","/fluentdlg/assets/index-C8mVl6do.js","/fluentdlg/assets/learning-CEesYdHT.js","/fluentdlg/assets/lessons-DZ2Ri0y_.js","/fluentdlg/assets/music-Dhqeexkf.js","/fluentdlg/assets/word-check-DWgjpafC.js"];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) =>
    cache.addAll(staticPaths.map((path) => new Request(path, { cache: 'reload' })))));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((names) => Promise.all(
    names.filter((name) => name.startsWith("fluent-shell:/fluentdlg/:") && name !== cacheName)
      .map((name) => caches.delete(name))
  )));
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (event.request.headers.has('Authorization')) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(caches.open(cacheName).then((cache) => cache.match(staticPaths[0]))
      .then((shell) => shell || fetch(event.request)));
  } else if (staticPaths.includes(url.pathname)) {
    event.respondWith(caches.open(cacheName).then((cache) => cache.match(url.pathname))
      .then((asset) => asset || fetch(event.request)));
  }
});
