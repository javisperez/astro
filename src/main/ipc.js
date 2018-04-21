const { ipcMain } = require('electron');
const menu = require('./menu');
const bg = require('./background');
const win = require('./window');

module.exports = {
  listen() {
    ipcMain.on('background:import', (e, path) => {
      bg.send('background:import', path);
    });

    ipcMain.on('background:done', (e, { type, data }) => {
      win.send(`background:${type}`, data);
    });

    ipcMain.on('menu:hide', (e, menuId) => {
      menu.hide(menuId);
    });

    ipcMain.on('menu:show', (e, menuId) => {
      menu.show(menuId);
    });

    ipcMain.on('menu:enable', (e, menuId) => {
      menu.enable(menuId);
    });

    ipcMain.on('menu:disable', (e, menuId) => {
      menu.disable(menuId);
    });

    ipcMain.on('recent:update', (e, recent) => {
      menu.setRecentFiles(recent);
    });

    ipcMain.on('bookmarks:update', (e, bookmarks) => {
      menu.setBookmarks(bookmarks);
    });
  }
};

