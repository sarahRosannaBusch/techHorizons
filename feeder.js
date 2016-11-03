var deviceID = "420018000a51353335323536"; //change these to your device's
var accessToken = "4ed978c8d44ee74e0da0a2e08db5dcd401ce9958"; //eventually these values will be obtained from a user form

function onLoad()
{
  measureSeeds();
}

function measureSeeds() //runs the 'readSeeds' function in the device's firmware
{
  $.ajax({
    type: "POST",
    url: "https://api.particle.io/v1/devices/" + deviceID + "/readSeeds?access_token=" + accessToken,
    timeout: 5000,
    dataType: "json",
    success: function(json)
    {
      $.ajax({
        type: "GET",
        url: "https://api.particle.io/v1/devices/" + deviceID + "/seedLvl?access_token=" + accessToken,
        timeout: 5000,
        dataType: "json",
        success: function(json)
        {
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
        },
        error: function(request, status, err)
        {}
      });
    },
    error: function(request, status, err)
    {
      document.getElementById('seedLevel').innerHTML =
      "Device not found :(";
    }
  });
}

function dispense()
{
  document.getElementById('dispensing').innerHTML = "Dispensing seeds...";

  $.ajax({
    type: "POST",
    url: "https://api.particle.io/v1/devices/" + deviceID + "/servo?access_token=" + accessToken,
    timeout: 5000,
    dataType: "json",
    success: function(json)
    {
      document.getElementById('dispensing').innerHTML = "Success!";
    },
    error: function(request, status, err)
    {
      document.getElementById('dispensing').innerHTML = "Dispense failed, check your device.";
    }
  });
}
