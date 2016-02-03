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
});
