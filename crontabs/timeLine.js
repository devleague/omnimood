
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost/omnimood';
const connection = mongoose.connect(MONGO_URL);
const Country = require('../models/countries');
const Timeline = require('../models/timeline');
const fs = require('fs');
const Promise = require('bluebird');
var dataArray = {}
const path = require('path');
mongoose.connection.once('open', () => {
  Country.find({}).then((countryData)=>{
    Timeline.findOne({}).then((timeData)=>{
      var countryObject = timeData.countries;
      var timeArray = timeData.times;
      countryData.forEach((element, index, array)=>{
        if(countryObject[element.countryId].length > 9){
          countryObject[element.countryId].shift();
        }

        countryObject[element.countryId].push(element.mood);
      });
       if(timeArray.length> 9){
          timeArray.shift();
        }
      timeArray.push(new Date());
      timeData.countries = countryObject;
      timeData.times = timeArray;
      timeData.markModified('countries');
      timeData.markModified('times');
      Promise.all([timeData.save()]).then(()=>{
        mongoose.connection.close();
      });
    });
  });
});