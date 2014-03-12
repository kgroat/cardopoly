var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var bcrypt = require('bcryptjs');

var mongoose = require('mongoose');

exports = {
    init: function(app){
        var User = mongoose.model('User');

        passport.serializeUser(function(user, cb){
            cb(null, user._id);
        });

        passport.deserializeUser(function(id, cb){
            User.getByUsername(id, function(err, user){
                cb(null, user);
            })
        });

        passport.use(new LocalStrategy(
            function(username, password, cb){
                User.getByUsername(username, function(err, user, options){
                    if(err) { return cb(err); }

                    if(!user || !user.validatePassword(password)) {
                        if(options.message){
                            return cb(null, false, options);
                        }

                        return cb(null, false, { message: 'Incorrect username or password.' });
                    }

                    return cb(null, user);
                })
            }
        ))
    },

    encrypt: function(original, cb, options){
        options = options || {};
        var saltLength = options.saltLength || 10;
        bcrypt.genSalt(saltLength, function(err, salt){
            if(err) { return cb(err); }
            bcrypt.hash(original, salt, function(err, hash){
                cb(err, hash);
            })
        })
    },

    compare: function(original, hash, cb){
        bcrypt.compare(original, hash, cb);
    }
}