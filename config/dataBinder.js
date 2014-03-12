var mongoose = require('mongoose');
var fs = require('fs');
var models = require('../models');

module.exports = function(app) {
    var endpoint = app.get('databaseUri') || 'mongodb://testkgroat.cloudapp.net/ugenity';

    // MongoDB connection handler
    var connect = function () {
        var connectionOptions = { server: { socketOptions: { keepAlive: 1 } } };
        mongoose.connect(endpoint, connectionOptions);
    };

    // MongoDB error handler
    mongoose.connection.on('error', function (err) {
        console.log(err);
    });

    // reconnect to MongoDB whenever closed
    mongoose.connection.on('disconnected', function () {
        connect();
    });

    connect();
}