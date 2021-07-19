/**
 * myPage.js
 * 
 */
var $myPage_form;
var $newUsrPwd;
var $chkNewUsrPwd;
var $chkNewUsrPwdInfo;
var chkNewPwdFlag = false;

$(document).ready(function(){
	
	$myPage_form = $("#myPage_form");
	$newUsrPwd = $("input[name='newUsrPwd']",$myPage_form);
	$chkNewUsrPwd = $("input[name='chkNewUsrPwd']",$myPage_form);
	$chkNewUsrPwdInfo = $(".chk_new_usr_pwd_info",$myPage_form);

	$newUsrPwd.on("keyup ",function(){
		checkEqNewPwd();
	});
	$chkNewUsrPwd.on("keyup ",function(){
		checkEqNewPwd();
	});


	$("input[name='usrTno']",$myPage_form).on("keyup", function() { 
		$(this).val(autoHypenPhone( $(this).val() ));
	});

});

// function
// ===========================================================================================
// 핸드폰 input 입력시 자동 하이픈 추가
function autoHypenPhone(str){
    str = str.replace(/[^0-9]/g, '');
    var tmp = '';
    if( str.length < 4){
        return str;
    }else if(str.length < 7){
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
        return tmp;
    }else if(str.length < 11){
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 3);
        tmp += '-';
        tmp += str.substr(6);
        return tmp;
    }else{              
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 4);
        tmp += '-';
        tmp += str.substr(7);
        return tmp;
    }

    return str;
}


// 내 정보 조회
function getMyPageInfo(){
	$.ajax({
		url : contextPath + '/myPage/getMyInfo',
		type : 'post',
		contentType: 'application/json',
		dataType: 'json',
		data : sessionStorage.getItem("memberInfo"),
		success : function(user){
			if(!user) {
				pisAlert('존재하지 않는 계정정보입니다. 관리자에 문의하세요.','error');
				return;
			}
			$("input[name='usrId']").val(user.id);
		},
		error : function(reason){
			pisAlert('오류가 발생했습니다. 관리자에 문의하세요.','error');
		}
	})
}


// 비밀번호 일치 확인
function checkEqNewPwd(){
	if(!$newUsrPwd.val() && !$chkNewUsrPwd.val()){
		$chkNewUsrPwdInfo.text('');
		return;
	}
	
	
	if($newUsrPwd.val() == $chkNewUsrPwd.val()){
		$chkNewUsrPwdInfo
			.text('비밀번호가 일치합니다.')
			.css({
				'color':'#6610f2'
			});
		chkNewPwdFlag = true;
	}else{
		$chkNewUsrPwdInfo
			.text('비밀번호가 일치하지 않습니다.')
			.css({
				'color':'#f44336'
			});
		chkNewPwdFlag = false;
	}
}


// 0. alert && confirm
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


function pisConfirm(title,msg, funcName){
	var swalWithBootstrapButtons = swal.mixin({
        confirmButtonClass: 'btn btn-primary mb-2',
        cancelButtonClass: 'btn btn-danger mr-2 mb-2',
        buttonsStyling: false,
    });

    swalWithBootstrapButtons({
        title: title,
        text: msg,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '닫기',
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



// 1. 입력 폼 체크
function checkMyPageInput(){
	var nullFlag = true;
	
	// 모든정보 입력 확인
	$.each($("input:not(.hidden_input, .input_change_pwd)",$myPage_form),function(index, item){
		item = $(item);
		
		if(!item.val()){
			nullFlag = false;
		}
	})
	
	
	if(nullFlag){
		if(checkInputChangePwd()){			
			pisConfirm("수정","내 정보를 수정하시겠습니까?","updateMyInfo();");
		}
	}else{
		pisAlert("모든 정보를 입력해 주세요.","warning");
	}
	
}
// 1-2. 비밀번호 체크
function checkInputChangePwd(){
	var $oldUsrPwd  = $("input[name='oldUsrPwd']").val();
	var $newUsrPwd  = $("input[name='newUsrPwd']").val();
	var $chkNewUsrPwd  = $("input[name='chkNewUsrPwd']").val();
	
	if( !$oldUsrPwd && !$newUsrPwd && !$chkNewUsrPwd){
		return true;
	}else{
		
		var nullFlag = true;
		$.each($(".input_change_pwd"),function(index, item){
			item = $(item);
			if(!item.val()){
				nullFlag = false;
			}
		})
		
		if(nullFlag){
			if(chkNewPwdFlag){
				return true;
			}else{
				pisAlert("새 비밀번호를 확인하여 주세요.","warning");
				return false;	
			}
			
		}else{
			pisAlert("비밀번호 변경을 원하실 경우 모든 정보를 입력해 주세요.","warning");
			return false;
		}
	}
}


// 2. 수정
function updateMyInfo(){
	
	$.ajax({
		url : contextPath + "/myPage/modify",
		type : "post",
		data : $myPage_form.serialize(),
		dataType : "json",
		success : function(data){
			if(data.result){				
				pisAlert("내 정보가 수정되었습니다.","success");

				if(data.option){
					pisConfirm("로그인","비밀번호가 변경되었습니다. 다시 로그인 해주세요.","document.location.href='/kbn/logout';");
				}
			}else{
				pisConfirm("비밀번호 오류","비밀번호가 틀립니다.","$(\"input[name='oldUsrPwd']\").val('').focus();");
			}
		},
		error : function(reason){
			pisAlert('오류가 발생했습니다. 관리자에 문의하세요.','error');
		}
	});
}

// 3. 모달 초기화
function resetModal(){
	$.each($("input",$myPage_form),function(index, item){
		$(item).val('');
	})
	$(".chk_new_usr_pwd_info").text('');
}
