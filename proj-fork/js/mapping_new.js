var geocoder;
var directionsDisplay;
var directionsService;
var directionsLeg;
var map; var start, end;  
var route;
var data;
var image = '<img src="pictures/walk.png" alt="Smiley face" width="42" height="42">';
var image_all = ['<img src="pictures/bus.png" alt="Smiley face" width="42" height="42">','<img src="pictures/subway.png" alt="Smiley face" width="42" height="42">','<img src="pictures/commuter_rail.png" alt="Smiley face" width="42" height="42">'];
var commute = [{"BUS":0, "SUBWAY":1, "HEAVY_RAIL":2}];
var gasCost; var totalPrice; var tally; var doubletally;

function initialize()
{
    var mapOptions = {
    zoom: 15
  };
    directionsDisplay = new google.maps.DirectionsRenderer();
    //directionsLeg = new google.maps.DirectionsLeg();
    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          var infowindow = new google.maps.InfoWindow({
            map: map,
            position: pos,
            content: 'Location found using HTML5.'
        });
        map.setCenter(pos);
        directionsDisplay.setMap(map);
        var lat = position.coords.latitude; var lng = position.coords.longitude;
        var latlng = new google.maps.LatLng(lat, lng)
        var myPosition = codeLatLng(latlng);
      }, function() {
        handleNoGeolocation(true);
      });
    } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }
    var options = {
    map: map,
    position: new google.maps.LatLng(42.360024, -71.060168),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
  directionsDisplay.setMap(map);
}

function codeLatLng(latlng) {
  if (geocoder) {
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          document.forms[0].address1.value=results[0].formatted_address;
        }
      }
    });
  }
}

function showLocation() {
    tally = 0;
    ur1 = document.forms[0].address1.value;
    ur2 = document.forms[0].address2.value;
    // ur1 = 'Tufts University';
    // ur2 = 'Davis Square';
    geocoder.geocode({'address': ur1}, function (response, status) {
        if (status == google.maps.GeocoderStatus.OK)
        {
            map.setCenter(response[0].geometry.location)
            start = response[0].geometry.location;
            var Lat = response[0]["geometry"].location.k;
            var Lng = response[0]["geometry"].location.A;
            geocoder.geocode({'address': ur2}, function (res, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    end = res[0].geometry.location;
                    showMap();
                    closestStation(Lat, Lng);
                    makeTaxiCall(start, end);
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
  var reqst = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.TRANSIT,
      unitSystem: google.maps.UnitSystem.METRIC
  };
  var getDisp = document.getElementById('pub');
  getDirections(reqst, getDisp);
 //case of Car and Taxi
    var req = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC 
  };
  var dispCar = document.getElementById('auto');
  getDirections(req, dispCar);

  var dispTaxi = document.getElementById('tax');
  getDirections(req, dispTaxi);
}

//displays the information for all modes of transit on the website
function getDirections(request, display){
    directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      //displays the polyline on the map  
      directionsDisplay.setDirections(response);
      //gets all the route info, typically returns just one route
      route = response.routes[0];
      display.innerHTML = '';
      data = '<table border = \"1\"><tr><td>'+ 'Transit' + '</td><td>' +'Description' + '</td><td>' + 'Type' + '</td><td>' + 'Duration' + '</td></tr>';
      //this gets the transit information, checks if there are
      //other travel modes in addition to walking
      //legs[0] only accounts for one of the possible queries (if given a less descriptive address)
      if (route.legs[0].steps.length>1){
            //console.log(route.legs[0].steps)
        for (i=0; i < route.legs[0].steps.length; i++){
           transitInfo(route.legs[0].steps[i]);
            if((route.legs[0].steps[i]).travel_mode == "DRIVING") {
              document.getElementById("CarTime").innerHTML = "Total Journey Time: " + route.legs[0].duration.text + '<br>' + " Total Distance: " + route.legs[0].distance.text;
            }
            else {
             document.getElementById("PublicTime").innerHTML = "Total Journey Time: " + route.legs[0].duration.text + '<br>' + " Total Distance: " + route.legs[0].distance.text;          
            }
        }
        data += '</table>';
        display.innerHTML += data;

      }
      else {
        //returns the information for just walking alone
        alert('No transit vehicle coming in the next .. minutes. Want to walk?')
            document.getElementById("PublicTime").innerHTML = "Total Journey Time: " + route.legs[0].duration.text + '<br>' + " Total Distance: " + route.legs[0].distance.text;
      }
    }
  }); 
}

function transitInfo(travel){
  if (travel.travel_mode == "WALKING"){
    data += '<tr><td>' + image + '</td><td>' + travel.instructions + '<br>' + "About " + travel.distance.text + '</td><td>'+ travel.travel_mode + '</td><td>' + travel.duration.text + '</td></tr>';   
  }
  else if(travel.travel_mode == "DRIVING") {
    data += '<tr><td>' + " " + '</td><td>' + travel.instructions + '<br>' + "About " + travel.distance.text + '</td><td>'+ travel.travel_mode + '</td><td>' + travel.duration.text + '</td></tr>';   
  }
  else {
    //get the name of the line and the type of transit
    var lineName = travel.transit.line.name;
 
    var lineType = travel.transit.line.vehicle.type;
    switch (lineType) {
      case "BUS":
        go = commute[0].BUS; 
        lineName = "BUS";
        tally = tally+1;
        break;
      case "SUBWAY":
        go = commute[0].SUBWAY;
        tally = tally+1;
        doubletally = doubletally +1;
        if (doubletally>1){ 
          tally = tally -1;}
        break;
      case "HEAVY_RAIL":
        go = commute[0].HEAVY_RAIL;
        tally = tally+1;
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

function closestStation(latitude, longitude) {
  var milesPerGallon = 30;
  var lowestTotalCost = -1;
  var lowestIndex = 0;
  var lowestGasPrice = Number.MAX_VALUE;
  var lowestDistance = Number.MAX_VALUE;

  $.ajax({
        url: "http://devapi.mygasfeed.com/stations/radius/" + latitude + "/" + longitude + "/" +"50/reg/Distance/rfej9napna.json?callback=?",
              dataType: "json",
              success: function(data) {
                  //console.log(data);    
                  lowestGasPrice = data.stations[0].price;// Added by NANA
                  for (var index = 0; index < data.stations.length; index++)  {
                      var milesToStation = parseFloat(data.stations[index].distance.replace(" miles", ""));
                      var priceOfGas = parseFloat(data.stations[index].price);
                      if (data.stations[index].price == "N/A") { 
                        continue;
                      } else {
                    if (data.stations[index].price < lowestGasPrice){
                        lowestDistance = milesToStation;
                        lowestGasPrice = data.stations[index].price;
                            lowestIndex = index;
                        } else if (data.stations[index].price = lowestGasPrice){
                      if(data.stations[index].distance < lowestDistance){
                        lowestDistance = milesToStation;
                        lowestGasPrice = data.stations[index].price;
                            lowestIndex = index;
                          }
                        }
                      }
                  } 
                      gasCost = data.stations[lowestIndex].price;
                      console.log("The nearest optimal station is " + data.stations[lowestIndex].address);
                      console.log("with cost of " + parseFloat(data.stations[lowestIndex].price) + " per gallon of gas and distance of " + data.stations[lowestIndex].distance + ".");
                      // calculateGasCost(gasCost, milesPerGallon, lowestDistance);  
                      calculateGasCost(gasCost, milesPerGallon, route.legs[0].distance.value)   
                },
              error:function(){
            alert("Error");
        },
      });
}
//calculates and displays the gasCost in the respective tabs
function calculateGasCost(cost, mpg, distance){
  totalPrice = cost*(distance/mpg)*(1/1609.34);
  //console.log("cost to get to the your destination is " + thing);
  //console.log((totalPrice).toFixed(1))
  // document.getElementById('CarCost').innerHTML = "This journey will cost you $ " + (totalPrice).toFixed(1) + ' in gas Prices';
  document.getElementById('GasRate').innerHTML = "This journey will cost you $ " + (totalPrice).toFixed(1) + ' in gas Prices' + '<br>' + "Average Gas Price: $ " + gasCost + " per gallon";
  calcSubwayCost();
}

function jsonp(url) {
    var head = document.head;
    var script = document.createElement("script");

    script.setAttribute("src", url);
    head.appendChild(script);
    head.removeChild(script);
}

function jsonpCallback(taxiData) {
    var fare = taxiData.total_fare;
    var time = taxiData.duration;
    var distance = taxiData.distance;
    stringDistance = stringifyDistance(distance);
    stringTime = stringifyTime(time);

    document.getElementById("TaxiCost").innerHTML = "This journey will cost you $ " + fare + " in taxi fare"; 
    document.getElementById("TaxiTime").innerHTML = "Total Journey Time: " + stringTime + ' mins' + '<br>' + " Total Distance: " + stringDistance;        
}

function makeTaxiCall(origin, destination) {
    var oLat = parseFloat(origin.k);
    var oLon = parseFloat(origin.A);
    var dLat = parseFloat(destination.k);
    var dLon = parseFloat(destination.A);

    csCall = "http://api.taxifarefinder.com/fare?key=mUnes8afrE3a&entity_handle=Boston&origin=" + oLat + "," + oLon + "&destination=" + dLat + "," + dLon + "&callback=jsonpCallback";
    jsonp(csCall);
}

function stringifyTime(time) { 
    intTime = parseInt(time);
    // var hr = Math.floor(intTime / 3600).toString();
    var mn = Math.ceil((intTime/60));
    return mn;
}

function stringifyDistance(distance) { 
    var floatDistance = parseFloat(distance);    
    if(floatDistance < 1000){
      dist = floatDistance.toFixed(0);
      return (dist + " m")
    }
    else{
      dist = (floatDistance/1000).toFixed(3)
      return (dist + " km");
    }
}

function calcSubwayCost(){
//sendEmail()
  //checks if the time duration is more than 2 hours
  //checks if the journey legs are more than 2
  // if they are the give a maximum cost else give an exact price assuming Charlie Card Price
  //Subway+Bus||Bus+Subway||Bus+Bus - costs you $2.00 else $3.50

  if (tally>2 || (route.legs[0].duration.value>7200)) {
    document.getElementById('PublicCost').innerHTML = "This journey will cost you a maximum price of $3.50"
  }
  else if(tally>0) {
    document.getElementById('PublicCost').innerHTML = "This journey will cost you $2.00" 
  }
  else {
        document.getElementById('PublicCost').innerHTML = "Let's do some WORK OUT!" 
  }
} 

function sendEmail() {
  console.log("1")
//emailAd = "recipient@example.com"
 MailApp.sendEmail("shayibanky@gmail.com",
                   "Welcome to MINGOES",
                   "Thanks for registering with Mingoes...your passport to cheap transport");
}

function GetMain() {
  window.location.href = 'main.html';
}

function GetSign(username) {
  if(localStorage['username']=username;
}

function GetOut() {
  localStorage['username'] = '';
  window.location.href = 'main.html';
}

function GetProfile() {
  window.location.href = 'profile.html';
}

