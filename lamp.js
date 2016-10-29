var deviceID = ""; //change these to your device's
var accessToken = ""; //eventually these values will be obtained from a user form

function loadLamp() //when the page is loaded it determines the current status of the lamp
{
  //reference: http://stackoverflow.com/questions/17156332/jquery-ajax-how-to-handle-timeouts-best
  $.ajax({
    type: "GET",
    url:  "https://api.particle.io/v1/devices/" + deviceID + "/setting?access_token=" + accessToken,
    timeout: 5000,
    dataType: "json",
    success: function(json)
    {
      var setting = json.result;
      document.getElementById(setting).className = 'activeSwitch';
      settingDisplay(setting);
    },
    error: function(request, status, err)
    {
      if(status == "timeout")
      {
        document.getElementById('lightPanel').innerHTML =
        "<h2> Device not found </h2>" +
        "<p> Please make sure your device is connected to Wifi and power, then refresh this page. </p>"
        ;
      }
      else
      {
        document.getElementById('lightPanel').innerHTML =
        "error: " + request + status + err;
      }
    }
  });
}

function lamp(setting) //lamp controls
{
  //reset all buttons to 'off'
  document.getElementById('day').className = 'lightSwitch';
  document.getElementById('warm').className = 'lightSwitch';
  document.getElementById('evening').className = 'lightSwitch';
  document.getElementById('night').className = 'lightSwitch';
  document.getElementById('off').className = 'lightSwitch';
  document.getElementById('auto').className = 'lightSwitch';

  $.ajax({
    type: "POST",
    url: "https://api.particle.io/v1/devices/" + deviceID + "/" + setting + "?access_token=" + accessToken,
    timeout: 5000,
    dataType: "json",
    success: function(json)
    {
      document.getElementById(setting).className = 'activeSwitch';
      settingDisplay(setting);
    },
    error: function(request, status, err)
    {
      if(status == "timeout")
      {
        document.getElementById(setting).className = 'deadSwitch';
        settingDisplay(setting);
      }
      else
      {
        document.getElementById('lightPanel').innerHTML =
        "error: " + request + status + err;
      }
    }
  });

  //Using the following creates a 400 error when the device is not connected...is there a better way to handle this?
  /*Create an XMLHttpRequest Object for POSTs
  var xhr;
    try { xhr = new XMLHttpRequest(); }
    catch(e) { xhr = new ActiveXObject('Microsoft.XMLHTTP'); } //for old versions of IE
  xhr.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200) //ok
    {
      //document.getElementById("lampStatus").innerHTML = this.responseText;
      document.getElementById(setting).className = 'activeSwitch';
    }
  };
  xhr.open("POST", "https://api.particle.io/v1/devices/" + deviceID + "/" + setting + "?access_token=" + accessToken, true);
  xhr.send();
  settingDisplay(setting);
  */
}

function settingDisplay(setting)
{
  var description = "";
  if(setting == 'auto')
  {
    description =
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
    description =
    "<h2> Bright Light </h2>" +
    "<p> This setting produces bright light needed to stimulate you during the day. </p>"
    ;
  }
  else if(setting == "warm")
  {
    description =
    "<h2> Warm Light </h2>" +
    "<p> This setting produces warm light for waking up gently and winding down in the evening. </p>"
    ;
  }
  else if(setting == "evening")
  {
    description =
    "<h2> Evening Light </h2>" +
    "<p> This setting provides light without stimulating melatonin production, to get your body ready to sleep. </p>"
    ;
  }
  else if(setting == "night")
  {
    description =
    "<h2> Night Light </h2>" +
    "<p> For those times you need to see in the dark without getting blinded. </p>"
    ;
  }
  else if(setting == "off")
  {
    description =
    "<h2> Lamp Off </h2>" +
    "<p> Whenever the lamp is powered on it will start on this setting. </p>"
    ;
  }

  if(document.getElementById(setting).className == 'deadSwitch')
  {
    description += "<p class='error'> Device not found :( </p>";
  }

  document.getElementById('lightPanel').innerHTML = description;
}
