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
