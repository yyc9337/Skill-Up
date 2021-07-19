$(document).ready(function() {
	$('.choose-logo-bt').off('click').on('click', function() {
		$('.hidden-file-selector').click();
	});
	
	$('.hidden-file-selector').off('change').on('change', function() {
		let newFileName = $(this).val();
		if (newFileName) {
			$('.new-logo-name').text(newFileName.split('\\').pop());
		} else {
			$('.new-logo-name').text('Choose new image file');
		}
	});
	
	$('.save-bt').off('click').on('click', function() {
		if (!$('.hidden-file-selector').val()) {
			pisAlert('Please select image file', 'warning');
			return;
		}
		// TODO: Call save api
		pisConfirm("Save","Are you sure save?","save();");
	});
});

function pisAlert(msg,type){
	var tost = swal.mixin({
	    toast: true,
	    position: 'bottom',
	    showConfirmButton: false,
	    timer: 3000
	});
	
	tost({
	    type: type,
	    title: msg
	})
	 
	$(".swal2-shown").css({
		"z-index":"9999"
	})
}

function pisConfirm(title, msg, funcName, confirmButtonText = 'Save') {
	var swalWithBootstrapButtons = swal.mixin({ 
        confirmButtonClass: 'btn btn-primary mb-2',
        cancelButtonClass: 'btn btn-danger mr-2 mb-2',
        buttonsStyling: false,
    });

    swalWithBootstrapButtons({
        title: title,
        text: msg,
        type: 'info',
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Close',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            eval(funcName);
        }
    });
    
    $(".swal2-shown").css({
		"z-index":"9999"
	})
}

function save() {
	$("#formLogo").submit();
}


////////////////////////////////////////////////


$(function () {
	oldLogoName();
	$("#regrId").val(JSON.parse(sessionStorage.getItem("memberInfo")).id);
});

function oldLogoName() {
	$.ajax({
		url: pageContext + "/ui/oldLogoName",
		type: "POST",
		success: function(res) {
			$("#oldLogo").text(res);
		},
		error : function(x,s,e) {
			console.log(x,s,e);
		}
	});
}