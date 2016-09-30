const twit = require('twitter');
var secrets = require('./secret.json');
twitter = new twit(secrets[0]);

var util = require('util');
var tweets = [];

twitter.stream('statuses/filter', {'locations':'-180,-90,180,90'}, function (stream) {
  stream.on('data', function (tweet) {
    console.log(tweet.coordinates);
  });

  stream.on('error', function (error) {
    throw error;
  });
});