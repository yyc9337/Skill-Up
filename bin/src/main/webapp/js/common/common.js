function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function postEcho(param){
    $.ajax({
        url : contextPath+"/echo",
        type : "POST",
        contentType : "application/json",
        data : JSON.stringify(param),
        success : function(data){

        }
    });
}

$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();

   $.each(a, function() {
	   if(this.value == null || this.value == ''){
		   return;
	   }
	   if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

$.fn.serializeObjectCustom = function()
{
   var o = {};
   var a = this.serializeArray();

   $.each(a, function() {
	   if(this.value == null || this.value == ''){
	       return;
	   }
	   
	   if(this.name.substr(this.name.length -2, 2) == "Cd" || this.name.substr(this.name.length -2, 2) == "Yn"){
		   this.name = this.name.substr(0, this.name.length -2);
	   }
	   
	   if(this.name.substr(this.name.length -4, 4) == "List"){
		   if(o[this.name] == null){			   
			   o[this.name] = [];
		   }
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
	   }
	   else if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }

   });
   return o;
};

$.fn.serializeObjectCustom2 = function()
{
   var o = {};
   var a = this.serializeArray();

   $.each(a, function() {
	   if(this.name.substr(this.name.length -4, 4) == "List"){
		   if(o[this.name] == null){			   
			   o[this.name] = [];
		   }
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
	   }
	   else if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
    	   if(this.value == null || this.value == ''){
    	       return;
    	   }
           o[this.name] = this.value || '';
       }

   });
   return o;
};

function alertMessage(title,message,type){
	console.log(title);
	var a = title;
	console.log(a);
    if(type != "success" && type != "primary" && type != "danger" && type != "info" && type != "warning"){
        return false;
    }

    $("#alert").addClass("bg-"+type);
    $("#alertTitle").text(title);
    $("#alertMessage").text(message);

    $("#alert").alert().show();

	setTimeout(function() {
		$("#alert").removeClass("bg-"+type);
		$("#alert").alert().hide();
	}, 3000);


}

function tagsInputAnimation(target,animation){
    $(target).addClass("animated "+ animation).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(target).removeClass('animated ' + animation);
    });
}

function testEmailRule(email){
    let emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    return emailRule.test(email);
}

function testPwRule(pw){
    let pwRule = /(?=.*\d)(?=.*[a-z]).{8,12}/
    return pwRule.test(pw);
}

function successMessage(data,apiUrl,param){
	// console.log(apiUrl + " [[SUCCESS]] :: request",param," response",data);
}

function errorMessage(reason,apiUrl,param){
	let message = "오류가 발생하였습니다. 관리자에게 문의해주세요.";
	
	if(reason.returnCode != undefined){	
		if(reason.errorCode == "401"){
			message = "Please log-in again.";
			setTimeout(function(){
				location.href = contextPath + "/t/logout";
			},1000 * 1);
		}else{			
			message = reason.errorMessage;
		}
	}
	
	alertMessage("경고!",message,"danger");
}


function apiRequest(apiUrl, param, type, loading = false,xtable = null) {
	$("[role=tooltip]").remove();
	
	var $d = $.Deferred();
	var data = param == null ? {} : param;
	if(param != null && typeof param.serialize == 'function'){
		if(type.toUpperCase() == 'GET'){
			data = param.serializeObject();
		}
		else{
			data = param.serializeObjectCustom();
		}
	}
	
	$.ajax({
		url : contextPath + apiUrl,
		type : type,
		data : type.toUpperCase() == 'GET' ? data : JSON.stringify(data),
		dataType : 'JSON',
		contentType: 'application/json;charset=UTF-8',
		success : function(data){
			if(apiSuccessFnc(apiUrl, param, loading, data)){
	    		$d.resolve(data);
	    	}else{
	    		$d.reject(data);
	    	}
			
			var filter = $("")
		},
		error : function(reason){
			if(apiErrorFnc(apiUrl, param, loading, reason)){				
				$d.reject(reason);
			}
		}
	});
	
	return $d.promise();
}

function apiSuccessFnc (apiUrl, param, loading, data) {  
	if(loading){
		loadingEnd();	
	}
	
	if(param == null){
		param = "";
	}
	
	if(data.returnCode == undefined || data.returnCode == "F"){
		errorMessage(data,apiUrl,param);
		xError();
		
		return false;
	}
	else{
		if(!data.data){
			data['data'] = {result : null};
		}
		if(data.data.pagination){				
			xNoData(data.data.pagination.totalCount || 0);			
		}
		successMessage(data,apiUrl,param);
		
		return true;
		
	}
}

function apiErrorFnc (apiUrl, param, loading, reason) {  
	if(loading){
		loadingEnd();	
	}
	// xError();
	errorMessage(reason,apiUrl,param);
	return true;
}


// 숫자만
function onlyNumber(event){
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if ( (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 || keyID == 190 || keyID == 9 || keyID == 110) 
		return;
	else
		return false;
}

// 글자 지우기
function removeChar(event) {
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if ( keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ) 
		return;
	else
		event.target.value = event.target.value.replace(/[^0-9|.]/g, "");
}

//숫자만 간단하게 onkeypress 로 사용 가능
function onlyNumberInput(event){
      if((event.keyCode<48)||(event.keyCode>57))
      event.returnValue=false;
}


function checkConfirm(title, msg, funcName) {
	if (typeof swal == 'undefined') {
            console.warn('Warning - sweet_alert.min.js is not loaded.');
            return;
    }
	
	 var swalInit = swal.mixin({
                buttonsStyling: false,
                confirmButtonClass: 'btn bg-teal',
                cancelButtonClass: 'btn btn-danger'
     });


     swalInit.fire({
        title: title,
        text: msg,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: modalYes,
		cancelButtonText: modalNo
     }).then((result) => {
		if (result.value) {
			eval(funcName);
		}
     });
}

function clearFormData() {
	var frm = document.getElementById('insert_form');
    var em = frm.elements;
    frm.reset();
    for (var i = 0; i < em.length; i++) {
        if (em[i].type == 'text') em[i].value = '';
        if (em[i].type == 'checkbox') em[i].checked = false;
		if (em[i].type == 'hidden') em[i].value = '';
		if (em[i].type == 'password') em[i].value = '';
        if (em[i].type == 'radio') em[i].checked = false;
        if (em[i].type == 'select-one') em[i].options[0].selected = true;
        if (em[i].type == 'textarea') em[i].value = '';
    }
    return;
}

function apiRequestExcel(serviceName, fileName, param){
	var apiUrl = `/excel/serviceName/${serviceName}/fileName/${fileName}?`;
	var data = param == null ? null : param;
	
	if(data != null && typeof data != 'string' && typeof data.serialize == 'function'){
		data = data.serialize();
	}
	location.href = contextPath + apiUrl + data;
}