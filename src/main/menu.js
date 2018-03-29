const { app, Menu } = require('electron');

// Set the file menu options
const template = [
    {
        id: 'file',
        label: 'File',
        submenu: [
            {
                label: 'Open file'
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

    {
        id: 'tools',
        label: 'Tools',
        visible: false,
        submenu: [
            {
                label: 'Drag'
            },

            {
                label: 'Zoom In'
            },

            {
                label: 'Zoom Out'
            },

            {
                label: 'Brightness up'
            },

            {
                label: 'Brightness down'
            },
        ]
    },

    {
        id: 'bookmarks',
        label: 'Bookmarks',
        submenu: [
            {
                label: 'Add to bookmark'
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

    {
        id: 'window',
        role: 'window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' },
        ]
    },

    {
        id: 'help',
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click () {
                    require('electron').shell.openExternal('https://www.github.com/javisperez/astro');
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

let menu = null;

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

    build() {
        menu = Menu.buildFromTemplate(this.template);
        Menu.setApplicationMenu(menu);

        return menu;
    }
}

module.exports = new AppMenu(template);
