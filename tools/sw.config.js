importScripts('https://unpkg.com/workbox-sw@0.0.2/build/importScripts/workbox-sw.dev.v0.0.2.js')
const workboxSW = new WorkboxSW({clientsClaim: true})
workboxSW.precache([])
workboxSW.router.registerRoute(
  /.*cms\.integreat-app\.de.*/,
  workboxSW.strategies.staleWhileRevalidate({
    cacheableResponse: {statuses: [0, 200]}
  })
)
