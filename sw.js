/* Service worker - Mon agenda
   Pour publier une mise à jour : change le numéro de VERSION ci-dessous. */
const VERSION = 'v27';
const CACHE = 'agenda-' + VERSION;
const FONTS = 'agenda-fonts';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './style.css',
  './style-late.css',
  './app-core1.js',
  './app-core2.js',
  './app-day.js',
  './app-icons.js',
  './app-week-home.js',
  './app-day2.js',
  './app-extras.js',
  './app-vault.js',
  './app-photos.js',
  './img-act-aq.webp',
  './img-act-fx.webp',
  './img-act-mx.webp',
  './img-act-px.webp',
  './img-act-sx.webp',
  './img-act-tm.webp',
  './img-act-tp.webp',
  './img-act-wx.webp',
  './img-act-yx.webp',
  './img-bl.webp',
  './img-crystal.webp',
  './img-dt-arr.webp',
  './img-dt-cat.webp',
  './img-dt-dep.webp',
  './img-dt-family.webp',
  './img-dt-other.webp',
  './img-el.webp',
  './img-header.webp',
  './img-hero.webp',
  './img-mk.png',
  './img-plank.webp',
  './img-tramp.webp',
  './img-wa.webp',
  './img-wx0.webp',
  './img-wx1.webp',
  './img-wx2.webp',
  './img-wx3.webp',
  './img-wx4.webp',
  './img-wx5.webp',
  './img-wx6.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== FONTS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Polices Google : on garde en cache pour le hors ligne
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(FONTS).then((cache) =>
        cache.match(req).then((hit) => {
          const net = fetch(req).then((res) => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }).catch(() => hit);
          return hit || net;
        })
      )
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Page : réseau d'abord (pour voir les mises à jour), cache si hors ligne
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('./index.html', copy));
        return res;
      }).catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // Le reste : cache d'abord
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});
