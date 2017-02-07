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
      try {
        var slaveDevice = navigator.mozI2c.setDeviceAddress(data.portNumber, data.slaveAddress);
      }catch (err) {
        postMessage(json2abWorker({
          method: `${data.method}.${data.portNumber}`,
          portNumber: data.portNumber,
          error: { name:err.name, message:err.message },
        }));
        break;
      }

      postMessage(json2abWorker({
        method: `${data.method}.${data.portNumber}`,
        portNumber: data.portNumber,
        slaveDevice: slaveDevice,
      }));
      break;
    case 'i2c.write':
      try {
        var value = navigator.mozI2c.write(data.portNumber, data.slaveAddress, data.registerNumber, data.value, data.aIsOctet);
      }catch (err) {
        postMessage(json2abWorker({
          method: `${data.method}.${data.xid}.${data.portNumber}.${data.slaveAddress}.${data.registerNumber}`,
          portNumber: data.portNumber,
          error: { name:err.name, message:err.message },
        }));
        break;
      }

      postMessage(json2abWorker({
        method: `${data.method}.${data.xid}.${data.portNumber}.${data.slaveAddress}.${data.registerNumber}`,
        portNumber: data.portNumber,
        value: value,
      }));
      break;
    case 'i2c.read':
      try {
        var value = navigator.mozI2c.read(data.portNumber, data.slaveAddress, data.readRegistar, data.aIsOctet);
      }catch (err) {
        postMessage(json2abWorker({
          method: `${data.method}.${data.xid}.${data.portNumber}.${data.slaveAddress}.${data.readRegistar}`,
          portNumber: data.portNumber,
          error: { name:err.name, message:err.message },
        }));
        break;
      }

      postMessage(json2abWorker({
        method: `${data.method}.${data.xid}.${data.portNumber}.${data.slaveAddress}.${data.readRegistar}`,
        portNumber: data.portNumber,
        value: value,
      }));
      break;
    default:
      throw 'Unexpected case to worker method';
  }
};
