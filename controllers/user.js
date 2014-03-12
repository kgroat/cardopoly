var mongoose = require('mongoose')
var User = mongoose.model('User');
var http = require('http');

var getAllUsers = function(req, cb){
    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
    var perPage = 30
    var options = {
        perPage: perPage,
        page: page
    }

    User.list(options, function(err, users) {
        if (err) { return cb(err); }
        cb(null, users);
    })
}

module.exports = {
    get: function(req, cb){

    },
    getAll: function(req, res){
        getAllUsers(req, function(err, users) {
            if (err) { return res.render('500'); }
            res.send(users);
        })
    },
    listAll: function(req, res){
        getAllUsers(req, function(err, users) {
            if (err) { return res.render('500'); }
            res.render('usersList', { users: users });
        })
    },
    post: function(req, res){
        User.create()
    }
}
