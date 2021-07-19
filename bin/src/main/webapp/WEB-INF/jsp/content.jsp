<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/common/taglib.jsp" %>
<%--<%@ include file="/WEB-INF/jsp/common/templateCss.jsp" %>--%>
<html>
<!-- Global stylesheets -->
<link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700,900" rel="stylesheet" type="text/css">
<link href="${pageContext.request.contextPath}/template/global_assets/css/icons/icomoon/styles.min.css" rel="stylesheet" type="text/css">
<link href="${pageContext.request.contextPath}/template/assets/css/bootstrap.min.css" rel="stylesheet" type="text/css">
<link href="${pageContext.request.contextPath}/template/assets/css/bootstrap_limitless.min.css" rel="stylesheet" type="text/css">
<link href="${pageContext.request.contextPath}/template/assets/css/layout.min.css" rel="stylesheet" type="text/css">
<link href="${pageContext.request.contextPath}/template/assets/css/components.min.css" rel="stylesheet" type="text/css">
<link href="${pageContext.request.contextPath}/template/assets/css/colors.min.css" rel="stylesheet" type="text/css">
<!-- /global stylesheets -->

<!-- Core JS files -->
<script src="${pageContext.request.contextPath}/template/global_assets/js/main/jquery.min.js"></script>
<script src="${pageContext.request.contextPath}/template/global_assets/js/main/bootstrap.bundle.min.js"></script>
<script src="${pageContext.request.contextPath}/template/global_assets/js/plugins/loaders/blockui.min.js"></script>
<!-- /core JS files -->

<!-- Theme JS files -->
<script src="${pageContext.request.contextPath}/template/assets/js/app.js"></script>
<!-- /theme JS files -->
<head>
	<title>GLZZA</title>
	<link rel="shortcut icon" href="${pageContext.request.contextPath}/assets/images/icon/favicon.ico" type="image/x-icon">
</head>
<body class="">
	<div class="d-flex flex-column flex-1 layout-boxed">
		<c:import url="/WEB-INF/jsp/common/templateHeader.jsp" />

		<c:set var="firstUrl" value="${pageContext.request.contextPath}/domain/info" />
		<!-- Page content -->
		<div class="page-content">
			<c:import url="/WEB-INF/jsp/common/templateSidebar.jsp" />
			<iframe name="contentMain" id="contentMain" src="${firstUrl}" width="100%" frameborder="0"></iframe>
		</div>
		<!-- /page content -->
	</div>
</body>
</html>