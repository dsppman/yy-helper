// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// import {ipcRenderer, contextBridge} from 'electron'
const {ipcRenderer, contextBridge} = require('electron')

contextBridge.exposeInMainWorld('yy',
    (name, ...options) => ipcRenderer.invoke('yy:handler', name, options)
        .then(res => {
            console.log(`[ ${name} request ]`, options)
            console.log(`[ ${name} response ]`, res)
            if (res?.errMsg) throw Error(res.errMsg)
            return res
        })
)