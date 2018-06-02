const { app } = require('electron');
const window = require('./window');
const menu = require('./menu');
const ipc = require('./ipc');
const child = require('./background');
const { autoUpdater } = require('electron-updater');

const main = {
  window: null,
};

let win = null;
let fileToOpen = '';

app.on('open-file', (e, path) => {
  e.preventDefault();
  fileToOpen = path;

  if (win) {
    win.webContents.send('file:open', fileToOpen);
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

  // Install devtools
  if (process.env.NODE_ENV === 'development') {
    console.log('--- Vue-devtools ----------------------------------------------------');
    require('vue-devtools').install();
    console.log('---------------------------------------------------------------------');
  }

  // Check if theres any update available
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdates();
  }

  win.once('ready-to-show', () => {
    window.show();

    if (process.platform === 'win32' && process.argv.length >= 2) {
      fileToOpen = process.argv[1];
    }

    if (fileToOpen) {
      win.webContents.send('file:open', fileToOpen);
    }
  });
});

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', () => {
  win.webContents.send('updateReady');
});

app.on('window-all-closed', () => {
  app.quit();
});

main.window = win;

module.exports = main;
