/* Service worker van de BTC-clubsite.
   Altijd eerst het netwerk: leden zien steeds de nieuwste versie. De cache dient enkel als
   reserve zonder verbinding. Oproepen naar de database (Supabase) worden nooit gecachet. */
const CACHE = "btc-padel-v1";
self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(r, { cache: "no-cache" }).then((res) => {
      if (res.ok) { const kopie = res.clone(); caches.open(CACHE).then((c) => c.put(r, kopie)); }
      return res;
    }).catch(() => caches.match(r).then((hit) => hit || (r.mode === "navigate"
      ? new Response("<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width'><body style='font:16px system-ui;padding:24px;background:#152B46;color:#F3F1E9'><h1 style='color:#C5E75A'>Geen verbinding</h1><p>De BTC-padelapp heeft internet nodig. Probeer opnieuw zodra je verbonden bent.</p>", { headers: { "Content-Type": "text/html; charset=utf-8" } })
      : Response.error())))
  );
});
