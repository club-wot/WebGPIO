describe('ConvertArrayBuffer', () => {
  var expectArrayBuffer = [123 ,34 ,109 ,97 ,116 ,99 ,104 ,34 ,58 ,34 ,116 ,111 ,111 ,34 ,125];
  var expectJson = { match:'too' };

  it('array buffer to json', ()=> {
    var convertAry = json2abWorker(expectJson);
    expectArrayBuffer.forEach((v, i) => expect(convertAry[i]).toBe(v));
  });

  it('json to array buffer', ()=> {
    var expectAry = new Uint16Array(expectArrayBuffer.length);
    expectArrayBuffer.forEach((v, i) => expectAry[i] = v);

    expect(ab2jsonWorker(expectAry)).toEqual(expectJson);
  });
});

describe('onChangeIntervalEvent', () => {
  afterEach(()=> {
    window.postMessage = () => {};
  })
  it('notify message', done=>{
    intervalPortList = [{
      portNumber: 256,
      value: null,
    }];
    window.postMessage = (value)=>{
      expect(ab2jsonWorker(value)).toEqual({ method: 'gpio.onchange.256', portNumber: 256, value: 1 });
      expect(intervalPortList[0]).toEqual({ portNumber: 256, value: 1 });
      done();
    };
    navigator.mozGpio.getValue = jasmine.createSpy().and.returnValue(Promise.resolve(1));
    onChangeIntervalEvent();
    expect(navigator.mozGpio.getValue).toHaveBeenCalled();
    expect(navigator.mozGpio.getValue).toHaveBeenCalledWith(256);
  });
  it('match value', ()=>{
    intervalPortList = [{
      portNumber: 256,
      value: 1,
    }];
    window.postMessage = jasmine.createSpy();
    navigator.mozGpio.getValue = jasmine.createSpy().and.returnValue(Promise.resolve(1));
    onChangeIntervalEvent();
    expect(navigator.mozGpio.getValue).toHaveBeenCalled();
    expect(navigator.mozGpio.getValue).toHaveBeenCalledWith(256);
    expect(window.postMessage).not.toHaveBeenCalled();
  })
});
describe('worker.onmessage', () => {
  afterEach(()=> {
    window.postMessage = () => {};
  });
  const createMessageEvent = (data) => ({
    data: json2abWorker(data),
  });
  describe('gpio', ()=>{
    beforeEach(()=>{
      navigator.mozGpio.export = jasmine.createSpy();
      navigator.mozGpio.setDirection = jasmine.createSpy();
      navigator.mozGpio.setValue = jasmine.createSpy();
      navigator.mozGpio.getValue = jasmine.createSpy().and.returnValue(Promise.resolve(1));
    })
    it('gpio.export', ()=>{
      onmessage(createMessageEvent({
        method: 'gpio.export',
        portNumber: 256,
      }));
      expect(navigator.mozGpio.export).toHaveBeenCalled();
      expect(navigator.mozGpio.export).toHaveBeenCalledWith(256);
    });
    it('gpio.setDirection direction true', ()=>{

      intervalPortList = [{
        portNumber: 256,
        value: void 0,
      },{
        portNumber: 257,
        value: void 0,
      }];

      onmessage(createMessageEvent({
        method: 'gpio.setDirection',
        portNumber: 256,
        direction: true,
      }));
      expect(navigator.mozGpio.setDirection).toHaveBeenCalled();
      expect(navigator.mozGpio.setDirection).toHaveBeenCalledWith(256, true);
      expect(intervalPortList).toEqual([{ portNumber: 257, value: void 0, }]);
    });
    it('gpio.setDirection direction false', ()=>{
      intervalPortList = [];
      onmessage(createMessageEvent({
        method: 'gpio.setDirection',
        portNumber: 256,
        direction: false,
      }));
      expect(navigator.mozGpio.setDirection).toHaveBeenCalled();
      expect(navigator.mozGpio.setDirection).toHaveBeenCalledWith(256, false);
      expect(intervalPortList).toEqual([{ portNumber: 256, value: void 0 }]);
    });
    it('gpio.setValue', ()=>{
      onmessage(createMessageEvent({
        method: 'gpio.setValue',
        portNumber: 256,
        value: 1,
      }));
      expect(navigator.mozGpio.setValue).toHaveBeenCalled();
      expect(navigator.mozGpio.setValue).toHaveBeenCalledWith(256, 1);
    });
    it('gpio.getValue', done=>{
      window.postMessage = (value)=>{
        expect(ab2jsonWorker(value)).toEqual({ method: 'gpio.getValue.256', portNumber: 256, value: 1 });
        done();
      };
      onmessage(createMessageEvent({
        method: 'gpio.getValue',
        portNumber: 256,
      }));

      expect(navigator.mozGpio.getValue).toHaveBeenCalled();
      expect(navigator.mozGpio.getValue).toHaveBeenCalledWith(256);
    });
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
        expect(ab2jsonWorker(value)).toEqual({ method: 'i2c.write.256', portNumber: 256 });
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
        expect(ab2jsonWorker(value)).toEqual({ method: 'i2c.read.256', portNumber: 256, value: 1 });
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
