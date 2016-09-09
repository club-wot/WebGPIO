
const createArray = N => Array.apply(null, { length: 18 }).map(Number.call, Number);

const expectChanel = (portNumber, cn, pin) =>
                PORT_CONFIG.CHIRIMEN.PORTS[portNumber].pinName === String(pin) &&
                PORT_CONFIG.CHIRIMEN.PORTS[portNumber].portName.substring(2, 3) === String(cn);

const svgGrid = {
  CHANNEL: {
    1: 183,
    2: 27,
  },
};

class DrowSVG {

  constructor(height, width) {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    if (height) this.svg.setAttributeNS(null, 'height', height);
    if (width) this.svg.setAttributeNS(null, 'width', width);
    this.svg.setAttribute('href', 'http://www.google.com');
  }

  text(className, textString, x, y, fill) {
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    if (className) text.setAttributeNS(null, 'class', className);
    text.setAttributeNS(null, 'x', x);
    text.setAttributeNS(null, 'y', y);
    text.setAttributeNS(null, 'fill', fill);
    text.textContent = textString;
    this.svg.appendChild(text);
  }

  rect(className, height, width, x, y, fill, stroke) {
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    if (className) rect.setAttributeNS(null, 'class', className);
    rect.setAttributeNS(null, 'height', height);
    rect.setAttributeNS(null, 'width', width);
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    rect.setAttributeNS(null, 'fill', fill);
    rect.setAttributeNS(null, 'stroke', stroke ? stroke : '#000');
    this.svg.appendChild(rect);
  }

  ellipse(className, ry, rx, cx, cy, fill, stroke) {
    let ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
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
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
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
  constructor() {

    this.svgElements = [];
    window.addEventListener('load', () => {
      for (var elem of document.querySelectorAll('.chirimen-sim')) {

        let svgDrow = new DrowSVG(400, 650);
        svgDrow.rect(null, 172, 305,  27.5, 19, '#e80202');
        svgDrow.rect(null, 65, 79, 121.5, 68, '#000000');
        svgDrow.rect(null, 39, 58,  47.5, 101, '#000000');
        svgDrow.rect(null, 39, 58,  47.5, 51, '#000000');
        svgDrow.rect(null, 30, 23,  16.5, 30, '#fff');
        svgDrow.rect(null, 30, 23,  18.5, 146, '#fff');
        svgDrow.rect(null, 30, 27,  15.5, 85, '#fff');
        svgDrow.rect(null, 51, 53,   286, 122, '#fff');
        svgDrow.rect(null, 25, 49,   290, 41, '#000000');
        svgDrow.rect(null, 26, 33,   218, 53, '#000000');
        svgDrow.rect(null, 19, 24,   219, 119, '#000000');

        // pin map https://chirimen.org/docs/ja/board_connectors.html

        // pin header (CN1 18 -> 1 )
        createArray(18).forEach((v, i)=> svgDrow.ellipse(`cn1-pin-${v + 1}`, 4, 4.5, 135 + (i * 11), svgGrid.CHANNEL[1], '#fff'));

        // pin header (CN2 1 -> 18 )
        createArray(18).reverse().forEach((v, i)=> svgDrow.ellipse(`cn2-pin-${v + 1}`, 4, 4.5, 135 + (i * 11), svgGrid.CHANNEL[2], '#fff'));

        elem.appendChild(svgDrow.svg);

        this.svgElements.push({
          svg: svgDrow,
          elem: elem,
        });
      }
    });
  }

  /**
  * drowing pin propaty
  ***/
  writePropaty() {
    this.svgElements.forEach(svgElem=> {

      svgElem.svg.text(null, 'CHANNEL-1', 350, 20, '#000');
      createArray(18)
        .forEach((v, i)=> svgElem.svg.text(`CN1-pin${v + 1}`, `pin-${v + 1} : `, 360, 40 + (20 * v), '#000'));

      svgElem.svg.text(null, 'CHANNEL-2', 500, 20, '#000');
      createArray(18).reverse()
        .forEach((v, i)=> svgElem.svg.text(`CN2-pin${v + 1}`, `pin-${v + 1} : `, 510, 40 + (20 * v), '#000'));

      window.WorkerOvserve.observe(`debug.gpio.setValue`, workerData => {
        var ports = PORT_CONFIG.CHIRIMEN.PORTS[workerData.value.portNumber];

        for (var prop of document.querySelectorAll(`.${ports.portName.substring(0, 3)}-pin${ports.pinName}`)) {
          prop.textContent = `pin-${ports.pinName} : value = ${workerData.value.value}`;
        }
      });
    });
  }

  /**
  * drow LED simulate
  * @type gpio
  **/
  writeLED(channel, gpioPin, gnd) {
    this.svgElements.forEach(svgElem=> {

      var ledId = `dummy-led-${channel}-${gpioPin}-${gnd}`;

      this.__JumperWire(svgElem.svg, channel, gpioPin, 158, 254, '#900');
      this.__JumperWire(svgElem.svg, channel, gnd, 158, 254, '#000');

      svgElem.svg.ellipse(ledId, 8, 8, 160, 250, '#FFF');

      for (let idx in PORT_CONFIG.CHIRIMEN.PORTS) {

        window.WorkerOvserve.observe(`debug.gpio.setValue`, workerData => {

          if (PORT_CONFIG.CHIRIMEN.PORTS[workerData.value.portNumber].pinName === String(gpioPin)) {

            for (var elem of document.querySelectorAll(`.${ledId}`)) {
              elem.setAttributeNS(null, 'fill', workerData.value.value ? '#F00' : '#FFF');
            }
          }
        });
      }
    });
  }

  /**
  * drow Push Button simulate
  * @type gpio
  **/
  writePushBtn(channel, gpioPin) {

    this.svgElements.forEach(svgElem=> {
      var pushBtnId = `dummy-pushBtn-${channel}-${gpioPin}`;
      this.__JumperWire(svgElem.svg, channel, gpioPin, 186, 254, '#900');

      svgElem.svg.rect(null, 25, 25, 178, 237, '#CCC');
      svgElem.svg.ellipse(pushBtnId, 8, 8, 190, 250, '#555');

      var changeValue = (val) => () => {
        for (let idx in PORT_CONFIG.CHIRIMEN.PORTS)
          if (expectChanel(idx, channel, gpioPin))
            window.WorkerOvserve.notify('gpio', {
              method: 'gpio.setValue',
              portNumber: idx,
              value: val,
            });
      };

      for (var elem of document.querySelectorAll(`.${pushBtnId}`)) {
        elem.addEventListener('mousedown', changeValue(1), false);
        elem.addEventListener('mouseup', changeValue(0), false);
      }
    });
  }

  __JumperWire(svg, cn, pin, x, y, fill) {
    svg.line(null, 125 + (pin * 11), svgGrid.CHANNEL[cn], x, y, fill, 4);
  }
}

window.chirimenSimulator = new ChirimenShim();

/* EOF */
