var geocoder;
var directionsDisplay;
var directionsService;
var directionsLeg
var map; var start, end;  
var route;
var data;
var image = '<img src="pictures/walk.png" alt="Smiley face" width="42" height="42">';
var image_all = ['<img src="pictures/bus.png" alt="Smiley face" width="42" height="42">','<img src="pictures/subway.png" alt="Smiley face" width="42" height="42">','<img src="pictures/commuter_rail.png" alt="Smiley face" width="42" height="42">'];
var commute = [{"BUS":0, "SUBWAY":1, "HEAVY_RAIL":2}];
console.log(commute)

function initialize()
{
    directionsDisplay = new google.maps.DirectionsRenderer();
    //directionsLeg = new google.maps.DirectionsLeg();
    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    var boston = new google.maps.LatLng(42.360024, -71.060168);
    var mapOptions = {
        zoom: 15,
        center: boston
    }
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    directionsDisplay.setMap(map);
}

function showLocation() {
    // ur1 = document.forms[0].address1.value;
    // ur2 = document.forms[0].address2.value;
    ur1 = 'Brandeis University';
    ur2 = 'Davis Square';
    geocoder.geocode({'address': ur1}, function (response, status) {
        if (status == google.maps.GeocoderStatus.OK)
        {
            map.setCenter(response[0].geometry.location)
            start = response[0].geometry.location;
            geocoder.geocode({'address': ur2}, function (res, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    // var Lat1 = res["results"][0]["geometry"].location.lat;
                    // var Lng1 = res["results"][0]["geometry"].location.lng;
                    end = res[0].geometry.location;
                    showMap();
                }
                else{
                    alert("Sorry, we were unable to geocode the second address")
                }
            });  
        }       
        else{
            alert("Sorry, we were unable to geocode the first address");
        }
     });
}
// //this to show the route depending on what mode is selected or calculate the shortest mode
function transitRoute(start, end) {
  //case of TRANSIT
  var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.TRANSIT,
      unitSystem: google.maps.UnitSystem.METRIC
  };
  //case of Car and Taxi
  //   var request = {
  //     origin: start,
  //     destination: end,
  //     travelMode: google.maps.TravelMode.DRIVING,
  //     unitSystem: Metric 
  // };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      route = response.routes[0];
      var summary = document.getElementById('pub');
      summary.innerHTML = '';
      data = '<table border = \"1\"><tr><td>'+ 'Transit' + '</td><td>' +'Description' + '</td><td>' + 'Type' + '</td><td>' + 'Duration' + '</td></tr>';
      //this is for transit
      if (route.legs[0].steps.length>1){
            //console.log(route.legs[0].steps)
        for (i=0; i < route.legs[0].steps.length; i++){
           transitInfo(route.legs[0].steps[i]);
            //what do we want to do?
            //post instructions
            //indicate the times
        }
        data += '</table>';
        summary.innerHTML += data;
      }
      else {
        //Here is the walking distance
        //No transit vehicle coming in the next .. minutes Want to walk?
      }
    }
  }); 
}

function transitInfo(travel){
  if (travel.travel_mode == "WALKING"){
    data += '<tr><td>' + image + '</td><td>' + travel.instructions + '<br>' + "About " + travel.distance.text + '</td><td>'+ travel.travel_mode + '</td><td>' + travel.duration.text + '</td></tr>';   
  }
  else {
    var lineName = travel.transit.line.name;
    var lineType = travel.transit.line.vehicle.type;
    switch (lineType) {
      case "BUS":
        go = commute[0].BUS; 
        break;
      case "SUBWAY":
        go = commute[0].SUBWAY;
        break;
      case "HEAVY_RAIL":
        go = commute[0].HEAVY_RAIL;
        break;
    }
    data += '<tr><td>' + image_all[go] + '</td><td>' + " " + travel.transit.headsign + ": " + lineName + '<br>' + travel.instructions + '<br>' + "About " + travel.distance.text + '</td><td>'+ lineType + '</td><td>' + travel.duration.text + '</td></tr>';      
  }
}

function showMap() {
    var mapOptions = {
        zoom: 15,
        center: start
    }
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    directionsDisplay.setMap(map);
    transitRoute(start, end);
}


// For redirecting purposes

function GetMain() {
  window.location.href = 'main.html';
}

