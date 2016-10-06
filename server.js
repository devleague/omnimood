const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost/omnimood';
const connection = mongoose.connect(MONGO_URL);
const Country = require('./models/countries');
const secrets = require('./json/secret.json');
const mood = require('./public/js/mood.js');
var tweets = require('./twitter.js');

app.use(express.static(__dirname + '/public'));

app.get('/', (req,res) =>{
  res.json(index);
});

app.get('/countries/api', (req, res) => {
  Country
  .find({})
  .then(results => res.json(results));
});

app.get('/api/tweets', (req, res) => {
  res.json(tweets);
});

mongoose.connection.once('open', function() {
  const server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Listening on port ' + port);
  });
});
