var geocoder;
var directionsDisplay;
var directionsService;
var directionsLeg
var map; var start, end;  
var route;
var data = '<table border = \"1\"><tr><td>'+ 'Transit' + '</td><td>' +'Description' + '</td><td>' + 'Type' + '</td><td>' + 'Duration' + '</td></tr>';

function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    var chicago = new google.maps.LatLng(41.850033, -87.6500523);
    var mapOptions = {
        zoom: 7,
        center: chicago
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
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
                          $("#alldivs").css({
                            height: "100%",
                            width: "100%",
                            margin: "0px",
                            padding: "0px"
                          });
                    showMap()
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
      var summary = document.getElementById('results');
      summary.innerHTML = '';
      // For each route, display summary information.
      // summary.innerHTML += '<b>Route Segment: ' + "1" + '</b><br>';
      // summary.innerHTML += route.legs[0].start_address + ' to ';
      // summary.innerHTML += route.legs[0].end_address + '<br>';
      // summary.innerHTML += route.legs[0].duration.text + '<br>';   
      // // summary.innerHTML += route.legs[0].steps[0].transit.line.vehicle + '<br>';  
      // summary.innerHTML += route.legs[0].distance.text + '<br><br>';
      //this is for transit
      if (route.legs[0].steps.length>1){
                    console.log(route.legs[0].steps)
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
            //console.log(route.legs[0].steps)
    //         console.log(route.legs[0].steps.length); 
    }
  }); 
}
function transitInfo(travel){
  if (travel.travel_mode == "WALKING"){
    data += '<tr><td>' + "" + '</td><td>' + travel.instructions + '<br>' + "About " + travel.distance.text + '</td><td>'+ travel.travel_mode + '</td><td>' + travel.duration.text + '</td></tr>';   
  }
  else {
    var s = travel.transit.line.name;
    var t = travel.transit.line.vehicle.type;
    data += '<tr><td>' + "" + '</td><td>' + " " + travel.transit.headsign + ": " + s + '<br>' + travel.instructions + '<br>' + "About " + travel.distance.text + '</td><td>'+ t + '</td><td>' + travel.duration.text + '</td></tr>';      
  }
}

function showMap() {
    var mapOptions = {
        zoom: 15,
        center: start
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
    transitRoute(start, end);
}

$(document).ready(function(){
  // Initialize tabs and pills
  $('.note-tabs').tab();
});