
// get configuration object
var config = require('./config');

// module dependencies
var express = require('express');
var http = require('http');

// use express
var app = express();

config.configure(app);
config.dataBinder(app);
config.router.init(app);

// start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});