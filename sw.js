
const cacheName = "fluent-shell:/fluentdlg/:v2-assets/index-CAsUQt0i.js,assets/index-D-HbevZV.css,assets/learning-hyZXl3Mg.js,assets/lessons-C5_DWhqF.js,assets/music-Cnfe_Pml.js,assets/word-check-DWgjpafC.js";
const staticPaths = ["/fluentdlg/index.html","/fluentdlg/manifest.webmanifest","/fluentdlg/fluent.svg","/fluentdlg/icon-192.png","/fluentdlg/icon-512.png","/fluentdlg/assets/index-CAsUQt0i.js","/fluentdlg/assets/index-D-HbevZV.css","/fluentdlg/assets/learning-hyZXl3Mg.js","/fluentdlg/assets/lessons-C5_DWhqF.js","/fluentdlg/assets/music-Cnfe_Pml.js","/fluentdlg/assets/word-check-DWgjpafC.js"];
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
