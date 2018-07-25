require("dotenv").config();
//SPECIFY THE NODE MODULES REQUIRED FOR OUR FUNCTIONS
// TO MAKE LIRI WORK
// require the keys for our API calls to hbe present as a variable
var myKeys = require("./keys.js");

// will be used in querying twitter & spotify
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// will be used for OMDB call
var request = require("request");

// used for "do what it says" call to random.txt
var fs = require("fs");

// FOR COMMAND LINE ARGUMENTS...
var userEntry = process.argv;
var liriCommand = userEntry[2];

var liriArg = '';
for (var i = 3; i < userEntry.length; i++) {
	liriArg += userEntry[i] + ' ';
} // ... think this through


// Got this working!
// Function to retrieve tweets from the specified handle and print them into the console
function retrieveTweets(){

    var client = new Twitter(myKeys.twitter);
    var params = {screen_name: '@The_Axelander', count: 20};

    client.get('statuses/user_timeline', params, function(err, tweets, response) {
        // console.log(tweets[0].status); // works! 
        if (err) {
            console.log("Hmm... can't get those tweets because... " + err)
        }

        else {
            for (var i = 0; i < tweets.length; i++) {
                var tweetText = tweets[i].text;
                var tweetCreationDate = tweets[i].created_at;

                    console.log("Tweet Text: " + tweetText);
                    console.log("Tweet Creation Date: " + tweetCreationDate);
                    console.log("<vvv===----===vvv>");
            }
        }
    })
};


// Got this working!
// function to return basic song info
function retrieveSong(song) {
    var song = userEntry[3]; // This has to be commented out in order for do-what-it-says to work... hmmmmmmmm probably a simple fix, but stuck.

    search = song

    var spotify = new Spotify(myKeys.spotify);

    spotify.search({type: 'track', query: song}, function(err, data) {
        if (err) {
            console.log("Looks like an error... try a different SONG? || " + err)
        }

        else {
            //tried to simplify data reference, but kinda failed... 
            // rewrite this to    
            // songInfo= data.tracks.items ... and shorten subsequent code lines
            var songInfo = data;
    
            // Prints the artist(s), track name, preview url, and album name.
            console.log("Artist(s): " + songInfo.tracks.items[0].album.artists[0].name); 
            console.log("Song: " + songInfo.tracks.items[0].name)
            console.log("Spotify Preview @: " + songInfo.tracks.items[0].preview_url)
            console.log("Album: " + songInfo.tracks.items[0].album.name);
	    }
    });
}

function retrieveOMDB(movieName) {

    var movieName = userEntry[3]; 
    var searchQuery = movieName.split(" ").join("+");
    var movieKey = '60fc001c';
    
    var queryURL = 'http://www.omdbapi.com/?t=' + movieName + '&plot=full&apikey=' + movieKey;

    request(queryURL, function(err, response, body) {

        var movieObj = JSON.parse(body);
    
        if (err) {
            console.log("Your movie search is broken... " + err);
        }
        else {

            var movieSummary =
            "=============----------=============" + "\r\n" +
            "Title: " + movieObj.Title + "\r\n" +
            "Year: " + movieObj.Year + "\r\n" +
            "IMDB Rating: " + movieObj.imdbRating + "\r\n" +
            "Country: " + movieObj.Country + "\r\n" +
            "Language: " + movieObj.Language + "\r\n" +
            "Plot summary: " + movieObj.Plot + "\r\n" +
            "Actors: " + movieObj.Actors + "\r\n" +
            "======------------------------======";

            console.log(movieSummary);
        }
    })
};


// ***ISSUE with doWhatItSays() ***
// This section successfully reads the file, splits the interior code into the "command" and "argument" variables, and recognizes which is present
// BUT because of the way it's structured, it doesn't recognize the query parameters (including song name (argument variable)) to run successfully

// So the manual command of 'spotify-this-song' triggers the function correctly, but the contents of random.txt don't quite get there when do-what-it-says is the command
// --- will try to debug in the coming days --

function doWhatItSays () {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            console.log("Ran into an error trying to use random.txt! -- " + err)
        }
        else {
            console.log("raw data: " + data)
            var randomArray = data.split(",");
            
            var command = randomArray[0].trim();
            var argument = randomArray[1].trim();

            switch(command) {
                case 'my-tweets':
                retrieveTweets();
                break;
            
                case 'spotify-this-song':
                retrieveSong(argument);
                break;

                case 'movie-this':
                retrieveOMDB(argument);
                break;
            }
        }
    })
}


// CONDITIONS THAT SPECIFY WHICH COMMAND 
// LINE PROMPTS WILL TRIGGER EACH FUNCTION
// TO DISPLAY DIFFERENT INFORMATION BACK TO THE USER

if (liriCommand === "my-tweets") {
    retrieveTweets();
}

else if (liriCommand === "spotify-this-song") {
    retrieveSong();
}

else if (liriCommand === "movie-this") {
    retrieveOMDB();
}

else if (liriCommand ==="do-what-it-says") {
    doWhatItSays();
}