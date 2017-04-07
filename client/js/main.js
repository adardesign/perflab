fetch('/api/getAsyncData').then(function(response) { 
	// Convert to JSON
	return response.json();
}).then(function(response) {
	// compare the cacheVersion with the getAsyncData one..
	if(response.cacheVersion !== pageInfo.cacheVersion){
		console.log("cache-stale")
		navigator.serviceWorker.controller.postMessage("cache-stale");
	}else{
		console.log("cache-ok")
		navigator.serviceWorker.controller.postMessage("cache-ok");		
	}
}).catch( (err) => console.log);
