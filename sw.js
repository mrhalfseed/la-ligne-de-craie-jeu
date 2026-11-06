/* Garde le jeu en mémoire sur le téléphone : la page est toujours reprise à jour si on a du réseau,
   les images et les sons sont gardés après le premier chargement (le jeu se relance vite, même hors connexion). */
const CACHE="ldc-v96";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(["./","index.html","manifest.webmanifest","img/accueil.jpg","son/musique-pavane.mp3"])))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(CACHE).then(c=>c.put("index.html",y));return x}).catch(()=>caches.match("index.html")));return}
  if(r.headers.get("range"))return; /* les sons lus par morceaux : laissés au navigateur */
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok||x.type==="opaque"){const y=x.clone();caches.open(CACHE).then(c=>c.put(r,y))}return x})))});
