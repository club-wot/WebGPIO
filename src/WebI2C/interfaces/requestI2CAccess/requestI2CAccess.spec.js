describe('requestI2CAccess', () => {
  describe('instance', () => {
    var primise;
    beforeEach(()=> primise = navigator.requestI2CAccess());
    it('create', () => {
      expect(primise).not.toBeUndefined();
    });
  });
});
