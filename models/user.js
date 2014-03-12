var authorization = require('../config/authorization');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    _id: { type: String, trim: true },
    password: { type: String, trim: false },
    created: { type: Date, default: Date.now },
    securityLevel: { type: Number, default: 0 }
});

UserSchema.path('_id').required(true, "Please enter a username");
UserSchema.path('password').required(true, "Please enter a password");

UserSchema.methods = {

    /**
     * Hashes and saves a new password as the password of this user if and only if the old password is the current password of the user.
     *
     * @param {String} oldPassword
     * @param {String} newPassword
     * @param {Function} cb - (error, success, options)
     * @api private
     */

    checkAndSetPassword: function(oldPassword, newPassword, cb){
        var self = this;
        this.checkPassword(oldPassword, function(err, oldPasswordsMatch){
            if(err) { return cb(err); }
            if(!oldPasswordsMatch) { return cb(null, false, { message: 'Password does not match current password.' }); }
            self.setPassword(newPassword, cb);
        });
    },

    /**
     * Hashes and saves a new password as the password of this user.
     *
     * @param {String} password
     * @param {Function} cb - (error, success)
     * @api private
     */

    setPassword: function(password, cb){
        var self = this;
        authorization.encrypt(oldPassword, function(err, passwordHash){
            if(err) { return cb(err); }
            self.password = passwordHash;
            cb(null, self);
        });
    },

    /**
     * Checks the given password against the password of this user.
     *
     * @param {String} password
     * @param {Function} cb - (error, success)
     * @api private
     */

    checkPassword: function(password, cb){
        authorization.compare(password, this.password, cb);
    }
}

UserSchema.statics = {

    /**
     * Check if a username meets requirements and is not already in use.
     *
     * @param {String} username
     * @param {Function} cb - (error, success, options)
     * @api private
     */

    checkUsername: function(username, cb){
        if(username.length < 2) { return cb(null, false, { message: 'Username must be at least 2 characters long.' }); }
        this.findOne({ _id: username })
            .exec(function(err, user){
                if(err) { return cb(err); }
                if(user) { return cb(null, false, { message: 'Username already in use' }) }
                cb(null, true);
            })
    },

    /**
     * Check if a password meets requirements.
     *
     * @param {String} password
     * @param {Function} cb - (error, success, options)
     * @api private
     */

    checkPassword: function(password, cb) {
        if(password.length < 8) { return cb(null, false, { message: 'Password must be at least 8 characters long.' }); }
        cb(null, true);
    },

    /**
     * Check if a username meets requirements and is not already in use as well as if a password meets requirements.
     *
     * @param {String} username
     * @param {String} password
     * @param {Function} cb - (error, success, options)
     * @api private
     */

    checkUsernameAndPassword: function(username, password, cb) {
        this.checkUsername(username, function(err, success, options){
            if(err) { return cb(err); }
            if(!success) { return cb(null, false, options); }
            this.checkPassword(password, cb);
        })
    },

    /**
     * Create and save a new user if and only if the username and password meet requirements.
     *
     * @param {String} username
     * @param {String} password
     * @param {Function} cb - (error, user, options)
     * @api private
     */

    create: function(username, password, cb){
        this.checkUsernameAndPassword(username, password, function(err, success, options){
            authorization.encrypt(password, function(err, passwordHash){
                if(err) { return cb(err); }
                var user = new User({
                    _id: username,
                    password: passwordHash
                });
                user.save(function(err){
                    if(err) { return cb(err); }
                    cb(null, user);
                })
            })
        })
    },

    /**
     * Gets an existing user if one exists with the given username.
     *
     * @param {String} username
     * @param {Function} cb - (error, user)
     * @api private
     */

    getByUsername: function(username, cb){
        if(!username){
            return cb(null, null, { message: 'Please enter a username' });
        }

        this.findOne({ _id: username })
            .exec(cb);
    },

    /**
     * List users
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    list: function(options, cb) {
        var criteria = options.criteria || {} // get search criteria from options, if supplied
        this.find(criteria) // apply search criteria if supplied
            .sort({'created': -1}) // sort by date starting with newest
            .limit(options.perPage) // limit to the number of items to be displayed per page
            .skip(options.perPage * options.page) // skip a number of elements
            .exec(cb) // execute query and catch any errors
    }
};

module.exports = mongoose.model('User', UserSchema);