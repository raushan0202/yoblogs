


function showFileChooser(){
	var input 				 = document.getElementById("inputPic");
	var changeProfilePicture = document.getElementById("changeProfilePicture");
	var submitProfilePicture = document.getElementById("submitProfilePicture");
	//input.style.display = "block";
	input.hidden			    = false;
	changeProfilePicture.hidden = true;
	submitProfilePicture.hidden = false;
    //console.log("hereee");
}



function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#profilePic')
                    .attr('src', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }