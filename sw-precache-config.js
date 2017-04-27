module.exports = {
  staticFileGlobs: [
    '/index.html',
    '/manifest.json',
    '/bower_components/webcomponentsjs/webcomponents-loader.js'
  ],
  cacheId: "itembox-cache",
  navigateFallback: '/index.html',
  runtimeCaching: [{
    urlPattern: /^https:\/\/www.gstatic\.com\/firebasejs/,
    handler: 'networkFirst',
    options: {
      cache: {
        name: 'firebase-cache'
      }
    }
  },{
    urlPattern: /\/src/,
    handler: 'fastest',
    options: {
      cache: {
        name: 'src-cache'
      }
    }
  },{
    urlPattern: /\/img/,
    handler: 'fastest',
    options: {
      cache: {
        name: 'img-cache'
      }
    }
  }]
};