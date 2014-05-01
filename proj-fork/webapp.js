/**
 * Module dependencies.
 */
var express = require('express');
//var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongo = require('mongodb');
var app = express();
var crypto = require('crypto');

var request = require('request');  // for screen scraping
var cheerio = require('cheerio');  // for screen scraping

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/local';

var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
  db = databaseConnection
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');


app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
//app.use(express.static(path.join(__dirname, 'comp20-s2014-team10')));

app.use('/static', express.static(__dirname + '/public'));

/*app.use("/styles",  express.static(__dirname + '/stylesheets'));
app.use("/scripts", express.static(__dirname + '/javascripts'));
app.use("/images",  express.static(__dirname + '/images'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
} */


//Cross Origin Resource Sharing
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });


//THIS SHOULD RETRIEVE OUR FRONT PAGE
app.get('/', function (req, res){

    res.redirect('http://tuftsdev.github.io/comp20-gligonde/proj-fork/main.html');
    //res.sendfile('' + './public/index.html');

   //res.send("yay!");
});

app.post('/new_account', function (req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

      if (req.body.password === req.body.repassword) {

        db.collection('mingoes', function(err, collection) {
          var name = req.body.name; 
      var username = req.body.username;
      var email = req.body.email;
      var password = req.body.password;
      var repassword = req.body.repassword; 
      var home_address = req.body.address;
      
         var hash = crypto.createHash('md5').update(password).digest("hex");

          collection.insert({"name":name, "email": email, "username": username, "password": hash, "home_address": home_address, "total":0}, function (err, r){});
         res.redirect('http://tuftsdev.github.io/comp20-gligonde/proj-fork/main.html');
      }); 
    }
     
    else {
      res.redirect('http://tuftsdev.github.io/comp20-gligonde/proj-fork/account.html');
    }

    //db.mingoes.insert({"username":"bushra", "password":"yay", "trips":[{"origin":"home", "dest":"school"},{"origin":"school", "dest":"store"}]});
});

app.post('/new_trip', function (req, res){
 
      var username = req.body.username;
      var origin = req.body.origin;
      var dest = req.body.dest;
      var cost = Number(req.body.cost);
      var mode = req.body.mode;

  db.collection('trips', function(err, collection) {
      if (username) {
        var created_at = Date.now();
        collection.insert({"username": username, "origin":origin, "dest":dest, "cost":cost, "mode":mode, "timestamp":created_at}, function (err, r){});
      }
  });

  db.collection('mingoes', function(err, collection) {
     
      collection.count({"username":username}, function (err, r){
          if(r > 0) {
            collection.update({"username":username},{$inc: {"total":cost}}, function (err, r){});
          }
      });
  });
});

app.get('/userexists.json', function (req, res){

    db.collection('mingoes', function(err, col){
    var name = req.query.username;

      col.count({"username":name}, function (err, r){
          if(r > 0) {
            res.send("{'exists':'true'}");
          }
          else {
            res.send("{'exists':'false'}");
          }
      });
  });
});

app.get('/userdata.json', function (req, res){

    db.collection('mingoes', function(err, col){
    var name = req.query.username;

      col.count({"username":name}, function (err, r){
          if(r > 0) {
            col.find({"username": name}).sort({"timestamp" : -1}).toArray(function(err,x){
              if (err) {
                res.send("Error");
              }
              else {
                res.send(x);
              }
              });
          }
          else {
            res.send("[]");
          }
    
      });
  });
});

app.get('/usertrips.json', function (req, res){

    db.collection('trips', function(err, col){
    var name = req.query.username;

    col.find({"username": name}).sort({"timestamp" : -1}).toArray(function(err,x){

        if (err) {
                res.send("Error");
              }
              else {
                res.send(x);
              }
    });
  });
});

app.get('/validlogin', function (req, res){

    db.collection('mingoes', function(err, col){
    var name = req.query.username;
    var password = req.query.password;
    var hash = crypto.createHash('md5').update(password).digest("hex");

      col.count({"username":name, "password":hash}, function (err, r){
          if(r == 1) {
            res.send('http://tuftsdev.github.io/comp20-gligonde/proj-fork/main.html');
          }
          else {
            res.redirect('http://tuftsdev.github.io/comp20-gligonde/proj-fork/signin.html');
          }
      });
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


 //db.mingoes.update({"username":"bushra"},{$push: {"trips":{"origin":"tufts", "dest":"harvard"}}});

