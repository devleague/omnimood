const twit = require('twitter');
var secrets = require('./json/secret.json');
var emojiList = require('./json/codeEmoji.json');
const mongoose = require('mongoose');
const Country = require('./models/countries');
const emojiValues = require('./json/emoji.json');
twitter = new twit(secrets[0]);
var tweetUpdate ={};
var tweets = [];
var tweetCount = 15;
module.exports = {};
var twitterStream;

twitter.stream('statuses/filter', {'locations':'-180,-90,180,90'}, function (stream) {
  twitterStream = stream;
});

function listenForTweets(socket) {
  socket.on('start tweets', () => {
    twitterStream.on(('data'), function (tweet) {
      if(tweet.coordinates) { // if the tweet has coordinates
        if(tweet.coordinates !== null) { // if the coordinates are not null
          var coordinates = {lat: tweet.coordinates.coordinates[1], long: tweet.coordinates.coordinates[0]};
          var date = new Date(parseInt(tweet.timestamp_ms)).toLocaleString();
          var codeTweets = {};
          var emojis = getEmoji(tweet);
          if(emojis) { // if there's an emoji found
            if(tweet.place && tweet.place.country){
              socket.emit('tweet', emojis);
              parseTweet(tweets, emojis, coordinates, date, tweet, codeTweets, emojiList, tweetUpdate);
            }
          }
        }
      }
    });

    twitterStream.on('error', function (error) {
      throw error;
    });
  });

}

function getEmoji(tweet) {
  var ranges = [
    '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
    '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
    '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
  ]; // emoji ranges
  var text = tweet.text;
  var emojis = text.match(new RegExp(ranges.join('|'), 'g'));
  return emojis;
}

function parseTweet(tweetArr, emojis, coordinates, date, tweet, codeTweets, emojiList, tweetUpdate) {
  tweetArr.push(
    {
      emojis: emojis,
      coordinates: coordinates,
      date: date,
      type: tweet.coordinates.type,
      place: tweet.place.name,
      country_code: tweet.place.country_code,
      country: tweet.place.country
    }
  );
  var amount = 0;
  var negativeEmojis = 0;
  var neutralEmojis = 0;
  var positiveEmojis = 0;
  // surrogate pairs: (output like this)
  // multiple emojis: [ '\\uD83D\\uDE04', '\\uD83D\\uDC96', '\\uD83D\\uDE3B' ]
  // only one emoji: [ '\\uD83D\\uDE02' ]
  // these surrogate pairs should match the surrogate pairs in the emoji.json
  // (if the specific emoji is there)
  var surrogate = emojis.map((emoji) => {
    return '\\u' + emoji.charCodeAt(0).toString(16).toUpperCase() + '\\u' + emoji.charCodeAt(1).toString(16).toUpperCase();
  });
  // printing surrogate pairs
  surrogate.forEach((surrogate) => {
    if(emojiList[surrogate]){
      var emojiName = codeTweets[emojiList[surrogate].name]
      if(emojiName){
        codeTweets[emojiList[surrogate].name] =  codeTweets[emojiList[surrogate].name] + 1;
      }
      else{
        amount += 1;
        codeTweets[emojiList[surrogate].name] = 1;
      }
      if(emojiList[surrogate].value === 1){
        positiveEmojis++;
      }
      else if(emojiList[surrogate].value === 0){
        neutralEmojis++;
      }
      else{
        negativeEmojis++;
      }
    }
    var surrogatePair = surrogate.split('\\u').slice(1);
    var code = '0x';
    // console.log(String.fromCharCode(code+surrogatePair[0], code+surrogatePair[1]));
  });
  if(Object.keys(codeTweets).length!== 0){
    if(tweetUpdate[tweet.place.country]){
      for(var pairs in codeTweets){
        var updateCountry = tweetUpdate[tweet.place.country];
        if(updateCountry[pairs])
          updateCountry[pairs] += codeTweets[pairs];
        else{
          updateCountry[pairs] = 1;
        }
      }
      tweetUpdate[tweet.place.country].amount += amount;
      tweetUpdate[tweet.place.country].negativeEmojis += negativeEmojis;
      tweetUpdate[tweet.place.country].positiveEmojis += positiveEmojis;
      tweetUpdate[tweet.place.country].neutralEmojis += neutralEmojis;
    }
    else{
      tweetUpdate[tweet.place.country] = codeTweets;
      tweetUpdate[tweet.place.country].amount = amount;
      tweetUpdate[tweet.place.country].negativeEmojis = negativeEmojis;
      tweetUpdate[tweet.place.country].positiveEmojis = positiveEmojis;
      tweetUpdate[tweet.place.country].neutralEmojis = neutralEmojis;
    }
    tweetCount -= 1;
    if(tweetCount === 0){
      tweetCount = 15;
      livingDatabase(tweetUpdate);
      tweetUpdate = {};
    }
  }
}

function calculateMood (countryEmojis) {
  var total = countryEmojis.positiveEmojis + countryEmojis.negativeEmojis + countryEmojis.neutralEmojis;
  var sum = countryEmojis.positiveEmojis - countryEmojis.negativeEmojis;
  var moodValue = sum / total;
  return moodValue;
}

function livingDatabase(tweetUpdate){
  for(var countries in tweetUpdate){
    Country.findOne({name: countries})
    .then(function(country) {
      if(country)
        var emojiData = country.emoji;
        var countryData = tweetUpdate[country.name];
        for(var emojis in countryData){
          emojiData[emojis] += countryData[emojis];
        }
      country.mood = calculateMood(emojiData);
      country.emoji = emojiData;
      country.markModified('emoji');
      country.save();
    });
  }
  console.log("Database Updated");
}

module.exports.listenForTweets = listenForTweets;