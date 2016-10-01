const twit = require('twitter');
var secrets = require('./secret.json');
twitter = new twit(secrets[0]);

var util = require('util');
var tweets = [];

twitter.stream('statuses/filter', {'locations':'-180,-90,180,90'}, function (stream) {
  stream.on('data', function (tweet) {
    if(tweet.coordinates) { // if the tweet has coordinates
      if(tweet.coordinates !== null) { // if the coordinates are not null
        var coordinates = {lat: tweet.coordinates.coordinates[1], long: tweet.coordinates.coordinates[0]};
        var date = new Date(parseInt(tweet.timestamp_ms)).toLocaleString();
        var ranges = [
          '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
          '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
          '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
        ]; // emoji ranges
        var text = tweet.text;
        text = text.match(new RegExp(ranges.join('|'), 'g'));
        if(text) { // if there's an emoji found
          console.log(text);
          var unicode = text.map((emoji) => {
            return '\\u' + emoji.charCodeAt(0).toString(16) + '\\u' + emoji.charCodeAt(1).toString(16);
          });
          console.log(unicode);
        }
        // console.log('Hello ' + String.fromCharCode(0xd83d, 0xde04)); //this is how to print an emoji based on the unicode
        console.log(coordinates);
        console.log(date);

      }
    }
  });

  stream.on('error', function (error) {
    throw error;
  });
});