/* istanbul ignore next */
if (!navigator.mozI2c) {
  navigator.mozI2c = new Object();
  navigator.mozI2c.open = () => void 0;
  navigator.mozI2c.setDeviceAddress = (portNumber, slaveAddress) => {
    console.log(`mozI2c.setDeviceAddress portNumber:${portNumber}, slaveAddress:${slaveAddress}`);
    if ((portNumber !== 0) && (portNumber !== 2)) {
      var err = { message:'portNumber error' };
      throw err;
    }

    if ((slaveAddress > 0x7f) || (slaveAddress < 0)) {
      var err = { message:'slaveAddress error' };
      throw err;
    }

    var slaveDevice = { slaveAddress:slaveAddress };
    return slaveDevice;
  };

  navigator.mozI2c.write = (portNumber, slaveAddress, registerNumber, value, aIsOctet) => {
    console.log(`mozI2c.write portNumber:${portNumber}, slaveAddress:${slaveAddress}, registerNumber:${registerNumber}, value:${value}, aIsOctet:${aIsOctet}`);
    if ((portNumber !== 0) && (portNumber !== 2)) {
      var err = { message:'portNumber error' };
      throw err;
    }

    if ((slaveAddress > 0x7f) || (slaveAddress < 0)) {
      var err = { message:'slaveAddress error' };
      throw err;
    }

    return 0;
  };

  navigator.mozI2c.read = (portNumber, slaveAddress, readRegistar, aIsOctet) => {
    console.log(`mozI2c.read portNumber:${portNumber}, slaveAddress:${slaveAddress}, readRegistar:${readRegistar}, aIsOctet:${aIsOctet}`);
    if ((portNumber !== 0) && (portNumber !== 2)) {
      var err = { message:'portNumber error' };
      throw err;
    }

    if ((slaveAddress > 0x7f) || (slaveAddress < 0)) {
      var err = { message:'slaveAddress error' };
      throw err;
    }

    return (1);
  };

}
