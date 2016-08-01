// @TODO Worker動く迄pending
describe('GPIOPort', () => {
  var port;
  beforeEach(()=> {
    port = new GPIOPort(256);
  });
  describe('instance', () => {
    it('create', () => {
      expect(port).not.toBeUndefined();
    });
  });
  describe('propaty(default)', () => {
    it('portNumber', () => expect(port.portNumber).toBe(256));
    it('portName', () => expect(port.portName).toBe(''));
    it('pinName', () => expect(port.pinName).toBe(''));
    it('direction', () => expect(port.direction).toBe(''));
    it('exported', () => expect(port.exported).toBe(false));
  });

  describe('export', ()=> {

    describe('success', ()=> {
      it('direction of out', done=> {
        port.export('out')
          .then(()=> {
            expect(port.exported).toBe(true);
            expect(port.direction).toBe('out');
          })
          .then(done)
          .catch(e=> expect(e.message).toBe('MATCH'));
      });

      it('direction of in', done=> {
        jasmine.clock().install();
        port.export('in')
          .then(()=> {
            jasmine.clock().tick(100);
            expect(port.exported).toBe(true);
            expect(port.direction).toBe('in');
            jasmine.clock().uninstall();
          })
          .then(done)
          .catch(e=> expect(e.message).toBe('MATCH'));
      });
      it('setInterval clear', done=> {
        port._timer = 1;
        port.export('out')
          .then(()=> expect(port._timer).toBe(1))
          .then(done)
          .catch(e=> expect(e.message).toBe('MATCH'));
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
        port.read()
          .then(result=> {
            expect(result).toBe(1);
            done();
          });
        setTimeout(()=> window.WorkerOvserve.notify('gpio.getValue.256', { value: 1 }), 100);
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
        port.write(1)
          .then(result=> {
            expect(result).toBe(1);
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
      it('if argment value not LOW or HIGH to the OperationError', done=> {
        port.write(-1)
          .catch(e=> {
            expect(e).toEqual(new Error('OperationError'));
            done();
          });
      });
    });
  });
  describe('onchange', ()=> {
    beforeEach(()=> {
      port.onchange = jasmine.createSpy('onchange');
    });
    it('change value to onchange event', done=>  {
      port.export('in')
        .then(()=> {
          window.WorkerOvserve.notify('gpio.onchange.256', { value: 1 });
          expect(port.onchange).toHaveBeenCalled();
          expect(port.onchange).toHaveBeenCalledWith(1);
          done();
        })
    });
  });
});
