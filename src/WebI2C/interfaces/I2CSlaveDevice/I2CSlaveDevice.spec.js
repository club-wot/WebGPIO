describe('I2CSlaveDevice', () => {
  var slaveDevice;
  beforeEach(()=> slaveDevice = new I2CSlaveDevice(2));
  describe('instance', () => {
    it('create', () => {
      expect(slaveDevice).not.toBeUndefined();
    });
    it('return GPIOAccess', () => {
      expect(slaveDevice).toEqual(jasmine.any(I2CSlaveDevice));
    });
  });
  describe('propaty (default)', ()=> {
    it('portNumber', ()=>expect(slaveDevice.portNumber).toEqual(2));
    it('slaveAddress', ()=>expect(slaveDevice.slaveAddress).toBeUndefined());
    it('slaveDevice', ()=>expect(slaveDevice.slaveDevice).toBeUndefined());
  });
  describe('method', ()=> {
    it('read8', done=> {
      navigator.mozI2c.read = jasmine.createSpy().and.returnValue(2);
      slaveDevice.read8(0x41)
        .then(value=>{
          expect(value).toEqual(2);
          expect(navigator.mozI2c.read).toHaveBeenCalled();
          expect(navigator.mozI2c.read).toHaveBeenCalledWith(2,65, true);
        })
        .then(()=> done());
    });
    it('read16', done=> {
      navigator.mozI2c.read = jasmine.createSpy().and.returnValue(2);
      slaveDevice.read16(0x41)
        .then(value=>{
          expect(value).toEqual(2);
          expect(navigator.mozI2c.read).toHaveBeenCalled();
          expect(navigator.mozI2c.read).toHaveBeenCalledWith(2,65, true);
        })
        .then(()=> done());
    });
    it('write8', done=> {
      navigator.mozI2c.write = jasmine.createSpy().and.returnValue(2);
      slaveDevice.write8(0x41, 0x42)
        .then(value=>{
          expect(value).toEqual(66);
          expect(navigator.mozI2c.write).toHaveBeenCalled();
          expect(navigator.mozI2c.write).toHaveBeenCalledWith(2,65,66, true);
        })
        .then(()=> done());
    });
    it('write16', done=> {
      navigator.mozI2c.write = jasmine.createSpy().and.returnValue(2);
      slaveDevice.write16(0x41, 0x42)
        .then(value=>{
          expect(value).toEqual(66);
          expect(navigator.mozI2c.write).toHaveBeenCalled();
          expect(navigator.mozI2c.write).toHaveBeenCalledWith(2,65,66, true);
        })
        .then(()=> done());
    });
  });
});
