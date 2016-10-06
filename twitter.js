const twit = require('twitter');
var secrets = require('./json/secret.json');
var emojiList = require('./json/codeEmoji.json');
var faker = require('./faker.js');
twitter = new twit(secrets[0]);
var tweetUpdate ={};
var tweets = [];
var tweetCount = 15;
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
        var codeTweets = {}
        var text = tweet.text;
        text = text.match(new RegExp(ranges.join('|'), 'g'));
        if(text) { // if there's an emoji found
          if(tweet.place.country){ //if there is country location data(still crashes)
            tweets.push(
              {
                text: text,
                coordinates: coordinates,
                date: date,
                type: tweet.coordinates.type,
                place: tweet.place.name,
                country_code: tweet.place.country_code,
                country: tweet.place.country
              }
            );
            var mood = 0; // total mood for the tweet
            // surrogate pairs: (output like this)
            // multiple emojis: [ '\\uD83D\\uDE04', '\\uD83D\\uDC96', '\\uD83D\\uDE3B' ]
            // only one emoji: [ '\\uD83D\\uDE02' ]
            // these surrogate pairs should match the surrogate pairs in the emoji.json
            // (if the specific emoji is there)
            var surrogate = text.map((emoji) => {
              return '\\u' + emoji.charCodeAt(0).toString(16).toUpperCase() + '\\u' + emoji.charCodeAt(1).toString(16).toUpperCase();
            });
            // printing surrogate pairs
            surrogate.forEach((surrogate) => { // goes through each emote to check our emojilist
              if(emojiList[surrogate]){ // if there is a match with our emojilist
                if(codeTweets[emojiList[surrogate].name]){ // If there already is a key with the name of the emoji
                  codeTweets[emojiList[surrogate].name] =  codeTweets[emojiList[surrogate].name] + 1;
                }
                else{ // IF there is no key with the emoji name
                  mood += 1;
                  codeTweets[emojiList[surrogate].name] = 1;
                }
              }
              var surrogatePair = surrogate.split('\\u').slice(1);
              var code = '0x';
              // console.log(String.fromCharCode(code+surrogatePair[0], code+surrogatePair[1]));
            });
            if(Object.keys(codeTweets).length!== 0){ // If there is at least 1 emoji from our list
              if(tweetUpdate[tweet.place.country]){ // If there is already a country key in the object
                for(var pairs in codeTweets){ // goes though the recent tweet and it to the total countries.
                  var updateCountry = tweetUpdate[tweet.place.country];
                  if(updateCountry[pairs]) // Update each value to add to the emoji count
                    updateCountry[pairs] += codeTweets[pairs];
                  else{ // IF theres a new emoji, set it to 1
                    updateCountry[pairs] = 1;
                  }
                }
                tweetUpdate[tweet.place.country].mood += mood; // combines the mood scores of both
              }
              else{ // If there is no country key in the object
                // sets the country twitter and mood to the new tweet
                tweetUpdate[tweet.place.country] = codeTweets;
                tweetUpdate[tweet.place.country].mood = mood;
              }
              tweetCount --; // Decreases the tweeter count before sending to server.
              if(tweetCount === 0){ //sends the tweet data and resets the count
                tweetCount = 15;
                console.log(tweetUpdate);
                tweetUpdate = {};
              }
            }
          }
        }
      }
    }
  });

  stream.on('error', function (error) {
    setTimeout(faker, 1000);
  });
});

module.exports = tweets;