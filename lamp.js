var deviceID = ""; //change these to your device's
var accessToken = ""; //eventually these values will be obtained from a user form

function loadLamp() //when the page is loaded it determines the current status of the lamp
{
  disableButtons(); //so light switches can't be clicked until page is ready

  //reference: http://stackoverflow.com/questions/17156332/jquery-ajax-how-to-handle-timeouts-best
  $.ajax({
    type: "GET",
    url:  "https://api.particle.io/v1/devices/" + deviceID + "/setting?access_token=" + accessToken,
    timeout: 5000,
    dataType: "json",
    success: function(json)
    {
      enableButtons(); //now settings can be changed
      var setting = json.result;
      document.getElementById(setting).className = 'activeSwitch';
      settingDisplay(setting);
    },
    error: function(request, status, err)
    {
      enableButtons(); //now settings can be changed
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
  disableButtons(); //so multiple buttons can't be clicked

  $.ajax({
    type: "POST",
    url: "https://api.particle.io/v1/devices/" + deviceID + "/" + setting + "?access_token=" + accessToken,
    timeout: 5000,
    dataType: "json",
    success: function(json)
    {
      enableButtons();
      document.getElementById(setting).className = 'activeSwitch';
      settingDisplay(setting);
    },
    error: function(request, status, err)
    {
      enableButtons();
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

function disableButtons()
{
  $('.lightSwitch').css('cursor', 'wait'); //cursor indicates program is running
  //$('.lightSwitch').css('disabled', true); //why doesn't this work?

  //so multiple button presses don't mess things up
  document.getElementById('day').disabled = true;
  document.getElementById('warm').disabled = true;
  document.getElementById('evening').disabled = true;
  document.getElementById('night').disabled = true;
  document.getElementById('off').disabled = true;
  document.getElementById('auto').disabled = true;

  //reset all buttons to look 'off'
  document.getElementById('day').className = 'lightSwitch';
  document.getElementById('warm').className = 'lightSwitch';
  document.getElementById('evening').className = 'lightSwitch';
  document.getElementById('night').className = 'lightSwitch';
  document.getElementById('off').className = 'lightSwitch';
  document.getElementById('auto').className = 'lightSwitch';
}

function enableButtons()
{
  $('.lightSwitch').css('cursor', 'pointer');
  //$('.lightSwitch').css('disabled', false);

  document.getElementById('day').disabled = false;
  document.getElementById('warm').disabled = false;
  document.getElementById('evening').disabled = false;
  document.getElementById('night').disabled = false;
  document.getElementById('off').disabled = false;
  document.getElementById('auto').disabled = false;
}
