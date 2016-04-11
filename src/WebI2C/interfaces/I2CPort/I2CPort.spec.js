describe('I2CPort', () => {
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
    });
  });
});
