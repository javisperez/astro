const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
    let url = `file://${__dirname}/dist/index.html`;

    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        'width': 1000,
        'height': 800,
        'frame': false,
        'standard-window': false
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
