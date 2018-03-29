const { BrowserWindow } = require('electron');
const config = require('./config');

let window = null;

module.exports = {
    create() {
        window = new BrowserWindow(config.window);

        window.loadURL(config.url);

        if (process.env.NODE_ENV === 'development') {
            // Open the DevTools if on development mode
            window.webContents.openDevTools();
        }

        return window;
    },

    show() {
        window.show();
    }
};
