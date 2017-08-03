importScripts('/src/js/sw-lib.min.js');
const cdnCacheStrategy = goog.swlib.cacheFirst({cacheableResponse: {statuses: [0]}});
goog.swlib.router.registerRoute(new RegExp('^https://cdn.jsdelivr.net/lodash'), cdnCacheStrategy);
goog.swlib.router.registerRoute(new RegExp('^https://www.gstatic.com/firebasejs/3.7.2/firebase.js'), cdnCacheStrategy);
goog.swlib.router.registerRoute('/sw.js', goog.swlib.networkFirst());
goog.swlib.router.registerRoute('/', goog.swlib.staleWhileRevalidate());
goog.swlib.router.registerRoute('/index.html', goog.swlib.staleWhileRevalidate());
goog.swlib.router.registerRoute(new RegExp('.html|.css|.js'), goog.swlib.cacheFirst());