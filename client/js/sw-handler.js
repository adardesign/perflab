if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    serviceWorkerInstance = navigator.serviceWorker.register('/service-worker.js', {
    	scope: './'
    }).then(function(registration) {
    	serviceWorkerRegestration = registration;
    }).catch(function(err) {
		
    });
  });
}
