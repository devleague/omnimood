var emojiList = require('./json/emoji.json');

var emojis = function displayEmojis () {
  console.log(emojiList["Face with tears of Joy"].code);
  for(var emoji in emojiList) {
    var obj = emojiList[emoji];
    console.log(obj.code);
  }
}();