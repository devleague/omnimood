var emojiList = require('./json/emoji.json');

var emojis = function displayEmojis () {
  console.log(emojiList);
  for(var emoji in emojiList) {
    console.log(Object.keys(emoji));
  }
}();