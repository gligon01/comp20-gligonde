/*
  function init()
      {
        // Faneuil Hall
        var landmark = new google.maps.LatLng(42.3599611, -71.0567528);

        // Set up map
        var myOptions = {
          zoom: 13, // The larger the zoom number, the bigger the zoom
          center: landmark,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // Create the map in the "map_canvas" <div>
        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        // Create a marker        
        var marker = new google.maps.Marker({
          position: landmark,
          title: "Faneuil Hall, Boston, MA"
        });
        marker.setMap(map);

        // This is a global info window...
        var infowindow = new google.maps.InfoWindow();

        // Open info window on click of marker
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(marker.title);
          infowindow.open(map, marker);
        });
      }
*/
  var map;
  var marker;
  var xhr;
  var myLat = 42.3599611;     //  Latitude of Boston
  var myLng = -71.0567528;    //  Longitude of Boston
  var me = new google.maps.LatLng(myLat, myLng);
  var myOptions = {
        zoom: 15, // The larger the zoom number, the bigger the zoom
        center: me,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

  var myLine;    
  var locations;
  var shortestDist = 99999;
  var shortestStat;
  var scheduleData;
  
  var Tstops;



function initialize() {

  xhr = new XMLHttpRequest();
  xhr.open("get", "http://mbtamap.herokuapp.com/mapper/rodeo.json", true);
  xhr.onreadystatechange = dataReady;
  xhr.send(null);    

  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  getMyLocation();
}

function dataReady() {
  if (xhr.readyState == 4 && xhr.status == 200) {
     scheduleData = JSON.parse(xhr.responseText);
  }
  else if (xhr.readyState == 4 && xhr.status == 500) {
    alert("Seems like I had trouble retrieving info... =/");
  }
}

function getMyLocation() {
   
  if (navigator.geolocation) {
      // the navigator.geolocation object is supported on your browser
      navigator.geolocation.getCurrentPosition(function(position) {
          myLat = position.coords.latitude;
          myLng = position.coords.longitude;
          renderMap();
      });
  }
  else {
      alert("Geolocation is not supported by your web browser =/");
  }
}

function renderMap() {
  me = new google.maps.LatLng(myLat, myLng);

  // Update map and go there...
  map.panTo(me);

  // Create a marker
  marker = new google.maps.Marker({
    position: me,
    title: "Here I Am! Let's do this!"
  });
  marker.setMap(map);
  
  parse();
}

function parse() {
  
  // Sorry for long line. If I try to have each station on a separate line, I get an error =/
  str='[{"Line":"blue","Station":"Wonderland","Lat":42.41342,"Lng":-70.991648},{"Line":"blue","Station":"Revere Beach","Lat":42.40784254,"Lng":-70.99253321}, {"Line":"blue","Station":"Beachmont","Lat":42.39754234,"Lng":-70.99231944},{"Line":"blue","Station":"SuffolkDowns","Lat":42.39050067,"Lng":-70.99712259},{"Line":"blue","Station":"Orient Heights","Lat":42.386867,"Lng":-71.00473599999999},{"Line":"blue","Station":"Wood Island","Lat":42.3796403,"Lng":-71.02286539000001},{"Line":"blue","Station":"Maverick","Lat":42.36911856,"Lng":-71.03952958000001},{"Line":"blue","Station":"Aquarium","Lat":42.359784,"Lng":-71.051652},{"Line":"blue","Station":"State Street","Lat":42.358978,"Lng":-71.057598},{"Line":"blue","Station":"Government Center","Lat":42.359705,"Lng":-71.05921499999999},{"Line":"blue","Station":"Bowdoin","Lat":42.361365,"Lng":-71.062037},{"Line":"orange","Station":"Oak Grove","Lat":42.43668,"Lng":-71.07109699999999},{"Line":"orange","Station":"Malden Center","Lat":42.426632,"Lng":-71.07411},{"Line":"orange","Station":"Wellington","Lat":42.40237,"Lng":-71.077082},{"Line":"orange","Station":"Sullivan","Lat":42.383975,"Lng":-71.076994},{"Line":"orange","Station":"Community College","Lat":42.373622,"Lng":-71.06953300000001},{"Line":"orange","Station":"North Station","Lat":42.365577,"Lng":-71.06129},{"Line":"orange","Station":"Haymarket","Lat":42.363021,"Lng":-71.05829},{"Line":"orange","Station":"State Street","Lat":42.358978,"Lng":-71.057598},{"Line":"orange","Station":"Downtown Crossing","Lat":42.355518,"Lng":-71.060225},{"Line":"orange","Station":"Chinatown","Lat":42.352547,"Lng":-71.062752},{"Line":"orange","Station":"Tufts Medical","Lat":42.349662,"Lng":-71.063917},{"Line":"orange","Station":"Back Bay","Lat":42.34735,"Lng":-71.075727},{"Line":"orange","Station":"Mass Ave","Lat":42.341512,"Lng":-71.083423},{"Line":"orange","Station":"Ruggles","Lat":42.336377,"Lng":-71.088961},{"Line":"orange","Station":"Roxbury Crossing","Lat":42.331397,"Lng":-71.095451},{"Line":"orange","Station":"Jackson Square","Lat":42.323132,"Lng":-71.099592},{"Line":"orange","Station":"Stony Brook","Lat":42.317062,"Lng":-71.104248},{"Line":"orange","Station":"Green Street","Lat":42.310525,"Lng":-71.10741400000001},{"Line":"orange","Station":"Forest Hills","Lat":42.300523,"Lng":-71.113686},{"Line":"red","Station":"Alewife","Lat":42.395428,"Lng":-71.142483},{"Line":"red","Station":"Davis","Lat":42.39674,"Lng":-71.121815},{"Line":"red","Station":"Porter Square","Lat":42.3884,"Lng":-71.119149},{"Line":"red","Station":"Harvard Square","Lat":42.373362,"Lng":-71.118956},{"Line":"red","Station":"Central Square","Lat":42.365486,"Lng":-71.103802},{"Line":"red","Station":"Kendall/MIT","Lat":42.36249079,"Lng":-71.08617653},{"Line":"red","Station":"Charles/MGH","Lat":42.361166,"Lng":-71.070628},{"Line":"red","Station":"Park Street","Lat":42.35639457,"Lng":-71.0624242},{"Line":"red","Station":"Downtown Crossing","Lat":42.355518,"Lng":-71.060225},{"Line":"red","Station":"South Station","Lat":42.352271,"Lng":-71.055242},{"Line":"red","Station":"Broadway","Lat":42.342622,"Lng":-71.056967},{"Line":"red","Station":"Andrew","Lat":42.330154,"Lng":-71.057655},{"Line":"red","Station":"JFK/UMass","Lat":42.320685,"Lng":-71.052391},{"Line":"red","Station":"Savin Hill","Lat":42.31129,"Lng":-71.053331},{"Line":"red","Station":"Fields Corner","Lat":42.300093,"Lng":-71.061667},{"Line":"red","Station":"Shawmut","Lat":42.29312583,"Lng":-71.06573796},{"Line":"red","Station":"Ashmont","Lat":42.284652,"Lng":-71.064489},{"Line":"red","Station":"North Quincy","Lat":42.275275,"Lng":-71.029583},{"Line":"red","Station":"Wollaston","Lat":42.2665139,"Lng":-71.0203369},{"Line":"red","Station":"Quincy Center","Lat":42.251809,"Lng":-71.005409},{"Line":"red","Station":"Quincy Adams","Lat":42.233391,"Lng":-71.007153},{"Line":"red","Station":"Braintree","Lat":42.2078543,"Lng":-71.0011385}]';

  Tstops = JSON.parse(str);

  function minDistance(value) {
    
    if(scheduleData["line"] == value.Line) {
    
      Number.prototype.toRad = function() {
        return this * Math.PI / 180;
      }

      var lat2 = value.Lat; 
      var lon2 = value.Lng; 
      var lat1 = myLat; 
      var lon1 = myLng; 

      var R = 6371; // km 
      //has a problem with the .toRad() method below.
      var x1 = lat2-lat1;
      var dLat = x1.toRad();  
      var x2 = lon2-lon1;
      var dLon = x2.toRad();  
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                      Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                      Math.sin(dLon/2) * Math.sin(dLon/2);  
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; 
      if(d < shortestDist) {
        shortestDist = d;
        shortestStat = value.Station;
      }
    }
      
  }

  Tstops.forEach(minDistance);

  drawLines();
}

function drawLines() {

  var linePathCoordinates = new Array();
  var linePath2RedCoordinates;
  var Tmarkers = new Array();
  var TinfoWindows = new Array();
  k = 0;
  

  if(scheduleData["line"] == 'blue') {
    color = '0000CC';
    img = {
      url: 'blue_img.png',
      size: new google.maps.Size(20, 32),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(0, 32)
    };
  } else if(scheduleData["line"] == 'orange') {
    color = 'FF850A';
    img = {
      url:'orange_img.png',
      size: new google.maps.Size(20, 32),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(0, 32)
    };
  } else if(scheduleData["line"] == 'red') {
    color = 'FF0A0A';
    img = {
      url:'red_img.png',
      size: new google.maps.Size(20, 32),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(0, 32)
    };
  } 

  for(i=0;i<(Tstops.length - 5);i++) {
    if(scheduleData["line"] == Tstops[i].Line) {
      linePathCoordinates[k] = new google.maps.LatLng(Tstops[i].Lat, Tstops[i].Lng); 
      k++;
      dot = new google.maps.LatLng(Tstops[i].Lat, Tstops[i].Lng);
      Tmarkers[k] = new google.maps.Marker({
          position: dot,
          title: Tstops[i].Station,
          icon: img
        });
      Tmarkers[k].setMap(map);

      google.maps.event.addListener(Tmarkers[k], 'click', function() {
      TinfoWindows[k] = new google.maps.InfoWindow();

      var messageT = '<h1>'+Tmarkers[k].title+'</h1>'+
              '<table border="1" style="width:400px">';

      for(i=0;i<scheduleData["schedule"].length;i++) {
        destination = scheduleData["schedule"][i];
        stops = destination["Predictions"];
        for(j=0;j<stops.length;j++){
         s = stops[j];
          if(s["Stop"] == Tmarkers[k].title) {
            var minutes = Math.floor(s["Seconds"]/60);
            var seconds = s["Seconds"] - (minutes * 60);
            messageT += '<tr>'+
                  '<td>'+destination["Destination"]+'</td>'+
                  '<td>'+minutes+'&#58'+seconds+'</td>'+'</tr>';
          }
        }
      }
      messageT += '</table>';
      TinfoWindows[k].setContent(messageT);
      //TinfoWindows[k].close(); // Close previous window
      TinfoWindows[k].open(map, Tmarkers[k]);
      });
    }
  }

  linePath2RedCoordinates = [
    new google.maps.LatLng(42.284652, -71.064489),
    new google.maps.LatLng(42.275275, -71.029583),
    new google.maps.LatLng(42.2665139, -71.0203369),
    new google.maps.LatLng(42.251809, -71.005409),
    new google.maps.LatLng(42.233391, -71.007153),
    new google.maps.LatLng(42.2078543, -71.0011385)
  ];

  var linePath = new google.maps.Polyline({
    path: linePathCoordinates,
    geodesic: true,
    strokeColor: color,
    strokeOpacity: 1.0,
    strokeWeight: 2
  }); 
 
  linePath.setMap(map);

  if(scheduleData["line"] == 'red') {
    var linePath2Red = new google.maps.Polyline({
      path: linePath2RedCoordinates,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 2
    }); 

    linePath2Red.setMap(map);
  }

  //Open info window on click of marker
  google.maps.event.addListener(marker, 'click', function() {
    var infowindow = new google.maps.InfoWindow();
    var message = 'You are here &#33; The closest station is &#58;'+'</br>'+
                  shortestStat+'&#58; ' + Math.round((shortestDist/1.609)*100)/100 + 
                  ' miles away from your current location';
    infowindow.setContent(message);
    //infowindow.close(); // Close previous window
    infowindow.open(map, marker);
  });
}

/*
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

     
