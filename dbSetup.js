const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost/omnimood';
const connection = mongoose.connect(MONGO_URL);
const data = require('./countryList.json');
const country = require('./models/countries');
const emoji = require('./models/emoji');
mongoose.connection.once('open', function() {
  data.forEach(function(element, index, array) {
    const newCountry = new country({
      countryId: index,
      name: element.name,
      code: element.code,
      GPS: '0,0',
      Mood: 'Happy',
      Emoji: 'Nothing'
    });
    newCountry.save();
  });
  console.log('finished inserting');
});