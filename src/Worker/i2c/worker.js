onmessage = i2cOnMessage;

function i2cOnMessage(e) {
  var data = ab2jsonWorker(e.data);
  switch (data.method) {
    /********************************/
    /**         I2C                 */
    /********************************/
    case 'i2c.open':
      navigator.mozI2c.open(data.portNumber);
      break;
    case 'i2c.setDeviceAddress':
      var slaveDevice = navigator.mozI2c.setDeviceAddress(data.portNumber, data.slaveAddress);
      postMessage(json2abWorker({
        method: `${data.method}.${data.portNumber}`,
        portNumber: data.portNumber,
        slaveDevice: slaveDevice,
      }));
      break;
    case 'i2c.write':
      var value = navigator.mozI2c.write(data.portNumber, data.registerNumber, data.value, data.aIsOctet);
      postMessage(json2abWorker({
        method: `${data.method}.${data.portNumber}.${data.registerNumber}`,
        portNumber: data.portNumber,
        value: value,
      }));
      break;
    case 'i2c.read':
      Promise.resolve(navigator.mozI2c.read(data.portNumber, data.readRegistar, data.aIsOctet)).then((value)=> {
        postMessage(json2abWorker({
          method: `${data.method}.${data.portNumber}.${data.readRegistar}`,
          portNumber: data.portNumber,
          value: value,
        }));
      });

      break;
    default:
      throw 'Unexpected case to worker method';
  }
};
