<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/common/taglib.jsp"%>
<%@ include file="/WEB-INF/jsp/common/templateCss.jsp"%>

<html>
<head>
<script>
    var contextPath = "${pageContext.request.contextPath}";
</script>
<script src="${pageContext.request.contextPath}/js/table/inputPage.js"></script>
<script src="${pageContext.request.contextPath}/js/table/pageListBox.js"></script>
<script src="${pageContext.request.contextPath}/js/table/dataTable.js"></script>
<script src="${pageContext.request.contextPath}/js/code/domainCode.js"></script>
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

#domainCodeTable tbody tr {
	cursor: pointer;
}

table.modalTable > thead {
    font-size: 12px;
    background-color: gainsboro;;
}

.table-bordered-0 {
	table-layout: fixed;
}

td{
	text-overflow: ellipsis;
	overflow-x: hidden;
}

#domainCodeTable tr:hover{
	background: lightgrey;
}

#cancelButton{
	background: darkgray;
}

.card {
	float: left;
	width: 100%;
	height: 820px;
}
</style>
</head>

	<!-- Table area Start-->
	<div class="content-wrapper">
		<div class="content">
			<div class="card">
				<div class="card-header header-elements-inline font-size-base">
					<h5 class="card-title font-size-lg"><strong>도메인 코드 목록</strong></h5>
					<div class="header-elements">
						<div class="list-icons">
							<a class="list-icons-item" data-action="reload" onclick="resetSearch();"></a>
						</div>
					</div>
				</div>

				<div class="form-group row font-size-xs" style="margin-left: 10px;">
					<select class="form-control font-size-xs" aria-hidden="true" style="width: 150px; margin-left: 10px;" name="searchType" id="searchType">
						<option value="all">전체</option>
					</select>
					<div class="col-lg-1" style="margin-left: -5px;">
						<div class="input-group" style="width: 400px;">
							<input type="text" class="form-control border-right-0 font-size-xs" placeholder="" name="keyword" id="keyword">
							<span class="input-group-append">
										<button class="btn border font-size-xs" type="button" onclick="searchDomainCode();" id="searchButton"><i class="icon-search4"></i></button>
									</span>
						</div>
					</div>
					<button class="btn btn-outline bg-slate-600 text-slate-600 border-slate-600 font-size-xs" type="button" data-toggle="modal" data-target="#modal" id="newButton" onclick="openModal('add');" style="margin-left: auto; margin-right: 30px;">신규 등록</button>
					<!--  -->
				</div>

				<table class="table-bordered-0 table-sm datatable-pagination table-striped table-hover" id="domainCodeTable" style="font-size: 12px">
					<thead>
						<tr style="background-color: #4DB6AC; color: white">
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
						</tr>
					</thead>
				</table>
			</div>
		</div>
	</div>
	<!-- Table area End-->

	<!-- Alert 메세지 창 -->
	<div class="alert text-white alert-styled-left alert-dismissible" id="alert">
        <span class="font-weight-semibold" id="alertTitle">Well done!</span><br><span id="alertMessage">You successfully read alert message.</span>
    </div>
    
    <!-- Modal Start -->
	<div id="modal" class="modal fade" tabindex="-1" style="display: none;" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h3 class="modal-title"><strong>도메인 코드 등록</strong></h3>
					<button type="button" class="close" data-dismiss="modal" style="color: black">×</button>
				</div>

				<form action="#" class="form-horizontal" id="insert_form">
					<input type="hidden" id="cdSeq" name="cdSeq" value = "">
					<div class="modal-body">
						<div class="form-group">
							<div class="row">
								<div class="col-sm-6">
									<label>데이터 타입명 <text class="text-danger">*</text></label>
									<input type="text" name="cdNm" id="cdNm" placeholder="" class="form-control autoCreate">
								</div>
								<div class="col-sm-6">
									<label>데이터 베이스 유형 <text class="text-danger">*</text></label>
									<select class="form-control autoCreate" aria-hidden="true" name="dbCd" id="dbCd">
										<option value="" selected="selected">데이터 베이스 유형을 선택하세요.</option>
										<option value="MYSQL">MYSQL</option>
										<option value="ORACLE">ORACLE</option>
									</select>
								</div>
							</div>
						</div>
						
						<div class="form-group">
							<div class="row">
								<div class="col-sm-6">
									<label>데이터 길이 사용 유무 <text class="text-danger">*</text></label>
									<select class="form-control autoCreate" aria-hidden="true" name="dataLenYn" id="dataLenYn">
										<option value="" selected="selected">데이터 길이 사용 유무를 선택하세요.</option>
										<option value="Y">사용</option>
										<option value="N">사용 안함</option>
									</select>
								</div>
								<div class="col-sm-6">
									<label>소수점 길이 사용 유무 <text class="text-danger" id="dataLenYnStar">*</text></label>
									<select class="form-control autoCreate" aria-hidden="true" name="dcmlLenYn" id="dcmlLenYn" disabled="disabled">
										<option value="" selected="selected">소수점 길이 사용 유무를 선택하세요.</option>
										<option value="Y">사용</option>
										<option value="N">사용 안함</option>
									</select>
								</div>
							</div>
						</div>

						<div class="form-group row">
								<div class="col-sm-12">
									<label>설명</label>
									<textarea rows="4" cols="4" name="cdDscrpt" id="cdDscrpt" class="form-control" style="resize: none;"></textarea>
								</div>
						</div>
					</div>
				</form>
					<div class="modal-footer">
						<button type="button" id="saveButton" class="btn bg-teal" onclick="saveConfirm();">저장버튼</button>
						<button type="button" id="deleteButton" class="btn btn-danger" onclick="deleteConfirm();">삭제</button>
						<button type="button" id="cancelButton" class="btn btn-outline" data-dismiss="modal">닫기</button>
					</div>
			</div>
		</div>
	</div>
	<!-- Modal End -->



<!-- /main content -->
