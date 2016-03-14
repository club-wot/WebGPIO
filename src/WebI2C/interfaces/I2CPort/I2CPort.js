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
