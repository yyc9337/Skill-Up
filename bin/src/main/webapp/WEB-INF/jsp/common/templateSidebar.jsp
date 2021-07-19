<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/jsp/common/taglib.jsp" %>
<%@ include file="/WEB-INF/jsp/common/templateCss.jsp"%>
<!-- Main sidebar -->
<div class="sidebar sidebar-dark sidebar-main sidebar-expand-md">
    <script>
   		var contextPath = "${pageContext.request.contextPath}";
    </script>
    <script src="${pageContext.request.contextPath}/js/common/templateSidebar.js"></script>
    <!-- Sidebar mobile toggler -->
    <div class="sidebar-mobile-toggler text-center">
        <a href="#" class="sidebar-mobile-main-toggle">
            <i class="icon-arrow-left8"></i>
        </a>
        Navigation
        <a href="#" class="sidebar-mobile-expand">
            <i class="icon-screen-full"></i>
            <i class="icon-screen-normal"></i>
        </a>
    </div>
    <!-- /sidebar mobile toggler -->
    <!-- Sidebar content -->
    <div class="sidebar-content">
        <!-- User menu -->
        <!-- /user menu -->
        <!-- Main navigation -->
        <div class="card card-sidebar-mobile">
            <ul class="nav nav-sidebar" data-nav-type="accordion">
                <!-- Main -->
                <li class="nav-item-header">
                <div class="text-uppercase font-size-xs line-height-xs">
                	SURFINN - GLZZA
                </div> <i class="icon-menu" title="Main"></i>
                </li>
                <li class="nav-item nav-item-submenu nav-item-open">
                    <a href="#" class="nav-link"><i class="icon-copy"></i><span class='first'><spring:message code="common.menu1"/></span></a>
                    <ul class="nav nav-group-sub" data-submenu-title="Term Management" id="block-page1" style="display: block;">                    
                    </ul>
				</li>
 				<%-- <li class="nav-item nav-item-submenu">
                    <a href="#" class="nav-link"><i class="icon-copy"></i><span class='first'>코드 관리</span></a>
                    <ul class="nav nav-group-sub" data-submenu-title="Data Management" id="block-page">
                        <li class="nav-item"><a href="#" id="defaultConnect" onclick="changeMenu('${pageContext.request.contextPath}/code/domainCodeinfo',this)" class="nav-link second"><i class="icon-price-tag2"></i>도메인 코드</a></li>                     
                    </ul>
				</li> --%>

                <!-- /main -->
            </ul>
        </div>
        <!-- /main navigation -->
    </div>
    <!-- /sidebar content -->
<!-- /main sidebar -->
</div>
