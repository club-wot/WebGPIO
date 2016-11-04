describe('GPIOAccess', () => {
  var gpio;
  beforeEach(()=> gpio = new GPIOAccess());
  describe('instance', () => {
    it('create', () => {
      expect(gpio).not.toBeUndefined();
    });
    it('return GPIOAccess', () => {
      expect(gpio).toEqual(jasmine.any(GPIOAccess));
    });
  });
  describe('propaty (default)', ()=> {
    it('ports', ()=> {
      expect(gpio.ports).toEqual(jasmine.any(GPIOPortMap));
    });
  });

  describe('chain calls', ()=>{
    it('checked secance', done=> {
      var testMock = val => {
        window.WorkerOvserve.notify(`gpio.export.${val.portNumber}`, {});
        if (val.portNumber === 353) {
          window.WorkerOvserve.unobserve(`gpio`, testMock);
          done();
        };
      };
      window.WorkerOvserve.observe(`gpio`, testMock);
      gpio = new GPIOAccess();
    });
  })
});
