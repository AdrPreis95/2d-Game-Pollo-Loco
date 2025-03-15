const { contextBridge, ipcRenderer } = require('electron');

/**
 * Exposes Electron API functions to the renderer process.
 */
contextBridge.exposeInMainWorld('electron', {
    /**
     * Sends an event to the main process to exit the application.
     */
    exitApp: () => ipcRenderer.send('exit-app')
});
