const GitHubAPI = require('github')
const {ipcRenderer, BrowserWindow} = require('electron')

// Initialise github api
var github = new GitHubAPI(
    {
        debug: true,
        protocol: "https",
        timeout: 5000,
        followRedirects:  false
    }
 )

function OnLaunch()
{
    // Find latest release
    var latestRelease = github.repos.getLatestRelease(
    {
        owner: "RevoluPowered", 
        repo: "premake-stuff"
    }, function(err,res)
    {
        if(!err)
        {
            
            console.log(res)
            console.log("tar: " + res.data.tarball_url)
            console.log("zip: " + res.data.zipball_url)
            ipcRenderer.send('LaunchButton', res.data)
        }
        else
        {
            console.log("failed to request latest version... remaining at the same version")
        }
    })



}