const {app, BrowserWindow, shell, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const {download} = require('electron-dl')
const extract = require('extract-zip')
const fs = require('fs')
const filesystem = require('file-system')
const execApplication = require('child_process').execFile;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})
  //win.setResizable(false);
  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  win.webContents.openDevTools()
  
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('browser-window-created',function(e,window) {
    window.setMenu(null)
});
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// Starts a download
function downloadFile( url )
{
  console.log("starting download... : "  + url)
  win.webContents.send("Client.Download.Begin")
  download(BrowserWindow.getFocusedWindow(), url)
    .then(dl => validateFile(dl))
    .catch( err => {
      win.webContents.send("Client.Download.Error", err)
      console.error(err)
    });
  
}

function validateFile(download)
{
  var localAppPath = app.getPath("userData")
  var downloadSavePath = download.getSavePath()
  var expectedPath = localAppPath + "\\UUDI.zip"

  console.log(localAppPath)
  console.log(expectedPath)

  filesystem.copyFile(downloadSavePath, expectedPath,
  {
    done: function(error)
    {
      if(!error)
      {
        // Attempt to create directory
        try
        { fs.mkdirSync(localAppPath + "\\UUDI");
        } catch (e){}

        // extract the zip file
        extract(expectedPath, { dir: localAppPath + "\\UUDI" }, function(err)
        {
          if(!err)
          {
            console.log("Extracted UUDI client")
            win.webContents.send("Client.Ready")
          }
          else
          {
            console.log("Failed to extract file!")
            console.error(err)
          }
        })
      }
      else
      {
        console.log(error)
      }
    }
  })
}


ipcMain.on('Client.RequestLaunch', (event, arg) => {

  // check we've not already downloaded this release
  if(!fs.existsSync( app.getPath("userData") + "\\UUDI\\windows\\uudi.exe"))
  {
    // Download from the repository
    downloadFile("http://192.168.1.52/builds/windows.zip")
  }
  else
  {
    // The executable
    var executablePath = app.getPath("userData") + "\\UUDI\\windows\\uudi.exe";
    
    // Run the application
    execApplication(executablePath, function(err, data) {
      if(err)
      {
        console.error(err)
      }
    })
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.