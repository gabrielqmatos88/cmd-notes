var express = require('express');
var open = require('open');
var app = express();

app.use('/',express.static(__dirname + '/dist'));

app.listen(3000, function(){
  console.log('the xmo-har tool is hosted on "http://localhost:3000"');
  open('http://localhost:3000');
});
