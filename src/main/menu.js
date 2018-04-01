const { app, Menu, shell } = require('electron');
const path = require('path');

let win = null;

const template = [
    // File
    {
        id: 'file',
        label: 'File',
        submenu: [
            {
                label: 'Open file',
                accelerator: 'CmdOrCtrl+O',
                click() {
                    win.webContents.send('file:open');
                },
            },
            { type: 'separator' },
            {
                id: 'recent',
                label: 'Recent files',
                submenu: [
                    { type: 'separator' },
                    {
                        label: 'Clear recent files',
                        click() {
                            console.log('clear recent files');
                        }
                    }
                ]
            },
        ]
    },

    // Tools
    {
        id: 'tools',
        label: 'Tools',
        visible: false,
        submenu: [
            {
                label: 'Drag',
                accelerator: 'CmdOrCtrl+Shift+D',
                click() {
                    win.webContents.send('tools:tool', 'drag');
                }
            },

            {
                label: 'Zoom In',
                accelerator: 'CmdOrCtrl+Shift+\\+',
                click() {
                    win.webContents.send('tools:tool', 'zoom-in');
                }
            },

            {
                label: 'Zoom Out',
                accelerator: 'CmdOrCtrl+Shift+-',
                click() {
                    win.webContents.send('tools:tool', 'zoom-out');
                }
            },

            {
                label: 'Brightness up',
                accelerator: 'CmdOrCtrl+Shift+Up',
                click() {
                    win.webContents.send('tools:tool', 'brightness-up');
                }
            },

            {
                label: 'Brightness down',
                accelerator: 'CmdOrCtrl+Shift+Down',
                click() {
                    win.webContents.send('tools:tool', 'brightness-down');
                }
            },
        ]
    },

    // Bookmarks
    {
        id: 'bookmarks',
        label: 'Bookmarks',
        submenu: [
            {
                id: 'add-to-bookmark',
                label: 'Add to bookmark',
                visible: false,
                accelerator: 'CmdOrCtrl+B',
                click() {
                    win.webContents.send('bookmarks:add');
                }
            },
            {
                id: 'add-to-bookmark:separator',
                visible: false,
                type: 'separator'
            }
        ]
    },

    // Window
    {
        id: 'window',
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' },
        ]
    },

    // Help
    {
        id: 'help',
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() {
                    shell.openExternal('https://www.github.com/javisperez/astro');
                }
            },

            {
                label: 'Troubles?',
                click() {
                    shell.openExternal('https://www.github.com/javisperez/astro');
                }
            },

            {
                label: 'Check for updates',
            }
        ]
    }
];

// Append the app menu on mac only
if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services', submenu: [] },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
        ]
    });
}

if (process.env.NODE_ENV === 'development') {
    template.splice(template.length - 1, 0, {
        label: 'Developer',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
        ]
    });
}

class AppMenu {
    constructor(template) {
        this.template = template;
        this.instance = null;
    }
    /**
     * For some reason getMenuItemById doesn't work to me
     *
     * @memberof AppMenu
     */
    _getMenuItemById(items, id) {
        const index = items.findIndex(item => item.id === id);

        let menu = null;

        if (index > -1) {
            return items[index];
        }

        items.forEach((subItem) => {
            if (menu) {
                return;
            }

            if (subItem.submenu) {
                menu = this._getMenuItemById(subItem.submenu, id);
            }
        });

        return menu || false;
    };

    hide(menuItemId) {
        const menu = this._getMenuItemById(this.template, menuItemId);

        if (!menu) {
            return;
        }

        menu.visible = false;

        this.build();
    }

    show(menuItemId) {
        const menu = this._getMenuItemById(this.template, menuItemId);

        if (!menu) {
            return;
        }

        menu.visible = true;

        this.build();
    }

    setRecentFiles(recent) {
        const menu = this._getMenuItemById(this.template, 'recent');
        const clear = menu.submenu.slice(menu.submenu.length - 2);
        menu.submenu = [];

        recent.forEach(r => {
            menu.submenu.push({
                label: r.path,
                click() {
                    console.log(`${r.title} clicked`);
                }
            });
        });

        // Append the `clear recent files` menu item
        menu.submenu = menu.submenu.concat(clear);
        this.build();
    }

    setBookmarks(bookmarks) {
        const menu = this._getMenuItemById(this.template, 'bookmarks');
        const add = menu.submenu.slice(0, 2);
        menu.submenu = [];

        // Add the `add to bookmarks` option (and it's separator)
        menu.submenu = menu.submenu.concat(add);

        bookmarks.forEach(bookmark => {
            menu.submenu.push({
                label: bookmark.title,
                click() {
                    console.log(`${bookmark.path} clicked`);
                }
            });
        });

        this.build();
    }

    build(window = win) {
        if (window !== win) {
            win = window;
        }

        const menu = Menu.buildFromTemplate(this.template);

        Menu.setApplicationMenu(menu);

        this.instance = menu;

        return menu;
    }
}

module.exports = new AppMenu(template);
