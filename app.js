var express          = require("express"),
    app              = express(),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    expressSession   = require("express-session"),
    LocalStrategy    = require("passport-local"),
    Blog             = require("./models/blogs"),
    Comment          = require("./models/comments"),
    User             = require("./models/users"),
    multer           = require("multer"),
    path             = require("path");


 //Requiring Routes
    var commentRoutes    = require("./routes/comments"),
        blogRoutes       = require("./routes/blogs"),
        indexRoutes      = require("./routes/index");

var $ = require('jquery');



//APP CONFIG
//mongoose.connect("mongodb://localhost/restful_blog_app_v8");
mongoose.connect("mongodb://ross:hadoop@ds119810.mlab.com:19810/yoblogdb");


app.use(bodyParser.urlencoded({extended :true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static( __dirname + "/public"));
app.set("view engine","ejs");





//PASSPORT CONFIGURATION
app.use(expressSession({
	secret : "Security is a must",
	resave : false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});



app.use(indexRoutes);
app.use(blogRoutes);
app.use(commentRoutes);







app.listen( process.env.PORT || 3000,function(){
    console.log("server has started");
});