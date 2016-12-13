
/**
* gpio監視イベント
**/
var onChangeIntervalEvent = ()=> {

  intervalPortList.forEach(port=> {
    Promise.resolve(navigator.mozGpio.getValue(port.portNumber)).then((value)=> {
      if (parseInt(port.value) !== parseInt(value)) {
        port.value = value;
        postMessage(json2abWorker({ method: `gpio.onchange.${port.portNumber}`, portNumber: port.portNumber, value: value, }));
      }
    });
  });
};

var intervalPortList = [];
var onchangeIntervalId = setInterval(onChangeIntervalEvent, 30);

onmessage = gpioOnMessage;

function gpioOnMessage(e) {
  var data = ab2jsonWorker(e.data);
  switch (data.method) {
    /********************************/
    /**         GPIO                */
    /********************************/
    case 'gpio.export':
      navigator.mozGpio.export(data.portNumber);
      postMessage(json2abWorker({
        method: `${data.method}.${data.portNumber}`,
        portNumber: data.portNumber,
      }));
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

        postMessage(json2abWorker({
          method: `${data.method}.${data.portNumber}`,
          portNumber: data.portNumber,
          value: value,
        }));
      });
      break;
    default:
      throw 'Unexpected case to worker method';
  }
};
