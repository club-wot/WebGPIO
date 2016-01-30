(function() {
  'use strict';
  if (!window.GPIOAccess) {
    window.GPIOAccess = function GPIOAccess(port) {
      this.init(port);
    };

    GPIOAccess.prototype = {
      init: function(port) {
        this.ports = new Map();

        navigator.mozGpio.export(port);  //PWM
        this.ports.set(port - 0, new GPIOPort(port));

        console.log('size=' + this.ports.size);
      },
    };
  }
})();
