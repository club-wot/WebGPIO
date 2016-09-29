/* istanbul ignore else */
if (!navigator.requestGPIOAccess) {
  navigator.requestGPIOAccess = function () {
    //return new Promise(resolve=> resolve(new GPIOAccess()));

    var gpioAccess = new GPIOAccess();
    return gpioAccess.GPIOAccessThen.then(()=> gpioAccess);
  };
}
