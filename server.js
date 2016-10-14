const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost/omnimood';
const connection = mongoose.connect(MONGO_URL);
const Country = require('./models/countries');
const Timeline = require('./models/timeline');
const secrets = require('./json/secret.json');
const mood = require('./public/js/mood.js');
const codeEmojiObject = require('./json/codeEmoji.json');
const path = require('path');
var tweets = require('./twitter.js');

// Setup web server and socket
const http = require('http');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.json(index);
});

app.get('/graphs', (req, res)=>{
  res.sendFile(path.join(__dirname+'/public/graphs.html'));
});

app.get('/countries/api', (req, res) => {
  Country
    .find({})
    .then(results => res.json(results));
});

app.get('/api/tweets', (req, res) => {
  res.json(tweets.tweets);
});

var test = 0;
app.get('/api/timeline', (req, res) =>{
  Timeline.findOne({}).then((data)=>{
    res.json(data);
  });
});

mongoose.connection.once('open', () => {
  const server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Listening on port ' + port);
  });
  const io = require('socket.io').listen(server);

  io.on('connection', (socket) => {
    console.log('Client connected!');
    socket.on('start tweets', () => {
      tweets.stream.on(('data'), function(tweet) {
        if (tweet.coordinates && (tweet.place != null) && (tweet.place.country_code != null) && (tweet.text != null)) { // if the tweet has coordinates
          if (tweet.coordinates !== null) { // if the coordinates are not null
            var coordinates = {
              lat: tweet.coordinates.coordinates[1],
              long: tweet.coordinates.coordinates[0]
            };
            //  var date = new Date(parseInt(tweet.timestamp_ms)).toLocaleString();
            var codeTweets = {};
            var emojis = getEmoji(tweet);

            var emoji;
            if (emojis != null) { // if there's an emoji found
              if (tweet.place.country) {

                var surrogate = emojis.map(function(emoji) {
                  return '\\u' + emoji.charCodeAt(0).toString(16).toUpperCase() + '\\u' + emoji.charCodeAt(1).toString(16).toUpperCase();
                });

                console.log(emojis);
                getMoodValue(surrogate);

                var codeTweets2 = {
                  "emoji": emojis,
                  "coord": coordinates,
                  "cc": tweet.place.country_code,
                  "emoji_codes": surrogate,
                  "text": tweet.text,
                  "value": getMoodValue(surrogate)
                };

                if (test == 0) {
                  socket.emit('tweet', tweet);
                } else {
                  socket.emit('tweet', codeTweets2);
                }

                test++;
              }
            }
          }
        }
      });
    });
    tweets.listenForTweets(socket);

    socket.on('disconnect', function () {
      console.log('Client disconnected.');
    });
  });
});


function getEmoji(tweet) {
  var ranges = [
    '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
    '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
    '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
  ]; // emoji ranges
  var text = tweet.text;
  var emojis = text.match(new RegExp(ranges.join('|'), 'g'));
  return emojis;
}

function getMoodValue(emojiList) {
  var total = 0;
  var returnTotal = 0;

  console.log('********** IN List ************');
  console.log(emojiList);
  emojiList.forEach(function(currentEmoji) {
    if (codeEmojiObject[currentEmoji]) {

      console.log(codeEmojiObject[currentEmoji].value);
      total += codeEmojiObject[currentEmoji].value;
    }
  })

  returnTotal = (total / emojiList.length) * 10;
  console.log("Total=" + total);
  console.log("returnTotal=" + returnTotal);
  return returnTotal;
}