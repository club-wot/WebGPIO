(function(){/* istanbul ignore next */
if (!navigator.mozGpio) {
  navigator.mozGpio = new Object();
  navigator.mozGpio.direction = '';
  navigator.mozGpio.value = 0;
  navigator.mozGpio.export = function (portno) {
  };

  navigator.mozGpio.unexport = function (portno) {
  };

  navigator.mozGpio.setValue = function (portno, value) {
    console.log('setValue(' + portno + ',' + value + ')');
  };

  navigator.mozGpio.getValue = function (portNumber) {
    return navigator.mozGpio.value;
  };

  navigator.mozGpio.setDirection = function (portno, direction) {
    console.log('setDirection(' + portno + ',' + direction + ')');
    navigator.mozGpio.direction = direction;
  };

  navigator.mozGpio.getDirection = function () {
    return navigator.mozGpio.direction;
  };

  // x秒おきに値を変更する
  // onchange event test
  // setInterval(()=> {
  //   navigator.mozGpio.value = navigator.mozGpio.value ? 0 : 1;
  //   console.log('navigator.mozGpio.value change', navigator.mozGpio.value);
  // }, 10000);
}


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
})()