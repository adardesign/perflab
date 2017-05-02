# perflab
web performance lab
# Notes:
- [x] Check performance implication (load event) of `install` phase (when used `skipWaiting` vs not using it)
- [x] `event.waitUntil` is simply keep service worker alive until what is passed is done. 
- [ ] `skipWaiting` ??
- [ ] `clients.claim` ??
- [ ] 
Results: There are some implication (http://www.webpagetest.org/result/170405_8B_1B36/ vs http://www.webpagetest.org/result/170405_46_1B6H/)
- [x] when a service worker is installed it applies to all pages, even those that doesn't have the service worker registration 
- [ ] Abilty to invalidate exsiting page
- [ ] Upadate current page with message.
- [ ] 

SW is downloaded - compared according to the expire headers is set, fortunately the browser expires it at least once in 24 hours.



I am trying to setup a cache system where if a page has been updated by the server we can then send a message to the sw and delete some caches..

But even as I can confirm that the cache is deleted, still the page will use the previous cached version instead of going to the server.

I setup a test app where this can clearly be seen. 
https://perflab.herokuapp.com/

step 1


3 ways to know on the page that there is a "waiting" service worker - http://stackoverflow.com/questions/37573482/to-check-if-serviceworker-is-in-waiting-state
- If it is `registriation.waiting`
- if `registriation.installing` then track installing.. state change event if `installed` then it is a new sw
- listen for event `updatefound`

A good idea to keep control on faulty sw's is to update manually.
````
navigator.serviceWorker.register('/sw.js').then(reg => {
  // sometime later…
  reg.update();
});
````

Question 
Why do we need to manage the adding/removing of runtime cache in the sw while it is avaliable via js on page itself 
````
caches.open('cache-name').then( (cache) => {
    cache.keys().then((keys) => {
        console.log(keys)
    });
});
````

