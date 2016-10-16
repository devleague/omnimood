const mongoose = require('mongoose');
const timeline = mongoose.model(
  "Timeline",
  {
    countries:{
      type: Object,
      required: true
    },
    times:{
      type:[String]
    },
    totalCount:{
      type:Object
    },
    topEmojis:{
      type: Object
    }
  }
);

module.exports = timeline;