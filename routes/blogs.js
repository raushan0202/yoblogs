var express = require("express");
var router 	= express.Router();
var Blog    = require("../models/blogs");
var Rating    = require("../models/rating");
var multer  = require("multer"),
    path    = require("path");
//var Comment = require("../models/comment");
var middleware = require("../middleware");


// Set storage engine 
var storage	 =	multer.diskStorage({
   destination : './public/images/uploads/blogs',
   filename: function (req, file, cb ) {
      cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
   }
});
//Initialize UPLOAD
var upload = multer({ 
	storage : storage,
	limits : {fileSize : 3000000},
	fileFilter : function(req,file,cb){
		checkFileType(file,cb);
	} 

}).single('imagefile');

// Check file Type
function checkFileType(file,cb){
	//allowed extension
	var fileTypes = /jpeg|jpg|png|gif/;
	//check ext
	var extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
	//check mime type
	var mimetype = fileTypes.test(file.mimetype);

	if(extname && mimetype){
		return cb(null,true);
	} else {
		cb('Error: Images Only!');
	}
 
}



//INDEX ROUTE
router.get("/blogs",function(req,res){
	Blog.find({}).populate("ratings").exec(function(err,blogs){
		if(err){
			console.log(err);
		}else{
			//console.log("INSIDE ELSE");
			res.render("index",{blogs : blogs});
		}
	});
	
});
//NEW ROUTE
router.get("/blogs/new", middleware.isLoggedIn,function(req,res){
	res.render("blogs/new");
});

// CREATE ROUTE
router.post("/blogs", middleware.isLoggedIn,function(req,res){
	//create blog
       
    upload(req,res,function(err) {
    	if(err){
    		console.log(err);
    		res.redirect("/blogs/new");

    	} else {
    		if( typeof(req.file) == 'undefined' || req.body.title == "" || req.body.blogBody == ""){
    			//console.log(req.body.title);
    			//console.log(req.body.blogBody);
    			res.redirect("/blogs/new");
    		} else{
    		    
    	         var imgName = req.file.filename;
	             var title = req.body.title;
	             //console.log(title); 
	         
	             var body = req.sanitize(req.body.blogBody);
	             //console.log(body);

	             var author = {
		             id : req.user._id,
	             	username : req.user.username
	             }
	             var blog = { title : title, imageName : imgName, body : body, author : author };
	
	             Blog.create(blog,function(err,newBlog){
	             	if(err){
	             		res.render("blogs/new");
	             	}else{
	             		//then, redirect to index
	             		res.redirect("/blogs");
	             	}
	             });
	          }
	     }
    });

});

// SHOW ROUTE
router.get("/blogs/:id", middleware.isLoggedIn,function(req,res){
	Blog.findById(req.params.id).populate("comments").populate("ratings").exec(function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("blogs/show",{ blog : foundBlog});
		}
	});
	
});


//EDIT ROUTE
router.get("/blogs/:id/edit",middleware.checkBlogOwnership,function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("blogs/edit",{ blog : foundBlog});
		}
	});
	
});
//UPDATE ROUTE
router.put("/blogs/:id",middleware.checkBlogOwnership,function(req,res){
	

    upload(req,res,function(err) {
    	if(err){
    		console.log(err);
    		res.redirect("/blogs/" + req.params.id + "/edit");

    	} else {
    		if( typeof(req.file) == 'undefined' || req.body.title == "" || req.body.blogBody == ""){
    			res.redirect("/blogs/" + req.params.id + "/edit");
    		}else {
    		     //console.log(req.file);
    		     //console.log(req.body);
    		     //res.send("test");
    		     //req.body.blog.body = req.sanitize(req.body.blog.body);
    	         var imgName = req.file.filename;
	             var title = req.body.blog.title;
	             var body = req.sanitize(req.body.blog.body);
	             var author = {
		             id : req.user._id,
	             	username : req.user.username
	             }
     
	             var blog = { title : title, imageName : imgName, body : body,author : author };
	             Blog.findByIdAndUpdate(req.params.id, blog,function(err,updatedBlog){
		         if(err){
		         	res.redirect("/blogs");
		         }else{
		         	res.redirect("/blogs/" + req.params.id);
		         }
	           });   
	        } 
	        
	     }
    });

	
});
//DELETE ROUTE
router.delete("/blogs/:id",middleware.checkBlogOwnership,function(req,res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});

router.post("/blogs/:id/ratings",middleware.isLoggedIn,function(req,res){
	 

     Blog.findById(req.params.id,function(err,foundBlog){
     	if(err){
     		console.log(err);
     		res.redirect("/blogs");
     	} else {
     		var avgRating = 0;
     		
     		
     		var newRating = Number(req.body.rating.rating);
     		
            if(foundBlog.numOfRatings == 0){
            	avgRating =  newRating;
            }else {
            	avgRating = ((foundBlog.avgRating)*(foundBlog.numOfRatings)  + newRating)/(foundBlog.numOfRatings + 1);
            	
            }
            var numOfRatings = foundBlog.numOfRatings + 1;
            

            var blog = { avgRating : avgRating, numOfRatings : numOfRatings };
		     Blog.findByIdAndUpdate(req.params.id, blog,function(err,updatedBlog){
		     	
			     if(err){
			     	console.log("inside else");
			     	console.log(err);
			     	res.redirect("/blogs");
			     }else{

			     	 Rating.create(req.body.rating,function(err,rating){
						if(err){
							console.log(err);
							res.redirect("/blogs");
						} else {
							//add username and id to rating
							rating.author.id = req.user._id;
							rating.author.username = req.user.username;
							//save rating
							rating.save();
							updatedBlog.ratings.push(rating);
							updatedBlog.save();

							//res.redirect("/blogs/" + foundBlog._id+"/ratings");
							res.redirect("/blogs/" + updatedBlog._id + "/comments");
						}
					});
			     }


     	  });
     	}
     });
});


module.exports = router;