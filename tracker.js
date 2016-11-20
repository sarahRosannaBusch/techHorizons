var deviceID = "340036001951353338363036"; //change these to your device's
var accessToken = "7aae8e0b7bd849a669f4efc2907b31b0442cf7c3";

function onload()
{
  battery(); //checks the battery once when the page loads
  subscribe(); //subscribes to gps data so it updates whenever there is new data
}

function battery() //lamp controls
{
    $.ajax({
      type: "GET",
      url: "https://api.particle.io/v1/devices/" + deviceID + "/batteryVolts?access_token=" + accessToken,
      dataType: "json",
      success: function(json)
      {
        document.getElementById('batteryVolts').innerHTML = "Battery voltage: " + json.result + "V";
      },
      error: function(request, status, err)
      {
        document.getElementById('batteryVolts').innerHTML = "Battery voltage: n/a";
      }
    });
    $.ajax({
      type: "GET",
      url: "https://api.particle.io/v1/devices/" + deviceID + "/batteryLevel?access_token=" + accessToken,
      dataType: "json",
      success: function(json)
      {
        document.getElementById('batteryLevel').innerHTML = "Battery Level: " + json.result + "%";
      },
      error: function(request, status, err)
      {
        document.getElementById('batteryLevel').innerHTML = "Check your device.";
      }
    });
}

function subscribe() //look for Particle.publish() events
{
  var eventSource = new EventSource("https://api.particle.io/v1/devices/" + deviceID + "/events/?access_token=" + accessToken);
  eventSource.addEventListener("trackerData", function(e) {
            var parsedData = JSON.parse(e.data);
            document.getElementById('gpsData').innerHTML = parsedData.data;
            document.getElementById('readTime').innerHTML = "Last update: " + parsedData.published_at;
        }, false);
}
