const { BrowserWindow } = require('electron');
const config = require('../main/config');

let bg = null;

module.exports = {
  create() {
    bg = new BrowserWindow({ show: false });

    bg.loadURL(config.url.background);

    return bg;
  },

  get() {
    return bg;
  },

  send(event, arg = null) {
    return bg.webContents.send(event, arg);
  }
};
