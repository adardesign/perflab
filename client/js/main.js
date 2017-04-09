//TEST
fetch('https://perflab-163717.firebaseio.com/.json').then(function(response) { 
	// Convert to JSON
	return response.json();
}).then(function(response) {
	// compare the cacheVersion with the getAsyncData one..
	if(response.cacheVersion === pageInfo.cacheVersion){
		console.log("cache-fresh")
		navigator.serviceWorker.controller.postMessage({command: 'keys'});
	}else{
		console.log("cache-fresh")
		var url = location.origin + location.pathname + location.search;
		navigator.serviceWorker.controller.postMessage({command: 'delete', url:location.origin + location.pathname + location.search});
		document.querySelectorAll("header")[0].innerHTML = "<h1>page is stale refreshing...</h1>";
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
    	if(event.data.dataType){
    		switch (event.data.dataType) {
    			case "keys":
    				var cacheList = document.getElementById("cache-list");
    				console.log(event.data.urls);
    				console.log(event.data.urls.join("<li>"));
    				if(event.data.urls && event.data.urls.length){	
    					cacheList.innerHTML = "<ul><li>"+event.data.urls.join("</li><li>")+"</ul>";
    				}
    				break;
    			default:
    				// statements_def
    				break;
    		}
    	}
  	});
