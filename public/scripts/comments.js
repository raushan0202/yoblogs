function fetchComments(id){
	$.ajax({
		url : '/blogs/'+id+'/comments',
		success: function(result){
			$("#comments_container").html(result);
		}
	});
}

function uploadComments(id){
	$.ajax({
		url : '/blogs/'+ id +'/comments',
		data: {"comment[text]": ($("#inputComment").val())},
		type: 'POST',
		success:function(result){
			$("#comments_container").html(result);
		}
	});
	
	
	$("#newCommentForm_reset").click();
}

function editComment(id){
	//console.log(id);
	$("#"+id).css({"border": "1px solid sandybrown","line-height": "28px","border-radius": "5px","padding-left": "5px","outline":"none"});
	$("#"+id).attr("contentEditable","true");
	
	$("#"+id).focus();
	$("#"+id+"_edit").css("display","none");
	$("#"+id+"_save").css("display","inline-block");
	$("#"+id+"_delete").css("display","none");

	// var para = document.getElementById(id.id);
	// para.contentEditable = true;

}

function saveComment(id,blog_id,comment_id){
	$.ajax({
		url : '/blogs/'+blog_id+'/comments/'+comment_id+'?_method=PUT',
		data: {"comment[text]":$("#"+id).text()},
		type: 'POST',
		success: function(result){
			$("#comments_container").html(result);
		}
	});
	//console.log(id);
}

function deleteComment(blog_id,comment_id){
	$.ajax({
		url : '/blogs/'+blog_id+'/comments/'+comment_id+'?_method=DELETE',
		type: 'POST',
		success: function(result){
			$("#comments_container").html(result);
		}
	});
}