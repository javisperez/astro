const { ipcMain } = require('electron');
const menu = require('./menu');
const path = require('path');

module.exports = {
    listen() {
        ipcMain.on('menu:hide', (e, menuId) => {
            menu.hide(menuId);
        });

        ipcMain.on('menu:show', (e, menuId) => {
            menu.show(menuId);
        });

        ipcMain.on('recent:update', (e, recent) => {
            menu.setRecentFiles(recent);
        });

        ipcMain.on('bookmarks:update', (e, bookmarks) => {
            menu.setBookmarks(bookmarks);
        });
    }
};

