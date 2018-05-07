var ratingStar = document.querySelectorAll(".rating-star");
var starOne    = document.getElementById("star-1-add-rating");
var starTwo    = document.getElementById("star-2-add-rating");
var starThree  = document.getElementById("star-3-add-rating");
var starFour   = document.getElementById("star-4-add-rating");
var starFive   = document.getElementById("star-5-add-rating");

var rating = 0;


 starOne.addEventListener("mouseover", function( event ) {   
 	
 	if(starOne.style.color == ""){
	    // highlight the mouseover target
	    starOne.style.color = "red";

	    // reset the color after a short delay
	    setTimeout(function() {
	      starOne.style.color = "";
	    }, 500);
    }

  }, false);

  starTwo.addEventListener("mouseover", function( event ) {   
  	if(starTwo.style.color == ""){
	    // highlight the mouseover target
	    starTwo.style.color = "red";
	    starOne.style.color = "red";

	    // reset the color after a short delay
	    setTimeout(function() {
	      starTwo.style.color = "";
	      starOne.style.color = "";
	    }, 500);
    }
  }, false);

 starThree.addEventListener("mouseover", function( event ) {   
 	if(starThree.style.color == ""){
	    // highlight the mouseover target
	    starThree.style.color = "yellow";
	    starTwo.style.color   = "yellow";
	    starOne.style.color   = "yellow";

	    // reset the color after a short delay  
	    setTimeout(function() {
	      starThree.style.color = "";
	      starTwo.style.color   = "";
	      starOne.style.color   = "";
	    }, 500);
    }
  }, false);

  starFour.addEventListener("mouseover", function( event ) {   
  	if(starFour.style.color == ""){
	    // highlight the mouseover target
	    starFour.style.color  = "green";
	    starThree.style.color = "green";
	    starTwo.style.color   = "green";
	    starOne.style.color   = "green";

	    // reset the color after a short delay
	    setTimeout(function() {
	      starFour.style.color  = "";
	      starThree.style.color = "";
	      starTwo.style.color   = "";
	      starOne.style.color   = "";
	    }, 500);
   }
  }, false);

   starFive.addEventListener("mouseover", function( event ) {  
    if(starFive.style.color == ""){ 
	    // highlight the mouseover target
	    starFive.style.color  = "green";
	    starFour.style.color  = "green";
	    starThree.style.color = "green";
	    starTwo.style.color   = "green";
	    starOne.style.color   = "green";

	    // reset the color after a short delay
	    setTimeout(function() {
	      starFive.style.color  = "";
	      starFour.style.color  = "";
	      starThree.style.color = "";
	      starTwo.style.color   = "";
	      starOne.style.color   = "";
	    }, 500);
   }
  }, false);

starOne.addEventListener("click", function( event ) {   
    starFive.style.color  = "";
    starFour.style.color  = "";
    starThree.style.color = "";
    starTwo.style.color   = "";
    starOne.style.color   = "red";
    rating = 1;
    
  }, false);

starTwo.addEventListener("click", function( event ) {   
    starFive.style.color  = "";
    starFour.style.color  = "";
    starThree.style.color = "";
    starTwo.style.color   = "red";
    starOne.style.color   = "red";
    rating = 2;
    
  }, false);


starThree.addEventListener("click", function( event ) {   
    starFive.style.color  = "";
    starFour.style.color  = "";
    starThree.style.color = "yellow";
    starTwo.style.color   = "yellow";
    starOne.style.color   = "yellow";
    rating = 3;
    
  }, false);

starFour.addEventListener("click", function( event ) {   
    starFive.style.color  = "";
    starFour.style.color  = "green";
    starThree.style.color = "green";
    starTwo.style.color   = "green";
    starOne.style.color   = "green";
    rating = 4;
    
  }, false);


starFive.addEventListener("click", function( event ) {   
    
    starFive.style.color  = "green";
    starFour.style.color  = "green";
    starThree.style.color = "green";
    starTwo.style.color   = "green";
    starOne.style.color   = "green";
    rating = 5;
    
  }, false);


function returnRating(){
	var ratingObj = {rating : rating};
	return ratingObj;
}

function submitRating(rating,id){
	var modal = document.getElementById('myModal');
	modal.style.display = "none";
	$.ajax({
		url : '/blogs/'+ id +'/ratings',
		data: {"rating": rating },
		type: 'POST',
		success:function(result){
			
			location.reload(true);
			//$("#comments_container").html(result);
		}
	});
}


function showModelForRatings(){


    // Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("ratingButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks on the button, open the modal 

 modal.style.display = "block";


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}



// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

}





