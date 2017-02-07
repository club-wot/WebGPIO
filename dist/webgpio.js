(function(){var ab2json = (dataBuffer) => JSON.parse(String.fromCharCode.apply(null, new Uint16Array(dataBuffer)));
var json2ab = (jsonData) => {
  var strJson = JSON.stringify(jsonData);
  var buf = new ArrayBuffer(strJson.length * 2);
  var uInt8Array = new Uint16Array(buf);
  for (var i = 0, strLen = strJson.length; i < strLen; i++) {
    uInt8Array[i] = strJson.charCodeAt(i);
  }

  return uInt8Array;
};

/**
 * @example setting ovserve function
 *   global.MockOvserve.observe('xxxxx_xxxxx_xxxxx', function(updateJson){
 *     stateCtrl.setJsonData(updateJson);
 *   });
 *
 * @example nofify method (parameter single only)
 *   global.MockOvserve.notify('xxxxx_xxxxx_xxxxx', { param: 'PARAM' });
 **/
window.WorkerOvserve = window.WorkerOvserve || (function () {

  function Ovserve() {
    this._Map = new Map();
  }

  // set ovserver
  Ovserve.prototype.observe = function (name, fnc) {
    var funcs = this._Map.get(name) || [];
    funcs.push(fnc);
    this._Map.set(name, funcs);
  };

  // remove ovserver
  Ovserve.prototype.unobserve = function (name, func) {
    var funcs = this._Map.get(name) || [];
    this._Map.set(name, funcs.filter(function (_func) {
      return _func !== func;
    }));
  };

  // notify ovserve
  Ovserve.prototype.notify = function (name) {
    var args = Array.prototype.slice.call(arguments, 1);
    /* istanbul ignore next */
    (this._Map.get(name) || []).forEach(function (func, index) {
      func.apply(null, args);
    });
  };

  // delete map
  // delete
  Ovserve.prototype.delete = function (name) {
    this._Map.delete(name);
  };

  return new Ovserve();
})();

const PORT_CONFIG = {
  // https://docs.google.com/spreadsheets/d/1pVgK-Yy09p9PPgNgojQNLvsPjDFAOjOubgNsNYEQZt8/edit#gid=0
  CHIRIMEN: {
    PORTS: {
      283: { portName: 'CN1.UART3_RX', pinName: '4', },
      284: { portName: 'CN1.UART3_TX', pinName: '5', },
      196: { portName: 'CN1.SPI0_CS',  pinName: '7', },
      197: { portName: 'CN1.SPI0_CLK', pinName: '8', },
      198: { portName: 'CN1.SPI0_RX',  pinName: '9', },
      199: { portName: 'CN1.SPI0_TX',  pinName: '10', },
      244: { portName: 'CN1.SPI1_CS',  pinName: '11', },
      243: { portName: 'CN1.SPI1_CLK', pinName: '12', },
      246: { portName: 'CN1.SPI1_RX',  pinName: '13', },
      245: { portName: 'CN1.SPI1_TX',  pinName: '14', },
      163: { portName: 'CN2.PWM0',     pinName: '10', },
      193: { portName: 'CN2.UART0_TX', pinName: '13', },
      192: { portName: 'CN2.UART0_RX', pinName: '14', },
      353: { portName: 'CN2.GPIO6_A1', pinName: '15', },
    },
    I2C_PORTS: {
        0: {
          SDA: { portName: 'CN2.I2C0_SCL', pinName: '11', },
          SCL: { portName: 'CN2.I2C0_SDA', pinName: '12', },
        },
        2: {
          SDA: { portName: 'CN1.I2C2_SDA', pinName: '2', },
          SCL: { portName: 'CN1.I2C2_SCL', pinName: '3', },
        },
      },
  },
};

// document
// https://rawgit.com/browserobo/WebGPIO/master/index.html#navigator-gpio

var GPIOAccess = function (port) {
  this.init(port);
};

GPIOAccess.prototype = {
  init: function (port) {
    this.ports = new GPIOPortMap();
    var convertToNumber = portStr => parseInt(portStr, 10);

    var makeChain = port => ()=> new Promise(resolve=> {
      window.WorkerOvserve.observe(`gpio.export.${port}`, () => resolve());
      this.ports.set(port, new GPIOPort(port));
    });

    var exportChain = (chain, next) => chain.then(next);

    this.GPIOAccessThen = Object.keys(PORT_CONFIG.CHIRIMEN.PORTS)
      .map(convertToNumber)
      .map(makeChain)
      .reduce(exportChain, Promise.resolve());
  },

  /**
  * The ports attribute must return the GPIOPortMap object representing all of the GPIO ports available on the underlying operating system.
  * @type {GPIOPortMap}
  **/
  ports: null,

  /**
  * Open issues: Is unexportAll necessary?
  * @todo: During implementation
  **/
  unexportAll: null,

  /**
  * The onchange attribute is a event handler invoked when the value of one of the exported GPIO ports changes
  * (i.e. the value changes from 1 to 0 or from 0 to 1). Whenever the event handler is to be invoked, the user agent must run the following steps:
  *  1. Let port be the GPIOPort object.
  *  2. Let port value be the value of the GPIO port corresponding to the GPIOPort.
  *  3. Let event be a newly constructed GPIOChangeEvent, with the value attribute set to the port value, and the port attribute set to the port.
  *  4. Fire an event named change at the GPIOAccess object, using the event as the event object.
  * @todo: During implementation
  **/
  onchange: null,
};



// document
// https://rawgit.com/browserobo/WebGPIO/master/index.html#GPIOPort-interface

var GPIOPort = function (portNumber) {
  this.init(portNumber);
};

/**
* The GPIOPort interface represents a GPIO port assigned to a physical GPIO pin.
**/
GPIOPort.prototype = {
  init: function (portNumber) {

    window.WorkerOvserve.notify('gpio', {
      method: 'gpio.export',
      portNumber: portNumber,
    });

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

    this.value = null;
    this._DEVICES = 'CHIRIMEN';
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

    var onChangeEvent = (data) => {
      if (typeof (this.onchange) === 'function') {
        this.onchange(data.value);
      }
    };

    var exportGPIO = (resolve, reject)=> {

      if (direction === DIRECTION_MODE.OUT || direction === DIRECTION_MODE.IN) {
        window.WorkerOvserve.notify('gpio', {
          method: 'gpio.setDirection',
          portNumber: this.portNumber,
          direction: direction === DIRECTION_MODE.OUT,
        });

        if (direction === DIRECTION_MODE.IN) {
          window.WorkerOvserve.observe(`gpio.onchange.${this.portNumber}`, onChangeEvent);
        }else {
          window.WorkerOvserve.unobserve(`gpio.onchange.${this.portNumber}`, onChangeEvent);
        }

        resolve();
      }else {
        reject(new Error('InvalidAccessError'));
      }
    };

    var sucessHandler = event=> {
      this.direction = direction;
      this.exported = true;

      this.pinName = PORT_CONFIG[this._DEVICES].PORTS[this.portNumber].pinName;
      this.portName = PORT_CONFIG[this._DEVICES].PORTS[this.portNumber].portName;
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
    var validation = (resolve, reject)=> {
      if (!this.exported) {
        reject(new Error('InvalidAccessError'));
      } else if (!this.__isInput()) {
        reject(new Error('OperationError'));
      }

      resolve();
    };

    //var readGPIO = ()=> navigator.mozGpio.getValue(this.portNumber);
    var readGPIO = () => new Promise((resolve, reject) => {

      window.WorkerOvserve.observe(`gpio.getValue.${this.portNumber}`, (workerData) => {
        resolve(workerData.value);
      });

      window.WorkerOvserve.notify('gpio', {
        method: 'gpio.getValue',
        portNumber: this.portNumber,
      });

    });

    return new Promise(validation)
      .then(readGPIO);
  },

  /**
  * The write() method writes the value passed as the first argument to the related GPIO port.
  * The value must be numeric 0 or 1. When the write() method is invoked, the user agent must run the steps as follows:
  **/
  write: function (value) {

    var validation = (resolve, reject)=> {
      if (!this.exported) {
        reject(new Error('InvalidAccessError'));
      } else if (!this.__isOutput()) {
        reject(new Error('OperationError'));
      } else if (value !== IO.LOW && value !== IO.HIGH) {
        reject(new Error('OperationError'));
      }

      resolve();
    };

    var writeGPIO = ()=> {
      this.value = value;

      window.WorkerOvserve.notify('gpio', {
        method: 'gpio.setValue',
        portNumber: this.portNumber,
        value: this.value,
      });
      return this.value;
    };

    return new Promise(validation)
      .then(writeGPIO);
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
    return this.direction === DIRECTION_MODE.IN;
  },

  /**
  * @private
  * @return {Boolean}
  **/
  __isOutput: function () {
    return this.direction === DIRECTION_MODE.OUT;
  },
};

// document
// https://rawgit.com/browserobo/WebGPIO/master/index.html#GPIOPortMap-interface

var GPIOPortMap = Map;

/* istanbul ignore else */
if (!navigator.requestGPIOAccess) {
  navigator.requestGPIOAccess = function () {
    //return new Promise(resolve=> resolve(new GPIOAccess()));

    var gpioAccess = new GPIOAccess();
    return gpioAccess.GPIOAccessThen.then(()=> gpioAccess);
  };
}



/* istanbul ignore next */
if (window.Worker && window.WorkerOvserve) {

  var current = (function () {
    if (document.currentScript) {
      return document.currentScript.src;
    } else {
      var scripts = document.getElementsByTagName('script'),
      script = scripts[scripts.length - 1];
      if (script.src) {
        return script.src;
      }
    }
  })();

  var _worker = new Worker(`${current.substr(0, current.lastIndexOf('/'))}/worker.gpio.js`);

  // @MEMO gpioとi2cのObserverを分けた意味は「まだ」特にない
  window.WorkerOvserve.observe('gpio', function (jsonData) {
    var ab = json2ab(jsonData);
    _worker.postMessage(ab.buffer, [ab.buffer]);
  });

  _worker.onmessage = function (e) {
    var data = ab2json(e.data);
    window.WorkerOvserve.notify(data.method, data);
  };
}

const DIRECTION_MODE = {
  IN: 'in',
  OUT: 'out',
};

const IO = {
  LOW: 0,
  HIGH: 1,
};
})()