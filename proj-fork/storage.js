// Save data to the current session's store
sessionStorage.setItem("username", "John");

// Access some stored data
alert( "username = " + sessionStorage.getItem("username"));

function userChecker()
{
	var user = '';
	if(sessionStorage.setItem("username") == ''){
		return;
	} else 
	user = //GET request to heroku
	document.getElementById("car") = /*stuff*/
	document.getElementById("public") = /*stuff*/
	document.getElementById("taxi") = /*stuff*/
	document.getElementById("header") = "Welcome " +
	sessionStorage.getItem("username");
}	

function logout()
{
	sessionStorage.setItem("username". '');
}
