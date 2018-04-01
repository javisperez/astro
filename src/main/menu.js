const { app, Menu, shell } = require('electron');

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
                label: 'Recent files',
                submenu: [
                    {
                        label: '~/Desktop/Batman - The Return.cbz'
                    },
                    {
                        label: '~/Desktop/Batman - The Return.cbz'
                    },
                ]
            }
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
                    console.log(win.webContents);
                    win.webContents.send('tools:tool', 'drag');
                }
            },

            {
                label: 'Zoom In',
                accelerator: 'CmdOrCtrl+Shift\\+',
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
                    win.webContents.send('bookmars:add');
                }
            },
            {
                id: 'add-to-bookmark:separator',
                visible: false,
                type: 'separator'
            },
            {
                label: '~/Desktop/Batman - The return.cbz'
            },
            {
                label: '~/Desktop/Batman - The return.cbz'
            },
            {
                label: '~/Desktop/Batman - The return.cbz'
            },
            {
                label: '~/Desktop/Batman - The return.cbz'
            },
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

    build(window = win) {
        if (window) {
            win = window;
        }

        const menu = Menu.buildFromTemplate(this.template);

        Menu.setApplicationMenu(menu);

        this.instance = menu;

        return menu;
    }
}

module.exports = new AppMenu(template);
