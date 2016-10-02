const mongoose = require('mongoose');
const emoji = mongoose.model(
  "Emoji",
  {
    emojiId:{
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    code: {
      type: String
    }
  }
);

module.exports = emoji;
