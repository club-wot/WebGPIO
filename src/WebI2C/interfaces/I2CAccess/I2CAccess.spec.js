describe('I2CAccess', () => {
  var i2c;
  beforeEach(()=> i2c = new I2CAccess());
  describe('instance', () => {
    it('create', () => {
      expect(i2c).not.toBeUndefined();
    });
    it('return GPIOAccess', () => {
      expect(i2c).toEqual(jasmine.any(I2CAccess));
    });
  });
  describe('propaty (default)', ()=> {
    it('ports', ()=> {
      expect(i2c.ports).toEqual(jasmine.any(I2CPortMap));
    });
  });
});
