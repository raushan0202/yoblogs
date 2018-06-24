var express 	= require("express");
var router 		= express.Router();
var passport    = require("passport"),
    bcrypt		= require("bcrypt"),
    mailer		= require("nodemailer");
var multer  = require("multer"),
    path    = require("path");

var Blog 				= require("../models/blogs");
var User 	            = require("../models/users");
var UnverifiedUser 	    = require("../models/unverifiedUser");
var middleware 		    = require("../middleware");




//middleware for uploading picture
// Set storage engine 
var storage	 =	multer.diskStorage({
   destination : './public/images/uploads/profile',
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

}).single('profilePic');

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



//RESTFUL ROUTES
router.get("/",function(req,res){
	res.redirect("/blogs");
});

//Profile route
router.get("/profile",middleware.isLoggedIn,function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}else{
			User.findById(req.user._id,function(err,foundUser){
				if(err){
					console.log(err);
					res.redirect("/");
				} else {
					res.render("profile",{blogs : blogs,user : foundUser});
				}
			});
		
			
		}
});
});

//Route for uploading profile picture
router.post("/profile/picture",function(req,res){
	

    upload(req,res,function(err) {
    	if(err){
    		console.log(err);
    		res.redirect("/profile");

    	} else {
    		if( typeof(req.file) == 'undefined'){
                console.log("file not selected");
                console.log(req.file);
    			res.redirect("/profile");
    		} else{
    		    
    	         var imageName = req.file.filename;
	             
	
	             User.findByIdAndUpdate(req.user._id,{imageName : imageName},function(err,foundUser){
	             	if(err){
	             		console.log(err);
	             		res.redirect("/profile");
	             	}else{
	             		//then, redirect to profile page
	             		res.redirect("/profile");
	             	}
	             });
	          }
	     }
    });

});



//REGISTER ROUTE -- show register page
router.get("/register",function(req,res){
	res.render("register",{ msg : "" });
});

// Handle register logic
router.post("/register",function(req,res){
	var email = req.body.email;
	var newUser = new User({email : req.body.email , username : req.body.username });
	var password = req.body.password;
	
	if(password.length >= 8 && password.length <= 50){
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			res.render("register",{ msg : "" });
		}
        var toBeHashed = email + password;
        var saltRounds = 10;
        bcrypt.hash(toBeHashed, saltRounds, function(err, hash) {
			  // Store hash in your unverifiedUser collection
			  if(err){
			  	console.log(err);
			  } else {
			  	var temp = { userId : user._id , hash : hash };
			  	UnverifiedUser.create(temp, function(err,newUnverifiedUser){
			  		if(err){
			  			console.log(err);
			  			res.redirect("/register");
			  		} else {
	                    
	                    var link = "https://yoblogs.herokuapp.com/verification/" + hash;
	                    sendMail(email,link);
	                }
	            });
	          }
	    });
        
		passport.authenticate("local")(req,res,function(){
			res.redirect("/blogs");
		});
	});
   } else {
   	res.render("register",{ msg : "Password should be between 8 to 50 characters" });
   }
});

//SHOW LOGIN FORM
router.get("/login",function(req,res){
	res.render("login", { msg : "" });
});

//Handle login logic
router.post("/login",passport.authenticate("local",
	{
		successRedirect : "/blogs",
		failureRedirect : "/login"
	}),function(req,res){});

//Logout Route
router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/blogs");
});


//EMAIL Verification Route
router.get("/verification/:hash1/:hash2",function(req,res){
	var hash = req.params.hash1 + "/" + req.params.hash2;
	
	UnverifiedUser.findOne({ hash : hash }, function(err,foundUnverifiedUser){
		if(err){
           console.log(err);
	    } else {
	    	if(foundUnverifiedUser == null ){
	    		res.render("notFound");
	    	} else {
	    		User.findByIdAndUpdate(foundUnverifiedUser.userId, {active : true}, function(err,updatedUser){
	    		if(err){
	    			console.log(err);
	    		} else {
	    			UnverifiedUser.findByIdAndRemove(foundUnverifiedUser._id,function(err){
	    				if(err){
	    					console.log(err);
	    				}
	    				res.render("login", { msg : "Your email has been verified." });
	    			});
                    
	    			
	    			
	    		} 
	    	});
	    	}
	    	
	    }		
	});
});

router.get("/verification/:hash",function(req,res){
	var hash = req.params.hash;
	
	UnverifiedUser.findOne({ hash : hash }, function(err,foundUnverifiedUser){
		if(err){
           console.log(err);
	    } else {
	    	if(foundUnverifiedUser == null ){
	    		res.render("notFound");
	    	} else {
	    		User.findByIdAndUpdate(foundUnverifiedUser.userId, {active : true}, function(err,updatedUser){
	    		if(err){
	    			console.log(err);
	    		} else {
	    			UnverifiedUser.findByIdAndRemove(foundUnverifiedUser._id,function(err){
	    				if(err){
	    					console.log(err);
	    				}
	    				res.render("login", { msg : "Your email has been verified." });
	    			});
                    
	    			
	    			
	    		} 
	    	});
	    	}
	    	
	    }		
	});
});


//show password recovery page

router.get("/recover",function(req,res){
	res.render("recover");
});

//Send password recovery link to registered email id
router.post("/recover",function(req,res){
	async.waterfall([
		function(done){
			crypto.randomBytes(25,function(err,buff){

				var token = buff.toString('hex');
				done(err,token);
			});
		},
		function(token,done){
			User.findOne({email : req.body.email},function(err,user){
				if(!user){
					console.log(err);
					//console.log("here");
					return res.redirect("/recover");
				}
				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; //1 Hour
				user.save(function(err){
					done(err,token,user);
				});
			});

		},
		function(token,user,done){
			// Use Smtp Protocol to send Email
			var smtpTransport = mailer.createTransport({
			    service: "Gmail",
			    auth: {
			    	
				        user: "yoblogs02@gmail.com",
				        pass: "********"

			    }
			});

			var mail = {
			    from: "YOBlogs Limited <yoblogs02@gmail.com>",
			    to: user.email,
			    subject: "Reset Password",
			    text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
			          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
			          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			    
			}

			smtpTransport.sendMail(mail, function(error, response){
			    if(error){
			        console.log(error);
			    }else{
			        console.log("Message sent: " + response.message);
			        res.send("Check your email for password reset link.");
			    }

			    smtpTransport.close();
			    done(err,'done');
			});
		}

		],function(err){
		if(err) {
			console.log(err);
			return next(err);
		}
		res.redirect("/recover");
	});


});

// RESET ROUTE - show password reset page
router.get("/reset/:token",function(req,res){
	User.findOne({resetPasswordToken : req.params.token, resetPasswordExpires : { $gt: Date.now()  } },function(err,user){
		if(!user){
			//req.flash('error','Password reset token is invalid or has expired.');
			return res.redirect("/recover");
		}
		res.render("reset",{ user : user});
	});
});
//RESET ROUTE - Handle password reset logic
router.post("/reset/:token",function(req,res){
	async.waterfall([
		function(done){
			User.findOne({resetPasswordToken : req.params.token, resetPasswordExpires : { $gt : Date.now() } },function(err,user){
				if(!user){
					req.flash('error', 'Password reset token is invalid or has expired.');
		            return res.redirect('back');
				}
				if(req.body.newPassword === req.body.confirmPassword){
						user.setPassword(req.body.newPassword,function(err,user){
						if(err){
							console.log(err);
							//req.flash('error', 'Sorry something went wrong');
			                return res.redirect('back');
						}
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;
						user.save(function(err){
							req.logIn(user, function(err) {
				            done(err, user);
				          });
						});
					});

				} else {
					console.log("passwords do not match");
					//req.flash('error', 'Passwords do not match')
		            res.redirect('back');

				}
				
			});

		},
		function(user,done){
			var smtpTransport = mailer.createTransport({
			    service: "Gmail",
			    auth: {
			    	
				        user: "yoblogs02@gmail.com",
				        pass: "*******"

			    }
			});

			var mail = {
			    from: "YOBlogs Limited <yoblogs02@gmail.com>",
			    to : user.email,
			    subject: "Password Updated Successfully",
			    text: 'Hello,\n\n' +
                      'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			    
			}

			smtpTransport.sendMail(mail, function(err, response){
			    if(err){
			        console.log(err);
			    }else{
			        console.log("Message sent ");
			        //req.flash('success', 'Success! Your password has been changed.');
			        //done(err);

			    }

			    smtpTransport.close();
			    done(err);
			});

		}

		],function(err){
		  console.log(err);
		  res.redirect("/");
	});
	
});


//middleware

function sendMail(email,link){
	// Use Smtp Protocol to send Email
	var smtpTransport = mailer.createTransport({
	    service: "Gmail",
	    auth: {
	    	
		        user: "yoblogs02@gmail.com",
		        pass: "*******"

	    }
	});

	var mail = {
	    from: "YOBlogs Limited <yoblogs02@gmail.com>",
	    to: email,
	    subject: "Verify your email",
	    text: "This mail is in response to your new YOBlogs account.Click on the below link to verify your email",
	    html: "<p>This mail is in response to your new YOBlogs account.Click on the below link to verify your email</p> <div><a href=' "+ link +"'>Click Here</a></div>"
	}

	smtpTransport.sendMail(mail, function(error, response){
	    if(error){
	        console.log(error);
	    }else{
	        console.log("Message sent: " + response.message);
	    }

	    smtpTransport.close();
	});
}





module.exports = router;
