fetch('https://perflab-163717.firebaseio.com/.json').then(function(response) { 
	// Convert to JSON
	return response.json();
}).then(function(response) {
	// compare the cacheVersion with the getAsyncData one..
	if(response.cacheVersion === pageInfo.cacheVersion){
		console.log("cache-stale")
		navigator.serviceWorker.controller.postMessage({command: 'keys'});
	}else{
		var url = location.origin + location.pathname + location.search;
		navigator.serviceWorker.controller.postMessage({command: 'delete', url:location.origin + location.pathname + location.search});
	}
}).catch( (err) => console.log);


//   fetch('/api/getAsyncData').then(function(response) { 
//   	// Convert to JSON
//   	return response.json();
//   }).then(function(response) {
//   	// compare the cacheVersion with the getAsyncData one..
//   	if(response.cacheVersion !== pageInfo.cacheVersion){
//   		console.log("cache-stale")
//   		navigator.serviceWorker.controller.postMessage("cache-stale");
//   	}else{
//   		console.log("cache-ok")
//   		navigator.serviceWorker.controller.postMessage("cache-ok");		
//   	}
//   }).catch( (err) => console.log);


	navigator.serviceWorker.addEventListener('message', function(event) {
    		console.log(event.data);
  	});
