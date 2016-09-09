
var ab2jsonWorker = (dataBuffer) => JSON.parse(String.fromCharCode.apply(null, new Uint16Array(dataBuffer)));
var json2abWorker = (jsonData) => {
  var strJson = JSON.stringify(jsonData);
  var buf = new ArrayBuffer(strJson.length * 2);
  var uInt8Array = new Uint16Array(buf);
  for (var i = 0, strLen = strJson.length; i < strLen; i++) {
    uInt8Array[i] = strJson.charCodeAt(i);
  }

  return uInt8Array;
};

function prePostMessage(jsonMessage) {
  eventTrucker.push('postMessage', jsonMessage);
  postMessage(json2abWorker(jsonMessage));
}

/**
* debug event queue
**/
function Queue() { this.__que = []; }

Queue.prototype.push = function (type, value) {
  this.__que.push({
    type: type,
    timing: Date.now(),
    value: value,
  });
  if (this.__que.length >= 500) this.__que.shift();
};

Queue.prototype.view = function () {
  return this.__que;
};

Queue.prototype.clear = function () {
  return this.__que = [];
};

var eventTrucker = new Queue();

/**
* gpio監視イベント
**/
var onChangeIntervalEvent = ()=> {

  intervalPortList.forEach(port=> {
    Promise.resolve(navigator.mozGpio.getValue(port.portNumber)).then((value)=> {
      if (parseInt(port.value) !== parseInt(value)) {
        port.value = value;
        prePostMessage({ method: `gpio.onchange.${port.portNumber}`, portNumber: port.portNumber, value: value, });
      }
    });
  });
};

var intervalPortList = [];
var onchangeIntervalId = setInterval(onChangeIntervalEvent, 30);

onmessage =  (e) => {

  var data = ab2jsonWorker(e.data);
  // DEBUG: event push
  eventTrucker.push('onmessage', data);
  switch (data.method) {
    /********************************/
    /**         GPIO                */
    /********************************/
    case 'gpio.export':
      navigator.mozGpio.export(data.portNumber);
      break;
    case 'gpio.setDirection':
      navigator.mozGpio.setDirection(data.portNumber, data.direction);

      if (!data.direction) {
        intervalPortList.push({
          portNumber: data.portNumber,
          value: void 0,
        });
      } else {
        intervalPortList = intervalPortList.filter((v) => data.portNumber !== v.portNumber);
      }

      break;
    case 'gpio.setValue':
      navigator.mozGpio.setValue(data.portNumber, data.value);
      break;
    case 'gpio.getValue':
      navigator.mozGpio.getValue(data.portNumber).then((value)=> {

        prePostMessage({
          method: `${data.method}.${data.portNumber}`,
          portNumber: data.portNumber,
          value: value,
        });
      });
      break;
    /********************************/
    /**         I2C                 */
    /********************************/
    case 'i2c.open':
      navigator.mozI2c.open(data.portNumber);
      break;
    case 'i2c.setDeviceAddress':
      var slaveDevice = navigator.mozI2c.setDeviceAddress(data.portNumber, data.slaveAddress);
      prePostMessage({
        method: `${data.method}.${data.portNumber}`,
        portNumber: data.portNumber,
        slaveDevice: slaveDevice,
      });
      break;
    case 'i2c.write':

      var value = navigator.mozI2c.write(data.portNumber, data.registerNumber, data.value, data.aIsOctet);
      prePostMessage({
        method: `${data.method}.${data.portNumber}.${data.registerNumber}`,
        portNumber: data.portNumber,
        value: value,
      });
      break;
    case 'i2c.read':
      Promise.resolve(navigator.mozI2c.read(data.portNumber, data.readRegistar, data.aIsOctet)).then((value)=> {
        prePostMessage({
          method: `${data.method}.${data.portNumber}.${data.readRegistar}`,
          portNumber: data.portNumber,
          value: value,
        });
      }).catch(error=> {
        prePostMessage({
          method: `${data.method}.${data.portNumber}.${data.readRegistar}`,
          portNumber: data.portNumber,
          value: error,
        });
      });

      break;
    /********************************/
    /**         DEBUG               */
    /********************************/
    case 'debug.polyfill.gpio.value.change':
      if (navigator.mozGpio.isPolyfill) {
        navigator.mozGpio.setValue(data.portNumber, data.value);
      }

      break;
    case 'debug.polyfill.i2c.read.resolve':
      if (navigator.mozI2c.isPolyfill) {
        navigator.mozI2c.read = (portNumber, registerNumber, value, aIsOctet) => {
          return Promise.resolve(data.value);
        };
      }

      break;
    case 'debug.polyfill.i2c.read.reject':
      if (navigator.mozI2c.isPolyfill) {
        navigator.mozI2c.read = (portNumber, registerNumber, value, aIsOctet) => {
          return Promise.reject(data.value);
        };
      }

      break;
    case 'debug.polyfill.events.get':
      prePostMessage({
        method: 'debug.polyfill.events.get',
        value: JSON.stringify(eventTrucker.view()),
      });
      break;
    case 'debug.polyfill.events.clear':
      eventTrucker.clear();
      prePostMessage({ method: 'debug.polyfill.events.clear' });
      break;
    default:
      throw 'Unexpected case to worker method';
  }
  /********************************/
  /**         DEBUG               */
  /********************************/
  if (navigator.mozGpio.isPolyfill) {
    prePostMessage({
      method: `debug.${data.method}`,
      value: data,
    });
  }
};
