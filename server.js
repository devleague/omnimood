const express = require('express');
const app = express();

app.get('/', (req,res) =>{
  res.json('hello');
});

const server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('listening on',host, port);
});