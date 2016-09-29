window.Worker = function (){}

window.Worker.prototype.postMessage = jasmine.createSpy();
/**
* exportインタフェースを強制的にresolveする。
**/
window.dummyWorker = {
  allExport: ()=> {
    var testMock = val => {
      window.WorkerOvserve.notify(`gpio.export.${val.portNumber}`, {});
      if (val.portNumber === 353) {
        window.WorkerOvserve.unobserve(`gpio`, testMock);
        done();
      };
    };
    window.WorkerOvserve.observe(`gpio`, testMock);
  }
}