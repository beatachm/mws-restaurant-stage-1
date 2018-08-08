// Based on a blog post:
// https://css-tricks.com/serviceworker-for-offline/
const cacheName = 'restaurant_reviews';
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                var networked = fetch(event.request)
                    .then(response => {
                        var clondedResponse = response.clone();
                        caches.open(cacheName)
                            .then(cache => {
                                cache.put(event.request, clondedResponse)
                            });
                        console.log(`${event.request.url} cached`);
                        return response;
                    })
                    .catch(() => (new Response('<h1>Service Unavailable</h1>', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/html'
                        })
                    })));
                return cached || networked;
            })
    );
});
console.log('Cache Service Worker started');