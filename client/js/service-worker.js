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

console.log("SW");

const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime-v1';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    // 'index.html',
    // './', // Alias for index.html
    //'pageWitoutSW.html',
    "/appshell.html",
    "/client/images/shell-home-page-placeholder.jpg"
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
                    return cache.match("/appshell.html").then(function(response) {
                        // respond from the cache, or the network
                        return response || false;
                    });
                })
            ) //appShell
    } else {
        return;
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