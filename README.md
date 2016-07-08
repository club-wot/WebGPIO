# WebGPIO and WebI2C polyfill

|service|status|
|:--|:--|
| Build Status |[![Build Status](https://travis-ci.org/club-wot/WebGPIO.svg)](https://travis-ci.org/club-wot/WebGPIO) |
| Dependency Status |[![Dependency Status](https://gemnasium.com/club-wot/WebGPIO.svg)](https://gemnasium.com/club-wot/WebGPIO)|
| Code Covoiturage|[![Coverage Status](https://coveralls.io/repos/github/club-wot/WebGPIO/badge.svg?branch=draft-20160125)](https://coveralls.io/github/club-wot/WebGPIO?branch=draft-20160125)|

WebGPIO and WebI2C API polyfill (Chirimen dedicated)

### [WebGPIO SPEC](https://rawgit.com/browserobo/WebGPIO/master/index.html#example-getting-access)

+ interface
  + [x] [GPIOAccess](https://rawgit.com/browserobo/WebGPIO/master/index.html#GPIOAccess-interface)
  + [ ] [GPIOChangeEvent](https://rawgit.com/browserobo/WebGPIO/master/index.html#GPIOChangeEventInit-interface)
  + [ ] [GPIOChangeEventInit](https://rawgit.com/browserobo/WebGPIO/master/index.html#GPIOChangeEvent-interface)
  + [x] [GPIOPort](https://rawgit.com/browserobo/WebGPIO/master/index.html#GPIOPort-interface)
  + [ ] [GPIOPortMap](https://rawgit.com/browserobo/WebGPIO/master/index.html#GPIOPortMap-interface)
  + [x] [requestGPIOAccess](https://rawgit.com/browserobo/WebGPIO/master/index.html#navigator-gpio)

### [WebI2C SPEC](https://rawgit.com/browserobo/WebI2C/master/index.html)

+ interface
  + [x] [requestI2CAccess](https://rawgit.com/browserobo/WebI2C/master/index.html#navigator-I2C)
  + [x] [I2CAccess](https://rawgit.com/browserobo/WebI2C/master/index.html#I2CAccess-interface)
  + [ ] [I2CPortMap](https://rawgit.com/browserobo/WebI2C/master/index.html#I2CPortMap-interface)
  + [x] [I2CPort](https://rawgit.com/browserobo/WebI2C/master/index.html#I2CPort-interface)
  + [x] [I2CSlaveDevice](https://rawgit.com/browserobo/WebI2C/master/index.html#I2CSlaveDevice-interface)

## use WebGPIO polyfill

### install

```sh
bower install --save webgpio-polyfill
```

### Usage

```html
<script src="[bower_components path]/webgpio/dist/webgpio.min.js"></script>
```

### sample

#### sample

chirimen CN1.2pin (pullup) connected

```html
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Test LED</title>
        <script src="[bower_components path]/webgpio/dist/webgpio.min.js"></script>
        <script src="./js/main.js"></script>
    </head>
    <body>
        <h3 id="head"
            style="color:red; text-align: center; font-size: 90px">TEST</h3>
    </body>
</html>
```

 + `./js/main.js`

```javascript
'use strict';

window.addEventListener('load', function (){
  var head = document.querySelector('#head');
  navigator.requestGPIOAccess().then(
    function(gpioAccess) {
        console.log("GPIO ready!");
        return gpioAccess;
    }).then(gpio=>{
      var port = gpio.ports.get(256);
      var v = 0;
      return port.export("out").then(()=>{
        setInterval(function(){
          v = v ? 0 : 1;
          port.write(v);
          head.style.color = v ? 'red' : 'green' ;
        },500);
      });
  }).catch(error=>{
    console.log("Failed to get GPIO access catch: " + error.message);
  });
}, false);
```


##### [spec examples(spec file link)](https://rawgit.com/browserobo/WebGPIO/master/index.html#example)

## use WebI2C polyfill

### install

```sh
bower install --save webgpio-polyfill
```

### Usage

```html
<script src="[bower_components path]/webgpio/dist/webi2c.min.js"></script>
```

### sample

#### sample

[SRF02(ultrasonic ranging module )](http://www.robot-electronics.co.uk/htm/srf02techI2C.htm)

```html
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Test SRF02</title>
        <script src="[bower_components path]/webgpio/dist/webi2c.min.js"></script>
        <script src="./js/main.js"></script>
    </head>
    <body>
        <h3 id="head"
            style="color:red; text-align: center; font-size: 90px">TEST</h3>
    </body>
</html>
```

 + `./js/main.js`

```javascript
'use strict';

window.addEventListener('load', function (){
  var head = document.querySelector('#head');

  // WebI2C Initialized
  navigator.requestI2CAccess()
    .then(i2cAccess=>i2cAccess.ports)
    .then(ports=> ports.get(0))
    .then(port=> port.open(0x70))
    .then(I2CSlave=>{
      setInterval(() => SRF02.read(I2CSlave, 0x70).then(value => {
        console.log('value:', value);
        head.innerHTML = value ? value : head.innerHTML;
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
            var dist = ((v[0] << 8) + v[1]);
            resolve(dist);
          }).catch(reject);
        })();

        thread.next();
      });
    }
  };

}, false);
```

##### [spec examples(spec file link)](https://rawgit.com/browserobo/WebI2C/master/index.html#example)

### build

In the following command, concatenated file is output to the `./dist` directory.

```sh
gulp build
```

### test

```sh
# live watch test
gulp dev

# single run testing
gulp test

# live reload testing
gulp test:watch

# building webgpio and webi2c
gulp build

# open demo application
gulp demo

```


## Contributing

 1. Fork it!
 2. Create your feature branch: git checkout -b my-new-feature
 3. Commit your changes: git commit -am 'Add some feature'
 4. Push to the branch: git push origin my-new-feature
 5. Submit a pull request :D

## Related Links

 + [CHIRIMEN any-issues](https://github.com/chirimen-oh/any-issues);

## License

 Copyright (c) 2016 club-wot team and other contributors

 Licensed under the MIT License
