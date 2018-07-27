var dotenv = require("dotenv").config();
var keys = require("./keys");
var Twitter = require('twitter');
var request = require('request');
var fs = require("fs");
var Spotify = require('node-spotify-api');

var command = process.argv[2];

var get20Tweets = function () {
    var client = new Twitter(keys.twitter);
    client.get('statuses/user_timeline', { screen_name: 'LiriBotProject1', count: 20 }, function (error, tweets, response) {
        fs.appendFile("log.txt", "my-tweets command:\r", function (err) {
            if (err) {
                return console.log(err);
            }
        });
        for (x in tweets) {
            console.log(tweets[x].text);
            fs.appendFile("log.txt", tweets[x].text + "\r", function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    });
}


var spotifyThis = function (query) {
    var spotify = new Spotify(keys.spotify);

    if (query === "undefined") {
        query = "Welcome To The Jungle";
    }

    spotify.search({ type: 'track', query: query }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var song = data.tracks.items[0];

        stringSong = "\r\nspotify-this-song\r\nArtist: " + song.album.artists[0].name + "\r\nSong Name: " + song.name + "\r\nPreview URL: " + song.preview_url + "\r\nAlbum: " + song.album.name
        console.log(stringSong);

        fs.appendFile("log.txt", stringSong, function (err) {
            if (err) {
                return console.log(err);
            }
        });

    });

}

var movieThis = function (query) {
    if (query === "undefined") {
        query = "Mr Nobody";
    }
    request("http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        if (!error && response.statusCode === 200) {

            data = JSON.parse(body);
            stringMovie = "\r\nmovie-this\r\nTitle: " + data.Title + "\r\nYear: " + data.Year + "\r\nIMDB Rating: " + data.Ratings[0].Value + "\r\nRotten Tomatoes Rating: " + data.Ratings[1].Value + "\r\nProduced in: " + data.Country + "\r\nLanguage: " + data.Language + "\r\nPlot: " + data.Plot + "\r\nActors: " + data.Actors
            console.log(stringMovie);
            fs.appendFile("log.txt", stringMovie, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    });
}

var doWhat = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        var dataArr = data.split(",");
        console.log(dataArr);

    });
}

if (process.argv.length > 3) {
    var query = process.argv.slice(3).join(" ");
} else {
    query = "undefined"
}
if (command === "my-tweets") {
    get20Tweets();
} else if (command === "spotify-this-song") {
    spotifyThis(query);
} else if (command === "movie-this") {
    movieThis(query);
} else if (command === "do-what-it-says") {
    doWhat(query);
} else {
    console.log("Invalid command");
}