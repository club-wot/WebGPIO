(function(){
const createArray = N => Array.apply(null, {length: 18}).map(Number.call, Number);

const expectChanel= (portNumber, cn, pin) =>
                PORT_CONFIG.CHIRIMEN.PORTS[portNumber].pinName === String(pin) &&
                PORT_CONFIG.CHIRIMEN.PORTS[portNumber].portName.substring(2,3) === String(cn);

const svgGrid = {
  CHANNEL: {
    1: 183,
    2: 27
  },
}

class DrowSVG {

  constructor(height, width){
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if(height) this.svg.setAttributeNS(null, 'height', height);
    if(width) this.svg.setAttributeNS(null, 'width', width);
    this.svg.setAttribute('href', 'http://www.google.com');
  }

  text(className, textString, x, y, fill){
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    if (className) text.setAttributeNS(null, 'class', className);
    text.setAttributeNS(null, 'x', x);
    text.setAttributeNS(null, 'y', y);
    text.setAttributeNS(null, 'fill', fill);
    text.textContent = textString;
    this.svg.appendChild(text);
  }

  rect(className, height, width, y, x, fill, stroke){
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    if (className) rect.setAttributeNS(null, 'class', className);
    rect.setAttributeNS(null, 'height', height);
    rect.setAttributeNS(null, 'width', width);
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    rect.setAttributeNS(null, 'fill', fill);
    rect.setAttributeNS(null, 'stroke', stroke ? stroke : '#000');
    this.svg.appendChild(rect);
  }

  ellipse(className, ry, rx, cy, cx, fill, stroke){
    let ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    if (className) ellipse.setAttributeNS(null, 'class', className);
    ellipse.setAttributeNS(null, 'ry', ry);
    ellipse.setAttributeNS(null, 'rx', rx);
    ellipse.setAttributeNS(null, 'cy', cy);
    ellipse.setAttributeNS(null, 'cx', cx);
    ellipse.setAttributeNS(null, 'fill', fill);
    ellipse.setAttributeNS(null, 'stroke', stroke ? stroke : '#000');
    this.svg.appendChild(ellipse);
  }

  line(className, x1, y1, x2, y2, stroke, strokeWidth) {
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    if (className) line.setAttributeNS(null, 'class', className);
    line.setAttributeNS(null, 'x1', x1);
    line.setAttributeNS(null, 'y1', y1);
    line.setAttributeNS(null, 'x2', x2);
    line.setAttributeNS(null, 'y2', y2);
    line.setAttributeNS(null, 'stroke', stroke ? stroke : '#000');
    line.setAttributeNS(null, 'stroke-width', strokeWidth ? strokeWidth : '1');
    this.svg.appendChild(line);
  }
}

class ChirimenShim {
  constructor(){

    this.svgElements = [];

    for (var elem of document.querySelectorAll('.chirimen-sim')){

      let svgDrow = new DrowSVG(400, 650);
      svgDrow.rect(null,172,305, 19,  27.5, '#e80202');
      svgDrow.rect(null, 65, 79, 68, 121.5, '#000000');
      svgDrow.rect(null, 39, 58, 101, 47.5, '#000000');
      svgDrow.rect(null, 39, 58, 51,  47.5, '#000000');
      svgDrow.rect(null, 30, 23, 30,  16.5, '#fff');
      svgDrow.rect(null, 30, 23, 146, 18.5, '#fff');
      svgDrow.rect(null, 30, 27, 85,  15.5, '#fff');
      svgDrow.rect(null, 51, 53, 122,  286, '#fff');
      svgDrow.rect(null, 25, 49, 41,   290, '#000000');
      svgDrow.rect(null, 26, 33, 53,   218, '#000000');
      svgDrow.rect(null, 19, 24, 119,  219, '#000000');

      // pin map https://chirimen.org/docs/ja/board_connectors.html

      // pin header (CN1 18 -> 1 )
      createArray(18).forEach((v, i)=> svgDrow.ellipse(`cn1-pin-${v+1}`, 4, 4.5, svgGrid.CHANNEL[1], 135 + (i*11), '#fff'))

      // pin header (CN2 1 -> 18 )
      createArray(18).reverse().forEach((v, i)=> svgDrow.ellipse(`cn2-pin-${v+1}`, 4, 4.5, svgGrid.CHANNEL[2], 135 + (i*11), '#fff'))
      
      elem.appendChild(svgDrow.svg);

      this.svgElements.push({
        svg: svgDrow,
        elem: elem,
      });
    }
  }

  /**
  * drowing pin propaty
  ***/
  writePropaty() {
    this.svgElements.forEach(svgElem=>{

      svgElem.svg.text(null, 'CHANNEL-1', 350, 20, '#000')
      createArray(18)
        .forEach((v, i)=> svgElem.svg.text(`CN1-pin${v+1}`, `pin-${v+1} : `, 360, 40 + (20*v), '#000'));

      svgElem.svg.text(null, 'CHANNEL-2', 500, 20, '#000')
      createArray(18).reverse()
        .forEach((v, i)=> svgElem.svg.text(`CN2-pin${v+1}`, `pin-${v+1} : `, 510, 40 + (20*v), '#000'));

      window.WorkerOvserve.observe(`debug.gpio.setValue`, workerData => {
        var ports = PORT_CONFIG.CHIRIMEN.PORTS[workerData.value.portNumber];

        for (var prop of document.querySelectorAll(`.${ports.portName.substring(0, 3)}-pin${ports.pinName}`)){
          prop.textContent = `pin-${ports.pinName} : value = ${workerData.value.value}`;
        }
      });
    });
  }

  /**
  * drow LED simulate
  **/
  writeLED(channel, gpioPin, gnd) {
    this.svgElements.forEach(svgElem=>{

      var ledId = `dummy-led-${channel}-${gpioPin}-${gnd}`;

      this.__JumperWire(svgElem.svg, channel, gpioPin, '#900');
      this.__JumperWire(svgElem.svg, channel, gnd, '#000');

      svgElem.svg.ellipse(ledId, 8, 8, 250, 160, '#FFF');

      for ( let idx in PORT_CONFIG.CHIRIMEN.PORTS ) {

        window.WorkerOvserve.observe(`debug.gpio.setValue`, workerData => {

          if (PORT_CONFIG.CHIRIMEN.PORTS[workerData.value.portNumber].pinName === String(gpioPin)) {

            for (var elem of document.querySelectorAll(`.${ledId}`)){
              elem.setAttributeNS(null, 'fill', workerData.value.value ? '#F00' : '#FFF');
            }
          }
        });
      }
    });
  }

  /**
  * drow Push Button simulate
  * @todo: 
  **/
  writePushBtn(channel, gpioPin, gnd){

    this.svgElements.forEach(svgElem=>{
      var pushBtnId = `dummy-pushBtn-${channel}-${gpioPin}-${gnd}`;
      this.__JumperWire(svgElem.svg, channel, gpioPin, '#900');
      this.__JumperWire(svgElem.svg, channel, gnd, '#000');

      svgElem.svg.rect(null, 25, 25, 237,  148, '#CCC');
      svgElem.svg.ellipse(pushBtnId, 8, 8, 250, 160, '#555');

      var changeValue = (val) => (e) => {
        for ( let idx in PORT_CONFIG.CHIRIMEN.PORTS ) 
          if (expectChanel(idx, channel, gpioPin))
            window.WorkerOvserve.notify('gpio', {
              method: 'gpio.setValue',
              portNumber: idx,
              value: val,
            });
      }

      for (var elem of document.querySelectorAll(`.${pushBtnId}`)){
        elem.addEventListener('mousedown', changeValue(1), false);
        elem.addEventListener('mouseup', changeValue(0), false);
      }
    });
  }

  __JumperWire(svg, cn, pin, fill){
    svg.line(null, 125 + (pin * 11), svgGrid.CHANNEL[cn], 156, 254, fill, 4);
  }
}


window.chirimenSimulator = new ChirimenShim();

/* EOF */
const PORT_CONFIG = {
  // https://docs.google.com/spreadsheets/d/1pVgK-Yy09p9PPgNgojQNLvsPjDFAOjOubgNsNYEQZt8/edit#gid=0
  CHIRIMEN: {
    PORTS: {
      256: { portName: 'CN1.I2C2_SDA', pinName: '2', },
      257: { portName: 'CN1.I2C2_SCL', pinName: '3', },
      283: { portName: 'CN1.UART3_RX', pinName: '4', },
      284: { portName: 'CN1.UART3_TX', pinName: '5', },
      196: { portName: 'CN1.SPI0_CS',  pinName: '7', },
      197: { portName: 'CN1.SPI0_CLK', pinName: '8', },
      198: { portName: 'CN1.SPI0_RX',  pinName: '9', },
      199: { portName: 'CN1.SPI0_TX',  pinName: '10', },
      244: { portName: 'CN1.SPI1_CS',  pinName: '11', },
      243: { portName: 'CN1.SPI1_CLK', pinName: '12', },
      246: { portName: 'CN1.SPI1_RX',  pinName: '13', },
      245: { portName: 'CN1.SPI1_TX',  pinName: '14', },
      163: { portName: 'CN2.PWM0',     pinName: '10', },
      253: { portName: 'CN2.I2C0_SCL', pinName: '11', },
      252: { portName: 'CN2.I2C0_SDA', pinName: '12', },
      193: { portName: 'CN2.UART0_TX', pinName: '13', },
      192: { portName: 'CN2.UART0_RX', pinName: '14', },
      353: { portName: 'CN2.GPIO6_A1', pinName: '15', },
    },
    I2C_PORTS: {
        0: {
          SDA: { portName: 'CN2.I2C0_SCL', pinName: '11', },
          SCL: { portName: 'CN2.I2C0_SDA', pinName: '12', },
        },
        2: {
          SDA: { portName: 'CN1.I2C2_SDA', pinName: '2', },
          SCL: { portName: 'CN1.I2C2_SCL', pinName: '3', },
        },
      },
  },
};
})()