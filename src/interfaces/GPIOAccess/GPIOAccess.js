// document
// https://rawgit.com/browserobo/WebGPIO/master/index.html#navigator-gpio

var GPIOAccess = function (port) {
  this.init(port);
};

// https://docs.google.com/spreadsheets/d/1pVgK-Yy09p9PPgNgojQNLvsPjDFAOjOubgNsNYEQZt8/edit#gid=0
const CHIRIMEN_CONFIG = {
  PORTS: {
    CN1: [{
      port: 256, }, {
      port: 257, }, {
      port: 283, }, {
      port: 284, }, {
      port: 196, }, {
      port: 197, }, {
      port: 198, }, {
      port: 199, }, {
      port: 244, }, {
      port: 243, }, {
      port: 246, }, {
      port: 245, }, ],
    CN2: [{
      port: 163, }, {
      port: 253, }, {
      port: 252, }, {
      port: 193, }, {
      port: 192, }, {
      port: 353, }, ],
  },
};

GPIOAccess.prototype = {
  init: function (port) {
    this.ports = new GPIOPortMap();
    var setPortMap = config=> this.ports.set(config.port, new GPIOPort(config.port));
    /**
     * @todo How to get the pin list?
     ***/
    CHIRIMEN_CONFIG.PORTS.CN1.forEach(setPortMap);
    CHIRIMEN_CONFIG.PORTS.CN2.forEach(setPortMap);
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
