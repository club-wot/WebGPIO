// document
// https://rawgit.com/browserobo/WebI2C/master/index.html#navigator-I2C

var I2CAccess = function (port) {
  this.init(port);
};

I2CAccess.prototype = {
  init: function (port) {
    this.ports = new I2CPortMap();
    var convertToNumber = portStr => parseInt(portStr, 10);
    var setPortMap = port=> this.ports.set(port, new I2CPort(port));
    /**
    * @todo getI2C Ports
    ***/
    Object.keys(PORT_CONFIG.CHIRIMEN.I2C_PORTS)
      .map(convertToNumber)
      .forEach(setPortMap);
  },

  /**
  * @type {I2CPortMap}
  **/
  ports: null,
};
