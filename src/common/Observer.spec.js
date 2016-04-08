describe('WorkerOvserve', () => {
  it('set observe and notify', done=> {
    WorkerOvserve.observe('WorkerOvserve.test.setObserver', (data)=> {
      expect(data.data).toBe(100);
      done();
    });
    WorkerOvserve.notify('WorkerOvserve.test.setObserver', {data: 100});
  });
    it('unobserve', done => {
      var v1f = ()=> expect(1).toBe(2);
      var v2f = ()=> {
        expect(1).toBe(1);
        done();
      };
      WorkerOvserve.unobserve('WorkerOvserve.test.unobserve.3');
      WorkerOvserve.observe('WorkerOvserve.test.unobserve.1', v1f);
      WorkerOvserve.observe('WorkerOvserve.test.unobserve.2', v2f);
      WorkerOvserve.unobserve('WorkerOvserve.test.unobserve.1', v1f);
      WorkerOvserve.notify('WorkerOvserve.test.unobserve.1', {});
      WorkerOvserve.notify('WorkerOvserve.test.unobserve.2', {});
    });
});
