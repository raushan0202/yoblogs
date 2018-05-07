var mongoose = require("mongoose");


var unverifiedUserSchema = new mongoose.Schema({
	userId : String,
	hash   : String
	
});

var UnverifiedUser = mongoose.model("UnverifiedUser",unverifiedUserSchema);

module.exports = UnverifiedUser;