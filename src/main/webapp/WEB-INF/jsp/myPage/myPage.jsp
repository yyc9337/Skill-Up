<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

	
	
<link type="text/css" rel="stylesheet" href="${pageContext.request.contextPath}/css/myPage/myPage.css" />
<script src="${pageContext.request.contextPath}/js/myPage/myPage.js"></script>
<script>
	var contextPath = "${pageContext.request.contextPath}";
</script>
<div class="modal fade" id="my_page_modal" tabindex="-1" role="dialog" aria-labelledby="model-8" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content">
		
			<div class="modal-header">
				<h2 class="modal-title" id="model-8">MY Page</h2>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="resetModal();">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
	
	
			<div class="us modal-body">
				<form id="myPage_form" name="myPageForm" method="post">
					<input type="hidden" name="usrAuthTpCd" class="hidden_input" value="${myInfo[0].usrAuthTpCd }">
				
					<div class="form-inline">
						<div class="input-group input-group-sm mb-3">
						    <div class="input-group-prepend">
						        <span class="input-group-text" id="inputGroup-sizing-lg">아이디</span>
						    </div>
					    	<input type="text" name="usrId" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" value="${myInfo[0].usrId}" readonly>
					    </div>
					
						<div class="input-group input-group-sm mb-3">
					        <div class="input-group-prepend">
					            <span class="input-group-text id="inputGroup-sizing-lg">권한 유형</span>
					        </div>
					        <input type="text" name="usrAuthTpNm" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" value="${myInfo[0].usrAuthTpNm }" readonly>
						</div>
					
						<div class="input-group input-group-sm mb-3">
						    <div class="input-group-prepend">
						        <span class="input-group-text" id="inputGroup-sizing-lg">이름</span>
						    </div>
						    <input type="text" name="usrNm" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" value="${myInfo[0].usrNm }">
						</div>
					
					
						<div class="input-group input-group-sm mb-3">
						    <div class="input-group-prepend">
						        <span class="input-group-text" id="inputGroup-sizing-lg">전화번호</span>
						    </div>
						    <input type="text" name="usrTno" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" value="${myInfo[0].usrTno }" maxlength="13">
						</div>
					
						<div class="input-group input-group-sm mb-3">
						    <div class="input-group-prepend">
						        <span class="input-group-text" id="inputGroup-sizing-lg">이메일</span>
						    </div>
						    <input type="text" name="usrEmailAddr" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" value="${myInfo[0].usrEmailAddr }">
						</div>
					
						<div class="input-group input-group-sm mb-3">
						    <div class="input-group-prepend">
						        <span class="input-group-text" id="inputGroup-sizing-lg">성별</span>
						    </div>
							<select class="custom-select" name="sex">
							    <option value="">성별을 선택해주세요.</option>
							    <option value="M" ${myInfo[0].sex == 'M' ? 'selected' : '' }>남자</option>
							<option value="F" ${myInfo[0].sex == 'F' ? 'selected' : '' }>여자</option>
							</select>
					  	</div>
					  
					  	<div class="input-group input-group-sm mb-3">
							<div class="input-group-prepend">
							    <span class="input-group-text" id="inputGroup-sizing-lg">생년월일</span>
							</div>
							<input type="date" name="birthDay" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" value="${myInfo[0].birthDay}">
						</div>
					</div>
				
					<hr class="border-dashed my-3">
					<div class="form-inline">
						<div class="input-group input-group-sm mb-3 input_old_usr_pwd ">
						    <div class="input-group-prepend">
						        <span class="input-group-text" id="inputGroup-sizing-lg">기존 비밀번호</span>
						    </div>
						    <input type="password" name="oldUsrPwd" class="form-control input_change_pwd" aria-label="Default" aria-describedby="inputGroup-sizing-default" value="">
						</div>
					
						<div class="input-group input-group-sm mb-3 input_new_usr_pwd">
						    <div class="input-group-prepend">
						        <span class="input-group-text" id="inputGroup-sizing-lg">새 비밀번호</span>
						    </div>
						    <input type="password" name="newUsrPwd" class="form-control input_change_pwd" aria-label="Default" aria-describedby="inputGroup-sizing-default" value="">
						</div>
					
						<div class="input-group input-group-sm mb-3 input_chk_new_usr_pwd ">
						    <div class="input-group-prepend">
						        <span class="input-group-text" id="inputGroup-sizing-lg">비밀번호 확인</span>
						    </div>
						    <input type="password" name="chkNewUsrPwd" class="form-control input_change_pwd" aria-label="Default" aria-describedby="inputGroup-sizing-default" value="">    
				     	</div>
				     	<div class="input-group input-group-sm mb-3 input_chk_new_usr_pwd ">
						    <small class="chk_new_usr_pwd_info"></small>    
				     	</div>
			     	</div>
				</form>
			</div>
			
			
			<div class="modal-footer">
				<button type="button" id="inputBtn" class="btn btn-primary mr-2 mb-2" data-toggle="modal" onclick="checkMyPageInput();">내 정보 수정</button>
				<button type="button" class="btn btn-secondary mr-2 mb-2" data-dismiss="modal" onclick="resetModal();">닫기</button>
			</div>
		
		</div>
	</div>
</div>




