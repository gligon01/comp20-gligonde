Assignment 3: MBTA Map and Schedule Rodeo
=========================================

1 - Program Performance

A) Aspects that have been correctly implemented
-Google Map of given MBTA subway line renders successfully
-A custom icon (which is simply a small section of a png file) was used to 
to mark stations on the Red, Orange, and Blue lines
-A colored polyline (based on subway line) connects all of the stations of 
associated with the color of the polyline
-User location successfully retrieved via JavaScript navigator.geolocation object
-User location is displayed on the map with marker and info window
-Furthermore, the distance between the user and the nearest subway station
(in miles) is shown in the info window of the user's current location marker
-Upon clicking  on a station icon on the map, an info window pops up giving
the name of the station, and a table containing subway arrival schedule, 
destination direction, for each station on the line.
-In the event that the MBTA schedule cannot be processed (500 status), an
alert window pops up informing the user that data could not be retrieved
and that the service is unavailable

B) (Possible) Aspects that have not been correctly implemented
-By inspecting the parse() function of the mapping.js file, the data from the
MBTA schedule will only be processed in the event that the data was retrieved
successfully, hence the condition "if(xhr.status == 200)"; however on some rare
instances the program would bypass that condition and an error would be reported.
Since the last time the code was changed to further avoid this event from 
occuring, the error has not resurfaced (but it happened rarely so there's no
guarantee that the changes serve their purpose).
-None

2 - Individuals with whom I have discussed the assignment:
	Nana Kwakwa, Seye Bankole, Obaid Farooqui 

3 - Total number of hours spent on assignment:
	A little over 30 (approximately)


