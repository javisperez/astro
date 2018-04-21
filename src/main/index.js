const { app } = require('electron');
const window = require('./window');
const menu = require('./menu');
const ipc = require('./ipc');
const child = require('./background');

const main = {
  window: null,
};

let win = null;
let macQueue = '';

app.on('open-file', (e, path) => {
  e.preventDefault();
  macQueue = path;

  if (win) {
    win.webContents.send('file:open', macQueue);
  }
});

app.on('ready', () => {
  // Create the browser window
  win = window.create();

  // Create the app menu
  menu.build(win);

  // Listen events from the renderer
  ipc.listen();

  // Start a background process listener
  child.create();

  win.once('ready-to-show', () => {
    window.show();

    if (macQueue) {
      win.webContents.send('file:open', macQueue);
    }
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

main.window = win;

module.exports = main;
