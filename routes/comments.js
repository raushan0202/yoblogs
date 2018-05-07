var express = require("express");
var router 	= express.Router();
var Blog = require("../models/blogs");
var Comment = require("../models/comments");
var middleware = require("../middleware");





//===============================
//     COMMENTS ROUTE
//===============================

// INDEX Route for Comments -- SHOW COMMENT ROUTE
router.get("/blogs/:id/comments",function(req,res){
	Blog.findById(req.params.id).populate("comments").populate("ratings").exec(function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("comments/show_comments",{ blog : foundBlog});
		}
	});
	
});


//post a new comment
router.post("/blogs/:id/comments",middleware.isLoggedIn,function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		} else {
			
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
					res.redirect("/blogs");
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					foundBlog.comments.push(comment);
					foundBlog.save();

					res.redirect("/blogs/" + foundBlog._id+"/comments");
				}
			});
		}
	});
});

//UPDATE an existing comment
router.put("/blogs/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,foundComment){
    	if(err){
    		console.log(err);
    		res.redirect("back");
    	}
    	res.redirect("/blogs/" + req.params.id+"/comments");
    });
	
});


//DESTROY COMMENT ROUTE
router.delete("/blogs/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
    	if(err){
    		console.log(err);
    		res.redirect("back");
    	}
    	res.redirect("/blogs/" + req.params.id+"/comments");
    });
	
});


module.exports = router;