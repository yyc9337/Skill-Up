
//ID 중복 체크
function duplicateIdCheck(id){
	
    let sendData = {
		userId : id
	}
	
	$.ajax({
        url : contextPath +"/duplicationIdCheck",
        contentType : "application/json",
        type : "GET",
        data : sendData,
        success : function(data){
			if(data.data == 1) {
				alertMessage("경고!","이미 등록된 아이디입니다.","warning");
				return false;
			} else {
				signup();
			}
        }

    });	
	
}

//입력값 유호성 검사
function signupValidation(){
    if($("input[name=userId]").val().length == 0){
        alertMessage("경고!","아이디를 입력해주세요.","warning");
        $("input[name=userId]").focus();
        return false;
    }

    if($("input[name=userPwd]").val().length == 0){
        alertMessage("경고!","비밀번호를 입력해주세요.","warning");
        $("input[name=userPw]").focus();
        return false;
    }

    if($("input[name=pwdRepeat]").val().length == 0){
        alertMessage("경고!","비밀번호 재입력을 입력해주세요.","warning");
        $("input[name=pwRepeat]").focus();
        return false;
    }

    if($("input[name=userNm]").val().length == 0){
        alertMessage("경고!","이름 입력해주세요.","warning");
        $("input[name=userNm]").focus();
        return false;
    }

	if($("input[name=userPwd]").val() != $("input[name=pwdRepeat]").val()) {
		alertMessage("경고!","비밀번호가 일치하지 않습니다.","warning");
        $("input[name=userPw]").focus();
        return false;
	}
	

    return true;
}

//회원가입
function signupConfirm() {
    if(!signupValidation()) {
		return;
	} else {
		duplicateIdCheck($("input[name=userId]").val());
	}	
}

function signup() {
	
    let sendData = {
        "userId" : $("input[name=userId]").val(),
        "userPwd" : $("input[name=userPwd]").val(),
        "userNm" : $("input[name=userNm]").val()
    }
	
	$.ajax({
        url : contextPath +"/signupId",
        contentType : "application/json",
        type : "POST",
        data : JSON.stringify(sendData),
        success : function(data){
			if(data.data == 1) {
				alertMessage("성공!","회원가입이 완료되었습니다.","success");
				location.href = contextPath + "/";
			}
        },
		error : function(e) {
			alertMessage("경고!","회원가입 실패하였습니다.","danger");
		}

    });	
	
}