var path = require('path');
var express = require('express');

module.exports = function(app){

    // all environments
    app.configure(function(){
        app.set('port', process.env.PORT || '3000'); // set app's port number
        app.set('views', path.join(__dirname, '../views')); // set up the path where jade views are stored
        app.set('view engine', 'ejs'); // set the view engine as ejs
        app.set('databaseUri', 'mongodb://testkgroat.cloudapp.net/ugenity');
        app.set('debug', '');
        app.use(express.favicon(path.join(__dirname, '../public/images/favicon.ico')));
        app.use(express.logger('dev')); // set up the logger to point to the log 'dev'
        app.use(express.json()); // tell express to use json serialization to and from the client
        app.use(express.urlencoded()); // tell the client to encode urls for the sake of security
        app.use(express.cookieParser('your secret here')); // set up capability to use cookies
        app.use(express.session({ secret: 'Ugenitoms will get you' })); // set up capability to use session variables
        app.use(app.router); // tell the app that we will need the routing capabilities
        app.use(require('less-middleware')(path.join(__dirname, '../public'))); // configure LESS-middleware to parse static stylesheets
        app.use(express.static(path.join(__dirname, '../public'))); // set up all static content (images, stylesheets, etc.)
    })

    // development environment
    app.configure('development', function(){
        app.set('debug', 'development');
        app.use(express.errorHandler());
    })
}