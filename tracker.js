var deviceID = ""; //change these to your device's
var accessToken = "";

var lat = 51.5; //once the gps actually sees a satellite it will update these
var lon = -0.12; //need to get a google maps API key to have the map display these coords

function connect()
{
  deviceID = document.getElementById('trackerID').value;
  accessToken = document.getElementById('trackerToken').value;
  battery(); //checks the battery once when the page loads
  subscribe(); //subscribes to gps data so it updates whenever there is new data
}

function battery()
{
  document.getElementById('batteryVolts').innerHTML = "Checking battery...";
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
  document.getElementById('gpsData').innerHTML = "Aquiring signal, this make take several minutes..."
  var eventSource = new EventSource("https://api.particle.io/v1/devices/" + deviceID + "/events/?access_token=" + accessToken);
  eventSource.addEventListener("trackerData", function(e) {
            var parsedData = JSON.parse(e.data);
            var fullData = parsedData.data;
            document.getElementById('gpsData').innerHTML = fullData;
            document.getElementById('readTime').innerHTML = "Last update: " + parsedData.published_at;
        }, false);
}

function myMap()
{
  //this is based on the w3school google maps example
  var mapOptions =
  {
    center: new google.maps.LatLng(lat, lon),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.HYBRID
  }
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
}
