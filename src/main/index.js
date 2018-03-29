const { app } = require('electron');
const window = require('./window');
const menu = require('./menu');
const ipc = require('./ipc');

const main = {
    window: null,
};

let win = null;

app.on('ready', () => {
    win = window.create();

    menu.build();

    ipc.listen();

    win.once('ready-to-show', () => {
        window.show();
    });
});

app.on('window-all-closed', () => {
    app.quit();
});

main.window = win;

module.exports = main;
