const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost/omnimood';
const connection = mongoose.connect(MONGO_URL);
const data = require('./json/newCountryList.json');
const Country = require('./models/countries');
const Timeline = require('./models/timeline');
const emojiData = require('./json/emoji.json');
const bluebird = require('bluebird');
const emojiCode = require('./json/codeEmoji.json');
var sendData = [];
var countryName = {}
data.forEach((element)=>{
  countryName[element.codeNum] = [];
  sendData.push({name: element.name, code: element.code, codeNum: parseInt(element.codeNum)});
});
var list = {};
var emojiNames = {};
var totalCount = {};

for(var face in emojiData){

  var inFace = emojiData[face];
  var nameFace = inFace.name;
  list[nameFace] = 0;
  emojiNames[nameFace] = '';
  totalCount[nameFace] = {
    count: 0,
    percentage: 0
  };
}

totalCount.total = 0;
list.amount = 0;
list.negativeEmojis = 0;
list.neutralEmojis = 0;
list.positiveEmojis = 0;


var timeSave = new Timeline({
  countries: countryName,
  times: [],
  topEmojis: emojiNames,
  totalCount: totalCount
})

mongoose.connection.once('open', function() {
  Promise.all([
    Country.insertMany(sendData.map((element, index, array) =>{
      return {
        countryId: element.codeNum,
        name: element.name,
        code: element.code,
        GPS: '0,0',
        mood: 0,
        emoji: list
      }
    })),
    timeSave.save()
  ])
  .then(function() {
    mongoose.connection.close();
  });
});