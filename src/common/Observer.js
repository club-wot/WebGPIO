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

  // delete map
  // delete
  Ovserve.prototype.delete = function (name) {
    this._Map.delete(name);
  };

  return new Ovserve();
})();
