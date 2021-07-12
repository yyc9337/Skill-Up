<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/common/taglib.jsp"%>
<%@ include file="/WEB-INF/jsp/common/templateCss.jsp"%>
<html>
<head>
<script>
    var contextPath = "${pageContext.request.contextPath}";
</script>
<script>
/*COMMON*/
	var contextPath = "${pageContext.request.contextPath}";
	var modalYes = "<spring:message code='common.modalYes'/>";
	var modalNo = "<spring:message code='common.modalNo'/>";
	var warning = "<spring:message code='common.warning'/>";
	var succ = "<spring:message code='common.succ'/>";
	var danger = "<spring:message code='common.danger'/>";
	var totalDataCount = "<spring:message code='common.totalDataCount'/>";
</script>
<script src="${pageContext.request.contextPath}/js/table/inputPage.js"></script>
<script src="${pageContext.request.contextPath}/js/table/pageListBox.js"></script>
<script src="${pageContext.request.contextPath}/js/table/dataTable.js"></script>
<script src="${pageContext.request.contextPath}/js/term/term.js"></script>
<!-- Main content -->

<style>

.paginate_input {
	text-align: center;
	width: 70px;
	display: inline;
    padding: .4375rem .875rem;
    font-size: .8125rem;
    font-weight: 400;
    line-height: 1.5385;
    color: #333;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ddd;
    border-radius: .1875rem;
    box-shadow: 0 0 0 0 transparent;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
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

#termTable tbody tr {
	cursor: pointer;
}

#ternTypeTable tr {
	width: 1000px;
}

.table-bordered-0 {
	table-layout: fixed;
}

td{
	text-overflow: ellipsis;
	overflow-x: hidden;
}

#termTable tr:hover{
	background: lightgrey;
}

#modalCancelButton{
	background: lightgrey;
}

.card {
	float: left;
	width: 100%;
	height: 816px;
}
</style>
</head>

<body>
<div class="content-wrapper">
	<!-- Table area Start-->
	<div class="content">
		<div class="card">
			<div class="card-header header-elements-inline font-size-base">
				<h5 class="card-title font-size-lg"><strong>용어 목록</strong></h5>
				<div class="header-elements">
					<div class="list-icons">
						<a class="list-icons-item" data-action="reload" onclick="resetSearch();"></a>
						<!-- <a class="list-icons-item" data-action="collapse"></a> --> 
						<!-- <a class="list-icons-item" data-action="reload"></a> -->
					</div>
				</div>
			</div>
			
			<form id="search_form" onsubmit="return false;">
			<div class="form-group row font-size-xs" style="margin-left: 10px;">
					<select class="form-control font-size-xs" aria-hidden="true" style="width: 150px; margin-left: 10px;" name="searchType" id="searchType">
						<option value="all">전체</option>
					</select>
					<div class="col-lg-9">
						<div class="input-group" style="width: 400px;">
							<input type="text" class="form-control border-right-0 font-size-xs" placeholder="" name="keyword" id="keyword">
							<span class="input-group-append">
								<button class="btn border font-size-xs" type="button" onclick="searchTerm();" id="searchButton"><i class="icon-search4"></i></button>
							</span>
						</div>
					</div>
					<button class="btn btn-outline bg-slate-600 text-slate-600 border-slate-600 font-size-xs" type="button" id="excelDown" onclick="excelDownload_doc();" style="margin-left: auto; margin-right: 5px;"><spring:message code="common.excelButton"/></button>
					<button class="btn btn-outline bg-slate-600 text-slate-600 border-slate-600 font-size-xs" type="button" id="exerdDown" onclick="excelDownload_exerd();" style="margin-right: 5px;"><spring:message code="common.exerdButton"/></button>
					<button class="btn btn-outline bg-slate-600 text-slate-600 border-slate-600 font-size-xs" type="button" onclick="modalOn();" id="insertButton" style="margin-right:30px;">신규 등록</button>
					<!--  -->
			</div>
			</form>
				
				
				

			<table class="table-bordered-0 table-sm datatable-pagination table-striped table-hover" id="termTable" style="width:100%; font-size: 12px">
				<thead>
					<tr style="background-color: #4DB6AC; color: white">
						<th>ID</th>
						<th>용어명</th>
						<th>용어 영문 약어명</th>
						<th>도메인명</th>
						<th>용어 설명</th>
						<th>UPDDT</th>
					</tr>
				</thead>
			</table>
		</div>
	</div>
	<!-- Table area End-->
	
	<!-- Alert 메세지 창 -->
	<div class="alert text-white alert-styled-left alert-dismissible" id="alert">
        <span class="font-weight-semibold" id="alertTitle">Well done!</span><br><span id="alertMessage">You successfully read alert message.</span>
    </div>
    
    <!-- Modal Start -->
	<div id="modal_form_horizontal" class="modal fade" tabindex="-1" style="display: none;" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h3 class="modal-title"><strong id="modalTitle">용어 신규 등록</strong></h3>
					<button type="button" class="close" data-dismiss="modal" style="color: black">×</button>
				</div>
				<form action="#" class="form-horizontal" id="insert_form">
					<div class="modal-body">
						<div class="form-group row" id="compositionDiv">
							<div class="col-12">
								<label>구성 단어명 선택 <text class="text-danger">*</text></label>
								<select data-placeholder="Select a State..." id="wordSelectTag" multiple="multiple" class="form-control select" data-fouc>
									<optgroup label="Preview" id="previewTag">

									</optgroup>
								</select>
							</div>
<%--							<div class="col-1">--%>
<%--								<div class="input-group">--%>
<%--									<div class="input-group-append">--%>
<%--										<button type="button" class="btn bg-teal" onclick="TermNameAutoCreate();" style="margin-top: 28px;">확인</button>--%>
<%--									</div>--%>
<%--								</div>--%>
<%--							</div>--%>
						</div>
						<div class="form-group row">
								<div class="col-sm-6">
									<label>용어명</label>
									<input type="text" name="termNm" id="termNm" placeholder="" class="form-control">
								</div>
								<div class="col-sm-6">
									<label>용어영문약어명</label>
									<input type="text" name="termAbbr" id="termAbbr" placeholder="" class="form-control">
								</div>
						</div>
						<div class="form-group">
							<div class="row">
								<div class="col-sm-12">
									<label>도메인명 <text class="text-danger">*</text></label>
									<select class="form-control" aria-hidden="true" name="domainSeq" id="domainSeq">
										<option value="nonSelected" selected>도메인 선택</option>
									</select>
									<span style="margin-left:6px;" class="form-text text-muted" id="domainDetail"></span>
								</div>
							</div>
						</div>
						<div class="form-group row">
								<div class="col-sm-12">
									<label>용어 설명</label>
									<textarea rows="2" cols="4" name="termDscrpt" id="termDscrpt" placeholder="" class="form-control" style="resize: none;"></textarea>
								</div>
						</div>
					</div>
				</form>
					<div class="modal-footer">
						<button type="button" class="btn bg-teal" id="modalUpdateButton" onclick="updateTerm();">수정</button>
						<button type="button" class="btn bg-teal" id="modalConfirmButton" onclick="saveConfirm();">저장</button>
						<button type="button" class="btn btn-outline" id="modalCancelButton" onclick="modalOff();">닫기</button>
					</div>
			</div>
		</div>
	</div>   
	<!-- Modal Start -->
</div>
</body>

<!-- /main content -->