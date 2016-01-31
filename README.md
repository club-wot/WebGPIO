# WebGPIO

WebGPIO API polyfill (Chirimen dedicated)

### [SPEC](https://rawgit.com/browserobo/WebGPIO/master/index.html#example-getting-access)

+ interface
  + [GPIOAccess](https://rawgit.com/browserobo/WebGPIO/master/index.html#GPIOAccess-interface)
  + [GPIOChangeEvent](https://rawgit.com/browserobo/WebGPIO/master/index.html#GPIOChangeEventInit-interface)
  + [GPIOChangeEventInit](https://rawgit.com/browserobo/WebGPIO/master/index.html#GPIOChangeEvent-interface)
  + [GPIOPort](https://rawgit.com/browserobo/WebGPIO/master/index.html#GPIOPort-interface)
  + [GPIOPortMap](https://rawgit.com/browserobo/WebGPIO/master/index.html#GPIOPortMap-interface)
  + [requestGPIOAccess](https://rawgit.com/browserobo/WebGPIO/master/index.html#navigator-gpio)

## use WebGPIO polyfill

### install

```sh
bower install --save webgpio-polyfill
```

### Usage

```html
<script src="[bower_components path]/webgpio/dist/webgpio.min.js"></script>
```

##### [examples(spec file link)](https://rawgit.com/browserobo/WebGPIO/master/index.html#example)

### build

In the following command, concatenated file is output to the `./dist` directory.

```sh
gulp build
```

### test

```sh
# libe watch test
gulp dev

# single run testing
gulp test

```


## Contributing

 1. Fork it!
 2. Create your feature branch: git checkout -b my-new-feature
 3. Commit your changes: git commit -am 'Add some feature'
 4. Push to the branch: git push origin my-new-feature
 5. Submit a pull request :D

## License

 Copyright (c) 2016 club-wot team and other contributors

 Licensed under the MIT License
