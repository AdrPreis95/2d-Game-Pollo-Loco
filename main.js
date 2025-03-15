const { app, BrowserWindow } = require('electron');

let mainWindow;

/**
 * Creates the main application window when Electron is ready.
 * The window is initialized with a specific width and height,
 * and it loads the `index.html` file as the main content.
 */
app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true, 
            contextIsolation: false 
        }
    });

    mainWindow.loadFile('index.html'); 
});
