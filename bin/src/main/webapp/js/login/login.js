function checkUse() {
	if($("#rememberIdCheck").hasClass('checked')) {
		$("#rememberIdCheck").removeClass('checked');
	} else {
		$("#rememberIdCheck").addClass('checked');
	}
}

function setCookie(name, value, expiredays) {
	var todayDate = new Date();
	todayDate.setDate(todayDate.getDate() + expiredays);
	document.cookie = name + "=" + escape(value) + "; path=/; expires="
			+ todayDate.toGMTString() + ";"
}

function getCookie(Name) {
	var search = Name + "=";
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = document.cookie.length;
			if (end == -1)
				end = document.cookie.length;
			return unescape(document.cookie.substring(offset, end));
		}
	}
}

//입력값 유호성 검사
function loginValidation(){
    if($("input[name=loginId]").val().length == 0){
        alertMessage("경고!","아이디를 입력해주세요.","warning");
        $("input[name=loginId]").focus();
        return false;
    }

    if($("input[name=pwd]").val().length == 0){
        alertMessage("경고!","비밀번호를 입력해주세요.","warning");
        $("input[name=userPw]").focus();
        return false;
    }

    return true;
}

//로그인
function loginConfirm() {
    if(!loginValidation()) {
		return;
	} else {
		login();
	}	
}


function login() {
	
    let sendData = {
        "loginId" : $("input[name=loginId]").val(),
        "pwd" : $("input[name=pwd]").val(),
    }


	if($("#rememberIdCheck").hasClass('checked')) { //아이디 저장을 체크하였을때
		setCookie("loginId", $("#id").val(), 7); //쿠키이름을 id로 form.mb_id.value 값을 7일동안 저장
	} else { //아이디 저장을 체크하지 않았을때
		setCookie("loginId", "", 0); //날짜를 0으로 저장하여 쿠키 삭제
	}
	
	$.ajax({
        url : contextPath +"/loginWeb",
        contentType : "application/json",
        type : "GET",
        data : sendData,
        success : function(data){
	
			if(data == 1) {
				
				let id = $('#id').val();
				let password = $('#password').val();
				
				let memberInfo = {
							id: id,
							password: password
				};

				sessionStorage.setItem('memberInfo', JSON.stringify(memberInfo));				
				location.href = contextPath + "/openGlzza";
				
			} else {
				alertMessage("실패!","입력하신 정보가 올바르지 않습니다.","danger");
			}
        }

    });	
	
}


$(window).on('load', function() {

	// iframe일 경우 top.href로 확장하기
	if ($(this)[0].name == "contentMain") {
		window.top.location.replace(contextPath+"/login");
	}

	if (getCookie("loginId")) {
		var id_value = getCookie("loginId").split(";");
		$("#id").val(id_value[0]);
		$("#rememberIdCheck").addClass('checked');
	} else {
		$("#rememberIdCheck").removeClass('checked');
	}

	$("#password").keydown(function(key) {
		if (key.keyCode == 13) {
			$("#login_btn").trigger('click');
		}
	});
});