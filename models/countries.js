const mongoose = require('mongoose');
const country = mongoose.model(
  "Country",
  {
    countryId:{
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    code:{
      type: String
    },
    GPS:{
      type: String
    },
    emoji: {
      type: Object
    },
    // emojiList: {
    //   [
    //     type: String,
    //     type: String
    //   ]
    // }
  }
);

module.exports = country;