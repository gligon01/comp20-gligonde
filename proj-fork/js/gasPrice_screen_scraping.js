
// screenscraper
// gets US average gas price
	var request = require("request");
	var cheerio = require("cheerio");
	 
	request('http://www.eia.gov/petroleum/gasdiesel/', function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	    var $ = cheerio.load(html);
	    $('.simpletable').find('td').each(function(i, element){
	      if (i == 16){
		      if(element){
		     	 avgPrice = this.children[0].data;
		  	  }
	  	  }
	    });
	  }
	});

