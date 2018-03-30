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
                click() {
                    console.log(win.webContents);
                    win.webContents.send('tools:tool', 'drag');
                }
            },

            {
                label: 'Zoom In',
                click() {
                    win.webContents.send('tools:tool', 'zoom-in');
                }
            },

            {
                label: 'Zoom Out',
                click() {
                    win.webContents.send('tools:tool', 'zoom-out');
                }
            },

            {
                label: 'Brightness up',
                click() {
                    win.webContents.send('tools:tool', 'brightness-up');
                }
            },

            {
                label: 'Brightness down',
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
                label: 'Add to bookmark',
                click() {
                    win.webContents.send('bookmars:add');
                }
            },
            { type: 'separator' },
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
        role: 'window',
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
    }

    hide(menuItemId) {
        const index = this.template.findIndex(m => m.id === menuItemId);
        this.template[index].visible = false;

        this.build();
    }

    show(menuItemId) {
        const index = this.template.findIndex(m => m.id === menuItemId);
        this.template[index].visible = true;

        this.build();
    }

    build(window = win) {
        if (window) {
            win = window;
        }

        const menu = Menu.buildFromTemplate(this.template);
        Menu.setApplicationMenu(menu);

        return menu;
    }
}

module.exports = new AppMenu(template);
