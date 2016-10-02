const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost/omnimood';
const connection = mongoose.connect(MONGO_URL);
const data = require('./json/countryList.json');
const country = require('./models/countries');
const emoji = require('./json/emoji');

var list = {}
for(var face in emoji){
  var inFace = emoji[face];
  var nameFace = inFace.name
  list[nameFace] = 0;
}

mongoose.connection.once('open', function() {
  data.forEach(function(element, index, array) {
    const newCountry = new country({
      countryId: index,
      name: element.name,
      code: element.code,
      GPS: '0,0',
      mood: 'Happy',
      emoji: list
    });
    newCountry.save();
  });
  console.log('finished inserting');
});