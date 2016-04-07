window.addEventListener('load', function (){
  navigator.requestGPIOAccess().then(
    function(gpioAccess) {
        console.log("GPIO ready!");
        return gpioAccess;
    }).then(gpio=>{
      // out check
      // {
      //   var port = gpio.ports.get(256);
      //   var v = 0;
      //   port.export("out").then(()=>{
      //     setInterval(function(){
      //       v = v ? 0 : 1;
      //       port.write(v);
      //     },3000);
      //   });
      // }
      // in check
      {
        var portOut = gpio.ports.get(257);
        portOut.export("in")
          .then(()=> portOut.read())
          .then((v)=>{
            console.log('demo read', v);
          })
        portOut.onchange = function(data){
          console.log('onchange', data);
        }
      }

  }).catch(error=>{
    console.log("Failed to get GPIO access catch: " + error.message);
  });
}, false);
