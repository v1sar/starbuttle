var CACHE_NAME = 'star-buttle-cache-v1';

var urlsToCache = [
	'/index.html',
	
	'/js/main.js',
	'/js/router.js',
	'/js/lib/require.js',
    '/js/lib/underscore.js',
    '/js/lib/backbone.js',
    '/js/lib/jquery.js',
	'/js/tmpl/scoreboard.js',
	'/js/tmpl/sign-in.js',
	'/js/tmpl/sign-up.js',

	'/css/main.css',
	'/css/bootstrap.css',

	'/fonts/',

	'/images/404.jpg'
];

self.addEventListener('install', function(event) {
	event.waitUntil(
	    caches.open(CACHE_NAME)
	      	.then(function(cache) {
	      		cache.addAll(urlsToCache);
	      		console.log('Service worker is installed!');
	    	})
	); // waitUntil
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		fetch(event.request)
			.then(function(fetchResponse) {			// Затянули с сервера - положили в кэш
   				caches.open(CACHE_NAME)
   					.then(function(cache) {
      					if (fetchResponse !== undefined) {
      						cache.put(event.request, fetchResponse.clone());
      						console.log('Request was putted in the ' + CACHE_NAME, event.request.url);
      					}
    				});

    			return fetchResponse;
  			})
  			.catch(function() {
    			return caches.match(event.request);	// Если нет соединения - берем из кэша
  			})
  			/* TODO
  			.catch(function() {						// Если нет в кэше, но нет и связи с сервером
    			return caches.match('/images/404.jpg');
  			})
  			*/
    );	// respondWith
});

self.addEventListener('activate', function(event) {
  	var cacheWhitelist = [CACHE_NAME];

  	event.waitUntil(
  	   	caches.keys()
    		.then(function(cacheNames) {
      			return Promise.all(
        			cacheNames.map(function(cacheName) {
          				if (cacheWhitelist.indexOf(cacheName) === -1) {
            				return caches.delete(cacheName);
          				}
        			})
        		);
      		})
	);	// waitUntil
});
