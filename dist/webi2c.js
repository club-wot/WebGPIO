(function(){// document
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
      resolve(new I2CSlaveDevice(this.portNumber, slaveAddress));
    });
  },
};

// document
// https://rawgit.com/browserobo/WebI2C/master/index.html#I2CPortMap-interface)

var I2CPortMap = Map;

// https://rawgit.com/browserobo/WebI2C/master/index.html#I2CSlaveDevice-interface

// base example
// https://github.com/browserobo/WebI2C/blob/master/implementations/Gecko/test-i2c/js/WebI2C.js

function I2CSlaveDevice(portNumber) {
  this.init(portNumber);
}

I2CSlaveDevice.prototype = {
  init: function (portNumber, slaveAddress) {
    this.portNumber = portNumber;
    this.slaveAddress = slaveAddress;
    this.slaveDevice = navigator.mozI2c.setDeviceAddress(portNumber, slaveAddress);
  },

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
      resolve(navigator.mozI2c.read(this.portNumber, readRegistar, true));
    });
  },

  read16: function (readRegistar) {
    return this.read8(readRegistar);
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
      navigator.mozI2c.write(this.portNumber, registerNumber, value, true);
      resolve(value);
    });
  },

  write16: function (registerNumber, value) {
    return this.write8(registerNumber, value);
  },
};

/* istanbul ignore else */
if (!navigator.requestI2CAccess) {
  navigator.requestI2CAccess = function () {
    return Promise.resolve(new I2CAccess());
  };
}

const PORT_CONFIG = {
  // https://docs.google.com/spreadsheets/d/1pVgK-Yy09p9PPgNgojQNLvsPjDFAOjOubgNsNYEQZt8/edit#gid=0
  CHIRIMEN: {
    PORTS: {
      256: { portName: 'CN1.I2C2_SDA', pinName: '2', },
      257: { portName: 'CN1.I2C2_SCL', pinName: '3', },
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
      253: { portName: 'CN2.I2C0_SCL', pinName: '11', },
      252: { portName: 'CN2.I2C0_SDA', pinName: '12', },
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
})()