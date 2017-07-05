/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
// self.importScripts('/client/js/idb-keyval-min.js', "/client/js/sw-utils.js");


// self.importScripts('/client/js/idb-keyval-min.js', "/client/js/sw-utils.js");



const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime-v1';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    // 'index.html',
    // './', // Alias for index.html
    //'pageWitoutSW.html',
    "/appShell",
    "/client/js/appShell.js"
];

const appShell = "/appShell";


// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
        .then(cache => cache.addAll(PRECACHE_URLS))
        .then(self.skipWaiting())
    );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});






// from answer to the question on http://stackoverflow.com/questions/33590734/service-worker-and-transparent-cache-updates?rq=1
self.addEventListener('fetch', function(event) {
    
    if(!navigator.onLine){
        console.log("offline");
    }

    if (!event.request.url.startsWith(self.location.origin)) return;
    //  if (event.request.url.indexOf('/api') === -1) return;

    // if(!isRequestCacheable(event.request.url)){}

    openPreCache = caches.open(PRECACHE);
    if (event.request.mode === "navigate" && event.request.headers.get('Accept').includes("text/html")) {
        event.respondWith(
                openPreCache.then(function(cache) {
                    return cache.match("/appShell").then(function(response) {
                        // respond from the cache, or the network
                        return response || false;
                    });
                })
            ) //appShell
    } else {
        event.respondWith(
            openPreCache.then(function(cache) {
                return cache.match(event.request).then(function(response) {
                       var fetchPromise = fetch(event.request).then(function(networkResponse) {
                           // if we got a response from the cache, update the cache
                           if (networkResponse) {
                               cache.put(event.request, networkResponse.clone());
                           }
                           return networkResponse;
                       });

                    // respond from the cache, or the network
                    return response || fetchPromise;
                });

            })
        )
    }
});

//
// messaging
//         self.addEventListener('message', function(event) {
//           console.log('Handling message event:', event);
//           var openTheCachePromise = caches.open(RUNTIME).then(function(cache) {
//             switch (event.data.command) {
//               // This command returns a list of the URLs corresponding to the Request objects
//               // that serve as keys for the current cache.
//               case 'keys':
//                 return cache.keys().then(function(requests) {
//                   var urls = requests.map(function(request) {
//                     return request.url;
//                   });
//         
//                   return urls.sort();
//                 }).then(function(urls) {
//                   // event.ports[0] corresponds to the MessagePort that was transferred as part of the controlled page's
//                   // call to controller.postMessage(). Therefore, event.ports[0].postMessage() will trigger the onmessage
//                   // handler from the controlled page.
//                   // It's up to you how to structure the messages that you send back; this is just one example.
//                   sendMessageToAllClients({dataType:"keys", urls: urls? urls : "fail fetching"});
//                 });
//               break;
//               
//               // This command adds a new request/response pair to the cache.
//               case 'add':
//                 // If event.data.url isn't a valid URL, new Request() will throw a TypeError which will be handled
//                 // by the outer .catch().
//                 // Hardcode {mode: 'no-cors} since the default for new Requests constructed from strings is to require
//                 // CORS, and we don't have any way of knowing whether an arbitrary URL that a user entered supports CORS.
//                 var url = event.data.url;
//                 var request = new Request(url, {mode: 'no-cors'});
//                 return fetch(request).then(function(response) {
//                   return cache.put(url, response);
//                 }).then(function() {
//                   sendMessageToAllClients({dataType:"add", url:url, status: "success"});
//                 });
//                 break;
//               
//               // This command removes a request/response pair from the cache (assuming it exists).
//               case 'delete':
//                 var url = event.data.url;
//                 sendMessageToAllClients("attempting delete cache");
//                 return cache.delete(url).then(function(success) {
//                     sendMessageToAllClients({dataType:"delete", url:url, status: success ? "success" : "fail"});
//                 });
//         
//                 break;
//         
//               case 'stale-storage':
//                console.log("stale-storage");
//         
//               break;
//         
//               case 'set-cache-version':
//                idbKeyval.set('resource-cache-version', event.data.resource);
//         
//               default:
//                 // This will be handled by the outer .catch().
//                 throw Error('Unknown command: ' + event.data.command);
//             }
//           }).catch(function(error) {
//             // If the promise rejects, handle it by returning a standardized error message to the controlled page.
//             console.error('Message handling failed:', error);
//         
//           //  event.ports[0].postMessage({
//           //    error: error.toString()
//           //  });
//           });
//
//             // Beginning in Chrome 51, event is an ExtendableMessageEvent, which supports
//             // the waitUntil() method for extending the lifetime of the event handler
//             // until the promise is resolved.
//             if ('waitUntil' in event) {
//                event.waitUntil(openTheCachePromise);
//             }
//
//             // Without support for waitUntil(), there's a chance that if the promise chain
//             // takes "too long" to execute, the service worker might be automatically
//             // stopped before it's complete.
//            );