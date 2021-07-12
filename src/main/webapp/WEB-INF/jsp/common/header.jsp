<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>  
<%@ include file="/WEB-INF/jsp/common/taglib.jsp" %>    
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<style>
	.hamburger-inner,.hamburger-inner:after,.hamburger-inner:before{
		background-color: #512da8!important;
	}
</style>



<script type="text/javascript">
	function home(){
		$(".dt-side-nav__item.open").children("ul").css("display","none");
		$(".dt-side-nav__item.open").attr("class","dt-side-nav__item");
		$(".dt-side-nav__text.menuBold").attr("class","dt-side-nav__text");
		$($(".dt-side-nav__item")[1]).attr("class","dt-side-nav__item open");
		$($(".dt-side-nav__text")[2]).attr("class","dt-side-nav__text bold menuBold");
		$($(".dt-side-nav__sub-menu")[0]).css("display","block");
		changeMenu('${pageContext.request.contextPath}/domain/info',$("#home"));
	}
</script>

	<header class="dt-header" style="background-color: #d8d8d8!important;">
	
	    <!-- Header container -->
	    
	    <div class="dt-header__container">
	
	        <!-- Brand -->
	        
	        <div class="dt-brand" style="background-color: #d8d8d8!important;">
	
	            <!-- Brand tool -->
	            
	            <div class="dt-brand__tool" data-toggle="main-sidebar">
	                <div class="hamburger-inner"></div>
	            </div>
	            
	            <!-- /brand tool -->
	
	            <!-- Brand logo -->
	            
	            <span class="dt-brand__logo">
	    			<a class="dt-brand__logo-link" href="javascript:home();">
	      				<!-- <img class="dt-brand__logo-img d-none d-sm-inline-block" src="./assets/images/icon/kbn_logo.png" alt="Drift"> -->
	      				<img class="dt-brand__logo-symbol" src="./assets/images/icon/logo-5.png" alt="Drift" style= "width: 180px">
	    			</a>
	  			</span>
	  			
	            <!-- /brand logo -->
	
	        </div>
	        <!-- /brand -->
	
	        <!-- Header toolbar-->
	        <div class="dt-header__toolbar">
	
	            <!-- Header Menu Wrapper -->
	            <div class="dt-nav-wrapper">
	                <!-- Header Menu -->
	                <ul class="dt-nav d-lg-none">

	                </ul>
	                <!-- /header menu -->
	
	                <!-- Header Menu -->
	                <ul class="dt-nav">
	                    <li class="dt-nav__item dropdown">
	
	                        <!-- Dropdown Link -->
	                        <a href="#" class="dt-nav__link dropdown-toggle no-arrow dt-avatar-wrapper"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="color: black!important;">
	                            <i class="icon icon-wall icon-fw icon-lg"></i>
	                            <span class="dt-avatar-info d-none d-sm-block">
	        <span class="dt-avatar-name">${SessionVO.loginId}</span>
	      </span> </a>
	                        <!-- /dropdown link -->
	
	                        <!-- Dropdown Option -->
	                        <div class="dropdown-menu dropdown-menu-right">
	                            <div class="dt-avatar-wrapper flex-nowrap p-6 mt-n2 bg-gradient-purple text-white rounded-top">
	                                <i class="icon icon-wall icon-fw icon-lg"></i>
	                                <span class="dt-avatar-info">
	          <span class="dt-avatar-name">${SessionVO.loginId}</span>
	          <span class="f-12">Administrator</span>
	        </span>
	                            </div>
<!-- 	                            <a class="dropdown-item a_open_my_page" href="javascript:void(0)" onclick="getMyPageInfo();" data-toggle="modal" data-target="#my_page_modal"> 
	                            	<i class="icon icon-user icon-fw mr-2 mr-sm-1" ></i>my Page
	                            </a>  -->
	                            <!-- <a class="dropdown-item" href="javascript:void(0)">
	                            <i class="icon icon-settings icon-fw mr-2 mr-sm-1"></i>Setting 
	                            </a> -->
	                            <a class="dropdown-item" href="javascript:void(0)" onclick="document.location.href='${pageContext.request.contextPath}/logout';"> 
	                            	<i class="icon icon-editors icon-fw mr-2 mr-sm-1"></i>Logout
	                            </a>
	                        </div>
	                        <!-- /dropdown option -->
	
	                    </li>
	                </ul>
	                <!-- /header menu -->
	            </div>
	            <!-- Header Menu Wrapper -->
	
	        </div>
	        <!-- /header toolbar -->
	
	    </div>
	    <!-- /header container -->
	
	</header>
	
	<body>
	<%@ include file="/WEB-INF/jsp/myPage/myPage.jsp" %>
	</body>

	