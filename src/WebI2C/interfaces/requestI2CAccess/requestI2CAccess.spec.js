describe('requestI2CAccess', () => {
  var primise;
  beforeEach(()=> primise = navigator.requestI2CAccess());
  describe('instance', () => {
    it('create', () => {
      expect(primise).not.toBeUndefined();
    });
    it('return Promise', () => {
      expect(primise).toEqual(jasmine.any(Promise));
    });
    it('Promise<I2CAccess>', done => {
      primise.then(gpio=>{
        expect(gpio).toEqual(jasmine.any(I2CAccess));
        done();
      });
    });
  });
});
