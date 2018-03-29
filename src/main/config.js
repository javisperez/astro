const path = require('path');

module.exports = {
    url: `file://${__dirname}/../../dist/index.html`,

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
