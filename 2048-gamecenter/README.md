2048 - Gamecenter
=================

1. 	Aspects that were correctly implemented:
	- A POST /submit.json API that submits a terminated 2048 game along 
	  with the username, score, and final grid.
	- A GET /scores.json API that returns a json string for a specified player. 
      If the user is not in the database, an empty string is returned.
	- The index page lists all of the 2048 scores for all players sorted in descending order.
	Aspects not correctly implemented:
	- None that I can think of

2. Individuals I collaborated with or discussed the assignment:
	Nana Kwasi
	Emma Emma Posamentier
	*Insert other names that I currently can't think of*

3.	Number of hours spent on assignment:
	Approximately 20

4.	How the score and grid are stored in 2048 game:
	In the 2048 game, there is a js directory with the object of interest, 
	which is 'GameManager.prototype' in game_manager.js.
	The grid is initialized and its methods are in the Grid.js file.
	The actual grid object is: GameManager.prototype.grid
	The score object is: GameManager.prototype.score

5. 	Modifications that had to be made in order to send final score:
	- In index.html, the script tag:
	 <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
	was added to enable jQuery.
	- In game_manager.js, in the method 'GameManager.prototype.actuate = function ()':
	right before it clears the gamestate a post request was made:

	var posting = $.post('http://powerful-cliffs-8607.herokuapp.com/submit.json', { username: "Kevin", 
                  score: post_score, 
                  grid: JSON.stringify(post_grid)});

    the post has a link to the heroku web app; the username was hard-coded.
