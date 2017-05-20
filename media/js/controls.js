const {ipcRenderer, BrowserWindow} = require('electron')

function OnLaunch()
{
    ipcRenderer.send('LaunchButton')
}