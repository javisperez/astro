const { ipcMain, Menu } = require('electron');
const menu = require('./menu');

module.exports = {
    listen() {
        ipcMain.on('menu:hide', (e, menuId) => {
            menu.hide(menuId);
        });

        ipcMain.on('menu:show', (e, menuId) => {
            menu.show(menuId);
        });
    }
};

