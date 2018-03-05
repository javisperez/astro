const { app, Menu, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
    let url = `file://${__dirname}/dist/index.html`;

    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        'minWidth': 800,
        'minHeight': 600,
        'frame': false,
        'standard-window': false,
        'title': 'Astro',
    });

    mainWindow.useContentSize = true;
    mainWindow.webPreferences = {
        nodeIntegrationInWorker: true
    };

    if (process.env.NODE_ENV === 'development') {
        url = 'http://localhost:3000';
    }

    mainWindow.loadURL(url);

    // if (process.env.NODE_ENV === 'development') {
        // Open the DevTools.
        mainWindow.webContents.openDevTools();
    // }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Set the file menu options
    const template = [
        {
            role: 'window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' },
            ]
        },

        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click () {
                        require('electron').shell.openExternal('https://electronjs.org')
                    }
                }
            ]
        }
    ];
console.log('process env', process.env.NODE_ENV);
    // if (process.env.NODE_ENV !== 'development') {
        // const menu = Menu.buildFromTemplate(template);
        // Menu.setApplicationMenu(menu);
    // }
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

// app.on('activate', () => {
//     if (mainWindow === null) {
//         createWindow();
//     }
// });
