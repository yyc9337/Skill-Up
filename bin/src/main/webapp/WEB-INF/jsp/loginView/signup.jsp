<%@ page language="java" contentType="text/html; charset=UTF-8"
        pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/common/taglib.jsp"%>
<%@ include file="/WEB-INF/jsp/common/templateCss.jsp"%>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>GLZZA</title>
    <script>
        var contextPath = "${pageContext.request.contextPath}";
    </script>
    <script src="${pageContext.request.contextPath}/js/login/signup.js"></script>
    <!-- /theme JS files -->
    <link rel="shortcut icon" href="${pageContext.request.contextPath}/assets/images/icon/favicon.ico" type="image/x-icon">
</head>

<body>

<!-- Main navbar -->
<div class="navbar navbar-expand-md navbar-dark">
    <div class="navbar-brand">

    </div>

    <div class="d-md-none">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-mobile">
            <i class="icon-tree5"></i>
        </button>
    </div>

    <div class="collapse navbar-collapse" id="navbar-mobile">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
                <a href="${pageContext.request.contextPath}/login" class="navbar-nav-link">
                    <i class="icon-arrow-left7"></i>
                </a>
            </li>
        </ul>
    </div>
</div>
<!-- /main navbar -->


<!-- Page content -->
<div class="page-content">

    <!-- Main content -->
    <div class="content-wrapper">

        <!-- Content area -->
        <div class="content d-flex justify-content-center align-items-center">

            <!-- Registration form -->
            <form class="login-form" id="regist_form" onsubmit="return false;">
                <div class="card mb-0">
                    <div class="card-body">
                        <div class="text-center mb-3">
                            <i class="icon-piggy-bank icon-2x text-success border-success border-3 rounded-round p-3 mb-3 mt-1"></i>
                            <h5 class="mb-0">Create User Account</h5>
                            <span class="d-block text-muted">모든 입력 항목은 필수 입니다.</span>
                        </div>

                        <div class="form-group text-center text-muted content-divider">
                            <span class="px-2">Term Management System</span>
                        </div>

                        <div class="form-group form-group-feedback form-group-feedback-left">
                            <input type="text" class="form-control" name="userId" placeholder="아이디">
                            <div class="form-control-feedback">
                                <i class="icon-user text-muted"></i>
                            </div>
                        </div>

                        <div class="form-group form-group-feedback form-group-feedback-left">
                            <input type="password" class="form-control" name="userPwd" placeholder="비밀번호 (최대 12자)" maxlength="12">
                            <div class="form-control-feedback">
                                <i class="icon-user-lock text-muted"></i>
                            </div>                           
                        </div>

                        <div class="form-group form-group-feedback form-group-feedback-left">
                            <input type="password" class="form-control" name="pwdRepeat" placeholder="비밀번호 재입력" maxlength="12">
                            <div class="form-control-feedback">
                                <i class="icon-user-lock text-muted"></i>
                            </div>
                            <span style="display:none;" class="form-text text-danger"><i class="icon-cancel-circle2 mr-2"></i><span  id="passwordRepeatSpan">비밀번호가 일치하지 않습니다.</span></span>
                        </div>


                        <div class="form-group form-group-feedback form-group-feedback-left">
                            <input type="text" class="form-control" name="userNm" placeholder="이름">
                            <div class="form-control-feedback">
                                <i class="icon-user text-muted"></i>
                            </div>
                        </div>
                        <button type="submit" onclick="signupConfirm();" class="btn bg-teal-400 btn-block">Register <i class="icon-circle-right2 ml-2"></i></button>
                    </div>
                </div>
            </form>
            <!-- /registration form -->

        </div>
        <!-- /content area -->


        <!-- Footer -->
        <div class="navbar navbar-expand-lg navbar-light">
            <div class="text-center d-lg-none w-100">
                <button type="button" class="navbar-toggler dropdown-toggle" data-toggle="collapse" data-target="#navbar-footer">
                    <i class="icon-unfold mr-2"></i>
                    Footer
                </button>
            </div>

            <div class="navbar-collapse collapse" id="navbar-footer">
					<span class="navbar-text">
						 &copy;&nbsp;Term Management System by Innerwave Corporation
					</span>

<%--                <ul class="navbar-nav ml-lg-auto">--%>
<%--                    <li class="nav-item"><a href="https://kopyov.ticksy.com/" class="navbar-nav-link" target="_blank"><i class="icon-lifebuoy mr-2"></i> Support</a></li>--%>
<%--                    <li class="nav-item"><a href="http://demo.interface.club/limitless/docs/" class="navbar-nav-link" target="_blank"><i class="icon-file-text2 mr-2"></i> Docs</a></li>--%>
<%--                    <li class="nav-item"><a href="https://themeforest.net/item/limitless-responsive-web-application-kit/13080328?ref=kopyov" class="navbar-nav-link font-weight-semibold"><span class="text-pink-400"><i class="icon-cart2 mr-2"></i> Purchase</span></a></li>--%>
<%--                </ul>--%>
            </div>
        </div>
        <!-- /footer -->

    </div>
    <!-- /main content -->
    <div class="alert text-white alert-styled-left alert-dismissible" id="alert">
        <span class="font-weight-semibold" id="alertTitle">Well done!</span><br><span id="alertMessage">You successfully read alert message.</span>
    </div>

    <style>
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
    </style>
</div>
<!-- /page content -->

</body>
</html>
