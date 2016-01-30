(function() {
  'use strict';
  if (!window.GPIOPort) {
    window.GPIOPort = function GPIOPort(portNumber) {
      this.init(portNumber);
    };

    GPIOPort.prototype = {
      init: function(portNumber) {
        this.portNumber = portNumber;
        this.direction = 'out';
        this.interval = 30;
        this.value = null;
        this.timer = null;
      },

      setDirection: function(direction) {
        return new Promise(function(resolve, reject) {
          if (direction === 'in' || direction === 'out') {
            this.direction = direction;
            navigator.mozGpio.setDirection(this.portNumber, direction === 'out');
            if (direction === 'in') {
              console.log('in');
              var _this = this;
              this.timer = setInterval(this.checkValue, this.interval, _this);
            }else {
              console.log('out');
              if (this.timer) {
                clearInterval(this.timer);
              }

              console.log('time');
            }

            resolve();
          } else {
            reject({ message:'invalid direction' });
          }
        }.bind(this));
      },

      isInput: function() {
        return this.direction === 'in';
      },

      read: function() {
        return new Promise(function(resolve, reject) {
          if (this.isInput()) {
            resolve(navigator.mozGpio.getValue(this.portNumber));
          } else {
            reject({ message:'invalid direction' });
          }
        }.bind(this));
      },

      write: function(value) {
        return new Promise(function(resolve, reject) {
          if (this.isInput()) {
            reject({ message:'invalid direction' });
          } else {
            navigator.mozGpio.setValue(this.portNumber, value);
            resolve(value);
          }
        }.bind(this));
      },

      checkValue:function(port) {
        port.read().then(
          function(value) {
            if (port.value != null) {
              if (parseInt(value) != parseInt(port.value)) {
                if (typeof (port.onchange) === 'function') {
                  port.onchange(value);
                }else {
                  console.log('port.onchange is not a function.');
                }
              }
            }

            port.value = value;
          },

          function() {
            console.log('check value error');
          }
        );
      },

      onchange:null,
    };
  }
})();
