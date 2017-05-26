const {ipcRenderer, BrowserWindow} = require('electron')

require('./media/js/jquery.js')

// On Launch - Called by the renderer
function OnLaunch()
{
    // Request the client is launched
    ipcRenderer.send('Client.RequestLaunch')
  
    // When the client is ready set the button states
    ipcRenderer.on("Client.Ready", () =>
    {
        SetLaunchContol(true, "Launch")
        console.log("Client ready to launch...");
    })
    
    // Client download failed
    ipcRenderer.on("Client.Download.Failed", (err) =>
    {
        SetLaunchContol(false, "Network/Download error")
        console.log("Download failed...")
    })

    ipcRenderer.on("Client.Download.Begin", (err) =>
    {
        SetLaunchContol(false, "Downloading...")
        console.log("Download starting...")
    })

}


$(document).ready(() => {
    // Request the client is launched
    ipcRenderer.send('Client.HasUpdate')
    console.log("Checking for updates")
})

ipcRenderer.on("Client.UpdateAvailable", (err) =>
{
    console.log("Recieved notification of update from main thread")
    SetLaunchContol(true, "Install/Download...")
})

// Set the launch control status
// _state - the control state
// _value - the text / value of the controls
function SetLaunchContol( _state, _value )
{
    var launchControl = $('#launchbutton')
    launchControl.text(_value)
    launchControl.prop('disabled', !_state)
}

