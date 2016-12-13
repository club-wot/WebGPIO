

/* istanbul ignore next */
if (window.Worker && window.WorkerOvserve) {

  var current = (function () {
    if (document.currentScript) {
      return document.currentScript.src;
    } else {
      var scripts = document.getElementsByTagName('script'),
      script = scripts[scripts.length - 1];
      if (script.src) {
        return script.src;
      }
    }
  })();

  var _worker = new Worker(`${current.substr(0, current.lastIndexOf('/'))}/worker.gpio.js`);

  // @MEMO gpioとi2cのObserverを分けた意味は「まだ」特にない
  window.WorkerOvserve.observe('gpio', function (jsonData) {
    var ab = json2ab(jsonData);
    _worker.postMessage(ab.buffer, [ab.buffer]);
  });

  _worker.onmessage = function (e) {
    var data = ab2json(e.data);
    window.WorkerOvserve.notify(data.method, data);
  };
}
