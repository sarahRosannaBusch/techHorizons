var deviceID = ""; //change these to your device's
var accessToken = ""; //eventually these values will be obtained from a user form

var wake = 7; //for auto setting
var sleep = 23; //these default values are for if the device is offline

function connect()
{
  deviceID = document.getElementById('lampID').value;
  accessToken = document.getElementById('lampToken').value;
  loadLamp();
}

function loadLamp() //when the page is loaded it determines the current status of the lamp
{
  disableButtons(); //so light switches can't be clicked until page is ready
  document.getElementById('lightPanel').innerHTML =
    "<h2> Please wait... </h2>" +
    "<p> Connecting to device. </p>"
    ;

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
      enableButtons(); //now settings can be changed
      getTimerSetting(); //gets the timer settings currently in the lamp
      settingDisplay(setting);
    },
    error: function(request, status, err)
    {
      enableButtons(); //now settings can be changed
      //if(status == "timeout")
      //{
        document.getElementById('lightPanel').innerHTML =
        "<h2> Device not found </h2>" +
        "<p> Please make sure your device is connected to Wifi and power, then try reconnecting. </p>"
        ;
      //}
      /*else
      {
        document.getElementById('lightPanel').innerHTML =
        "<h2> Device not found </h2>" +
        "<p> Make sure you've entered the correct credentials. </p>"
        ;
      }*/
    }
  });
}

function getTimerSetting()
{
  //how do I get these all as one packet?
  $.ajax({
    type: "GET",
    url:  "https://api.particle.io/v1/devices/" + deviceID + "/wake?access_token=" + accessToken,
    timeout: 2000,
    dataType: "json",
    success: function(json)
    {
      wake = json.result;
    }
  });

  $.ajax({
    type: "GET",
    url:  "https://api.particle.io/v1/devices/" + deviceID + "/sleep?access_token=" + accessToken,
    timeout: 2000,
    dataType: "json",
    success: function(json)
    {
      sleep = json.result;
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
      //if(status == "timeout")
      //{
        document.getElementById(setting).className = 'deadSwitch';
        settingDisplay(setting);
      //}
      //else
      //{
        //document.getElementById('lightPanel').innerHTML =
        //"error: " + request + status + err;
      //}
    }
  });
}

function settingDisplay(setting)
{
  var description = "";

  if(setting == "day")
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
  else if(setting == 'auto')
  {
    var dawn = wake-1;
    var dusk = sleep-5;
    var sunset = sleep-2;
    var dark = sleep-1;

    //fix bug: this loads too fast, values display as unknown on first connect
    description =
    "<div id='autoDescription'>" +
      "<h2> Auto Setting </h3>" +
      "<p>" + dawn + ":00 - Warm Light </p>" +
      "<p>" + wake + ":00 - Bright Light </p><br>" +
      "<p>" + dusk + ":00 - Warm Light </p>" +
      "<p>" + sunset + ":00 - Evening Light </p>" +
      "<p>" + dark + ":00 - Night Light </p>" +
      "<p>" + sleep + ":00 - Lamp Off </p>" +
    "</div>" +
    "<div id='customLight'>" +
      "<p id='instructions'> Enter the hour (4-12) that you would like to wake up, and the hour (18-24) of your bedtime. </p>" +
      "Wake up: <input type='text' id='wake' size='2' value='" + wake + "'><br><br>" +
      "Bedtime: <input type='text' id='sleep' size='2' value='" + sleep + "'><br>" +
      "<button id='setLight' onclick='setTimer()'> Apply </button>" +
    "</div>"
    ;
  }

  if(document.getElementById(setting).className == 'deadSwitch')
  {
    description += "<p class='error'> Device not found :( </p>";
  }

  document.getElementById('lightPanel').innerHTML = description;
}

function setTimer()
{
  //contraints on time settings are to avoid conflicts, this can be modified later for more user control
  var temp = document.getElementById('wake').value;
  if(temp=='4' || temp=='5' || temp=='6' || temp=='7' || temp=='8' || temp=='9' || temp=='10' || temp=='11' || temp=='12')
  {
    wake = temp;
  }

  temp = document.getElementById('sleep').value;
  if(temp=='18' || temp=='19' || temp=='20' || temp=='21' || temp=='22' || temp=='23' || temp=='24')
  {
    sleep = temp;
  }

  $.ajax({
    type: "POST",
    url: "https://api.particle.io/v1/devices/" + deviceID + "/setMorning?access_token=" + accessToken,
    data: {field1: wake},
    timeout: 5000,
    //dataType: "json",
    success: function(json)
    {
      getTimerSetting(); //to make sure the display is showing what's actually happening in the lamp
      settingDisplay("auto"); //update display
    },
    error: function(request, status, err)
    {}
  });

  //this needs to be done for each setting because the Particle.function() can only take one argument :(
  $.ajax({
    type: "POST",
    url: "https://api.particle.io/v1/devices/" + deviceID + "/setNight?access_token=" + accessToken,
    data: {field1: sleep},
    timeout: 5000,
    //dataType: "json",
    success: function(json)
    {
      getTimerSetting(); //to make sure the display is showing what's actually happening in the lamp
      settingDisplay("auto"); //update display
    },
    error: function(request, status, err)
    {}
  });
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
