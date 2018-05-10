const path = require('path');

module.exports = {
  url: {
    dist: `file://${__dirname}/../../dist/`,
    main: `file://${__dirname}/../../dist/index.html`,
    background: `file://${__dirname}/../../dist/background.html`,
  },

  window: {
    backgroundColor: '#14161d',
    minWidth: 1024,
    minHeight: 768,
    width: 1024,
    height: 768,
    icon: path.join(__dirname, '../../assets/icons/Astro.png'),
    show: false,
    title: 'Astro',
    titleBarStyle: 'hiddenInset',
  }
};
