describe('example', () => {
  it('4.1 Getting Access to the I2C', done=> {
    navigator.requestI2CAccess().then(I2C => {
        expect(I2C).toEqual(jasmine.any(I2CAccess));
        done();
      });
  });
  it('4.2 Listing I2C ports', done=> {
    navigator.requestI2CAccess().then(
      function(I2C) {
        expect(I2C.ports).toEqual(jasmine.any(I2CPortMap));
        done();
      });
  });
  it('4.3 Getting a I2C port', done=> {
    navigator.requestI2CAccess()
      .then(I2C => I2C.ports.get(2))
      .then(port=> {
        expect(port).toEqual(jasmine.any(I2CPort));
        done();
      });
  });
  it('[T.B.D] 4.4 Listing I2C slaves');
  it('4.5 Getting a slave device', done=> {
    navigator.requestI2CAccess()
      .then(I2C => I2C.ports.get(2))
      .then(port => port.open(0x40))
      .then(slaveDevice=> {
        expect(slaveDevice).toEqual(jasmine.any(I2CSlaveDevice));
        done();
      });
  });
  it('4.6 Reading the value', done=> {
    navigator.mozI2c.read = jasmine.createSpy().and.returnValue(100);
    navigator.requestI2CAccess()
      .then(I2C => I2C.ports.get(2))
      .then(port => port.open(0x40))
      .then(slaveDevice=> slaveDevice.read8(0x41))
      .then(value=> {
        expect(value).toBe(100);
        expect(navigator.mozI2c.read).toHaveBeenCalled();
        expect(navigator.mozI2c.read).toHaveBeenCalledWith(2,65, true);
        done();
      });
  });
  it('[T.B.D] 4.7 Listening to changes of a spefific I2C slave device');
  it('4.8 Writing a value', done=> {
    navigator.mozI2c.write = jasmine.createSpy().and.returnValue(100);
    navigator.requestI2CAccess()
      .then(I2C => I2C.ports.get(2))
      .then(port => port.open(0x40))
      .then(slaveDevice=> slaveDevice.write8(0x41, 0x42))
      .then(value=> {
        expect(value).toBe(66);
        expect(navigator.mozI2c.write).toHaveBeenCalled();
        expect(navigator.mozI2c.write).toHaveBeenCalledWith(2, 65, 66, true);
        done();
      }).catch(e=> console.log(e.message));
  });
});
