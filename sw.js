
const cacheName = "fluent-shell:/fluentdlg/:v2-assets/index-a7A22DX7.js,assets/index-k1hZMDda.css,assets/learning-CoBZNPdu.js,assets/lessons-C-u-Q_oM.js,assets/music-CsMaoJZX.js,assets/word-check-B1V9sdrn.js";
const staticPaths = ["/fluentdlg/index.html","/fluentdlg/manifest.webmanifest","/fluentdlg/fluent.svg","/fluentdlg/icon-192.png","/fluentdlg/icon-512.png","/fluentdlg/assets/index-a7A22DX7.js","/fluentdlg/assets/index-k1hZMDda.css","/fluentdlg/assets/learning-CoBZNPdu.js","/fluentdlg/assets/lessons-C-u-Q_oM.js","/fluentdlg/assets/music-CsMaoJZX.js","/fluentdlg/assets/word-check-B1V9sdrn.js"];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) =>
    cache.addAll(staticPaths.map((path) => new Request(path, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((names) => Promise.all(
    names.filter((name) => name.startsWith("fluent-shell:/fluentdlg/:") && name !== cacheName)
      .map((name) => caches.delete(name))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (event.request.headers.has('Authorization')) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request, { cache: 'no-cache' }).catch(async (error) => {
      const shell = await caches.open(cacheName).then((cache) => cache.match(staticPaths[0]));
      if (shell) return shell;
      throw error;
    }));
  } else if (staticPaths.includes(url.pathname)) {
    event.respondWith(caches.open(cacheName).then((cache) => cache.match(url.pathname))
      .then((asset) => asset || fetch(event.request)));
  }
});
