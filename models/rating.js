var mongoose = require("mongoose");

var ratingSchema = new mongoose.Schema({
	rating : Number,
	created : {type : Date, default : Date.now()},
	author : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : "User"
		},
		username : String
	}
});

var Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating ;