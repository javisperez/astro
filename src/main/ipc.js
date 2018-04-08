const { ipcMain } = require('electron');
const menu = require('./menu');

module.exports = {
    listen() {
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

