const {shell} = require('electron');

function openTwitter()
{
  shell.openExternal("https://twitter.com/CorpSquadGames");
}

function openFacebook()
{
  shell.openExternal("https://www.facebook.com/CorpSquadGames");
}

function openTwitch()
{
  shell.openExternal("https://www.twitch.tv/corpsquadgames");
}