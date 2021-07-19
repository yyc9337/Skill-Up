<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/common/taglib.jsp"%>
<%@ include file="/WEB-INF/jsp/common/templateCss.jsp"%>

<html>
<head>
<script>
    /*COMMON*/
    var contextPath = "${pageContext.request.contextPath}";
    var modalYes = "<spring:message code='common.modalYes'/>";
    var modalNo = "<spring:message code='common.modalNo'/>";
    var warning = "<spring:message code='common.warning'/>";
    var succ = "<spring:message code='common.succ'/>";
    var danger = "<spring:message code='common.danger'/>";
    var totalDataCount = "<spring:message code='common.totalDataCount'/>";

    /*DOMAIN*/
    var modalRegistHeader = "<spring:message code='domain.modalRegistHeader'/>";
    var modalUpdateHeader = "<spring:message code='domain.modalUpdateHeader'/>";
    var modalDeleteHeader = "<spring:message code='domain.modalDeleteHeader'/>";
    var registConfirmMessage = "<spring:message code='domain.registConfirmMessage'/>";
    var registDupConfirmMessage = "<spring:message code='domain.registDupConfirmMessage'/>";
    var updateConfirmMessage = "<spring:message code='domain.updateConfirmMessage'/>";
    var deleteConfirmMessage = "<spring:message code='domain.deleteConfirmMessage'/>";
    var warningNoKeywordMessage = "<spring:message code='domain.warningNoKeywordMessage'/>";
    var warningNoDomainTypeName = "<spring:message code='domain.warningNoDomainTypeName'/>";
    var warningNoDomainName = "<spring:message code='domain.warningNoDomainName'/>";
    var warningNoDataType = "<spring:message code='domain.warningNoDataType'/>";
    var warningNoDataLength = "<spring:message code='domain.warningNoDataLength'/>";
    var warningNoDecimalLength = "<spring:message code='domain.warningNoDecimalLength'/>";
    var warningNoDataDecimal = "<spring:message code='domain.warningNoDataDecimal'/>";
    var warningExistDomainName = "<spring:message code='domain.warningExistDomainName'/>";
    var succInsertDomain = "<spring:message code='domain.succInsertDomain'/>";
    var succUpdateDomain = "<spring:message code='domain.succUpdateDomain'/>";
    var succDeleteDomain = "<spring:message code='domain.succDeleteDomain'/>";
    var dangerInsertDomain = "<spring:message code='domain.dangerInsertDomain'/>";
    var dangerUpdateDomain = "<spring:message code='domain.dangerUpdateDomain'/>";
    var dangerDeleteDomain = "<spring:message code='domain.dangerDeleteDomain'/>";
    var domainNameLang = "<spring:message code='domain.domainName'/>";
    var domainTypeNameLang = "<spring:message code='domain.domainTypeName'/>";
    var dataTypeLang = "<spring:message code='domain.dataType'/>";
    var dataLengthLang = "<spring:message code='domain.dataLength'/>";
    var decimalLengthLang = "<spring:message code='domain.decimalLength'/>";
    var domainDescriptionLang = "<spring:message code='domain.domainDescription'/>";
</script>
<script src="${pageContext.request.contextPath}/js/table/inputPage.js"></script>
<script src="${pageContext.request.contextPath}/js/table/pageListBox.js"></script>
<script src="${pageContext.request.contextPath}/js/table/dataTable.js"></script>
<script src="${pageContext.request.contextPath}/js/domain/domain.js"></script>
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

#domainTable tbody tr {
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

#domainTable tr:hover{
	background: lightgrey;
}

#cancelButton{
	background: darkgray;
}

.card {
	float: left;
	width: 100%;
	height: 816px;
}
</style>
</head>

	<!-- Table area Start-->
	<div class="content-wrapper">
		<div class="content">
			<div class="card">
				<div class="card-header header-elements-inline font-size-base">
					<h5 class="card-title font-size-lg"><strong><spring:message code="domain.list"/></strong></h5>
					<div class="header-elements">
						<div class="list-icons">
							<a class="list-icons-item" data-action="reload" onclick="resetSearch();"></a>
						</div>
					</div>
				</div>

				<form id="search_form" onsubmit="return false">
				<div class="form-group row font-size-xs" style="margin-left: 10px;">
					<select class="form-control font-size-xs" aria-hidden="true" style="width: 150px; margin-left: 10px;" name="searchType" id="searchType">
						<option value="all"><spring:message code="domain.searchTypeAll"/></option>
					</select>
					<div class="col-lg-9">
						<div class="input-group" style="width: 400px;">
							<input type="text" class="form-control border-right-0 font-size-xs" placeholder="" name="keyword" id="keyword">
							<span class="input-group-append">
								<button class="btn border font-size-xs" type="button" onclick="searchDomain();" id="searchButton"><i class="icon-search4"></i></button>
							</span>
						</div>
					</div>
					<button class="btn btn-outline bg-slate-600 text-slate-600 border-slate-600 font-size-xs" type="button" id="excelDown" onclick="excelDownload_doc();" style="margin-left: auto; margin-right: 5px;"><spring:message code="common.excelButton"/></button>
					<button class="btn btn-outline bg-slate-600 text-slate-600 border-slate-600 font-size-xs" type="button" id="exerdDown" onclick="excelDownload_exerd();" style="margin-right: 5px;"><spring:message code="common.exerdButton"/></button>
					<button class="btn btn-outline bg-slate-600 text-slate-600 border-slate-600 font-size-xs" type="button" data-toggle="modal" data-target="#modal" id="newButton" onclick="openModal('add');" style="margin-right: 30px;"><spring:message code="common.newInsert"/></button>
					<button class="btn btn-outline bg-slate-600 text-slate-600 border-slate-600 font-size-xs" type="button" id="revivalButton" onclick="Delete_History();" style="margin-right: 30px;"><spring:message code="common.history"/></button>
					<!--  -->
				</div>
				</form>

				<table class="table-bordered-0 table-sm datatable-pagination table-striped table-hover" id="domainTable" style="font-size: 12px">
					<thead>
						<tr style="background-color: #4DB6AC; color: white">
							<th>ID</th>
							<th><spring:message code="domain.domainName"/></th>
							<th><spring:message code="domain.domainTypeName"/></th>
							<th><spring:message code="domain.dataType"/></th>
							<th><spring:message code="domain.dataLength"/></th>
							<th><spring:message code="domain.decimalLength"/></th>
							<th><spring:message code="domain.domainDescription"/></th>
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
					<h3 class="modal-title"><strong><spring:message code="domain.modalRegistHeader"/></strong></h3>
					<button type="button" class="close" data-dismiss="modal" style="color: black">×</button>
				</div>

				<form action="#" class="form-horizontal" id="insert_form">
					<input type="hidden" id="domainSeq" name="domainSeq" value = "">
					<div class="modal-body">
						<div class="form-group">
							<div class="row">
								<div class="col-sm-6">
									<label><spring:message code="domain.domainTypeName"/> <text class="text-danger">*</text></label>
									<input type="text" name="domainTypeNm" id="domainTypeNm" placeholder="" class="form-control autoCreate">
								</div>
								<div class="col-sm-6">
									<label><spring:message code="domain.dataType"/> <text class="text-danger">*</text></label>
									<select class="form-control autoCreate" aria-hidden="true" name="dataType" id="dataType">
										<option value="" selected="selected"><spring:message code="common.dataTypeSelect"/></option>
									</select>
								</div>
							</div>
						</div>

						<div class="form-group">
							<div class="row">
								<div class="col-sm-6">
									<label><spring:message code="domain.dataLength"/> <text class="text-danger" id="dataLenStar">*</text></label>
									<input type="number" name="dataLen" id="dataLen" placeholder="" class="form-control autoCreate onlyNumber" readonly="readonly">
								</div>
								<div class="col-sm-6">
									<label><spring:message code="domain.decimalLength"/> <text class="text-danger" id="dcmlLenStar">*</text></label>
									<input type="number" onkeypress="return onlyNumber(event)" onkeyup="removeChar(event);" name="dcmlLen" id="dcmlLen" placeholder="" class="form-control autoCreate" readonly="readonly">
								</div>
							</div>
						</div>

						<div class="form-group row">
								<div class="col-sm-12">
									<label><spring:message code="domain.domainName"/></label>
									<input type="text" name="domainNm" id="domainNm" placeholder="" class="form-control" readonly="readonly">
								</div>
						</div>
						<div class="form-group row">
								<div class="col-sm-12">
									<label><spring:message code="domain.domainDescription"/></label>
									<textarea rows="4" cols="4" name="domainDscrpt" id="domainDscrpt" class="form-control" style="resize: none;"></textarea>
								</div>
						</div>
					</div>
				</form>
					<div class="modal-footer">
						<button type="button" id="saveButton" class="btn bg-teal" onclick="checkDoaminTypeNameConfirm('1');"><spring:message code="common.modalSave"/></button>
						<button type="button" id="updateButton" class="btn bg-teal" onclick="checkDoaminTypeNameConfirm('2');"><spring:message code="common.modalUpdate"/></button>
						<button type="button" id="domainTypeButton" class="btn bg-teal" onclick="searchList2();"data-toggle="modal" data-target="#modal2" style="display: none;">도메인분류명 리스트</button>
						<button type="button" id="revivalButton" class="btn bg-teal" onclick="revivalConfirm();"><spring:message code="common.wordRevival"/></button>
						<button type="button" id="deleteButton" class="btn btn-danger" onclick="deleteConfirm();"><spring:message code="common.modalDelete"/></button>
						<button type="button" id="cancelButton" class="btn btn-outline" data-dismiss="modal"><spring:message code="common.modalCancel"/></button>
					</div>
			</div>
		</div>
	</div>
	<!-- Modal End -->
	<!-- Modal2 Start -->
	<div id="modal2" class="modal fade" tabindex="-1" style="display: none;" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
					<div class="modal-body">
                                	<table class="modalTable table no-footer dataTable" id="domainTypeTable" style="width: 100%; font-size: 12px;">
					                    <thead>
						                    <tr>
						                        <th width="10%" id="orderId">ID</th>
						                        <th width="25%"><spring:message code="domain.domainName"/></th>
						                        <th width="25%"><spring:message code="domain.domainTypeName"/></th>
						                        <th width="20%"><spring:message code="domain.dataType"/></th>
						                        <th width="10%"><spring:message code="domain.dataLength"/></th>
						                        <th width="10%"><spring:message code="domain.decimalLength"/></th>
						                    </tr>
					                    </thead>
					                </table>
						<div class="form-group row">
							<div class="swal2-icon swal2-warning swal2-animate-warning-icon" style="width: 9%; text-align: center;"></div>
							<h2 class="swal2-title" id="domainTypeNmListTitle" style="width: 100%; text-align: center;">제목1</h2>
							<div id="swal2-content" style="width: 100%; text-align: center;"><spring:message code="domain.registDupConfirmMessage"/></div>
						</div>
					</div>
					<div class="modal-footer" style="text-align: center; display: block;">
						<button type="button" id="saveButton2" class="btn bg-teal" onclick="insertDomain();"><spring:message code="common.modalYes"/></button>
						<button type="button" id="updateButton2" class="btn bg-teal" onclick="updateDomain();"><spring:message code="common.modalYes"/></button>
						<button type="button" id="cancelButton2" class="btn btn-danger" data-dismiss="modal"><spring:message code="common.modalNo"/></button>
					</div>
			</div>
		</div>
	</div>   
	<!-- Modal2 End -->

<!-- /main content -->
