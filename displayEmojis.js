var emojiList = require('./json/emoji.json');

var emojis = function displayEmojis () {
  for(var emoji in emojiList) {
    console.log(Object.keys(emoji));
  }
}();