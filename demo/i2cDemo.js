'use strict';

window.addEventListener('load', function (){


  // WebI2C Initialized
  navigator.requestI2CAccess()
    .then(i2cAccess=>i2cAccess.ports)
    .then(ports=> ports.get(0))
    .then(port=> port.open(0x70))
    .then(I2CSlave=>{
      setInterval(() => SRF02.read(I2CSlave, 0x70).then(value => {
        console.log('value:', value);
      }), 1000);
    }).catch(e=> console.error('error', e));

  // SRF02 Initialized
  var SRF02 = {
    sleep: (ms, generator)=> setTimeout(() => generator.next(), ms),
    read: (I2CSlave, address)=> {
      return new Promise((resolve, reject)=> {
        var thread = (function* () {

          I2CSlave.write8(0x00, 0x00);
          yield SRF02.sleep(1, thread);
          I2CSlave.write8(0x00, 0x51);
          yield SRF02.sleep(70, thread);

          // get distance value
          Promise.all([
            I2CSlave.read8(0x02, true),
            I2CSlave.read8(0x03, true),
          ]).then(function(v){
            console.log(v);
            var dist = ((v[0] << 8) + v[1]);
            resolve(dist);
          }).catch(reject);
        })();

        thread.next();
      });
    }
  };

}, false);
