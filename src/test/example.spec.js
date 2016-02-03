describe('example', () => {
  it('4.1 Getting Access to the GPIO', done=> {
    navigator.requestGPIOAccess().then(function(gpioAccess) {
      expect(gpioAccess).toEqual(jasmine.any(GPIOAccess));
      done();
    });
  });
  // @todo portName and pinName
  it('4.2 Listing GPIO ports (CHIRIMEN CN.1 pin2)', done=> {
    navigator.requestGPIOAccess().then(gpioAccess=> {
      expect(gpioAccess.ports).toEqual(jasmine.any(GPIOPortMap));
      done();
    });
  });
  /**
  * @todo gpio.ports.get(18).then()
  **/
  it('4.3 Getting a GPIO port (CHIRIMEN CN.1 pin2)', done=> {
    navigator.requestGPIOAccess().then(gpioAccess=> {
      var port = gpioAccess.ports.get(256);
      expect(port.portNumber).toBe(256);
      done();
    });
  });
  it('4.4 Activating a GPIO port and read the value (CHIRIMEN CN.1 pin2)', done=> {
    navigator.mozGpio.export = jasmine.createSpy();
    navigator.mozGpio.getValue = jasmine.createSpy().and.returnValue(1);

    navigator.requestGPIOAccess()
      .then(gpioAccess=> gpioAccess.ports.get(256))
      .then(port=> new Promise((resolve,reject)=> port.export('in').then(()=> resolve(port)).catch(reject)))
      .then(port=> new Promise((resolve,reject)=> port.read().then(value=> resolve({ port: port, value: value })).catch(reject)))
      .then(args=>{
        expect(args.port.exported).toBe(true);
        expect(args.port.direction).toBe('in');
        expect(navigator.mozGpio.setDirection).toHaveBeenCalled();
        expect(navigator.mozGpio.setDirection).toHaveBeenCalledWith(100, false);
      })
      .then(done)
      .catch(e=> expect(e.message).toBe('EXCEPTION'));
  });
  it('4.5 Listening to changes of a GPIO port value (CHIRIMEN CN.1 pin2)');
  it('4.6 Listening to changes of multiple GPIO port values (CHIRIMEN CN.1 pin2)');
  it('4.7 Writing a value to a GPIO port (CHIRIMEN CN.1 pin2)');
});
