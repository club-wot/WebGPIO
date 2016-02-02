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
      beforeEach(()=>{
        navigator.mozGpio.setDirection =  jasmine.createSpy('setDirection');
        port.__checkValue =  jasmine.createSpy('__checkValue');
      })
      it('direction of out',done=>{
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

      it('direction of in',done=> {
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
      it ('setInterval clear', done=>{
          port._timer = 1;
          port.export('out')
            .then(()=> expect(port._timer).toBe(1))
            .then(done)
            .catch(e=> expect('NOT').toBe('MATCH'));
        });
    });

    describe('failure', ()=>{
      it('direction of undefined', done=> {
        port.export(void 0)
          .then(e=> expect('NOT').toBe('MATCH'))
          .catch(e=> {
            expect(e).toEqual(new Error('InvalidAccessError'));
            expect(port.exported).toBe(false);
            expect(port.direction).toBe('');
            done();
          });
      });
    });
  });
  describe('unexport', ()=> {
    it('spec...');
  });
  describe('read', ()=> {
    it('spec...');
  });
  describe('write', ()=> {
    it('spec...');
  });
  describe('onchange', ()=> {
    it('spec...');
  });
});
