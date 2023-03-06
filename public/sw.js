const cacheName = "v0"

const resources = [
    // "/index.html",
    // "/sw.js",
    // "/assets/index.js",
    // "/assets/index.css",
    "/favicon.svg",
    "/manifest.json",
    "/database.json",
    "/assets/fa-regular-400.ttf",
    "/assets/fa-v4compatibility.ttf",
    "/assets/fa-v4compatibility.woff2",
    "/assets/fa-brands-400.woff2",
    "/assets/fa-regular-400.woff2",
    "/assets/fa-solid-900.woff2",
    "/assets/fa-brands-400.ttf",
    "/assets/fa-solid-900.ttf",
    "/icon.svg",
    "/icon-bg.svg",
]

// on installation cache all resources
self.addEventListener("install", e => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        cache.addAll(resources)
      })
      .then(() => self.skipWaiting())
  )
})

// on activation delete all caches except the one in use
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            return caches.delete(cache)
          }
        })
      )
    })
  )
})

// respond to fetch requests with cached assets
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .catch(
        () => caches.match(e.request)
      )
    )
})
