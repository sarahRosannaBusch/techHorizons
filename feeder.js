var deviceID = "420018000a51353335323536"; //change these to your device's
var accessToken = "4ed978c8d44ee74e0da0a2e08db5dcd401ce9958"; //eventually these values will be obtained from a user form

function onLoad()
{
  measureSeeds();
  //displayMeasurement();
}

function measureSeeds() //runs the 'readSeeds' function in the device's firmware
{
  //Create an XMLHttpRequest Object with AJAX for POSTs
  var xhr;
    try { xhr = new XMLHttpRequest(); }
    catch(e) { xhr = new ActiveXObject('Microsoft.XMLHTTP'); } //for old versions of IE
  xhr.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      //document.getElementById("seedLevel").innerHTML = this.responseText;
    }
  };
  xhr.open("POST", "https://api.particle.io/v1/devices/" + deviceID + "/readSeeds?access_token=" + accessToken, true);
  xhr.send();
//}

//function displayMeasurement() //on html page
//{
  requestURL = "https://api.particle.io/v1/devices/" + deviceID + "/seedLvl?access_token=" + accessToken;
  $.getJSON(requestURL, function(json)  {
    var lvl = json.result;
    var msg = "";

    switch(lvl)
    {
      case 0:
        msg = "Full";
        break;
      case 1:
        msg = "Two-Thirds Full";
        break;
      case 2:
        msg = "One-Third Full";
        break;
      case 3:
        msg = "Seeds Low";
        break;
      case 4:
        msg = "Empty";
        break;
      default:
        msg = "Unknown Seed Level";
    }
    document.getElementById("seedLevel").innerHTML = "Seed Level: " + msg;
  });
}

function dispense()
{
  document.getElementById('dispensing').innerHTML = "Dispensing seeds...";

  //Create an XMLHttpRequest Object with AJAX for POSTs
  var xhr;
    try { xhr = new XMLHttpRequest(); }
    catch(e) { xhr = new ActiveXObject('Microsoft.XMLHTTP'); } //for old versions of IE
  xhr.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      //document.getElementById("dispensing").innerHTML = this.responseText;
    }
  };
  xhr.open("POST", "https://api.particle.io/v1/devices/" + deviceID + "/servo?access_token=" + accessToken, true);
  xhr.send();

  //how do I do this?
  //if the returned value is 1
  //document.getElementById('dispensing').innerHTML = "Success!";
}
