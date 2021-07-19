<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/common/taglib.jsp"%>
<%@ include file="/WEB-INF/jsp/common/templateCss.jsp"%>
<html>
<head>
<title>GLZZA</title>
<script src="${pageContext.request.contextPath}/js/jquery.min.js" type="text/javascript" type="text/javascript"></script>
<link rel="shortcut icon" href="${pageContext.request.contextPath}/assets/images/icon/favicon.ico" type="image/x-icon">
<script>
	var contextPath = "${pageContext.request.contextPath}";
</script>
<script src="${pageContext.request.contextPath}/js/login/login.js" type="text/javascript"></script>

<style>
	.dt-login__bg-section:before{
		background-color: #324148!important;
	}
	
	.alert {
		display: none;
        position: fixed;
        top: 85%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        z-index: 9999;
    }
    
    .login-cover {
 		background: url(${pageContext.request.contextPath}/images/login_cover.jpg) no-repeat;
 		background-size: cover;
 	}
</style>

<body class="dt-sidebar--fixed dt-header--fixed">
	<div class="page-content login-cover">
		<div class="content d-flex justify-content-center align-items-center">

		<!-- Login form -->
		<form class="login-form wmin-sm-400" action="index.html">
			<div class="card mb-0">
				<div class="tab-content card-body">
					<div class="tab-pane fade show active" id="login-tab1">
						<div class="text-center mb-3">			
							<img src="${pageContext.request.contextPath}/images/surfinn_logo.png" alt="" style="height: 70px;">
						</div>
						
						<div class="text-center mb-3">			
							<span class="d-block text-muted"><spring:message code='login.title'/></span>
						</div>
						
						<div
							class="form-group form-group-feedback form-group-feedback-left">
							<input type="text" value="${ usrId }" class="form-control" name="loginId" id="id" placeholder='<spring:message code="login.placeholderId"/>'>							<div class="form-control-feedback">
								<i class="icon-user text-muted"></i>
							</div>
						</div>

						<div
							class="form-group form-group-feedback form-group-feedback-left">
							<input type="password" class="form-control" name="pwd" id="password" placeholder='<spring:message code="login.placeholderPw"/>'>
							<div class="form-control-feedback">
								<i class="icon-lock2 text-muted"></i>
							</div>
						</div>

						<div class="form-check">
							<div class="uniform-checker">
								<span id="rememberIdCheck" class="checked" onclick="checkUse();">
									<input type="checkbox" class="form-check-input-styled">
								</span>
							</div>
								<spring:message code='login.rememberId'/>
						</div>
						<br>
						<div class="form-group">
							<button type="button" id="login_btn" class="btn btn-primary btn-block" onclick="loginConfirm();"><spring:message code='login.button'/></button>
						</div>
						
						
					<%-- 
						<div class="form-group text-center text-muted content-divider">
							<span class="px-2">아직 회원이 아니신가요?</span>
						</div>

						<div class="form-group">
							<a href="${pageContext.request.contextPath}/signup" class="btn btn-light btn-block">회원 가입</a>
						</div> 
					--%>
						
						
						<div class="alert text-white alert-styled-left alert-dismissible" id="alert">
					        <span class="font-weight-semibold" id="alertTitle">Well done!</span><br><span id="alertMessage">You successfully read alert message.</span>
					    </div>
						
					</div>
				</div>
			</div>
		</form>
		<!-- /login form -->

		</div>
	</div>
</body>
<%@ include file="/WEB-INF/jsp/common/script.jsp"%>
</html>