

describe('worker.onmessage', () => {
  afterEach(()=> {
    window.postMessage = () => {};
  });
  const createMessageEvent = (data) => ({
    data: json2abWorker(data),
  });

  describe('i2c', ()=>{
    beforeEach(()=>{
      navigator.mozI2c.open = jasmine.createSpy();
      navigator.mozI2c.setDeviceAddress = jasmine.createSpy();
      navigator.mozI2c.write = jasmine.createSpy();
      navigator.mozI2c.read = jasmine.createSpy().and.returnValue(Promise.resolve(1));
    });
    it('i2c.open', ()=>{
      onmessage(createMessageEvent({
        method: 'i2c.open',
        portNumber: 256,
      }));
      expect(navigator.mozI2c.open).toHaveBeenCalled();
      expect(navigator.mozI2c.open).toHaveBeenCalledWith(256);
    });
    it('i2c.setDeviceAddress', ()=>{
      window.postMessage = (value)=>{
        expect(ab2jsonWorker(value)).toEqual({ method: 'i2c.setDeviceAddress.256', portNumber: 256 });
      };
      onmessage(createMessageEvent({
        method: 'i2c.setDeviceAddress',
        portNumber: 256,
        slaveAddress: 0x40,
      }));
      expect(navigator.mozI2c.setDeviceAddress).toHaveBeenCalled();
      expect(navigator.mozI2c.setDeviceAddress).toHaveBeenCalledWith(256, 64);
    });
    it('i2c.write', ()=>{
      window.postMessage = (value)=>{
        expect(ab2jsonWorker(value)).toEqual({ method: 'i2c.write.256.65', portNumber: 256 });
      };
      onmessage(createMessageEvent({
        method: 'i2c.write',
        portNumber: 256,
        registerNumber: 0x41,
        value: 0x42,
        aIsOctet: true,
      }));
      expect(navigator.mozI2c.write).toHaveBeenCalled();
      expect(navigator.mozI2c.write).toHaveBeenCalledWith(256, 65, 66, true);
    });
    it('i2c.read', done=>{
      window.postMessage = (value)=>{
        expect(ab2jsonWorker(value)).toEqual({ method: 'i2c.read.256.67', portNumber: 256, value: 1 });
        done();
      };
      onmessage(createMessageEvent({
        method: 'i2c.read',
        portNumber: 256,
        readRegistar: 0x43,
        aIsOctet: true,
      }));
      expect(navigator.mozI2c.read).toHaveBeenCalled();
      expect(navigator.mozI2c.read).toHaveBeenCalledWith(256, 67, true);
    });
  });
  it('other pattern', ()=>{
    expect(()=>{
      onmessage(createMessageEvent({
        method: 'foo.hoge',
        portNumber: 256,
      }));
    }).toThrow('Unexpected case to worker method');
  });
});
