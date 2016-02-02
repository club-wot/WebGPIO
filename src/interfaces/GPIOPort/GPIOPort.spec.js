describe('GPIOPort', () => {
  var port;
  beforeEach(()=> port = new GPIOPort(100));
  describe('instance', () => {
    it('create', () => {
      expect(port).not.toBeUndefined();
    });
  });
  describe('propaty(default)', () => {
    it('portNumber', () => expect(port.portNumber).toBe(100));
    it('portName', () => expect(port.portName).toBe(''));
    it('pinName', () => expect(port.pinName).toBe(''));
    it('direction', () => expect(port.direction).toBe(''));
    it('exported', () => expect(port.exported).toBe(false));
  });

  describe('export', ()=> {

    describe('success', ()=> {
      beforeEach(()=> {
        navigator.mozGpio.setDirection =  jasmine.createSpy('setDirection');
        port.__checkValue =  jasmine.createSpy('__checkValue');
      });
      it('direction of out', done=> {
        port.export('out')
          .then(()=> {
            expect(port.exported).toBe(true);
            expect(port.direction).toBe('out');
            expect(navigator.mozGpio.setDirection).toHaveBeenCalled();
            expect(navigator.mozGpio.setDirection).toHaveBeenCalledWith(100, true);
          })
          .then(done)
          .catch(e=> expect('NOT').toBe('MATCH'));
      });

      it('direction of in', done=> {
        jasmine.clock().install();
        port.export('in')
          .then(()=> {
            jasmine.clock().tick(100);
            expect(port.exported).toBe(true);
            expect(port.direction).toBe('in');
            expect(navigator.mozGpio.setDirection).toHaveBeenCalled();
            expect(navigator.mozGpio.setDirection).toHaveBeenCalledWith(100, false);
            expect(port.__checkValue).toHaveBeenCalled();
            jasmine.clock().uninstall();
          })
          .then(done)
          .catch(e=> expect('NOT').toBe('MATCH'));
      });
      it('setInterval clear', done=> {
        port._timer = 1;
        port.export('out')
          .then(()=> expect(port._timer).toBe(1))
          .then(done)
          .catch(e=> expect('NOT').toBe('MATCH'));
      });
    });

    describe('failure', ()=> {
      it('direction of undefined', done=> {
        port.export(void 0)
          .catch(e=> {
            expect(e).toEqual(new Error('InvalidAccessError'));
            expect(port.exported).toBe(false);
            expect(port.direction).toBe('');
            done();
          });
      });
    });
  });
  xdescribe('unexport');

  describe('read', ()=> {
    beforeEach(done=> port.export('in').then(done));
    describe('sucess', ()=> {
      it('Call resolver accept(value) method with port value as value argument. Abort these steps', done=> {
        navigator.mozGpio.getValue = jasmine.createSpy().and.returnValue(1);
        port.read()
          .then(result=> {
            expect(result).toBe(1);
            expect(navigator.mozGpio.getValue).toHaveBeenCalled();
            expect(navigator.mozGpio.getValue).toHaveBeenCalledWith(100);
            done();
          });
      });
    });

    describe('failure', ()=> {
      it('if exported false to the InvalidAccessError', done=> {
        port.exported = false;
        port.read()
          .catch(e=> {
            expect(e).toEqual(new Error('InvalidAccessError'));
            done();
          });
      });
      it('if direction not in to the OperationError', done=> {
        port.exported = true;
        port.direction = 'out';
        port.read()
          .catch(e=> {
            expect(e).toEqual(new Error('OperationError'));
            done();
          });
      });
    });
  });
  describe('write', ()=> {
    beforeEach(done=> port.export('out').then(done));
    describe('sucess', ()=> {
      it('Call resolver accept(value) method with port value as value argument. Abort these steps', done=> {
        navigator.mozGpio.setValue = jasmine.createSpy('setValue');
        port.write(1)
          .then(result=> {
            expect(result).toBe(1);
            expect(navigator.mozGpio.setValue).toHaveBeenCalled();
            expect(navigator.mozGpio.setValue).toHaveBeenCalledWith(100, 1);
            done();
          });
      });
    });
    describe('failure', ()=> {
      it('if exported false to the InvalidAccessError', done=> {
        port.exported = false;
        port.write(1)
          .catch(e=> {
            expect(e).toEqual(new Error('InvalidAccessError'));
            done();
          });
      });
      it('if direction out to the OperationError', done=> {
        port.direction = 'in';
        port.write(1)
          .catch(e=> {
            expect(e).toEqual(new Error('OperationError'));
            done();
          });
      });
      it('if argment value not ROW or HIGH to the OperationError', done=> {
        port.write(-1)
          .catch(e=> {
            expect(e).toEqual(new Error('OperationError'));
            done();
          });
      });
    });
  });
  describe('onchange', ()=> {
    it('spec...');
  });
  describe('== private method ==', ()=> {
    describe('__checkValue(onchange event impliments)', ()=> {
      beforeEach(()=> {
        navigator.mozGpio.getValue = jasmine.createSpy().and.returnValue(1);
        port.onchange = jasmine.createSpy('onchange');
        port.exported = true;
        port.direction = 'in';
      });

      it('If firing the event is there value is different', done=> {
        port.value = 0;
        port.__checkValue(port)
          .then(()=> {
            expect(port.onchange).toHaveBeenCalled();
            expect(port.onchange).toHaveBeenCalledWith(port);
            done();
          });
      });

      it('Value does not ignite it the same', done=> {
        port.value = 1;
        port.__checkValue(port)
            .then(()=> {
              expect(port.onchange).not.toHaveBeenCalled();
              done();
            });
      });

      it('If the event is not set', done=> {
        port.onchange = void 0;
        port.value = 0;
        port.__checkValue(port)
            .then(()=> {
              done();
            });
      });
    });
  });
});
