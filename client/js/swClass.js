sw = function Sw() {
 
}; 


sw.prototype.registerServiceWorker = function registerServiceWorker() {
  self = this;
  if (!navigator.serviceWorker) return;
  navigator.serviceWorker.register('/sw.js').then(function(reg) {
    if (!navigator.serviceWorker.controller) {
      return;
    }

    if (reg.waiting) {
      self._updateReady(reg.waiting);
      return;
    }

    if (reg.installing) {
      self._trackInstalling(reg.installing);
      return;
    }

    reg.addEventListener('updatefound', function() {
      self._trackInstalling(reg.installing);
    });
  });

  // Ensure refresh is only called once.
  // This works around a bug in "force update on reload".
  var refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
};


sw.prototype._trackInstalling = function(worker) {
  var self = this;
  worker.addEventListener('statechange', function() {
    if (worker.state == 'installed') {
      self._updateReady(worker);
    }
  });
};

sw.prototype._updateReady = function(worker) {
  var toast = this._toastsView.show("New version available", {
    buttons: ['refresh', 'dismiss']
  });

  toast.answer.then(function(answer) {
    if (answer != 'refresh') return;
    worker.postMessage({action: 'skipWaiting'});
  });
};

// open a connection to the server for live updates