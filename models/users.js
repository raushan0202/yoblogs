var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
	email     : { type: String, unique: true, lowercase: true },
	username  : String,
	password  : String,
	imageName : String,
	active    : { type : Boolean, default : false }
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User",userSchema);

module.exports = User;