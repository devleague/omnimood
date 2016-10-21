console.log("Do you understand?");

const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost/omnimood';
const connection = mongoose.connect(MONGO_URL);
const Timeline = require('./models/timeline');
const Country = require('./models/countries');
const fs = require('fs');
const emojiList = require('./json/emoji.json');
const Promise = require('bluebird');
var dataArray = {}
const path = require('path');
mongoose.connection.once('open', () => {
  Country.find({}).then((countryData)=>{
    Timeline.findOne({}).then((timeData)=>{
      var emojiObject = timeData.topEmojis;
      for(var emojiName in emojiList){
        var emojiCount = 0;
        var sendName = '';
        countryData.forEach((element, index, array)=>{
          if(element.emoji[emojiName] > emojiCount && element.name !== "Indonesia"){
            emojiCount = element.emoji[emojiName];
            sendName = element.name;
          }
        });
        emojiObject[emojiName] = sendName;
      }
      timeData.topEmojis = emojiObject;
      timeData.markModified('topEmojis');
      Promise.all([timeData.save()]).then(()=>{
        console.log("I Refuse");
        mongoose.connection.close();
      });
    });
  });
});