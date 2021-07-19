<%--
  Created by IntelliJ IDEA.
  User: june
  Date: 2021/03/23
  Time: 11:14 오전
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/jsp/common/taglib.jsp" %>
<%@ include file="/WEB-INF/jsp/common/templateCss.jsp"%>

<style>
.navbar-brand img {
	height: 37px;
	display: block;
}

</style>

<!-- Main navbar -->
<div class="navbar navbar-expand-md navbar-dark">
    <div class="navbar-brand" style="margin-top: -10px;margin-bottom: -10px;">
        <a href="${pageContext.request.contextPath}/openGlzza" class="">
            <img src="${pageContext.request.contextPath}/images/surfinn_logo.png" alt="" style="height: 45px;">
        </a>
    </div>

    <div class="d-md-none">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-mobile">
            <i class="icon-tree5"></i>
        </button>
        <button class="navbar-toggler sidebar-mobile-main-toggle" type="button">
            <i class="icon-paragraph-justify3"></i>
        </button>
    </div>

    <div class="collapse navbar-collapse" id="navbar-mobile">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a href="#" class="navbar-nav-link sidebar-control sidebar-main-toggle d-none d-md-block">
                    <i class="icon-paragraph-justify3"></i>
                </a>
            </li>
        </ul>

        <ul class="navbar-nav ml-auto">
			
            <li class="nav-item">
                <div class="navbar-nav-link">
                    <span>${SessionVO.userId}</span>
                </div>
            </li>
            <li class="nav-item">
                 <a href="javascript:void(0)" class="navbar-nav-link d-flex align-items-center" onclick="document.location.href='${pageContext.request.contextPath}/logout';">Logout</a>
            </li>
        </ul>
    </div>
</div>
<!-- /main navbar -->
