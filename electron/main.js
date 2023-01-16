// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const yyHandler = require("./handler")



function createWindow () {
    if (!process.env.DEV) Menu.setApplicationMenu(null)
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            devTools: process.env.DEV
        }
    })
    mainWindow.once('ready-to-show', mainWindow.show)

    // and load the index.html of the app.
    if (process.env.DEV) {
        mainWindow.loadURL(process.env.DEBUG_URL)
    } else {
        mainWindow.loadFile(path.join(__dirname, 'index.html'))
    }
    // mainWindow.loadFile('./.rollup/index.html')

    // Open the DevTools.
    process.env.DEV && mainWindow.webContents.openDevTools()
    ipcMain.handle('yy:handler', yyHandler)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
