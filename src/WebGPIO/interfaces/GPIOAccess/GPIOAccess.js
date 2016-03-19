// document
// https://rawgit.com/browserobo/WebGPIO/master/index.html#navigator-gpio

var GPIOAccess = function (port) {
  this.init(port);
};

GPIOAccess.prototype = {
  init: function (port) {
    this.ports = new GPIOPortMap();
    var convertToNumber = portStr => parseInt(portStr, 10);
    var setPortMap = port=> this.ports.set(port, new GPIOPort(port));
    /**
    * @todo How to get the pin list?
    ***/
    Object.keys(PORT_CONFIG.CHIRIMEN.PORTS).map(convertToNumber).forEach(setPortMap);
  },

  /**
  * The ports attribute must return the GPIOPortMap object representing all of the GPIO ports available on the underlying operating system.
  * @type {GPIOPortMap}
  **/
  ports: null,

  /**
  * Open issues: Is unexportAll necessary?
  * @todo: During implementation
  **/
  unexportAll: null,

  /**
  * The onchange attribute is a event handler invoked when the value of one of the exported GPIO ports changes
  * (i.e. the value changes from 1 to 0 or from 0 to 1). Whenever the event handler is to be invoked, the user agent must run the following steps:
  *  1. Let port be the GPIOPort object.
  *  2. Let port value be the value of the GPIO port corresponding to the GPIOPort.
  *  3. Let event be a newly constructed GPIOChangeEvent, with the value attribute set to the port value, and the port attribute set to the port.
  *  4. Fire an event named change at the GPIOAccess object, using the event as the event object.
  * @todo: During implementation
  **/
  onchange: null,
};
