/*
 * Starting position of this folder module
 */

var fs = require('fs');

var files = fs.readdirSync(__dirname);
files.forEach(function (file) {
    var extension = file.indexOf('.js');
    if (~extension && file.indexOf('index.js')){
        var filenameWithoutExtension = file.substring(0, extension);
        exports[filenameWithoutExtension] = require(__dirname + '/' + file);
    }
});