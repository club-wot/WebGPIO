describe('I2CSlaveDevice', () => {
  var slaveDevice;
  beforeEach(()=> {
    slaveDevice = new I2CSlaveDevice(2, 0x41);
    window.WorkerOvserve.notify('i2c.setDeviceAddress.2', { slaveDevice: 'slaveDevice' });
  });
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
    it('slaveAddress', ()=>expect(slaveDevice.slaveAddress).toBe(65));
    it('slaveDevice', ()=>expect(slaveDevice.slaveDevice).toBe('slaveDevice'));
  });
  describe('method', ()=> {
    it('read8', done=> {
      slaveDevice.read8(0x41)
        .then(value=>{
          expect(value).toEqual(2);
        })
        .then(()=> done());
      window.WorkerOvserve.notify('i2c.read.2.65', { value: 2 });
    });
    it('read16', done=> {
      slaveDevice.read16(0x41)
        .then(value=>{
          expect(value).toEqual(2);
        })
        .then(()=> done());
      window.WorkerOvserve.notify('i2c.read.2.65', { value: 2 });
    });
    it('write8', done=> {
      slaveDevice.write8(0x41, 0x42)
        .then(value=>{
          expect(value).toEqual(66);
        })
        .then(()=> done());
      window.WorkerOvserve.notify('i2c.write.2.65', { value: 66 });
    });
    it('write16', done=> {
      slaveDevice.write16(0x41, 0x42)
        .then(value=>{
          expect(value).toEqual(66);
        })
        .then(()=> done());
      window.WorkerOvserve.notify('i2c.write.2.65', { value: 66 });
    });
  });
});
