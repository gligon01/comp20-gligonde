


function pasuser(user, PW) {
	verifyID(User,PW);
	if (form.id.value=="JavaScript") { 
		if (form.pass.value=="Kit") {              
			location="page2.html" 
		} else {
			alert("Invalid Password")
		}
	} else {  
		alert("Invalid UserID")
	}	
}

//METHOD 1: get the info and send it back and the calling function will verify
function getuserData(User) {
	app.get('/users.json', function (req, res){
	 	res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Headers", "X-Requested-With");
	    mongo.Db.connect(mongoUri, function (err, db){
	    	db.collection("users", function (er, col){
	        	var username = req.query.username;	        	
	        	var d = col.find({"username":user}).toArray(function(err,userData){
	        		res.send(userData);
	      		});
	    	});
	  	});
	});
}

//METHOD 2: Verify here and return either a 0 or 1 as verification
function verifyID(User,PW) {
	app.get('/users.json', function (req, res){
	 	res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Headers", "X-Requested-With");
	    mongo.Db.connect(mongoUri, function (err, db){
	    	db.collection("users", function (er, col){
	        	var username = req.query.username;	        	
	        	var d = col.find({"username":user}).toArray(function(err,userData){
	        		res.send(userData);
	      		});
	    	});
	  	});
	});
}