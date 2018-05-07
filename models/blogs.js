var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
	title        : String,
	imageName    : String,
	body         : String,
    avgRating    : {type : Number, default : 0 },
    numOfRatings : {type : Number, default : 0 },
	created : {type : Date, default : Date.now()},
	comments : [
         {
         	type : mongoose.Schema.Types.ObjectId,
         	ref  : "Comment"
         }    
     ],
     ratings : [
         {
         	type : mongoose.Schema.Types.ObjectId,
         	ref  : "Rating"
         }    
     ],
     author : {
		id :{
			type : mongoose.Schema.Types.ObjectId,
			ref  : "User"
		},
		username : String
	}
});

var Blog = mongoose.model("Blog",blogSchema);

module.exports = Blog;