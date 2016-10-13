const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost/omnimood';
const connection = mongoose.connect(MONGO_URL);
const Country = require('./models/countries');
const Timeline = require('./models/timeline');
const secrets = require('./json/secret.json');
const mood = require('./public/js/mood.js');
const path = require('path');
var tweets = require('./twitter.js');

// Setup web server and socket
const http = require('http');

app.use(express.static(__dirname + '/public'));

app.get('/', (req,res) =>{
  res.json(index);
});

app.get('/graphs', (req, res)=>{
  res.sendFile(path.join(__dirname+'/public/graphs.html'));
});

app.get('/countries/api', (req, res) => {
  Country
  .find({})
  .then(results => res.json(results));
});

app.get('/api/tweets', (req, res) => {
  res.json(tweets.tweets);
});

app.get('/api/timeline', (req, res) =>{
  Timeline.findOne({}).then((data)=>{
    res.json(data);
  });
});

mongoose.connection.once('open', () => {
  const server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Listening on port ' + port);
  });
  const io = require('socket.io').listen(server);

  io.on('connection', (socket) => {
    console.log('Client connected!');
    tweets.listenForTweets(socket);

    socket.on('disconnect', function () {
      console.log('Client disconnected.');
    });
  });
});
