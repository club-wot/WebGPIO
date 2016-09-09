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
        if (ab2jsonWorker(value).method === 'gpio.getValue.256'){
          expect(ab2jsonWorker(value)).toEqual({ method: 'gpio.getValue.256', portNumber: 256, value: 1 });
          done();
        }
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
    it('i2c.setDeviceAddress', done=>{
      window.postMessage = (value)=>{
        if(ab2jsonWorker(value).method === 'i2c.setDeviceAddress.256') {
          expect(navigator.mozI2c.setDeviceAddress).toHaveBeenCalled();
          expect(navigator.mozI2c.setDeviceAddress).toHaveBeenCalledWith(256, 64);
          expect(ab2jsonWorker(value)).toEqual({ method: 'i2c.setDeviceAddress.256', portNumber: 256 });
          done();
        }
      };
      onmessage(createMessageEvent({
        method: 'i2c.setDeviceAddress',
        portNumber: 256,
        slaveAddress: 0x40,
      }));
    });
    it('i2c.write', done=>{
      window.postMessage = (value)=>{
        if (ab2jsonWorker(value).method === 'i2c.write.256.65') {
          expect(navigator.mozI2c.write).toHaveBeenCalled();
          expect(navigator.mozI2c.write).toHaveBeenCalledWith(256, 65, 66, true);
          expect(ab2jsonWorker(value)).toEqual({ method: 'i2c.write.256.65', portNumber: 256 });
          done();
        }
      };
      onmessage(createMessageEvent({
        method: 'i2c.write',
        portNumber: 256,
        registerNumber: 0x41,
        value: 0x42,
        aIsOctet: true,
      }));
    });
    it('i2c.read', done=>{
      window.postMessage = (value)=>{
        if(ab2jsonWorker(value).method === 'i2c.read.256.67') {
          expect(ab2jsonWorker(value)).toEqual({ method: 'i2c.read.256.67', portNumber: 256, value: 1 });
          done();
        }
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

  describe('worker.eventQueue', () => {
    it('new', ()=> {
      let que = new Queue();
      expect(que.__que).toEqual([]);
    });
    it('push and view', ()=> {
      let que = new Queue();
      let baseTime = new Date(2013, 9, 23, 0, 0, 0, 0);
      jasmine.clock().mockDate(baseTime);
      que.push('type',{ test:'test' });
      expect(que.view()).toEqual([ { type: 'type', timing: 1382454000000, value: { test: 'test' } } ]);
    });
    it('push overflow (max 499) & queue', ()=>{
      let que = new Queue();

      [for (i of Array(1000).keys()) i].forEach(val=>que.push('type',val));
      expect(que.view().length).toBe(499);
      expect(que.view()[0]).toEqual({type: 'type', timing: 1382454000000, value: 501 });
      expect(que.view()[498]).toEqual({type: 'type', timing: 1382454000000, value: 999 });
    });
  });

  describe('debug.polyfill', () => {
    it('debug.polyfill.gpio.value.change',()=>{
      navigator.mozGpio.isPolyfill = true;
      navigator.mozGpio.setValue = jasmine.createSpy();
      onmessage(createMessageEvent({
        method: 'debug.polyfill.gpio.value.change',
        portNumber: 257,
        value: 1,
      }));
      expect(navigator.mozGpio.setValue).toHaveBeenCalled();
      expect(navigator.mozGpio.setValue).toHaveBeenCalledWith(257, 1);
      navigator.mozGpio.isPolyfill = void 0;

      navigator.mozGpio.setValue = jasmine.createSpy();
      onmessage(createMessageEvent({
        method: 'debug.polyfill.gpio.value.change',
        portNumber: 257,
        value: 1,
      }));
      expect(navigator.mozGpio.setValue).not.toHaveBeenCalled();
      navigator.mozGpio.isPolyfill = true;
    });
    it('debug.polyfill.i2c.read.resolve', done=>{
      navigator.mozI2c.isPolyfill = true;

      onmessage(createMessageEvent({
        method: 'debug.polyfill.i2c.read.resolve',
        portNumber: 256,
        readRegistar: 0x43,
        aIsOctet: true,
        value: 100,
      }));

      window.postMessage = (value)=>{
        if(ab2jsonWorker(value).method === 'i2c.read.256.67'){
          expect(ab2jsonWorker(value)).toEqual({ method: 'i2c.read.256.67', portNumber: 256, value: 100 });
          navigator.mozI2c.isPolyfill = void 0;
          onmessage(createMessageEvent({method: 'debug.polyfill.i2c.read.resolve'}));
          navigator.mozI2c.isPolyfill = true;

          done();
        }
      };

      onmessage(createMessageEvent({
        method: 'i2c.read',
        portNumber: 256,
        readRegistar: 0x43,
        aIsOctet: true,
      }));

    });
    it('debug.polyfill.i2c.read.reject', done=>{
      navigator.mozI2c.isPolyfill = true;

      onmessage(createMessageEvent({
        method: 'debug.polyfill.i2c.read.reject',
        portNumber: 256,
        readRegistar: 0x43,
        aIsOctet: true,
        value: 'Reject!!',
      }));

      window.postMessage = (value)=>{
        if(ab2jsonWorker(value).method === 'i2c.read.256.67'){
          expect(ab2jsonWorker(value)).toEqual({ method: 'i2c.read.256.67', portNumber: 256, value: 'Reject!!' });
          navigator.mozI2c.isPolyfill = void 0;
          onmessage(createMessageEvent({method: 'debug.polyfill.i2c.read.reject'}));
          navigator.mozI2c.isPolyfill = true;

          done();
        }
      };

      onmessage(createMessageEvent({
        method: 'i2c.read',
        portNumber: 256,
        readRegistar: 0x43,
        aIsOctet: true,
      }));

    });
    it('debug.polyfill.events.get', done=> {

      let baseTime = new Date(2013, 9, 23, 0, 0, 0, 0);
      jasmine.clock().mockDate(baseTime);

      window.postMessage = (value)=>{
        var jsonVal = ab2jsonWorker(value);
        
        if (jsonVal.method === 'debug.polyfill.events.get') {
          var dataObj = JSON.parse(jsonVal.value);
          expect(dataObj[0]).toEqual({  
               type:'postMessage',
               timing:1382454000000,
               value:{  
                  method:'debug.polyfill.events.clear'
               }
            });
          expect(dataObj[1]).toEqual({
               type:'onmessage',
               timing:1382454000000,
               value:{  
                  method:'debug.polyfill.events.get'
               }
            });
          setTimeout(()=> done(), 100);
        } else if(jsonVal.method === 'debug.polyfill.events.clear') {
          onmessage(createMessageEvent({
            method: 'debug.polyfill.events.get'
          }));
        }
      };

      onmessage(createMessageEvent({
        method: 'debug.polyfill.events.clear'
      }));

    });
  });

});
