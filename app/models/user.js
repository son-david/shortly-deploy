var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  id: Number,
  username: String,
  password: String
});

usersSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

usersSchema.methods.hashPassword = function(attemptedPassword, callback) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
    });
};

usersSchema.pre('save', function(next){
  this.hashPassword(this.password);
  next();
});

var User = db.model('User', usersSchema);

module.exports = User;
