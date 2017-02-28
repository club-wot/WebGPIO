

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
//      navigator.mozI2c.setDeviceAddress = jasmine.createSpy();
//      navigator.mozI2c.write = jasmine.createSpy();
//      navigator.mozI2c.read = jasmine.createSpy().and.returnValue(Promise.resolve(1));
    });
    it('i2c.open', ()=>{
      onmessage(createMessageEvent({
        method: 'i2c.open',
        portNumber: 256,
      }));
      expect(navigator.mozI2c.open).toHaveBeenCalled();
      expect(navigator.mozI2c.open).toHaveBeenCalledWith(256);
    });

    it('i2c.setDeviceAddress().success', ()=>{
      window.postMessage = (value)=>{
        var data = ab2jsonWorker(value);
        expect(data.method).toEqual('i2c.setDeviceAddress.2');
        expect(data.portNumber).toEqual(2);
      };
      onmessage(createMessageEvent({
        method: 'i2c.setDeviceAddress',
        portNumber: 2,
        slaveAddress: 0x40,
      }));
    });
    it('i2c.setDeviceAddress().error', ()=>{
      window.postMessage = (value)=>{
        var data = ab2jsonWorker(value);
        expect(data.method).toEqual('i2c.setDeviceAddress.256');
        expect(data.portNumber).toEqual(256);
        expect(data.error).not.toBeUndefined();
      };
      onmessage(createMessageEvent({
        method: 'i2c.setDeviceAddress',
        portNumber: 256,  // out of range
        slaveAddress: 0x40,
      }));
    });

    it('i2c.write().success', ()=>{
      window.postMessage = (value)=>{
        var data = ab2jsonWorker(value);
        expect(data.method).toEqual('i2c.write.0.2.32.65');
        expect(data.portNumber).toEqual(2);
      };
      onmessage(createMessageEvent({
        method: 'i2c.write',
        xid: 0,
        portNumber: 2,
        slaveAddress: 0x20,
        registerNumber: 65,
        value: 0x42,
        aIsOctet: true,
      }));
    });
    it('i2c.write().error', ()=>{
      window.postMessage = (value)=>{
        var data = ab2jsonWorker(value);
        expect(data.method).toEqual('i2c.write.1.2.255.65');
        expect(data.portNumber).toEqual(2);
      };
      onmessage(createMessageEvent({
        method: 'i2c.write',
        xid: 1,
        portNumber: 2,
        slaveAddress: 0xff, // out of range
        registerNumber: 65,
        value: 0x42,
        aIsOctet: true,
      }));
    });

    it('i2c.read().success', ()=>{
      window.postMessage = (value)=>{
        var data = ab2jsonWorker(value);
        expect(data.method).toEqual('i2c.read.2.2.33.67');
        expect(data.portNumber).toEqual(2);
      };
      onmessage(createMessageEvent({
        method: 'i2c.read',
        xid: 2,
        portNumber: 2,
        slaveAddress: 0x21,
        readRegistar: 0x43,
        aIsOctet: true,
      }));
    });

    it('i2c.read().error', ()=>{
      window.postMessage = (value)=>{
        var data = ab2jsonWorker(value);
        expect(data.method).toEqual('i2c.read.2.8.33.67');
        expect(data.portNumber).toEqual(8);
      };
      onmessage(createMessageEvent({
        method: 'i2c.read',
        xid: 2,
        portNumber: 8,  // out of range
        slaveAddress: 0x21, 
        readRegistar: 0x43,
        aIsOctet: true,
      }));
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
