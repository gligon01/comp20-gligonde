  
  var myLat = 0;
  var myLng = 0;
  var request = new XMLHttpRequest();
  var me = new google.maps.LatLng(myLat, myLng);
  var myOptions = {
        zoom: 13, // The larger the zoom number, the bigger the zoom
        center: me,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
  var map;
  var marker;
  //var infowindow = new google.maps.InfoWindow();
  //var places;

function getMyLocation() {
    lat = -99999;
    lng = -99999;
    //elem = document.getElementById("loc");
    if (navigator.geolocation) {
        // the navigator.geolocation object is supported on your browser
        navigator.geolocation.getCurrentPosition(function(position) {
            myLat = position.coords.latitude;
            myLng = position.coords.longitude;
            renderMap();
          // elem.innerHTML = "<h1>You are in " + lat + ", " + lng + "</h1>";
        });
        // elem.innerHTML = "Getting your location...";
    }
    else {
        alert("Geolocation is not supported by your web browser =/");
    }
}

function initialize() {
  var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
  getMyLocation();
}
     // from google website -> google.maps.event.addDomListener(window, 'load', initialize);
//        STARTS HERE

function renderMap() {
  me = new google.maps.LatLng(myLat, myLng);

  // Update map and go there...
  map.panTo(me);

  // Create a marker
  marker = new google.maps.Marker({
    position: me,
    title: "Here I Am!"
  });
  marker.setMap(map);

  // Open info window on click of marker
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(marker.title);
    infowindow.open(map, marker);
  });

  // Calling Google Places API
  var request = {
    location: me,
    radius: '500',
    types: ['food']
  };
  /*
  service = new google.maps.places.PlacesService(map);
  service.search(request, callback);
}
*/
}

      // Taken from http://code.google.com/apis/maps/documentation/javascript/places.html
      function callback(results, status)
      {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          alert("Got places back!");
          places = results;
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }

      function createMarker(place)
      {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.close();
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }
/*
function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

loadJSON('stations.json',
         stations = JSON.parse(stations.json);
         function(data) { console.log(data); },
         function(xhr) { console.error(xhr); }
);

loadJSON('http://mbtamap.herokuapp.com/mapper/rodeo.json',
         schedule = JSON.parse(rodeo.json);
         function(data) { console.log(data); },
         function(xhr) { console.error(xhr); }
);
*/

/* JSON stuff
data = JSON.parse(response.txt);
stop_of_interest = "Davis";
for(i = 0; i < data["schedule"].lengh; i++) {
  destination = data["schedule"][i];
  //Step 2 - get list of stops
  stops = destination["Predictions"];
  for (j = 0; j < stops.length; j++) {
    s = stops[j];
    if(s == stop_of_interest) {
      console.log(s["Seconds"]);
      console.log(destionation["Destination"]);
    }
  }
}

*/