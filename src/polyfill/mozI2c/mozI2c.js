/* istanbul ignore next */
if (!navigator.mozI2c) {
  navigator.mozI2c = new Object();
  navigator.mozI2c.open = () => void 0;
  navigator.mozI2c.setDeviceAddress = () => void 0;
  navigator.mozI2c.read = () => Promise.resolve(1);
  navigator.mozI2c.write = () => Promise.resolve(void 0);
}
