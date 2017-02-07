describe('I2CPort().then(resolve)', () => {
  var port;
  beforeEach(()=> port = new I2CPort(2));
  describe('instance', () => {
    it('create', () => {
      expect(port).not.toBeUndefined();
    });
    it('return GPIOAccess', () => {
      expect(port).toEqual(jasmine.any(I2CPort));
    });
  });
  describe('propaty (default)', ()=> {
    it('portNumber', ()=> {
      expect(port.portNumber).toEqual(2);
    });
  });
  describe('method', ()=> {
    it('open', done=> {
      var promise = port.open(0x41);
      expect(promise).toEqual(jasmine.any(Promise));
      promise.then(slaveDevice=> {
        expect(slaveDevice).toEqual(jasmine.any(I2CSlaveDevice));
        done();
      })
      var slave = {slaveAddress:0x41};
      window.WorkerOvserve.notify('i2c.setDeviceAddress.2', { slaveDevice: slave});
    });
  });
});
describe('I2CPort().then(reject)', () => {
  var port;
  var porterr;
  beforeEach(()=> port = new I2CPort(4));
  describe('instance', () => {
    it('create', () => {
      expect(port).not.toBeUndefined();
    });
    it('return GPIOAccess', () => {
      expect(port).toEqual(jasmine.any(I2CPort));
    });
  });
  describe('method', ()=> {
    it('open', ()=> {
      var promise = port.open(9999);
      expect(promise).toEqual(jasmine.any(Promise));
      promise.then(slaveDevice=> {},(err)=>{
//        console.log("I2CPort.open().then(reject)");
        expect(err.message).not.toBeUndefined();
      });
      window.WorkerOvserve.notify('i2c.setDeviceAddress.4', { error: {name:"dummyError", message:"error"} });
    });
  });
});

