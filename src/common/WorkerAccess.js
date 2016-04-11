/**
 * @example setting ovserve function
 *   global.MockOvserve.observe('xxxxx_xxxxx_xxxxx', function(updateJson){
 *     stateCtrl.setJsonData(updateJson);
 *   });
 *
 * @example nofify method (parameter single only)
 *   global.MockOvserve.notify('xxxxx_xxxxx_xxxxx', { param: 'PARAM' });
 **/
window.WorkerOvserve = window.WorkerOvserve || (function () {

  function Ovserve() {
    this._Map = new Map();
  }

  // set ovserver
  Ovserve.prototype.observe = function (name, fnc) {
    var funcs = this._Map.get(name) || [];
    funcs.push(fnc);
    this._Map.set(name, funcs);
  };

  // remove ovserver
  Ovserve.prototype.unobserve = function (name, func) {
    var funcs = this._Map.get(name) || [];
    this._Map.set(name, funcs.filter(function (_func) {
      return _func !== func;
    }));
  };

  // notify ovserve
  Ovserve.prototype.notify = function (name) {
    var args = Array.prototype.slice.call(arguments, 1);
    /* istanbul ignore next */
    (this._Map.get(name) || []).forEach(function (func, index) {
      func.apply(null, args);
    });
  };

  return new Ovserve();
})();

/* istanbul ignore next */
if (window.Worker) {

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

  var _worker = new Worker(`${current.substr(0, current.lastIndexOf('/'))}/worker.js`);

  // @MEMO gpioとi2cのObserverを分けた意味は「まだ」特にない
  window.WorkerOvserve.observe('gpio', function (jsonData) {
    var ab = json2ab(jsonData);
    _worker.postMessage(ab.buffer, [ab.buffer]);
  });

  window.WorkerOvserve.observe('i2c', function (jsonData) {
    var ab = json2ab(jsonData);
    _worker.postMessage(ab.buffer, [ab.buffer]);
  });

  _worker.onmessage = function (e) {
    var data = ab2json(e.data);
    window.WorkerOvserve.notify(data.method, data);
  };
}
