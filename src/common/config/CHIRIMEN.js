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
          SDA: { cn: 2, pin: 11 },
          SCL: { cn: 2, pin: 12 },
        },
        2: {
          SDA: { cn: 1, pin: 2 },
          SCL: { cn: 1, pin: 3 },
        },
      },
  },
};
