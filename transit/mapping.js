function getMyLocation() {
    lat = -99999;
    lng = -99999;
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
    getMyLocation();

    var mapOptions = {
          center: new google.maps.LatLng(lat, lng),
          zoom: 8
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
      }
     google.maps.event.addDomListener(window, 'load', initialize);
}

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
