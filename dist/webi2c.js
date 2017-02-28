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
// https://rawgit.com/browserobo/WebI2C/master/index.html#navigator-I2C

var I2CAccess = function (port) {
  this.init(port);
};

I2CAccess.prototype = {
  init: function (port) {
    this.ports = new I2CPortMap();
    var convertToNumber = portStr => parseInt(portStr, 10);
    var setPortMap = port=> this.ports.set(port, new I2CPort(port));
    /**
    * @todo getI2C Ports
    ***/
    Object.keys(PORT_CONFIG.CHIRIMEN.I2C_PORTS)
      .map(convertToNumber)
      .forEach(setPortMap);
  },

  /**
  * @type {I2CPortMap}
  **/
  ports: null,
};

// https://rawgit.com/browserobo/WebI2C/master/index.html#I2CPort-interface

function I2CPort(portNumber) {
  this.init(portNumber);
}

I2CPort.prototype = {
  init: function (portNumber) {
    this.portNumber = portNumber;
    window.WorkerOvserve.notify('i2c', {
      method: 'i2c.open',
      portNumber: this.portNumber,
    });
  },

  /**
  * @readonly
  **/
  portNumber: 0,

  /**
  * @param {short} I2CSlaveAddress
  * @return {Promise<2CSlaveDevice>}
  * @example
  * var slaveDevice = null;
  * // Getting a slave device representing the slave address 0x40.
  * var slaveAddress = 0x40;
  * port.open(slaveAddress).then(
  *     function(I2CSlave) {
  *     	slaveDevice = I2CSlave; // store in global
  *     },
  *     function(error) {
  *         console.log("Failed to get a I2C slave device: " + error.message);
  *     }
  * );
  **/
  open: function (slaveAddress) {
    return new Promise((resolve, reject)=> {
      new I2CSlaveDevice(this.portNumber, slaveAddress).then((i2cslave) => {
        resolve(i2cslave);
      }, (err) => {
        reject(err);
      });
    });
  },
};

// document
// https://rawgit.com/browserobo/WebI2C/master/index.html#I2CPortMap-interface)

var I2CPortMap = Map;

// https://rawgit.com/browserobo/WebI2C/master/index.html#I2CSlaveDevice-interface

// base example
// https://github.com/browserobo/WebI2C/blob/master/implementations/Gecko/test-i2c/js/WebI2C.js

function I2CSlaveDevice(portNumber, slaveAddress) {
  return new Promise((resolve, reject)=> {
    this.init(portNumber, slaveAddress).then(() => {
      resolve(this);
    }, (err) => {
      reject(err);
    });
  });
}

I2CSlaveDevice.prototype = {
  init: function (portNumber, slaveAddress) {
    return new Promise((resolve, reject) => {

      this.portNumber = portNumber;
      this.slaveAddress = slaveAddress;

      window.WorkerOvserve.notify('i2c', {
        method: 'i2c.setDeviceAddress',
        portNumber: this.portNumber,
        slaveAddress: this.slaveAddress,
      });

      window.WorkerOvserve.observe(`i2c.setDeviceAddress.${this.portNumber}`, (data) => {
        if (!data.error) {
          this.slaveDevice = data.slaveDevice;
          resolve(data.slaveDevice);
        }else {
          console.log('i2c.setDeviceAddress: error name:[' + data.error.name + ']');
          reject(data.error);
        }

        window.WorkerOvserve.delete(`i2c.setDeviceAddress.${this.portNumber}`);
      });
    });
  },

  getXid: function () {
    this.xid++;
    if (this.xid > 999) {
      this.xid = 0;
    }

    return this.xid;
  },

  // Transaction ID
  xid: 0,

  /**
  * @private
  * @readonly
  **/
  portNumber: void 0,

  /**
  * @readonly
  **/
  slaveAddress: void 0,

  /**
  * @private
  * @readonly
  **/
  slaveDevice: void 0,

  /**
  * @param registerNumber
  * @return  Promise  read8(unsigned short registerNumber);
  * @example
  * // read the eight bits value from a specified registar (0x10)
  * var readRegistar = 0x10;
  * window.setInterval(function() {
  *     slaveDevice.read8(readRegistar).then(readSuccess, I2CError);
  * }, 1000);
  *
  * // the value successfully read
  * function readSuccess(value) {
  *     console.log(slaveAddress + ":" + readRegistar + ": " + value);
  * }
  *
  * // Show an error
  * function I2CError(error) {
  *     console.log("Error: " + error.message + "(" + slaveAddress + ")");
  * }
  **/
  read8: function (readRegistar) {
    return new Promise((resolve, reject) => {

      var transactionID = this.getXid();

      window.WorkerOvserve.notify('i2c', {
        method: 'i2c.read',
        xid: transactionID,
        portNumber: this.portNumber,
        slaveAddress: this.slaveAddress,
        readRegistar: readRegistar,
        aIsOctet: true,
      });

      window.WorkerOvserve.observe(`i2c.read.${transactionID}.${this.portNumber}.${this.slaveAddress}.${readRegistar}`, (data) => {
        if (!data.error) {
          resolve(data.value);
        }else {
          console.log('i2c.read8: error name:[' + data.error.name + ']');
          reject(data.error);
        }

        window.WorkerOvserve.delete(`i2c.read.${transactionID}.${this.portNumber}.${this.slaveAddress}.${readRegistar}`);
      });
    });
  },

  read16: function (readRegistar) {
    return new Promise((resolve, reject) => {

      var transactionID = this.getXid();

      window.WorkerOvserve.notify('i2c', {
        method: 'i2c.read',
        xid: transactionID,
        portNumber: this.portNumber,
        slaveAddress: this.slaveAddress,
        readRegistar: readRegistar,
        aIsOctet: false,
      });

      window.WorkerOvserve.observe(`i2c.read.${transactionID}.${this.portNumber}.${this.slaveAddress}.${readRegistar}`, (data) => {
        if (!data.error) {
          resolve(data.value);
        }else {
          console.log('i2c.read16: error name:[' + data.error.name + ']');
          reject(data.error);
        }

        window.WorkerOvserve.delete(`i2c.read.${transactionID}.${this.portNumber}.${this.slaveAddress}.${readRegistar}`);
      });
    });
  },

  /**
  * @param {chort} registerNumber
  * @param {chort} value
  * @example
  * // register number to write
  * var writeRegistar = 0x11;
  *
  * // the value to be written
  * var v = 0;
  *
  * writeValue();
  *
  * function writeValue(){
  * 	v = v ? 0 : 1;
  * 	slaveDevice.write8(writeRegistar, v).then(writeSuccess, I2CError);
  * }
  *
  * // the value successfully written
  * function writeSuccess(value) {
  *     console.log(slaveDevice.address + " : " + reg + " was set to " + value);
  *     window.setTimeout(writeValue, 1000);
  * }
  *
  * // Show an error
  * function I2CError(error) {
  *     console.log("Error: " + error.message + "(" + slaveDevice.address + ")");
  * }
  **/
  write8: function (registerNumber, value) {
    return new Promise((resolve, reject) => {

      var transactionID = this.getXid();

      window.WorkerOvserve.notify('i2c', {
        method: 'i2c.write',
        xid: transactionID,
        portNumber: this.portNumber,
        slaveAddress: this.slaveAddress,
        registerNumber: registerNumber,
        value: value,
        aIsOctet: true,
      });

      window.WorkerOvserve.observe(`i2c.write.${transactionID}.${this.portNumber}.${this.slaveAddress}.${registerNumber}`, (data) => {
        if (!data.error) {
          resolve(data.value);
        }else {
          console.log('i2c.write8: error name:[' + data.error.name + ']');
          reject(data.error);
        }

        window.WorkerOvserve.delete(`i2c.write.${transactionID}.${this.portNumber}.${this.slaveAddress}.${registerNumber}`);
      });
    });
  },

  write16: function (registerNumber, value) {
    return new Promise((resolve, reject) => {

      var transactionID = this.getXid();

      window.WorkerOvserve.notify('i2c', {
        method: 'i2c.write',
        xid: transactionID,
        portNumber: this.portNumber,
        slaveAddress: this.slaveAddress,
        registerNumber: registerNumber,
        value: value,
        aIsOctet: false,
      });

      window.WorkerOvserve.observe(`i2c.write.${transactionID}.${this.portNumber}.${this.slaveAddress}.${registerNumber}`, (data) => {
        if (!data.error) {
          resolve(data.value);
        }else {
          console.log('i2c.write16: error name:[' + data.error.name + ']');
          reject(data.error);
        }

        window.WorkerOvserve.delete(`i2c.write.${transactionID}.${this.portNumber}.${this.slaveAddress}.${registerNumber}`);
      });
    });
  },
};

/* istanbul ignore else */
if (!navigator.requestI2CAccess) {
  navigator.requestI2CAccess = function () {
    return Promise.resolve(new I2CAccess());
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

  var _worker = new Worker(`${current.substr(0, current.lastIndexOf('/'))}/worker.i2c.js`);

  // @MEMO gpioとi2cのObserverを分けた意味は「まだ」特にない
  window.WorkerOvserve.observe('i2c', function (jsonData) {
    var ab = json2ab(jsonData);
    _worker.postMessage(ab.buffer, [ab.buffer]);
  });

  _worker.onmessage = function (e) {
    var data = ab2json(e.data);
    window.WorkerOvserve.notify(data.method, data);
  };
}
})()