var deviceID = "400029000a51353335323536"; //change these to your device's
var accessToken = "4ed978c8d44ee74e0da0a2e08db5dcd401ce9958"; //eventually these values will be obtained from a user form

function loadLamp()
{
  requestURL = "https://api.particle.io/v1/devices/" + deviceID + "/setting?access_token=" + accessToken;
  $.getJSON(requestURL, function(json)  {
      var setting = json.result;
      document.getElementById(setting).className = 'activeSwitch';
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
    }
  };
  xhr.open("POST", "https://api.particle.io/v1/devices/" + deviceID + "/" + setting + "?access_token=" + accessToken, true);
  xhr.send();
}
