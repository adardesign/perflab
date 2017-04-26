
const CACHE_TYPES = {
	content: 'content',
	image  : 'image',
	other  : 'other',
	static : 'static'
};

var isRequestCacheable = function isRequestCacheable( req, options ) {
  return fetch( req, options ).then( res => {

    if ( res.ok ) {
      const clone = res.clone();

      openCacheFor( req ).then( cache => {
        return cache.put( req, clone );
      } );
    }

    return res;
  } );
}


let matchRequest = function matchRequest( req, options ) {
  return caches.match( req, options ).then( res => {
    return res || Promise.reject(
        `matchRequest: could not match ${req.url}`
      );
  } );
}



testIdb = function testIdb(id) {
	idbKeyval.set('TEST', JSON.stringify({"test1":id}));
}

var getContentType = function getContentType( req ) {

	const header = req.headers.get( 'Accept' );
	const types = [
		CACHE_TYPES.static,
		CACHE_TYPES.content,
		CACHE_TYPES.image
	];

	return types.find( type => {
		const test = headerTests.get( type );
		if ( !test ) {
			return;
		}
		return test( header );
	} );
}


var sendMessageToAllClients = function sendMessageToAllClients(message) {
  clients.matchAll().then(clients => {
        clients.forEach(client => {
            sendMessageToSingleClient(client, message).then(m => console.log("SW Received Message: "+m));
        })
    });
};

var sendMessageToSingleClient = function sendMessageToSingleClient(client, msg){
    return new Promise(function(resolve, reject){
        var msg_chan = new MessageChannel();

        msg_chan.port1.onmessage = function(event){
            if(event.data.error){
                reject(event.data.error);
            }else{
                resolve(event.data);
            }
        };

        client.postMessage(msg, [msg_chan.port2]);
    });
}

