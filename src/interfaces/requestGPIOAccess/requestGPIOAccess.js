/* istanbul ignore else */
if (!navigator.requestGPIOAccess) {
  navigator.requestGPIOAccess = function () {
    return new Promise(resolve=> resolve(new GPIOAccess()));
  };
}
