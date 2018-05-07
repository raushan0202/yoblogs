var homeBtn    = document.getElementById("homeBtn");
var newPostBtn = document.getElementById("newPostBtn");
var loginBtn   = document.getElementById("loginBtn");
var signupBtn  = document.getElementById("signupBtn");




function verifyFile(id){
	var newBlogImageFile = $("#" + id);

    var fileTypes = /jpeg|jpg|png|gif/;
    var mimetype = fileTypes.test(newBlogImageFile[0].files[0].type);
    
  	if(newBlogImageFile[0].files[0].size > 3*1024*1024){
  		newBlogImageFile.val('');
  		alert("Select a file less than 3 MB !!!");
  	}
    if(!mimetype){
    	newBlogImageFile.val('');
    	alert("Select an image File!!!")
    }
}



homeBtn.addEventListener("click" , function(){

  homeBtn.classList.add("active");
  newPostBtn.classList.remove("active");
  loginBtn.classList.remove("active");
  signupBtn.classList.remove("active");
  
});

newPostBtn.addEventListener("click" , function(){
  console.log("heree");
  homeBtn.classList.remove("active");
  newPostBtn.classList.add("active");
  loginBtn.classList.remove("active");
  signupBtn.classList.remove("active");
  
});
loginBtn.addEventListener("click" , function(){
  
  homeBtn.classList.remove("active");
  newPostBtn.classList.remove("active");
  loginBtn.classList.add("active");
  signupBtn.classList.remove("active");
  
});
signupBtn.addEventListener("click" , function(){
  
  homeBtn.classList.remove("active");
  newPostBtn.classList.remove("active");
  loginBtn.classList.remove("active");
  signupBtn.classList.add("active");
  
});


