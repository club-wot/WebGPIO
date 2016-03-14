/* istanbul ignore else */
if (!navigator.requestI2CAccess) {
  navigator.requestI2CAccess = function () {
    return Promise.resolve(new I2CAccess());
  };
}
