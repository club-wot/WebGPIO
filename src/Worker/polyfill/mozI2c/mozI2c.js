/* istanbul ignore next */
if (!navigator.mozI2c) {
  navigator.mozI2c = new Object();
  navigator.mozI2c.open = () => void 0;
  navigator.mozI2c.setDeviceAddress = () => void 0;
  navigator.mozI2c.read = (portNumber, readRegistar, aIsOctet) => {
    console.log(`mozI2c.read portNumber:${portNumber}, readRegistar:${readRegistar}, aIsOctet:${aIsOctet}`);
    return Promise.resolve(1);
  };

  navigator.mozI2c.write = (portNumber, registerNumber, value, aIsOctet) => {
    console.log(`mozI2c.write portNumber:${portNumber}, registerNumber:${registerNumber}, value:${value}, aIsOctet:${aIsOctet}`);
    return Promise.resolve(void 0);
  };
}
