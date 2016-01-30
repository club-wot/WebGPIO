(function() {
  'use strict';

  if (!navigator.requestGPIOAccess) {
    navigator.requestGPIOAccess = function(port) {
      return new Promise(function(resolve, reject) {
        if (!navigator.mozGpio) {
          navigator.mozGpio = new Object();
          navigator.mozGpio.export = function(portno) {
          };

          navigator.mozGpio.unexport = function(portno) {
          };

          navigator.mozGpio.setValue = function(portno, value) {
            console.log('setValue(' + portno + ',' + value + ')');
          };

          navigator.mozGpio.getValue = function(portno) {
            return portno;
          };

          navigator.mozGpio.setDirection = function(portno, direction) {
            console.log('setDirection(' + portno + ',' + direction + ')');
          };

          navigator.mozGpio.getDirection = function() {
            return 'out';
          };
        }

        var gpioAccess = new GPIOAccess(port);
        resolve(gpioAccess);
      });
    };
  }
})();
