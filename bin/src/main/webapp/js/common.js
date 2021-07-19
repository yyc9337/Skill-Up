function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var contextPath;
var CC = parent.CC;
var LL = parent.L;

function get(url) {
	return new Promise(function(resolve) {
		$.ajax({
			url: `${contextPath}${url}`,
			type: 'get',
			dataType: 'json',
			success: function(res) {
				resolve(res);
			},
			error: function() {
				resolve(null);
			}
		});		
	});
}

function post(url, param) {
	return new Promise(function(resolve) {
		$.ajax({
			url: `${contextPath}${url}`,
			type: 'post',
			contentType: 'application/json;charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(param),
			success: function(res) {
				resolve(res);
			},
			error: function() {
				resolve(null);
			}
		});
	});
}

function alertIfEmpty(jquerySelectorFieldNameMap) {
	let keys = Object.keys(jquerySelectorFieldNameMap);
	for (let i=0; i<keys.length; ++i) {
		if (!$(keys[i]).val()) {
			//pisAlert(`${jquerySelectorFieldNameMap[keys[i]]} cannot be empty.`);
			return true;
		}
	}
	return false;
}

function alertError() {
	//pisAlert('An error has occurred. Please contact the administrator', 'error');
}

// confirm
function glzzaConfirm(title,msg, funcName,type = 'info',buttonNm = null,cancelFuncName = null){
	var $d = $.Deferred();
	var swalWithBootstrapButtons = swal.mixin({
        confirmButtonClass: 'btn btn-primary mb-2',
        cancelButtonClass: 'btn btn-danger mr-2 mb-2',
        buttonsStyling: false,
    });
	if(!buttonNm){
		buttonNm = ['Ok', 'Cancel'];
	}

    swalWithBootstrapButtons({
        title: title,
        text: msg,
        type: type,
        showCancelButton: true,
        confirmButtonText: buttonNm[0] || 'Ok',
        cancelButtonText: buttonNm[1] || 'Cancel',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            eval(funcName);
            $d.resolve(result);
        }else if(result.dismiss == 'cancel'){
        	if(cancelFuncName){        	
        		eval(cancelFuncName);
        		$d.resolve(result);
        	}else{        		
        		$d.reject();
        	}
        }else if(result.dismiss == 'overlay'){
        	$d.reject();
        }
    });
    
    $(".swal2-shown").css({
		"z-index":"9999"
	}); 
     
    return $d.promise();
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


function successMessage(data,apiUrl,param){
	// console.log(apiUrl + " [[SUCCESS]] :: request",param," response",data);
}

function apiRequestExcel(serviceName, fileName, param){
	var apiUrl = `/excel/serviceName/${serviceName}/fileName/${fileName}?`;
	var data = param == null ? null : param;
	
	if(data != null && typeof data != 'string' && typeof data.serialize == 'function'){
		data = data.serialize();
	}
	location.href = contextPath + apiUrl + data;
}

function apiRequestAsync(apiUrl, param, type, loading = false,xtable = null) {
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

	if(loading){
		loadingStart();
		$("button").blur();
	}

	$.ajax({
		url : contextPath + apiUrl,
		type : type,
		data : type.toUpperCase() == 'GET' ? data : JSON.stringify(data),
		async : false,
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
	
	if(loading){
		loadingStart();
		$("button").blur();
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

function apiRequestMulti(apiUrl, data, type, loading = false, xtable = null){
	var $d = $.Deferred();
	$.ajax({
	    type: type ,
	    enctype: 'multipart/form-data',
	    url: contextPath + apiUrl,
	    data: data,
	    processData: false,
	    contentType: false,
	    cache: false,
	    dataType : "json",
	    success: function (data) {
	    	
	    	if(apiSuccessFnc(apiUrl, null, loading, data)){
	    		$d.resolve(data);
	    	}else{
	    		$d.reject(data);
	    	}
	    },
	    error: function (reason) {
			if(apiErrorFnc(apiUrl, null, loading, reason)){				
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

function errorMessage(reason,apiUrl,param){
	var message = "오류가 발생하였습니다. 관리자에게 문의해주세요.";
	
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
	
	pisAlert(message,'error');
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

function removeSlash(data) {
	return data.replace(/\//g,'');
}

function isEmpty(value){
	if(value == null || value == ""){
		return true;
	}
	return false;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function badRequestProcess(error){
	if(error.status == 400){
		//pisAlert(error.responseJSON.errorMessage,"error");
	}
}