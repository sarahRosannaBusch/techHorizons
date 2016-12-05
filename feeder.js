var deviceID = ""; //change these to your device's
var accessToken = ""; //eventually these values will be obtained from a user form
var timer; //for dispensing animation

function connect()
{
  deviceID = document.getElementById('feederID').value;
  accessToken = document.getElementById('feederToken').value;
  measureSeeds();
}

function measureSeeds() //runs the 'readSeeds' function in the device's firmware
{
  //reset graphic
  document.getElementById('unkSeeds').style.visibility = 'hidden';
  document.getElementById('seedsFull').style.visibility = 'hidden';
  document.getElementById('seeds3Q').style.visibility = 'hidden';
  document.getElementById('seeds2Q').style.visibility = 'hidden';
  document.getElementById('seeds1Q').style.visibility = 'hidden';

  document.getElementById('seedLevel').innerHTML = "<p> Measuring... </p>";
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
        //timeout: 5000,
        dataType: "json",
        success: function(json)
        {
          var lvl = json.result;
          var msg = "";

          switch(lvl)
          {
            case 0:
            {
              msg = "Full";
              document.getElementById('seedsFull').style.visibility = 'visible';
            }break;
            case 1:
            {
              msg = "Three Quarters Full";
              document.getElementById('seeds3Q').style.visibility = 'visible';
            }break;
            case 2:
            {
              msg = "Two Quarters Full";
              document.getElementById('seeds2Q').style.visibility = 'visible';
            }break;
            case 3:
            {
              msg = "One Quarter Left";
              document.getElementById('seeds1Q').style.visibility = 'visible';
            }break;
            case 4:
            {
              msg = "Empty";
            }break;
            default:
            {
              msg = "<p> Unknown Seed Level </p>";
              document.getElementById('unkSeeds').style.visibility = 'visible';
            }
          }
          document.getElementById("seedLevel").innerHTML = "<p> Seed Level: " + msg + "</p>";
        },
        error: function(request, status, err)
        {}
      });
    },
    error: function(request, status, err)
    {
      document.getElementById('seedLevel').innerHTML =
      "<p class='error'> Device not found :( </p>";
      document.getElementById('unkSeeds').style.visibility = 'visible';
    }
  });
}

function dispense()
{
  document.getElementById('feedBird').disabled = true; //disable button

  document.getElementById('dispensing').innerHTML = "<p> Dispensing seeds... </p>";
  timer = setInterval(svgDispense, 250); //runs animation

  $.ajax({
    type: "POST",
    url: "https://api.particle.io/v1/devices/" + deviceID + "/servo?access_token=" + accessToken,
    //timeout: 5000,
    dataType: "json",
    success: function(json)
    {
      document.getElementById('dispensing').innerHTML = "<p> Success! </p>";
      measureSeeds();
      killAnimation();
      document.getElementById('feedBird').disabled = false; //enable button
    },
    error: function(request, status, err)
    {
      document.getElementById('dispensing').innerHTML = "<p> Dispense failed, please check your device. </p>";
      killAnimation();
      document.getElementById('feedBird').disabled = false; //enable button
      document.getElementById('unkSeeds').style.visibility = 'visible';
    }
  });
}

var toggle = 0;
function svgDispense()
{
  document.getElementById('gateUp').style.visibility = 'hidden';
  if(toggle == 0)
  {
    document.getElementById('fall1').style.visibility = 'visible';
    document.getElementById('fall2').style.visibility = 'hidden';
    toggle = 1;
  }
  else if(toggle == 1)
  {
    document.getElementById('fall2').style.visibility = 'visible';
    document.getElementById('fall1').style.visibility = 'hidden';
    toggle = 2;
  }
  else if(toggle == 2)
  {
    document.getElementById('fall2').style.visibility = 'hidden';
    document.getElementById('fall1').style.visibility = 'hidden';
    toggle = 0;
  }
  else {
    killAnimation();
  }
}

function killAnimation()
{
  clearInterval(timer);
  document.getElementById('fall1').style.visibility = 'hidden';
  document.getElementById('fall2').style.visibility = 'hidden';
  document.getElementById('gateUp').style.visibility = 'visible';
}
