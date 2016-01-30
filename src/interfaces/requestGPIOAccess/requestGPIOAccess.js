(function() {
  'use strict';

  if (!navigator.requestGPIOAccess) {
    navigator.requestGPIOAccess = function(port) {
      return new Promise(function(resolve, reject) {

        var gpioAccess = new GPIOAccess(port);
        resolve(gpioAccess);
      });
    };
  }
})();
