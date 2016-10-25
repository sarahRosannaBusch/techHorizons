var deviceID = "400029000a51353335323536"; //change these to your device's
var accessToken = "4ed978c8d44ee74e0da0a2e08db5dcd401ce9958"; //eventually these values will be obtained from a user form

function loadLamp()
{
  requestURL = "https://api.particle.io/v1/devices/" + deviceID + "/setting?access_token=" + accessToken;
  $.getJSON(requestURL, function(json)  {
      var setting = json.result;
      document.getElementById(setting).className = 'activeSwitch';
      settingDisplay(setting);
  });
}

function lamp(setting)
{
  document.getElementById('day').className = 'lightSwitch';
  document.getElementById('warm').className = 'lightSwitch';
  document.getElementById('evening').className = 'lightSwitch';
  document.getElementById('night').className = 'lightSwitch';
  document.getElementById('off').className = 'lightSwitch';
  document.getElementById('auto').className = 'lightSwitch';

  //Create an XMLHttpRequest Object with AJAX for POSTs
  var xhr;
    try { xhr = new XMLHttpRequest(); }
    catch(e) { xhr = new ActiveXObject('Microsoft.XMLHTTP'); } //for old versions of IE
  xhr.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      //document.getElementById("lampStatus").innerHTML = this.responseText;
      document.getElementById(setting).className = 'activeSwitch';
      settingDisplay(setting);
    }
  };
  xhr.open("POST", "https://api.particle.io/v1/devices/" + deviceID + "/" + setting + "?access_token=" + accessToken, true);
  xhr.send();
}

function settingDisplay(setting)
{
  if(setting == 'auto')
  {
    document.getElementById('lightPanel').innerHTML =
    "<h2> Auto Setting </h3>" +
    "<p> 6am - Warm Light </p>" +
    "<p> 7am - Bright Light (only if the room is too dim) </p>" +
    "<p> 6pm - Warm Light </p>" +
    "<p> 9pm - Evening Light </p>" +
    "<p> 10pm - Night Light </p>" +
    "<p> 11pm - Lamp Off </p>" +
    "<p> *These settings will also be fully customizable. </p>"
    ;
  }
  else if(setting == "day")
  {
    document.getElementById('lightPanel').innerHTML =
    "<h2> Bright Light </h2>" +
    "<p> This setting produces bright light needed to stimulate you during the day. </p>"
    ;
  }
  else if(setting == "warm")
  {
    document.getElementById('lightPanel').innerHTML =
    "<h2> Warm Light </h2>" +
    "<p> This setting produces warm light for waking up gently and winding down in the evening. </p>" 
    ;
  }
  else if(setting == "evening")
  {
    document.getElementById('lightPanel').innerHTML =
    "<h2> Evening Light </h2>" +
    "<p> This setting provides light without stimulating melatonin production, to get your body ready to sleep. </p>"
    ;
  }
  else if(setting == "night")
  {
    document.getElementById('lightPanel').innerHTML =
    "<h2> Night Light </h2>" +
    "<p> For those times you need to see in the dark without getting blinded. </p>"
    ;
  }
  else if(setting == "off")
  {
    document.getElementById('lightPanel').innerHTML =
    "<h2> Lamp Off </h2>" +
    "<p> Whenever the lamp is powered on it will start on this setting. </p>"
    ;
  }
}
