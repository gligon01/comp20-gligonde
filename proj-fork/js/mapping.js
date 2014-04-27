var map;
var geocoder, location1, location2, gDir;

function getMyLocation() {
    //lat = -99999;
    //lng = -99999;
    //elem = document.getElementById("loc");
    if (navigator.geolocation) {
        // the navigator.geolocation object is supported on your browser
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
          //  elem.innerHTML = "<h1>You are in " + lat + ", " + lng + "</h1>";
        });
        // elem.innerHTML = "Getting your location...";
    }
    else {
        alert("Geolocation is not supported by your web browser =/");
    }
}

function initialize() {
    lat = 42.360024;
    lng = -71.060168;
   // getMyLocation();

    var mapOptions = {
          center: new google.maps.LatLng(lat, lng),
          zoom: 15
        };
    map = new google.maps.Map(document.getElementById("map_canvas"),
          mapOptions);

    geocoder = new GClientGeocoder();
    gDir = new GDirections();
    GEvent.addListener(gDir, "load", function() {
        var drivingDistanceMiles = gDir.getDistance().meters / 1609.344;
        var drivingDistanceKilometers = gDir.getDistance().meters / 1000;
    });
}

function showLocation() {
    geocoder.getLocations(document.forms[0].address1.value, function (response) {
        if (!response || response.Status.code != 200)
        {
            alert("Sorry, we were unable to geocode the first address");
        }
        else
        {
          location1 = {lat: response.Placemark[0].Point.coordinates[1], lon: response.Placemark[0].Point.coordinates[0], address: response.Placemark[0].address};
          geocoder.getLocations(document.forms[0].address2.value, function (response) {
              if (!response || response.Status.code != 200)
              {
                  alert("Sorry, we were unable to geocode the second address");
              }
              else
              {
                  location2 = {lat: response.Placemark[0].Point.coordinates[1], lon: response.Placemark[0].Point.coordinates[0], address: response.Placemark[0].address};
                  gDir.load('from: ' + location1.address + ' to: ' + location2.address);
                  console.log(location1)
                  console.log(location2)
              }
          });
        }
    });
}

function GetSite() {
  window.location.href = "main.html";
}

  google.maps.event.addDomListener(window, "load", initialize);

  google.maps.event.addDomListener(window, "resize", function() {
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center); 
  });