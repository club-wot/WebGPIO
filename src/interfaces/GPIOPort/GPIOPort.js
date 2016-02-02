// document
// https://rawgit.com/browserobo/WebGPIO/master/index.html#GPIOPort-interface

(function () {
  'use strict';

  /* istanbul ignore else */
  if (!window.GPIOPort) {
    window.GPIOPort = function (portNumber) {
      this.init(portNumber);
    };

    const DIRECTION = {
      IN: 'in',
      OUT: 'out',
    };

    const IO = {
      ROW: 0,
      HIGH: 1,
    };

    /**
    * The GPIOPort interface represents a GPIO port assigned to a physical GPIO pin.
    **/
    GPIOPort.prototype = {
      init: function (portNumber) {

        /**
        * The portNumber attribute must return the GPIO port number assigned to the GPIOPort object.
        * port番号の属性は gpio portオブジェクトに割り当てられたgpio prot番号を返します。
        **/
        this.portNumber = portNumber;

        /**
        * The portName attribute must return the name of the GPIO port. If the name is unknown, the portName attribute must return an empty string.
        * gpio portの名前を返します。名前が不明の場合、port名は唐文字を返します。
        **/
        this.portName = '';

        /**
        * The pinName attribute must return the name of the GPIO pin. If the name is unknown, the pinName attribute must return an empty string.
        * pinNameは GPIOピンの名前を返します。名前が不明な場合は空文字を返します。
        **/
        this.pinName = '';

        /**
        * The direction attribute must return either	an empty string, "in", or "out".
        *	This value is initially an empty string. This value is set to "in",
        * or "out" when the export() method is invoked and successfully completed based on the argument passed to the method.
        * directionは"in"もしくは"out"、または空文字列を返します。
        * この値は最初は空文字列です。
        * export() メソッドが正常に実行され他場合、この値は"out"または"in"に設定されます。
        **/
        this.direction = '';

        /**
        * The exported attribute	gives	whether the GPIO port has been exported or not.
        * If the GPIO port has been exported, the exported attribute must return true, otherwise false.
        * exportedはGPIOポートがexportされたか否かを返します。
        * GPIOポートがexportされている場合はtrue、exportされていない場合はfalseを返さなければいけません。
        **/
        this.exported = false;

        this._interval = 30;
        this.value = null;
        this._timer = null;
      },

      /**
      * The export() method activate the related GPIO port. When the export() method is invoked, the user agent must run the steps as follows:
      *   1. Let promise be a new Promise object and resolver be its associated resolver.
      *   2. Return promise and run the following steps asynchronously.
      *   3. If the value of the exported attribute is true, jump to the step labeled success below.
      *   4. Let direction be the value of the first argument passed to the method.
      *   5. If direction is neither "in" nor "out", jump to the step labeled failure below.
      *   6. Activate the related GPIO port in the specified direction mode ("in" or "out"). If succeeded, set the exported attribute to true, then jump to the step labeled success below. Otherwise, jump to the step labeled failure below.
      *   7. success: Call resolver's accept() method without any argument. Abort these steps.
      *   8. failure: Let error be a new DOMExceptions. This must be of type "InvalidAccessError" if direction was invalid (i.e. neither "in" nor "out"),
      *     "SecurityError" if this operation was denied by the operating system because of some kind of security reason,
      *     "OperationError" if this operation was failed because of any reasons other than security reason.
      *     Then call resolver's reject(value) method with error as value argument.
      * @todo: SecurityError implementation
      **/
      export: function (direction) {

        var directMap = {
          in: ()=> this._timer = setInterval(()=> this.__checkValue(this), this._interval),
          out: ()=> this._timer ? clearInterval(this._timer) : 0,
        };

        var exportGPIO = (resolve, reject)=> {
          var directFnc = directMap[direction];

          if (directFnc) {
            navigator.mozGpio.setDirection(this.portNumber, direction === DIRECTION.OUT);
            directFnc();
            resolve();
          }else {
            reject(new Error('InvalidAccessError'));
          }
        };

        var sucessHandler = event=> {
          this.direction = direction;
          this.exported = true;

          // @todo set name
          // this.pinName = '';
          // this.portName = '';
          return event;
        };

        var errorHandler = error=> {
          this.direction = '';
          this.exported = false;
          this.pinName = '';
          this.portName = '';
          return Promise.reject(error);
        };

        return new Promise(exportGPIO)
          .then(sucessHandler)
          .catch(errorHandler);
      },

      /**
      * The unexport() method deactivates	the related GPIO port. When the unexport() method is invoked, the user agent must run the steps as follows:
      * @todo: During implementation
      **/
      unexport: /* istanbul ignore next */ function (direction) {},

      /**
      * The read() method reads the value from the related GPIO port. When the read() method is invoked, the user agent must run the steps as follows:
      **/
      read: function () {

        var readGPIO = (resolve, reject)=> {
          if (!this.exported) {
            reject(new Error('InvalidAccessError'));
          } else if (!this.__isInput()) {
            reject(new Error('OperationError'));
          }

          resolve(navigator.mozGpio.getValue(this.portNumber));
        };

        return new Promise(readGPIO);
      },

      /**
      * The write() method writes the value passed as the first argument to the related GPIO port.
      * The value must be numeric 0 or 1. When the write() method is invoked, the user agent must run the steps as follows:
      **/
      write: function (value) {

        var writeGPIO = (resolve, reject)=> {
          if (!this.exported) {
            reject(new Error('InvalidAccessError'));
          } else if (!this.__isOutput()) {
            reject(new Error('OperationError'));
          } else if (value !== IO.ROW && value !== IO.HIGH) {
            reject(new Error('OperationError'));
          }

          this.value = value;
          navigator.mozGpio.setValue(this.portNumber, this.value);
          resolve(this.value);
        };

        return new Promise(writeGPIO);
      },

      /**
      * The onchange attribute is a event handler invoked when the value of the GPIO port corresponding to the GPIOPort object changes
      * (i.e. the value changes from 1 to 0 or from 0 to 1).
      * Whenever the event handler is to be invoked, the user agent must run the following steps:
      * @todo: During implementation
      * @type {GPIOChangeEvent}
      **/
      onchange:null,

      // --- private method

      /**
      * @private
      * @return {Boolean}
      **/
      __isInput: function () {
        return this.direction === DIRECTION.IN;
      },

      /**
      * @private
      * @return {Boolean}
      **/
      __isOutput: function () {
        return this.direction === DIRECTION.OUT;
      },

      /**
      * on change event observer
      * @private
      * @return {Promise}
      **/
      __checkValue: function (port) {
        return port.read()
          .then(value => {
            if (parseInt(value) != parseInt(port.value)) {
              if (typeof (port.onchange) === 'function') {
                // fire GPIOChangeEvent
                port.onchange(port);
              }else {
                console.log('port.onchange is not a function.');
              }

              port.value = value;
            }
          });
      },
    };
  }
})();
