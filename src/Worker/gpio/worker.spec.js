
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
      gpioOnMessage(createMessageEvent({
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

      gpioOnMessage(createMessageEvent({
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
      gpioOnMessage(createMessageEvent({
        method: 'gpio.setDirection',
        portNumber: 256,
        direction: false,
      }));
      expect(navigator.mozGpio.setDirection).toHaveBeenCalled();
      expect(navigator.mozGpio.setDirection).toHaveBeenCalledWith(256, false);
      expect(intervalPortList).toEqual([{ portNumber: 256, value: void 0 }]);
    });
    it('gpio.setValue', ()=>{
      gpioOnMessage(createMessageEvent({
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
      gpioOnMessage(createMessageEvent({
        method: 'gpio.getValue',
        portNumber: 256,
      }));

      expect(navigator.mozGpio.getValue).toHaveBeenCalled();
      expect(navigator.mozGpio.getValue).toHaveBeenCalledWith(256);
    });
    it('other pattern', ()=>{
      expect(()=>{
        gpioOnMessage(createMessageEvent({
          method: 'foo.hoge',
          portNumber: 256,
        }));
      }).toThrow('Unexpected case to worker method');
    });
  });
});
