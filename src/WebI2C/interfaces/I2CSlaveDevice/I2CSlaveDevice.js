// https://rawgit.com/browserobo/WebI2C/master/index.html#I2CSlaveDevice-interface

// base example
// https://github.com/browserobo/WebI2C/blob/master/implementations/Gecko/test-i2c/js/WebI2C.js

function I2CSlaveDevice(portNumber, slaveAddress) {
  this.init(portNumber, slaveAddress);
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
