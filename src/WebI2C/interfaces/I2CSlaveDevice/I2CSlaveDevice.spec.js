
describe('I2CSlaveDevice', () => {
  var slaveDevice;
  var promise = null;
  var err;

  beforeEach(done=>{
    promise= new I2CSlaveDevice(2, 0x48);
    promise.then(device => {
//      console.log("new I2CSlaveDevice().then()");
      slaveDevice = device;
      expect(promise).toEqual(jasmine.any(Promise));
      done();
    },error=>{
      err = error;
    });
    window.WorkerOvserve.notify('i2c.setDeviceAddress.2', { value: 2 });
  });
  describe('instance', () => {
    it('create', () => {
      expect(promise).not.toBeUndefined();
    });
    it('return promise', () => {
      expect(slaveDevice).toEqual(jasmine.any(I2CSlaveDevice));
    });
  });
  describe('method', ()=> {

    it('getXid', done=> {
      slaveDevice.xid = 999;
      slaveDevice.getXid();
      expect(slaveDevice.xid).toEqual(0);
      slaveDevice.getXid();
      expect(slaveDevice.xid).toEqual(1);
      done();
    });

    it('read8.then(resolve)', done=> {
      slaveDevice.xid = 0;
      slaveDevice.portNumber = 2;
      slaveDevice.slaveAddress = 65;
//      console.log("read8: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      slaveDevice.read8(0x20).then((value)=>{
        expect(value).toEqual(2);
        done();
      });
//      console.log("read8: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      window.WorkerOvserve.notify('i2c.read.1.2.65.32', { value: 2 });
    });

    it('read8.then(reject)', done=> {
      slaveDevice.xid = 2;
      slaveDevice.portNumber = 2;
      slaveDevice.slaveAddress = 255;  // out of range
//      console.log("read8: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      slaveDevice.read8(0x20).then((value)=>{
      },(err)=>{
        expect(err.message).not.toBeUndefined();
        done();
      });
//      console.log("read8: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      window.WorkerOvserve.notify('i2c.read.3.2.255.32', { error: {name:"dummyError", message:"error"} });
    });

    it('read16.then(resolve)', done=> {
      slaveDevice.xid = 5;
      slaveDevice.portNumber = 2;
      slaveDevice.slaveAddress = 0x31;
//      console.log("read16: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      slaveDevice.read16(0x21).then((value)=>{
        expect(value).toEqual(3000);
        done();
      });
//      console.log("read16: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      window.WorkerOvserve.notify('i2c.read.6.2.49.33', { value: 3000 });
    });

    it('read16.then(reject)', done=> {
      slaveDevice.xid = 7;
      slaveDevice.portNumber = 8;  // out of range
      slaveDevice.slaveAddress = 0x30;
//      console.log("read16: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      slaveDevice.read16(0x20).then((value)=>{
      },(err)=>{
        expect(err.message).not.toBeUndefined();
        done();
      });
//      console.log("read16: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      window.WorkerOvserve.notify('i2c.read.8.8.48.32', { error: {name:"dummyError", message:"error"} });
    });

    it('write8.then(resolve)', done=> {
      slaveDevice.xid = 9;
      slaveDevice.portNumber = 2;
      slaveDevice.slaveAddress = 0x32;
//      console.log("write8: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      slaveDevice.write8(0x22,10).then((value)=>{
        expect(value).toEqual(10);
        done();
      });
//      console.log("write8: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      window.WorkerOvserve.notify('i2c.write.10.2.50.34', { value: 10 });
    });

    it('write8.then(reject)', done=> {
      slaveDevice.xid = 11;
      slaveDevice.portNumber = 8;  // out of range
      slaveDevice.slaveAddress = 0x32;
//      console.log("write8: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      slaveDevice.write8(0x22,10).then((value)=>{
      },(err)=>{
        expect(err.message).not.toBeUndefined();
        done();
      });
//      console.log("write8: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      window.WorkerOvserve.notify('i2c.write.12.8.50.34', { error: {name:"dummyError", message:"error"} });
    });

    it('write16.then(resolve)', done=> {
      slaveDevice.xid = 13;
      slaveDevice.portNumber = 2;
      slaveDevice.slaveAddress = 0x32;
//      console.log("write16: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      slaveDevice.write16(0x22,1000).then((value)=>{
        expect(value).toEqual(1000);
        done();
      });
//      console.log("write16: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      window.WorkerOvserve.notify('i2c.write.14.2.50.34', { value: 1000 });
    });

    it('write16.then(reject)', done=> {
      slaveDevice.xid = 15;
      slaveDevice.portNumber = 2;
      slaveDevice.slaveAddress = 256; 
//      console.log("write16: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      slaveDevice.write16(0x22,1000).then((value)=>{
      },(err)=>{
        expect(err.message).not.toBeUndefined();
        done();
      });
//      console.log("write16: xid:"+slaveDevice.xid+" portNumber:"+slaveDevice.portNumber+" slaveAddress:"+slaveDevice.slaveAddress);
      window.WorkerOvserve.notify('i2c.write.16.2.256.34', { error: {name:"dummyError", message:"error"} });
    });

  });
});

describe('I2CSlaveDevice().then(reject)', () => {
  var slaveDevice;
  var promise = null;
  var err;

  it('reject', done=> {
    promise= new I2CSlaveDevice(8, 0x48);
    promise.then(device => {
    },error=>{
      err = error;
      done();
    });
    window.WorkerOvserve.notify('i2c.setDeviceAddress.8', { error: {name:"dummyError", message:"error"} });
  });
 
});

