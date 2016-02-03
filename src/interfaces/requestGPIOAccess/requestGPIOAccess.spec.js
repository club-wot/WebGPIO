describe('requestGPIOAccess', () => {
  var primise;
  beforeEach(()=> primise = navigator.requestGPIOAccess());
  describe('instance', () => {
    it('create', () => {
      expect(primise).not.toBeUndefined();
    });
    it('return Promise', () => {
      expect(primise).toEqual(jasmine.any(Promise));
    });
    it('Promise<GPIOAccess>', done => {
      primise.then(gpio=>{
        expect(gpio).toEqual(jasmine.any(GPIOAccess));
        done();
      });
    });
  });
});
